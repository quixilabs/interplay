// Test script to verify enablers and barriers storage
// Run this with: node test-enablers-barriers-storage.js <session_id>

const { createClient } = require('@supabase/supabase-js');

// You'll need to update these with your actual Supabase credentials
const SUPABASE_URL = process.env.SUPABASE_URL || 'your-supabase-url';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'your-supabase-anon-key';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testEnablersBarriersStorage(sessionId) {
    if (!sessionId) {
        console.error('❌ Please provide a session ID as an argument');
        console.log('Usage: node test-enablers-barriers-storage.js <session_id>');
        process.exit(1);
    }

    console.log(`🔍 Testing enablers and barriers storage for session: ${sessionId}`);
    console.log('='.repeat(60));

    try {
        // Test 1: Check if session exists
        const { data: session, error: sessionError } = await supabase
            .from('survey_sessions')
            .select('*')
            .eq('session_id', sessionId)
            .single();

        if (sessionError || !session) {
            console.error('❌ Session not found:', sessionError?.message || 'No session data');
            return;
        }

        console.log('✅ Session found:', {
            university_slug: session.university_slug,
            is_completed: session.is_completed,
            email_for_results: session.email_for_results ? '***@***.***' : 'none'
        });

        // Test 2: Check domain enablers and barriers reference data
        const { data: domains, error: domainsError } = await supabase
            .from('domain_enablers_barriers')
            .select('*')
            .order('domain_key');

        if (domainsError) {
            console.error('❌ Error fetching domain data:', domainsError.message);
            return;
        }

        console.log(`\n📋 Available domains (${domains.length}):`);
        domains.forEach(domain => {
            console.log(`  - ${domain.domain_key}: ${domain.domain_name}`);
        });

        // Test 3: Check user enablers and barriers data
        const { data: userData, error: userError } = await supabase
            .from('user_enablers_barriers')
            .select('*')
            .eq('session_id', sessionId)
            .order('domain_key');

        if (userError) {
            console.error('❌ Error fetching user enablers/barriers:', userError.message);
            return;
        }

        console.log(`\n💾 Stored enablers/barriers (${userData.length}):`);

        if (userData.length === 0) {
            console.log('  ⚠️  No enablers/barriers data found for this session');
        } else {
            userData.forEach(item => {
                console.log(`\n  🔹 ${item.domain_key}:`);
                console.log(`     Enablers: [${item.selected_enablers.join(', ')}]`);
                console.log(`     Barriers: [${item.selected_barriers.join(', ')}]`);
                if (item.enabler_other_text) {
                    console.log(`     Enabler Other: "${item.enabler_other_text}"`);
                }
                if (item.barrier_other_text) {
                    console.log(`     Barrier Other: "${item.barrier_other_text}"`);
                }
                console.log(`     Created: ${item.created_at}`);
                console.log(`     Updated: ${item.updated_at}`);
            });
        }

        // Test 4: Check which domains are missing
        const storedDomains = userData.map(item => item.domain_key);
        const expectedDomains = domains.map(domain => domain.domain_key);
        const missingDomains = expectedDomains.filter(domain => !storedDomains.includes(domain));

        if (missingDomains.length > 0) {
            console.log(`\n⚠️  Missing domains: ${missingDomains.join(', ')}`);
        } else {
            console.log('\n✅ All domains have data stored');
        }

        // Test 5: Use the debug function if available
        try {
            const { data: debugData, error: debugError } = await supabase
                .rpc('debug_enablers_barriers_storage', { p_session_id: sessionId });

            if (!debugError && debugData) {
                console.log(`\n🔧 Debug function results (${debugData.length}):`);
                debugData.forEach(item => {
                    console.log(`  - ${item.domain_key}: E[${item.selected_enablers?.length || 0}] B[${item.selected_barriers?.length || 0}]`);
                });
            }
        } catch (debugErr) {
            console.log('\n💡 Debug function not available (run migration first)');
        }

    } catch (error) {
        console.error('❌ Unexpected error:', error.message);
    }
}

// Run the test
const sessionId = process.argv[2];
testEnablersBarriersStorage(sessionId);
