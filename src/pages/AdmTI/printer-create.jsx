import { useRetract } from '../../contexts/retract';
import { useState } from 'react';
import useRetractEffect from '../../hooks/useRetract';
import AnimatedContainer from '../../hooks/motion';

import MenuLateral from '../../components/_menuLateral/MenuLateral';
import BarraSuperior from '../../components/_barraSuperior/BarraSuperior';
import MenuCadastroTI from '../../components/admTI/_menuCadastroTI/menuCadastroTI';
import CadastroImpressorasCreate from '../../components/admTI/Impressoras/cadastroImpressoras_create/admti_cadastroImpressorasCreate';

function PrinterCreate() {

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
            <div className='split'>
              <MenuCadastroTI />
              <CadastroImpressorasCreate /> 
            </div>
          </AnimatedContainer>
        </div>
      </div>
    </section>
  )
}

export default PrinterCreate;