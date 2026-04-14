import './ConfirmBox.css'

export default function ConfirmBox({
    open = false,
    loading = false,
    title = "Confirmar ação",
    message = '',
    confirmLabel = "Confirmar",
    cancelLabel = 'Cancelar',
    variant = 'danger',
    onConfirm,
    onCancel
}){

    if (!open){
        return null
    }

    return(

        <div className="confirm-dialog-overlay" onClick={onCancel}>
            <div
                className="confirm-dialog"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-dialog-title"
            >
                <div className="confirm-dialog-head">
                    <span className={`confirm-dialog-badge confirm-dialog-badge-${variant}`}>
                        Confirmação
                    </span>
                    <h3 id="confirm-dialog-title">{title}</h3>
                </div>

                {message && <p className="confirm-dialog-message">{message}</p>}

                <div className="confirm-dialog-actions">
                    <button
                        type="button"
                        className="confirm-dialog-cancel"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        {cancelLabel}
                    </button>

                    <button
                        type="button"
                        className={`confirm-dialog-confirm confirm-dialog-confirm-${variant}`}
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? 'Processando...' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}
