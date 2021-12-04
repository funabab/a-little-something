import { ILoadingError, INewsComment } from '../../types'
import {
  createNewsComment,
  fetchNews,
  fetchNewsComment,
  updateNewsComment,
} from '../resource'
import { ALERT, createAlert, hideLoadingMask, showMessage } from '../views'
import { registerServiceWorker } from '../service_worker'

registerServiceWorker()

const fillInputs = (comment: INewsComment) => {
  ;(
    document.querySelector(`form input[name="author"]`) as HTMLInputElement
  ).value = comment.name
  ;(
    document.querySelector(`form input[name="avatar"]`) as HTMLInputElement
  ).value = comment.avatar
  ;(
    document.querySelector(`form textarea[name="comment"]`) as HTMLInputElement
  ).value = comment.comment
}

const init = async () => {
  const elForm = document.querySelector('form') as unknown as HTMLFormElement
  const alert = createAlert('#output-container')

  const url = new URL(window.location.href)
  const newsId = url.searchParams.get('id')

  if (!newsId) {
    throw new Error('resource not found')
  }

  const news = await fetchNews(newsId)
  const commentId = url.searchParams.get('cid')

  let comment: INewsComment

  if (commentId) {
    try {
      comment = await fetchNewsComment(newsId, commentId)
      document.querySelector('.container.main__comment h2')!.innerHTML =
        'Edit Comment'
      ;(elForm.querySelector(`input[type="submit"]`) as any).value =
        'Update Comment'

      fillInputs(comment)
    } catch (e) {
      throw new Error('comment not found')
    }
  }

  elForm.onsubmit = async (e) => {
    e.preventDefault()

    try {
      const form = e.target as any

      const name = form.author.value as string
      const avatar = form.avatar.value as string
      const newComment = form.comment.value as string

      const data = {
        name,
        avatar,
        comment: newComment,
      }

      if (comment) {
        await updateNewsComment(news.id, comment.id, data)
        alert(
          'Success',
          `
          Comment updated successfully <a href="/view/?id=${news.id}">view in news post</a>
          `,
          ALERT.SUCCESS
        )
      } else {
        await createNewsComment(news.id, data)
        alert(
          'Success',
          `
            Comment created successfully <a href="/view/?id=${news.id}">view in news post</a>
            `,
          ALERT.SUCCESS
        )
      }
    } catch (err: any) {
      console.log(err)
      alert('Error', err.message, ALERT.ERROR)
    }
    elForm.reset()
  }
}

init()
  .catch((err: ILoadingError) => {
    if (err.error) {
      showMessage(err.error.title, err.error.message)
    } else {
      showMessage(`😥😥😥`, err.message)
    }
  })
  .finally(() => {
    hideLoadingMask()
  })
