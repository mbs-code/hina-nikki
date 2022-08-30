import { DateUtil } from '~~/src/utils/DateUtil'
import { RegexUtil } from '~~/src/utils/RegexUtil'

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

  formattedTitle: string // 表示用のタイトル
}

export type FormReport = {
  title: string // unique
  text: string
}

export const formatReport = (db: DBReport): Report => {
  let formattedTitle = db.title
  if (db.is_diary) {
    const date = DateUtil.parseByDiaryTitle(formattedTitle)
    formattedTitle = DateUtil.formatDate(date)
  }

  return {
    id: db.id,
    title: db.title,
    text: db.text,
    isDiary: Boolean(db.is_diary),
    is_hashtag: Boolean(db.is_hashtag),
    tags: db.tags ? db.tags.split(' ') : [],
    createdAt: new Date(db.created_at),
    updatedAt: new Date(db.updated_at),

    formattedTitle,
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
  const ssvTag = Array.from(new Set(hashtags)).join(' ')

  return {
    title,
    text: form.text,
    is_diary: isDiary,
    is_hashtag: isHashtag,
    tags: ssvTag ?? null,
  }
}
