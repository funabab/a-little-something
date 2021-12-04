export interface ILoadingError extends Error {
  error?: {
    title: string
    message: string
  }
}

export interface INews {
  id: string
  author: string
  avatar: string
  title: string
  url: string
}

export interface INewsImage {
  id: string
  newsId: string
  image: string
}

export interface INewsComment {
  id: string
  newsId: string
  name: string
  avatar: string
  comment: string
}
