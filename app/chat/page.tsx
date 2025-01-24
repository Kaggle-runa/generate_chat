// app/chat/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation" // Next.js 13以降の場合
// import { useRouter } from "next/router" // Next.js 12以前の場合
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// @ts-ignore
import { Message } from "../api/chat/route"

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // 初期メッセージを設定するための useEffect
  useEffect(() => {
    // 既にメッセージが存在しない場合のみ初期メッセージを追加
    if (messages.length === 0) {
      const initialMessage: Message = {
        role: "assistant",
        content: "こんにちは、あなたの生成したい画像を教えて下さい！",
      }
      setMessages([initialMessage])
    }
  }, [messages.length])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = { role: "user", content: input }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: updatedMessages }),
      })

      const data = await response.json()

      if (response.ok) {
        const assistantMessage: Message = { role: "assistant", content: data.content }
        setMessages([...updatedMessages, assistantMessage])
      } else {
        console.error(data.error)
        alert(`チャットエラー: ${data.error}`)
      }
    } catch (error) {
      console.error("チャットエラー:", error)
      alert("チャット中に予期せぬエラーが発生しました。")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateImage = async () => {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage && lastMessage.role === "assistant") {
      setIsLoading(true)
      try {
        const response = await fetch("/api/generate-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: lastMessage.content }),
        })

        const data = await response.json()

        if (response.ok) {
          setImageUrl(data.imageUrl)
        } else {
          console.error(data.error)
          alert(`画像生成エラー: ${data.error}`)
        }
      } catch (error) {
        console.error("画像生成エラー:", error)
        alert("画像生成中に予期せぬエラーが発生しました。")
      } finally {
        setIsLoading(false)
      }
    } else {
      alert("画像生成はアシスタントからのメッセージ後にのみ可能です。")
    }
  }

  // 戻るボタンのハンドラー
  const handleBack = () => {
    router.back()
  }

  return (
    <div className="container mx-auto p-4 bg-blue-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-blue-800">チャットで作成したい画像を相談</h1>
        <Button onClick={handleBack} className="bg-gray-600 hover:bg-gray-700 text-white">
          戻る
        </Button>
      </div>
      <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        <div className="h-[60vh] overflow-y-auto border border-blue-200 rounded p-4">
          {messages.map((m, index) => (
            <div key={index} className={`mb-4 ${m.role === "user" ? "text-right" : "text-left"}`}>
              <span className={`inline-block p-2 rounded ${m.role === "user" ? "bg-blue-100" : "bg-gray-100"}`}>
                {m.content}
              </span>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="メッセージを入力..."
            className="border-blue-300 focus:border-blue-500"
            disabled={isLoading}
          />
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
            {isLoading ? "送信中..." : "送信"}
          </Button>
        </form>
        <Button onClick={handleGenerateImage} className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
          {isLoading ? "生成中..." : "画像を生成"}
        </Button>
        {imageUrl && (
          <div>
            <img
              src={imageUrl}
              alt="生成された画像"
              className="mt-4 max-w-full h-auto rounded-lg shadow-md"
            />
          </div>
        )}
      </div>
    </div>
  )
}
