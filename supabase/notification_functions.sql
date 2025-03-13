
-- Create stored procedure for adding notifications
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

-- Create stored procedure for marking notifications as read
CREATE OR REPLACE FUNCTION mark_notification_read(
    p_notification_id UUID
) RETURNS void AS $$
BEGIN
    UPDATE notifications
    SET read = TRUE
    WHERE id = p_notification_id;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get user notifications
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

-- Create a function to get pending vacation approvals
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

-- Create a function to save user settings
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

-- Create a function to get user settings
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
