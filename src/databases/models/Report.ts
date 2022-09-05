import { RegexUtil } from '~~/src/utils/RegexUtil'

// TODO: アイコンつけたくない...？

export type DBReport = {
  id: number
  title: string // unique
  text: string
  is_diary: number // 0, 1
  is_hashtag: number // 0, 1
  tags: string // SSV形式
  created_at: string // iso8601 UTC
  updated_at: string // iso8601 UTC
}

export type Report = {
  id: number
  title: string // unique
  text: string
  isDiary: boolean
  is_hashtag: boolean
  tags: string[] // SSV形式
  createdAt: Date
  updatedAt: Date
}

export type FormReport = {
  title: string // unique
  text: string
}

export const formatReport = (db: DBReport): Report => {
  return {
    id: db.id,
    title: db.title,
    text: db.text,
    isDiary: Boolean(db.is_diary),
    is_hashtag: Boolean(db.is_hashtag),
    tags: db.tags ? db.tags.split(' ') : [],
    createdAt: new Date(db.created_at),
    updatedAt: new Date(db.updated_at),
  }
}

export const parseReport = (form: FormReport) => {
  // バリデ
  const title = form.title?.trim()
  if (!title) { throw new Error('Title is empty.') }

  // タイトルの形式を判定
  const isDiary = RegexUtil.isDiaryTitle(form.title) ? 1 : 0
  const isHashtag = RegexUtil.isHashtagTitle(form.title) ? 1 : 0

  // 本文からハッシュタグを抽出
  const hashtags = (form.text ?? '')
    .split(RegexUtil.separateRegex)
    .filter(text => RegexUtil.isHashtagTitle(text))
  // もしタイトルがハッシュタグなら、先頭に追加
  if (RegexUtil.isHashtagTitle(form.title)) {
    hashtags.unshift(form.title)
  }
  // 重複を削除してSSVへ
  const tagSSV = Array.from(new Set(hashtags)).join(' ') ?? null

  return {
    title,
    text: form.text,
    is_diary: isDiary ? 1 : 0,
    is_hashtag: isHashtag ? 1 : 0,
    tags: tagSSV ?? null,
  }
}
