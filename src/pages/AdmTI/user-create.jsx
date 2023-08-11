import { useLocation } from "react-router-dom";
import MenuLateral from '../../components/_menuLateral/MenuLateral';
import BarraSuperior from '../../components/_barraSuperior/BarraSuperior';
import MenuCadastroTI from '../../components/admTI/_menuCadastroTI/menuCadastroTI';
import CadastroUsuariosCreate from '../../components/admTI/cadastroUsuários_create/admti_cadastroUsuáriosCreate';

function UserCreate() {

  const location = useLocation();
  const depptoStattus = location.state;

  return (
    <section>
       <BarraSuperior />
      <div className='corpo'>
        <div className="lateralEsquerda">
          <MenuLateral />
        </div>
        <div className="lateralDireita">
          <MenuCadastroTI />
          <CadastroUsuariosCreate  userData={depptoStattus}/>
        </div>
      </div>
    </section>
  )
}

export default UserCreate