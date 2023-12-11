import { useRetract } from '../../contexts/retract';
import { useState } from 'react';
import useRetractEffect from '../../hooks/useRetract';
import AnimatedContainer from '../../hooks/motion';

import { useLocation } from "react-router-dom";
import MenuLateral from '../../components/_menuLateral/MenuLateral';
import BarraSuperior from '../../components/_barraSuperior/BarraSuperior';
import MenuPortaria from '../../components/portaria/_menuPortaria/menuPortaria';
import ControleMovimentoNovo from '../../components/portaria/controle-movimento-novo-movimento/controle-movimento-novo-movimento';

function ControlePortaria() {

  const [body, setBody] = useState();

  const { retract } = useRetract();
  const location = useLocation();
  const vehicleData = location.state;
  
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
            <div className='split'>
              <MenuPortaria />
              <ControleMovimentoNovo userData={vehicleData} />
            </div>
          </AnimatedContainer>
        </div>
      </div>
    </section>
  )
}

export default ControlePortaria