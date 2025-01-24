// app/api/chat/route.ts
import { NextResponse } from "next/server";
import { generateChatResponse, Message, GenerateResponse } from "../../actions";

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const response: GenerateResponse = await generateChatResponse(messages);

    if (!response.success) {
      // エラーの場合
      return NextResponse.json({ error: response.error }, { status: 500 });
    } else {
      // 成功の場合、content フィールドを返す
      return NextResponse.json({
        content: response.content,
      });
    }
  } catch (error) {
    console.error("API /api/chat エラー:", error);
    return NextResponse.json({ error: "内部サーバーエラー" }, { status: 500 });
  }
}
