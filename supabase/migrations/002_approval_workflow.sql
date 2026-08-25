-- ========================================================
-- KidAI STUDIO - APPROVAL WORKFLOW & VERIFICATION MIGRATION
-- Migration: 002_approval_workflow.sql
-- ========================================================

ALTER TABLE library 
ADD COLUMN IF NOT EXISTS source_image_url TEXT,
ADD COLUMN IF NOT EXISTS extracted_raw_text TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending_approval',
ADD COLUMN IF NOT EXISTS ai_confidence_score INTEGER DEFAULT 95,
ADD COLUMN IF NOT EXISTS ai_verification_notes TEXT,
ADD COLUMN IF NOT EXISTS reviewed_by TEXT,
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_library_approval_status 
ON library(student_id, status);

CREATE INDEX IF NOT EXISTS idx_library_active_student 
ON library(student_id, is_active);
