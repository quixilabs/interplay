import { useState } from 'react';
import { useSurvey } from '../../../contexts/SurveyContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const YEAR_OPTIONS = [
  'First year/Freshman',
  'Second year/Sophomore',
  'Third year/Junior',
  'Fourth year/Senior',
  'Graduate student',
  'Other'
];

const ENROLLMENT_OPTIONS = [
  'Full-time',
  'Part-time'
];

const AGE_OPTIONS = [
  '18-19',
  '20-21',
  '22-24',
  '25 or older',
  'Prefer not to say'
];

const GENDER_OPTIONS = [
  'Woman',
  'Man',
  'Non-binary',
  'Self-describe',
  'Prefer not to say'
];

const RACE_ETHNICITY_OPTIONS = [
  'American Indian or Alaska Native',
  'Asian',
  'Black or African American',
  'Hispanic or Latino/a/x',
  'Native Hawaiian or Other Pacific Islander',
  'White',
  'Prefer not to say'
];

const INTERNATIONAL_OPTIONS = [
  'Yes, international student',
  'No, domestic student',
  'Prefer not to say'
];

const EMPLOYMENT_OPTIONS = [
  'Not employed',
  'Part-time (less than 20 hours/week)',
  'Part-time (20+ hours/week)',
  'Full-time',
  'Prefer not to say'
];

const CAREGIVING_OPTIONS = [
  'Yes',
  'No',
  'Prefer not to say'
];

const GREEK_OPTIONS = [
  'Yes, currently active',
  'No',
  'Prefer not to say'
];

const STUDY_MODE_OPTIONS = [
  'Entirely in-person',
  'Entirely online',
  'Hybrid (a mix of in-person and online)'
];

const TRANSFER_STUDENT_OPTIONS = [
  'No, I started at this university as a first-time freshman',
  'Yes, I transferred this year',
  'Yes, I transferred last year',
  'Yes, I transferred two or more years ago'
];

export default function DemographicsSection() {
  const { state, dispatch } = useSurvey();
  const [formData, setFormData] = useState(state.demographics);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    dispatch({ type: 'SET_DEMOGRAPHICS', payload: formData });
    dispatch({ type: 'SET_SECTION', payload: 3 }); // Go to Flourishing Intro
  };

  const handleBack = () => {
    dispatch({ type: 'SET_SECTION', payload: 1 }); // Go back to Demographics Intro
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">About You</h2>
        <p className="text-slate-600">
          These questions help us understand different student experiences and ensure all voices are represented.
        </p>
      </div>

      <div className="space-y-8">
        {/* Year in School */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            What year are you in school?
          </label>
          <div className="space-y-2">
            {YEAR_OPTIONS.map(option => (
              <label key={option} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="yearInSchool"
                  value={option}
                  checked={formData.yearInSchool === option}
                  onChange={(e) => handleInputChange('yearInSchool', e.target.value)}
                  className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-3 text-slate-700">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Enrollment Status */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            What is your enrollment status?
          </label>
          <div className="space-y-2">
            {ENROLLMENT_OPTIONS.map(option => (
              <label key={option} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="enrollmentStatus"
                  value={option}
                  checked={formData.enrollmentStatus === option}
                  onChange={(e) => handleInputChange('enrollmentStatus', e.target.value)}
                  className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-3 text-slate-700">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Age Range */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            What is your age range?
          </label>
          <div className="space-y-2">
            {AGE_OPTIONS.map(option => (
              <label key={option} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="ageRange"
                  value={option}
                  checked={formData.ageRange === option}
                  onChange={(e) => handleInputChange('ageRange', e.target.value)}
                  className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-3 text-slate-700">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Gender Identity */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            What is your gender identity?
          </label>
          <div className="space-y-2">
            {GENDER_OPTIONS.map(option => (
              <label key={option} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="genderIdentity"
                  value={option}
                  checked={formData.genderIdentity === option}
                  onChange={(e) => handleInputChange('genderIdentity', e.target.value)}
                  className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-3 text-slate-700">{option}</span>
              </label>
            ))}
          </div>
          {formData.genderIdentity === 'Self-describe' && (
            <input
              type="text"
              placeholder="Please specify"
              value={formData.genderSelfDescribe || ''}
              onChange={(e) => handleInputChange('genderSelfDescribe', e.target.value)}
              className="mt-2 block w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          )}
        </div>

        {/* Race/Ethnicity */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            What is your race/ethnicity? (Select all that apply)
          </label>
          <div className="space-y-2">
            {RACE_ETHNICITY_OPTIONS.map(option => (
              <label key={option} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value={option}
                  checked={formData.raceEthnicity?.includes(option) || false}
                  onChange={(e) => {
                    const current = formData.raceEthnicity || [];
                    if (e.target.checked) {
                      handleInputChange('raceEthnicity', [...current, option]);
                    } else {
                      handleInputChange('raceEthnicity', current.filter(item => item !== option));
                    }
                  }}
                  className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-3 text-slate-700">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* International Student */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Are you an international student?
          </label>
          <div className="space-y-2">
            {INTERNATIONAL_OPTIONS.map(option => (
              <label key={option} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="isInternational"
                  value={option}
                  checked={formData.isInternational === option}
                  onChange={(e) => handleInputChange('isInternational', e.target.value)}
                  className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-3 text-slate-700">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Employment Status */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            What is your employment status?
          </label>
          <div className="space-y-2">
            {EMPLOYMENT_OPTIONS.map(option => (
              <label key={option} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="employmentStatus"
                  value={option}
                  checked={formData.employmentStatus === option}
                  onChange={(e) => handleInputChange('employmentStatus', e.target.value)}
                  className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-3 text-slate-700">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Caregiving Responsibilities */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Do you have family or caregiving responsibilities that impact your time as a student?
          </label>
          <div className="space-y-2">
            {CAREGIVING_OPTIONS.map(option => (
              <label key={option} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="hasCaregavingResponsibilities"
                  value={option}
                  checked={formData.hasCaregavingResponsibilities === option}
                  onChange={(e) => handleInputChange('hasCaregavingResponsibilities', e.target.value)}
                  className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-3 text-slate-700">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Greek Organization */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Are you a member of a Greek organization (fraternity/sorority)?
          </label>
          <div className="space-y-2">
            {GREEK_OPTIONS.map(option => (
              <label key={option} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="inGreekOrganization"
                  value={option}
                  checked={formData.inGreekOrganization === option}
                  onChange={(e) => handleInputChange('inGreekOrganization', e.target.value)}
                  className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-3 text-slate-700">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Study Mode */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            What is your current mode of study?
          </label>
          <div className="space-y-2">
            {STUDY_MODE_OPTIONS.map(option => (
              <label key={option} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="studyMode"
                  value={option}
                  checked={formData.studyMode === option}
                  onChange={(e) => handleInputChange('studyMode', e.target.value)}
                  className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-3 text-slate-700">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Transfer Student */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Are you a transfer student?
          </label>
          <div className="space-y-2">
            {TRANSFER_STUDENT_OPTIONS.map(option => (
              <label key={option} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="transferStudent"
                  value={option}
                  checked={formData.transferStudent === option}
                  onChange={(e) => handleInputChange('transferStudent', e.target.value)}
                  className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-3 text-slate-700">{option}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-12">
        <button
          onClick={handleBack}
          className="flex items-center px-6 py-3 text-slate-600 hover:text-slate-800 transition-colors"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back
        </button>
        <button
          onClick={handleNext}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          Continue
          <ChevronRight className="h-5 w-5 ml-1" />
        </button>
      </div>
    </div>
  );
}