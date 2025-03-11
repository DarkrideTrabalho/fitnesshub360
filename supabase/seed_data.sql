-- Inserir dados para admin
INSERT INTO auth.users (id, email, email_confirmed_at, raw_user_meta_data)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin@fitnesshub.com', now(), '{"name": "Admin User"}')
ON CONFLICT (id) DO NOTHING;

INSERT INTO admin_profiles (id, user_id, name, email, avatar_url)
VALUES 
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Admin User', 'admin@fitnesshub.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin')
ON CONFLICT (id) DO NOTHING;

-- Inserir dados para professores
INSERT INTO auth.users (id, email, email_confirmed_at, raw_user_meta_data)
VALUES 
  ('00000000-0000-0000-0000-000000000003', 'john@fitnesshub.com', now(), '{"name": "John Trainer"}'),
  ('00000000-0000-0000-0000-000000000004', 'sarah@fitnesshub.com', now(), '{"name": "Sarah Coach"}'),
  ('00000000-0000-0000-0000-000000000005', 'carlos@fitnesshub.com', now(), '{"name": "Carlos Fitness"}')
ON CONFLICT (id) DO NOTHING;

INSERT INTO teacher_profiles (id, user_id, name, email, specialties, on_vacation, avatar_url)
VALUES 
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000003', 'John Trainer', 'john@fitnesshub.com', ARRAY['Yoga', 'Pilates'], false, 'https://api.dicebear.com/7.x/avataaars/svg?seed=john'),
  ('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000004', 'Sarah Coach', 'sarah@fitnesshub.com', ARRAY['HIIT', 'CrossFit'], true, 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah'),
  ('00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000005', 'Carlos Fitness', 'carlos@fitnesshub.com', ARRAY['Strength Training', 'Bodybuilding'], false, 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos')
ON CONFLICT (id) DO NOTHING;

-- Inserir dados para alunos
INSERT INTO auth.users (id, email, email_confirmed_at, raw_user_meta_data)
VALUES 
  ('00000000-0000-0000-0000-000000000009', 'mike@example.com', now(), '{"name": "Mike Student"}'),
  ('00000000-0000-0000-0000-000000000010', 'lisa@example.com', now(), '{"name": "Lisa Student"}'),
  ('00000000-0000-0000-0000-000000000011', 'alex@example.com', now(), '{"name": "Alex Smith"}'),
  ('00000000-0000-0000-0000-000000000012', 'emma@example.com', now(), '{"name": "Emma Johnson"}')
ON CONFLICT (id) DO NOTHING;

INSERT INTO student_profiles (id, user_id, name, email, membership_type, last_check_in, avatar_url)
VALUES 
  ('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000009', 'Mike Student', 'mike@example.com', 'Premium', now() - interval '1 day', 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike'),
  ('00000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000010', 'Lisa Student', 'lisa@example.com', 'Standard', now() - interval '2 days', 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa'),
  ('00000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000011', 'Alex Smith', 'alex@example.com', 'Basic', null, 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex'),
  ('00000000-0000-0000-0000-000000000016', '00000000-0000-0000-0000-000000000012', 'Emma Johnson', 'emma@example.com', 'Premium', now() - interval '1 day', 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma')
ON CONFLICT (id) DO NOTHING;

-- Inserir dados para aulas (com enrolled_count inicializado como 0)
INSERT INTO classes (id, name, description, category, teacher_id, date, start_time, end_time, max_capacity, enrolled_count, image_url)
VALUES 
  ('00000000-0000-0000-0000-000000000017', 'Morning Yoga', 'Start your day with a refreshing yoga session', 'Yoga', '00000000-0000-0000-0000-000000000006', CURRENT_DATE + interval '1 day', '07:00', '08:00', 15, 0, 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?ixlib=rb-4.0.3'),
  ('00000000-0000-0000-0000-000000000018', 'HIIT Workout', 'High-intensity interval training for maximum calorie burn', 'HIIT', '00000000-0000-0000-0000-000000000007', CURRENT_DATE + interval '1 day', '12:00', '13:00', 12, 0, 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb'),
  ('00000000-0000-0000-0000-000000000019', 'Strength Training', 'Build muscle and strength with our comprehensive program', 'Strength', '00000000-0000-0000-0000-000000000008', CURRENT_DATE + interval '1 day', '18:00', '19:30', 10, 0, 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2')
ON CONFLICT (id) DO NOTHING;

-- Inserir dados para matrículas (os triggers atualizarão enrolled_count automaticamente)
INSERT INTO enrollments (id, class_id, student_id, enrolled_at, attended)
VALUES 
  ('00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000017', '00000000-0000-0000-0000-000000000013', now() - interval '5 days', false),
  ('00000000-0000-0000-0000-000000000023', '00000000-0000-0000-0000-000000000019', '00000000-0000-0000-0000-000000000013', now() - interval '4 days', false),
  ('00000000-0000-0000-0000-000000000024', '00000000-0000-0000-0000-000000000018', '00000000-0000-0000-0000-000000000014', now() - interval '3 days', false),
  ('00000000-0000-0000-0000-000000000025', '00000000-0000-0000-0000-000000000017', '00000000-0000-0000-0000-000000000016', now() - interval '2 days', false),
  ('00000000-0000-0000-0000-000000000026', '00000000-0000-0000-0000-000000000017', '00000000-0000-0000-0000-000000000016', now() - interval '1 day', false)
ON CONFLICT (id) DO NOTHING;

-- Inserir dados para férias
INSERT INTO vacations (id, teacher_id, start_date, end_date, approved)
VALUES 
  ('00000000-0000-0000-0000-000000000027', '00000000-0000-0000-0000-000000000007', CURRENT_DATE - interval '7 days', CURRENT_DATE + interval '7 days', true),
  ('00000000-0000-0000-0000-000000000028', '00000000-0000-0000-0000-000000000006', CURRENT_DATE + interval '30 days', CURRENT_DATE + interval '40 days', true)
ON CONFLICT (id) DO NOTHING;

-- Definir senhas para os usuários (senha: password)
UPDATE auth.users 
SET encrypted_password = '$2a$10$rvQDLEXFknHQtCpQz.cEAu5HdJcFWR2U2qQPFMkMqA5KPxE8BxbOi' 
WHERE email IN ('admin@fitnesshub.com', 'john@fitnesshub.com', 'sarah@fitnesshub.com', 'carlos@fitnesshub.com', 'mike@example.com', 'lisa@example.com', 'alex@example.com', 'emma@example.com');