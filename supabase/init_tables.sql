-- Criar tabela de perfis de administradores
CREATE TABLE IF NOT EXISTS admin_profiles (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    name TEXT,
    email TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de perfis de professores
CREATE TABLE IF NOT EXISTS teacher_profiles (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    name TEXT,
    email TEXT,
    specialties TEXT[],
    on_vacation BOOLEAN DEFAULT FALSE,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de perfis de alunos
CREATE TABLE IF NOT EXISTS student_profiles (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    name TEXT,
    email TEXT,
    membership_type TEXT,
    last_check_in TIMESTAMPTZ,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de aulas
CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    teacher_id UUID REFERENCES teacher_profiles(id),
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_capacity INTEGER,
    enrolled_count INTEGER DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de matrículas
CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY,
    class_id UUID REFERENCES classes(id),
    student_id UUID REFERENCES student_profiles(id),
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    attended BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de férias
CREATE TABLE IF NOT EXISTS vacations (
    id UUID PRIMARY KEY,
    teacher_id UUID REFERENCES teacher_profiles(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar triggers para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_admin_profiles_updated_at
    BEFORE UPDATE ON admin_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teacher_profiles_updated_at
    BEFORE UPDATE ON teacher_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_profiles_updated_at
    BEFORE UPDATE ON student_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_classes_updated_at
    BEFORE UPDATE ON classes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enrollments_updated_at
    BEFORE UPDATE ON enrollments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vacations_updated_at
    BEFORE UPDATE ON vacations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();