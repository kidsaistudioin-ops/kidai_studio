import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const BONUS_DAYS = 15;
const WELCOME_DAYS = 7;

export async function POST(req) {
  try {
    const { referralCode, newChildId } = await req.json();

    if (!referralCode || !newChildId) {
      return NextResponse.json({ error: "referralCode and newChildId required" }, { status: 400 });
    }

    if (!supabaseAdmin) {
         return NextResponse.json({ success: true, message: "Mock referral applied" });
    }

    const { data: referrer } = await supabaseAdmin
      .from("children")
      .select("id, name, bonus_days, referral_code")
      .eq("referral_code", referralCode.toUpperCase())
      .single();

    if (!referrer) {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 404 });
    }

    if (referrer.id === newChildId) {
      return NextResponse.json({ error: "Apna khud ka code use nahi kar sakte!" }, { status: 400 });
    }

    await supabaseAdmin
      .from("children")
      .update({ bonus_days: (referrer.bonus_days || 0) + BONUS_DAYS })
      .eq("id", referrer.id);

    await supabaseAdmin
      .from("children")
      .update({
        referred_by: referralCode.toUpperCase(),
        bonus_days: WELCOME_DAYS,
      })
      .eq("id", newChildId);

    return NextResponse.json({ success: true, message: "Bonus applied!" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}