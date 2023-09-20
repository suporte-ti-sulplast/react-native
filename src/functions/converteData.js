const converteData = (dataISO) => {

    const data = new Date(dataISO);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Mês é baseado em zero, então adicionamos 1
    const ano = data.getFullYear();
  
    return `${dia}/${mes}/${ano}`;
}


export default converteData;