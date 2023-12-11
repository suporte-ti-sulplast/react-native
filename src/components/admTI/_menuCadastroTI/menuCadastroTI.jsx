import "./index.scss";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';


function MenuCadastroTI() {

  const [estiloCad, setEstiloCad] = useState({ display: "none" });

  useEffect(() => {

  },[estiloCad])

  return (
    <section className="menuCadastroTI">
      <div className="geral">
        <div className="title">
            <img src="../../images/ADM-TI.png" alt="" />
            <h1>Painel de administrador - TI</h1>
        </div>

        <nav className="menu-nav">
          <ul className="menu-principal">
        {/*   <li><p>APLICAÇÕES</p>
              <ul className="sub-menu">
              </ul>
            </li> */}
            <li
              onMouseOver={() => setEstiloCad({ display: "block" })}
              onMouseOut={() => setEstiloCad({ display: "none" })}
            ><p>CADASTROS</p>
              <ul
                className="sub-menu"
                style={estiloCad}
              >
                <li><Link to="/ADM-TI/cadastro-usuarios">Usuários</Link></li>
          {/*   <li><Link to="/ADM-TI/cadastro-veiculos">Veículos</Link></li>
                <li><Link to="/ADM-TI/cadastro-setores">Setores</Link></li>
                <li><Link to="/ADM-TI/cadastro-niveis-acesso">Níveis de acesso</Link></li> */}
                <li><Link to="/ADM-TI/cadastro-noticias">Notícias</Link></li>  
                <li><Link to="/ADM-TI/cadastro-impressoras">Impressoras</Link></li> 
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

export default MenuCadastroTI;