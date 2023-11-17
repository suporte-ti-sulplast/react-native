import "./index.scss";
import { Link } from "react-router-dom";

function menuFinanceiro() {

  return (
    <section className="menuFinanceiro">
        <div className="title">
            <img src="../images/Etiquetas.png" alt="" />
            <h1>Painel etiquetas</h1>
        </div>
        <div className="cadastro">
          <p><strong>ETIQUETAS</strong></p>
          <ul>
              <Link to="/Etiquetas/etiquetas-qualidade">Qualidade</Link>
              <Link to="/Etiquetas/etiquetas-cura">Cura</Link>
              <Link to="/Etiquetas/etiquetas-data">Data</Link>
              <Link to="/Etiquetas/etiquetas-teste">Teste</Link>
              <Link to="/Etiquetas/etiquetas-roto">Roto</Link>
          </ul>
        </div>

    </section>
  )
};

export default menuFinanceiro;