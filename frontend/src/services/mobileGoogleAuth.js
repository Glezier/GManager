import { GoogleSignIn } from '@capawesome/capacitor-google-sign-in'

let inicializado = false

export async function loginGoogleMobile(){
    if (!inicializado){
        await GoogleSignIn.initialize({
            clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID
        })

        inicializado = true
    }

    const response = await GoogleSignIn.signIn()

    if (!response.idToken){
        throw new Error('Não foi possível obter o token do Google.')
    }

    return response.idToken
}