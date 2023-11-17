import "./index.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../../contexts/auth';
import { labelPrintRoto, labelPrintRotoSearch } from "../../../services/apiLabels"
import { printerSearch } from "../../../services/apiPrinter";

const EtitRoto = () => {

    const navigate = useNavigate();
    const { userLogged } = useContext(AuthContext);
    const etiquetaRef = useRef();

    const [qtade, setQtade] = useState('1');
    const [texto, setTexto] = useState('');
    const [codigo, setCodigo] = useState('');
    const [material, setMaterial] = useState('');
    const [printers, setPrinters] = useState([]);
    const [selectedPrinter, setSelectedPrinter] = useState([]);
    const [printNetField, setPintNetField] = useState("hidden");
    const [printUsbField, setPintUsbField] = useState("hidden");
    const [netUsbValue, setNetUsbValue] = useState();
    const [ipValue, setIpValue] = useState();

    //USESTATES DOS ERROS
    const [msg, setMsg] = useState("mensagem inicial"); //MENSAGEM DE RETORNO DA API DO BANCO RODAPÉ
    const [msgType, setMsgType] = useState("hidden"); //MENSAGEM DE RETORNO DA API DO BANCO RODAPÉ

    //FUNÇÃO DO BOTÃO PARA IMPRIMIR AS ETIQUETAS
    const handleBuscar =  async (e) => {
      
      try {
        const response = await labelPrintRotoSearch(texto);
        setCodigo(response.codigo)
        setMaterial(`> ${response.material} <`);

      } catch (error) {
        console.log(error);
      }
    }

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
          setPintNetField("hidden")
        }
        if(usbValue === 1)  {
          setPintNetField("show");
          setPintUsbField("hidden")
        }
        if(usbValue == null)  {
          setPintNetField("hidden");
          setPintUsbField("hidden")
        }
      }
    }, [selectedPrinter]);

    //FUNÇÃO DO BOTÃO PARA IMPRIMIR AS ETIQUETAS
    const handleImprimirRede =  async (e) => {
  
      try {
        const response = await labelPrintRoto(qtade, codigo, material, ipValue);
        setMsg(response.msg)

        if(response.msg_type === "success") {
          setMsgType("success")
        } else {
          setMsgType("error")
        }

        //reseta os valores default
        setCodigo('')
        setMaterial('');
        setQtade(1);
        setTexto('');

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
            width: 330px;
            margin-left: 15px;
            text-align: center;
          }
          h4{
            font-size: 35px;
            margin-top: -10px;
          }

          h5{
            font-size: 35px;
            margin-top: -50px;
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
    
  const isBotaoDesabilitado = texto === ''; // Verifica se o texto está vazio

    return (
    <section className="etiRoto">
      <div className="titulo"></div>
      <h2>Etiquetas - Rotomoldagem</h2>
      <br /><br />

      <div className="body">


        <h2>Código produto acabado: &nbsp;</h2>
        <input className="inputTexto"
            type="text"
            name="texto"
            id="texto"
            value={texto}
            onChange={(e) => {
              const value = e.target.value;
              setTexto(value);
            }}
          />

        <div className="botoes">
          <button
            className={`okBtn Btn ${isBotaoDesabilitado ? 'desability' : ''}`}
            type="submit"
            onClick={handleBuscar}
            disabled={isBotaoDesabilitado} // Desabilita o botão se isBotaoDesabilitado for true
          >
            Buscar
          </button>
        </div>

        <br />

        <div className="etiqueta etiqueta_para imprimir"
            ref={etiquetaRef}>
          <div className="item">
            <h4>{codigo}</h4>
            <h5>{material}</h5>
          </div>

        </div>

        <br />

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

      </div>
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

export default EtitRoto ;