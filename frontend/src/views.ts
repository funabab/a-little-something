export enum ALERT {
  SUCCESS = 'success',
  ERROR = 'error',
}

export const createAlert = (container: string) => {
  const elContainer = document.querySelector(container)

  return (title: string, message: string, type: ALERT) => {
    if (!elContainer) {
      return
    }

    elContainer.innerHTML = `
    <div class="alert ${type}">
      <h3>${title}</h3>
      <p>${message}</p>
    </div>
    `
  }
}

export const showLoadingMask = () => {
  document.body.classList.add('loading-mask')
}

export const hideLoadingMask = () => {
  document.body.classList.remove('loading-mask')
}

export const showMessage = (title: string, message: string) => {
  let elPageMessage = document.getElementById('page-message-container')

  if (!elPageMessage) {
    elPageMessage = document.createElement('div')
    elPageMessage.id = 'page-message-container'

    elPageMessage.appendChild(document.createElement('h1'))
    elPageMessage.appendChild(document.createElement('strong'))

    const elButton = document.createElement('button')
    elButton.innerText = 'click here to reload'
    elButton.onclick = () => window.location.reload()
    elPageMessage.appendChild(elButton)

    document.body.appendChild(elPageMessage)
  }

  elPageMessage.querySelector('h1')!.innerText = title
  elPageMessage.querySelector('strong')!.innerText = message
  document.body.classList.remove('display-message')
}

export const hideMessage = () => {
  const elPageContainer = document.getElementById('page-message-container')
  if (elPageContainer) {
    elPageContainer.remove()
  }
  document.body.classList.remove('display-message')
}

export const showLoading = () => {
  const elLoadingContainer = document.getElementById('loading-container')

  if (!elLoadingContainer) {
    const elContainer = document.createElement('div')
    elContainer.id = 'loading-container'

    const elImage = document.createElement('img')
    elImage.src = 'logo.png'

    const elStrong = document.createElement('strong')
    elStrong.innerText = 'Loading...'

    elContainer.appendChild(elImage)
    elContainer.appendChild(elStrong)
    document.body.appendChild(elContainer)
  }
  document.body.classList.add('display-loading')
}

export const hideLoading = () => {
  const elLoadingContainer = document.getElementById('loading-container')
  if (elLoadingContainer) {
    elLoadingContainer.remove()
  }
  document.body.classList.remove('display-loading')
}
