import React, { useState, useContext } from "react";

import MenuLateral from '../../components/_menuLateral/MenuLateral';
import BarraSuperior from '../../components/_barraSuperior/BarraSuperior';
import MenuCadastroTI from '../../components/admTI/_menuCadastroTI/menuCadastroTI';

function AdmTI() {

  return (
    <section>
       <BarraSuperior />
      <div className='corpo'>
        <div className="lateralEsquerda">
          <MenuLateral />
        </div>
        <div className="lateralDireita">
          <MenuCadastroTI />
        </div>
      </div>
    </section>
  )
}

export default AdmTI