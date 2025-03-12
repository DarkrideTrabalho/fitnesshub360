
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
