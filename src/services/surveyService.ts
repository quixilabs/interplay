import { supabase } from '../lib/supabase';
import { debugLog, debugWarn } from '../utils/debug';
import { SurveyState } from '../types/survey';

export class SurveyService {
  // Utility method to clean up duplicate session_ids in all survey tables
  static async cleanupDuplicateSessionIds(sessionId: string): Promise<void> {
    const tablesToClean = [
      'demographics',
      'flourishing_scores', 
      'school_wellbeing',
      'text_responses',
      'tensions_assessment'
    ];
    
    debugLog(`🧹 [DEBUG] Cleaning up potential duplicates for session: ${sessionId}`);
    
    for (const tableName of tablesToClean) {
      try {
        // Find duplicates
        const { data: duplicates, error: findError } = await supabase
          .from(tableName)
          .select('id, created_at')
          .eq('session_id', sessionId);
        
        if (findError) {
          console.error(`❌ [DEBUG] Error finding duplicates in ${tableName}:`, findError);
          continue;
        }
        
        if (duplicates && duplicates.length > 1) {
          debugWarn(`⚠️ [DEBUG] Found ${duplicates.length} duplicate records in ${tableName} for session ${sessionId}`);
          
          // Sort by created_at to keep the earliest record
          duplicates.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
          
          // Delete all but the first (earliest) record
          const recordsToDelete = duplicates.slice(1);
          for (const record of recordsToDelete) {
            debugLog(`🗑️ [DEBUG] Deleting duplicate record from ${tableName} with id: ${record.id}`);
            const { error: deleteError } = await supabase
              .from(tableName)
              .delete()
              .eq('id', record.id);
            
            if (deleteError) {
              console.error(`❌ [DEBUG] Error deleting duplicate from ${tableName}:`, deleteError);
            } else {
              debugLog(`✅ [DEBUG] Successfully deleted duplicate from ${tableName}`);
            }
          }
        } else if (duplicates && duplicates.length === 1) {
          debugLog(`✅ [DEBUG] No duplicates found in ${tableName} for session ${sessionId}`);
        }
        
      } catch (error) {
        console.error(`💥 [DEBUG] Unexpected error cleaning ${tableName}:`, error);
      }
    }
    
    debugLog(`✅ [DEBUG] Finished cleanup for session ${sessionId}`);
  }
  // Helper method to handle upsert operations ensuring unique session_id
  private static async upsertRecord(
    tableName: string,
    data: any,
    matchColumns: string[],
    sessionId: string,
    debugLabel: string
  ): Promise<void> {
    try {
      debugLog(`💾 [DEBUG] ${debugLabel} for session:`, sessionId);
      debugLog(`📋 [DEBUG] ${debugLabel} data:`, JSON.stringify(data, null, 2));
      
      // Build the query to check for existing records - use array query, not single()
      let query = supabase.from(tableName).select('id, session_id');
      matchColumns.forEach(col => {
        if (col === 'session_id') {
          query = query.eq(col, sessionId);
        } else if (data[col] !== undefined) {
          query = query.eq(col, data[col]);
        }
      });
      
      const { data: existingRecords, error: checkError } = await query;
      
      if (checkError) {
        console.error(`❌ [DEBUG] Error checking existing ${debugLabel.toLowerCase()}:`, checkError);
        throw checkError;
      }
      
      debugLog(`🔍 [DEBUG] Found ${existingRecords?.length || 0} existing records for session ${sessionId}`);
      
      let result;
      
      if (existingRecords && existingRecords.length > 0) {
        // Handle duplicates if they exist
        if (existingRecords.length > 1) {
          debugWarn(`⚠️ [DEBUG] Found ${existingRecords.length} duplicate records for session ${sessionId}. Keeping the first one and deleting others.`);
          
          // Delete all but the first record
          const recordsToDelete = existingRecords.slice(1);
          for (const record of recordsToDelete) {
            debugLog(`🗑️ [DEBUG] Deleting duplicate record with id: ${record.id}`);
            const { error: deleteError } = await supabase
              .from(tableName)
              .delete()
              .eq('id', record.id);
            
            if (deleteError) {
              console.error(`❌ [DEBUG] Error deleting duplicate record:`, deleteError);
            } else {
              debugLog(`✅ [DEBUG] Deleted duplicate record successfully`);
            }
          }
        }
        
        // Update the remaining/first record using all match columns
        debugLog(`🔄 [DEBUG] Updating existing ${debugLabel.toLowerCase()} record for session ${sessionId}`);
        
        // Remove session_id from data to avoid updating it
        const updateData = { ...data };
        delete updateData.session_id;
        
        // Build update query with all match columns to ensure we update the right record
        let updateQuery = supabase.from(tableName).update(updateData);
        matchColumns.forEach(col => {
          if (col === 'session_id') {
            updateQuery = updateQuery.eq(col, sessionId);
          } else if (data[col] !== undefined) {
            updateQuery = updateQuery.eq(col, data[col]);
          }
        });
        
        result = await updateQuery;
          
      } else {
        // Insert new record
        debugLog(`➕ [DEBUG] Inserting new ${debugLabel.toLowerCase()} record for session ${sessionId}`);
        result = await supabase.from(tableName).insert(data);
      }

      if (result.error) {
        console.error(`❌ [DEBUG] Error saving ${debugLabel.toLowerCase()}:`, result.error);
        console.error('   Code:', result.error.code);
        console.error('   Message:', result.error.message);
        console.error('   Details:', result.error.details);
        throw result.error;
      }
      
      debugLog(`✅ [DEBUG] ${debugLabel} saved successfully for session ${sessionId}`);
      
      // Final verification - check that we have exactly one record for this specific combination
      let verifyQuery = supabase.from(tableName).select('id');
      matchColumns.forEach(col => {
        if (col === 'session_id') {
          verifyQuery = verifyQuery.eq(col, sessionId);
        } else if (data[col] !== undefined) {
          verifyQuery = verifyQuery.eq(col, data[col]);
        }
      });
      
      const { data: finalCheck, error: finalError } = await verifyQuery;
        
      if (finalError) {
        console.warn(`⚠️ [DEBUG] Could not verify final record count:`, finalError);
      } else if (finalCheck && finalCheck.length > 1) {
        console.error(`❌ [DEBUG] CRITICAL: Still have ${finalCheck.length} records after upsert!`);
      } else if (finalCheck && finalCheck.length === 1) {
        debugLog(`✅ [DEBUG] Verified: Exactly 1 record exists for the match criteria`);
      } else {
        console.warn(`⚠️ [DEBUG] Warning: No records found after upsert`);
      }
      
    } catch (error) {
      console.error(`💥 [DEBUG] Failed to save ${debugLabel.toLowerCase()}:`, error);
      throw error;
    }
  }
  // Initialize survey session in database
  static async initializeSurvey(sessionId: string, universitySlug: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('survey_sessions')
        .upsert({
          session_id: sessionId,
          university_slug: universitySlug,
          start_time: new Date().toISOString(),
          is_completed: false
        }, {
          onConflict: 'session_id'
        });

      if (error) {
        console.error('Error initializing survey:', error);
        throw error;
      }
    } catch (error) {
      console.error('Failed to initialize survey:', error);
      throw error;
    }
  }

  // Save demographics data
  static async saveDemographics(sessionId: string, demographics: any): Promise<void> {
    const demographicsData = {
      session_id: sessionId,
      year_in_school: demographics.yearInSchool,
      enrollment_status: demographics.enrollmentStatus,
      age_range: demographics.ageRange,
      gender_identity: demographics.genderIdentity,
      gender_self_describe: demographics.genderSelfDescribe,
      race_ethnicity: demographics.raceEthnicity || [],
      is_international: demographics.isInternational,
      employment_status: demographics.employmentStatus,
      has_caregiving_responsibilities: demographics.hasCaregavingResponsibilities,
      in_greek_organization: demographics.inGreekOrganization,
      study_mode: demographics.studyMode,
      transfer_student: demographics.transferStudent
    };

    await this.upsertRecord('demographics', demographicsData, ['session_id'], sessionId, 'Demographics');
  }

  // Save flourishing scores
  static async saveFlourishingScores(sessionId: string, scores: any): Promise<void> {
    const scoresData = {
      session_id: sessionId,
      happiness_satisfaction_1: scores.happiness_satisfaction_1,
      happiness_satisfaction_2: scores.happiness_satisfaction_2,
      mental_physical_health_1: scores.mental_physical_health_1,
      mental_physical_health_2: scores.mental_physical_health_2,
      meaning_purpose_1: scores.meaning_purpose_1,
      meaning_purpose_2: scores.meaning_purpose_2,
      character_virtue_1: scores.character_virtue_1,
      character_virtue_2: scores.character_virtue_2,
      social_relationships_1: scores.social_relationships_1,
      social_relationships_2: scores.social_relationships_2,
      financial_stability_1: scores.financial_stability_1,
      financial_stability_2: scores.financial_stability_2
    };

    await this.upsertRecord('flourishing_scores', scoresData, ['session_id'], sessionId, 'Flourishing Scores');
  }

  // Save school wellbeing data
  static async saveSchoolWellbeing(sessionId: string, wellbeing: any): Promise<void> {
    const wellbeingData = {
      session_id: sessionId,
      belonging_score: wellbeing.belonging_score,
      enjoy_school_days: wellbeing.enjoy_school_days,
      physical_activity: wellbeing.physical_activity,
      feel_safe: wellbeing.feel_safe,
      work_connected_goals: wellbeing.work_connected_goals,
      contribute_bigger_purpose: wellbeing.contribute_bigger_purpose,
      kind_to_others: wellbeing.kind_to_others,
      manage_emotions: wellbeing.manage_emotions,
      trusted_adult: wellbeing.trusted_adult,
      supportive_friends: wellbeing.supportive_friends,
      resources_participation: wellbeing.resources_participation,
      wellbeing_checklist: wellbeing.wellbeingChecklist || []
    };

    await this.upsertRecord('school_wellbeing', wellbeingData, ['session_id'], sessionId, 'School Wellbeing');
  }

  // Save enablers and barriers data
  static async saveEnablersBarriers(sessionId: string, enablersBarriers: any[]): Promise<void> {
    debugLog(`🔄 [DEBUG] Starting saveEnablersBarriers for session: ${sessionId}`, enablersBarriers);
    
    for (const item of enablersBarriers) {
      const enablersBarriersData = {
        session_id: sessionId,
        domain_key: item.domainKey,
        selected_enablers: item.selectedEnablers || [],
        selected_barriers: item.selectedBarriers || [],
        enabler_other_text: item.enablerOtherText || null,
        barrier_other_text: item.barrierOtherText || null
      };

      debugLog(`💿 [DEBUG] Saving data for domain: ${item.domainKey}`, enablersBarriersData);
      debugLog(`🔑 [DEBUG] Match columns: session_id=${sessionId}, domain_key=${item.domainKey}`);

      // Enablers and barriers can have multiple entries per session (one per domain), so we match on both session_id and domain_key
      await this.upsertRecord('user_enablers_barriers', enablersBarriersData, ['session_id', 'domain_key'], sessionId, `Enablers Barriers for ${item.domainKey}`);
    }
    
    debugLog(`✅ [DEBUG] Completed saveEnablersBarriers for session: ${sessionId}`);
  }

  // Get domain enablers and barriers reference data
  static async getDomainEnablersBarriers(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('domain_enablers_barriers')
        .select('*')
        .order('domain_key');

      if (error) {
        console.error('Error fetching domain enablers and barriers:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch domain enablers and barriers:', error);
      throw error;
    }
  }

  // Save text responses
  static async saveTextResponses(sessionId: string, textResponses: any): Promise<void> {
    const textResponsesData = {
      session_id: sessionId,
      fastest_win_suggestion: textResponses.fastestWinSuggestion
    };

    await this.upsertRecord('text_responses', textResponsesData, ['session_id'], sessionId, 'Text Responses');
  }

  // Save tensions assessment
  static async saveTensionsAssessment(sessionId: string, tensions: any): Promise<void> {
    const tensionsData = {
      session_id: sessionId,
      performance_wellbeing: tensions.performance_wellbeing,
      ambition_contribution: tensions.ambition_contribution,
      selfreliance_connection: tensions.selfreliance_connection,
      stability_growth: tensions.stability_growth,
      academic_creative: tensions.academic_creative
    };

    await this.upsertRecord('tensions_assessment', tensionsData, ['session_id'], sessionId, 'Tensions Assessment');
  }

  // Complete survey
  static async completeSurvey(sessionId: string, emailForResults?: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('survey_sessions')
        .update({
          is_completed: true,
          completion_time: new Date().toISOString(),
          email_for_results: emailForResults || null
        })
        .eq('session_id', sessionId);

      if (error) {
        console.error('Error completing survey:', error);
        throw error;
      }
    } catch (error) {
      console.error('Failed to complete survey:', error);
      throw error;
    }
  }

  // Save all survey data at once (backup method)
  static async saveSurveyData(surveyState: SurveyState): Promise<void> {
    try {
      // Save each section of data
      if (Object.keys(surveyState.demographics).length > 0) {
        await this.saveDemographics(surveyState.sessionId, surveyState.demographics);
      }

      if (Object.keys(surveyState.flourishingScores).length > 0) {
        await this.saveFlourishingScores(surveyState.sessionId, surveyState.flourishingScores);
      }

      if (Object.keys(surveyState.schoolWellbeing).length > 0) {
        await this.saveSchoolWellbeing(surveyState.sessionId, surveyState.schoolWellbeing);
      }

      if (surveyState.enablersBarriers.length > 0) {
        await this.saveEnablersBarriers(surveyState.sessionId, surveyState.enablersBarriers);
      }

      if (Object.keys(surveyState.textResponses).length > 0) {
        await this.saveTextResponses(surveyState.sessionId, surveyState.textResponses);
      }

      if (Object.keys(surveyState.tensionsAssessment).length > 0) {
        await this.saveTensionsAssessment(surveyState.sessionId, surveyState.tensionsAssessment);
      }

      debugLog('Survey data saved successfully');
    } catch (error) {
      console.error('Failed to save survey data:', error);
      throw error;
    }
  }
}