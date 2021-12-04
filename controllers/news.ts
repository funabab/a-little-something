import { RequestHandler } from 'express'
import * as uuid from 'uuid'
import { ServerError, INews, INewsImage, INewsComment, IModel } from '../types'
import { loadModel } from '../model'

const newsModel = loadModel<INews>('news.json')
const newsImagesModel = loadModel<INewsImage>('images.json')
const newsCommentsModel = loadModel<INewsComment>('comments.json')

export const addNews: RequestHandler = async (req, res, next) => {
  try {
    const { avatar, title, url, author } = req.body

    const newNews = await newsModel.create({
      avatar,
      title,
      url,
      author,
      id: uuid.v4(),
    })

    res.status(201).json({
      message: 'News created successfully',
      data: newNews,
    })
  } catch (err) {
    next(err)
  }
}

export const addNewsImage: RequestHandler = async (req, res, next) => {
  try {
    const pid = req.params.id as string
    const news = await newsModel.findFirst({ id: pid })

    if (!news) {
      const err: ServerError = new Error('News not found')
      err.statusCode = 404
      throw err
    }

    const newImage = await newsImagesModel.create({
      id: uuid.v4(),
      newsId: news.id,
      image: req.body.image,
    })

    res.status(201).send({
      message: 'New Image created successfully',
      data: newImage,
    })
  } catch (err) {
    next(err)
  }
}

export const addNewsComment: RequestHandler = async (req, res, next) => {
  try {
    const pid = req.params.id as string
    const news = await newsModel.findFirst({ id: pid })

    if (!news) {
      const err: ServerError = new Error('News not found')
      err.statusCode = 404
      throw err
    }

    const { name, avatar, comment } = req.body

    const newComment = await newsCommentsModel.create({
      id: uuid.v4(),
      newsId: news.id,
      name,
      avatar,
      comment,
    })

    res.status(201).send({
      message: 'News comment created successfully',
      data: newComment,
    })
  } catch (err) {
    next(err)
  }
}

export const deleteNews: RequestHandler = async (req, res, next) => {
  try {
    const pid = req.params.id as string
    const news = await newsModel.findFirst({ id: pid })

    if (!news) {
      const err: ServerError = new Error('News not found')
      err.statusCode = 404
      throw err
    }

    await newsModel.remove({ id: pid })
    await newsImagesModel.remove({
      newsId: pid,
    })
    await newsCommentsModel.remove({
      newsId: pid,
    })

    res.json({
      message: 'News deleted',
    })
  } catch (err) {
    next(err)
  }
}

export const deleteNewsImage: RequestHandler = async (req, res, next) => {
  try {
    const pid = req.params.id as string
    const imageId = req.params.imageId as string

    const image = await newsImagesModel.findFirst({
      newsId: pid,
      id: imageId,
    })

    if (!image) {
      const err: ServerError = new Error('News image not found')
      err.statusCode = 404
      throw err
    }

    await newsImagesModel.remove({
      newsId: pid,
      id: imageId,
    })

    res.json({
      message: 'News image deleted',
    })
  } catch (err) {
    next(err)
  }
}

export const deleteNewsComment: RequestHandler = async (req, res, next) => {
  try {
    const pid = req.params.id as string
    const commentId = req.params.commentId as string

    const comment = await newsCommentsModel.findFirst({
      newsId: pid,
      id: commentId,
    })

    if (!comment) {
      const err: ServerError = new Error('News comment not found')
      err.statusCode = 404
      throw err
    }

    await newsCommentsModel.remove({
      newsId: pid,
      id: commentId,
    })

    res.json({
      message: 'News comment deleted',
    })
  } catch (err) {
    next(err)
  }
}

export const getNews: RequestHandler = async (req, res, next) => {
  try {
    const newsArr = await newsModel.find({})

    const start = Math.max(+req.query.page! || 1, 1) - 1
    const limit = Math.max(+req.query.limit!, 1)

    if (!limit) {
      res.send(newsArr)
    } else {
      res.json(newsArr.slice(start * limit, start * limit + limit))
    }
  } catch (err) {
    next(err)
  }
}

export const getNewsById: RequestHandler = async (req, res, next) => {
  try {
    const pid = req.params.id as string
    const news = await newsModel.findFirst({ id: pid })

    if (!news) {
      const err: ServerError = new Error('News not found')
      err.statusCode = 404
      throw err
    } else {
      res.json(news)
    }
  } catch (err) {
    next(err)
  }
}

export const getNewsImages: RequestHandler = async (req, res, next) => {
  try {
    const pid = req.params.id as string
    const news = await newsModel.findFirst({ id: pid })

    if (!news) {
      const err: ServerError = new Error('News not found')
      err.statusCode = 404
      throw err
    }

    const images = await newsImagesModel.find({ newsId: news.id })

    res.json(images)
  } catch (err) {
    next(err)
  }
}

export const getNewsCommentById: RequestHandler = async (req, res, next) => {
  try {
    const pid = req.params.id as string
    const commentId = req.params.commentId as string
    const comment = await newsCommentsModel.findFirst({
      id: commentId,
      newsId: pid,
    })

    if (!comment) {
      const err: ServerError = new Error('News comment not found')
      err.statusCode = 404
      throw err
    } else {
      res.json(comment)
    }
  } catch (err) {
    next(err)
  }
}

export const getNewsComments: RequestHandler = async (req, res, next) => {
  try {
    const pid = req.params.id as string
    const news = await newsModel.findFirst({ id: pid })

    if (!news) {
      const err: ServerError = new Error('News not found')
      err.statusCode = 404
      throw err
    }

    const comments = await newsCommentsModel.find({
      newsId: news.id,
    })

    res.json(comments)
  } catch (err) {
    next(err)
  }
}

export const updateNews: RequestHandler = async (req, res, next) => {
  try {
    const pid = req.params.id as string
    const news = await newsModel.findFirst({ id: pid })

    if (!news) {
      const err: ServerError = new Error('News not found')
      err.statusCode = 404
      throw err
    }

    const { author, avatar, url, title } = req.body

    await newsModel.update(
      { id: pid },
      {
        author,
        avatar,
        url,
        title,
      }
    )

    res.json({
      message: 'News updated',
    })
  } catch (err) {
    next(err)
  }
}

export const updateNewsComment: RequestHandler = async (req, res, next) => {
  try {
    const pid = req.params.id as string
    const commentId = req.params.commentId as string

    const comment = await newsCommentsModel.findFirst({
      id: commentId,
      newsId: pid,
    })

    if (!comment) {
      const err: ServerError = new Error('News comment not found')
      err.statusCode = 404
      throw err
    }

    const { name, avatar, comment: commentBody } = req.body

    await newsCommentsModel.update(
      { id: commentId },
      {
        name,
        avatar,
        comment: commentBody,
      }
    )

    res.json({
      message: 'News comment updated',
    })
  } catch (err) {
    next(err)
  }
}
