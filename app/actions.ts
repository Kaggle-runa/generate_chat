// app/actions.ts
"use server";

import OpenAI from "openai";

export type GenerateResponse =
  | { success: true; content: string }
  | { success: false; error: string };

export interface Message {
  role: "user" | "assistant";
  content: string;
}

// OpenAI 初期化
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? "",
});

// チャット応答生成
export async function generateChatResponse(messages: Message[]): Promise<GenerateResponse> {
  console.log("generateChatResponse called");
  console.log("messages:", messages);

  const systemPrompt = `
あなたはプロンプト作成の専門家です。ユーザーの質問に対して適切な回答を提供してください。
ユーザーが作りたい画像について深掘りし、具体的で詳細なプロンプトを作成する役割を担っています。
ユーザーの希望する画像のスタイル、シーン、雰囲気、具体的な要素を正確に引き出し、AIが最適な画像を生成できるようサポートしてください。

# 手順
1. 最初に以下の文章をユーザーに与えてください。
「これから生成したい画像についていくつか質問します。具体的な内容を教えてください。」

2. 以下の項目を順番にひとつずつ質問してください。
- どんなシーンまたはテーマの画像を作りたいか
- 主な要素（人物、動物、建物、自然など）
- 背景の設定（場所や環境、時間帯など）
- 色合いや雰囲気（明るい、暗い、カラフル、モノクロなど）
- スタイル（リアル、アニメ風、抽象的、幻想的など）
- 追加したい具体的なディテールや条件（例: 「夕日の海辺」や「風に揺れる花」）

3. ユーザーが回答した内容を基に、生成する画像の詳細なプロンプトを作成してください。
4. プロンプトは具体的でわかりやすく、AIが誤解しないように簡潔に記述してください。

# Output format
・詳細なプロンプトを1つの文章で出力してください。（英語で）
・プロンプトには、シーン、スタイル、雰囲気、背景、主要な要素をすべて含めてください。
・文章は簡潔で具体的に記述し、150～300文字程度を目安にしてください。

あなたはこのルールに基づき、ユーザーの希望を反映したプロンプトを丁寧に作成してください。
  `;

  try {
    const openAIMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    ];
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      // @ts-ignore
      messages: openAIMessages,
      temperature: 0.7,
      max_tokens: 1500,
    });

    const generated = completion.choices[0].message?.content || "";

    return {
      success: true,
      content: generated,
    };
  } catch (error: any) {
    console.error("Error generating chat response:", error.response?.data || error.message || error);
    return {
      success: false,
      error: "チャット応答生成中にエラーが発生しました。",
    };
  }
}

// 画像生成
export async function generateImage(prompt: string) {
  try {
    const result = await openai.images.generate({
      prompt,
      n: 1,
      size: "1024x1024",
    });

    return { imageUrl: result.data[0].url };
  } catch (error: any) {
    console.error("画像生成エラー:", error.response?.data || error.message || error);
    return { error: "画像の生成中にエラーが発生しました。" };
  }
}
