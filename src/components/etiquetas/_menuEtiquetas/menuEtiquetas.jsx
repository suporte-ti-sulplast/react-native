import "./index.scss";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';

function MenuFinanceiro() {

  const [estiloEtiq, setEstiloEtiq] = useState({ display: "none" });

  useEffect(() => {

  },[estiloEtiq])

  return (
    <section className="menuFinanceiro">
      <div className="geral">
        <div className="title">
            <img src="../images/Etiquetas.png" alt="" />
            <h1>Painel etiquetas</h1>
        </div>

        <nav className="menu-nav">
          <ul className="menu-principal">
          {/*   <li><p>APLICAÇÕES</p>
              <ul className="sub-menu">
              </ul>
            </li> */}
            <li
              onMouseOver={() => setEstiloEtiq({ display: "block" })}
              onMouseOut={() => setEstiloEtiq({ display: "none" })}
            ><p>ETIQUETAS</p>
              <ul
                className="sub-menu"
                style={estiloEtiq}
              >
                <li><Link to="/Etiquetas/etiquetas-qualidade">Qualidade</Link></li>
                <li><Link to="/Etiquetas/etiquetas-cura">Cura</Link></li>
                <li><Link to="/Etiquetas/etiquetas-data">Data</Link></li>
                <li><Link to="/Etiquetas/etiquetas-teste">Texto</Link></li>
                <li><Link to="/Etiquetas/etiquetas-roto">Rotomoldagem</Link></li>
                <li><Link to="/Etiquetas/etiquetas-barcode39">BarCode39</Link></li>
              </ul>
            </li>

         {/*    <li><p>RELATÓRIOS</p>
              <ul className="sub-menu">
              </ul>
            </li> */}

          </ul>
        </nav>




     {/*    <div className="cadastro">
          <p><strong>ETIQUETAS</strong></p>
          <ul>
          <li><Link to="/Etiquetas/etiquetas-qualidade">Qualidade</Link></li>
          <li><Link to="/Etiquetas/etiquetas-cura">Cura</Link></li>
          <li><Link to="/Etiquetas/etiquetas-data">Data</Link></li>
          <li><Link to="/Etiquetas/etiquetas-teste">Texto</Link></li>
          <li><Link to="/Etiquetas/etiquetas-roto">Rotomoldagem</Link></li>
          <li><Link to="/Etiquetas/etiquetas-barcode39">BarCode39</Link></li>
          </ul>
        </div> */}
      </div>
    </section>
  )
};

export default MenuFinanceiro;