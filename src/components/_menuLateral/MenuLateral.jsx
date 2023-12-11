import "./index.scss";
import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../contexts/auth';
import { useRetract } from '../../contexts/retract';
import { tScreen } from '../../functions/tscreen';

function MenuLateral() {

const { userLogged } = useContext(AuthContext);
const { retract, setRetract } = useRetract();
const [ tscreen, setTscreen ] = useState();

console.log(userLogged)

const [arrow, setArrow] = useState('')

useEffect(() => {
  if(retract === 'show'){
    setArrow('rigth')
  } else {
    setArrow('left')
  }
}, [retract]);

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
    setTscreen(tScreen());
  }, []);

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

            {userLogged.applicationsList.map(application => (
            <li className="nav-item" key={application}>
                <Link className="nav-link" aria-current="page" to={`/${application}`}><img src={`../../images/${application}.png`} alt={application} />
                  <div className={'text ' + retract} >
                    {retract !== 'hidden' && application}
                  </div>
                </Link>
            </li>
            ))}
        </ul>

        <div className="screen">
            <p>{tscreen}</p>
        </div>
    </section>
  )
}

export default MenuLateral