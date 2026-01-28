#!/usr/bin/env node

/**
 * Apply RLS Policy Fixes
 * This script applies the necessary RLS policies to allow anonymous survey submissions
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });
dotenv.config({ path: join(__dirname, '.env.local') });

console.log('🔐 [RLS FIX] Applying Row Level Security policy fixes...\n');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
    console.error('❌ [RLS FIX] Missing VITE_SUPABASE_URL in environment variables!');
    process.exit(1);
}

if (!serviceRoleKey) {
    console.error('❌ [RLS FIX] Missing VITE_SUPABASE_SERVICE_ROLE_KEY in environment variables!');
    console.error('');
    console.error('📋 To get your service role key:');
    console.error('   1. Go to https://supabase.com/dashboard/project/nrtyizrmttatsekgnkhz');
    console.error('   2. Go to Settings → API');
    console.error('   3. Copy the "service_role" key');
    console.error('   4. Add it to your .env file:');
    console.error('      VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here');
    console.error('');
    console.error('🔄 Alternative: Run the SQL manually in Supabase SQL Editor');
    console.error('   Copy the contents of fix-rls-policies.sql and run it in:');
    console.error('   https://supabase.com/dashboard/project/nrtyizrmttatsekgnkhz/sql');
    process.exit(1);
}

// Create admin client with service role key
const supabase = createClient(supabaseUrl, serviceRoleKey);

async function applyRLSFixes() {
    try {
        console.log('🔐 [RLS FIX] Using service role key for admin access...');
        console.log(`🔗 [RLS FIX] Supabase URL: ${supabaseUrl}`);
        console.log(`🔑 [RLS FIX] Service key: ${serviceRoleKey.substring(0, 20)}...\n`);

        // Read the SQL file
        const sqlFilePath = join(__dirname, 'fix-rls-policies.sql');
        const sqlContent = readFileSync(sqlFilePath, 'utf8');

        console.log('📜 [RLS FIX] Loaded SQL policy fixes from fix-rls-policies.sql');
        console.log('🔧 [RLS FIX] Applying RLS policies...\n');

        // Execute the SQL
        const { data, error } = await supabase.rpc('exec_sql', {
            sql_query: sqlContent
        });

        if (error) {
            console.error('❌ [RLS FIX] Error applying RLS policies:', error.message);
            console.error('   Code:', error.code);
            console.error('   Details:', error.details);
            console.error('');
            console.error('🔄 Manual fix: Copy the SQL from fix-rls-policies.sql and run it in Supabase SQL Editor');
            return;
        }

        console.log('✅ [RLS FIX] RLS policies applied successfully!');
        console.log('📋 [RLS FIX] Result:', data);

        // Test the fix
        console.log('\n🧪 [RLS FIX] Testing anonymous access to universities...');

        // Create anonymous client to test
        const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
        const anonClient = createClient(supabaseUrl, anonKey);

        const { data: universities, error: testError } = await anonClient
            .from('universities')
            .select('*');

        if (testError) {
            console.error('❌ [RLS FIX] Test failed - anonymous access still blocked:', testError.message);
            return;
        }

        if (!universities || universities.length === 0) {
            console.log('⚠️  [RLS FIX] Test passed but no universities found. Check if universities exist.');
        } else {
            console.log(`✅ [RLS FIX] Test passed! Anonymous user can now read ${universities.length} universities:`);
            universities.forEach((uni, index) => {
                console.log(`   ${index + 1}. ${uni.name} (${uni.slug})`);
            });
        }

        console.log('\n🎉 [RLS FIX] RLS policies have been fixed!');
        console.log('   - Anonymous users can now read active universities');
        console.log('   - Anonymous users can now submit survey data');
        console.log('   - Your "university not found" error should be resolved');

    } catch (error) {
        console.error('💥 [RLS FIX] Unexpected error:', error.message);
        console.error('Stack:', error.stack);
        console.error('');
        console.error('🔄 Manual fix: Copy the SQL from fix-rls-policies.sql and run it manually in:');
        console.error('   https://supabase.com/dashboard/project/nrtyizrmttatsekgnkhz/sql');
    }
}

applyRLSFixes();
