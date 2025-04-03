
-- Script to verify and fix data integrity

-- Update enrolled_count in classes based on actual enrollments
DO $$
BEGIN
    UPDATE classes
    SET enrolled_count = (
        SELECT COUNT(*)
        FROM enrollments
        WHERE enrollments.class_id = classes.id
    );
END $$;

-- Update on_vacation flag for teachers based on current vacations
DO $$
BEGIN
    -- Mark teachers as on vacation if they have an approved vacation that includes today
    UPDATE teacher_profiles t
    SET on_vacation = true
    FROM vacations v
    WHERE t.user_id = v.user_id
    AND v.status = 'approved'
    AND CURRENT_DATE BETWEEN v.start_date AND v.end_date
    AND t.on_vacation = false;

    -- Mark teachers as not on vacation if they don't have an active approved vacation
    UPDATE teacher_profiles t
    SET on_vacation = false
    WHERE t.on_vacation = true
    AND NOT EXISTS (
        SELECT 1 FROM vacations v
        WHERE t.user_id = v.user_id
        AND v.status = 'approved'
        AND CURRENT_DATE BETWEEN v.start_date AND v.end_date
    );
END $$;

-- Update teacher_name in classes to match the current teacher name
DO $$
BEGIN
    UPDATE classes c
    SET teacher_name = t.name
    FROM teacher_profiles t
    WHERE c.teacher_id = t.id
    AND (c.teacher_name IS NULL OR c.teacher_name != t.name);
END $$;

-- Update teacher_name in vacations to match the current teacher name
DO $$
BEGIN
    UPDATE vacations v
    SET teacher_name = t.name
    FROM teacher_profiles t
    WHERE v.user_id = t.user_id
    AND (v.teacher_name IS NULL OR v.teacher_name != t.name);
END $$;

-- List classes scheduled with teachers on vacation in the next 7 days
SELECT c.id, c.name, t.name as teacher_name, c.date, v.start_date, v.end_date
FROM classes c
JOIN teacher_profiles t ON c.teacher_id = t.id
JOIN vacations v ON t.user_id = v.user_id
WHERE v.status = 'approved'
AND c.date BETWEEN CURRENT_DATE AND CURRENT_DATE + interval '7 days'
AND c.date BETWEEN v.start_date AND v.end_date
ORDER BY c.date;

-- List overdue payments
SELECT sp.id, s.name as student_name, sp.amount, sp.due_date, NOW() - sp.due_date as days_overdue
FROM student_payments sp
JOIN student_profiles s ON sp.student_id = s.id
WHERE sp.status = 'overdue'
ORDER BY days_overdue DESC;

-- Check for classes at full capacity
SELECT c.id, c.name, c.date, c.start_time, c.max_capacity, c.enrolled_count, 
       (c.enrolled_count >= c.max_capacity) as is_full
FROM classes c
WHERE c.date >= CURRENT_DATE
ORDER BY c.date, c.start_time;
