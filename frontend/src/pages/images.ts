import { ILoadingError } from '../../types'
import {
  addNewsImages,
  deleteAllNewsImages,
  fetchAllNewsImages,
} from '../resource'
import { ALERT, createAlert, hideLoadingMask, showMessage } from '../views'
import { registerServiceWorker } from '../service_worker'

registerServiceWorker()

const handleAddNewImage = (e: Event) => {
  e.preventDefault()
  createNewImageInput()
}

const createNewImageInput = (value: string = '') => {
  const container = document.querySelector('.inputs-container')

  const elDiv = document.createElement('div')
  elDiv.className = 'form-control flex'

  const elInput = document.createElement('input')
  elInput.className = 'm-0'
  elInput.setAttribute('placeholder', 'https://')
  elInput.setAttribute('name', 'image')
  elInput.setAttribute('type', 'url')
  elInput.value = value
  elInput.required = true

  const elButton = document.createElement('button')
  elButton.innerText = 'Delete'
  elButton.onclick = (e) => {
    e.preventDefault()
    elDiv.remove()
  }

  elDiv.appendChild(elInput)
  elDiv.appendChild(elButton)
  container?.appendChild(elDiv)
}

const init = async () => {
  const url = new URL(window.location.href)
  const newsId = url.searchParams.get('id')

  if (!newsId) {
    throw new Error('News resource not found')
  }
  const images = await fetchAllNewsImages(newsId)

  images.forEach((image) => {
    createNewImageInput(image.image)
  })

  const elAddImage = document.querySelector(
    '.add-new-image'
  ) as HTMLButtonElement

  const elForm = document.querySelector('form') as HTMLFormElement
  const alert = createAlert('#output-container')
  elAddImage.onclick = handleAddNewImage

  elForm.onsubmit = async (e) => {
    e.preventDefault()
    try {
      await deleteAllNewsImages(newsId)
      await addNewsImages(
        newsId,
        Array.from(elForm.querySelectorAll(`input[name="image"]`))
          .map((input) => (input as any).value)
          .filter(Boolean)
      )
      alert(
        'Success',
        `News images updated successfully <a href="/view/?id=${newsId}">view post</a>`,
        ALERT.SUCCESS
      )
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
