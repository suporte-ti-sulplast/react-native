import "./index.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useContext, useState, useEffect, useRef } from 'react';
import { converteData } from "../../../functions/manipuladorDataHora";
import { AuthContext } from '../../../contexts/auth';
import { useNavigate } from "react-router-dom";
import { labelPrintQualidade } from "../../../services/apiLabels"
import { printerSearch } from "../../../services/apiPrinter";

const EtiQualidade  = () => {

    const navigate = useNavigate();
    const etiquetaRef = useRef();
    const data = converteData(new Date());
    const { userLogged } = useContext(AuthContext);

    const [qtade, setQtade] = useState('1');
    const [printers, setPrinters] = useState([]);
    const [selectedPrinter, setSelectedPrinter] = useState([]);
    const [printNetField, setPintNetField] = useState("hidden");
    const [printUsbField, setPintUsbField] = useState("hidden");
    const [netUsbValue, setNetUsbValue] = useState();
    const [ipValue, setIpValue] = useState();

    //USESTATES DOS ERROS
    const [msg, setMsg] = useState("mensagem inicial"); //MENSAGEM DE RETORNO DA API DO BANCO RODAPÉ
    const [msgType, setMsgType] = useState("hidden"); //MENSAGEM DE RETORNO DA API DO BANCO RODAPÉ

    /* CARREGA A LISTA DE DEPARTAMENTOS E STATES AO CARREGAR A PÁGINA */
    useEffect(() => {
      const buscaImpressoras  = async (departamento) => { 
        try {
          const resposta = await printerSearch(departamento);
          setPrinters(resposta);
        } catch (error) {
          console.log(error);
        }
      }
      buscaImpressoras(userLogged.logged.Department.idDept);
    },[])

    //FUNÇÃO PARA RETORNAR O PADRÃO DA IMPRESSORA SELECIONADA 
    const findNetUsbValue = (printerName) => {
      if (printers) {
        const selectedPrinter = printers.find((pt) => pt.Printer.printerName === printerName);
        setNetUsbValue(selectedPrinter ? selectedPrinter.Printer.netUsb : null);
      }
      return null;
    };

    //FUNÇÃO PARA RETORNAR O IP DA IMPRESSORA SELECIONADA 
    const findIpValue = (printerName) => {
      if (printers) {
        const selectedPrinter = printers.find((pt) => pt.Printer.printerName === printerName);
        setIpValue(selectedPrinter ? selectedPrinter.Printer.ip : null);
      }
      return null;
    };

    useEffect(() => {
      if (selectedPrinter) {
        const usbValue = findNetUsbValue(selectedPrinter);
        const ipValue = findIpValue(selectedPrinter);
        if(usbValue === 0)  {
          setPintUsbField("show");
          setPintNetField("hidden");
        }
        if(usbValue === 1)  {
          setPintNetField("show");
          setPintUsbField("hidden");
        }
        if(usbValue == null)  {
          setPintNetField("hidden");
          setPintUsbField("hidden");
        }
      }
    }, [selectedPrinter]);
    
    
    //FUNÇÃO DO BOTÃO PARA IMPRIMIR AS ETIQUETAS VIA REDE
    const handleImprimirRede =  async (e) => {
      
      try {
        const response = await labelPrintQualidade(userLogged.logged.codCQ, data, qtade, ipValue);
        setMsg(response.msg);

        if(response.msg_type === "success") {
          setMsgType("success");
        } else {
          setMsgType("error");
        };

        //reseta os valores default
        setQtade(1);

        // Define um atraso de 3 segundos (3000 milissegundos) para reverter para "hidden"  
        setTimeout(() => {
          setMsgType("hidden");
        }, 3000);
        
      } catch (error) {
        console.log(error);
      }
    }


     // FUNÇÃO PARA IMPRIMIR A ETIQUETA
     const imprimirEtiquetaUsb = () => {
      const conteudo = etiquetaRef.current.innerHTML;
      //estilo dedicado para impressão via windows
      const estilo = `
        <style>
          * {
              font-family: Arial;
          }
          body{
            text-align: center;
            display: flex;
            gap: 32px;
            margin-top: 17px;
            margin-left: 17px;
          }
          h4{
            margin-top: 0px;
            font-size: 32px;
          }
          p{
            margin-top: -40px;
            font-size: 12px;
          }
        </style>
      `;

      const janelaImpressao = window.open('', '_blank','width: 700px','heigth: 200px');
      janelaImpressao.document.write('<html><head><title>Etiqueta</title>');
      janelaImpressao.document.write(estilo);
      janelaImpressao.document.write('</head><body>');
      janelaImpressao.document.write(conteudo);
      janelaImpressao.document.write('</body></html>');
      janelaImpressao.document.close();
      janelaImpressao.print();
    };

    const handleImprimirUsb = () => {
      try {
        imprimirEtiquetaUsb();
      } catch (error) {
        console.log(error);
      }
    };
    
    //FUNÇÃO DO BOTÃO DE SUBMIT DO FORMULÁRIO
    const handleCancel =  async (e) => {
      navigate("/Etiquetas"); 
    }

    return (
    <section className="etiQualidade">

      <div className="titulo"></div>
      <h2>Etiquetas - Controle de qualidade</h2>
      <br />

      <div className="body">
        <h2>Operador CQ:&nbsp; <span>{userLogged.logged.login}</span></h2>
        <h2>Código CQ: &nbsp;<span>{userLogged.logged.codCQ}</span></h2>
        <h2>Data: &nbsp;<span>{data}</span></h2>

        <br />

        <div id="etiqueta" className="etiqueta etiqueta_para imprimir"
            ref={etiquetaRef}>
          <div className="item">
            <h4>{userLogged.logged.codCQ}</h4>
            <p>{data}</p>
          </div>
          <div className="item">
            <h4>{userLogged.logged.codCQ}</h4>
            <p>{data}</p>
          </div>
          <div className="item">
            <h4>{userLogged.logged.codCQ}</h4>
            <p>{data}</p>
          </div>
          <div className="item">
            <h4>{userLogged.logged.codCQ}</h4>
            <p>{data}</p>
          </div>
        </div>
      </div>

      <br /><br />

      {/* Grupo Impressoras */}
      <div>
          {printers.length > 0 ? (
            <select
              className="select"
              id="impressoras"
              name="impressoras"
              value={selectedPrinter}
              onChange={(e) => setSelectedPrinter(e.target.value)}
            >
              <option>
                Selecione uma impressora
              </option>
              {printers.map((pt, idPrinter) => (
                <option key={idPrinter} value={pt.Printer.printerName}>
                  {pt.Printer.printerName}
                </option>
              ))}
            </select>
          ) : (
            <div>
              <p style={{color: "red"}}><strong>Não existem impressoras cadastradas para esse departamento.</strong></p>
            </div>
          )}
        </div>

        <br /><br />

      {
        netUsbValue !== null && (
          <>
            {netUsbValue === 0 ? (
              <div style={{display:"flex"}}>
                <button style={{ height: "33px" }} className="escBtn Btn" type="button" onClick={handleCancel}>
                  Cancelar
                </button>
                <button
                  id="imprimirUsb"
                  className={"okBtn Btn"}
                  type="button"
                  onClick={handleImprimirUsb}
                >
                  Imprimir
                </button>
              </div>
            ) : (
              <>
                <div className={"qtdade"}>
                  <div className="conta">
                    <p>Quantidade de etiquetas: &nbsp;</p>
                    <input
                      type="number"
                      name="qtade"
                      id="qtade"
                      value={qtade}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        setQtade(isNaN(value) ? 0 : value);
                      }}
                    />
                  </div>
                  <div className={"conta"}>
                    <p>{qtade}&nbsp;etiquetas serão impressas: </p>
                  </div>
                </div>
                <div style={{display:"flex"}}>
                <button style={{ height: "33px" }} className="escBtn Btn" type="button" onClick={handleCancel}>
                  Cancelar
                </button>
                <button
                  id="imprimirRede"
                  className={"okBtn Btn"}
                  type="button"
                  onClick={handleImprimirRede}
                >
                  Imprimir
                </button>
                </div>
              </>
            )}
          </>
        )
      }

    < div className={'msg ' + msgType}>{msg}</div>

    </section>
  )
};

export default EtiQualidade ;