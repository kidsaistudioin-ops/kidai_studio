-- ============================================
-- KidAI STUDIO - COMPLETE DATABASE SCHEMA
-- Scalable: 10,000+ students, 2000+ quizzes
-- ============================================

-- 1. STUDENTS TABLE
create table students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique,
  parent_email text,
  current_class integer not null check (current_class between 1 and 12),
  board text not null default 'CBSE', -- CBSE, ICSE, State
  language text default 'hindi',
  avatar text default 'robot1',
  total_xp integer default 0,
  coins integer default 100,
  streak_days integer default 0,
  last_active date default current_date,
  created_at timestamptz default now()
);

-- 2. SUBJECTS TABLE
create table subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,           -- "Mathematics", "Science"
  name_hindi text,              -- "गणित", "विज्ञान"
  class_level integer not null,
  board text not null default 'CBSE',
  icon text,                    -- emoji or icon name
  color text,                   -- UI color
  is_active boolean default true
);

-- 3. CHAPTERS TABLE
create table chapters (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid references subjects(id) on delete cascade,
  chapter_number integer not null,
  title text not null,
  title_hindi text,
  description text,
  total_quizzes integer default 0,
  difficulty text default 'medium', -- easy, medium, hard
  is_active boolean default true
);

-- 4. QUIZZES TABLE (2000+ quizzes scalable)
create table quizzes (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid references chapters(id) on delete cascade,
  subject_id uuid references subjects(id),
  class_level integer not null,
  question text not null,
  question_hindi text,          -- Hindi version
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_option text not null check (correct_option in ('a','b','c','d')),
  explanation text,             -- Why this answer is correct
  explanation_hindi text,
  difficulty integer default 2 check (difficulty between 1 and 5),
  topic_tags text[],            -- ["photosynthesis", "plants"]
  source text default 'ncert',  -- ncert, book, ai_generated
  created_at timestamptz default now()
);

-- INDEX for fast quiz fetching
create index idx_quizzes_chapter on quizzes(chapter_id);
create index idx_quizzes_class on quizzes(class_level);
create index idx_quizzes_subject on quizzes(subject_id);

-- 5. STUDENT QUIZ ATTEMPTS (Core tracking table)
create table quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  quiz_id uuid references quizzes(id) on delete cascade,
  
  -- What happened
  selected_option text,         -- null = skipped
  is_correct boolean,
  time_taken_seconds integer,
  
  -- Spaced Repetition fields
  attempt_count integer default 1,
  last_score integer default 0, -- 0-100
  ease_factor float default 2.5, -- SRS algorithm
  interval_days integer default 1,
  next_review_date date default current_date + 1,
  
  -- Status
  status text default 'new',   -- new, learning, review, mastered, skipped
  
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  -- One record per student per quiz (upsert)
  unique(student_id, quiz_id)
);

-- INDEX for fast "what to review today"
create index idx_attempts_review on quiz_attempts(student_id, next_review_date, status);
create index idx_attempts_student on quiz_attempts(student_id);

-- 6. DAILY SESSIONS TABLE
create table daily_sessions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  session_date date default current_date,
  
  quizzes_attempted integer default 0,
  quizzes_correct integer default 0,
  quizzes_skipped integer default 0,
  time_spent_minutes integer default 0,
  xp_earned integer default 0,
  subjects_covered text[],
  
  created_at timestamptz default now()
);

-- 7. CLASS PROGRESSION TABLE (Year-end class change)
create table class_progressions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  from_class integer not null,
  to_class integer not null,
  progression_date date default current_date,
  
  -- What carries forward
  weak_topics_carried text[],   -- Topics still needing work
  mastered_topics text[],       -- Topics fully done
  
  notes text
);

-- 8. AI TUTOR CONVERSATIONS TABLE
create table arya_conversations (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  session_id text,              -- Group messages in one session
  
  role text not null,           -- 'student' or 'arya'
  message text not null,
  context_quiz_id uuid,         -- If talking about specific quiz
  context_subject text,
  
  created_at timestamptz default now()
);

-- ============================================
-- HELPER VIEWS
-- ============================================

-- View: Student's weak topics (score < 70%)
create view student_weak_topics as
select 
  qa.student_id,
  q.subject_id,
  q.chapter_id,
  q.topic_tags,
  count(*) as attempts,
  avg(qa.last_score) as avg_score,
  max(qa.next_review_date) as next_review
from quiz_attempts qa
join quizzes q on q.id = qa.quiz_id
where qa.last_score < 70
  and qa.status != 'mastered'
group by qa.student_id, q.subject_id, q.chapter_id, q.topic_tags;

-- View: Today's review queue for any student
create view todays_review_queue as
select 
  qa.student_id,
  qa.quiz_id,
  q.question,
  q.difficulty,
  q.chapter_id,
  qa.last_score,
  qa.attempt_count,
  qa.status,
  case 
    when qa.status = 'skipped' then 1      -- Highest priority
    when qa.last_score < 50 then 2         -- Very weak
    when qa.last_score < 70 then 3         -- Weak  
    when qa.status = 'new' then 4          -- Never seen
    else 5                                  -- Review
  end as priority
from quiz_attempts qa
join quizzes q on q.id = qa.quiz_id
where qa.next_review_date <= current_date
order by priority, qa.next_review_date;

-- ============================================
-- SPACED REPETITION FUNCTION
-- ============================================
create or replace function calculate_next_review(
  p_score integer,
  p_attempt_count integer,
  p_ease_factor float,
  p_interval integer
) returns table(
  next_interval integer,
  new_ease_factor float,
  new_status text
) language plpgsql as $$
declare
  v_interval integer;
  v_ease float;
  v_status text;
begin
  -- SM-2 Algorithm (used by Anki, Duolingo)
  if p_score >= 85 then
    -- Great! Increase interval
    if p_attempt_count = 1 then
      v_interval := 1;
    elsif p_attempt_count = 2 then
      v_interval := 6;
    else
      v_interval := round(p_interval * p_ease_factor);
    end if;
    v_ease := p_ease_factor + 0.1;
    v_status := case when p_score = 100 and p_attempt_count > 3 
                     then 'mastered' else 'review' end;
                     
  elsif p_score >= 70 then
    -- OK, normal interval
    v_interval := p_interval;
    v_ease := p_ease_factor;
    v_status := 'learning';
    
  elsif p_score >= 50 then
    -- Weak, review sooner
    v_interval := 3;
    v_ease := greatest(1.3, p_ease_factor - 0.15);
    v_status := 'learning';
    
  else
    -- Very weak, review tomorrow
    v_interval := 1;
    v_ease := greatest(1.3, p_ease_factor - 0.2);
    v_status := 'learning';
  end if;

  -- Cap interval at 30 days max
  v_interval := least(v_interval, 30);
  
  return query select v_interval, v_ease, v_status;
end;
$$;

-- ============================================
-- COINS UPDATE FUNCTION
-- ============================================
create or replace function update_coins(
  p_student_id uuid,
  p_coins integer
) returns void language plpgsql as $$
begin
  update students
  set coins = coalesce(coins, 0) + p_coins
  where id = p_student_id;
end;
$$;

-- 9. SAVED GAMES TABLE (For resuming single-player games)
create table saved_games (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  game_type text not null,      -- 'chess', 'snakes', 'ludo'
  game_state jsonb not null,    -- { p1Pos: 20, p2Pos: 34, turn: 'p1', board: [...] }
  vs_ai boolean default true,
  last_played timestamptz default now()
);


-- ============================================
-- CLASS PROMOTION FUNCTION
-- ============================================
create or replace function promote_student_class(
  p_student_id uuid,
  p_new_class integer
) returns void language plpgsql as $$
declare
  v_old_class integer;
  v_weak_topics text[];
  v_mastered_topics text[];
begin
  -- Get current class
  select current_class into v_old_class 
  from students where id = p_student_id;
  
  -- Find weak topics to carry forward
  select array_agg(distinct tag)
  into v_weak_topics
  from quiz_attempts qa
  join quizzes q on q.id = qa.quiz_id
  cross join unnest(q.topic_tags) as tag
  where qa.student_id = p_student_id
    and qa.last_score < 70
    and q.class_level = v_old_class;
  
  -- Find mastered topics
  select array_agg(distinct tag)
  into v_mastered_topics
  from quiz_attempts qa
  join quizzes q on q.id = qa.quiz_id
  cross join unnest(q.topic_tags) as tag
  where qa.student_id = p_student_id
    and qa.status = 'mastered'
    and q.class_level = v_old_class;

  -- Log the progression
  insert into class_progressions (
    student_id, from_class, to_class,
    weak_topics_carried, mastered_topics
  ) values (
    p_student_id, v_old_class, p_new_class,
    v_weak_topics, v_mastered_topics
  );

  -- Update student class
  update students 
  set current_class = p_new_class
  where id = p_student_id;

  -- Reset mastered quizzes of old class EXCEPT weak ones
  -- Weak topics stay in review queue
  update quiz_attempts qa
  set status = 'archived',
      next_review_date = null
  from quizzes q
  where qa.quiz_id = q.id
    and qa.student_id = p_student_id
    and q.class_level = v_old_class
    and qa.status = 'mastered';
    
  -- Keep weak topics active for carry-forward revision
  -- (no update needed, they stay in review queue)

end;
$$;

-- ============================================
-- 10. STUDENT FOCUS AREAS (Parent Instructions)
-- ============================================
create table student_focus_areas (
  id bigint generated by default as identity primary key,
  student_id text,
  topic_tag text not null,
  priority int default 1,
  created_at timestamptz default now(),
  constraint unique_student_topic unique (student_id, topic_tag)
);

-- ============================================
-- 11. PARENT & AI CHAT (Guidance Box)
-- ============================================
create table parent_ai_chat (
  id uuid primary key default gen_random_uuid(),
  parent_id text not null,
  role text not null,
  message text not null,
  created_at timestamptz default now()
);

-- ============================================
-- 12. SMART PLATFORM FEEDBACK (For Admin)
-- ============================================
create table platform_feedback (
  id uuid primary key default gen_random_uuid(),
  sender_id text,
  feedback_text text not null,
  ai_analysis text,
  ai_can_fix boolean default false,
  status text default 'pending_admin',
  created_at timestamptz default now()
);
-- ============================================
-- 13. BLOGS TABLE (For SEO & Content Marketing)
-- ============================================
create table blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  image_url text,
  meta_description text,
  content text not null,
  created_at timestamptz default now()
);

-- ============================================
-- 14. REVIEWS TABLE (For 5-Star Ratings & Trust)
-- ============================================
create table reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  status text default 'approved',
  created_at timestamptz default now()
);
CREATE TABLE admin_scan_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_age INTEGER,
  medium TEXT,
  subject TEXT,
  status TEXT,
  flag_reason TEXT,
  generated_game JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
