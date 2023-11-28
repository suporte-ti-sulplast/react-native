import "./index.scss"
import AnimatedContainer from '../../hooks/motion';
import { useNavigate } from "react-router-dom";

function NotFound() {

  const navigate = useNavigate();
  const recoveredUser = localStorage.getItem('user')

  /* FUNÇÃO DO BOTÃO CANCELAR ... VOLTA PARA LISTA DE USERS */
  const handleVoltar = (e) => {
    if(recoveredUser){
      navigate("/home"); 
    } else {
      navigate("/"); 
    }
  }


  return (
    <AnimatedContainer>
    <div className='NotFound'>
        <h1>Página não encontrada</h1>
        <br />
        <button className="Btn" type="submit" onClick ={handleVoltar}>Voltar</button>
    </div>
    </AnimatedContainer>
  )
}

export default NotFound