import "./index.scss";
import { Link } from "react-router-dom";

function menuCadastroTI() {

  return (
    <section className="menuCadastroTI">
        <div className="title">
            <img src="../images/ADM-TI.png" alt="" />
            <h1>Painel de administrador - TI</h1>
        </div>
        <div className="cadastro">
          <p><strong>CADASTROS</strong></p>
          <ul>
              <Link to="/ADM-TI/cadastro-usuarios">Usuários</Link>
              <Link to="/ADM-TI/cadastro-veiculos">Veículos</Link>
 {/*              <Link to="/ADM-TI/cadastro-setores">Setores</Link>
              <Link to="/ADM-TI/cadastro-niveis-acesso">Níveis de acesso</Link> */}
              <Link to="/ADM-TI/cadastro-noticias">Notícias</Link>    
              <Link to="/ADM-TI/cadastro-impressoras">Impressoras</Link>   
          </ul>
        </div>

    </section>
  )
};

export default menuCadastroTI;