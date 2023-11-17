import "./index.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import './modalStyles.scss'; // Importo estilos dos modais
import React, { useState, useEffect, useRef, useContext } from 'react';
import Modal from 'react-modal';
import { findMovimentVehicles } from "../../../services/apiConcierge";
import { useNavigate } from "react-router-dom";
import { converteData, converteHora } from "../../../functions/manipuladorDataHora";
import { formatarNumeroComPontos } from "../../../functions/manipuladorNumeros";

Modal.setAppElement('#root'); 

const ControleMovimentoVeiculos = ( props ) => {

  const navigate = useNavigate();

  const veiculoNome = props.userData.vehicle_name;
  const veiculoId = props.userData.vehicle_id;
  
  const[movimento, setMovimento] = useState([]);

  const[id, setId] = useState(null);
  const[destiny, setDestiny] = useState(null);
  const[depDriver, setdDpDriver] = useState(null);
  const[depData, setDepData] = useState(null);
  const[depTime, setDepTime] = useState(null);
  const[depKm, setDepKm] = useState(null);
  const[depLiberator, setDepLiberator] = useState(null);
  const[depObservation, setDepObservation] = useState(null);
  const[arrDriver, setArrDriver] = useState(null);
  const[arrData, setArrData] = useState(null);
  const[arrTime, setArrTime] = useState(null);
  const[arrKm, setArrKm] = useState(null);
  const[arrLiberator, setArrLiberator] = useState(null);
  const[arrObservation, setArrObservation] = useState(null);
  const[distanceTravel, setDistanceTravel] = useState(null);
  //variaveis para enviar para novo movimento
  const[firstMove, setFirstMove] = useState([]);
  const[kmAtual, setKmAtual] = useState(null);
  const[moveOpen, setMoveOpen] = useState(false);

    //  MODAL PARA DELETAR USUÁRIO
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* CARREGA A LISTA DE VEICULOS AO CARREGAR A PÁGINA */
  useEffect(() => {
    const buscaMovimentoVeiculos  = async () => { 
      try {
        const resposta = await findMovimentVehicles(veiculoId);
        setMovimento(resposta.movimento);
        setFirstMove(resposta.movimento[0]);
      } catch (error) {
        console.log(error);
      }
    }
    buscaMovimentoVeiculos();
  },[])

    /* CARREGA A LISTA DE VEICULOS AO CARREGAR A PÁGINA */
    useEffect(() => {
      firstMove.arrival_km === null ? setKmAtual(firstMove.departure_km) :  setKmAtual(firstMove.arrival_km);
      firstMove.arrival_km === null ? setMoveOpen(true) :  setMoveOpen(false);
    },[firstMove]);

  //  MODAL PARA VISUALIZAR MOVIMENTO
  const handleView = (
    id,
    destiny,
    departure_driver,
    departure_date,
    departure_time,
    departure_km,
    departure_liberator,
    departurel_observation,
    arrival_driver,
    arrival_date,
    arrival_time,
    arrival_km,
    arrival_liberator,
    arrival_observation
    ) => {
      setId(id);
      setDestiny(destiny);
      setdDpDriver(departure_driver);
      setDepData(converteData(departure_date));
      setDepTime(converteHora(departure_time));
      setDepKm(formatarNumeroComPontos(departure_km));
      setDepLiberator(departure_liberator);
      setDepObservation(departurel_observation);
      setArrDriver(arrival_driver);
      setArrData(converteData(arrival_date));
      setArrTime(converteHora(arrival_time));
      setArrKm(formatarNumeroComPontos(arrival_km));
      setArrLiberator(arrival_liberator);
      setArrObservation(arrival_observation);
      setDistanceTravel( arrival_km === null ? 0 : formatarNumeroComPontos(arrival_km - departure_km) );
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  /* FUNÇÃO DO BOTÃO NOVO ... VAI PARA TELA DE MOVIMENTO PARA INSERIR UM NOVO MOVIMENTO*/
  const handleNew = () => {
    const currentTime = new Date().toLocaleTimeString('pt-BR', { hour12: false });
    navigate("/Portaria/controle-movimento-novo", {state:
      {
        veiculoId, kmAtual, veiculoNome, moveOpen, currentTime,
        destiny, depTime, depKm, depLiberator, depObservation, depDriver
      }
    }); 
  }

  /* FUNÇÃO DO BOTÃO NOVO ...VAI PARA TELA DE MOVIMENTO PARA ENCERRAR UM MOVIMENTO*/
  const handleClose = (
      id,
      destiny,
      depDriver,
      depData,
      depTime,
      depKm,
      depLiberator,
      depObservation
    ) => {
    const currentTime = new Date().toLocaleTimeString('pt-BR', { hour12: false });
    navigate("/Portaria/controle-movimento-novo", {state:
      {
        id,
        destiny,
        depDriver,
        depData,
        depTime, 
        depKm,
        depLiberator,
        depObservation,
        veiculoNome,
        moveOpen,
        veiculoId,
        currentTime
      }
    }); 
  }

  //FUNÇÃO CANCELA E VOLTA NA LISTA ANTERIOR
  const handleCancel = () => { 
    navigate("/Portaria/controle-lista-veiculos"); 
  } 

  return (
    <section className="controleMovimentoVeiculos">

      <div className="titulo">
        <h2>Registros de entradas e saídas do veículo: <strong>{veiculoNome}</strong></h2>  
        <div>
          <button className="Btn defaultBtn" type="button" style={{ display: moveOpen ? 'none' : 'block' }} onClick ={handleNew}>Novo registro</button>
        </div>
      </div>
      
      <div className="tabela"> 
        <table className="table table-striped">
          <thead>
            <tr>
              <th className="short" hidden>#</th>
              <th style={{width: "15rem", borderRight: '1px solid gray'}}>Destino</th>
              <th>Saída<br />Motorista</th>  
              <th>Data</th>
              <th>Hora</th>
              <th style={{borderRight: '1px solid gray'}}>Km</th>
              <th>Chegada<br />Motorista</th>
              <th>Data</th>
              <th>Hora</th>
              <th style={{borderRight: '1px solid gray'}}>Km</th>
              <th style={{borderRight: '1px solid gray', textAlign: "center"}}>Distância<br />percorrida</th>
              <th style={{textAlign: "center"}}>Fechar</th>
              <th style={{textAlign: "center"}}>Visualizar</th>
            </tr>
          </thead>
          <tbody className="">
              {movimento.map((mv) => (
                <tr key={mv.id}>
                  <td hidden>{mv.id}</td>
                  <td style={{borderRight: '1px solid gray'}}>{mv.destiny}</td>
                  {/* //dados da saida */}
                  <td>{mv.departure_driver}</td>
                  <td>{converteData(mv.departure_date)}</td>
                  <td>{converteHora(mv.departure_time)} hs</td>
                  <td style={{borderRight: '1px solid gray'}}>{formatarNumeroComPontos(mv.departure_km)}</td>
                  {/* //dados da chegada */}
                  <td>{mv.arrival_driver}</td>
                  <td>{converteData(mv.arrival_date)}</td>
                  <td>{converteHora(mv.arrival_time)} hs</td>
                  <td style={{borderRight: '1px solid gray'}}>{formatarNumeroComPontos(mv.arrival_km)}</td>
                  <td style={{borderRight: '1px solid gray', textAlign: "center"}}>{mv.arrival_km === null ? ""  :  formatarNumeroComPontos(mv.arrival_km - mv.departure_km) } km</td>

                  <td style={{textAlign: "center"}}>
                    {mv.status === 0 ? 
                    <img className="icon" src="../images/editar2.png" alt="editar2" 
                    onClick={() => handleClose
                        (
                          mv.id,
                          mv.destiny,
                          mv.departure_driver,
                          mv.departure_date,
                          mv.departure_time,
                          mv.departure_km,
                          mv.departure_liberator,
                          mv.departure_observation
                      )
                    } /> :
                    <img className="icon" src="../images/checked2.png" alt="checked" title="Registro já fechado" style={{ pointerEvents: 'none' }} />
                  }
                  </td>

                  <td style={{textAlign: "center"}}>
                      <img className="icon" src="../images/eye-blue.png" alt="lixeira-com-tampa"
                      onClick={() => handleView 
                        (
                          mv.id,
                          mv.destiny,
                          //dados da saida
                          mv.departure_driver,
                          mv.departure_date,
                          mv.departure_time,
                          mv.departure_km,
                          mv.departure_liberator,
                          mv.departure_observation,
                          //dados da chegada
                          mv.arrival_driver,
                          mv.arrival_date,
                          mv.arrival_time,
                          mv.arrival_km,
                          mv.arrival_liberator,
                          mv.arrival_observation
                        )} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>      


      {/* //MODAL PARA VISUALIZAR O MOVIMENTO DE ENTRADA E SAIDA DOS CARROS */}
      <Modal
        id={id}
        destiny={destiny}
        //dados da saida
        depDriver={depDriver}
        depData={depData}
        depTime={depTime}
        depKm={depKm}
        depLiberator={depLiberator}
        depObservation={depObservation}
        //dados da saida
        arrDriver={arrDriver}
        arrData={arrData}
        arrTime={arrTime}
        arrKm={arrKm}
        arrLiberator={arrLiberator}
        arrObservation={arrObservation}
        distanceTravel={distanceTravel}
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="custom-modal" // Classe personalizada para estilização
      >

              <h2>Visualizar movimento</h2>
              <h3>Destino: <span>{destiny}</span> </h3>
              <hr style={{border: "1px dashed lightgray", width: "100%", margin: "0.2rem"}} />
              
              <div className="modalContent">
                <div>
                {/* //dados da saida */}
                  <h3>Saída</h3>
                  <p>Motorista: <span>{depDriver}</span></p>
                  <p>Data: <span>{depData}</span></p>
                  <p>Hora: <span>{depTime}</span></p>
                  <p>Km: <span>{depKm}</span></p>
                  <p>Liberador: <span>{depLiberator}</span></p>
                  <p>Observação: <span>{depObservation}</span></p>
                </div>
                <div>
                {/* //dados da saida */}
                  <h3>Chegada</h3>
                    <p>Motorista: <span>{arrDriver}</span></p>
                    <p>Data: <span>{arrData}</span></p>
                    <p>Hora: <span>{arrTime}</span></p>
                    <p>Km: <span>{arrKm}</span></p>
                    <p>Liberador: <span>{arrLiberator}</span></p>
                    <p>Observação: <span>{arrObservation}</span></p>
                </div>
              </div>
              <hr style={{border: "1px dashed lightgray", width: "100%", margin: "0.2rem"}} />
              <h3>Distância percorrida: <span>{distanceTravel} km</span></h3>
              
              {/* BOTOÕES */}
              <div className="btn">
                <button className="Btn escBtn" onClick={closeModal}>Fechar</button>
              </div>

      </Modal>

    </section>
  )
};

export default ControleMovimentoVeiculos;