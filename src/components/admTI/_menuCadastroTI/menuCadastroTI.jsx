import "./index.scss";
import { Link } from "react-router-dom";

function menuCadastroTI() {

  return (
    <section className="menuCadastroTI">
        <div className="title">
            <img src="../images/ADM-TI.png" alt="" />
            <h1>Painel de Administrador - TI</h1>
        </div>
        <div className="cadastro">
          <p><strong>CADASTROS</strong></p>
          <ul>
              <Link to="/ADM-TI/cadastro-usuarios">Usuários</Link>
              <Link to="">Veículos</Link>
              <Link to="">Setores</Link>
              <Link to="">Níveis de Acesso</Link>
              <Link to="">Notícias</Link>      
          </ul>
        </div>

    </section>
  )
};

export default menuCadastroTI;