export type Report = {
  id: number
  title: string
  text: string
  is_diary: number // 日記フラグ
  tags: string[] // SSV形式
  created_at: Date
  updated_at: Date
}

export type FormReport = {
  title: string
  text: string
  // is_diary: boolean // 内部で生成する
  // tags: string[] // 内部でSSVを生成する
}
