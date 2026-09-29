import { Capacitor } from '@capacitor/core'

// Consulta por plataforma (mobile ou web)
export function isNativeApp(){
    return Capacitor.isNativePlatform()
}