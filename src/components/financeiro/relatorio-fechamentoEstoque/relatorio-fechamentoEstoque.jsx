import { consulta } from "../../../services/apiDELSOFT";
import "./index.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../../../contexts/auth';
import grupos from './grupos'; 
import { retornaMes, getLastDayOfMonth } from "../../../functions/manipuladorDataHora";

const FechamentoEstoque = () => {

  const { userLogged } = useContext(AuthContext);
  const anoAtual = new Date().getFullYear();

  const usuarioLogado = userLogged.logged.login; // Substitua pelo nome do usuário logado
  const dataHora = new Date().toLocaleString(); // Obtém a data/hora atual

  const [dados, setDados] = useState([]);
  const [data, setData] = useState('');
  const [mes, setMes] = useState('');
  const [ano, setAno] = useState(anoAtual);
  const [textErroClass, setTextErroClass] = useState("hidden");
  const reportComprasRef = useRef();
  const reportProducaoRef = useRef();
  const [anos, setAnos] = useState([]);

  //PEGA O ANO E O MÊS ESCOLHIDO E BUSCA O ULTIMO DIA DA REFERENTE DATA
  useEffect(() => {
    if (ano && mes) {
      setData(getLastDayOfMonth(ano, mes));
    }
  }, [ano, mes, data]); 

  //PEGA O ANO ATUAL E MAIS OS 3 ANTERIORES PARA COLOCAR DENTRO DA SELECT DE ANO
  useEffect(() => {
    const anosAnteriores = [anoAtual, anoAtual - 1, anoAtual - 2, anoAtual - 3];
    setAnos(anosAnteriores);
  }, []);

  // FUNÇÃO TESTE PARA CONSULTA DO FINANCEIRO
  const handleConsulta = async (e) => {
    // Inicialize a soma do grupo antes do loop
    let somaGrupo = 0;

    try {
      const resposta = await consulta(data);
      setDados(resposta.data.resultadoConsulta);
      setTextErroClass("show");
    } catch (error) {
      console.error("Ocorreu um erro ao obter os dados do usuário:", error);
    }
  }

  // Agrupa os dados pelo campo ProGrupoB e ProSubgrupoB
  const dadosAgrupados = dados.reduce((agrupados, dado) => {
    const grupo = dado.ProGrupoB;
    const subgrupo = dado.ProSubgrupoB;

    if (!agrupados[grupo]) {
      agrupados[grupo] = {};
    }

    if (!agrupados[grupo][subgrupo]) {
      agrupados[grupo][subgrupo] = [];
    }

    agrupados[grupo][subgrupo].push(dado);
    return agrupados;
  }, {});

  // Calcula as somas para cada grupo e subgrupo
  const somas = {};
  for (const grupo in dadosAgrupados) {
    somas[grupo] = {};
    for (const subgrupo in dadosAgrupados[grupo]) {
      somas[grupo][subgrupo] = dadosAgrupados[grupo][subgrupo].reduce(
        (total, dado) => {
          total.valorentrada += dado.valorentrada;
          total.valorestoque += dado.valorestoque;
          total.valorsaida += dado.valorsaida;
          return total;
        },
        { valorentrada: 0, valorestoque: 0, valorsaida: 0 }
      );
    }
  }

  // Calcula as somas para cada grupo
  const somaTotalGrupo = {};
  for (const grupoId in somas) {
    somaTotalGrupo[grupoId] = Object.values(somas[grupoId]).reduce((total, subgrupo) => {
      total += subgrupo.valorestoque;
      return total;
    }, 0);
  }

  // FUNÇÃO PARA IMPRIMIR A ETIQUETA
    const imprimirRelatorio = () => {
      const conteudo1 = reportComprasRef.current.innerHTML;
      const conteudo2 = reportProducaoRef.current.innerHTML;
      //estilo dedicado para impressão via windows
      const estilo = `
        <style>
          * {
              font-family: Arial;
          }
          body{
            width: 750px;
            margin-left: 10px;
          }
          hr{
            margin: 1px;
          }
          h1{
            font-size: 25px;
          }
          h2{
            font-size: 14px;
            margin-bottom: -2px;
            margin-top: -1px;
          }
          p{
            text-align: left;
            margin-left: 15px;
            font-size: 10px;
          }
          #somatorio{
            border: 1px solid black;
          }
          h3{
            font-size: 15px;
            padding: 5px;
          }
        </style>
      `;

        // Adiciona informações no final do relatório
        const rodape = `
        <div style="text-align: right; margin-top: 1rem;">
          <p>Gerado por: ${usuarioLogado} &nbsp;&nbsp;--&nbsp;&nbsp;
          Data/Hora: ${dataHora}</p>
        </div>
      `;

      const janelaImpressao = window.open('', '_blank','width: 1000px','heigth: 800px');
      janelaImpressao.document.write('<html><head><title>Etiqueta</title>');
      janelaImpressao.document.write(estilo);
      janelaImpressao.document.write('</head><body>');
      janelaImpressao.document.write('<div><h1>Sulplast</h1></div>');
      janelaImpressao.document.write(rodape);
      janelaImpressao.document.write(conteudo1);
      // Adiciona uma quebra de página após o conteudo1
      janelaImpressao.document.write('<div style="page-break-after: always;"></div>');
      janelaImpressao.document.write(conteudo2);
      janelaImpressao.document.write('</body></html>');
      janelaImpressao.document.close();
      janelaImpressao.print();
    };

  const handleImprimir = () => {
    try {
      imprimirRelatorio();
    } catch (error) {
      console.log(error);
    }
  };

    return (
    <section className="fechamentoEstoque">

      <div className="titulo"></div>
      <h1>Fechamento Estoque</h1>

      <div className="topo">
        
        <select id="seletorMes" value={mes} onChange={(e) => setMes(e.target.value)}>
          <option value="">Selecione...</option>
          <option value="01">Janeiro</option>
          <option value="02">Fevereiro</option>
          <option value="03">Março</option>
          <option value="04">Abril</option>
          <option value="05">Maio</option>
          <option value="06">Junho</option>
          <option value="07">Julho</option>
          <option value="08">Agosto</option>
          <option value="09">Setembro</option>
          <option value="10">Outubro</option>
          <option value="11">Novembro</option>
          <option value="12">Dezembro</option>
        </select>

        <select id="seletorAno" value={ano} onChange={(e) => setAno(e.target.value)}>
      {anos.map((ano) => (
        <option key={ano} value={ano}>
          {ano}
        </option>
      ))}
    </select>

        <button className="okBtn Btn" disabled={mes === "" || ano === ""} onClick={handleConsulta}>
          Consultar
        </button>
        
        <button
          id="imprimirRede"
          className={"okBtn Btn"}
          type="button"
          disabled={dados.length === 0}
          onClick={handleImprimir}         
        >
          Gerar relatório
        </button>

      </div>

      {dados.length > 0 ?
      (
        <div className="relatorio">
          <br />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap:'1rem', margin: '0 1rem'}}>
            <div ref={reportComprasRef} className="tabela">
            <h1>Fechamento estoque - <strong>Compras</strong> - {retornaMes(mes)} de {ano}</h1>
              <table>
                {/* Renderiza uma tabela para cada grupo e subgrupo */}
                {Object.entries(somas).map(([grupoId, subgrupos]) => {
                  const grupo = grupos[grupoId];
                  // Verifica se a categoria é 'compras' antes de renderizar
                  if (grupo && grupo.categoria === 'compras') {
                    return (
                      <div key={grupoId}>
                        <h2>{grupo.nome}</h2>
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <th style={{ width: '30rem' }}><p>Sub-grupo</p></th>
                              <th style={{ width: '15rem' }}><p>Valor estoque</p></th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(subgrupos).map(([subgrupoId, soma]) => (
                              <tr key={subgrupoId}>
                                {/* Busca o nome do subgrupo no array de subgrupos do grupo */}
                                <td><p>{grupo.subgrupos.find(sg => sg.id === parseInt(subgrupoId, 10)).nome}</p></td>
                                <td><p>{soma.valorestoque.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p></td>
                              </tr>
                            ))}
                            {/* Inclua uma linha para mostrar a soma total do grupo */}
                            <tr>
                              <td><p><strong>Total do grupo</strong></p></td>
                              <td><p><strong>{somaTotalGrupo[grupoId].toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></p></td>
                            </tr>
                          </tbody>
                        </table>
                        <hr />
                      </div>
                    );
                  }
                  return null; // Retorna null para grupos que não atendem ao critério
                })}         
              </table>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th style={{ width: '30rem' }}></th>
                    <th style={{ width: '15rem' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {/* Inclua uma última linha para mostrar o total geral dos subgrupos de 'compras' */}
                  <tr id="somatorio">
                    <td>
                      <h3>Total geral (Compras)</h3>
                    </td>
                    <td>
                      <h3>
                        <strong>{Object.entries(somas).reduce((total, [grupoId, subgrupos]) => {
                                    const grupo = grupos[grupoId];
                                    return grupo && grupo.categoria === 'compras' ? total + somaTotalGrupo[grupoId] : total;
                                  }, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </strong>
                      </h3>
                    </td>
                  </tr>
                </tbody>
              </table>
              <br />
            </div>
            <div ref={reportProducaoRef} className="tabela">
            <h1>Fechamento estoque - <strong>Produção</strong> - {retornaMes(mes)} de {ano}</h1>
              <table>
                {/* Renderiza uma tabela para cada grupo e subgrupo */}
                {Object.entries(somas).map(([grupoId, subgrupos]) => {
                  const grupo = grupos[grupoId];
                  // Verifica se a categoria é 'compras' antes de renderizar
                  if (grupo && grupo.categoria === 'produção') {
                    return (
                      <div key={grupoId}>
                        <h2>{grupo.nome}</h2>
                        <table id="tabela"  className="table table-striped">
                          <thead>
                            <tr>
                              <th style={{ width: '30rem' }}><p>Sub-grupo</p></th>
                              <th style={{ width: '15rem' }}><p>Valor estoque</p></th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(subgrupos).map(([subgrupoId, soma]) => (
                              <tr key={subgrupoId}>
                                {/* Busca o nome do subgrupo no array de subgrupos do grupo */}
                                <td><p>{grupo.subgrupos.find(sg => sg.id === parseInt(subgrupoId, 10)).nome}</p></td>
                                <td><p>{soma.valorestoque.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p></td>
                              </tr>
                            ))}
                            {/* Inclua uma linha para mostrar a soma total do grupo */}
                            <tr>
                              <td><p><strong>Total do grupo</strong></p></td>
                              <td><p><strong>{somaTotalGrupo[grupoId].toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></p></td>
                            </tr>
                          </tbody>
                        </table>
                        <hr />
                      </div>
                    );
                  }
                  return null; // Retorna null para grupos que não atendem ao critério
                })}
              </table>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th style={{ width: '30rem' }}></th>
                    <th style={{ width: '15rem' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {/* Inclua uma última linha para mostrar o total geral dos subgrupos de 'compras' */}
                  <tr id="somatorio">
                    <td>
                      <h3>Total geral (Produção)</h3>
                    </td>
                    <td>
                      <h3>
                        <strong>{Object.entries(somas).reduce((total, [grupoId, subgrupos]) => {
                                    const grupo = grupos[grupoId];
                                    return grupo && grupo.categoria === 'produção' ? total + somaTotalGrupo[grupoId] : total;
                                  }, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </strong>
                      </h3>
                    </td>
                  </tr>
                </tbody>
              </table>
                <br />
            </div>
          </div>
        </div>
      ) : (
          <>  
            <br /> <br /> <br />
            <p className={" " + textErroClass } style={{color: "red"}}><strong>Mês ainda se encontra em aberto.</strong></p>
          </>
      )}

          </section>
        )
      };

export default FechamentoEstoque;