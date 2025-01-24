import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

export default function Home() {
  return (
    <div className="container mx-auto p-4 bg-blue-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">夢イラスト生成</h1>
      <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-blue-700 mb-1">
            カテゴリー
          </label>
          <Select>
            <SelectTrigger id="category" className="border-blue-300 focus:border-blue-500">
              <SelectValue placeholder="カテゴリーを選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="landscape">風景</SelectItem>
              <SelectItem value="portrait">人物</SelectItem>
              <SelectItem value="abstract">抽象</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-blue-700 mb-1">
            画像の説明
          </label>
          <Textarea
            id="description"
            placeholder="生成したい画像の説明を入力してください"
            className="border-blue-300 focus:border-blue-500"
          />
        </div>
        <Link href="/chat">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">チャットで詳細を決める</Button>
        </Link>
      </div>
    </div>
  )
}