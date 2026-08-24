import './AppFooter.css'

export default function AppFooter({ minimal = false }){
    const anoAtual = new Date().getFullYear()

    return(
        <footer className={minimal ? 'app-footer app-footer-minimal' : 'app-footer'}> 
            <p>
                © {anoAtual} My GManager. Desenvolvido por Glezier.
            </p>

            {!minimal && (
                <nav className='app-footer-links' aria-label='Links do rodapé'>
                    <a href='mailto:montalvaneglezier@gmail.com'>
                        Email
                    </a>

                    <a 
                        href="https://github.com/Glezier"
                        target='_blank'
                        rel='noreferrer'
                    >
                        GitHub
                    </a>

                    
                    <a 
                        href="https://www.linkedin.com/in/gleziermontalvane"
                        target='_blank'
                        rel='noreferrer'
                    >
                        LinkedIn
                    </a>

                </nav>
            )}

        </footer>
    )
}