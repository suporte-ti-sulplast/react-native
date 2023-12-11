import { useRetract } from '../../contexts/retract';
import { useState } from 'react';
import useRetractEffect from '../../hooks/useRetract';
import AnimatedContainer from '../../hooks/motion';

import { useLocation } from "react-router-dom";
import MenuLateral from '../../components/_menuLateral/MenuLateral';
import BarraSuperior from '../../components/_barraSuperior/BarraSuperior';
import MenuCadastroTI from '../../components/admTI/_menuCadastroTI/menuCadastroTI';
import CadastroImpressorasEdit from '../../components/admTI/Impressoras/cadastroImpressoras_edit/admti_cadastroImpressorasEdit';

function PrinterEdit() {

  const location = useLocation();
  const [body, setBody] = useState();
  const printerId = location.state;

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
            <div className='split'>
              <MenuCadastroTI />
              <CadastroImpressorasEdit userData={printerId} />
            </div>
          </AnimatedContainer>
        </div>
      </div>
    </section>
  )
}

export default PrinterEdit;