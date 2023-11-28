import { useRetract } from '../../contexts/retract';
import { useState } from 'react';
import useRetractEffect from '../../../src/hooks/useRetract';
import AnimatedContainer from '../../hooks/motion';

import { useLocation } from "react-router-dom";
import MenuLateral from '../../components/_menuLateral/MenuLateral';
import BarraSuperior from '../../components/_barraSuperior/BarraSuperior';
import MenuCadastroTI from '../../components/admTI/_menuCadastroTI/menuCadastroTI';
import CadastroUsuariosEdit from '../../components/admTI/Usuarios/cadastroUsuários_edit/cadastroUsuariosEdit';

function UserEdit() {

  const location = useLocation();
  const data = location.state;

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
          <AnimatedContainer>
            <MenuCadastroTI />
            <CadastroUsuariosEdit  userData={data}/>
          </AnimatedContainer>
        </div>
      </div>
    </section>
  )
}

export default UserEdit;