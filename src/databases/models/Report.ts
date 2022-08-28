export type Report = {
  id: number
  title: string
  text: string
  tags: string[] // SSV形式
  created_at: Date
  updated_at: Date
}

export type FormReport = {
  title: string
  text: string
  // tags: string[] // 内部でSSVを生成する
}
