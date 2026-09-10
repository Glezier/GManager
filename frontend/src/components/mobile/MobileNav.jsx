import { useNavigate, NavLink } from "react-router-dom"
import CheckIcon from '../../assets/icons/check.png'
import CalendarIcon from '../../assets/icons/calendar.png'
import AddIcon from '../../assets/icons/add.png'
import ProfileIcon from '../../assets/icons/profile.png'
import './MobileNav.css'

export default function MobileNav({ onAddTask }){
    const navigate = useNavigate()

    function handleAddTask(){
        if (onAddTask){
            onAddTask()
            return
        } 

        navigate('/dashboard', {
            state: { openTaskModal: true }
        })
    }

    return (
        <nav className="mobile-nav" aria-label="Navegacao principal mobile">
            <NavLink to="/dashboard" className="mobile-nav-item">
                <img src={CheckIcon} alt="" />
                <span>Hoje</span>
            </NavLink>

            <NavLink to="/calendario" className="mobile-nav-item">
                <img src={CalendarIcon} alt="" />
                <span>Calendario</span>
            </NavLink>

            <button
                type="button"
                className="mobile-nav-action"
                onClick={handleAddTask}
                aria-label="Nova tarefa"
            >
                <img src={AddIcon} alt="" />
            </button>

            <NavLink to="/perfil" className="mobile-nav-item">
                <img src={ProfileIcon} alt="" />
                <span>Perfil</span>
            </NavLink>
        </nav>
    )
}