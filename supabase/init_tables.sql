
-- Create tables with improved structure

-- Create admin profiles table
CREATE TABLE IF NOT EXISTS admin_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users NOT NULL,
    name TEXT,
    email TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create teacher profiles table
CREATE TABLE IF NOT EXISTS teacher_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users NOT NULL,
    name TEXT,
    email TEXT,
    specialties TEXT[],
    on_vacation BOOLEAN DEFAULT FALSE,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create student profiles table
CREATE TABLE IF NOT EXISTS student_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users NOT NULL,
    name TEXT,
    email TEXT,
    membership_type TEXT,
    membership_status TEXT DEFAULT 'active',
    last_check_in TIMESTAMPTZ,
    avatar_url TEXT,
    tax_number TEXT,
    phone_number TEXT,
    billing_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT check_membership_type CHECK (membership_type IN ('Basic', 'Standard', 'Premium'))
);

-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    teacher_id UUID REFERENCES teacher_profiles(id),
    teacher_name TEXT,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_capacity INTEGER,
    enrolled_count INTEGER DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT check_times CHECK (start_time < end_time)
);

-- Create enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES classes(id),
    student_id UUID REFERENCES student_profiles(id),
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    attended BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create vacations table
CREATE TABLE IF NOT EXISTS vacations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES teacher_profiles(id),
    teacher_name TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT check_dates CHECK (start_date <= end_date)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user settings table
CREATE TABLE IF NOT EXISTS user_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users,
    theme TEXT NOT NULL DEFAULT 'system',
    language TEXT NOT NULL DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create student payments table
CREATE TABLE IF NOT EXISTS student_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES student_profiles(id),
    amount NUMERIC NOT NULL,
    payment_date DATE NOT NULL,
    due_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create teacher classes mapping table
CREATE TABLE IF NOT EXISTS teacher_classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES teacher_profiles(id),
    class_id UUID REFERENCES classes(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create triggers to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for each table with updated_at column
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

CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON user_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_payments_updated_at
    BEFORE UPDATE ON student_payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to update enrolled_count
CREATE OR REPLACE FUNCTION update_enrolled_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE classes SET enrolled_count = enrolled_count + 1
        WHERE id = NEW.class_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE classes SET enrolled_count = enrolled_count - 1
        WHERE id = OLD.class_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for enrollment count
CREATE TRIGGER update_class_enrolled_count_insert
    AFTER INSERT ON enrollments
    FOR EACH ROW
    EXECUTE FUNCTION update_enrolled_count();

CREATE TRIGGER update_class_enrolled_count_delete
    AFTER DELETE ON enrollments
    FOR EACH ROW
    EXECUTE FUNCTION update_enrolled_count();

-- Create function to create notifications
CREATE OR REPLACE FUNCTION create_notification(
    p_user_id UUID,
    p_title TEXT,
    p_message TEXT,
    p_type TEXT
) RETURNS void AS $$
BEGIN
    INSERT INTO notifications (user_id, title, message, type, read)
    VALUES (p_user_id, p_title, p_message, p_type, FALSE);
END;
$$ LANGUAGE plpgsql;

-- Create function to mark notifications as read
CREATE OR REPLACE FUNCTION mark_notification_read(
    p_notification_id UUID
) RETURNS void AS $$
BEGIN
    UPDATE notifications
    SET read = TRUE
    WHERE id = p_notification_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to get user notifications
CREATE OR REPLACE FUNCTION get_user_notifications(
    p_user_id UUID
) RETURNS SETOF notifications AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM notifications
    WHERE user_id = p_user_id OR user_id IS NULL
    ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to get pending vacation approvals
CREATE OR REPLACE FUNCTION get_pending_vacation_approvals()
RETURNS SETOF vacations AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM vacations
    WHERE approved = FALSE
    ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to save user settings
CREATE OR REPLACE FUNCTION save_user_settings(
    p_user_id UUID,
    p_theme TEXT,
    p_language TEXT
) RETURNS void AS $$
BEGIN
    INSERT INTO user_settings (user_id, theme, language)
    VALUES (p_user_id, p_theme, p_language)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        theme = p_theme,
        language = p_language,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Create function to get user settings
CREATE OR REPLACE FUNCTION get_user_settings(
    p_user_id UUID
) RETURNS JSON AS $$
DECLARE
    settings_record user_settings%ROWTYPE;
BEGIN
    SELECT * INTO settings_record FROM user_settings WHERE user_id = p_user_id;
    
    IF NOT FOUND THEN
        RETURN json_build_object(
            'theme', 'system',
            'language', 'en'
        );
    END IF;
    
    RETURN row_to_json(settings_record);
END;
$$ LANGUAGE plpgsql;

-- Create indexes for improved performance
CREATE INDEX IF NOT EXISTS idx_enrollments_class_id ON enrollments(class_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_classes_date ON classes(date);
CREATE INDEX IF NOT EXISTS idx_vacations_teacher_id ON vacations(teacher_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_student_payments_student_id ON student_payments(student_id);
