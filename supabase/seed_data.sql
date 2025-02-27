
-- Inserir dados para admin
INSERT INTO auth.users (id, email, email_confirmed_at, raw_user_meta_data)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin@fitnesshub.com', now(), '{"name": "Admin User"}')
ON CONFLICT (id) DO NOTHING;

INSERT INTO admin_profiles (id, user_id, name, email, avatar_url)
VALUES 
  ('a0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Admin User', 'admin@fitnesshub.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin')
ON CONFLICT (id) DO NOTHING;

-- Inserir dados para professores
INSERT INTO auth.users (id, email, email_confirmed_at, raw_user_meta_data)
VALUES 
  ('00000000-0000-0000-0000-000000000002', 'john@fitnesshub.com', now(), '{"name": "John Trainer"}'),
  ('00000000-0000-0000-0000-000000000003', 'sarah@fitnesshub.com', now(), '{"name": "Sarah Coach"}'),
  ('00000000-0000-0000-0000-000000000004', 'carlos@fitnesshub.com', now(), '{"name": "Carlos Fitness"}')
ON CONFLICT (id) DO NOTHING;

INSERT INTO teacher_profiles (id, user_id, name, email, specialties, on_vacation, avatar_url)
VALUES 
  ('t0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'John Trainer', 'john@fitnesshub.com', ARRAY['Yoga', 'Pilates'], false, 'https://api.dicebear.com/7.x/avataaars/svg?seed=john'),
  ('t0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'Sarah Coach', 'sarah@fitnesshub.com', ARRAY['HIIT', 'CrossFit'], true, 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah'),
  ('t0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004', 'Carlos Fitness', 'carlos@fitnesshub.com', ARRAY['Strength Training', 'Bodybuilding'], false, 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos')
ON CONFLICT (id) DO NOTHING;

-- Inserir dados para alunos
INSERT INTO auth.users (id, email, email_confirmed_at, raw_user_meta_data)
VALUES 
  ('00000000-0000-0000-0000-000000000005', 'mike@example.com', now(), '{"name": "Mike Student"}'),
  ('00000000-0000-0000-0000-000000000006', 'lisa@example.com', now(), '{"name": "Lisa Student"}'),
  ('00000000-0000-0000-0000-000000000007', 'alex@example.com', now(), '{"name": "Alex Smith"}'),
  ('00000000-0000-0000-0000-000000000008', 'emma@example.com', now(), '{"name": "Emma Johnson"}')
ON CONFLICT (id) DO NOTHING;

INSERT INTO student_profiles (id, user_id, name, email, membership_type, last_check_in, avatar_url)
VALUES 
  ('s0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005', 'Mike Student', 'mike@example.com', 'Premium', now() - interval '1 day', 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike'),
  ('s0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000006', 'Lisa Student', 'lisa@example.com', 'Standard', now() - interval '2 days', 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa'),
  ('s0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000007', 'Alex Smith', 'alex@example.com', 'Basic', null, 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex'),
  ('s0000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000008', 'Emma Johnson', 'emma@example.com', 'Premium', now() - interval '1 day', 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma')
ON CONFLICT (id) DO NOTHING;

-- Inserir dados para aulas
INSERT INTO classes (id, name, description, category, teacher_id, date, start_time, end_time, max_capacity, enrolled_count, image_url)
VALUES 
  ('c0000000-0000-0000-0000-000000000001', 'Morning Yoga', 'Start your day with a refreshing yoga session', 'Yoga', 't0000000-0000-0000-0000-000000000001', CURRENT_DATE + interval '1 day', '07:00', '08:00', 15, 2, 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'),
  ('c0000000-0000-0000-0000-000000000002', 'HIIT Workout', 'High-intensity interval training for maximum calorie burn', 'HIIT', 't0000000-0000-0000-0000-000000000002', CURRENT_DATE + interval '1 day', '12:00', '13:00', 12, 1, 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'),
  ('c0000000-0000-0000-0000-000000000003', 'Strength Training', 'Build muscle and strength with our comprehensive program', 'Strength', 't0000000-0000-0000-0000-000000000003', CURRENT_DATE + interval '1 day', '18:00', '19:30', 10, 1, 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'),
  ('c0000000-0000-0000-0000-000000000004', 'Evening Pilates', 'End your day with a relaxing and strengthening Pilates session', 'Pilates', 't0000000-0000-0000-0000-000000000001', CURRENT_DATE + interval '2 days', '19:00', '20:00', 15, 1, 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'),
  ('c0000000-0000-0000-0000-000000000005', 'CrossFit Challenge', 'Push your limits with our CrossFit challenge', 'CrossFit', 't0000000-0000-0000-0000-000000000002', CURRENT_DATE + interval '2 days', '17:00', '18:30', 8, 0, 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80')
ON CONFLICT (id) DO NOTHING;

-- Inserir dados para matrículas
INSERT INTO enrollments (id, class_id, student_id, enrolled_at, attended)
VALUES 
  ('e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 's0000000-0000-0000-0000-000000000001', now() - interval '5 days', false),
  ('e0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000003', 's0000000-0000-0000-0000-000000000001', now() - interval '4 days', false),
  ('e0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000002', 's0000000-0000-0000-0000-000000000002', now() - interval '3 days', false),
  ('e0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000001', 's0000000-0000-0000-0000-000000000004', now() - interval '2 days', false),
  ('e0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000004', 's0000000-0000-0000-0000-000000000004', now() - interval '1 day', false)
ON CONFLICT (id) DO NOTHING;

-- Inserir dados para férias
INSERT INTO vacations (id, teacher_id, start_date, end_date, approved)
VALUES 
  ('v0000000-0000-0000-0000-000000000001', 't0000000-0000-0000-0000-000000000002', CURRENT_DATE - interval '7 days', CURRENT_DATE + interval '7 days', true),
  ('v0000000-0000-0000-0000-000000000002', 't0000000-0000-0000-0000-000000000001', CURRENT_DATE + interval '30 days', CURRENT_DATE + interval '40 days', true)
ON CONFLICT (id) DO NOTHING;

-- Definir senhas para os usuários (para fins de demo, todos usam a mesma senha)
-- NOTA: Em ambiente de produção, usar senhas fortes e únicas!
UPDATE auth.users SET encrypted_password = '$2a$10$rvQDLEXFknHQtCpQz.cEAu5HdJcFWR2U2qQPFMkMqA5KPxE8BxbOi' 
WHERE email IN ('admin@fitnesshub.com', 'john@fitnesshub.com', 'sarah@fitnesshub.com', 'carlos@fitnesshub.com', 'mike@example.com', 'lisa@example.com', 'alex@example.com', 'emma@example.com');
