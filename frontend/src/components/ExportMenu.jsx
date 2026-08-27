import { useEffect, useState, useRef } from "react"
import SendIcon from "../assets/icons/send.png"
import WhatsappIcon from "../assets/icons/whatsapp.png"
import PDFIcon from "../assets/icons/download.png"
import './ExportMenu.css'

export default function ExportMenu({
    onWhatsapp,
    onPdf,
    disabled = false,
    label = 'Compartilhar'
}){
    const [open, setOpen] = useState(false)
    const menuRef = useRef(null)

    function toggleMenu(){
        if (disabled){
            return
        }
        setOpen((atual) => !atual)
    }

    function handleWhatsapp() {
        onWhatsapp()
        setOpen(false)
    }

    function handlePdf(){
        onPdf()
        setOpen(false)
    }

    useEffect(() => {
        if (!open) {
            return
        }

        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false)
            }
        }

        document.addEventListener('pointerdown', handleClickOutside)

        return () => {
            document.removeEventListener('pointerdown', handleClickOutside)
        }
    }, [open])

    return (
        <div className="export-menu" ref={menuRef}>
            <button
                type="button"
                className="btn-secondary export-menu-trigger"
                onClick={toggleMenu}
                disabled={disabled}
                aria-expanded={open}
                aria-haspopup="menu"
            >
                <img src={SendIcon} alt="Compartilhar tarefas" className="day-icons" />
                {label}
            </button>

            {open && (
                <div className="export-menu-options" role="menu">
                    <button
                        type="button"
                        className="export-menu-option task-export-option-whatsapp"
                        role="menuitem"
                        onClick={handleWhatsapp}
                    >
                        <div className="button-options">
                            WhatsApp
                            <img src={WhatsappIcon} alt="" className="day-icons"/>
                        </div>
                    </button>

                    <button
                        type="button"
                        className="export-menu-option task-export-option-pdf"
                        role="menuitem"
                        onClick={handlePdf}
                    >
                        <div className="button-options">
                            PDF
                            <img src={PDFIcon} alt="" className="day-icons"/>
                        </div>
                    </button>
                </div>
            )}
        </div>
    )

}