import "./index.scss";
import React, { useState, useEffect, useRef  } from 'react';
import { useNavigate } from "react-router-dom";
import {createNews } from "../../../../services/apiNews"
import { upload } from "../../../../services/apiMASTER";

const NewsCreate = () => {
    
    const navigate = useNavigate();
    const MAX_CARACTERES = 750;    
    const MIN_CARACTERES = 160; 

    //USESTATES QUE RECEBEM OS DADOS DOS DADOS
    const [textTiulo, setTextTiulo] = useState("");
    const [data, setData] = useState("");
    const [textTexto, setTextTexto] = useState("");
    const [image, setImage] = useState(null);
    const [status, setStatus] = useState(1);
    const [dataInit, setDataInit] = useState("");
    const [dataEnd, setDataEnd] = useState("");
    const [link, setLink] = useState("");
    const [fileName, setFileName] = useState("");
    const [newFileName, setNewFileName] = useState("");
    
    //USESTATES DOS ERROS
    const [msg, setMsg] = useState("mensagem inicial"); //MENSAGEM DE RETORNO DA API DO BANCO RODAPÉ
    const [msgType, setMsgType] = useState("hidden"); //MENSAGEM DE RETORNO DA API DO BANCO RODAPÉ
    const [textErroClass, setTextErroClass] = useState("hidden");
    const [textErro, setTextErro] = useState("Necessário preencher todos os campos");
    const [mensTextMax, setMensTextMax]= useState("");  

    //verifica se todos os campos foram preenchidos e retira a mensagem de alerta de preenchimento
    useEffect(() => {
      if(textTiulo && data && textTexto && image && status && dataInit && dataEnd && link && fileName ){
        setFileName(image.name); 
      }
    },[textTiulo, data, textTexto, image, status, dataInit, dataEnd, link, fileName]);

    //VERIFICA SE O UPLOAD DEU CERTO E GEROU UM NOVO NOME DE ARQUIVO.
    //SE TUDO OK CHAMAD A FUNÇÃO QUE SALVA A NOTICIA NO BANCO
    useEffect(() => {
      if(newFileName) salvaNoticiaBanco();
    },[newFileName, fileName]);

    //FUNÇÃO QUE FAZ O UPLOAD DA IMAGEM NO SERVIDOR
    const uploadImagem = async (image) => {
      const formData = new FormData();
      formData.append('image', image);

      const headers = {
        'headers': {
          'Content-type': 'application/json'
        }
      }
      
      try {
        const response = await upload(formData, headers);
        setNewFileName(response.name);
        console.log(newFileName);
      } catch (error) {
        console.error('Não deu certo o upload:', error);
        // Aqui você pode lidar com o erro da maneira que preferir
      }
    }
 
    //FUNÇÃO DO BOTÃO DE SUBMIT DO FORMULÁRIO
    const handleSubmit =  async (e) => {

      e.preventDefault(); //PREVINE A AÇÃO DEFULT DO FORMULÁRIO

      //se nenhum campo foi preenchido coloca mensagem de erro na tela
      if(textTiulo === "" || data ==="" || textTexto === "" || image ==="" || dataInit === "" || dataEnd ==="" || link === "" || fileName ==="" )  {
        setTextErroClass("show");
        setTextErro("Necessário preencher todos os campos");
      //se todos os campos foram preenchidos verifica se o tamanho do texto está entre 160 e 750 caracteres
      } else if(textTexto.length < MIN_CARACTERES || textTexto.length > MAX_CARACTERES) {
        setTextErroClass("show");
        setTextErro("O texto da mensagem precisar tem entre 160 e 750 caracteres.")
      } else {
        setTextErroClass("hidden");

        //chama a função que faz o upload da imagem no servidor
        const response = uploadImagem(image);
        setNewFileName(response.name);
      }
    };
      
    //FUNÇÃO DO BOTÃO DE SUBMIT DO FORMULÁRIO
    const handleCancel =  async (e) => {
      navigate("/ADM-TI/cadastro-noticias"); 
    }

    //FUNÇÃO QUE SALVA A NOTICIA NO BANCO
    const salvaNoticiaBanco  = async () => {
      try {
        const response = await createNews(textTiulo, data, textTexto, fileName, newFileName, status, dataInit, dataEnd, link);
        console.log(response.msg);
        setMsg(response.msg)
                if(response.msg_type === "success") {
                  setMsgType("success")
                } else {
                  setMsgType("error")
                }

        //LIMPA O FORMULÁRIO
        setTextTiulo("");
        setData("");
        setTextTexto("");
        setImage(null);
        setStatus(1);
        setDataInit("");
        setDataEnd("");
        setLink("");
        setFileName("");
        setNewFileName("");

        // Define um atraso de 3 segundos (3000 milissegundos) para reverter para "hidden"  
        setTimeout(() => {
          setMsgType("hidden");
          navigate("/ADM-TI/cadastro-noticias/"); 
        }, 3000); 

      } catch (error) {
        console.log(error);
      };
    }

    //FUNÇÃO QUE CONTROLA O NUMERO DE CARACTERES DO TEXTO PRINCIPAL
    const handleChangeTexto = (e) => {
      const newTexto = e.target.value;
  
      // Limita o texto em 750 caracteres
      if (newTexto.length <= MAX_CARACTERES) {
        setMensTextMax(MAX_CARACTERES - newTexto.length);
        setTextTexto(newTexto);
/*         newTexto.length > 160 ? setTextErroClass("hidden") : setTextErroClass("show"); */
      }
    };

    
    //RENDERIZAÇÃO DA PÁGINA ****************************************************
    return (
    <section className="NoticiasCreate">

      <h2>Inserir nova notícia</h2>

      <div className="content">
      
        <form className="form" onSubmit={handleSubmit} encType="multipart/form-data">

          <div className="linha">
            <div className="titulo">
              <label className="lbl-titulo" htmlFor="titulo">Título: &emsp;</label>
              <input id="titulo"
                     type="text"
                     value={textTiulo}
                     placeholder="COLOQUE UM TÍTULO AQUI" 
                     onChange={(e) => {
                setTextTiulo(e.target.value); 
                }} />
            </div> 
          </div>

          <div className="linha">
            <div className="data">

              <label htmlFor="data">Data/Período: &emsp;</label>
              <input id="area"
                     type="text"
                     value={data}
                     placeholder="AQUI É UMA DATA GENÉRICA - EX. 15 DE AGOSTO ou 01 À 12 DE MARÇO ou MÊS DE SETEMBRO" 
                     onChange={(e) => {
                setData(e.target.value); 
                }} />
            </div>
          </div>

          <div className="linha">
              <div className="texto">
                <label htmlFor="texto">Texto: &emsp;</label>
                <div style={{display: "flex", flexDirection: "column", textAlign: "left"}}>
                  <textarea id="area"
                              type="text"
                              value={textTexto}
                              placeholder="Aqui vai um resuma do notícia com até 750 caracteres" 
                              onChange={handleChangeTexto}
                  />
                  <p> &emsp; <strong>Caracteres restantes: <span style={{color: "red"}}>{mensTextMax || 750} de {MAX_CARACTERES}</span></strong></p>
                </div>
                  
              </div> 
            </div> 

          <div className="linha"> 
            <div className="dataInicial">
              <label htmlFor="dataInicial">Data de início da exibição: &emsp;</label>
              <input id="dataInicial" type="date" value={dataInit} onChange={(e) => {
                setDataInit(e.target.value); 
                }} />
            </div> 
            <div className="dataFinal">
              <label htmlFor="dataFinal">Data final da exibição: &emsp;</label>
              <input id="dataFinal" type="date" value={dataEnd} onChange={(e) => {
                setDataEnd(e.target.value); 
                }} />
            </div> 
            <div className="status">
                <label id="status" htmlFor="status">Notícia inicia:</label>
                <select id="status" name="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="1">Ativa</option>
                  <option value="0">Inativa</option>
                </select>
            </div>
          </div>

          <div className="linha">
            <div className="arquivo">
             <label id="arquivoLabel" htmlFor="file">Escolher imagem JPG/PNG</label>
              <div className="upload">
                <p>{fileName || "Nenhum arquivo selecionado"}</p>
                <button className="uploadImage" onClick={() => document.getElementById('file').click()}>Adicionar</button>
              </div>
              <input 
                id="file"
                type="file"
                name="image"
                hidden
                accept="image/*"
                onChange={(e) => {
                  setImage(e.target.files[0]); 
                  setFileName(e.target.files[0].name);
                }} />
            </div>
            <div className="link">
              <label htmlFor="link">Hyperlink: &emsp;</label>
              <input id="link" type="text" value={link} onChange={(e) => {
                setLink(e.target.value); 
                }} />
            </div>
          </div>

          <div className="erro">
            <div className={"erros " + textErroClass}>{textErro}</div>
          </div>  

          <hr />

           <div className="botoes">
              <button className="defaultBtn escBtn" type="button" onClick ={handleCancel}>Cancelar</button>
              <button className="defaultBtn okBtn" type="submit" >Criar</button>
            </div>
                      
        </form>

      </div>

      <div className="form-group">
        <div className={'msg ' + msgType}>{msg}</div>
      </div>      
    </section> 
  )
};

export default NewsCreate;