import "./index.scss";
import { Link } from "react-router-dom";
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../contexts/auth';

function MenuLGPD() {

  const { userLogged } = useContext(AuthContext);

  return (
    <section className="menuLGPD">
      <div className="geral">
        <div className="title">
            <img src="../images/LGPD.png" alt="LGPD" />
            <h1>Painel LGPD</h1>
        </div>

{/*       <nav className="menu-nav">
          <ul className="menu-principal">
             <li><p>APLICAÇÕES</p>
              <ul className="sub-menu">
              </ul>
            </li>
            <li
              onMouseOver={() => setEstiloEtiq({ display: "block" })}
              onMouseOut={() => setEstiloEtiq({ display: "none" })}
            ><p>ETIQUETAS</p>
              <ul
                className="sub-menu"
                style={estiloEtiq}
              >
                  <li><Link to="/Etiquetas/etiquetas-barcode39">BarCode39</Link></li>
                  <li><Link to="/Etiquetas/etiquetas-cura">Cura</Link></li>
                                  <li><Link to="/Etiquetas/etiquetas-data">Data</Link></li>
                {etiqUser.includes('CQ') && ( //só aparece se houver a sigla CQ em qualquer lugar da variavel
                  <li><Link to="/Etiquetas/etiquetas-qualidade">Qualidade</Link></li>
                )}
                {etiqUser.includes('RT') && (
                <li><Link to="/Etiquetas/etiquetas-roto">Rotomoldagem</Link></li>
                )}

                <li><Link to="/Etiquetas/etiquetas-teste">Texto</Link></li>
              </ul>
            </li>

             <li><p>RELATÓRIOS</p>
              <ul className="sub-menu">
              </ul>
            </li>

          </ul>
        </nav>  */}

      </div>
    </section>
  )
};

export default MenuLGPD;