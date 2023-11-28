import { useRetract } from '../../contexts/retract';
import { useState } from 'react';
import useRetractEffect from '../../hooks/useRetract';
import AnimatedContainer from '../../hooks/motion';

import { useLocation } from "react-router-dom";
import MenuLateral from '../../components/_menuLateral/MenuLateral';
import BarraSuperior from '../../components/_barraSuperior/BarraSuperior';
import MenuCadastroTI from '../../components/admTI/_menuCadastroTI/menuCadastroTI';
import CadastroNoticiasEdit from '../../components/admTI/Noticias/cadastroNews_edit/admti_cadastroNewsEdit';

function NewsEdit() {

  const location = useLocation();
  const userId = location.state;
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
            <CadastroNoticiasEdit userData={userId} />
          </AnimatedContainer>
        </div>
      </div>
    </section>
  )
}

export default NewsEdit;