import { useRetract } from '../../contexts/retract';
import { useState } from 'react';
import useRetractEffect from '../../hooks/useRetract';
import AnimatedContainer from '../../hooks/motion';

import { useLocation } from "react-router-dom";
import MenuLateral from '../../components/_menuLateral/MenuLateral';
import BarraSuperior from '../../components/_barraSuperior/BarraSuperior';
import MenuPortaria from '../../components/portaria/_menuPortaria/menuPortaria';
import ControleMovimentoVeiculos from '../../components/portaria/controle-movimento-veiculos/controle-movimento-veiculos';

function ControlePortaria() {

  const location = useLocation();
  const vehicleId = location.state;
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
            <MenuPortaria />
            <ControleMovimentoVeiculos userData={vehicleId} />
          </AnimatedContainer>
        </div>
      </div>
    </section>
  )
}

export default ControlePortaria