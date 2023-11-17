import "./index.scss";
import React, { useState, useEffect  } from 'react';
import { useNavigate } from "react-router-dom";
import { editNews } from "../../../../services/apiNews"
import { upload } from "../../../../services/apiMASTER";

const NewsEdit  = ( props ) => {
    
    const navigate = useNavigate();
    const MAX_CARACTERES = 750;    
    const MIN_CARACTERES = 160; 

    const news = props.userData;

    //USESTATES QUE RECEBEM OS DADOS DOS DADOS
    const [idNews] = useState(news.idNews);
    const [textTiulo, setTextTiulo] = useState(news.title);
    const [data, setData] = useState(news.date);
    const [textTexto, setTextTexto] = useState(news.text);
    const [image, setImage] = useState(null);
    const [status, setStatus] = useState(news.status);
    const [dataInit, setDataInit] = useState(news.dateInit);
    const [dataEnd, setDataEnd] = useState(news.dateEnd);
    const [link, setLink] = useState(news.link);
    const [fileName, setFileName] = useState(news.imageName);
    const [newFileName, setNewFileName] = useState("");
    
    //USESTATES DOS ERROS
    const [msg, setMsg] = useState("mensagem inicial"); //MENSAGEM DE RETORNO DA API DO BANCO RODAPÉ
    const [msgType, setMsgType] = useState("hidden"); //MENSAGEM DE RETORNO DA API DO BANCO RODAPÉ
    const [textErroClass, setTextErroClass] = useState("hidden");
    const [textErro, setTextErro] = useState("");
    const [mensTextMax, setMensTextMax]= useState(MAX_CARACTERES-news.text.length);  
    const [control, setControl] = useState(false);

    //verifica se todos os campos foram preenchidos e retira a mensagem de alerta de preenchimento
    useEffect(() => {
      if(textTiulo && data && textTexto && image && status && dataInit && dataEnd && link && fileName){
        setTextErro("");
        setTextErroClass("hidden");   
        setFileName(image.name); 
      }
      console.log(textTexto.length);
      console.log("image", image);
    },[textTiulo, data, textTexto, image, status, dataInit, dataEnd, link, fileName, control]);

    useEffect(() => {
        if(newFileName) salvaNoticiaBanco();
    },[newFileName, fileName]);
 
    //FUNÇÃO DO BOTÃO DE SUBMIT DO FORMULÁRIO
    const handleSubmit =  async (e) => {
      
      e.preventDefault(); //PREVINE A AÇÃO DEFULT DO FORMULÁRIO

      if(textTexto.length < MIN_CARACTERES || textTexto.length > MAX_CARACTERES){
        setControl(true);
        setMsgType("show");
        setTextErro("O texto da mensagem precisar tem entre 160 e 750 caracteres.")
      } else {
        setMsgType("hidden");
        setTextErro("Necessário preencher todos os campos");
        setControl(false);
      }; 

      const formData = new FormData();
      formData.append('image', image);

      const headers = {
        'headers': {
          'Content-type': 'application/json'
        }
      }
      
      if(textTiulo && data && textTexto && image && status && dataInit && dataEnd && link  && !control) {
        const response = await upload(formData, headers);
        setNewFileName(response.name);

      } else {
        setTextErroClass("show");
        if(image === null ||  image ===""){
          setTextErro("Necessário anexar a imagem novamente.");
        } else if(control){
          setTextErro("O texto da mensagem precisar tem entre 160 e 750 caracteres.")
        } else {
          setTextErro("Necessário preencher todos os campos");
        }
      }
    };
      
    //FUNÇÃO DO BOTÃO DE SUBMIT DO FORMULÁRIO
    const handleCancel =  async (e) => {
      navigate("/ADM-TI/cadastro-noticias"); 
    }

    const salvaNoticiaBanco  = async () => {

      try {
        const response = await editNews(idNews, textTiulo, data, textTexto, fileName, newFileName, status, dataInit, dataEnd, link);
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
        setTextErroClass("hidden")

        // Define um atraso de 3 segundos (3000 milissegundos) para reverter para "hidden"  
        setTimeout(() => {
          setMsgType("hidden");
          navigate("/ADM-TI/cadastro-noticias"); 
        }, 3000); 

      } catch (error) {
        console.log(error);
      };
    }

    const handleChangeTexto = (e) => {
      const newTexto = e.target.value;
  
      // Limita o texto em 750 caracteres
      if (newTexto.length <= MAX_CARACTERES) {
        setMensTextMax(MAX_CARACTERES -newTexto.length);
        setTextTexto(newTexto);
      }
    };

    
    //RENDERIZAÇÃO DA PÁGINA ****************************************************
    return (
    <section className="Noticias">

      <h2>Alterar Noticia</h2>
      <hr />

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
                          placeholder="Aqui vai um resuma do notícia com até 1.000 caracteres" 
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
                <select id="status" name="status" onChange={(e) => setStatus(e.target.value)}>
                  <option>{status === 1 ? "Ativa" : "Inativa" }</option>
                  <option value="1">Ativa</option>
                  <option value="0">Inativa</option>
                </select>
            </div>
          </div>

          <div className="linha">
            <div className="arquivo">
                <label id="arquivoLabel" htmlFor="file">Escolher imagem JPG/PNG</label>
                <input 
                  id="file"
                  type="file"
                  name="image"
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

          <br />

          <div className="erro">
            <div className={"erros " + textErroClass}>{textErro}</div>
          </div>  

          <div className="botoes">
            <button style={{height: "33px"}} className="escBtn Btn" type="button" onClick ={handleCancel}>Cancelar</button>
            <button className="okBtn Btn" type="submit">Alterar</button>
          </div>

          <div className="form-group">
            <div className={'msg ' + msgType}>{msg}</div>
          </div>
                      
        </form>

      </div>
      
    </section> 
  )
};

export default NewsEdit;