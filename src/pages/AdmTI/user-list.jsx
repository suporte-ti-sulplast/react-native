import { useRetract } from '../../contexts/retract';
import { useState } from 'react';
import useRetractEffect from '../../../src/hooks/useRetract';

import MenuLateral from '../../components/_menuLateral/MenuLateral';
import BarraSuperior from '../../components/_barraSuperior/BarraSuperior';
import MenuCadastroTI from '../../components/admTI/_menuCadastroTI/menuCadastroTI';
import CadastroUsuarios from '../../components/admTI/cadastroUsuários_list/cadastroUsuariosList';

function UserList() {

  const [body, setBody] = useState();

  const { retract } = useRetract();
  
  useRetractEffect(retract, setBody);

  return (
    <section>
       <BarraSuperior />
       <div className={'corpo ' + body}>
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