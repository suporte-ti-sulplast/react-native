import "./index.scss";
import { Link } from "react-router-dom";

function MenuLateral() {
  return (
    // eslint-disable-next-line
    <section className='menuLateral'>
        <ul className="nav flex-column text-start">
            
            <li className="nav-item">
            
                <Link className="nav-link" aria-current="page" to="/home"><img src="../images/home.png" alt="home" />HOME</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" aria-current="page" to=""><img src="../images/portaria.png" alt="portaria" />Portaria</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" aria-current="page" to=""><img src="../images/zebra.png" alt="zebra" />Etiquetas</Link>
            </li>

            <li className="nav-item">
                <Link className="nav-link" aria-current="page" to=""><img src="../images/SGIs.png" alt="SGIs" />SGIs</Link>
            </li>

            <li className="nav-item">
                <Link className="nav-link" aria-current="page" to=""><img src="../images/ITs.png" alt="ITs" />ITs</Link>
            </li>

            <li className="nav-item">
                <Link className="nav-link" aria-current="page" to=""><img src="../images/Treinamentos.png" alt="Treinamentos" />Treinamentos</Link>
            </li>

            <li className="nav-item">
                <Link className="nav-link" aria-current="page" to=""><img src="../images/LGPD.png" alt="LGPD" />LGPD</Link>
            </li>

            <li className="nav-item">
                <Link className="nav-link" aria-current="page" to=""><img src="../images/dicas.png" alt="dicas" />Dicas</Link>
            </li>


            <li className="nav-item dropdown" aria-current="page">
                <Link className="nav-link dropdown-toggle" data-bs-toggle="dropdown"to="" role="button" aria-expanded="false"><img src="../images/ADMTI.png" alt="ADMTI" />ADM-TI</Link>
                <ul id="dropdown-menu" className="dropdown-menu">
                    <li><Link className="dropdown-item" href=""><img src="../images/cadastro.png" alt="cadastro" />Cadastro</Link></li>
                </ul>
            </li>

        </ul>
    </section>
  )
}

export default MenuLateral