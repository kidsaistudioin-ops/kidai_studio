import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req) {
  try {
    // URL se cache key nikalna (e.g. /api/cache?key=math__fractions__easy)
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');
    
    const { data, error } = await supabase
      .from('quiz_cache')
      .select('quiz_data, hit_count')
      .eq('cache_key', key)
      .single();
        
    if (error || !data) return NextResponse.json({ success: false, message: "Cache miss" }, { status: 404 });
    return NextResponse.json({ success: true, data: data.quiz_data, hits: data.hit_count });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}