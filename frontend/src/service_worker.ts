export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(() => {
        console.log('Service Worker Registered')
      })
      .catch((err) => {
        console.log('Unable to register service worker', err)
      })
  }
}
