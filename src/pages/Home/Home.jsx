import MenuLateral from '../../components/_menuLateral/MenuLateral';
import BarraSuperior from '../../components/_barraSuperior/BarraSuperior';
import LinksUteis from '../../components/home_linksUteis/LinksUteis';
import Noticias from '../../components/home_noticias/Noticias';

function Home() {

  return (
    <section>
       <BarraSuperior />
      <div className='corpo'>
        <div className="lateralEsquerda">
          <MenuLateral />
        </div>
        <div className="lateralDireita">
          <LinksUteis />
{          <Noticias />}
        </div>
      </div>
    </section>
  )
}

export default Home

































/* import React, { useContext } from "react";

import { AuthContext } from "../../contexts/auth";

const Home = () => {

    const { authenticated, logout } = useContext(AuthContext)

    const handleLogout = () => {
        logout();
    };

    return (
        <>  
        <h1>Home</h1><br />
        <p>{String(authenticated)}</p><br />
        <button onClick={handleLogout}>Sair</button>
        </>

    );
};

export default Home; */