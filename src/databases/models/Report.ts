import { RegexUtil } from '~~/src/utils/RegexUtil'

export type DBReport = {
  id: number
  title: string
  text: string
  is_diary: number // 0, 1
  tags: string // SSV形式
  created_at: string // iso8601 UTC
  updated_at: string // iso8601 UTC
}

export type Report = {
  id: number
  title: string
  text: string
  isDiary: boolean
  tags: string[] // SSV形式
  createdAt: Date
  updatedAt: Date
}

export type FormReport = {
  title: string
  text: string
  // is_diary: boolean // 内部で生成する
  // tags: string[] // 内部でSSVを生成する
}

export const formatReport = (db: DBReport): Report => {
  return {
    id: db.id,
    title: db.title,
    text: db.text,
    isDiary: Boolean(db.is_diary),
    tags: db.tags ? db.tags.split(' ') : [],
    createdAt: new Date(db.created_at),
    updatedAt: new Date(db.updated_at),
  }
}

export const parseReport = (form: FormReport) => {
  // タイトルが日記形式か判定
  const isDiary = RegexUtil.isDiaryTitle(form.title) ? 1 : 0

  // 本文からハッシュタグを抽出
  const hashtags = (form.text ?? '')
    .split(RegexUtil.separateRegex)
    .filter(text => RegexUtil.isHashtag(text))
  const ssvTag = Array.from(new Set(hashtags)).join(' ')

  return {
    title: form.title,
    text: form.text,
    is_diary: isDiary,
    tags: ssvTag ?? null,
  }
}
