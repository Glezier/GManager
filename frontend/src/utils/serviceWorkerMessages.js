export function listenServiceWorkerMessages(){
    if (!('serviceWorker' in navigator)){
        return
    }

    navigator.serviceWorker.addEventListener('message', (e) => {
        if (e.data?.type === 'APP_UPDATED'){
            console.info('Nova versão disponível do My GManager')
        }
    })
}