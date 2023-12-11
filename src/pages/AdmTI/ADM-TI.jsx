import { useRetract } from '../../contexts/retract';
import React, { useState } from "react";
import useRetractEffect from '../../../src/hooks/useRetract';
import AnimatedContainer from '../../hooks/motion';

import MenuLateral from '../../components/_menuLateral/MenuLateral';
import BarraSuperior from '../../components/_barraSuperior/BarraSuperior';
import MenuCadastroTI from '../../components/admTI/_menuCadastroTI/menuCadastroTI';

function AdmTI() {

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
            </AnimatedContainer>
          </div>
        </div>
      </section>
  )
}

export default AdmTI;