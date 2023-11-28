import "./index.scss";
import React, { useState, useEffect  } from 'react';
import { useNavigate } from "react-router-dom";
import { editNews } from "../../../../services/apiNews"
import { upload } from "../../../../services/apiMASTER";
import isEqual from 'lodash/isEqual';

const NewsEdit  = ( props ) => {
    
    const navigate = useNavigate();
    const MAX_CARACTERES = 750;    
    const MIN_CARACTERES = 160; 

    const news = props.userData;

    //USESTATES QUE RECEBEM OS DADOS DOS DADOS
    const [data, setData] = useState([]);
    const [dataOld, setDataOld] = useState([]);
    const [image, setImage] = useState(null); //state que guarda a imagem carregada para salvar no banco
    const [imageLoaded, setImageLoaded] = useState(false);
    const [newFileName, setNewFileName] = useState('');
    
    //USESTATES DOS ERROS
    const [msg, setMsg] = useState("mensagem inicial"); //MENSAGEM DE RETORNO DA API DO BANCO RODAPÉ
    const [msgType, setMsgType] = useState("hidden"); //MENSAGEM DE RETORNO DA API DO BANCO RODAPÉ
    const [textErroClass, setTextErroClass] = useState("hidden");
    const [textErro, setTextErro] = useState("Necessário preencher todos os campos");
    const [mensTextMax, setMensTextMax]= useState(MAX_CARACTERES-news.text.length);  
    const [stateButton, setStateButon] = useState();

    useEffect(() => {
      setDataOld({
        ...data,
        idNews: news.idNews,
        textTiulo: news.title,
        data: news.date,
        textTexto: news.text,
        status: news.status,
        dataInit: news.dateInit,
        dataEnd: news.dateEnd,
        link: news.title,
        imageName: news.imageName,
      });
      setData({
        ...data,
        idNews: news.idNews,
        textTiulo: news.title,
        data: news.date,
        textTexto: news.text,
        status: news.status,
        dataInit: news.dateInit,
        dataEnd: news.dateEnd,
        link: news.title,
        imageName: news.imageName,
      });
      setStateButon(true);
    },[]);     

    useEffect(() => {
      //verifica se houve alguma alteração
      if (!isEqual(data, dataOld)) {
        //se houve alteração habilita o botão
        setStateButon(false);
      } else {
        //se não houve alteração mantem o botão desabilitado
        setStateButon(true);
      }
      setTextErroClass("hidden");
    },[data, dataOld]); 

    useEffect(() => {
    },[newFileName]); 

    const verificaPreenchido = () => {
      //testar se todos os campos estão preenchidos
      const isComplete = Object.values(data).every(Boolean);
      if(!isComplete) {
        setTextErroClass("show");
      } 
    }

    const salvaImagemBanco = async () => {
      let FileName = '';
    
      if (image != null) {  
        const formData = new FormData();
        formData.append('image', image);
    
        const headers = {
          'headers': {
            'Content-type': 'application/json'
          }
        }
    
        const response = await upload(formData, headers);
        FileName = response.name
        setImageLoaded(true); // Adiciona esta linha
      } else {
        FileName = 'naoTem';
        setImageLoaded(true); // Adiciona esta linha
      }
      setNewFileName(FileName);
    }
        
    //FUNÇÃO DO BOTÃO DE SUBMIT DO FORMULÁRIO
    const handleSubmit =  async (e) => {
      
      e.preventDefault(); //PREVINE A AÇÃO DEFULT DO FORMULÁRIO
      verificaPreenchido();
      salvaImagemBanco();   

      if (imageLoaded) {
        salvaNoticiaBanco();
      } else {
        console.log('A imagem ainda está sendo carregada...');
      }
    };
      
    //FUNÇÃO DO BOTÃO DE SUBMIT DO FORMULÁRIO
    const handleCancel =  async (e) => {
      navigate("/ADM-TI/cadastro-noticias"); 
    }

    const salvaNoticiaBanco  = async () => {
      try {
        const response = await editNews(data, newFileName);
        setMsg(response.msg)
                if(response.msg_type === "success") {
                  setMsgType("success")
                } else {
                  setMsgType("error")
                }

        //LIMPA O FORMULÁRIO

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
        setData({
          ...data,
          textTexto: newTexto
        });
      }
    };

    
    //RENDERIZAÇÃO DA PÁGINA ****************************************************
    return (
    <section className="NoticiasEditar">

      <h2>Alterar notícia</h2>

      <div className="content">
      <form className="form" 
              onSubmit={handleSubmit} 
              encType="multipart/form-data">

          <div className="linha">
            <div className="titulo">
              <label className="lbl-titulo" htmlFor="titulo">Título: &emsp;</label>
              <input id="titulo"
                     type="text"
                     value={data.textTiulo}
                     placeholder="COLOQUE UM TÍTULO AQUI" 
                     onChange={(e) => {
                      setData({
                        ...data,
                        textTiulo: e.target.value
                      });
                    }} />
            </div> 
          </div>

          <div className="linha">
            <div className="data">

              <label htmlFor="data">Data/Período: &emsp;</label>
              <input id="area"
                     type="text"
                     value={data.data}
                     placeholder="AQUI É UMA DATA GENÉRICA - EX. 15 DE AGOSTO ou 01 À 12 DE MARÇO ou MÊS DE SETEMBRO" 
                     onChange={(e) => {
                      setData({
                        ...data,
                        data: e.target.value
                      });
                }} />
            </div>
          </div>

          <div className="linha">
            <div className="texto">
              <label htmlFor="texto">Texto: &emsp;</label>
              <div style={{display: "flex", flexDirection: "column", textAlign: "left"}}>
                <textarea id="area"
                          type="text"
                          value={data.textTexto}
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
              <input id="dataInicial" type="date" value={data.dataInit}
                onChange={(e) => {
                  setData({
                    ...data,
                    dataInit: e.target.value
                  });
                }}
              />
            </div> 
            <div className="dataFinal">
              <label htmlFor="dataFinal">Data final da exibição: &emsp;</label>
              <input id="dataFinal" type="date" value={data.dataEnd} 
                onChange={(e) => {
                  setData({
                    ...data,
                    dataEnd: e.target.value
                  });
                }} />
            </div> 
            <div className="status">
                <label id="status" htmlFor="status">Notícia inicia:</label>
                <select id="status" name="status" 
                  onChange={(e) => {
                    setData({
                      ...data,
                      status: e.target.value
                    });
                  }}
                >
                  <option>{data.status === 1 ? "Ativa" : "Inativa" }</option>
                  <option value="1">Ativa</option>
                  <option value="0">Inativa</option>
                </select>
            </div>
          </div>

          <div className="linha">
            <div className="arquivo">
             <label id="arquivoLabel" htmlFor="file">Escolher imagem JPG/PNG</label>
              <div className="upload">
                <p>{data.imageName || "Nenhum arquivo selecionado"}</p>
                <button className="uploadImage" onClick={() => document.getElementById('file').click()}>Adicionar</button>
              </div>
              <input 
                id="file"
                type="file"
                name="image"
                hidden
                accept="image/*"
                onChange={(e) => {
                  setData({
                    ...data,
                    imageName: e.target.files[0].name, //aqui pega o NOME da imagem
                  });
                  setImage(e.target.files[0]); //aqui pega o objeto IMAGEM             
                  setImageLoaded(false); // aqui vai bloquear o evento do form até q tenha uma imagem carregada
                }} />
            </div>
            <div className="link">
              <label htmlFor="link">Hyperlink: &emsp;</label>
              <input id="link" type="text" value={data.link} onChange={(e) => {
                setData({
                  ...data,
                  link: e.target.value
                });
                }} />
            </div>
          </div>

          <div className="erro">
            <div className={"erros " + textErroClass}>{textErro}</div>
          </div>  

          <hr />

          <div className="botoes">
            <button className="escBtn defaultBtn" type="button" onClick ={handleCancel}>Cancelar</button>
            <button disabled={stateButton}  className="okBtn defaultBtn" type="submit">Alterar</button>
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