import { ALERT, createAlert, hideLoadingMask, showMessage } from '../views'
import { createNews, fetchNews, updateNews } from '../resource'
import { ILoadingError, INews } from '../../types'
import { registerServiceWorker } from '../service_worker'

registerServiceWorker()

const fillInputs = (news: INews) => {
  ;(
    document.querySelector(`form input[name="author"]`) as HTMLInputElement
  ).value = news.author
  ;(
    document.querySelector(`form input[name="title"]`) as HTMLInputElement
  ).value = news.title
  ;(
    document.querySelector(`form input[name="url"]`) as HTMLInputElement
  ).value = news.url
  ;(
    document.querySelector(`form input[name="avatar"]`) as HTMLInputElement
  ).value = news.avatar
}

const init = async () => {
  const elForm = document.querySelector('form') as unknown as HTMLFormElement
  const alert = createAlert('#output-container')

  const url = new URL(window.location.href)
  const newsId = url.searchParams.get('id')
  let news: INews

  if (newsId) {
    try {
      news = await fetchNews(newsId!)
      fillInputs(news)

      document.querySelector('.container.main__create h2')!.innerHTML =
        'Edit Post'
      ;(elForm.querySelector(`input[type="submit"]`) as any).value =
        'Update News'
    } catch (err) {
      throw new Error('News resource not found')
    }
  }

  elForm.onsubmit = async (e) => {
    e.preventDefault()

    try {
      const form = e.target as any

      const author = form.author.value as string
      const avatar = form.avatar.value as string
      const title = form.title.value as string
      const url = form.url.value as string

      const data = {
        author,
        avatar,
        title,
        url,
      }

      if (news) {
        await updateNews(news.id, data)
        alert(
          'Success',
          `
        News updated successfully <a href="/">view in homepage</a>
        `,
          ALERT.SUCCESS
        )
      } else {
        const newNews = await createNews(data)
        alert(
          'Success',
          `
        News created successfully <a href="/">view in homepage</a>
        `,
          ALERT.SUCCESS
        )
      }

      elForm.reset()
    } catch (err: any) {
      alert('Error', err.message, ALERT.ERROR)
    }
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
