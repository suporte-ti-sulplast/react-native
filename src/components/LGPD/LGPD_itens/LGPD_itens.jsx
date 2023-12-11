import "./index.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useContext, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../../contexts/auth';
import { fetchPdfBlob } from '../../../services/apiMASTER';

const LgdpItens = () => {
  const navigate = useNavigate();
  const { userLogged } = useContext(AuthContext);
  var foo

  const [msg, setMsg] = useState("mensagem inicial");
  const [msgType, setMsgType] = useState("hidden");


  const files = [
    { nome: 'PRIVACIDADE DADOS WEB SITE - Rev0', id: 1 },
    { nome: 'PRIVACIDADE INTERNA E DIREITO DOS TITULARES  - REV 0', id: 2 },
    { nome: 'SEGURANÇA DA INFORMAÇÃO - Rev0', id: 3 },
  ];

  

  const handleOpenPDF = async (file) => {
     const fileName = `POLITICA DE ${file}`;
    try {
      const blob = await fetchPdfBlob(fileName);

      var binaryData = [];
      binaryData.push(blob); //My blob
      foo = URL.createObjectURL(new Blob(binaryData, {type: "application/pdf"}));
      console.log(foo); //gives me the correct object

    } catch (error) {
      console.error(error);
    }
  };


  return (
    <section className="lgdpItens">
      <div className="corpo">
        <div className="lado_esq">
          <h2>POLÍTICA DE</h2>
          <nav className="nav">
            <ul className="menu">
              {files.map((file) => (
                <li key={file.id} onClick={() => handleOpenPDF(file.nome)}>
                  {file.nome}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="lado_dir">
          CORPO

          <iframe
          title="Link Viewer"
          src="http://localhost:5173/3707105b-c734-4136-9841-b28542fd0dd8"
          width="100%"
          height="600"
          style={{ border: "none" }}
        />


          
        </div>

      </div>

      <div className={'msg ' + msgType}>{msg}</div>
    </section>
  );
};

export default LgdpItens;
