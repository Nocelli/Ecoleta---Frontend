import React from 'react'
import { FiLogIn, FiSearch } from 'react-icons/fi'
import logo from '../../assets/logo.svg'
import './styles.css'
import { Link } from 'react-router-dom'
const Home = () => {
    return (
        <div id="page-home">
            <div className='content'>
                <header>
                    <img src={logo} alt="Ecoleta" />
                    <Link to='/cadastro'>
                        <span>
                            <FiLogIn color='#34cb79' />
                        </span>
                        <h3>Cadastre um ponto de coleta</h3>
                    </Link>
                </header>
                <main>
                    <h1>Seu marketplace de coleta de resíduos</h1>
                    <p>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</p>
                    <Link to="/">
                        <span>
                            <FiSearch />
                        </span>
                        <strong>Pesquisar pontos de coleta</strong>
                    </Link>
                </main>
            </div>
        </div>
    )
}

export default Home