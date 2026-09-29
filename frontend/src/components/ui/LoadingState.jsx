import './LoadingState.css'

export default function LoadingState({
    message = "Carregando...",
    detail = "",
    variant = "inline",
}){
    return(
        <div className={`loading-state loading-state-${variant}`} role="status" aria-live="polite">
            <span className="loading-state-spinner" aria-hidden="true"></span>

            <span className="loading-state-copy">
                <span className="loading-state-text">{message}</span>

                {detail && (
                    <span className="loading-state-detail">{detail}</span>
                )}
            </span>
        </div>
    )
}