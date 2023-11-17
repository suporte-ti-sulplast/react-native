import "./index.scss";
import { Link } from "react-router-dom";

function menuPortaria() {

  return (
    <section className="menuPortaria">
        <div className="title">
            <img src="../images/Portaria.png" alt="" />
            <h1>Painel portaria</h1>
        </div>
        <div className="cadastro">
          <p><strong>APLICAÇÕES</strong></p>
          <ul>
              <Link to="/Portaria/controle-lista-veiculos">Controle movimento veículos</Link>
          </ul>
        </div>

    </section>
  )
};

export default menuPortaria;