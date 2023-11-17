import "./index.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import './modalStyles.scss'; // Importo estilos dos modais
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { findNews, deleteNew, alterNewStatus } from "../../../../services/apiNews";
import { useNavigate } from "react-router-dom";
import { converteData } from "../../../../functions/manipuladorDataHora";

Modal.setAppElement('#root'); 

const CadastroUsuarios =  () => {

  const navigate = useNavigate();
  
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  //MENSAGENS DE ERRO
  const [msg, setMsg] = useState("mensagem inicial");
  const [msgType, setMsgType] = useState("hidden");
  //  MODAL PARA ALTERAÇÃO DE SENHA
  const [isModalOpen, setIsModalOpen] = useState(false);
  //  MODAL PARA DELETAR USUÁRIO
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTitleToDelete, setSelectedTitleToDelete] = useState(null);
  const [selectediDToDelete, setSelectediDToDelete] = useState(null);
  // VARIAVEIS AUXILIARES
  const [control, setControl] = useState(false) //variavel para controle de recarregar a página qdo excluido o usuário
  const [filterHidden, setFilterHidden] = useState(true);
  const [haveSearch, setHaveSearch] = useState("0"); //variavel para verifica se tem alguma pesquisa ou não
  const [reset, setReset] = useState(false); //variavel para resetar a consulta

  //BUSCA NO SERVIDOR A LISTA DE NOTICIAS
  useEffect(() => {
    const fetchData = async () => {
      
      try {
        const newsData = await findNews(data);
        setNews(newsData.news);  
        setLoading(false);
        setControl(false)
      } catch (err) {
        console.error('Ocorreu um erro durante a consulta:', err);
        setLoading(false);
      }
    };
    fetchData();
  }, [control]);

  useEffect(() => {
    setControl(false)
  }, [news, reset, haveSearch, control]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  //EDITA A NOTICIA
  const handleEdit = async (idNews, title, date, imageName, link, dateInit, dateEnd, status, text) => {
    const NewsData = { idNews, title, date, imageName, link, dateInit, dateEnd, status, text }   
    navigate("/ADM-TI/cadastro-noticias/edit",  {state: NewsData  }); 
  };

  //  MODAL PARA DELETAR NOTICIA
  const handleDelete = (idNews, titulo) => {
    setSelectedTitleToDelete(titulo);
    setSelectediDToDelete(idNews);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteNewConfirmed = async (news) => {
    if (news) {
      const response = await deleteNew(selectediDToDelete);
      setIsDeleteModalOpen(false);
      setSelectedTitleToDelete(null);
      setMsg(response.msg)
      if(response.msg_type === "success") {
        setMsgType("success")
      } else {
        setMsgType("error")
      }
      // Define um atraso de 3 segundos (3000 milissegundos) para reverter para "hidden"  
      setTimeout(() => {
        setMsgType("hidden");
      }, 3000);
      closeModal();
      setControl(true)
    }
  };//FIM DA EXCLUSÃO DE NOTÍCIA

  const closeModal = () => {
    setIsModalOpen(false);
  };
   
  /* FUNÇÃO DO BOTÃO NOVO ... VAI PARA TELA DE NOVA NOTICIA*/
  const handleNew = (e) => {
        navigate("/ADM-TI/cadastro-noticias/create");         
  }

  //  ATIVA INIATIVAR NOTÍCIA
  const handleAlterStatus = async (idNews, status) => {
    try {
      const response = await alterNewStatus(idNews, status);
      setMsg(response.msg)
      if(response.msg_type === "success") {
        setMsgType("success")
      } else {
        setMsgType("error")
      }
      // Define um atraso de 3 segundos (3000 milissegundos) para reverter para "hidden"  
      setTimeout(() => {
        setMsgType("hidden");
      }, 3000);
      closeModal();
      setLoading(false);
      setControl(true)
    } catch (err) {
      console.error('Ocorreu um erro durante a consulta:', err);
      setLoading(false);
    }
  };

    /* RENDERIZAÇÃO DA PÁGINA ********************************************************* */
    return (
    <section className="cadastroNoticias">
      <div className="titulo">

        <h2>Notícias</h2>
         
        <button className="Btn defaultBtn" type="button" onClick ={handleNew}>Nova Notícia</button>
      </div>
      
      <hr />
      
      <div className="tabela"> 
        <table className="table table-striped">
          <thead>
            <tr>
              <th className="short" hidden>#</th>
              <th>Título</th>
              <th>Data</th>  
              <th>Imagem</th>
              <th>Link</th>
              <th style={{textAlign: "center"}}>Data de Início</th>
              <th style={{textAlign: "center"}}>Data de Fim</th>
              <th style={{textAlign: "center"}}>&nbsp;&nbsp;&nbsp;Status&nbsp;&nbsp;&nbsp;</th>
              <th>Criado em</th>
              <th style={{textAlign: "center"}}>Editar</th>
              <th style={{textAlign: "center"}}>Excluir</th>
              <th style={{textAlign: "center"}} hidden>Texto</th>
            </tr>
          </thead>
          <tbody className="">
              {news.map((nw) => (
                <tr key={nw.idNews}>
                  <td hidden>{nw.idNews}</td>
                  <td>{nw.title}</td>
                  <td>{nw.date}</td>
                  <td>{nw.imageName ? nw.imageName.split('\\').pop() : ''}</td>
                  <td>{nw.link}</td>
                  <td style={{textAlign: "center"}}>&nbsp;&nbsp;&nbsp;&nbsp;{converteData(nw.dateInit)}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                  <td style={{textAlign: "center"}}>&nbsp;&nbsp;&nbsp;&nbsp;{converteData(nw.dateEnd)}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                  <td style={{textAlign: "center"}}>
                    {nw.status === 1 ? 'Ativo' : 'Inativo'}&nbsp;
                    <img className="icon" src="../images/setaCimaBaixo.png" alt="editar2"
                          onClick={() => handleAlterStatus(nw.idNews, nw.status)} />
                  </td>
                  <td>{converteData(nw.createdAt)}</td>

                  <td style={{textAlign: "center"}}>
                    <img className="icon" src="../images/editar2.png" alt="editar2" 
                    onClick={() => handleEdit(nw.idNews, nw.title, nw.date, nw.imageName, nw.link, nw.dateInit, nw.dateEnd, nw.status, nw.text )} />
                  </td>

                  <td style={{textAlign: "center"}}>
                      <img className="icon" src="../images/lixeira-com-tampa.png" alt="lixeira-com-tampa"
                      onClick={() => handleDelete(nw.idNews, nw.title,)} />
                  </td>
                  <td hidden >{nw.text}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>      
      

      {/* //MODAL PARA DELETAR O USUÁRIO */}
      <Modal
        className="custom-modal" // Classe personalizada para estilização
        login={selectedTitleToDelete}
        userId={selectediDToDelete}
        isOpen={isDeleteModalOpen}
        onRequestClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedTitleToDelete(null);
        }}
      >
        <h2>Confirmar Exclusão</h2>

        <p>Tem certeza que deseja excluir a noticia <br /><span>{selectedTitleToDelete}</span> ?</p>

        <div className="btn">
          <button className="Btn escBtn" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</button>
          <button className="Btn okBtn" onClick={() => handleDeleteNewConfirmed(selectediDToDelete)}>Confirmar</button>
        </div>

      </Modal>

          <div className={'msg ' + msgType}>{msg}</div>
    </section>
  )
};

export default CadastroUsuarios;