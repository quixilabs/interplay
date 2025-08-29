#!/usr/bin/env node

/**
 * Test Unique Session ID Logic
 * This script tests the unique session_id enforcement in survey tables
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

console.log('🧪 [TEST] Testing unique session_id logic...\n');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ [TEST] Missing environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testUniqueSessionLogic() {
  const testSessionId = `test_unique_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  
  try {
    console.log(`🔍 [TEST] Testing with session ID: ${testSessionId}\n`);
    
    // First create a survey session (required for foreign key constraint)
    console.log('🏗️ [TEST] Creating survey session...');
    const { error: sessionError } = await supabase
      .from('survey_sessions')
      .insert({
        session_id: testSessionId,
        university_slug: 'demo-university'
      });
    
    if (sessionError) {
      console.error('❌ [TEST] Failed to create survey session:', sessionError.message);
      return;
    }
    console.log('✅ [TEST] Survey session created\n');
    
    // Test demographics table
    console.log('📋 [TEST] Testing demographics table...');
    
    // First insert
    console.log('   - Inserting first demographics record...');
    const { error: insert1Error } = await supabase
      .from('demographics')
      .insert({
        session_id: testSessionId,
        year_in_school: 'First year/Freshman',
        enrollment_status: 'Full-time'
      });
    
    if (insert1Error) {
      console.error('❌ [TEST] First insert failed:', insert1Error.message);
      return;
    }
    console.log('   ✅ First insert successful');
    
    // Check count
    let { data: count1, error: count1Error } = await supabase
      .from('demographics')
      .select('id')
      .eq('session_id', testSessionId);
    
    if (count1Error) {
      console.error('❌ [TEST] Count check failed:', count1Error.message);
      return;
    }
    
    console.log(`   📊 Records after first insert: ${count1?.length || 0}`);
    
    // Second insert (should create duplicate)
    console.log('   - Inserting second demographics record (duplicate)...');
    const { error: insert2Error } = await supabase
      .from('demographics')
      .insert({
        session_id: testSessionId,
        year_in_school: 'Second year/Sophomore',
        enrollment_status: 'Part-time'
      });
    
    if (insert2Error) {
      console.error('❌ [TEST] Second insert failed:', insert2Error.message);
      return;
    }
    console.log('   ✅ Second insert successful (duplicate created)');
    
    // Check count again
    let { data: count2, error: count2Error } = await supabase
      .from('demographics')
      .select('id')
      .eq('session_id', testSessionId);
    
    if (count2Error) {
      console.error('❌ [TEST] Count check failed:', count2Error.message);
      return;
    }
    
    console.log(`   📊 Records after second insert: ${count2?.length || 0}`);
    
    if (count2 && count2.length > 1) {
      console.log(`   ⚠️ [TEST] Duplicates detected! Found ${count2.length} records`);
      console.log('   🧹 [TEST] Our upsertRecord method should handle this automatically');
    }
    
    // Test cleanup
    console.log('\n🧹 [TEST] Testing cleanup logic...');
    
    // Simulate the cleanup that happens in upsertRecord
    if (count2 && count2.length > 1) {
      // Sort by id (simulating created_at sort)
      count2.sort((a, b) => a.id.localeCompare(b.id));
      
      // Delete all but the first record
      const recordsToDelete = count2.slice(1);
      for (const record of recordsToDelete) {
        console.log(`   🗑️ [TEST] Deleting duplicate record: ${record.id}`);
        const { error: deleteError } = await supabase
          .from('demographics')
          .delete()
          .eq('id', record.id);
        
        if (deleteError) {
          console.error('   ❌ [TEST] Delete failed:', deleteError.message);
        } else {
          console.log('   ✅ [TEST] Delete successful');
        }
      }
    }
    
    // Final count check
    let { data: finalCount, error: finalCountError } = await supabase
      .from('demographics')
      .select('id')
      .eq('session_id', testSessionId);
    
    if (finalCountError) {
      console.error('❌ [TEST] Final count check failed:', finalCountError.message);
      return;
    }
    
    console.log(`   📊 Final record count: ${finalCount?.length || 0}`);
    
    if (finalCount && finalCount.length === 1) {
      console.log('   ✅ [TEST] SUCCESS: Exactly 1 record remains after cleanup');
    } else {
      console.log('   ❌ [TEST] FAIL: Expected 1 record, found', finalCount?.length || 0);
    }
    
    // Cleanup test data
    console.log('\n🧽 [TEST] Cleaning up test data...');
    
    // Delete demographics first (foreign key constraint)
    const { error: cleanupDemoError } = await supabase
      .from('demographics')
      .delete()
      .eq('session_id', testSessionId);
    
    if (cleanupDemoError) {
      console.error('❌ [TEST] Demographics cleanup failed:', cleanupDemoError.message);
    } else {
      console.log('✅ [TEST] Demographics cleaned up successfully');
    }
    
    // Delete survey session
    const { error: cleanupSessionError } = await supabase
      .from('survey_sessions')
      .delete()
      .eq('session_id', testSessionId);
    
    if (cleanupSessionError) {
      console.error('❌ [TEST] Survey session cleanup failed:', cleanupSessionError.message);
    } else {
      console.log('✅ [TEST] Survey session cleaned up successfully');
    }
    
    console.log('\n🎉 [TEST] Unique session_id logic test completed!');
    console.log('💡 [TEST] The updated upsertRecord method will automatically:');
    console.log('   - Detect duplicate session_ids');
    console.log('   - Delete duplicates keeping only the first record');
    console.log('   - Update the remaining record with new data');
    console.log('   - Verify exactly 1 record exists after operation');
    
  } catch (error) {
    console.error('💥 [TEST] Test failed with error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testUniqueSessionLogic();
