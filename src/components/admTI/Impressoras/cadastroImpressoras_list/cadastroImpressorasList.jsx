import "./index.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import './modalStyles.scss'; // Importo estilos dos modais
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { depptoStatus} from "../../../../services/apiMASTER";
import { alterPrinterStatus, printerList, deletePrinter } from "../../../../services/apiPrinter";
import { useNavigate } from "react-router-dom";

Modal.setAppElement('#root'); 

const CadastroUsuarios =  () => {

  const navigate = useNavigate();

  const [printers, setPrinters] = useState([]);
  const [loading, setLoading] = useState(true);

  //MENSAGENS DE ERRO
  const [msg, setMsg] = useState("mensagem inicial");
  const [msgType, setMsgType] = useState("hidden");
  //  MODAL PARA ALTERAÇÃO DE SENHA
  const [isModalOpen, setIsModalOpen] = useState(false);
  //  MODAL PARA DELETAR USUÁRIO
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPrinterToDelete, setSelectedPrinterToDelete] = useState(null);
  const [selectediDToDelete, setSelectediDToDelete] = useState(null);
  // VARIAVEIS AUXILIARES
  const [control, setControl] = useState(false) //variavel para controle de recarregar a página qdo excluido o usuário
  const [filterHidden, setFilterHidden] = useState(true);
  const [haveSearch, setHaveSearch] = useState("0"); //variavel para verifica se tem alguma pesquisa ou não
  const [reset, setReset] = useState(false); //variavel para resetar a consulta

  //  MODAL PARA DELETAR IMPRESSORA
  const handleDelete = (idPrinter, printerName) => {
    setSelectedPrinterToDelete(printerName);
    setSelectediDToDelete(idPrinter);
    setIsDeleteModalOpen(true);
  };

  const handleDeletePrinterConfirmed = async (printer) => {
    if (printer) {
      const response = await deletePrinter(selectediDToDelete); 
      setIsDeleteModalOpen(false);
      setSelectedPrinterToDelete(null);
      setMsg(response.msg)
      if(response.msg_type === "success") {
        setMsgType("success")
      } else {
        setMsgType("error")
      }
      // Redirecionar de volta para a mesma rota (página de cadastro de impressoras)
      navigate("/ADM-TI/cadastro-impressoras"); 
      // Define um atraso de 3 segundos (3000 milissegundos) para reverter para "hidden"  
      setTimeout(() => {
        setMsgType("hidden");
      }, 3000);
      closeModal();
      setControl(true)
    }
  };//FIM DA EXCLUSÃO DE USUÁRIO

  const closeModal = () => {
    setIsModalOpen(false);
  };

  //BUSCA NO SERVIDOR A LISTA DE IMPRESSORAS
  useEffect(() => {
    const fetchData = async () => {
      
      try {
        const printers = await printerList();
        setPrinters(printers.resultado); 
        setLoading(false);
        setControl(false)
      } catch (err) {
        console.error('Ocorreu um erro durante a consulta:', err);
        setLoading(false);
      }
    };
    fetchData();
  }, [control]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  
  /* FUNÇÃO DO BOTÃO NOVO ... VAI PARA TELA DE NOVA IMPRESSORA*/
  const handleNew = (e) => {
    const getDepptoStattus = async () => {
      try {
        const depptoStattus = await depptoStatus();
        navigate("/ADM-TI/cadastro-impressoras/create", {state: depptoStattus  });         
        } catch (error) {
          console.error("Ocorreu um erro ao obter os dados:", error);
        }
      };
      getDepptoStattus();
  }

  //EDITA A IMPRESSORA
  const handleEdit = async (idPrinter) => { 
  const NewsData = { idPrinter }
    navigate("/ADM-TI/cadastro-impressoras/edit",  { state: NewsData  }); 
  };

  //  ATIVA INIATIVAR IMPRESSORA
  const handleAlterStatus = async (idPrinter, status) => {
    try {
      const response = await alterPrinterStatus(idPrinter, status);
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
    <section className="cadastroImpressoras">
      {/* Titulo e botão novo */}
      <div className="titulo">
        <h2>Impressoras</h2>
        <button className="Btn defaultBtn" type="button" onClick ={handleNew}>Nova Impressora</button>
      </div>

      <hr />
      
      <div className="tabela"> 
        <table className="table table-striped">
          <thead>
            <tr>
              <th className="short" hidden>#</th>
              <th>Nome</th>
              <th>Fabricante</th>  
              <th>Modelo</th>
              <th>Status</th>
              <th>REDE/USB</th>
              <th>IP</th>
              <th style={{textAlign: "center"}}>Editar</th>
              <th style={{textAlign: "center"}}>Excluir</th>
            </tr>
          </thead>
          <tbody className="">
              {printers.map((id) => (
                <tr key={id.idPrinter}>
                  <td hidden>{id.idPrinter}</td>
                  <td>{id.printerName}</td>
                  <td>{id.manufacturer}</td>
                  <td>{id.model}</td>
                  <td>
                    
                    <img className="icon" src="../images/setaCimaBaixo.png" alt="editar2"
                          onClick={() =>
                            handleAlterStatus(id.idPrinter, id.status)
                          } />
                         &nbsp;&nbsp; {id.status === 1 ? 'Ativo' : 'Inativo'}
                  </td>
                  <td>{id.netUsb == "0" ? "USB" : "REDE"}</td>
                  <td>{id.ip}</td>
                  <td style={{textAlign: "center"}}>
                    <img className="icon" src="../images/editar2.png" alt="editar2" 
                    onClick={() => handleEdit(id.idPrinter)} />
                  </td>

                  <td style={{textAlign: "center"}}>
                      <img className="icon" src="../images/lixeira-com-tampa.png" alt="lixeira-com-tampa"
                      onClick={() => handleDelete(id.idPrinter, id.printerName)} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>    


      {/* //MODAL PARA DELETAR A IMPRESSORA */}
      <Modal
        className="custom-modal" // Classe personalizada para estilização
        nome={selectedPrinterToDelete}
        idPrinter={selectediDToDelete}
        isOpen={isDeleteModalOpen}
        onRequestClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedPrinterToDelete(null);
        }}
      >
        <h2>Confirmar Exclusão</h2>

        <p>Tem certeza que deseja excluir a impressora <br /><span>{selectedPrinterToDelete}</span> ?</p>

        <div className="btn">
          <button className="Btn escBtn" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</button>
          <button className="Btn okBtn" onClick={() => handleDeletePrinterConfirmed(selectediDToDelete)}>Confirmar</button>
        </div>

      </Modal>  

      <div className={'msg ' + msgType}>{msg}</div>

    </section>
  )
};

export default CadastroUsuarios;