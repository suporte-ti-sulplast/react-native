import MenuLateral from '../../components/_menuLateral/MenuLateral';
import BarraSuperior from '../../components/_barraSuperior/BarraSuperior';
import MenuCadastroTI from '../../components/admTI/_menuCadastroTI/menuCadastroTI';
import CadastroUsuarios from '../../components/admTI/cadastroUsuários_list/cadastroUsuariosList';

function UserList() {

  return (
    <section>
       <BarraSuperior />
      <div className='corpo'>
        <div className="lateralEsquerda">
          <MenuLateral />
        </div>
        <div className="lateralDireita">
          <MenuCadastroTI />
          <CadastroUsuarios />
        </div>
      </div>
    </section>
  )
}

export default UserList