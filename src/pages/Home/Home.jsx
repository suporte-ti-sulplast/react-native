import { useRetract } from '../../contexts/retract';
import { useState } from 'react';
import useRetractEffect from '../../../src/hooks/useRetract';

import MenuLateral from '../../components/_menuLateral/MenuLateral'
import BarraSuperior from '../../components/_barraSuperior/BarraSuperior';
import LinksUteis from '../../components/home_linksUteis/LinksUteis';
import Noticias from '../../components/home_noticias/Noticias';
import AnimatedContainer from '../../hooks/motion';

function Home() {

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
              <div className='splitHome'>
                <LinksUteis />
                <Noticias />
              </div>
            </AnimatedContainer>
          </div>
        </div>
      </section>
  )
}

export default Home;