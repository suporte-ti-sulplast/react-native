import { useRetract } from '../../contexts/retract';
import React, { useState } from "react";
import useRetractEffect from '../../hooks/useRetract';

import MenuLateral from '../../components/_menuLateral/MenuLateral';
import BarraSuperior from '../../components/_barraSuperior/BarraSuperior';
import MenuPortaria from '../../components/portaria/_menuPortaria/menuPortaria';

function Portaria() {

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
          <MenuPortaria />
        </div>
      </div>
    </section>
  )
}

export default Portaria