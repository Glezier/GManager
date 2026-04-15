import './LoadingState.css'

export default function LoadingState({ message = "Carregano..."}){
    return(
        <div className='loading-state' role='status' aria-live='polite'>
            <div className='calendar-spinner'/>
                <span className="loading-state-spinner" aria-hidden="true"></span>
                <span className="loading-state-text">{message}</span>
        </div>
    )
}