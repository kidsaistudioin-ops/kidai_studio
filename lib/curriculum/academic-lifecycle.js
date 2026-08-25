// ============================================================================
// ACADEMIC LIFECYCLE & ANNUAL CLASS PROMOTION ENGINE (Indian School System)
// ============================================================================

import { supabase } from "@/lib/supabase";

/**
 * Dynamically calculate exact age from Date of Birth
 */
export function calculateDynamicAge(dobString, fallbackAge = 10) {
  if (!dobString) return parseInt(fallbackAge) || 10;
  const dob = new Date(dobString);
  const diffMs = Date.now() - dob.getTime();
  const ageDt = new Date(diffMs);
  return Math.abs(ageDt.getUTCFullYear() - 1970);
}

/**
 * Checks if the student is due for an annual class promotion (Indian April Session)
 */
export function checkAnnualClassPromotion() {
  if (typeof window === "undefined") return { isDue: false };

  const currentClass = parseInt(localStorage.getItem("kidai_student_class") || "5");
  if (currentClass >= 12) return { isDue: false }; // Max school class

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12 (April is 4)

  // Last year when the student was promoted
  const lastPromotedYear = parseInt(
    localStorage.getItem("kidai_last_promoted_year") || 
    (currentMonth < 4 ? (currentYear - 1).toString() : currentYear.toString())
  );

  // If already dismissed for this academic session
  const currentSessionKey = `session_${currentYear}_promoted`;
  if (localStorage.getItem(currentSessionKey)) {
    return { isDue: false };
  }

  // In India: School session starts in April (Month 4). If we are in or past April of a new year:
  const isNewSession = currentYear > lastPromotedYear || (currentMonth >= 4 && !localStorage.getItem(currentSessionKey));

  // Determine academic session string (e.g., "2026-2027")
  const sessionString = currentMonth >= 4 
    ? `${currentYear}-${currentYear + 1}` 
    : `${currentYear - 1}-${currentYear}`;

  return {
    isDue: isNewSession,
    currentClass,
    suggestedNextClass: Math.min(12, currentClass + 1),
    academicSession: sessionString,
    sessionKey: currentSessionKey
  };
}

/**
 * Confirm and save student class promotion
 */
export async function executeClassPromotion(newClass) {
  if (typeof window === "undefined") return;

  const currentYear = new Date().getFullYear();
  const currentSessionKey = `session_${currentYear}_promoted`;

  // 1. Update localStorage
  localStorage.setItem("kidai_student_class", newClass.toString());
  localStorage.setItem("kidai_last_promoted_year", currentYear.toString());
  localStorage.setItem(currentSessionKey, "true");

  // 2. Award +100 XP Promotion Bonus
  const currentXp = parseInt(localStorage.getItem("kidai_xp") || "0");
  localStorage.setItem("kidai_xp", (currentXp + 100).toString());

  // 3. Update Supabase if student_id exists
  const studentId = localStorage.getItem("kidai_student_id");
  if (studentId && studentId !== "student_123" && studentId !== "guest_123") {
    try {
      await supabase.rpc("confirm_class_promotion", {
        p_student_id: studentId,
        p_new_class: parseInt(newClass)
      });
    } catch (e) {
      console.warn("Supabase promotion sync failed:", e.message);
    }
  }

  return { success: true, newClass, xpBonus: 100 };
}

/**
 * Dismiss promotion reminder for now
 */
export function dismissPromotionReminder() {
  if (typeof window === "undefined") return;
  const currentYear = new Date().getFullYear();
  localStorage.setItem(`session_${currentYear}_promoted`, "dismissed");
}
