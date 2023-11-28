import "./index.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { findNews, findBirthdayPeople } from '../../services/apiNews';
import { converteDataMySQL, obterPrimeiroUltimoDiaSemana } from "../../functions/manipuladorDataHora";

function Noticias() {

  const dataAtual = converteDataMySQL(new Date());

  //USESTATES QUE RECEBEM OS DADOS DOS DADOS
  const [data, setData] = useState(dataAtual);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [birthdayPeople, setBirthdayPeople] = useState([]);
  const [primeiroDia, setPrimeiroDia] = useState('');
  const [ultimoDia, setUltimoDia] = useState('');
  const [hoje, setHoje] = useState('');

  //VARIAVEIS AUXILIARES
  const [control, setControl] = useState(false) //variavel para controle de recarregar a página qdo excluido o usuário

  //BUSCA NO SERVIDOR A LISTA DE NOTICIAS
  useEffect(() => {
    const { primeiroDia, ultimoDia, primeiroDiaFormatado,  ultimoDiaFormatado, dataAtualFormatada } = obterPrimeiroUltimoDiaSemana();
    setPrimeiroDia(primeiroDiaFormatado); // Data do primeiro dia da semana
    setUltimoDia(ultimoDiaFormatado);   // Data do último dia da semana
    setHoje(dataAtualFormatada);

    const fetchData = async () => {
      try {
        const response = await findNews(data);
        const newsData = response;
        setNews(newsData.news);  
        setLoading(false);
        setControl(false)
      } catch (err) {
        console.error('Ocorreu um erro durante a consulta:', err);
        setLoading(false);
      }

      try {
        const response = await findBirthdayPeople(primeiroDia, ultimoDia);
        setBirthdayPeople(response.aniversarios)
      } catch (err) {
        console.error('Ocorreu um erro durante a consulta:', err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (

    <section className="Noticias">
      <h1>NOTÍCIAS</h1>

      <Carousel className="carousel" interval={8000}>

        {/* ITEM PARA MOSTRAR OS ANIVERSARIANTES DA SEMANA */}
        {birthdayPeople && birthdayPeople.length > 0 && ( //se não existir não mostra esse item
          <Carousel.Item> 
            <div className="inner">
              <div>
              <img src="../../images/bolo.png" alt="bolo" />
              </div>

              <div className="card">
                <h3>ANIVERSARIANTES DA SEMANA</h3>
                <h5>SEMANA DE  {primeiroDia} A {ultimoDia}</h5>
                <table style={{maxWidth: "100%"}}>
                    <tbody>
                        {birthdayPeople.map((aniversarios) => (
                          <tr key={aniversarios.idUser}>
                            <td style={{padding: "0 1rem", textAlign: "right", fontWeight: aniversarios.birthdate === hoje ? "bold" : "normal" }} >{aniversarios.nameComplete}</td>
                            <td style={{padding: "0 1rem", fontWeight: aniversarios.birthdate === hoje ? "bold" : "normal" }}>{aniversarios.birthdate}</td>
                            <td style={{padding: "0 1rem", textAlign: "left", fontWeight: aniversarios.birthdate === hoje ? "bold" : "normal" }}>{aniversarios.Department.department}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>                
              </div>
            </div>
          </Carousel.Item>
        )}

        {news.map((newsItem) => (
          <Carousel.Item key={newsItem.id}> 
            <div className="inner">
              <div>
              <img src={`http://192.168.0.236:3000/images-news/${newsItem.image}`} alt={newsItem.title} />
              </div>

              <div className="card">
                <h3>{newsItem.title}</h3>
                <h5>{newsItem.date}</h5>
                <p>{newsItem.text}</p>
                <a href={newsItem.link} target="_blank" rel="noreferrer noopener">Saiba mais</a>
              </div>
            </div>
          </Carousel.Item>
        ))}
    </Carousel> 

    </section>
  )
}

export default Noticias