import { INews, INewsComment, INewsImage } from '../types'

const API_BASE = '/api'

export const fetchAllNews = async (): Promise<INews[]> => {
  const res = await fetch(`${API_BASE}/news`)
  if (!res.ok) {
    throw new Error(
      'Error occurred while loading news, ensure you have network access'
    )
  }

  const json = await res.json()
  return json
}

export const fetchNews = async (newsId: string): Promise<INews> => {
  const res = await fetch(`${API_BASE}/news/${newsId}`)

  if (!res.ok) {
    throw new Error('Unable to fetch news resource')
  }

  const json = await res.json()
  return json
}

export const fetchNewsComment = async (
  newsId: string,
  commentId: string
): Promise<INewsComment> => {
  const res = await fetch(`${API_BASE}/news/${newsId}/comments/${commentId}`)

  if (!res.ok) {
    throw new Error('Unable to fetch news resource')
  }

  const json = await res.json()
  return json
}

export const fetchAllNewsImages = async (
  newsId: string
): Promise<INewsImage[]> => {
  const res = await fetch(`${API_BASE}/news/${newsId}/images`)
  if (!res.ok) {
    throw new Error(
      'Error occurred while loading news images, ensure you have network access'
    )
  }

  const json = await res.json()
  return json
}

export const addNewsImages = async (newsId: string, images: string[]) => {
  for (const image of images) {
    await fetch(`${API_BASE}/news/${newsId}/images/`, {
      method: 'POST',
      body: JSON.stringify({ image }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}

export const deleteAllNewsImages = async (newsId: string) => {
  const images = await fetchAllNewsImages(newsId)

  for (const image of images) {
    await fetch(`${API_BASE}/news/${newsId}/images/${image.id}`, {
      method: 'DELETE',
    })
  }
}

export const fetchAllNewsComments = async (
  newsId: string
): Promise<INewsComment[]> => {
  const res = await fetch(`${API_BASE}/news/${newsId}/comments`)
  if (!res.ok) {
    throw new Error(
      'Error occurred while loading news comments, ensure you have network access'
    )
  }

  const json = await res.json()
  return json
}

export const createNews = async (data: {
  author: string
  title: string
  avatar: string
  url: string
}): Promise<INews> => {
  const res = await fetch(`${API_BASE}/news`, {
    body: JSON.stringify(data),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const json = await res.json()
  if (!res.ok || json.errors) {
    throw new Error(json.errors || 'Unable to create news')
  }

  return json.data
}

export const updateNews = async (
  newsId: string,
  data: {
    author: string
    title: string
    avatar: string
    url: string
  }
) => {
  const res = await fetch(`${API_BASE}/news/${newsId}`, {
    body: JSON.stringify(data),
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const json = await res.json()
  if (!res.ok || json.errors) {
    throw new Error(json.errors || 'Unable to update news')
  }
}

export const deleteNews = async (newsId: string) => {
  const res = await fetch(`${API_BASE}/news/${newsId}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    throw new Error('Unable to delete news')
  }
}

export const createNewsComment = async (
  newsId: string,
  data: {
    name: string
    avatar: string
    comment: string
  }
): Promise<INewsComment> => {
  const res = await fetch(`${API_BASE}/news/${newsId}/comments`, {
    body: JSON.stringify(data),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const json = await res.json()
  if (!res.ok || json.errors) {
    throw new Error(json.errors || 'Unable to create news comment')
  }

  return json.data
}

export const updateNewsComment = async (
  newsId: string,
  commentId: string,
  data: {
    name: string
    avatar: string
    comment: string
  }
) => {
  const res = await fetch(`${API_BASE}/news/${newsId}/comments/${commentId}`, {
    body: JSON.stringify(data),
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const json = await res.json()
  if (!res.ok || json.errors) {
    throw new Error(json.errors || 'Unable to update news comment')
  }
}

export const deleteNewsComment = async (newsId: string, commentId: string) => {
  const res = await fetch(`${API_BASE}/news/${newsId}/comments/${commentId}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    throw new Error('Unable to delete news comment')
  }
}
