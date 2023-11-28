import { useRetract } from '../../contexts/retract';
import React, { useState } from "react";
import useRetractEffect from '../../hooks/useRetract';
import AnimatedContainer from '../../hooks/motion';

import MenuLateral from '../../components/_menuLateral/MenuLateral';
import BarraSuperior from '../../components/_barraSuperior/BarraSuperior';
import MenuEtiquetas from '../../components/etiquetas/_menuEtiquetas/menuEtiquetas';
import EtiquetasCura from '../../components/etiquetas/etiquetasCura/etiquetas-cura';

function Etiq() {

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
            <MenuEtiquetas />
            <EtiquetasCura />
          </AnimatedContainer>
        </div>
      </div>
    </section>
  )
}

export default Etiq