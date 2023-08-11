import "./index.scss";
import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../contexts/auth';



function MenuLateral() {

const { user } = useContext(AuthContext);
const [retract, setRetract] = useState(() => {
  // Recupera o valor do estado "retract" do localStorage ou retorna 'show' caso não exista
  return localStorage.getItem('retract') || 'show';
});
const [arrow, setArrow] = useState('')

  const handleRetract = () => {

    if(retract === 'show'){
      setRetract('hidden')
      setArrow('left')
    } else {
      setRetract('show')
      setArrow('rigth')
    }
  }

  useEffect(() => {
    // Código a ser executado somente quando o estado do componente (state) for alterado
    // Aqui você pode realizar ações que dependem do estado atualizado, como processar os dados recebidos, etc.
    localStorage.setItem('retract', retract);
  }, [retract]); // useEffect será executado sempre que o estado (state) for alterado

  return (
    // eslint-disable-next-line
    <section className='menuLateral '>
      
      <div onClick={handleRetract} className="arrow">
        <img className={'arrow-left ' + arrow} src="../../images/seta-para-esquerda2.png" alt="seta-para-esquerda2" />
      </div>
        
        <ul className="nav flex-column text-start">
            {user.applications.map(application => (
            <li className="nav-item" key={application}>
                <Link className="nav-link" aria-current="page" to={`/${application}`}><img src={`../../images/${application}.png`} alt={application} />
                  <div className={'text ' + retract} >
                    {retract !== 'hidden' && application}
                  </div>
                </Link>
            </li>
            ))}
        </ul>
    </section>
  )
}

export default MenuLateral