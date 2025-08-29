#!/usr/bin/env node

/**
 * Database Connection Debug Script
 * This script tests your Supabase connection and university queries from the terminal
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load both .env and .env.local files
dotenv.config({ path: join(__dirname, '.env') });
dotenv.config({ path: join(__dirname, '.env.local') });

console.log('🚀 [TERMINAL DEBUG] Starting database connection test...\n');

// Configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 [TERMINAL DEBUG] Configuration Check:');
console.log(`   - VITE_SUPABASE_URL: ${supabaseUrl || 'NOT SET'}`);
console.log(`   - VITE_SUPABASE_ANON_KEY: ${supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'NOT SET'}\n`);

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ [TERMINAL DEBUG] Missing environment variables!');
    console.error('   Please check your .env or .env.local files\n');
    process.exit(1);
}

// Create Supabase client
console.log('🔌 [TERMINAL DEBUG] Creating Supabase client...');
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDatabaseConnection() {
    try {
        console.log('\n📡 [TERMINAL DEBUG] Testing basic database connectivity...');

        // Test 1: Basic connection
        const { data: healthCheck, error: healthError } = await supabase
            .from('universities')
            .select('count', { count: 'exact', head: true });

        if (healthError) {
            console.error('❌ [TERMINAL DEBUG] Database connection failed:');
            console.error(`   Error: ${healthError.message}`);
            console.error(`   Code: ${healthError.code}`);
            console.error(`   Details: ${healthError.details}`);
            return false;
        }

        console.log('✅ [TERMINAL DEBUG] Database connection successful!');
        console.log(`   Universities table accessible\n`);

        // Test 2: List all universities
        console.log('📋 [TERMINAL DEBUG] Fetching all universities...');
        const { data: universities, error: listError } = await supabase
            .from('universities')
            .select('*')
            .order('name');

        if (listError) {
            console.error('❌ [TERMINAL DEBUG] Failed to fetch universities:');
            console.error(`   Error: ${listError.message}`);
            return false;
        }

        if (!universities || universities.length === 0) {
            console.log('⚠️  [TERMINAL DEBUG] No universities found in database!');
            console.log('   This might be why you\'re getting "university not found" errors\n');
            return true;
        }

        console.log(`✅ [TERMINAL DEBUG] Found ${universities.length} universities:`);
        universities.forEach((uni, index) => {
            console.log(`   ${index + 1}. ${uni.name}`);
            console.log(`      - Slug: "${uni.slug}"`);
            console.log(`      - Admin Email: ${uni.admin_email}`);
            console.log(`      - Survey Active: ${uni.survey_active ? '✅ Yes' : '❌ No'}`);
            console.log(`      - Created: ${uni.created_at}`);
            console.log('');
        });

        return true;
    } catch (error) {
        console.error('❌ [TERMINAL DEBUG] Unexpected error during connection test:');
        console.error(`   ${error.message}`);
        console.error(`   Stack: ${error.stack}`);
        return false;
    }
}

async function testSpecificUniversity(slug) {
    try {
        console.log(`🔍 [TERMINAL DEBUG] Testing specific university lookup: "${slug}"`);

        const { data, error } = await supabase
            .from('universities')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                console.log(`❌ [TERMINAL DEBUG] University with slug "${slug}" not found`);
                console.log('   This is likely the cause of your "university not found" error\n');
            } else {
                console.error(`❌ [TERMINAL DEBUG] Database error for slug "${slug}":`);
                console.error(`   Error: ${error.message}`);
                console.error(`   Code: ${error.code}\n`);
            }
            return null;
        }

        console.log(`✅ [TERMINAL DEBUG] Found university: ${data.name}`);
        console.log(`   - ID: ${data.id}`);
        console.log(`   - Slug: ${data.slug}`);
        console.log(`   - Survey Active: ${data.survey_active ? '✅ Yes' : '❌ No'}`);
        console.log('');

        return data;
    } catch (error) {
        console.error(`❌ [TERMINAL DEBUG] Unexpected error testing slug "${slug}":`);
        console.error(`   ${error.message}\n`);
        return null;
    }
}

async function main() {
    console.log('='.repeat(60));
    console.log('🏛️  SUPABASE DATABASE CONNECTION DEBUG');
    console.log('='.repeat(60));

    const connectionSuccess = await testDatabaseConnection();

    if (!connectionSuccess) {
        console.log('🛑 [TERMINAL DEBUG] Connection test failed. Cannot proceed with university tests.\n');
        process.exit(1);
    }

    console.log('🧪 [TERMINAL DEBUG] Testing common university slugs...\n');

    // Test common slugs that might be causing issues
    const testSlugs = [
        'demo-university',
        'saint-louis-university',
        'university-demo',  // Alternative format
        'slu',              // Short form
        'demo'              // Short form
    ];

    for (const slug of testSlugs) {
        await testSpecificUniversity(slug);
    }

    console.log('='.repeat(60));
    console.log('🏁 [TERMINAL DEBUG] Database connection test completed!');
    console.log('='.repeat(60));
    console.log('\n💡 Next steps:');
    console.log('   1. Check the university list above');
    console.log('   2. Use the exact slug from the database in your URLs');
    console.log('   3. If no universities exist, you need to add them to your database');
    console.log('   4. If survey_active is false, enable it for the university\n');
}

// Run the debug script
main().catch(error => {
    console.error('💥 [TERMINAL DEBUG] Script failed:', error);
    process.exit(1);
});
