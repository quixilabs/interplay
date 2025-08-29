drop extension if exists "pg_net";

drop policy "Admins can read demographics" on "public"."demographics";

drop policy "Admins can read flourishing scores" on "public"."flourishing_scores";

drop policy "Admins can read growth modules" on "public"."growth_modules";

drop policy "Admins can read school wellbeing" on "public"."school_wellbeing";

drop policy "Admins can read survey sessions" on "public"."survey_sessions";

drop policy "Admins can read tension assessments" on "public"."tensions_assessment";

drop policy "Admins can read text responses" on "public"."text_responses";

alter table "public"."universities" add column "branding_config" jsonb default '{}'::jsonb;

alter table "public"."universities" add column "is_active" boolean default true;

alter table "public"."universities" add column "survey_config" jsonb default '{}'::jsonb;


  create policy "Admins can read demographics"
  on "public"."demographics"
  as permissive
  for select
  to authenticated
using ((session_id IN ( SELECT survey_sessions.session_id
   FROM survey_sessions
  WHERE (survey_sessions.university_id IN ( SELECT universities.id
           FROM universities
          WHERE (universities.admin_email = (auth.jwt() ->> 'email'::text)))))));



  create policy "Admins can read flourishing scores"
  on "public"."flourishing_scores"
  as permissive
  for select
  to authenticated
using ((session_id IN ( SELECT survey_sessions.session_id
   FROM survey_sessions
  WHERE (survey_sessions.university_id IN ( SELECT universities.id
           FROM universities
          WHERE (universities.admin_email = (auth.jwt() ->> 'email'::text)))))));



  create policy "Admins can read growth modules"
  on "public"."growth_modules"
  as permissive
  for select
  to authenticated
using ((session_id IN ( SELECT survey_sessions.session_id
   FROM survey_sessions
  WHERE (survey_sessions.university_id IN ( SELECT universities.id
           FROM universities
          WHERE (universities.admin_email = (auth.jwt() ->> 'email'::text)))))));



  create policy "Admins can read school wellbeing"
  on "public"."school_wellbeing"
  as permissive
  for select
  to authenticated
using ((session_id IN ( SELECT survey_sessions.session_id
   FROM survey_sessions
  WHERE (survey_sessions.university_id IN ( SELECT universities.id
           FROM universities
          WHERE (universities.admin_email = (auth.jwt() ->> 'email'::text)))))));



  create policy "Admins can read survey sessions"
  on "public"."survey_sessions"
  as permissive
  for select
  to authenticated
using ((university_id IN ( SELECT universities.id
   FROM universities
  WHERE (universities.admin_email = (auth.jwt() ->> 'email'::text)))));



  create policy "Admins can read tension assessments"
  on "public"."tensions_assessment"
  as permissive
  for select
  to authenticated
using ((session_id IN ( SELECT survey_sessions.session_id
   FROM survey_sessions
  WHERE (survey_sessions.university_id IN ( SELECT universities.id
           FROM universities
          WHERE (universities.admin_email = (auth.jwt() ->> 'email'::text)))))));



  create policy "Admins can read text responses"
  on "public"."text_responses"
  as permissive
  for select
  to authenticated
using ((session_id IN ( SELECT survey_sessions.session_id
   FROM survey_sessions
  WHERE (survey_sessions.university_id IN ( SELECT universities.id
           FROM universities
          WHERE (universities.admin_email = (auth.jwt() ->> 'email'::text)))))));



