#!/usr/bin/env node

/**
 * Fix University IDs in Survey Sessions
 * This script updates the survey_sessions table to fill in missing university_id values
 * based on the university_slug field
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });
dotenv.config({ path: join(__dirname, '.env.local') });

console.log('🔧 [FIX] Fixing missing university_ids in survey_sessions table...\n');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
    console.error('❌ [FIX] Missing VITE_SUPABASE_URL in environment variables!');
    process.exit(1);
}

if (!serviceRoleKey) {
    console.error('❌ [FIX] Missing VITE_SUPABASE_SERVICE_ROLE_KEY in environment variables!');
    console.error('');
    console.error('📋 To get your service role key:');
    console.error('   1. Go to your Supabase project dashboard');
    console.error('   2. Go to Settings → API');
    console.error('   3. Copy the "service_role" key');
    console.error('   4. Add it to your .env file:');
    console.error('      VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here');
    process.exit(1);
}

// Create admin client with service role key
const supabase = createClient(supabaseUrl, serviceRoleKey);

async function fixUniversityIds() {
    try {
        console.log('🔐 [FIX] Using service role key for admin access...');
        console.log(`🔗 [FIX] Supabase URL: ${supabaseUrl}`);
        console.log(`🔑 [FIX] Service key: ${serviceRoleKey.substring(0, 20)}...\n`);

        // Step 1: Get all universities to create a slug-to-id mapping
        console.log('📋 [FIX] Fetching all universities...');
        const { data: universities, error: universitiesError } = await supabase
            .from('universities')
            .select('id, slug, name');

        if (universitiesError) {
            console.error('❌ [FIX] Error fetching universities:', universitiesError.message);
            return;
        }

        if (!universities || universities.length === 0) {
            console.log('⚠️  [FIX] No universities found in database!');
            return;
        }

        console.log(`✅ [FIX] Found ${universities.length} universities:`);
        const slugToIdMap = new Map();
        universities.forEach(uni => {
            console.log(`   - ${uni.name} (${uni.slug}) → ${uni.id}`);
            slugToIdMap.set(uni.slug, uni.id);
        });

        // Step 2: Get all survey sessions with null university_id
        console.log('\n🔍 [FIX] Checking survey sessions with missing university_id...');
        const { data: sessionsToFix, error: sessionsError } = await supabase
            .from('survey_sessions')
            .select('id, session_id, university_slug, university_id')
            .is('university_id', null);

        if (sessionsError) {
            console.error('❌ [FIX] Error fetching survey sessions:', sessionsError.message);
            return;
        }

        if (!sessionsToFix || sessionsToFix.length === 0) {
            console.log('✅ [FIX] No survey sessions need fixing - all have university_id set!');
            return;
        }

        console.log(`📊 [FIX] Found ${sessionsToFix.length} survey sessions with missing university_id:`);

        // Group by university_slug for batch processing
        const sessionsBySlug = new Map();
        sessionsToFix.forEach(session => {
            if (!sessionsBySlug.has(session.university_slug)) {
                sessionsBySlug.set(session.university_slug, []);
            }
            sessionsBySlug.get(session.university_slug).push(session);
        });

        console.log(`🏛️  [FIX] Sessions grouped by ${sessionsBySlug.size} university slugs:`);
        sessionsBySlug.forEach((sessions, slug) => {
            console.log(`   - ${slug}: ${sessions.length} sessions`);
        });

        // Step 3: Update each group of sessions
        let totalUpdated = 0;
        let totalErrors = 0;

        for (const [universitySlug, sessions] of sessionsBySlug) {
            const universityId = slugToIdMap.get(universitySlug);
            
            if (!universityId) {
                console.error(`❌ [FIX] No university found for slug: ${universitySlug}`);
                console.error(`   Affected sessions: ${sessions.length}`);
                totalErrors += sessions.length;
                continue;
            }

            console.log(`\n🔄 [FIX] Updating ${sessions.length} sessions for ${universitySlug}...`);
            console.log(`   Setting university_id to: ${universityId}`);

            // Update all sessions for this university in one query
            const sessionIds = sessions.map(s => s.id);
            
            const { data: updateResult, error: updateError } = await supabase
                .from('survey_sessions')
                .update({ university_id: universityId })
                .in('id', sessionIds)
                .select('id');

            if (updateError) {
                console.error(`❌ [FIX] Error updating sessions for ${universitySlug}:`, updateError.message);
                totalErrors += sessions.length;
            } else {
                const updatedCount = updateResult?.length || 0;
                console.log(`✅ [FIX] Successfully updated ${updatedCount} sessions for ${universitySlug}`);
                totalUpdated += updatedCount;
            }
        }

        // Step 4: Verification
        console.log('\n🔍 [FIX] Verifying fixes...');
        const { data: remainingNulls, error: verifyError } = await supabase
            .from('survey_sessions')
            .select('id, university_slug')
            .is('university_id', null);

        if (verifyError) {
            console.error('❌ [FIX] Error during verification:', verifyError.message);
        } else {
            const remainingCount = remainingNulls?.length || 0;
            console.log(`📊 [FIX] Verification results:`);
            console.log(`   - Sessions updated: ${totalUpdated}`);
            console.log(`   - Sessions with errors: ${totalErrors}`);
            console.log(`   - Sessions still with null university_id: ${remainingCount}`);

            if (remainingCount > 0) {
                console.log('\n⚠️  [FIX] Remaining sessions with null university_id:');
                remainingNulls?.forEach(session => {
                    console.log(`   - Session ${session.id}: university_slug = "${session.university_slug}"`);
                });
            }
        }

        console.log('\n🎉 [FIX] University ID fix process completed!');
        
        if (totalUpdated > 0) {
            console.log(`✅ [FIX] Successfully fixed ${totalUpdated} survey sessions`);
        }
        
        if (totalErrors > 0) {
            console.log(`⚠️  [FIX] ${totalErrors} sessions could not be updated (missing university records)`);
        }

    } catch (error) {
        console.error('💥 [FIX] Unexpected error:', error.message);
        console.error('Stack:', error.stack);
    }
}

// Run the fix
fixUniversityIds();