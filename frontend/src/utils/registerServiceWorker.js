export function registerServiceWorker () {
    // So registra service worker em produção
    if (!('serviceWorker' in navigator) || import.meta.env.DEV){
        return
    }

    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((error) => {
            console.warn('Service worker não registrado', error)
        })
    })
}