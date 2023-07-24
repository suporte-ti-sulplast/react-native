import "./index.scss";
import { useContext } from 'react';
import { AuthContext } from '../../contexts/auth';

function BarraSuperior() {

    const { logout } = useContext(AuthContext);

    const handleSubmit = () => {
        logout();
    }

  return (
    <section className='barraSuperior'>
        <div className='logoTitulo'>
            <img className='logo' src='./images/logoSulplastBranco.png' alt="logoSulplastBranco" />
            <h1>Sulplast Intranet</h1>
        </div>

        <div className='infoSair'>
            <div className='setor'>
                <h1>INFORMÁTICA</h1>
            </div>
            <div className='user'>
                <p>
                    Bem-vindo, <br />
                    Suporte TI! <br />
                    ADM-TI
                </p>
            </div>
            <div className='sair'>
                <button onClick={handleSubmit}>
                    <img src="./images/sair.png" alt="sair" />
                    <p>Sair</p>
                </button>
            </div>
        </div>
    </section>
  )
}

export default BarraSuperior