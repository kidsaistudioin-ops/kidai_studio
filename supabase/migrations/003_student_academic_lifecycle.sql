-- ============================================================================
-- MIGRATION 003: STUDENT ACADEMIC LIFECYCLE, AGE DYNAMICS & CLASS PROMOTION
-- ============================================================================

-- 1. Alter students table to add birth_date, academic year tracking, and medium
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS dob DATE,
ADD COLUMN IF NOT EXISTS medium TEXT DEFAULT 'English',
ADD COLUMN IF NOT EXISTS academic_session_start DATE DEFAULT '2026-04-01',
ADD COLUMN IF NOT EXISTS last_class_promoted_at TIMESTAMPTZ DEFAULT now();

-- 2. Function to check if a student is eligible for an Academic Class Promotion
CREATE OR REPLACE FUNCTION get_student_academic_status(p_student_id UUID)
RETURNS TABLE (
  student_id UUID,
  student_name TEXT,
  calculated_age INTEGER,
  current_class INTEGER,
  suggested_class INTEGER,
  board TEXT,
  medium TEXT,
  is_new_session_due BOOLEAN
) LANGUAGE plpgsql AS $$
DECLARE
  v_student RECORD;
  v_age INTEGER;
  v_months_since_promo NUMERIC;
  v_is_due BOOLEAN := false;
BEGIN
  SELECT * INTO v_student FROM students WHERE id = p_student_id;
  
  IF NOT FOUND THEN
    RETURN;
  END IF;

  -- Calculate age dynamically from DOB or fallback
  IF v_student.dob IS NOT NULL THEN
    v_age := EXTRACT(YEAR FROM age(current_date, v_student.dob))::INTEGER;
  ELSE
    -- Estimated age from current_class (Class 1 = 6yo, Class 5 = 10yo)
    v_age := v_student.current_class + 5;
  END IF;

  -- Check if 10+ months have passed since last promotion OR current month is April/May (Indian session change)
  v_months_since_promo := EXTRACT(EPOCH FROM (now() - coalesce(v_student.last_class_promoted_at, v_student.created_at))) / 2592000;
  
  IF (v_months_since_promo >= 10 OR (EXTRACT(MONTH FROM current_date) IN (3, 4, 5) AND v_months_since_promo >= 6)) 
     AND v_student.current_class < 12 THEN
    v_is_due := true;
  END IF;

  RETURN QUERY SELECT 
    v_student.id,
    v_student.name,
    v_age,
    v_student.current_class,
    LEAST(12, v_student.current_class + 1),
    v_student.board,
    coalesce(v_student.medium, 'English'),
    v_is_due;
END;
$$;

-- 3. Function to complete class promotion with reward XP
CREATE OR REPLACE FUNCTION confirm_class_promotion(
  p_student_id UUID,
  p_new_class INTEGER
) RETURNS JSONB LANGUAGE plpgsql AS $$
DECLARE
  v_old_class INTEGER;
  v_reward_xp INTEGER := 100;
BEGIN
  SELECT current_class INTO v_old_class FROM students WHERE id = p_student_id;

  -- Log progression
  INSERT INTO class_progressions (
    student_id, from_class, to_class, progression_date, notes
  ) VALUES (
    p_student_id, v_old_class, p_new_class, current_date, 'Promoted to new academic session'
  );

  -- Update student profile with reward XP and promotion timestamp
  UPDATE students
  SET 
    current_class = p_new_class,
    total_xp = coalesce(total_xp, 0) + v_reward_xp,
    last_class_promoted_at = now()
  WHERE id = p_student_id;

  RETURN jsonb_build_object(
    'success', true,
    'old_class', v_old_class,
    'new_class', p_new_class,
    'xp_awarded', v_reward_xp
  );
END;
$$;
