SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: universities; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."universities" ("id", "name", "slug", "admin_email", "survey_active", "created_at", "updated_at") VALUES
	('1444ad13-1fee-407b-8059-8c423939b3fc', 'Demo University', 'demo-university', 'admin@university.edu', true, '2025-08-27 18:38:40.64433+00', '2025-08-27 18:38:40.64433+00'),
	('b5f64414-d874-4e9e-abf9-54e7c0d1c019', 'Saint Louis University', 'saint-louis-university', 'admin@slu.edu', true, '2025-08-27 18:39:23.539259+00', '2025-08-27 18:39:23.539259+00'),
	('35e179eb-447a-4833-b97d-d26e273c3fa3', 'Test University', 'test-university', 'admin@test.edu', true, '2025-08-27 20:54:21.98431+00', '2025-08-27 20:54:21.98431+00');


--
-- Data for Name: survey_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."survey_sessions" ("id", "session_id", "university_id", "university_slug", "start_time", "completion_time", "is_completed", "ip_address", "user_agent", "email_for_results", "created_at") VALUES
	('3234dfcf-683b-41a8-bea5-3ad9b3fd4ce4', 'test_upsert_123', NULL, 'saint-louis-university', '2025-08-27 19:00:00+00', NULL, false, NULL, NULL, NULL, '2025-08-27 19:09:38.641907+00'),
	('ee878234-0ab3-4cb7-9f67-64ee2cdd4486', 'session_1756326113060_tecfzuph1', NULL, 'saint-louis-university', '2025-08-27 20:21:53.061+00', NULL, false, NULL, NULL, NULL, '2025-08-27 20:21:53.569477+00'),
	('9761e442-c337-4b33-adc2-653e6f08bfd1', 'session_1756326113061_qoe5g0855', NULL, 'saint-louis-university', '2025-08-27 20:21:53.061+00', '2025-08-27 20:24:21.755+00', true, NULL, NULL, NULL, '2025-08-27 20:21:53.561677+00'),
	('17b1c60f-fc82-43b9-bfe6-7419e4bfd380', 'session_1_1756327130631', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.631+00', true, NULL, NULL, 'student1@university.edu', '2025-08-27 20:38:50.845237+00'),
	('c9b4071b-7fef-421a-bf76-79be276222c9', 'session_2_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student2@university.edu', '2025-08-27 20:38:50.845237+00'),
	('ffce45f8-a5ee-45fa-a775-8e7e9f3a3382', 'session_3_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student3@university.edu', '2025-08-27 20:38:50.845237+00'),
	('7823d384-5df0-4f8e-ad32-8031071e0ecf', 'session_4_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student4@university.edu', '2025-08-27 20:38:50.845237+00'),
	('12010f95-5775-4c50-85fe-e8fa55c66952', 'session_5_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student5@university.edu', '2025-08-27 20:38:50.845237+00'),
	('91331a7f-9651-44ae-9ecc-2127508d332d', 'session_6_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student6@university.edu', '2025-08-27 20:38:50.845237+00'),
	('ce209c77-ab37-4b41-9190-bc2b73b69d90', 'session_7_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student7@university.edu', '2025-08-27 20:38:50.845237+00'),
	('2c840653-c0d8-42eb-9068-db8b2e122f3d', 'session_8_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student8@university.edu', '2025-08-27 20:38:50.845237+00'),
	('1db40e80-ec4b-48e9-ba0f-bb42ac26e726', 'session_9_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student9@university.edu', '2025-08-27 20:38:50.845237+00'),
	('a82c8532-152e-4870-bdf3-322f65686137', 'session_10_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student10@university.edu', '2025-08-27 20:38:50.845237+00'),
	('125fa647-7a8c-4b40-906c-d43c94361043', 'session_11_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student11@university.edu', '2025-08-27 20:38:50.845237+00'),
	('150edd94-a1aa-4293-a33d-c3af0c607be5', 'session_12_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student12@university.edu', '2025-08-27 20:38:50.845237+00'),
	('892333ac-ad77-4c75-beef-4be7f1cc3d6c', 'session_13_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student13@university.edu', '2025-08-27 20:38:50.845237+00'),
	('de449ebf-47d0-455a-b752-a2394403925d', 'session_14_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student14@university.edu', '2025-08-27 20:38:50.845237+00'),
	('1129a700-d63c-403d-9af5-854d7403b129', 'session_15_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student15@university.edu', '2025-08-27 20:38:50.845237+00'),
	('8dc24e3a-b9d1-44de-9634-49d6ff148ebe', 'session_16_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student16@university.edu', '2025-08-27 20:38:50.845237+00'),
	('cbefd7b0-a4ef-483b-8c6d-fe2d2e990f1d', 'session_17_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student17@university.edu', '2025-08-27 20:38:50.845237+00'),
	('19c814b3-7b2b-40e8-bbb6-adbf65873490', 'session_18_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student18@university.edu', '2025-08-27 20:38:50.845237+00'),
	('f7ea9e99-b964-43f7-a718-af53741e7daa', 'session_19_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student19@university.edu', '2025-08-27 20:38:50.845237+00'),
	('99c064ee-6c56-4027-b221-701ecf519982', 'session_20_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student20@university.edu', '2025-08-27 20:38:50.845237+00'),
	('bd041afb-d62d-4cda-9165-18dc51a144fa', 'session_21_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student21@university.edu', '2025-08-27 20:38:50.845237+00'),
	('46948a71-0466-4e7d-bb3a-f9bb861ddde3', 'session_22_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student22@university.edu', '2025-08-27 20:38:50.845237+00'),
	('bb917549-aaaa-41fa-88e9-01a3ba02e16e', 'session_23_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student23@university.edu', '2025-08-27 20:38:50.845237+00'),
	('5e847eb2-70f3-4ad0-aa49-37630269b50b', 'session_24_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student24@university.edu', '2025-08-27 20:38:50.845237+00'),
	('a7d083b4-23f7-44d7-8c22-8913e5e094a4', 'session_25_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student25@university.edu', '2025-08-27 20:38:50.845237+00'),
	('c5935b6d-b029-4416-ada5-b184dca0ab82', 'session_26_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student26@university.edu', '2025-08-27 20:38:50.845237+00'),
	('ca29b51d-329e-455f-9743-119f3b516b98', 'session_27_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student27@university.edu', '2025-08-27 20:38:50.845237+00'),
	('f5d82fda-cc2a-4f07-8e70-aa909b5ad1cb', 'session_28_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student28@university.edu', '2025-08-27 20:38:50.845237+00'),
	('cd343eb5-1cb6-46f6-b989-22b2a3023c3c', 'session_29_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student29@university.edu', '2025-08-27 20:38:50.845237+00'),
	('7e1f3367-2f77-482e-bb0f-cc83b1d3e9e2', 'session_30_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student30@university.edu', '2025-08-27 20:38:50.845237+00'),
	('82699609-cbf8-4abc-a4f1-878e2ab77f31', 'session_31_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student31@university.edu', '2025-08-27 20:38:50.845237+00'),
	('b4035785-87b8-4298-b60a-9e6c074f9e20', 'session_32_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student32@university.edu', '2025-08-27 20:38:50.845237+00'),
	('70e7bbd8-06a6-4059-9c0c-3b082cb4ff2a', 'session_33_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student33@university.edu', '2025-08-27 20:38:50.845237+00'),
	('34e13f13-7993-4a2e-b871-4ff6b252fb34', 'session_34_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student34@university.edu', '2025-08-27 20:38:50.845237+00'),
	('3bc8a512-164e-4e91-95a2-345aec62de11', 'session_35_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student35@university.edu', '2025-08-27 20:38:50.845237+00'),
	('6b717c9f-5550-46f1-910a-a80fdf03f50f', 'session_36_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student36@university.edu', '2025-08-27 20:38:50.845237+00'),
	('30032553-ee81-4da5-9621-94696c8e2e7d', 'session_37_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student37@university.edu', '2025-08-27 20:38:50.845237+00'),
	('92935f5b-62e6-4c08-9232-db338873105a', 'session_38_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student38@university.edu', '2025-08-27 20:38:50.845237+00'),
	('562d4ad7-a94b-4554-86d6-bb7cb0836e62', 'session_39_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student39@university.edu', '2025-08-27 20:38:50.845237+00'),
	('21a94d7f-feef-47fe-8d62-49df42126740', 'session_40_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student40@university.edu', '2025-08-27 20:38:50.845237+00'),
	('5e904b62-6c05-4e8c-aba1-e4aa801a57f4', 'session_41_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student41@university.edu', '2025-08-27 20:38:50.845237+00'),
	('3db59bc2-ad28-493d-9c21-7ad6e47f9963', 'session_42_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student42@university.edu', '2025-08-27 20:38:50.845237+00'),
	('bce33990-dc66-46c0-af6b-c8c12f44dd7f', 'session_43_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student43@university.edu', '2025-08-27 20:38:50.845237+00'),
	('a5d44949-9956-4796-a6e2-0449c1a4178e', 'session_44_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student44@university.edu', '2025-08-27 20:38:50.845237+00'),
	('6a9e11b2-d9a6-44c7-bc2b-dc4b46a74623', 'session_45_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student45@university.edu', '2025-08-27 20:38:50.845237+00'),
	('c4dfc040-766f-4d02-bf3f-ac2516290a44', 'session_46_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student46@university.edu', '2025-08-27 20:38:50.845237+00'),
	('ba59d823-06d0-4ad4-b3aa-beeb6616efe1', 'session_47_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student47@university.edu', '2025-08-27 20:38:50.845237+00'),
	('3cb0c3d5-a48d-45fd-ac29-2d0e89f30c87', 'session_48_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student48@university.edu', '2025-08-27 20:38:50.845237+00'),
	('2ff1292a-6411-46d1-b5ff-b2e20c421043', 'session_49_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student49@university.edu', '2025-08-27 20:38:50.845237+00'),
	('ef7d84ab-06c6-4de6-8bf1-761db84d1335', 'session_50_1756327130637', NULL, 'demo-university', '2025-08-27 20:38:50.845237+00', '2025-08-27 20:38:50.637+00', true, NULL, NULL, 'student50@university.edu', '2025-08-27 20:38:50.845237+00'),
	('b40aeb7c-40d0-443a-921c-58607083befa', 'test_session_1_1756328062001', NULL, 'test-university', '2025-08-27 20:54:22.020286+00', '2025-08-27 20:54:22.001+00', true, NULL, NULL, NULL, '2025-08-27 20:54:22.020286+00'),
	('b1bd139e-16e6-4e6b-b94c-6aa5048dc519', 'test_session_2_1756328062004', NULL, 'test-university', '2025-08-27 20:54:22.020286+00', '2025-08-27 20:54:22.004+00', true, NULL, NULL, NULL, '2025-08-27 20:54:22.020286+00'),
	('3640e7aa-2b03-426b-b879-4fae36c1e4d0', 'test_session_3_1756328062005', NULL, 'test-university', '2025-08-27 20:54:22.020286+00', '2025-08-27 20:54:22.005+00', true, NULL, NULL, NULL, '2025-08-27 20:54:22.020286+00'),
	('db3ee60a-61fe-4d85-9168-fae264a86706', 'test_session_4_1756328062005', NULL, 'test-university', '2025-08-27 20:54:22.020286+00', '2025-08-27 20:54:22.005+00', true, NULL, NULL, NULL, '2025-08-27 20:54:22.020286+00'),
	('21728e7c-d343-40d9-9c8c-8334bfe66fea', 'test_session_5_1756328062005', NULL, 'test-university', '2025-08-27 20:54:22.020286+00', '2025-08-27 20:54:22.005+00', true, NULL, NULL, NULL, '2025-08-27 20:54:22.020286+00'),
	('d4851c6f-3f62-48ec-aa45-9bbf5046ce78', 'test_session_6_1756328062005', NULL, 'test-university', '2025-08-27 20:54:22.020286+00', '2025-08-27 20:54:22.005+00', true, NULL, NULL, NULL, '2025-08-27 20:54:22.020286+00'),
	('730c1f0c-84ef-4aff-92ca-c2dd4c1d3108', 'test_session_7_1756328062005', NULL, 'test-university', '2025-08-27 20:54:22.020286+00', '2025-08-27 20:54:22.005+00', true, NULL, NULL, NULL, '2025-08-27 20:54:22.020286+00'),
	('2faecb14-4980-45da-b2f1-97866e4c956f', 'test_session_8_1756328062005', NULL, 'test-university', '2025-08-27 20:54:22.020286+00', '2025-08-27 20:54:22.005+00', true, NULL, NULL, NULL, '2025-08-27 20:54:22.020286+00'),
	('063eaa9e-87b0-4190-a1bf-fc6e1a7bbde8', 'test_session_9_1756328062005', NULL, 'test-university', '2025-08-27 20:54:22.020286+00', '2025-08-27 20:54:22.005+00', true, NULL, NULL, NULL, '2025-08-27 20:54:22.020286+00'),
	('5a5161b9-aa8a-4097-9320-6e5c783c3a49', 'test_session_10_1756328062005', NULL, 'test-university', '2025-08-27 20:54:22.020286+00', '2025-08-27 20:54:22.005+00', true, NULL, NULL, NULL, '2025-08-27 20:54:22.020286+00'),
	('708f6dcf-1b0c-49d1-9475-570507f35a2f', 'test_session_1_1756328115628', NULL, 'test-university', '2025-08-27 20:55:15.652333+00', '2025-08-27 20:55:15.628+00', true, NULL, NULL, NULL, '2025-08-27 20:55:15.652333+00'),
	('9358433d-100f-4bea-aca6-22926a160b2c', 'test_session_2_1756328115629', NULL, 'test-university', '2025-08-27 20:55:15.652333+00', '2025-08-27 20:55:15.629+00', true, NULL, NULL, NULL, '2025-08-27 20:55:15.652333+00'),
	('8c8e6728-e1bc-4fd8-96c8-e174ca573e11', 'test_session_3_1756328115629', NULL, 'test-university', '2025-08-27 20:55:15.652333+00', '2025-08-27 20:55:15.629+00', true, NULL, NULL, NULL, '2025-08-27 20:55:15.652333+00'),
	('40c1f847-26c6-40ce-a988-450792df21a2', 'test_session_4_1756328115629', NULL, 'test-university', '2025-08-27 20:55:15.652333+00', '2025-08-27 20:55:15.629+00', true, NULL, NULL, NULL, '2025-08-27 20:55:15.652333+00'),
	('e13fd33e-dfd7-4daf-9d07-3b376265e772', 'test_session_5_1756328115629', NULL, 'test-university', '2025-08-27 20:55:15.652333+00', '2025-08-27 20:55:15.629+00', true, NULL, NULL, NULL, '2025-08-27 20:55:15.652333+00'),
	('fdd4ea22-5ca2-4f4b-99e8-83003d41923e', 'test_session_6_1756328115629', NULL, 'test-university', '2025-08-27 20:55:15.652333+00', '2025-08-27 20:55:15.629+00', true, NULL, NULL, NULL, '2025-08-27 20:55:15.652333+00'),
	('f078d95c-d05e-4665-89c6-7b248f093e75', 'test_session_7_1756328115629', NULL, 'test-university', '2025-08-27 20:55:15.652333+00', '2025-08-27 20:55:15.629+00', true, NULL, NULL, NULL, '2025-08-27 20:55:15.652333+00'),
	('b9d99a52-45a4-45af-b71f-7b5e34fd282b', 'test_session_8_1756328115629', NULL, 'test-university', '2025-08-27 20:55:15.652333+00', '2025-08-27 20:55:15.629+00', true, NULL, NULL, NULL, '2025-08-27 20:55:15.652333+00'),
	('3c6ea43a-156d-495d-9562-8ca02b39a35d', 'test_session_9_1756328115629', NULL, 'test-university', '2025-08-27 20:55:15.652333+00', '2025-08-27 20:55:15.629+00', true, NULL, NULL, NULL, '2025-08-27 20:55:15.652333+00'),
	('ef46d35e-8750-4a9d-b364-5b9e55322b74', 'test_session_10_1756328115629', NULL, 'test-university', '2025-08-27 20:55:15.652333+00', '2025-08-27 20:55:15.629+00', true, NULL, NULL, NULL, '2025-08-27 20:55:15.652333+00'),
	('c0529123-11ee-46cc-909f-5105490f923e', 'session_1756416232832_v6ae07d3c', NULL, 'saint-louis-university', '2025-08-28 21:23:52.832+00', NULL, false, NULL, NULL, NULL, '2025-08-28 21:23:53.115663+00'),
	('4e90c096-02fd-4cae-ad19-8d5348d41405', 'session_1756416232832_y9jkoxmqh', NULL, 'saint-louis-university', '2025-08-28 21:23:52.832+00', NULL, false, NULL, NULL, NULL, '2025-08-28 21:23:53.115797+00');


--
-- Data for Name: demographics; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."demographics" ("id", "session_id", "year_in_school", "enrollment_status", "age_range", "gender_identity", "gender_self_describe", "race_ethnicity", "is_international", "employment_status", "has_caregiving_responsibilities", "in_greek_organization", "created_at") VALUES
	('8967a953-a2c6-4a96-8504-538edbacd12f', 'test_upsert_123', 'First year/Freshman', 'Full-time', NULL, NULL, NULL, '[]', NULL, NULL, NULL, NULL, '2025-08-27 19:09:38.674936+00'),
	('f862922b-6110-4adf-9ccc-4ebba856ac2b', 'session_1756326113061_qoe5g0855', 'Third year/Junior', 'Full-time', '25 or older', 'Non-binary', NULL, '["Native Hawaiian or Other Pacific Islander"]', 'No, domestic student', 'Part-time (20+ hours/week)', 'No', 'No', '2025-08-27 20:22:31.967056+00'),
	('57e9f7df-42f0-4720-ad1c-3009c8d8796a', 'session_1_1756327130631', 'First year', NULL, NULL, 'Woman', NULL, '["Asian"]', NULL, 'Not employed', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('6521db0a-3f15-4290-b2a8-a4a8352dc154', 'session_2_1756327130637', 'Sophomore', NULL, NULL, 'Man', NULL, '["Black/African American"]', NULL, 'Part-time (<20hrs)', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('894ed939-d8c8-47ec-bdcd-1b660f09b9b0', 'session_3_1756327130637', 'Junior', NULL, NULL, 'Non-binary', NULL, '["Hispanic/Latino/a/x"]', NULL, 'Part-time (20+hrs)', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('408369e8-bed0-4a3b-b79e-81a17bcad76a', 'session_4_1756327130637', 'Senior', NULL, NULL, 'Other', NULL, '["White"]', NULL, 'Full-time', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('6d5277dc-b391-413d-9250-909270c1ed3c', 'session_5_1756327130637', 'Graduate', NULL, NULL, 'Woman', NULL, '["Other"]', NULL, 'Not employed', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('b16ac485-dbfe-4411-a915-5406e17f57c7', 'session_6_1756327130637', 'First year', NULL, NULL, 'Man', NULL, '["Asian"]', NULL, 'Part-time (<20hrs)', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('913d2003-5846-4ed2-98ce-b251436306e3', 'session_7_1756327130637', 'Sophomore', NULL, NULL, 'Non-binary', NULL, '["Black/African American"]', NULL, 'Part-time (20+hrs)', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('d5d63863-3463-4bef-94f0-dd213e3665a9', 'session_8_1756327130637', 'Junior', NULL, NULL, 'Other', NULL, '["Hispanic/Latino/a/x"]', NULL, 'Full-time', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('e2dba310-61bc-4f38-8297-c64d5e6c064b', 'session_9_1756327130637', 'Senior', NULL, NULL, 'Woman', NULL, '["White"]', NULL, 'Not employed', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('46303095-fb83-427e-9b71-b70e6662e13f', 'session_10_1756327130637', 'Graduate', NULL, NULL, 'Man', NULL, '["Other"]', NULL, 'Part-time (<20hrs)', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('427c9a70-2131-4350-b469-83ee9be2f966', 'session_11_1756327130637', 'First year', NULL, NULL, 'Non-binary', NULL, '["Asian"]', NULL, 'Part-time (20+hrs)', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('8f6f7a1b-e5e9-45a2-8f22-087af9e45c42', 'session_12_1756327130637', 'Sophomore', NULL, NULL, 'Other', NULL, '["Black/African American"]', NULL, 'Full-time', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('07fbc35f-8c96-4016-ada4-f14678594424', 'session_13_1756327130637', 'Junior', NULL, NULL, 'Woman', NULL, '["Hispanic/Latino/a/x"]', NULL, 'Not employed', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('12c79928-c2c9-48d0-9450-0aa51e4c9f43', 'session_14_1756327130637', 'Senior', NULL, NULL, 'Man', NULL, '["White"]', NULL, 'Part-time (<20hrs)', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('c310a27e-4f53-4284-862f-2904c96d161c', 'session_15_1756327130637', 'Graduate', NULL, NULL, 'Non-binary', NULL, '["Other"]', NULL, 'Part-time (20+hrs)', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('df9d0887-5d11-4bb7-ad1c-66550760fd23', 'session_16_1756327130637', 'First year', NULL, NULL, 'Other', NULL, '["Asian"]', NULL, 'Full-time', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('26641644-abc7-4469-a20b-5d51cd702f95', 'session_17_1756327130637', 'Sophomore', NULL, NULL, 'Woman', NULL, '["Black/African American"]', NULL, 'Not employed', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('e6c1d3f8-cb7e-400f-bb3a-c4998bec6290', 'session_18_1756327130637', 'Junior', NULL, NULL, 'Man', NULL, '["Hispanic/Latino/a/x"]', NULL, 'Part-time (<20hrs)', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('45388794-d9fa-4d79-b05b-7ac6fe526ca0', 'session_19_1756327130637', 'Senior', NULL, NULL, 'Non-binary', NULL, '["White"]', NULL, 'Part-time (20+hrs)', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('d656eb2a-342a-40a7-9983-d4a9c58865f9', 'session_20_1756327130637', 'Graduate', NULL, NULL, 'Other', NULL, '["Other"]', NULL, 'Full-time', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('f07811db-b4de-4aec-93e9-83a5c41fab56', 'session_21_1756327130637', 'First year', NULL, NULL, 'Woman', NULL, '["Asian"]', NULL, 'Not employed', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('0ed85127-952a-4c81-831c-b758dd965a07', 'session_22_1756327130637', 'Sophomore', NULL, NULL, 'Man', NULL, '["Black/African American"]', NULL, 'Part-time (<20hrs)', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('c7786e14-fd50-4050-8627-c23668fd2fd2', 'session_23_1756327130637', 'Junior', NULL, NULL, 'Non-binary', NULL, '["Hispanic/Latino/a/x"]', NULL, 'Part-time (20+hrs)', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('ed68b514-b734-4746-be87-4ec24104d6ac', 'session_24_1756327130637', 'Senior', NULL, NULL, 'Other', NULL, '["White"]', NULL, 'Full-time', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('d1c147ad-147a-4ac2-85a1-ca1239b9aff3', 'session_25_1756327130637', 'Graduate', NULL, NULL, 'Woman', NULL, '["Other"]', NULL, 'Not employed', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('c1450069-5c43-4f99-bd0a-feb7081caff9', 'session_26_1756327130637', 'First year', NULL, NULL, 'Man', NULL, '["Asian"]', NULL, 'Part-time (<20hrs)', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('857d3c2b-798f-499a-ab76-31ad956bc6bd', 'session_27_1756327130637', 'Sophomore', NULL, NULL, 'Non-binary', NULL, '["Black/African American"]', NULL, 'Part-time (20+hrs)', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('75721f4d-95e5-4510-b370-b9b598699172', 'session_28_1756327130637', 'Junior', NULL, NULL, 'Other', NULL, '["Hispanic/Latino/a/x"]', NULL, 'Full-time', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('ce3fbf59-a549-442e-b3a2-d4eb0758d523', 'session_29_1756327130637', 'Senior', NULL, NULL, 'Woman', NULL, '["White"]', NULL, 'Not employed', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('6f0ae605-519c-443c-aa01-cf6f622f5cb1', 'session_30_1756327130637', 'Graduate', NULL, NULL, 'Man', NULL, '["Other"]', NULL, 'Part-time (<20hrs)', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('b6d29035-c87b-4d5e-9010-e397bea230f5', 'session_31_1756327130637', 'First year', NULL, NULL, 'Non-binary', NULL, '["Asian"]', NULL, 'Part-time (20+hrs)', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('4118ea84-d85a-4d0f-8942-9ddb5dafc9b3', 'session_32_1756327130637', 'Sophomore', NULL, NULL, 'Other', NULL, '["Black/African American"]', NULL, 'Full-time', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('717933a2-5c1a-4cd1-a022-0e3cda0b42eb', 'session_33_1756327130637', 'Junior', NULL, NULL, 'Woman', NULL, '["Hispanic/Latino/a/x"]', NULL, 'Not employed', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('4eaa8b47-cf9b-441f-88c4-12191abc4b30', 'session_34_1756327130637', 'Senior', NULL, NULL, 'Man', NULL, '["White"]', NULL, 'Part-time (<20hrs)', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('41b2de22-effa-4116-9bd1-b87890d881cb', 'session_35_1756327130637', 'Graduate', NULL, NULL, 'Non-binary', NULL, '["Other"]', NULL, 'Part-time (20+hrs)', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('082f2b6b-d43c-4baf-a0b3-6cfdff30b2c5', 'session_36_1756327130637', 'First year', NULL, NULL, 'Other', NULL, '["Asian"]', NULL, 'Full-time', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('bd2a6f1f-17e7-4951-8fd3-5a49187a96d2', 'session_37_1756327130637', 'Sophomore', NULL, NULL, 'Woman', NULL, '["Black/African American"]', NULL, 'Not employed', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('e0525ff0-4771-45c8-ac77-2a98cb1a1bb9', 'session_38_1756327130637', 'Junior', NULL, NULL, 'Man', NULL, '["Hispanic/Latino/a/x"]', NULL, 'Part-time (<20hrs)', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('1740d772-bb3b-40ab-8425-13e25a1a0b00', 'session_39_1756327130637', 'Senior', NULL, NULL, 'Non-binary', NULL, '["White"]', NULL, 'Part-time (20+hrs)', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('ef34f85a-8e38-4531-b789-614265f21b0a', 'session_40_1756327130637', 'Graduate', NULL, NULL, 'Other', NULL, '["Other"]', NULL, 'Full-time', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('c9fa3caa-2e9c-4f42-a97c-807b085115e4', 'session_41_1756327130637', 'First year', NULL, NULL, 'Woman', NULL, '["Asian"]', NULL, 'Not employed', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('b3af3b67-c277-40b4-979a-de8f1ea8d257', 'session_42_1756327130637', 'Sophomore', NULL, NULL, 'Man', NULL, '["Black/African American"]', NULL, 'Part-time (<20hrs)', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('bccb5a8d-2da4-46d5-992c-a0173a139635', 'session_43_1756327130637', 'Junior', NULL, NULL, 'Non-binary', NULL, '["Hispanic/Latino/a/x"]', NULL, 'Part-time (20+hrs)', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('c8fc3663-448e-4b57-8a64-59a0e4d7534d', 'session_44_1756327130637', 'Senior', NULL, NULL, 'Other', NULL, '["White"]', NULL, 'Full-time', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('963d4454-d176-42e0-aa86-ab59e288dcba', 'session_45_1756327130637', 'Graduate', NULL, NULL, 'Woman', NULL, '["Other"]', NULL, 'Not employed', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('6c952480-2d50-425e-a078-7fc6e66179e7', 'session_46_1756327130637', 'First year', NULL, NULL, 'Man', NULL, '["Asian"]', NULL, 'Part-time (<20hrs)', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('3ca40392-2e32-41a8-84d4-e99e4e951634', 'session_47_1756327130637', 'Sophomore', NULL, NULL, 'Non-binary', NULL, '["Black/African American"]', NULL, 'Part-time (20+hrs)', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('ee7372ea-e581-4be0-9f2e-cf2d53339578', 'session_48_1756327130637', 'Junior', NULL, NULL, 'Other', NULL, '["Hispanic/Latino/a/x"]', NULL, 'Full-time', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('84ea3b89-2440-41c1-80be-b40005441d1d', 'session_49_1756327130637', 'Senior', NULL, NULL, 'Woman', NULL, '["White"]', NULL, 'Not employed', NULL, NULL, '2025-08-27 20:38:50.936391+00'),
	('f2052995-bdd3-4f14-9551-a78f4e4c43a1', 'session_50_1756327130637', 'Graduate', NULL, NULL, 'Man', NULL, '["Other"]', NULL, 'Part-time (<20hrs)', NULL, NULL, '2025-08-27 20:38:50.936391+00');


--
-- Data for Name: flourishing_scores; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."flourishing_scores" ("id", "session_id", "happiness_satisfaction_1", "happiness_satisfaction_2", "mental_physical_health_1", "mental_physical_health_2", "meaning_purpose_1", "meaning_purpose_2", "character_virtue_1", "character_virtue_2", "social_relationships_1", "social_relationships_2", "financial_stability_1", "financial_stability_2", "created_at") VALUES
	('55fc8948-58c5-483f-b2be-ab43b3af7374', 'session_1756326113061_qoe5g0855', 7, 8, 7, 5, 6, 8, 4, 5, 9, 9, 10, 10, '2025-08-27 20:22:39.117738+00'),
	('acd0aa3f-f546-4a7a-9ac3-84b9c24e3beb', 'session_1_1756327130631', 8, 9, 6, 6, 8, 8, 8, 9, 8, 6, 7, 8, '2025-08-27 20:38:50.993516+00'),
	('94f8a1d1-254c-44f5-ac6d-93d9865e7020', 'session_2_1756327130637', 6, 9, 8, 7, 8, 7, 8, 9, 8, 9, 6, 8, '2025-08-27 20:38:50.993516+00'),
	('955fc24d-a864-4402-a9ab-ab9f65e422ba', 'session_3_1756327130637', 9, 9, 7, 7, 7, 9, 9, 8, 8, 8, 7, 5, '2025-08-27 20:38:50.993516+00'),
	('3312daa2-ed10-42ee-89ca-0333221b30db', 'session_4_1756327130637', 8, 9, 6, 5, 8, 9, 9, 9, 8, 7, 7, 4, '2025-08-27 20:38:50.993516+00'),
	('112cd641-9e37-4245-a68d-a93950dc669a', 'session_5_1756327130637', 6, 6, 6, 6, 7, 7, 9, 9, 8, 6, 8, 4, '2025-08-27 20:38:50.993516+00'),
	('96efb78d-b628-4f3f-802a-606bab38fc5c', 'session_6_1756327130637', 6, 6, 8, 6, 7, 8, 9, 9, 6, 6, 8, 8, '2025-08-27 20:38:50.993516+00'),
	('51568488-2f81-4ff9-9fae-05721450ee98', 'session_7_1756327130637', 8, 6, 5, 8, 9, 8, 9, 9, 8, 7, 5, 4, '2025-08-27 20:38:50.993516+00'),
	('3a21575d-ef6f-4143-b70a-f8cd34999770', 'session_8_1756327130637', 7, 7, 8, 5, 9, 9, 8, 8, 6, 9, 4, 4, '2025-08-27 20:38:50.993516+00'),
	('d568a984-2274-4bd1-956b-ce1831d67761', 'session_9_1756327130637', 6, 6, 6, 6, 8, 8, 8, 9, 7, 9, 5, 7, '2025-08-27 20:38:50.993516+00'),
	('178c074c-669a-49b5-a786-33b2971480d0', 'session_10_1756327130637', 7, 9, 8, 6, 8, 8, 8, 9, 9, 7, 5, 8, '2025-08-27 20:38:50.993516+00'),
	('e7db9e60-907d-46c6-9e31-4972f88ac561', 'session_11_1756327130637', 8, 8, 8, 6, 8, 7, 9, 8, 7, 9, 8, 4, '2025-08-27 20:38:50.993516+00'),
	('aedd8cc0-77aa-4283-b80c-ee4c0672785f', 'session_12_1756327130637', 8, 7, 7, 6, 9, 8, 9, 9, 6, 8, 7, 6, '2025-08-27 20:38:50.993516+00'),
	('d1a48cec-0ccc-4a78-92dc-d6bad67197e5', 'session_13_1756327130637', 7, 7, 7, 7, 7, 9, 8, 8, 9, 6, 7, 7, '2025-08-27 20:38:50.993516+00'),
	('a5552ef5-dff6-4c51-a28b-2df6367b6c32', 'session_14_1756327130637', 8, 6, 8, 7, 9, 8, 9, 9, 9, 6, 7, 8, '2025-08-27 20:38:50.993516+00'),
	('274e022d-3053-44fb-9ec0-370a85868e96', 'session_15_1756327130637', 8, 8, 7, 6, 7, 8, 8, 9, 8, 7, 7, 5, '2025-08-27 20:38:50.993516+00'),
	('71909f48-35e2-45ef-a8ac-0b384daef78f', 'session_16_1756327130637', 6, 9, 7, 7, 8, 8, 8, 9, 9, 6, 4, 4, '2025-08-27 20:38:50.993516+00'),
	('b2494450-2e2b-475c-88c5-833b76d79ff3', 'session_17_1756327130637', 6, 9, 6, 6, 9, 7, 9, 9, 6, 8, 5, 6, '2025-08-27 20:38:50.993516+00'),
	('2ac62d55-1eba-4a8e-9eb6-24bd1d4a4448', 'session_18_1756327130637', 6, 6, 7, 5, 9, 9, 8, 9, 6, 6, 5, 5, '2025-08-27 20:38:50.993516+00'),
	('87d8b039-8311-422b-b219-5b567da4e147', 'session_19_1756327130637', 7, 8, 8, 7, 9, 8, 9, 8, 8, 8, 7, 7, '2025-08-27 20:38:50.993516+00'),
	('7e5a0f80-8a97-41e8-b5a7-1f67b6698571', 'session_20_1756327130637', 7, 6, 6, 5, 7, 8, 8, 8, 9, 7, 7, 8, '2025-08-27 20:38:50.993516+00'),
	('ca8e7024-8c4e-4645-a5bd-5f8ceb031e69', 'session_21_1756327130637', 6, 7, 7, 5, 9, 9, 9, 8, 7, 9, 8, 4, '2025-08-27 20:38:50.993516+00'),
	('83c4a33f-2598-4d56-bd1d-cb89cd2f9eb2', 'session_22_1756327130637', 8, 7, 5, 7, 8, 8, 8, 9, 7, 9, 5, 8, '2025-08-27 20:38:50.993516+00'),
	('a615bc9b-5a50-4a71-9a45-32a71186a43e', 'session_23_1756327130637', 6, 7, 6, 8, 9, 8, 8, 8, 7, 6, 7, 6, '2025-08-27 20:38:50.993516+00'),
	('888b702b-1ee0-4ca5-90e6-e8f006cf85cb', 'session_24_1756327130637', 7, 7, 6, 7, 9, 7, 8, 8, 9, 8, 4, 5, '2025-08-27 20:38:50.993516+00'),
	('c17bddd9-c5b7-4267-907a-eaca1e0a3682', 'session_25_1756327130637', 6, 7, 5, 8, 7, 7, 9, 8, 6, 9, 7, 6, '2025-08-27 20:38:50.993516+00'),
	('a01b58ec-978f-421d-9bb0-72625e47caba', 'session_26_1756327130637', 9, 6, 5, 8, 7, 9, 9, 8, 6, 6, 4, 5, '2025-08-27 20:38:50.993516+00'),
	('6b49dc5f-3d39-458d-9dbf-278f0c621c08', 'session_27_1756327130637', 6, 7, 5, 5, 8, 7, 9, 9, 7, 9, 6, 6, '2025-08-27 20:38:50.993516+00'),
	('fbb97b7e-b247-4e9d-ad85-4ada5e178a96', 'session_28_1756327130637', 6, 8, 6, 6, 8, 8, 9, 8, 9, 7, 5, 6, '2025-08-27 20:38:50.993516+00'),
	('6fa87c7b-100d-4d08-9a7c-997334fa3a1c', 'session_29_1756327130637', 6, 8, 6, 8, 9, 7, 9, 8, 8, 6, 7, 6, '2025-08-27 20:38:50.993516+00'),
	('0264401f-5053-4297-9b50-589086f6fe98', 'session_30_1756327130637', 9, 8, 6, 5, 8, 7, 8, 8, 9, 7, 8, 4, '2025-08-27 20:38:50.993516+00'),
	('80fe1fb6-c45d-4878-bd50-56d7b97f3793', 'session_31_1756327130637', 8, 9, 8, 5, 7, 9, 9, 9, 9, 8, 7, 6, '2025-08-27 20:38:50.993516+00'),
	('9d4bc68f-4623-4a21-a73f-123da97270f2', 'session_32_1756327130637', 6, 6, 7, 5, 9, 8, 8, 8, 9, 8, 7, 4, '2025-08-27 20:38:50.993516+00'),
	('3e8b50eb-07f8-477a-9b34-c6b3832a8dbf', 'session_33_1756327130637', 6, 7, 7, 7, 7, 9, 9, 9, 8, 6, 5, 5, '2025-08-27 20:38:50.993516+00'),
	('a9b8711e-0ae5-4f03-a5cd-88ffe41ca2da', 'session_34_1756327130637', 6, 8, 6, 6, 8, 8, 9, 8, 8, 6, 4, 5, '2025-08-27 20:38:50.993516+00'),
	('f587dc74-59c4-4d8c-9b1e-3eb6e745d473', 'session_35_1756327130637', 6, 7, 6, 8, 9, 9, 9, 8, 6, 6, 4, 7, '2025-08-27 20:38:50.993516+00'),
	('3466b299-cce2-40af-99bd-7a5d75f03344', 'session_36_1756327130637', 9, 9, 8, 7, 9, 8, 8, 9, 6, 6, 5, 6, '2025-08-27 20:38:50.993516+00'),
	('1e6e7e07-0bd7-4de0-81df-830f4c42b677', 'session_37_1756327130637', 7, 7, 7, 8, 8, 9, 9, 8, 7, 7, 5, 5, '2025-08-27 20:38:50.993516+00'),
	('306966b7-f62a-4db2-aa21-e827475c1020', 'session_38_1756327130637', 7, 8, 8, 6, 7, 7, 8, 9, 7, 6, 5, 6, '2025-08-27 20:38:50.993516+00'),
	('e3478969-8cbf-42fc-88f3-552eac91edd6', 'session_39_1756327130637', 7, 6, 7, 5, 7, 9, 9, 9, 6, 7, 8, 7, '2025-08-27 20:38:50.993516+00'),
	('e995b59d-816f-4eec-ba21-2244ef18ad23', 'session_40_1756327130637', 6, 9, 6, 5, 7, 7, 9, 8, 8, 7, 4, 5, '2025-08-27 20:38:50.993516+00'),
	('02bcfe5f-d8b0-4e23-b9b7-1f26944b5369', 'session_41_1756327130637', 8, 9, 5, 7, 7, 7, 8, 8, 8, 8, 7, 7, '2025-08-27 20:38:50.993516+00'),
	('45f8fa37-88d7-41b9-887a-1cf28d7269f2', 'session_42_1756327130637', 8, 7, 5, 8, 7, 8, 8, 8, 9, 8, 4, 4, '2025-08-27 20:38:50.993516+00'),
	('68d8a2a9-ad93-40b8-b35a-76473d51a182', 'session_43_1756327130637', 6, 7, 5, 7, 9, 9, 8, 8, 8, 9, 8, 5, '2025-08-27 20:38:50.993516+00'),
	('76313275-de84-4f88-ba24-3cbf23258b17', 'session_44_1756327130637', 7, 8, 6, 8, 8, 9, 9, 8, 8, 9, 6, 6, '2025-08-27 20:38:50.993516+00'),
	('88090913-a54b-4030-ad7e-6d68c5d31c3f', 'session_45_1756327130637', 7, 7, 7, 8, 8, 7, 8, 9, 7, 6, 4, 7, '2025-08-27 20:38:50.993516+00'),
	('4fd441d3-eb9d-446a-9a70-a3a72a506be6', 'session_46_1756327130637', 9, 9, 7, 8, 8, 7, 9, 8, 6, 8, 6, 6, '2025-08-27 20:38:50.993516+00'),
	('991b044c-f873-40d7-b75f-1ccbb6d8e169', 'session_47_1756327130637', 9, 9, 5, 8, 8, 7, 8, 9, 8, 6, 6, 5, '2025-08-27 20:38:50.993516+00'),
	('58208d34-8f9a-486c-82d1-4a7a2b825525', 'session_48_1756327130637', 9, 8, 8, 6, 7, 8, 9, 8, 8, 9, 8, 7, '2025-08-27 20:38:50.993516+00'),
	('95d67025-ef10-4215-8b5a-1ee4453bebb2', 'session_49_1756327130637', 6, 9, 7, 8, 8, 7, 8, 9, 9, 8, 8, 7, '2025-08-27 20:38:50.993516+00'),
	('e1bcd3da-2682-4581-a1eb-149e806819cd', 'session_50_1756327130637', 8, 9, 5, 7, 7, 9, 9, 9, 8, 8, 7, 8, '2025-08-27 20:38:50.993516+00'),
	('bb9cb582-0441-40c0-9834-9af35a603ed4', 'test_session_1_1756328062001', 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, '2025-08-27 20:54:22.040074+00'),
	('31da56ec-0bb2-4986-bd8c-048b20491dfb', 'test_session_2_1756328062004', 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, '2025-08-27 20:54:22.040074+00'),
	('2477f297-d6d9-43f7-843f-117f12528948', 'test_session_3_1756328062005', 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, '2025-08-27 20:54:22.040074+00'),
	('a2bb230d-2c18-412c-b7bf-d9907618771a', 'test_session_4_1756328062005', 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, '2025-08-27 20:54:22.040074+00'),
	('f5a73a39-5f9e-48c2-a858-f897a9043e15', 'test_session_5_1756328062005', 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, '2025-08-27 20:54:22.040074+00'),
	('15240d49-b3af-4d9a-af2d-173d5481a1ef', 'test_session_6_1756328062005', 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, '2025-08-27 20:54:22.040074+00'),
	('90b9b341-9cf5-4705-b63f-8a85e2a035dc', 'test_session_7_1756328062005', 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, '2025-08-27 20:54:22.040074+00'),
	('3cb7e699-4536-4828-9f47-3643fe442f8d', 'test_session_8_1756328062005', 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, '2025-08-27 20:54:22.040074+00'),
	('05554627-14b2-4722-839c-73f975831efa', 'test_session_9_1756328062005', 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, '2025-08-27 20:54:22.040074+00'),
	('a5d383a5-5ae4-4ecf-9adc-d9941b58ee3b', 'test_session_10_1756328062005', 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, '2025-08-27 20:54:22.040074+00'),
	('c6726c21-0af0-4f22-9669-ec993af8b711', 'test_session_1_1756328115628', 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, '2025-08-27 20:55:15.692321+00'),
	('93f61516-3784-4124-928d-5e77b207e179', 'test_session_2_1756328115629', 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, '2025-08-27 20:55:15.692321+00'),
	('1980dcb1-45a1-4722-a3ca-62b81196eda6', 'test_session_3_1756328115629', 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, '2025-08-27 20:55:15.692321+00'),
	('61e8c917-c2da-4e8d-8477-23a648f1276f', 'test_session_4_1756328115629', 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, '2025-08-27 20:55:15.692321+00'),
	('63a59484-ce2a-4504-91c7-45ef04ee8c52', 'test_session_5_1756328115629', 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, '2025-08-27 20:55:15.692321+00'),
	('24c977f1-717a-42a9-a818-0249a48d4c8e', 'test_session_6_1756328115629', 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, '2025-08-27 20:55:15.692321+00'),
	('c8b68655-bab6-466b-80f9-9746a93dd308', 'test_session_7_1756328115629', 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, '2025-08-27 20:55:15.692321+00'),
	('f5770591-5a23-42cc-9ab7-7acfa2c4fcea', 'test_session_8_1756328115629', 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, '2025-08-27 20:55:15.692321+00'),
	('be3e18cf-a052-4f8d-96ea-726410737dac', 'test_session_9_1756328115629', 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, '2025-08-27 20:55:15.692321+00'),
	('c827bcd5-4a53-40d8-bb98-c3aa0bdf0181', 'test_session_10_1756328115629', 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, '2025-08-27 20:55:15.692321+00');


--
-- Data for Name: growth_modules; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."growth_modules" ("id", "session_id", "domain_name", "enabler_selections", "barrier_selection", "additional_comments", "created_at") VALUES
	('4b26f50e-27cd-42d7-9d76-34aa2ddb1b6a', 'session_1756326113061_qoe5g0855', 'Mental & Physical Health', '["Better time management", "Mental health support"]', 'Academic pressure', '', '2025-08-27 20:23:04.890378+00'),
	('8a49f48e-9267-442e-b296-735a48aad2bf', 'session_1756326113061_qoe5g0855', 'Meaning & Purpose', '["Career guidance", "Family support"]', 'Time constraints', '', '2025-08-27 20:23:17.612399+00'),
	('c00d6e34-ffd7-4cc7-8d84-a67f15443a84', 'session_1756326113061_qoe5g0855', 'Character & Virtue', '["Spiritual/religious community", "Family support"]', 'Work obligations', '', '2025-08-27 20:23:32.366478+00'),
	('b76ca3ba-9e90-4144-ad66-9f9d5fcef9c5', 'session_1_1756327130631', 'Mental & Physical Health', '["Mental health support", "Financial assistance"]', 'Time constraints', NULL, '2025-08-27 20:38:51.072812+00'),
	('7afd413e-1b55-43dd-a118-1626c727eab0', 'session_2_1756327130637', 'Financial & Material Stability', '["Financial assistance", "Better time management"]', 'Time constraints', NULL, '2025-08-27 20:38:51.072812+00'),
	('4edeea04-2dcc-47b5-a254-52a0df27e6fb', 'session_3_1756327130637', 'Close Social Relationships', '["Better time management", "Academic support"]', 'Time constraints', NULL, '2025-08-27 20:38:51.072812+00'),
	('378f4243-5bfc-4e1a-bd1d-fe637570516a', 'session_4_1756327130637', 'Mental & Physical Health', '["Academic support", "More social connections"]', 'Time constraints', NULL, '2025-08-27 20:38:51.072812+00'),
	('b370803b-43cc-4c19-9002-dda7123089f7', 'session_5_1756327130637', 'Financial & Material Stability', '["More social connections", "Stress reduction programs"]', 'Time constraints', NULL, '2025-08-27 20:38:51.072812+00'),
	('9e667a02-fc4b-4d0a-a3fc-1991fc8b1b40', 'session_6_1756327130637', 'Close Social Relationships', '["Stress reduction programs", "Career guidance"]', 'Time constraints', NULL, '2025-08-27 20:38:51.072812+00'),
	('4566131c-3897-4faa-acba-8c3496bc1fd7', 'session_7_1756327130637', 'Mental & Physical Health', '["Career guidance", "Mental health support"]', 'Time constraints', NULL, '2025-08-27 20:38:51.072812+00'),
	('93d0b184-f9e4-436d-9726-d5e765627698', 'session_8_1756327130637', 'Financial & Material Stability', '["Mental health support", "Financial assistance"]', 'Time constraints', NULL, '2025-08-27 20:38:51.072812+00'),
	('d189d5ac-f9ff-4a71-bd1a-d9ff599662c8', 'session_9_1756327130637', 'Close Social Relationships', '["Financial assistance", "Better time management"]', 'Time constraints', NULL, '2025-08-27 20:38:51.072812+00'),
	('980278df-c422-4080-a892-2effbaaa94d0', 'session_10_1756327130637', 'Mental & Physical Health', '["Better time management", "Academic support"]', 'Time constraints', NULL, '2025-08-27 20:38:51.072812+00'),
	('63106383-f6ac-45a3-afc9-dce405fc9c3a', 'session_11_1756327130637', 'Financial & Material Stability', '["Academic support", "More social connections"]', 'Time constraints', NULL, '2025-08-27 20:38:51.072812+00'),
	('7c945fe7-0e4c-42c5-94d0-19601512c2b3', 'session_12_1756327130637', 'Close Social Relationships', '["More social connections", "Stress reduction programs"]', 'Time constraints', NULL, '2025-08-27 20:38:51.072812+00'),
	('5c8994cb-3c0b-41e2-8757-2c48544832b0', 'session_13_1756327130637', 'Mental & Physical Health', '["Stress reduction programs", "Career guidance"]', 'Time constraints', NULL, '2025-08-27 20:38:51.072812+00'),
	('4d75ab71-f578-4225-b267-677505779469', 'session_14_1756327130637', 'Financial & Material Stability', '["Career guidance", "Mental health support"]', 'Time constraints', NULL, '2025-08-27 20:38:51.072812+00'),
	('3df7200e-149d-448d-8d9a-9b72d81f7963', 'session_15_1756327130637', 'Close Social Relationships', '["Mental health support", "Financial assistance"]', 'Time constraints', NULL, '2025-08-27 20:38:51.072812+00'),
	('610c3251-384c-475f-8c87-268c31bc3053', 'session_16_1756327130637', 'Mental & Physical Health', '["Financial assistance", "Better time management"]', 'Time constraints', NULL, '2025-08-27 20:38:51.072812+00'),
	('a6245b81-3176-46ed-941c-79b998a4ff8d', 'session_17_1756327130637', 'Financial & Material Stability', '["Better time management", "Academic support"]', 'Time constraints', NULL, '2025-08-27 20:38:51.072812+00'),
	('601bd410-f3cc-40d8-a99d-40d1c2ddcc00', 'session_18_1756327130637', 'Close Social Relationships', '["Academic support", "More social connections"]', 'Time constraints', NULL, '2025-08-27 20:38:51.072812+00'),
	('182fd5ab-8ea6-443b-a015-5f1154ee99ea', 'session_19_1756327130637', 'Mental & Physical Health', '["More social connections", "Stress reduction programs"]', 'Time constraints', NULL, '2025-08-27 20:38:51.072812+00'),
	('864b4d79-4337-425c-b10a-b1ecf0b222d6', 'session_20_1756327130637', 'Financial & Material Stability', '["Stress reduction programs", "Career guidance"]', 'Time constraints', NULL, '2025-08-27 20:38:51.072812+00'),
	('8c3b8c38-5aef-4575-9531-8410297944c8', 'session_21_1756327130637', 'Close Social Relationships', '["Career guidance", "Mental health support"]', 'Time constraints', NULL, '2025-08-27 20:38:51.072812+00'),
	('97848c2e-ac0f-4eb3-a38a-21c2f7afe517', 'session_22_1756327130637', 'Mental & Physical Health', '["Mental health support", "Financial assistance"]', 'Time constraints', NULL, '2025-08-27 20:38:51.072812+00'),
	('9931bdcd-7403-4b88-b1e5-aae0546c95d8', 'session_23_1756327130637', 'Financial & Material Stability', '["Financial assistance", "Better time management"]', 'Time constraints', NULL, '2025-08-27 20:38:51.072812+00'),
	('a778c58d-ec59-49dc-9538-316a63cc435d', 'session_24_1756327130637', 'Close Social Relationships', '["Better time management", "Academic support"]', 'Time constraints', NULL, '2025-08-27 20:38:51.072812+00'),
	('22d8bc28-b263-4aa3-9736-e7166050dd75', 'session_25_1756327130637', 'Mental & Physical Health', '["Academic support", "More social connections"]', 'Time constraints', NULL, '2025-08-27 20:38:51.072812+00'),
	('20f0c150-3c54-472b-a3ea-ca69252fcd78', 'session_26_1756327130637', 'Financial & Material Stability', '["More social connections", "Stress reduction programs"]', 'Time constraints', NULL, '2025-08-27 20:38:51.072812+00'),
	('26035b72-af85-40d3-9670-ed00895f025f', 'session_27_1756327130637', 'Close Social Relationships', '["Stress reduction programs", "Career guidance"]', 'Time constraints', NULL, '2025-08-27 20:38:51.072812+00'),
	('02151e54-5f36-494c-af9f-49b3ef33b0a1', 'session_28_1756327130637', 'Mental & Physical Health', '["Career guidance", "Mental health support"]', 'Time constraints', NULL, '2025-08-27 20:38:51.072812+00'),
	('5e423ee3-62c1-4b5e-87e7-0a856934ba44', 'session_29_1756327130637', 'Financial & Material Stability', '["Mental health support", "Financial assistance"]', 'Time constraints', NULL, '2025-08-27 20:38:51.072812+00'),
	('686e3e20-cfeb-497e-964c-f9399bc8dd39', 'session_30_1756327130637', 'Close Social Relationships', '["Financial assistance", "Better time management"]', 'Time constraints', NULL, '2025-08-27 20:38:51.072812+00');


--
-- Data for Name: school_wellbeing; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."school_wellbeing" ("id", "session_id", "belonging_score", "enjoy_school_days", "physical_activity", "feel_safe", "work_connected_goals", "contribute_bigger_purpose", "kind_to_others", "manage_emotions", "trusted_adult", "supportive_friends", "resources_participation", "wellbeing_checklist", "created_at") VALUES
	('c4b0d3de-744d-48b3-92c9-3665f89a83fd', 'session_1756326113061_qoe5g0855', 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, '["I have meaningful relationships with faculty/staff", "I feel comfortable expressing my identity on campus"]', '2025-08-27 20:23:55.987034+00'),
	('70735b19-bd9e-4cc5-bef6-a105b4102e18', 'session_1_1756327130631', 7, 7, 8, 8, 8, 9, 9, 6, 4, 8, 8, '[]', '2025-08-27 20:38:51.034512+00'),
	('98a8210f-fa69-4432-ab1a-8c095e6bd1db', 'session_2_1756327130637', 8, 8, 5, 9, 7, 9, 9, 6, 6, 7, 6, '[]', '2025-08-27 20:38:51.034512+00'),
	('383a057b-f0ec-411a-b926-7fbe4298705f', 'session_3_1756327130637', 7, 8, 8, 9, 6, 9, 8, 5, 5, 8, 8, '[]', '2025-08-27 20:38:51.034512+00'),
	('f4d18e07-5792-4cc9-89e8-7be6a7e7cb77', 'session_4_1756327130637', 9, 9, 7, 9, 7, 9, 8, 7, 7, 7, 8, '[]', '2025-08-27 20:38:51.034512+00'),
	('fdfa3367-ebbd-4d98-80a9-d597797b4737', 'session_5_1756327130637', 8, 9, 9, 8, 7, 7, 8, 8, 6, 9, 8, '[]', '2025-08-27 20:38:51.034512+00'),
	('c764bdab-da4c-4965-bad7-a90ad0e2fbaa', 'session_6_1756327130637', 6, 6, 5, 9, 8, 9, 8, 5, 4, 8, 6, '[]', '2025-08-27 20:38:51.034512+00'),
	('551913df-eb88-476f-b175-9f77f4d85e24', 'session_7_1756327130637', 7, 8, 5, 8, 7, 8, 8, 8, 7, 9, 9, '[]', '2025-08-27 20:38:51.034512+00'),
	('930fe7c6-6791-4e36-a7b1-99ae2ad50efb', 'session_8_1756327130637', 6, 8, 7, 9, 8, 8, 8, 6, 5, 9, 7, '[]', '2025-08-27 20:38:51.034512+00'),
	('80391714-2884-4058-a2e9-9d059aab2a40', 'session_9_1756327130637', 9, 7, 8, 8, 9, 9, 8, 6, 4, 9, 6, '[]', '2025-08-27 20:38:51.034512+00'),
	('e0074efa-fd12-4080-8226-36e574c9f056', 'session_10_1756327130637', 8, 9, 5, 8, 9, 8, 8, 7, 4, 9, 9, '[]', '2025-08-27 20:38:51.034512+00'),
	('c3c05516-ab24-4573-9d4c-0bfe75e906c4', 'session_11_1756327130637', 8, 6, 5, 8, 7, 9, 9, 5, 4, 8, 7, '[]', '2025-08-27 20:38:51.034512+00'),
	('84308f96-49b4-41da-af0a-891ea7b0a14d', 'session_12_1756327130637', 9, 6, 8, 9, 7, 7, 8, 7, 6, 9, 7, '[]', '2025-08-27 20:38:51.034512+00'),
	('bdb2d706-e7a5-422f-a323-dd54173db044', 'session_13_1756327130637', 8, 7, 5, 8, 8, 8, 8, 5, 5, 7, 7, '[]', '2025-08-27 20:38:51.034512+00'),
	('95218e86-1d6a-42e7-9440-0a75c23e858a', 'session_14_1756327130637', 8, 7, 7, 9, 6, 8, 9, 6, 7, 9, 8, '[]', '2025-08-27 20:38:51.034512+00'),
	('1a1e5a59-638f-490c-b5a5-8fad8ae7cc8c', 'session_15_1756327130637', 7, 7, 8, 9, 7, 7, 8, 6, 8, 8, 7, '[]', '2025-08-27 20:38:51.034512+00'),
	('a8a55df4-b10a-4fba-a56f-08a3249a0c49', 'session_16_1756327130637', 9, 6, 8, 8, 6, 8, 9, 8, 4, 8, 8, '[]', '2025-08-27 20:38:51.034512+00'),
	('73229483-5505-47e9-b010-710703776f7f', 'session_17_1756327130637', 9, 6, 6, 9, 6, 8, 9, 8, 7, 9, 8, '[]', '2025-08-27 20:38:51.034512+00'),
	('b7988ef5-c8ff-4dde-b722-745d2d7cc9fc', 'session_18_1756327130637', 6, 6, 7, 9, 7, 8, 8, 8, 5, 9, 9, '[]', '2025-08-27 20:38:51.034512+00'),
	('980358b3-fa04-48bf-ac94-b3c6c31f3914', 'session_19_1756327130637', 9, 7, 7, 8, 9, 7, 9, 8, 4, 8, 7, '[]', '2025-08-27 20:38:51.034512+00'),
	('67e7e85d-e169-4983-8714-5e487adb4585', 'session_20_1756327130637', 6, 8, 9, 9, 7, 9, 9, 5, 4, 9, 8, '[]', '2025-08-27 20:38:51.034512+00'),
	('2de934c8-79a6-493e-a062-c2ebbbfa8a74', 'session_21_1756327130637', 9, 6, 8, 9, 9, 7, 8, 7, 8, 7, 9, '[]', '2025-08-27 20:38:51.034512+00'),
	('d292da9b-1883-4bbb-92a1-01e84ccfab66', 'session_22_1756327130637', 9, 8, 7, 9, 7, 8, 9, 8, 6, 9, 9, '[]', '2025-08-27 20:38:51.034512+00'),
	('e1f78aa7-a038-4576-b8b4-a861e820327c', 'session_23_1756327130637', 6, 7, 5, 9, 6, 8, 9, 6, 7, 8, 7, '[]', '2025-08-27 20:38:51.034512+00'),
	('287e8edd-3ae0-4080-8a92-bd9023fd4efd', 'session_24_1756327130637', 8, 6, 5, 8, 8, 9, 9, 6, 8, 8, 7, '[]', '2025-08-27 20:38:51.034512+00'),
	('91c31a7f-8e0e-4bf0-a210-11eb3dcd3b00', 'session_25_1756327130637', 6, 9, 7, 9, 6, 9, 9, 5, 4, 8, 8, '[]', '2025-08-27 20:38:51.034512+00'),
	('d2758504-8b31-42c4-ada6-f843482afd79', 'session_26_1756327130637', 6, 8, 9, 9, 6, 7, 9, 7, 8, 7, 6, '[]', '2025-08-27 20:38:51.034512+00'),
	('ea3590af-56ca-4740-b849-761b240959d2', 'session_27_1756327130637', 6, 6, 6, 9, 7, 7, 9, 5, 8, 8, 8, '[]', '2025-08-27 20:38:51.034512+00'),
	('7a7bfa05-46a0-428b-8f8b-eaeef48df2bb', 'session_28_1756327130637', 7, 7, 9, 9, 6, 7, 8, 8, 6, 9, 6, '[]', '2025-08-27 20:38:51.034512+00'),
	('058e2392-d547-48c1-850d-23194017af00', 'session_29_1756327130637', 6, 6, 5, 9, 6, 7, 8, 7, 7, 8, 6, '[]', '2025-08-27 20:38:51.034512+00'),
	('dd472840-e065-424e-9e0e-f1266457906e', 'session_30_1756327130637', 6, 7, 5, 8, 6, 9, 8, 8, 6, 8, 6, '[]', '2025-08-27 20:38:51.034512+00'),
	('0966f772-98e8-4b91-a78f-b8d556b0c86b', 'session_31_1756327130637', 9, 6, 9, 8, 9, 7, 9, 7, 4, 7, 7, '[]', '2025-08-27 20:38:51.034512+00'),
	('b811759f-cf51-4770-b6fc-7190809349d6', 'session_32_1756327130637', 6, 8, 6, 8, 8, 8, 9, 7, 8, 9, 8, '[]', '2025-08-27 20:38:51.034512+00'),
	('554e67e2-e84b-4c4e-9550-3fb07e2303ca', 'session_33_1756327130637', 6, 8, 9, 8, 6, 7, 8, 5, 8, 7, 9, '[]', '2025-08-27 20:38:51.034512+00'),
	('a2f8592a-4cb7-44ef-b8e0-54c8901c7ba9', 'session_34_1756327130637', 7, 9, 6, 9, 8, 9, 8, 8, 5, 7, 9, '[]', '2025-08-27 20:38:51.034512+00'),
	('c1818bee-e693-4207-92d2-124f74961f6d', 'session_35_1756327130637', 6, 9, 7, 8, 9, 8, 8, 7, 8, 8, 9, '[]', '2025-08-27 20:38:51.034512+00'),
	('48b142af-6025-4e76-9de1-f897bcd58b13', 'session_36_1756327130637', 7, 7, 8, 8, 9, 8, 8, 5, 7, 7, 8, '[]', '2025-08-27 20:38:51.034512+00'),
	('35be697f-0f90-407a-ae55-dd2f5f123f4f', 'session_37_1756327130637', 7, 7, 8, 9, 9, 9, 8, 7, 6, 7, 6, '[]', '2025-08-27 20:38:51.034512+00'),
	('1fe81afd-d915-42c1-be47-6b58bb7550bc', 'session_38_1756327130637', 6, 7, 5, 9, 8, 8, 9, 5, 7, 7, 7, '[]', '2025-08-27 20:38:51.034512+00'),
	('ca1e3e45-2ff6-4cd6-ac52-7d9e86082471', 'session_39_1756327130637', 8, 7, 9, 8, 9, 8, 9, 5, 7, 7, 9, '[]', '2025-08-27 20:38:51.034512+00'),
	('5e54f384-eff7-440b-9cd2-0239ecc1896f', 'session_40_1756327130637', 7, 6, 9, 9, 8, 9, 8, 8, 8, 9, 9, '[]', '2025-08-27 20:38:51.034512+00'),
	('1dc49373-69fb-480a-a108-613307184efe', 'session_41_1756327130637', 9, 8, 5, 9, 7, 9, 8, 7, 8, 9, 8, '[]', '2025-08-27 20:38:51.034512+00'),
	('c34f2f42-f215-4a80-820b-1abf7eb05d31', 'session_42_1756327130637', 7, 6, 7, 8, 6, 8, 8, 7, 4, 9, 7, '[]', '2025-08-27 20:38:51.034512+00'),
	('962e3f57-0329-4ab8-bdb3-329316f86e56', 'session_43_1756327130637', 9, 7, 9, 9, 9, 8, 9, 7, 6, 7, 9, '[]', '2025-08-27 20:38:51.034512+00'),
	('a628a15c-8e65-4d6e-a5de-b30521791b60', 'session_44_1756327130637', 8, 7, 7, 9, 9, 7, 8, 7, 5, 7, 7, '[]', '2025-08-27 20:38:51.034512+00'),
	('e46aba24-eaee-418f-a9ef-91a7094aea34', 'session_45_1756327130637', 8, 9, 8, 8, 9, 8, 8, 5, 5, 8, 8, '[]', '2025-08-27 20:38:51.034512+00'),
	('4f09b891-caff-49e5-95ac-aa2291d0a6c2', 'session_46_1756327130637', 8, 6, 6, 8, 7, 8, 9, 7, 4, 7, 9, '[]', '2025-08-27 20:38:51.034512+00'),
	('84fd416d-4dc9-4b5b-8ddf-e25534a8aeb7', 'session_47_1756327130637', 6, 6, 9, 8, 7, 9, 9, 8, 6, 8, 8, '[]', '2025-08-27 20:38:51.034512+00'),
	('8ccf2230-3e5e-403e-b1b8-6a9c1f8b71c2', 'session_48_1756327130637', 6, 6, 9, 8, 6, 8, 9, 5, 8, 7, 6, '[]', '2025-08-27 20:38:51.034512+00'),
	('7921f7f8-f5bd-4276-a96d-29806bd33929', 'session_49_1756327130637', 8, 9, 9, 9, 8, 8, 9, 7, 6, 8, 8, '[]', '2025-08-27 20:38:51.034512+00'),
	('06039426-c03c-43d1-99e5-b472aa266346', 'session_50_1756327130637', 9, 7, 5, 9, 7, 7, 9, 5, 5, 8, 9, '[]', '2025-08-27 20:38:51.034512+00');


--
-- Data for Name: tensions_assessment; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."tensions_assessment" ("id", "session_id", "performance_wellbeing", "ambition_contribution", "selfreliance_connection", "stability_growth", "academic_creative", "created_at") VALUES
	('65e2bd45-d0f1-455b-9d92-43d54bbc55e5', 'session_1756326113061_qoe5g0855', 79, 36, 66, 33, 71, '2025-08-27 20:24:10.173416+00');


--
-- Data for Name: text_responses; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."text_responses" ("id", "session_id", "bright_spots", "fastest_win_suggestion", "created_at") VALUES
	('3d2d5671-b892-4778-9c26-8c3d9d5e951d', 'session_1756326113061_qoe5g0855', '{"Meaning & Purpose": "rest", "Character & Virtue": "reset", "Mental & Physical Health": "travel", "Close Social Relationships": "asfd", "Happiness & Life Satisfaction": "test", "Financial & Material Stability": "qwerty"}', 'Yousuf', '2025-08-27 20:22:39.119999+00'),
	('f5e318af-0cbb-4bf8-8ef6-41718ce764b9', 'session_1_1756327130631', '{"spot1": "Peer tutoring programs building friendships"}', 'Extended library hours', '2025-08-27 20:38:51.120354+00'),
	('3ddbf0c0-97a9-4f9b-84c6-4d04b2399ec5', 'session_2_1756327130637', '{"spot1": "Professors who care about student success"}', 'More affordable meal options', '2025-08-27 20:38:51.120354+00'),
	('85496475-972c-400e-b154-fae3f0aa2d59', 'session_3_1756327130637', '{"spot1": "Campus events fostering community"}', 'Better mental health support', '2025-08-27 20:38:51.120354+00'),
	('7248bab9-013f-482c-83d9-495878448d27', 'session_4_1756327130637', '{"spot1": "Research opportunities providing purpose"}', 'Flexible attendance policies', '2025-08-27 20:38:51.120354+00'),
	('20312b3c-6235-42d6-90a2-b30ce0794b4e', 'session_5_1756327130637', '{"spot1": "Peer tutoring programs building friendships"}', 'More diverse counseling staff', '2025-08-27 20:38:51.120354+00'),
	('67f22360-ac84-431e-ba81-b1e34a7faa3b', 'session_6_1756327130637', '{"spot1": "Professors who care about student success"}', 'Meditation spaces on campus', '2025-08-27 20:38:51.120354+00'),
	('7dbaef7e-5c9a-4aa9-a3f3-229c18c1239a', 'session_7_1756327130637', '{"spot1": "Campus events fostering community"}', 'Financial wellness workshops', '2025-08-27 20:38:51.120354+00'),
	('f76e25a5-2e22-4476-92c5-56387379a83e', 'session_8_1756327130637', '{"spot1": "Research opportunities providing purpose"}', 'Extended library hours', '2025-08-27 20:38:51.120354+00'),
	('a2dc14a6-33e4-42ba-8382-f733f8c2c77d', 'session_9_1756327130637', '{"spot1": "Peer tutoring programs building friendships"}', 'More affordable meal options', '2025-08-27 20:38:51.120354+00'),
	('52f44928-129b-4559-9da8-b251e6db3277', 'session_10_1756327130637', '{"spot1": "Professors who care about student success"}', 'Better mental health support', '2025-08-27 20:38:51.120354+00'),
	('e63f8925-7998-4ea1-83ad-3896045cd124', 'session_11_1756327130637', '{"spot1": "Campus events fostering community"}', 'Flexible attendance policies', '2025-08-27 20:38:51.120354+00'),
	('8a1031e1-bc72-4f64-b4e8-ecaf5fbac717', 'session_12_1756327130637', '{"spot1": "Research opportunities providing purpose"}', 'More diverse counseling staff', '2025-08-27 20:38:51.120354+00'),
	('26516842-eef1-467b-b115-2dc6ed45ec23', 'session_13_1756327130637', '{"spot1": "Peer tutoring programs building friendships"}', 'Meditation spaces on campus', '2025-08-27 20:38:51.120354+00'),
	('73d90421-af74-4323-87b4-1d21d6eb65f3', 'session_14_1756327130637', '{"spot1": "Professors who care about student success"}', 'Financial wellness workshops', '2025-08-27 20:38:51.120354+00'),
	('7ccdc628-2b8a-4a70-b481-ce9928b687b5', 'session_15_1756327130637', '{"spot1": "Campus events fostering community"}', 'Extended library hours', '2025-08-27 20:38:51.120354+00'),
	('a5bf365c-abea-444e-b75b-0232a8666445', 'session_16_1756327130637', '{"spot1": "Research opportunities providing purpose"}', 'More affordable meal options', '2025-08-27 20:38:51.120354+00'),
	('cd38b2b2-93f6-466c-9c19-0bdaae603628', 'session_17_1756327130637', '{"spot1": "Peer tutoring programs building friendships"}', 'Better mental health support', '2025-08-27 20:38:51.120354+00'),
	('ff6b8614-158b-4a22-b32a-c33d28ff3f6e', 'session_18_1756327130637', '{"spot1": "Professors who care about student success"}', 'Flexible attendance policies', '2025-08-27 20:38:51.120354+00'),
	('6bbc2c96-2440-4ad8-a959-b7089a19de9f', 'session_19_1756327130637', '{"spot1": "Campus events fostering community"}', 'More diverse counseling staff', '2025-08-27 20:38:51.120354+00'),
	('62da589f-9ad5-4275-8bb3-fb7494551592', 'session_20_1756327130637', '{"spot1": "Research opportunities providing purpose"}', 'Meditation spaces on campus', '2025-08-27 20:38:51.120354+00'),
	('f2dd9abf-0d19-4c00-9561-6fb17dd72f01', 'session_21_1756327130637', '{"spot1": "Peer tutoring programs building friendships"}', 'Financial wellness workshops', '2025-08-27 20:38:51.120354+00'),
	('e45340a5-91aa-4045-a24b-1572db889cf5', 'session_22_1756327130637', '{"spot1": "Professors who care about student success"}', 'Extended library hours', '2025-08-27 20:38:51.120354+00'),
	('6b9b2f32-8eef-4c53-a518-1382a22b8837', 'session_23_1756327130637', '{"spot1": "Campus events fostering community"}', 'More affordable meal options', '2025-08-27 20:38:51.120354+00'),
	('2f442e0f-39ba-4708-ae5c-ac249efe5a74', 'session_24_1756327130637', '{"spot1": "Research opportunities providing purpose"}', 'Better mental health support', '2025-08-27 20:38:51.120354+00'),
	('3814d842-db5a-491c-b4d4-aeec74eb68ec', 'session_25_1756327130637', '{"spot1": "Peer tutoring programs building friendships"}', 'Flexible attendance policies', '2025-08-27 20:38:51.120354+00'),
	('c560dcf7-4300-4489-be3c-1aa782bb5fd8', 'session_26_1756327130637', '{"spot1": "Professors who care about student success"}', 'More diverse counseling staff', '2025-08-27 20:38:51.120354+00'),
	('95c23e21-98af-4399-8c08-709f381d11ff', 'session_27_1756327130637', '{"spot1": "Campus events fostering community"}', 'Meditation spaces on campus', '2025-08-27 20:38:51.120354+00'),
	('88c0d8d9-ae06-45ca-8ee1-1383b2118025', 'session_28_1756327130637', '{"spot1": "Research opportunities providing purpose"}', 'Financial wellness workshops', '2025-08-27 20:38:51.120354+00'),
	('f3e74672-a442-466f-8d09-691fbc3f3708', 'session_29_1756327130637', '{"spot1": "Peer tutoring programs building friendships"}', 'Extended library hours', '2025-08-27 20:38:51.120354+00'),
	('0bf44734-8ee8-4391-8ed1-f7d5c9d6bdfc', 'session_30_1756327130637', '{"spot1": "Professors who care about student success"}', 'More affordable meal options', '2025-08-27 20:38:51.120354+00'),
	('d16ef83c-61f1-4515-ba7c-c96616f19211', 'session_31_1756327130637', '{"spot1": "Campus events fostering community"}', 'Better mental health support', '2025-08-27 20:38:51.120354+00'),
	('79d47c80-3e3a-41a4-ae88-6bdffedf9c31', 'session_32_1756327130637', '{"spot1": "Research opportunities providing purpose"}', 'Flexible attendance policies', '2025-08-27 20:38:51.120354+00'),
	('57ae91ae-379f-4b45-b5ea-680d91853e62', 'session_33_1756327130637', '{"spot1": "Peer tutoring programs building friendships"}', 'More diverse counseling staff', '2025-08-27 20:38:51.120354+00'),
	('7f668212-e925-47aa-8364-a65f206bb532', 'session_34_1756327130637', '{"spot1": "Professors who care about student success"}', 'Meditation spaces on campus', '2025-08-27 20:38:51.120354+00'),
	('203c0a1e-b667-4830-b552-a533a2d645fe', 'session_35_1756327130637', '{"spot1": "Campus events fostering community"}', 'Financial wellness workshops', '2025-08-27 20:38:51.120354+00'),
	('e991e6d9-1895-4509-8cf6-76586fffbbb5', 'session_36_1756327130637', '{"spot1": "Research opportunities providing purpose"}', 'Extended library hours', '2025-08-27 20:38:51.120354+00'),
	('85a27cdf-88cf-4af0-8a23-946f73deca41', 'session_37_1756327130637', '{"spot1": "Peer tutoring programs building friendships"}', 'More affordable meal options', '2025-08-27 20:38:51.120354+00'),
	('bac3d7b7-3cad-417e-80f7-aefef9f0e9ed', 'session_38_1756327130637', '{"spot1": "Professors who care about student success"}', 'Better mental health support', '2025-08-27 20:38:51.120354+00'),
	('67592200-0459-4120-8f90-2a08892ac40d', 'session_39_1756327130637', '{"spot1": "Campus events fostering community"}', 'Flexible attendance policies', '2025-08-27 20:38:51.120354+00'),
	('ed22dbf8-a7f6-486d-8933-6d32ca5659f5', 'session_40_1756327130637', '{"spot1": "Research opportunities providing purpose"}', 'More diverse counseling staff', '2025-08-27 20:38:51.120354+00');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: iceberg_namespaces; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: iceberg_tables; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 1, false);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
