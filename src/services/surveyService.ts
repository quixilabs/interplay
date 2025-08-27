import { supabase } from '../lib/supabase';
import { SurveyState } from '../types/survey';

export class SurveyService {
  // Initialize survey session in database
  static async initializeSurvey(sessionId: string, universitySlug: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('survey_sessions')
        .insert({
          session_id: sessionId,
          university_slug: universitySlug,
          start_time: new Date().toISOString(),
          is_completed: false
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
    try {
      const { error } = await supabase
        .from('demographics')
        .upsert({
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
          in_greek_organization: demographics.inGreekOrganization
        }, {
          onConflict: 'session_id'
        });

      if (error) {
        console.error('Error saving demographics:', error);
        throw error;
      }
    } catch (error) {
      console.error('Failed to save demographics:', error);
      throw error;
    }
  }

  // Save flourishing scores
  static async saveFlourishingScores(sessionId: string, scores: any): Promise<void> {
    try {
      const { error } = await supabase
        .from('flourishing_scores')
        .upsert({
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
        }, {
          onConflict: 'session_id'
        });

      if (error) {
        console.error('Error saving flourishing scores:', error);
        throw error;
      }
    } catch (error) {
      console.error('Failed to save flourishing scores:', error);
      throw error;
    }
  }

  // Save school wellbeing data
  static async saveSchoolWellbeing(sessionId: string, wellbeing: any): Promise<void> {
    try {
      const { error } = await supabase
        .from('school_wellbeing')
        .upsert({
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
        }, {
          onConflict: 'session_id'
        });

      if (error) {
        console.error('Error saving school wellbeing:', error);
        throw error;
      }
    } catch (error) {
      console.error('Failed to save school wellbeing:', error);
      throw error;
    }
  }

  // Save growth module data
  static async saveGrowthModule(sessionId: string, growthModule: any): Promise<void> {
    try {
      const { error } = await supabase
        .from('growth_modules')
        .upsert({
          session_id: sessionId,
          domain_name: growthModule.domainName,
          enabler_selections: growthModule.enablerSelections || [],
          barrier_selection: growthModule.barrierSelection,
          additional_comments: growthModule.additionalComments
        }, {
          onConflict: 'session_id,domain_name'
        });

      if (error) {
        console.error('Error saving growth module:', error);
        throw error;
      }
    } catch (error) {
      console.error('Failed to save growth module:', error);
      throw error;
    }
  }

  // Save text responses
  static async saveTextResponses(sessionId: string, textResponses: any): Promise<void> {
    try {
      const { error } = await supabase
        .from('text_responses')
        .upsert({
          session_id: sessionId,
          bright_spots: textResponses.brightSpots || {},
          fastest_win_suggestion: textResponses.fastestWinSuggestion
        }, {
          onConflict: 'session_id'
        });

      if (error) {
        console.error('Error saving text responses:', error);
        throw error;
      }
    } catch (error) {
      console.error('Failed to save text responses:', error);
      throw error;
    }
  }

  // Save tensions assessment
  static async saveTensionsAssessment(sessionId: string, tensions: any): Promise<void> {
    try {
      const { error } = await supabase
        .from('tensions_assessment')
        .upsert({
          session_id: sessionId,
          performance_wellbeing: tensions.performance_wellbeing,
          ambition_contribution: tensions.ambition_contribution,
          selfreliance_connection: tensions.selfreliance_connection,
          stability_growth: tensions.stability_growth,
          academic_creative: tensions.academic_creative
        }, {
          onConflict: 'session_id'
        });

      if (error) {
        console.error('Error saving tensions assessment:', error);
        throw error;
      }
    } catch (error) {
      console.error('Failed to save tensions assessment:', error);
      throw error;
    }
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

      if (surveyState.growthModules.length > 0) {
        for (const module of surveyState.growthModules) {
          await this.saveGrowthModule(surveyState.sessionId, module);
        }
      }

      if (Object.keys(surveyState.textResponses).length > 0) {
        await this.saveTextResponses(surveyState.sessionId, surveyState.textResponses);
      }

      if (Object.keys(surveyState.tensionsAssessment).length > 0) {
        await this.saveTensionsAssessment(surveyState.sessionId, surveyState.tensionsAssessment);
      }

      console.log('Survey data saved successfully');
    } catch (error) {
      console.error('Failed to save survey data:', error);
      throw error;
    }
  }
}