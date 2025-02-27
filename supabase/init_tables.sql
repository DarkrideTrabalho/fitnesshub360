
-- Criar tabelas para os diferentes tipos de usuários

-- Tabela para administradores
CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tabela para professores
CREATE TABLE IF NOT EXISTS teacher_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  specialties TEXT[] DEFAULT '{}',
  on_vacation BOOLEAN DEFAULT FALSE,
  vacation_start_date TIMESTAMP WITH TIME ZONE,
  vacation_end_date TIMESTAMP WITH TIME ZONE,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tabela para alunos
CREATE TABLE IF NOT EXISTS student_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  membership_type TEXT DEFAULT 'Standard',
  last_check_in TIMESTAMP WITH TIME ZONE,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tabela para aulas
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  teacher_id UUID REFERENCES teacher_profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_capacity INTEGER NOT NULL,
  enrolled_count INTEGER DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tabela para matrículas
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  attended BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(class_id, student_id)
);

-- Tabela para férias
CREATE TABLE IF NOT EXISTS vacations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES teacher_profiles(id) ON DELETE CASCADE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Criar políticas RLS (Row Level Security)

-- Habilitar RLS em todas as tabelas
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE vacations ENABLE ROW LEVEL SECURITY;

-- Políticas para admin_profiles
CREATE POLICY "Admins can view all admin profiles"
  ON admin_profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles ap
      WHERE ap.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own admin profile"
  ON admin_profiles
  FOR SELECT
  USING (user_id = auth.uid());

-- Políticas para teacher_profiles
CREATE POLICY "Admins can view all teacher profiles"
  ON teacher_profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles ap
      WHERE ap.user_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can view their own profile"
  ON teacher_profiles
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Students can view teacher profiles"
  ON teacher_profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM student_profiles sp
      WHERE sp.user_id = auth.uid()
    )
  );

-- Políticas para student_profiles
CREATE POLICY "Admins can view all student profiles"
  ON student_profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles ap
      WHERE ap.user_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can view student profiles"
  ON student_profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM teacher_profiles tp
      WHERE tp.user_id = auth.uid()
    )
  );

CREATE POLICY "Students can view their own profile"
  ON student_profiles
  FOR SELECT
  USING (user_id = auth.uid());

-- Políticas para classes
CREATE POLICY "Anyone can view classes"
  ON classes
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert/update/delete classes"
  ON classes
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles ap
      WHERE ap.user_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can update their own classes"
  ON classes
  FOR UPDATE
  USING (
    teacher_id IN (
      SELECT id FROM teacher_profiles
      WHERE user_id = auth.uid()
    )
  );

-- Políticas para enrollments
CREATE POLICY "Admins can view all enrollments"
  ON enrollments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles ap
      WHERE ap.user_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can view enrollments for their classes"
  ON enrollments
  FOR SELECT
  USING (
    class_id IN (
      SELECT id FROM classes
      WHERE teacher_id IN (
        SELECT id FROM teacher_profiles
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Students can view their own enrollments"
  ON enrollments
  FOR SELECT
  USING (
    student_id IN (
      SELECT id FROM student_profiles
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Students can enroll themselves"
  ON enrollments
  FOR INSERT
  WITH CHECK (
    student_id IN (
      SELECT id FROM student_profiles
      WHERE user_id = auth.uid()
    )
  );

-- Políticas para vacations
CREATE POLICY "Admins can view all vacations"
  ON vacations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles ap
      WHERE ap.user_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can view their own vacations"
  ON vacations
  FOR SELECT
  USING (
    teacher_id IN (
      SELECT id FROM teacher_profiles
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can request vacations"
  ON vacations
  FOR INSERT
  WITH CHECK (
    teacher_id IN (
      SELECT id FROM teacher_profiles
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update vacations"
  ON vacations
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles ap
      WHERE ap.user_id = auth.uid()
    )
  );

-- Criar função para verificar tipo de usuário
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Verificar se é admin
  SELECT 'admin' INTO user_role
  FROM admin_profiles
  WHERE user_id = $1
  LIMIT 1;
  
  IF user_role IS NOT NULL THEN
    RETURN user_role;
  END IF;
  
  -- Verificar se é professor
  SELECT 'teacher' INTO user_role
  FROM teacher_profiles
  WHERE user_id = $1
  LIMIT 1;
  
  IF user_role IS NOT NULL THEN
    RETURN user_role;
  END IF;
  
  -- Verificar se é aluno
  SELECT 'student' INTO user_role
  FROM student_profiles
  WHERE user_id = $1
  LIMIT 1;
  
  IF user_role IS NOT NULL THEN
    RETURN user_role;
  END IF;
  
  -- Se não for nenhum dos tipos
  RETURN 'unknown';
END;
$$;

-- Criar função para adicionar usuário após registro
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Por padrão, novos usuários são alunos
  INSERT INTO student_profiles (user_id, name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name', NEW.email);
  
  RETURN NEW;
END;
$$;

-- Trigger para adicionar usuário após registro
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
