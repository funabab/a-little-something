import { ILoadingError, INews, INewsComment, INewsImage } from '../../types'
import { hideLoadingMask, showMessage } from '../views'
import {
  deleteNewsComment,
  fetchAllNewsComments,
  fetchAllNewsImages,
  fetchNews,
} from '../resource'
import { registerServiceWorker } from '../service_worker'

registerServiceWorker()

const initNewsImageSlider = (images: INewsImage[]) => {
  if (images.length === 0) {
    document
      .querySelector('.main__post_image_container')
      ?.classList.add('no_images')
    return
  }

  const elImageContainer = document.querySelector(
    '.main__post_image_container .images'
  ) as HTMLElement

  const elBtnImagePrev = document.querySelector(
    '.image-slide-action .btn-prev'
  ) as HTMLButtonElement

  const elBtnImageNext = document.querySelector(
    '.image-slide-action .btn-next'
  ) as HTMLButtonElement

  elImageContainer.innerHTML = images
    .map(
      (image) => `
  <div class="image">
    <img src="${image.image}" />
  </div>
  `
    )
    .join('\n')

  let currentImageSlide = 0
  const updateImageSlideState = () => {
    elBtnImagePrev.disabled = currentImageSlide === 0
    elBtnImageNext.disabled = currentImageSlide === images.length - 1
    elImageContainer.scrollTo({
      left: elImageContainer.clientWidth * currentImageSlide,
      behavior: 'smooth',
    })
  }

  elBtnImageNext.onclick = () => {
    currentImageSlide = Math.min(images.length - 1, currentImageSlide + 1)
    updateImageSlideState()
  }

  elBtnImagePrev.onclick = () => {
    currentImageSlide = Math.max(0, currentImageSlide - 1)
    updateImageSlideState()
  }

  updateImageSlideState()
}

const renderNews = (news: INews) => {
  const elMainPost = document.querySelector('.main__post') as HTMLElement
  const elEditNews = elMainPost.querySelector(
    '.link-edit-news'
  ) as HTMLAnchorElement
  const elEditNewsImages = elMainPost.querySelector(
    '.link-edit-news-images'
  ) as HTMLAnchorElement

  const elPostTitle = elMainPost.querySelector(
    '.main__post_heading h2'
  ) as HTMLElement

  const elPostAvavtar = elMainPost.querySelector(
    '.main__post_heading .author-image img'
  ) as HTMLImageElement

  const elViewNews = elMainPost.querySelector(
    '.link-view-news'
  ) as HTMLAnchorElement

  const elAddComment = elMainPost.querySelector(
    '.btn-add-comment'
  ) as HTMLAnchorElement

  elEditNews.href = `/post/?id=${news.id}`
  elEditNewsImages.href = `/images/?id=${news.id}`

  elPostAvavtar.src = news.avatar

  elPostTitle.innerHTML = `${news.title}<span>by ${news.author}</span>`
  elViewNews.href = news.url

  elAddComment.href = `/comment/?id=${news.id}`
}

const renderComments = (newsId: string, comments: INewsComment[]) => {
  const elCommentsContainer = document.querySelector(
    '.main__post_comments_content'
  )

  if (comments.length === 0) {
    elCommentsContainer?.classList.add('no_comment')
    return
  } else {
    const elList = elCommentsContainer?.querySelector('ul') as HTMLUListElement

    const handleCommentDelete = async (e: Event) => {
      const target = e.target as HTMLElement

      if (target.hasAttribute('data-delete-comment-action')) {
        try {
          await deleteNewsComment(
            newsId,
            target.getAttribute('data-delete-comment-action')!
          )
          window.location.reload()
        } catch (err) {}
      }
    }

    elList.addEventListener('click', handleCommentDelete)
    comments.forEach((comment) =>
      elList.appendChild(createCommentItem(comment))
    )
  }
}

const createCommentItem = (comment: INewsComment): HTMLElement => {
  const elComment = document.createElement('li')

  elComment.innerHTML = `
  <article>${comment.comment}</article>
  <figure class="meta">
    <figcaption>comment by ${comment.name}</figcaption>
    <div class="author-image">
      <img src="${comment.avatar}" class="img-full" alt="" />
    </div>
    <div class="comment-actions">
    <a href="/comment/?id=${comment.newsId}&cid=${comment.id}">Edit</a> | <button data-delete-comment-action="${comment.id}">Delete</button>
  </div>
</figure>
  `
  return elComment
}

const init = async () => {
  const url = new URL(window.location.href)
  const newsId = url.searchParams.get('id')

  if (!newsId) {
    throw new Error('News resource not found')
  }

  const news = await fetchNews(newsId)
  const images = await fetchAllNewsImages(newsId)
  const comments = await fetchAllNewsComments(newsId)

  initNewsImageSlider(images)
  renderNews(news)
  renderComments(newsId, comments)
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
