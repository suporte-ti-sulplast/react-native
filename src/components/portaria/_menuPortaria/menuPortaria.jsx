import "./index.scss";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';

function MenuPortaria() {

  const [estiloVeic, setEstiloVeic] = useState({ display: "none" });

  useEffect(() => {

  },[estiloVeic])

  return (
    <section className="menuPortaria">
            <div className="geral">
        <div className="title">
            <img src="../images/Portaria.png" alt="" />
            <h1>Painel portaria</h1>
        </div>

        <nav className="menu-nav">
          <ul className="menu-principal">
        {/*     <li><p>APLICAÇÕES</p>
              <ul className="sub-menu">
              </ul>
            </li> */}
            <li
              onMouseOver={() => setEstiloVeic({ display: "block" })}
              onMouseOut={() => setEstiloVeic({ display: "none" })}
            ><p>APLICAÇÕES</p>
              <ul
                className="sub-menu"
                style={estiloVeic}
              >
                <li><Link to="/Portaria/controle-lista-veiculos">Movimento veículos</Link></li>
          {/*       <li><Link to="/ADM-TI/cadastro-veiculos">Veículos</Link></li>
                <li><Link to="/ADM-TI/cadastro-setores">Setores</Link></li>
                <li><Link to="/ADM-TI/cadastro-niveis-acesso">Níveis de acesso</Link></li> */}
              </ul>
            </li>

           {/*  <li><p>RELATÓRIOS</p>
              <ul className="sub-menu">
              </ul>
            </li> */}

          </ul>
        </nav>
      </div>
    </section>
  )
};

export default MenuPortaria;