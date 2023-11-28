import "./index.scss";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';

function MenuFinanceiro() {

  const [estiloRel, setEstiloRel] = useState({ display: "none" });

  useEffect(() => {

  },[estiloRel])

  return (
    <section className="menuFinanceir">
      <div className="geral">
        <div className="title">
            <img src="../images/Financeiro.png" alt="" />
            <h1>Painel financeiro</h1>
        </div>

        <nav className="menu-nav">
          <ul className="menu-principal">
        {/*     <li><p>APLICAÇÕES</p>
              <ul className="sub-menu">
              </ul>
            </li> */}
            <li
              onMouseOver={() => setEstiloRel({ display: "block" })}
              onMouseOut={() => setEstiloRel({ display: "none" })}
            ><p>RELATÓRIOS</p>
              <ul
                className="sub-menu"
                style={estiloRel}
              >
                <li><Link to="/Financeiro/relatorio-fechamentoEstoque">Fechamento de estoque</Link></li>
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

export default MenuFinanceiro;