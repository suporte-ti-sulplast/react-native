const calcularDiferencaEmDias = (datePassword) => {

    const updatedAtDate = new Date(datePassword);
    const hoje = new Date();
  
    const diferencaEmTempo = hoje.getTime() - updatedAtDate.getTime();
    const diferencaEmDias = Math.floor(diferencaEmTempo / (1000 * 3600 * 24));
  
    return diferencaEmDias;
  }

  export default calcularDiferencaEmDias;