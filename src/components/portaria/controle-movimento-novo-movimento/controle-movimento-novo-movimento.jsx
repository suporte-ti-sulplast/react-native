import "./index.scss";
import React, { useState, useEffect, useContext  } from 'react';
import { useNavigate } from "react-router-dom";
import { formatarNumeroComPontos, isValidNumberInput } from "../../../functions/manipuladorNumeros";
import { converteHora, converteData, validarFormatoHora } from "../../../functions/manipuladorDataHora";
import { AuthContext } from '../../../contexts/auth';
import { movimentSave } from "../../../services/apiConcierge";

const NewMoviment = ( props ) => {

  const { userLogged } = useContext(AuthContext);

    const navigate = useNavigate();
    const MAX_CARACTERES = 150;    
    const moveOpen = props.userData.moveOpen; //aqui ele recebe a informação se é um NOVO movimento ou se é FECHAR um movimento aberto
    const currentTime = props.userData.currentTime; //aqui ele recebe a hora em que o botão da página anterior é clicado
    const today = new Date().toISOString().split('T')[0]; //aqui ele captura o dia atual

    //USESTATES QUE RECEBEM OS DADOS DOS DADOS
    const[id, setId] = useState(props.userData.id || null);
    const[veiculoId, setVeiculoId] = useState(props.userData.veiculoId);
    const[name, setName] = useState(props.userData.veiculoNome);
    const[destiny, setDestiny] = useState(props.userData.destiny);
    const[depDriver, setdDpDriver] = useState(props.userData.depDriver);
    const[depData, setDepData] = useState("");
    const[depTime, setDepTime] = useState("");
    const[depKm, setDepKm] = useState( !moveOpen ? props.userData.kmAtual + 1 : props.userData.depKm + 1);
    const[depLiberator, setDepLiberator] = useState(userLogged.logged.nameComplete);
    const[depObservation, setDepObservation] = useState(props.userData.depObservation);
    const[arrDriver, setArrDriver] = useState(null);
    const[arrData, setArrData] = useState("");
    const[arrTime, setArrTime] = useState(null);
    const[arrKm, setArrKm] = useState(!moveOpen ? formatarNumeroComPontos(props.userData.kmAtual + 1) : formatarNumeroComPontos(props.userData.depKm + 1));
    const[arrLiberator, setArrLiberator] = useState(userLogged.logged.nameComplete);
    const[arrObservation, setArrObservation] = useState(null);
    const[inputDesabilitado,  setInputDesabilitado] = useState(!moveOpen ? "" : "input-leitura");
   
    //USESTATES DOS ERROS
    const [msg, setMsg] = useState("mensagem inicial"); //MENSAGEM DE RETORNO DA API DO BANCO RODAPÉ
    const [msgType, setMsgType] = useState("hidden"); //MENSAGEM DE RETORNO DA API DO BANCO RODAPÉ
    const [textErroClass, setTextErroClass] = useState("hidden");
    const [textErro, setTextErro] = useState("Necessário preencher todos os campos");
    const [depObservationMax, setDepObservationMax]= useState("");
    const [arrObservationMax, setArrObservationMax]= useState("");    
    const [kmReferencia, setKmReferencia] = useState(!moveOpen ? formatarNumeroComPontos(props.userData.kmAtual + 1) : formatarNumeroComPontos(props.userData.depKm + 1));

    //verifica se todos os campos foram preenchidos e retira a mensagem de alerta de preenchimento
    useEffect(() => {
      
      !moveOpen ? setDepTime(converteHora(currentTime)) : setDepTime(converteHora(props.userData.depTime))
      setArrTime(converteHora(currentTime));

      !moveOpen ? setDepData(today) : setDepData(props.userData.depData)
      setArrData(today);
    },[]);

    useEffect(() => {
      if( destiny  && depDriver && depTime && depKm ){
          setTextErroClass("hidden");
        }
    },[destiny, depDriver, depData, depTime, depKm, depLiberator]);

    useEffect(() => {
      if( arrDriver && arrTime && arrKm ){
          setTextErroClass("hidden");
        }
    },[ arrDriver, arrData, arrTime, arrKm, arrLiberator ]);
 
    //FUNÇÃO DO BOTÃO DE SUBMIT DO FORMULÁRIO
    const handleSubmit =  async (e) => {
        const vehicle_id = veiculoId;
        const vehicle_name =  name;

        e.preventDefault(); //PREVINE A AÇÃO DEFULT DO FORMULÁRIO
                    
        //Aqui verifica se é um movimento novo ou se é para encerrar um movimento aberto            
        if(moveOpen){//se é um movimento aberto segue essa rota

            //Valida se todos os campos estão preenchidos
            if( arrDriver && arrTime && arrKm ){

                  const arrTimeDate = new Date(`2000-01-01T${arrTime}`); //converte a string arrTime em horas reais
                  const currentTimeDate = new Date(`2000-01-01T${currentTime}`); //converte a string currentTime em horas reais
                  arrTimeDate.setMinutes(arrTimeDate.getMinutes() + 1); //adiciona 1 minuto na variavel arrTimeDate para não dar erro por estar desprezando os segundos

                  //valida se o KM ou a Hora não é inferior ao anterior não é inferior ao anterior
                  if(arrKm < kmReferencia || !isValidNumberInput(arrKm)  || arrTimeDate < currentTimeDate || !validarFormatoHora(arrTime)){

                      //mostra erro caso o problema seja o KM
                      if(arrKm < kmReferencia || !isValidNumberInput(arrKm)){
                        setTextErroClass("show");
                        setTextErro("O valor do KM é inválido ou é inferior a kilometragem anterior.");
                      //mostra erro caso o problema seja a hora
                      }
                      if(arrTimeDate < currentTimeDate || !validarFormatoHora(arrTime)){
                        setTextErroClass("show");
                        setTextErro("O valor de hora digitado é inválido ou é anterior á hora atual.");
                      } 
                            
                  } else {
                      //    AQUI VAI SALVAR AS INFORMAÇÕES NO BANCO DE DADOS
                      const data = {
                                    destiny,
                                    depDriver,
                                    depData,
                                    depTime,
                                    depKm,
                                    depLiberator,
                                    depObservation,
                                    arrDriver,
                                    arrData,
                                    arrTime,
                                    arrKm,
                                    arrLiberator,
                                    arrObservation,
                                    veiculoId,
                                    moveOpen,
                                    id
                                  };

                          //FUNÇÃO QUE SALVA O MOVIMENTO NO BANCO
                            try {
                              const response = await movimentSave(data);
                              setMsg(response.msg);

                              if(response.msg_type === "success") {
                                setMsgType("success");
                              } else {
                                setMsgType("error");
                              }

                              //limpa variáveis
                              
                              // Define um atraso de 3 segundos (3000 milissegundos) para reverter para "hidden"  
                              setTimeout(() => {
                                setMsgType("hidden");
                                handleCancel(vehicle_id, vehicle_name);
                              }, 3000); 
                            } catch (error) {
                              console.log(error);
                            };
                    };

            } else {
              setTextErroClass("show");
              setTextErro("Necessário preencher todos os campos");
            };
                     
                    
        } else {//se é um movimento novo segue essa rota

            //faz as validações
            //Valida se todos os campos estão preenchidos
            if( destiny  && depDriver && depTime && depKm ) {

                const depTimeDate = new Date(`2000-01-01T${depTime}`); //converte a string depTime em horas reais
                const currentTimeDate = new Date(`2000-01-01T${currentTime}`); //converte a string currentTime em horas reais
                depTimeDate.setMinutes(depTimeDate.getMinutes() + 1); //adiciona 1 minuto na variavel depTimeDate para não dar erro por estar desprezando os segundos

                //valida se o KM ou a Hora não é inferior ao anterior não é inferior ao anterior
                if(depKm < kmReferencia || !isValidNumberInput(depKm) || depTimeDate < currentTimeDate || !validarFormatoHora(depTime) ){

                    //mostra erro caso o problema seja o KM
                    if(depKm < kmReferencia || !isValidNumberInput(depKm)){
                      setTextErroClass("show");
                      setTextErro("O valor do KM é inválido ou é inferior a kilometragem anterior.");
                    }
                    //mostra erro caso o problema seja a hora
                    //valida se a Hora não é inferior a hora atual
                    if(depTimeDate < currentTimeDate || !validarFormatoHora(depTime) ){
                      setTextErroClass("show");
                      setTextErro("O valor de hora digitado é inválido ou é anterior á hora atual.");
                    };

                }   else {
                   //    AQUI VAI SALVAR AS INFORMAÇÕES NO BANCO DE DADOS
                   const data = {
                                  destiny,
                                  depDriver,
                                  depData,
                                  depTime,
                                  depKm,
                                  depLiberator,
                                  depObservation,
                                  arrDriver,
                                  arrData,
                                  arrTime,
                                  arrKm,
                                  arrLiberator,
                                  arrObservation,
                                  veiculoId,
                                  moveOpen,
                                  id
                                };

                       //FUNÇÃO QUE SALVA O MOVIMENTO NO BANCO
                       try {
                        const response = await movimentSave(data);
                        setMsg(response.msg);
                        if(response.msg_type === "success") {
                          setMsgType("success");
                        } else {
                          setMsgType("error");
                        }

                        //limpa variáveis
                        
                        // Define um atraso de 3 segundos (3000 milissegundos) para reverter para "hidden"  
                        setTimeout(() => {
                          setMsgType("hidden");
                          handleCancel(vehicle_id, vehicle_name);
                        }, 3000); 
                      } catch (error) {
                        console.log(error);
                      };
                 }

            } else {
              setTextErroClass("show");
              setTextErro("Necessário preencher todos os campos");
            }

        };//fim do primeiro If moveOpen
    };//fim da função submit
      
    //FUNÇÃO CANCELA E VOLTA NA LISTA ANTERIOR
    const handleCancel = (vehicle_id, vehicle_name) => { 
      navigate("/Portaria/controle-movimento-veiculos", {state: {vehicle_id, vehicle_name}}); 
    } 


    //FUNÇÃO QUE CONTROLA O NUMERO DE CARACTERES DA OBSERVAÇÃO DA SAÍDA
    const handleChangeDepObservation = (e) => {
      const newTexto = e.target.value;
  
      // Limita o texto em 150 caracteres
      if (newTexto.length <= MAX_CARACTERES) {
        setDepObservationMax(MAX_CARACTERES - newTexto.length);
        setDepObservation(newTexto);
      }
    };

    //FUNÇÃO QUE CONTROLA O NUMERO DE CARACTERES DA OBSERVAÇÃO DO RETORNO
    const handleChangeArrObservation = (e) => {
      const newTexto = e.target.value;
  
      // Limita o texto em 150 caracteres
      if (newTexto.length <= MAX_CARACTERES) {
        setArrObservationMax(MAX_CARACTERES - newTexto.length);
        setArrObservation(newTexto);
      }
    };

    //RENDERIZAÇÃO DA PÁGINA ****************************************************
    return (
    <section className="NovoMovimento">

    <div className="subTitulo">
      <h2>NOVO REGISTRO PARA O VEÍCULO <strong>{name}</strong>  {!moveOpen ? ' - SAÍDA' : ' - RETORNO'}  </h2>
    </div>

      {/* //INFORMAÇÕES DA SAÍDA DO VEICULO */}   
      <div className="content">
        <form className="form" onSubmit={handleSubmit}>

          <div className="saida">
            <h3>Informações da saída do veículo</h3>

            <div className="linha">
              <div className="destino">
                <label className="lbl-destino" htmlFor="destino">Destino:</label>
                <input id="destino" className={"" + inputDesabilitado}
                        type="text"
                        value={destiny}
                        disabled={moveOpen}
                        placeholder="Local - Cidade.     Ex: RIOCLÍNICA - RIO CLARO" 
                        onChange={(e) => {setDestiny(e.target.value)}} />
                </div> 
            </div>

            <div className="linha">
              <div className="motorista">
                <label className="lbl-motorista" htmlFor="motorista">Motorista:</label>
                <input id="motorista"
                        type="text"
                        value={depDriver}
                        disabled={moveOpen}
                        className={"" + inputDesabilitado}
                        placeholder="Motorista - Departamento" 
                        onChange={(e) => {setdDpDriver(e.target.value)}} />
              </div> 
              <div className="km">
                <label className="lbl-km" htmlFor="km">Km:</label>
                <input id="km"
                        type="text"
                        value={ formatarNumeroComPontos(depKm)}
                        disabled={moveOpen}
                        className={"" + inputDesabilitado}
                        onChange={(e) => {setDepKm(e.target.value)}} />
              </div> 
              <div className="data">
                <label className="lbl-data" htmlFor="data">Data:</label>
                <input id="data"
                        type="text"
                        value={converteData(depData)}
                        disabled
                        className={"input-leitura"}
                        onChange={(e) => {setDepData(e.target.value)}} />
              </div> 
              <div className="hora">
                <label className="lbl-hora" htmlFor="hora">Hora:</label>
                <input id="hora"
                        type="text"
                        value={depTime}
                        disabled={moveOpen}
                        className={"" + inputDesabilitado}
                        onChange={(e) => {setDepTime(e.target.value)}} />
              </div> 
              <div className="liberador">
                <label className="lbl-liberador" htmlFor="liberador">Liberador:</label>
                <input id="liberador"
                        type="text"
                        value={depLiberator}
                        disabled
                        className={"input-leitura"}
                        onChange={(e) => {setDepLiberator(e.target.value)}} />
              </div> 
            </div>

            <div className="linha">
              <div className="observacao">
                <label htmlFor="observcao">Observação:</label>
                <div style={{display: "flex", flexDirection: "column", textAlign: "left"}}>
                  <textarea id="area"
                              type="text"
                              value={depObservation}
                              className={"" + inputDesabilitado}
                              disabled={moveOpen}
                              placeholder="Observação com até 150 caracteres" 
                              onChange={handleChangeDepObservation}
                  />
                  <p style={{display: moveOpen ? 'none' : 'block'}}> <strong>Caracteres restantes: <span style={{color: "red"}}>{depObservationMax || 150} de {MAX_CARACTERES}</span></strong></p>
                </div>                  
              </div> 
            </div> 
          </div>
          
          {/* //INFORMAÇÕES DO RETORNO DO VEICULO */}
          <div className="retorno" style={{display: !moveOpen ? 'none' : 'flex'}}>
            <h3>Informações do retorno do veículo</h3>
           
            <div className="linha">
              <div className="motorista">
                <label className="lbl-motorista" htmlFor="motorista">Motorista:</label>
                <input id="motorista"
                        type="text"
                        value={arrDriver}
                        placeholder="Motorista - Departamento" 
                        onChange={(e) => {setArrDriver(e.target.value)}} />
              </div> 
              <div className="km">
                <label className="lbl-km" htmlFor="km">Km:</label>
                <input id="km"
                        type="text"
                        value={arrKm}
                        onChange={(e) => {setArrKm(e.target.value)}} />
              </div> 
              <div className="data">
                <label className="lbl-data" htmlFor="data">Data:</label>
                <input id="data"
                        type="text"
                        value={converteData(arrData)}
                        disabled
                        className={"input-leitura"}
                        onChange={(e) => {setArrData(e.target.value)}} />
              </div> 
              <div className="hora">
                <label className="lbl-hora" htmlFor="hora">Hora:</label>
                <input id="hora"
                        type="text"
                        value={arrTime}
                        onChange={(e) => {setArrTime(e.target.value)}} />
              </div> 
              <div className="liberador">
                <label className="lbl-liberador" htmlFor="liberador">Liberador:</label>
                <input id="liberador"
                        type="text"
                        value={arrLiberator}
                        disabled
                        className={"input-leitura"}
                        onChange={(e) => {setArrLiberator(e.target.value)}} />
              </div> 
            </div>

            <div className="linha">
              <div className="observacao">
                <label htmlFor="observcao">Observação:</label>
                <div style={{display: "flex", flexDirection: "column", textAlign: "left"}}>
                  <textarea id="area"
                              type="text"
                              value={arrObservation}
                              placeholder="Observação com até 150 caracteres" 
                              onChange={handleChangeArrObservation}
                  />
                  <p> <strong>Caracteres restantes: <span style={{color: "red"}}>{arrObservationMax || 150} de {MAX_CARACTERES}</span></strong></p>
                </div>                  
              </div> 
            </div> 
          </div>

          <div className="erro">
            <div className={"erros " + textErroClass}>{textErro}</div>
          </div>  

           <div className="botoes">
              <button className="defaultBtn escBtn" type="button" onClick={() => handleCancel(veiculoId, name)}>Cancelar</button>
              <button className="defaultBtn okBtn" type="submit" >Salvar</button>
            </div>
        </form>

          <div className="form-group">
            <div className={'msg ' + msgType}>{msg}</div>
          </div>
                      

      </div>
      
    </section> 
  )
};

export default NewMoviment;