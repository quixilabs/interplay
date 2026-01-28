#!/usr/bin/env node

/**
 * Script to apply the migration that removes bright_spots column from text_responses table
 * 
 * This script:
 * 1. Connects to the local Supabase instance
 * 2. Removes the bright_spots column from text_responses table
 * 3. Confirms the migration was successful
 */

const { createClient } = require('@supabase/supabase-js');

// Local Supabase configuration
const supabaseUrl = 'http://localhost:54321';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

async function applyMigration() {
    console.log('🚀 Starting migration to remove bright_spots column...');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    try {
        // Step 1: Check if the column exists
        console.log('📋 Checking if bright_spots column exists...');

        const { data: columnCheck, error: columnError } = await supabase
            .from('information_schema.columns')
            .select('column_name')
            .eq('table_name', 'text_responses')
            .eq('column_name', 'bright_spots');

        if (columnError) {
            throw columnError;
        }

        if (!columnCheck || columnCheck.length === 0) {
            console.log('✅ bright_spots column does not exist. Migration not needed.');
            return;
        }

        console.log('📝 bright_spots column exists. Proceeding with removal...');

        // Step 2: Remove the column
        console.log('🗑️  Removing bright_spots column from text_responses table...');

        const { error: dropError } = await supabase.rpc('exec_sql', {
            sql: 'ALTER TABLE text_responses DROP COLUMN IF EXISTS bright_spots;'
        });

        if (dropError) {
            throw dropError;
        }

        console.log('✅ Successfully removed bright_spots column!');

        // Step 3: Verify the column was removed
        console.log('🔍 Verifying column removal...');

        const { data: verifyCheck, error: verifyError } = await supabase
            .from('information_schema.columns')
            .select('column_name')
            .eq('table_name', 'text_responses')
            .eq('column_name', 'bright_spots');

        if (verifyError) {
            throw verifyError;
        }

        if (!verifyCheck || verifyCheck.length === 0) {
            console.log('✅ Verification successful: bright_spots column has been removed.');
        } else {
            console.log('⚠️  Warning: bright_spots column still exists after removal attempt.');
        }

        console.log('🎉 Migration completed successfully!');

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    }
}

// Run the migration
applyMigration();
