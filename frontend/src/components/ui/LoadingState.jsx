import './LoadingState.css'

export default function LoadingState({ message = "Carregando..."}){
    return(
        <div className='loading-state' role='status' aria-live='polite'>
            <span className="loading-state-spinner" aria-hidden="true"></span>
            <span className="loading-state-text">{message}</span>
        </div>
    )
}