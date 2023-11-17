import "./index.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect, useRef, useContext } from 'react';
import { findVehicles } from "../../../services/apiConcierge";
import { useNavigate } from "react-router-dom";

const ControleMovimentoVeiculos = () => {

  const navigate = useNavigate();

  const [veiculos, setVeiculos] = useState([]);

  /* CARREGA A LISTA DE VEICULOS AO CARREGAR A PÁGINA */
  useEffect(() => {
    const buscaVeiculos  = async () => { 
      try {
        const resposta = await findVehicles();
        setVeiculos(resposta.veiculos);
      } catch (error) {
        console.log(error);
      }
    }
    buscaVeiculos();
  },[])

  const handleConsulta = (vehicle_id, vehicle_name) => {
      navigate("/Portaria/controle-movimento-veiculos", {state: {vehicle_id, vehicle_name}}); 
  } 

  return (
    <section className="controleMovimentoVeiculos">

      <h1>Registro de entrada e saída de veículos</h1>

      <br /><br /><br /><br />
      <div className="veiculos">
        {veiculos.map((veiculos) => 
          (
            <div key={veiculos.vehicle_id} className="image" onClick={() => handleConsulta(veiculos.vehicle_id, veiculos.vehicle_name)}>
                <img src={`http://192.168.0.236:3000/images-vehicles/${veiculos.image}`} alt={veiculos.vehicle_name} />
                <h2>{veiculos.vehicle_name}</h2>
                <img className="car"
                  src={veiculos.inOut === 1 ? "../../images/carroIn.png" : "../../images/carroOut.png"}
                  alt={veiculos.inOut === 1 ? "carroIn" : "carroOut"}
                />
            </div>
          ))}
      </div>
    </section>
  )
};

export default ControleMovimentoVeiculos;