import "./index.scss";
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { depptoStatus } from "../../../../services/apiMASTER";
import { printerEditSave, verificaNomeIP, printerEdit } from "../../../../services/apiPrinter";
import { AuthContext } from '../../../../contexts/auth';

const CadastroImpressorasEdit = ( props ) => {
  
    const navigate = useNavigate();
    const { userLogged } = useContext(AuthContext);
    const printer = props.userData;
    const controle = 1; //variavel só para informar o sistema se a requisição vem da tela de criação ou alteração
    var erro =  null;

    /* USESTATES QUE RECEBEM OS DADOS DOS DADOS */
    const [nome, setNome] = useState("");
    const [nomeOld, setNomeOld] = useState("");
    const [fabricante, setFabricante] = useState("");
    const [modelo, setModelo] = useState("");
    const [status, setStatus] = useState('');
    const [ip, setIp] = useState("");
    const [ipOld, setIpOld] = useState("");
    const [deptto, setDeppto] = useState([]);
    const [netUsb, setNetUsb] = useState("1");
    const [grupoDepto, setGrupoDepto] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [selectedDept, setSelectedDept] = useState('');

    /* USESTATES DOS ERROS */
    const [textErroNome, setTextErroNome] = useState("Nome requerido");
    const [textErroFabricante, setTextErroFabricante] = useState("Fabricante requerido");
    const [textErroModelo, setTextErroModelo] = useState("Modelo requerido");
    const [textErroIp, setTextErroIp] = useState("IP requerido");
    const [textErroDepto, setTextErroDepto] = useState("Necessário adicionar ao menos um departamento");
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('');

    /* USESTATES DAS CLASSES DOS ERROS */
    const [textErroNomeClass, setTextErroNomeClass] = useState("hidden");
    const [textErroFabricanteClass, setTextErroFabricanteClass] = useState("hidden");
    const [textErroModeloClass, setTextErroModeloClass] = useState("hidden");
    const [textErroIpClass, setTextErroIpClass] = useState("hidden");
    const [textErroDeptoClass, setTextErroDeptoClass] = useState("hidden");

    /* VARIVAEIS AUXILIARES */
    const [ipField, setIpField] = useState("show");

    /* CARREGA A LISTA DE DEPARTAMENTOS E STATES AO CARREGAR A PÁGINA */
    useEffect(() => {
      getPrinterData(printer.idPrinter);
      getUserDeptoStatus();
    },[])

    useEffect(() => {
            // Extrai apenas os nomes dos departamentos
            const nomesDepartamentos = departamentos.map((dept) => dept.Department.department);
            setGrupoDepto(nomesDepartamentos);
    },[ip, departamentos ])

    /* VERIFICA SE O ARRAY grupoDepto ESTÁ VAZIO A CADA ALTERAÇÃO DO MESMO */
    useEffect(() => {
      if(grupoDepto !== ""){
        setTextErroDeptoClass("hidden")  
      } else {
        setTextErroDeptoClass("show")
        setTextErroDepto("Necessário adicionar ao menos um departamento")
      }
    },[grupoDepto])

    /* BUSCA NO BANCO A LISTA DE DEPARTAMENTO E STATUS */
    const getPrinterData = async (idPrinter) => {
      try {
        const printerData = await printerEdit(idPrinter);
        setNome(printerData.printer.printerName)
        setNomeOld(printerData.printer.printerName)
        setIp(printerData.printer.ip)
        setIpOld(printerData.printer.ip)
        setFabricante(printerData.printer.manufacturer)
        setModelo(printerData.printer.model)
        setStatus(printerData.printer.status)
        setNetUsb(printerData.printer.netUsb)
        setDepartamentos(printerData.department)
        } catch (error) {
          console.error("Ocorreu um erro ao obter os dados", error);
        }
      };

    /* BUSCA NO BANCO A LISTA DE DEPARTAMENTO E STATUS */
    const getUserDeptoStatus = async () => {
    try {
      const depptoStattus = await depptoStatus();
      setDeppto(depptoStattus.deptto);
      } catch (error) {
        console.error("Ocorreu um erro ao obter os dados", error);
      }
    };
    
    /* FUNÇÃO DO BOTÃO DE SUBMIT DO FORMULÁRIO */
    const handleSubmit =  async (e) => {
      e.preventDefault(); //PREVINE A AÇÃO DEFULT DO FORMULÁRIO

      /* valida se estão preenchidos nome, fabricante e modelo */
      if(nome === "" || nome === null){
        setTextErroNome("Nome requerido");
        setTextErroNomeClass("Show");
      }
      if(fabricante === "" || fabricante === null){
        setTextErroFabricante("Fabricante requerido");
        setTextErroFabricanteClass("Show");
      }
      if(modelo === "" || modelo === null){
        setTextErroModelo("Modelo requerido");
        setTextErroModeloClass("Show");
      }
      if(grupoDepto.length <= 0){
        setTextErroDepto("Necessário adicionar ao menos um departamento")
        setTextErroDeptoClass("Show");
      }
      
      /* verifica se nãovai criar duplicida de nome e ip */
      try {
        const response = await verificaNomeIP(nome, ip, controle, nomeOld, ipOld);
        erro = response.erro;

        switch(erro){
          /* caso 0 é que não existe nem nome, nem ip */
          case 0:
            /* seta o IP como OK para salvar no banco */
          break;

          case 1:
            /* caso 1 é que EXISTE nome E ip */
            setTextErroNome("Nome já existe");
            setTextErroNomeClass("Show");
            setTextErroIp("IP já existe");
            setTextErroIpClass("Show");
          break;

          case 2:
            /* caso 2 é que EXISTE somente NOME */
            setTextErroNome("Nome já existe");
            setTextErroNomeClass("Show");
          break;

          case 3:
            /* caso 3 é que EXISTE somente IP */
            setTextErroIp("IP já existe");
            setTextErroIpClass("Show");
          break;

          default:
          break;
        }
      } catch (err) {
        console.error('Ocorreu um erro durante a consulta:', err);
      }; 

      /* Se todos os campos preenchidos e há pelo menos 1 departamento segue com o salvamento  */
      console.log(erro)
      if(nome && fabricante && modelo && erro === 0 &&  grupoDepto.length > 0) {
        /* atribui os dados a uma variável */
        const dadosParaEnviar = {
          id: printer.idPrinter,
          nome: nome,
          fabricante: fabricante,
          modelo: modelo,
          status: status || "1",
          ip: ip,
          netUsb: netUsb,
          grupoDepto: grupoDepto,
          setUser: userLogged.logged.idUser
        };

      try {
           const response = await printerEditSave(dadosParaEnviar);
                setMsg(response.msg)
                if(response.msg_type === "success") {
                  setMsgType("success")
                } else {
                  setMsgType("error")
                }

                //LIMPA O FORMULÁRIO
                setMsg(response.msg);
                setNome("");
                setFabricante("");
                setModelo("");
                setStatus("");
                setNetUsb("1");
                setIp("");
                setSelectedDept("");
                setIpField("show");
                setGrupoDepto([]); 
                erro = null;

                // Define um atraso de 3 segundos (3000 milissegundos) para reverter para "hidden"  
                setTimeout(() => {
                  setMsgType("hidden");
                }, 3000);
        } catch (err) {
          console.error('Ocorreu um erro durante a consulta:', err);
        }; 
      }
    };

    /* FUNÇÃO DO BOTÃO CANCELAR ... VOLTA PARA LISTA DE USERS */
    const handleCancel = (e) => {
      navigate("/ADM-TI/cadastro-impressoras"); 
    }

    /* FUNÇÃO DO BOTÃO ADICIONAR GRUPOS DA IMPRESSORA */
    const handleAdicionaGrupo = () => {
      if (selectedDept && selectedDept !== "Adicione um ou mais departamentos" && !grupoDepto.includes(selectedDept)) {
          setGrupoDepto([...grupoDepto, selectedDept]);
          setSelectedDept('');
          setTextErroDeptoClass("hidden");  // Para ocultar a mensagem de erro, se estiver visível
      } else {
          setTextErroDeptoClass("show");
          setTextErroDepto("Departamento já adicionado ou selecione um válido");
      }
    };

    /* FUNÇÃO DO BOTÃO DELETAR GRUPOS DA IMPRESSORA */
    const handleDeleteGrupo = (index) => {
      const novoGrupoDepto = [...grupoDepto];
      novoGrupoDepto.splice(index, 1);
      setGrupoDepto(novoGrupoDepto);
    }

    /* VERIFICA SE É UM ENDEREÇO DE IP VÁLIDO */
    const isValidIP = (ip) => {
      // Regex para validar um endereço IPv4
      const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
      // Retorna true se o IP corresponde ao formato esperado
      return ipRegex.test(ip);
    };
    
    /* RENDERIZAÇÃO DA PÁGINA **************************************************** */
    return (
    <section className="editarImpressoras">

      <h2>Visualizar ou alterar impressora</h2>
      <hr />

      <div className="content">
        
        <form className="form" onSubmit={handleSubmit}>
          
          <div style={{display:"grid", gridTemplateColumns: "1fr 1fr"} }>
            
            <div className="ladoEsq">

                {/* Grupo Nome */}
                <div className="form-group">
                  <label htmlFor="nome">Nome: &emsp;</label>
                  <input id="nome" value={nome} type="text" onChange={(e) => {
                    setNome(e.target.value); 
                    setTextErroNome("");
                    setTextErroNomeClass("hidden")
                    }} />
                  <div className={"erros " +  textErroNomeClass}>{textErroNome}</div>
                </div> 

                {/* Grupo Fabricante */}
                <div className="form-group">
                  <label htmlFor="fabricante">Fabricante: &emsp;</label>
                  <input id="fabricante" value={fabricante} type="text" onChange={(e) => {
                    setFabricante(e.target.value); 
                    setTextErroFabricante("");
                    setTextErroFabricanteClass("hidden")
                    }} />
                  <div className={"erros " +  textErroFabricanteClass}>{textErroFabricante}</div>
                </div> 

                {/* Grupo Modelo */}
                <div className="form-group">
                  <label htmlFor="modelo">Modelo: &emsp;</label>
                  <input id="modelo" value={modelo} type="text" onChange={(e) => {
                    setModelo(e.target.value); 
                    setTextErroModelo("");
                    setTextErroModeloClass("hidden")
                    }} />
                  <div className={"erros " +  textErroModeloClass}>{textErroModelo}</div>
                </div> 

                {/* Grupo Status */}
                <div className="form-group">
                  <label htmlFor="status">Status: &emsp;</label>
                  <select id="status" name="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="1">Ativa</option>
                    <option value="0">Inativa</option>
                  </select>
                  <div className={"erros"}></div>
                </div> 

                {/* Grupo NetUsb */}
                <div className="form-group">
                  <label htmlFor="netUsb">Rede/USB: &emsp;</label>
                  <select id="netUsb" name="netUsb" value={netUsb}
                    onChange={(e) => {
                      setNetUsb(e.target.value);
                      if (e.target.value === "0") {
                        setIpField("hidden");
                        setIp("");
                      } else if (e.target.value === "1") {
                        setIpField("show");
                        setIp("");
                      }
                    }}
                  >
                    <option value="1">Rede</option>
                    <option value="0">USB</option>
                  </select>
                  <div className={"erros"}></div>
                </div> 

                {/* Grupo IP */}
                <div className={"form-group " + ipField}>
                  <label htmlFor="ip">IP: &emsp;</label>
                  <input  id="ip" 
                          value={ip}
                          type="text" placeholder="Exemplo: 192.168.X.XXX"
                          onChange={(e) => 
                            {
                              const inputValue = e.target.value;
                              setIp(inputValue);
                              // Verifica se o valor do IP é válido antes de atualizar o estado
                              if (isValidIP(inputValue)) {
                                setTextErroIp("");
                                erro = 0;
                                setTextErroIpClass("hidden");
                              } else if(inputValue === "") {
                                setTextErroIp("IP requerido");
                                erro = null;
                                setTextErroIpClass("show");
                              } else {
                                setTextErroIp("Formato inválido");
                                erro = null;
                                setTextErroIpClass("show");
                              }
                            }}
                  />
                  <div className={"erros " +  textErroIpClass}>{textErroIp}</div>
                </div> 
                
            </div> {/* fecha o lado esquerdo */}

            <div className="ladoDir">

              {/* Grupo Departamento */}
              <div className="form-group depto">
                <label htmlFor="department">Departamento(s): &emsp;</label>
                <select
                  id="department"
                  name="department"
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                >
                    <option>
                      Adicione um ou mais departamentos
                    </option>
                  {deptto.map((dept) => (
                    <option key={dept.id} value={dept.department}>
                      {dept.department}
                    </option>
                  ))}
                </select>
                <img
                  className="icon"
                  src="../../images/adicionar - cinza.png"
                  alt="adicionar"
                  onClick={handleAdicionaGrupo}
                />
              </div>
              <div style={{width:"auto"}} className={"erros " +  textErroDeptoClass}>{textErroDepto}</div>

              <div className="tabela"> 
                <table className="">
                  <thead>
                    <th>Departamentos adicionados</th>
                    <th>Excluir</th>
                  </thead>
                  <tbody>
                  {grupoDepto.map((dept, index) => (
                    <tr key={index}>
                      <td>{dept}</td>
                      <td style={{ textAlign: "center" }}>
                        <img
                          className="lixo"
                          src="../../images/lixeira-com-tampa.png"
                          alt="lixeira-com-tampa"
                          onClick={() => handleDeleteGrupo(index)}
                        />
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>

            </div>  {/* fecha o lado direito */}

          </div> {/* fecha AMBOS OS LADOS */}

          <hr />

          <div style={{display:"grid", gridTemplateColumns: "1fr", gap: '3rem'} }>

            <div className="form-group">
              <button className="escBtn Btn" type="button" onClick ={handleCancel}>Cancelar</button>
              <button className="okBtn Btn" type="submit">Salvar</button>
            </div> 

          <div className="form-group">
            <div className={'msg ' + msgType}>{msg}</div>
          </div>

          </div>
                      
        </form>

      </div>
      
    </section> 
  )
};

export default CadastroImpressorasEdit;