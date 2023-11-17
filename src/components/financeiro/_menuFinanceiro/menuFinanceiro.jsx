import "./index.scss";
import { Link } from "react-router-dom";

function menuFinanceiro() {

  return (
    <section className="menuFinanceiro">
        <div className="title">
            <img src="../images/Financeiro.png" alt="" />
            <h1>Painel financeiro</h1>
        </div>
        <div className="cadastro">
          <p><strong>RELATÓRIOS</strong></p>
          <ul>
              <Link to="/Financeiro/relatorio-fechamentoEstoque">Fechamento de estoque</Link>
          </ul>
        </div>

    </section>
  )
};

export default menuFinanceiro;