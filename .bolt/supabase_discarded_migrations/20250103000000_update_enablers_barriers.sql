-- Migration to update enablers and barriers with correct data and add other_text support
-- This updates the domain data and adds support for "Other" text inputs

-- First, clear existing data and update with correct enablers and barriers
DELETE FROM domain_enablers_barriers;

-- Insert updated domain enablers and barriers data with correct options
INSERT INTO domain_enablers_barriers (domain_key, domain_name, enablers, barriers) VALUES 
(
    'happiness_satisfaction',
    'Happiness & Life Satisfaction',
    ARRAY[
        'Feeling a sense of belonging',
        'Sharing fun or humor with others',
        'Doing arts, music, or creative activities',
        'Spending time in nature',
        'Someone checking in on me',
        'Trying new things or new experiences',
        'Other'
    ],
    ARRAY[
        'I don''t have enough time',
        'I don''t feel welcome',
        'I don''t know what to do or where to go',
        'Costs get in the way',
        'Rules or schedules are restrictive',
        'Family responsibilities',
        'Other'
    ]
),
(
    'mental_physical_health',
    'Mental & Physical Health',
    ARRAY[
        'Having more chances to move or be active',
        'Feeling safe in campus spaces',
        'Easy access to a counselor or support services',
        'Tools to manage stress and anxiety',
        'Good sleep and healthy food options',
        'Time or space for mindfulness/reflection',
        'Other'
    ],
    ARRAY[
        'I don''t have enough time',
        'Services are hard to access',
        'I don''t know how to get started',
        'Stigma about seeking help',
        'Safety concerns',
        'Costs',
        'Other'
    ]
),
(
    'meaning_purpose',
    'Meaning & Purpose',
    ARRAY[
        'Connecting my classwork to my future',
        'Doing service-learning or giving back',
        'Having mentors who guide me',
        'Time for reflection or journaling',
        'Choice in projects or topics',
        'Exploring my spirituality or personal values',
        'Other'
    ],
    ARRAY[
        'I don''t see the point',
        'I don''t have enough time',
        'I don''t have a mentor or guide',
        'I feel unsure of my goals',
        'Rules or schedules limit my choices',
        'Other'
    ]
),
(
    'character_virtue',
    'Character & Virtue',
    ARRAY[
        'Learning and practicing emotional tools',
        'Being recognized for kindness or integrity',
        'Using restorative approaches to solve conflicts',
        'Coaching or feedback from teachers/staff',
        'Opportunities to practice handling challenges',
        'Other'
    ],
    ARRAY[
        'I forget or don''t use the tools I''ve learned',
        'I don''t have space or time to cool down',
        'I worry what others will think of me',
        'Adults or mentors aren''t available',
        'Pressure or stress gets in the way',
        'Other'
    ]
),
(
    'social_relationships',
    'Close Social Relationships',
    ARRAY[
        'Having a trusted adult to talk to',
        'Peer connection or friends who check in',
        'Anti-bullying support',
        'Positive group norms',
        'Mentoring or role models',
        'Opportunities to create and collaborate with peers',
        'Other'
    ],
    ARRAY[
        'Feeling new or isolated',
        'Negative social experiences',
        'Schedule or transportation challenges',
        'Shyness or anxiety',
        'I don''t know which adult I can trust',
        'Other'
    ]
),
(
    'financial_stability',
    'Financial & Material Stability',
    ARRAY[
        'Fee waivers or financial aid',
        'Meals or snacks on campus',
        'Access to supplies, devices, or wi-fi',
        'Help with transportation',
        'Opportunities to earn income (on/off campus work)',
        'Other'
    ],
    ARRAY[
        'Costs I can''t cover',
        'Transportation challenges',
        'Family responsibilities',
        'I don''t know what help is available',
        'Food or housing insecurity',
        'Other'
    ]
);

-- Add columns to user_enablers_barriers table to support "Other" text inputs
ALTER TABLE user_enablers_barriers 
ADD COLUMN IF NOT EXISTS enabler_other_text TEXT,
ADD COLUMN IF NOT EXISTS barrier_other_text TEXT;
