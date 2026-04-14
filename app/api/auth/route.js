import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req) {
  try {
    const { child_id, name, age, avatar } = await req.json();

    // Upsert (Insert if new, Update if exists) child profile in Supabase
    const { data, error } = await supabase
      .from('children')
      .upsert({ id: child_id, name, age, avatar, updated_at: new Date().toISOString() })
      .select()
      .single();

    if (error) throw error;
    
    return NextResponse.json({ success: true, child: data });
  } catch (error) {
    console.error("Auth API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}