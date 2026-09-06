const CACHE_NAME = 'my-gmanager-shell-v1'

// O que é guardado para ser aberto no mobile
const APP_SHELL = [
    '/',
    '/dashboard',
    '/calendario',
    '/manifest.webmanifest',
    '/icon_logo.png'
]

// Abre o cache atual e salva as rotas definidas
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
    )

    self.skipWaiting()
})

// Ativa ou atualiza para uma nova versão
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => (
            Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            )
        ))
    )
    self.clients.claim()
})

self.addEventListener('fetch', (e) => {
    const request = e.request
    const url = new URL(request.url)

    // Não permite adicionar dados nem requisições de autenticação e outros
    if (request.method !== 'GET' || url.origin !== self.location.origin){
        return
    }

    if (
        url.pathname.startsWith('/auth') ||
        url.pathname.startsWith('/tarefas') ||
        url.pathname.startsWith('/profile')
    ) {
        return
    }

    // Direciona para tela principal
    if (request.mode === 'navigate'){
        e.respondWith(
            fetch(request).catch(() => caches.match('/dashboard'))
        )
        return
    }

    // Faz o solicitado normalmente
    e.respondWith(
        caches.match(request).then((cached) => cached || fetch(request))
    )
})