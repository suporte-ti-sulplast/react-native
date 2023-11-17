import { useRetract } from '../../contexts/retract';
import { useState } from 'react';
import useRetractEffect from '../../hooks/useRetract';

import { useLocation } from "react-router-dom";
import MenuLateral from '../../components/_menuLateral/MenuLateral';
import BarraSuperior from '../../components/_barraSuperior/BarraSuperior';
import MenuFinanceiro from '../../components/financeiro/_menuFinanceiro/menuFinanceiro';
import RelatorioFechamentoEstoque from '../../components/financeiro/relatorio-fechamentoEstoque/relatorio-fechamentoEstoque';

function FechamentoEstoque() {

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
          <MenuFinanceiro />
          <RelatorioFechamentoEstoque />
        </div>
      </div>
    </section>
  )
}

export default FechamentoEstoque