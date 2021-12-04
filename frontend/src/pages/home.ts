import { hideLoadingMask, showMessage } from '../views'
import { ILoadingError, INews } from '../../types'
import { deleteNews, fetchAllNews } from '../resource'
import { registerServiceWorker } from '../service_worker'

registerServiceWorker()

const MAX_NEW_ITEMS = 10

const handleNewsDelete = async (e: Event) => {
  const target = e.target as HTMLElement
  if (target.hasAttribute('data-delete-news-id')) {
    try {
      await deleteNews(target.getAttribute('data-delete-news-id')!)
      window.location.reload()
    } catch (err) {}
  }
}

const createNewItem = (index: number, news: INews): HTMLElement => {
  const elListItem = document.createElement('li')
  elListItem.className = 'news-item'

  elListItem.innerHTML = `
    <span class="news-item__numbering">${index}</span>
    <article class="news-item__body">
        <h2>
            <a href="view/?id=${news.id}">${news.title}</a>
        </h2>
        <div class="news-item__meta">
            by ${news.author}
        </div>
    </article>
    <aside class="news-item__actions">
        <a href="post/?id=${news.id}">Edit</a> | <button data-delete-news-id="${news.id}">Delete</button>
    </aside>`
  return elListItem
}

const init = async function () {
  const elMain = document.querySelector('main')
  const elMainList = document.querySelector('.main__home_list')!
  elMainList.addEventListener('click', handleNewsDelete)

  const newsArr = (await fetchAllNews()).reverse()

  if (newsArr.length === 0) {
    return elMain?.classList.add('main__home_no_news')
  }

  const elNavBtnNext = document.querySelector(
    '.pagi-container .pagi-container__btn_next'
  ) as HTMLButtonElement

  const elNavBtnPrev = document.querySelector(
    '.pagi-container .pagi-container__btn_prev'
  ) as HTMLButtonElement

  const elPagiCounter = document.querySelector(
    '.pagi-container .pagi-container__counter'
  ) as HTMLSpanElement

  let start = 1
  const end = Math.max(Math.ceil(newsArr.length / MAX_NEW_ITEMS), 1)

  const updatePagiCounter = () => {
    elPagiCounter.innerText = `${start}/${end}`
    elNavBtnNext.disabled = start === end
    elNavBtnPrev.disabled = start === 1
  }

  const updateList = () => {
    Array.from(elMainList.children).forEach((child) => child.remove())
    const begin = (start - 1) * MAX_NEW_ITEMS
    newsArr.slice(begin, begin + MAX_NEW_ITEMS).forEach((news, index) => {
      elMainList.appendChild(createNewItem(begin + index + 1, news))
    })
  }

  elNavBtnNext.onclick = () => {
    start = Math.min(end, start + 1)
    updatePagiCounter()
    updateList()
  }

  elNavBtnPrev.onclick = () => {
    start = Math.max(1, start - 1)
    updatePagiCounter()
    updateList()
  }

  updatePagiCounter()
  updateList()
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
