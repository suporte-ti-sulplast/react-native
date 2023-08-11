import { useLocation } from "react-router-dom";
import MenuLateral from '../../components/_menuLateral/MenuLateral';
import BarraSuperior from '../../components/_barraSuperior/BarraSuperior';
import MenuCadastroTI from '../../components/admTI/_menuCadastroTI/menuCadastroTI';
import CadastroUsuariosEdit from '../../components/admTI/cadastroUsuários_edit/cadastroUsuariosEdit';

function UserEdit() {

  const location = useLocation();
  const userData = location.state;

  return (
    <section>
       <BarraSuperior />
      <div className='corpo'>
        <div className="lateralEsquerda">
          <MenuLateral />
        </div>
        <div className="lateralDireita">
          <MenuCadastroTI />
          <CadastroUsuariosEdit  userData={userData}/>
        </div>
      </div>
    </section>
  )
}

export default UserEdit