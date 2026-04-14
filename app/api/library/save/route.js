import { NextResponse } from "next/server";
import { saveLibraryItem, updateRevisionCount } from "@/lib/supabase";

export async function POST(req) {
  try {
    const { childId, itemData, action } = await req.json();

    // MOCK MODE: Agar dummy key hai toh database call bypass kar do
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("dummy")) {
      return NextResponse.json({ success: true, data: { id: "LIB_MOCK", ...itemData } });
    }

    if (action === "revise" && itemData.libraryId) {
      await updateRevisionCount(itemData.libraryId);
      return NextResponse.json({ success: true });
    }

    if (!childId || !itemData) {
      return NextResponse.json({ error: "childId and itemData required" }, { status: 400 });
    }

    const saved = await saveLibraryItem(childId, itemData);
    return NextResponse.json({ success: !!saved, data: saved });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
