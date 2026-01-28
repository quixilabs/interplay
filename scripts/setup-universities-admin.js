#!/usr/bin/env node

/**
 * Setup Universities with Service Role
 * This script uses service role key to bypass RLS and add universities
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

console.log('🏛️ [ADMIN SETUP] Setting up universities with admin privileges...\n');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error('❌ [ADMIN SETUP] Missing VITE_SUPABASE_URL in environment variables!');
  process.exit(1);
}

if (!serviceRoleKey) {
  console.error('❌ [ADMIN SETUP] Missing VITE_SUPABASE_SERVICE_ROLE_KEY in environment variables!');
  console.error('');
  console.error('📋 To get your service role key:');
  console.error('   1. Go to https://supabase.com/dashboard/project/nrtyizrmttatsekgnkhz');
  console.error('   2. Go to Settings → API');
  console.error('   3. Copy the "service_role" key');
  console.error('   4. Add it to your .env file:');
  console.error('      VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here');
  console.error('');
  process.exit(1);
}

// Create admin client with service role key
const supabase = createClient(supabaseUrl, serviceRoleKey);

const demoUniversities = [
  {
    name: 'Demo University',
    slug: 'demo-university',
    admin_email: 'admin@university.edu',
    survey_active: true
  },
  {
    name: 'Saint Louis University',
    slug: 'saint-louis-university', 
    admin_email: 'admin@slu.edu',
    survey_active: true
  }
];

async function setupUniversitiesAsAdmin() {
  try {
    console.log('🔐 [ADMIN SETUP] Using service role key for admin access...');
    console.log(`🔗 [ADMIN SETUP] Supabase URL: ${supabaseUrl}`);
    console.log(`🔑 [ADMIN SETUP] Service key: ${serviceRoleKey.substring(0, 20)}...\n`);
    
    console.log('🔍 [ADMIN SETUP] Checking existing universities...');
    
    const { data: existing, error: checkError } = await supabase
      .from('universities')
      .select('slug');
    
    if (checkError) {
      console.error('❌ [ADMIN SETUP] Error checking existing universities:', checkError.message);
      console.error('   This might indicate a database connection issue or table doesn\'t exist.');
      return;
    }
    
    const existingSlugs = existing?.map(u => u.slug) || [];
    console.log(`📋 [ADMIN SETUP] Found ${existingSlugs.length} existing universities: [${existingSlugs.join(', ')}]\n`);
    
    for (const university of demoUniversities) {
      if (existingSlugs.includes(university.slug)) {
        console.log(`⏭️  [ADMIN SETUP] University "${university.name}" (${university.slug}) already exists, skipping...`);
        continue;
      }
      
      console.log(`➕ [ADMIN SETUP] Adding university: ${university.name}`);
      console.log(`   - Slug: ${university.slug}`);
      console.log(`   - Admin Email: ${university.admin_email}`);
      console.log(`   - Survey Active: ${university.survey_active}`);
      
      const { data, error } = await supabase
        .from('universities')
        .insert(university)
        .select()
        .single();
      
      if (error) {
        console.error(`❌ [ADMIN SETUP] Failed to add ${university.name}:`, error.message);
        console.error(`   Code: ${error.code}`);
        console.error(`   Details: ${error.details}\n`);
      } else {
        console.log(`✅ [ADMIN SETUP] Successfully added ${university.name}!`);
        console.log(`   - ID: ${data.id}`);
        console.log(`   - Created: ${data.created_at}\n`);
      }
    }
    
    // Final verification
    console.log('🔍 [ADMIN SETUP] Final verification - listing all universities...');
    const { data: finalList, error: finalError } = await supabase
      .from('universities')
      .select('*')
      .order('name');
    
    if (finalError) {
      console.error('❌ [ADMIN SETUP] Error during final verification:', finalError.message);
      return;
    }
    
    if (!finalList || finalList.length === 0) {
      console.log('⚠️  [ADMIN SETUP] No universities found after setup!');
      return;
    }
    
    console.log(`✅ [ADMIN SETUP] Setup complete! Found ${finalList.length} universities:`);
    finalList.forEach((uni, index) => {
      console.log(`   ${index + 1}. ${uni.name}`);
      console.log(`      - Slug: "${uni.slug}"`);
      console.log(`      - Survey URL: /survey/${uni.slug}`);
      console.log(`      - Admin Email: ${uni.admin_email}`);
      console.log(`      - Active: ${uni.survey_active ? '✅ Yes' : '❌ No'}`);
      console.log('');
    });
    
    console.log('🎉 [ADMIN SETUP] You can now test these URLs:');
    finalList.forEach(uni => {
      console.log(`   - http://localhost:5173/survey/${uni.slug}`);
    });
    
  } catch (error) {
    console.error('💥 [ADMIN SETUP] Unexpected error:', error.message);
    console.error('Stack:', error.stack);
  }
}

setupUniversitiesAsAdmin();
