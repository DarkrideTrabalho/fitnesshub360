-- Script para verificar e corrigir a integridade dos dados

-- Verificar e corrigir o enrolled_count nas classes
DO $$
BEGIN
    UPDATE classes
    SET enrolled_count = (
        SELECT COUNT(*)
        FROM enrollments
        WHERE enrollments.class_id = classes.id
    );
END $$;

-- Verificar professores de férias estão marcados corretamente
DO $$
BEGIN
    UPDATE teacher_profiles t
    SET on_vacation = true
    FROM vacations v
    WHERE t.id = v.teacher_id
    AND v.approved = true
    AND CURRENT_DATE BETWEEN v.start_date AND v.end_date
    AND t.on_vacation = false;

    UPDATE teacher_profiles t
    SET on_vacation = false
    WHERE t.on_vacation = true
    AND NOT EXISTS (
        SELECT 1 FROM vacations v
        WHERE t.id = v.teacher_id
        AND v.approved = true
        AND CURRENT_DATE BETWEEN v.start_date AND v.end_date
    );
END $$;

-- Verificar classes sem professor válido (professor em férias)
SELECT c.id, c.name, t.name as teacher_name
FROM classes c
JOIN teacher_profiles t ON c.teacher_id = t.id
WHERE t.on_vacation = true
AND c.date BETWEEN CURRENT_DATE AND CURRENT_DATE + interval '7 days';
