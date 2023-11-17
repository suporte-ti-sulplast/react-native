import { useRetract } from '../../contexts/retract';
import { useState } from 'react';
import useRetractEffect from '../../hooks/useRetract';

import { useLocation } from "react-router-dom";
import MenuLateral from '../../components/_menuLateral/MenuLateral';
import BarraSuperior from '../../components/_barraSuperior/BarraSuperior';
import MenuPortaria from '../../components/portaria/_menuPortaria/menuPortaria';
import ControleListaVeiculos from '../../components/portaria/controle-lista-veiculos/controle-lista-veiculos';

function ControlePortaria() {

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
          <ControleListaVeiculos />
        </div>
      </div>
    </section>
  )
}

export default ControlePortaria