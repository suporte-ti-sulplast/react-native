// manipuladorDataHora.js
const converteData = (dataISO) => {

    if (!dataISO) {
        return ''; // Retorna vazio se a hora for falsy (undefined, null, vazia, etc.)
    }

    const data = new Date(dataISO);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    
    return `${dia}/${mes}/${ano}`;
};

const converteDataMySQL = (date) => {

    const dataAtual = new Date();
    const ano = dataAtual.getFullYear();
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); // O mês é base 0, então somamos 1
    const dia = String(dataAtual.getDate()).padStart(2, '0');
    
    return `${ano}-${mes}-${dia}`;
}

const converteHora = (hora) => {
    if (!hora) {
        return ''; // Retorna vazio se a hora for falsy (undefined, null, vazia, etc.)
    }

    const [horas, minutos] = hora.split(':').slice(0, 2);
    return `${horas}:${minutos}`;
};

const retornaMes = (numeroMes) => {

    const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril',
        'Maio', 'Junho', 'Julho', 'Agosto',
        'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    if (numeroMes >= 1 && numeroMes <= 12) {
    return meses[numeroMes - 1];
    } else {
    return 'Mês inválido';
    }
};

const getLastDayOfMonth = (yyyy, mm) => {

    // Cria uma nova data no último dia do mês
    const year = yyyy;
    const month = parseInt(mm)
    const lastDay = new Date(year, month, 0);
    const lastDayDate = lastDay.toLocaleDateString();
    
    const partes = lastDayDate.split('/');
    const newData =  `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
    
    return newData; 
}

const validarFormatoHora = (hora) => {
    const regexHora = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    return regexHora.test(hora);
};

function obterPrimeiroUltimoDiaSemana() {
    const dataAtual = new Date();
    const diaSemana = dataAtual.getDay(); // 0 (domingo) a 6 (sábado)
    const primeiroDia = new Date(dataAtual);
    const ultimoDia = new Date(dataAtual);
  
    // Subtrai o número de dias para chegar ao primeiro dia da semana (segunda-feira)
    primeiroDia.setDate(dataAtual.getDate() - diaSemana + (diaSemana === 0 ? -6 : 1));
  
    // Adiciona o número de dias para chegar ao último dia da semana (domingo)
    ultimoDia.setDate(dataAtual.getDate() - diaSemana + 7);
  
    // Formata as datas para "dd/mm"
    const primeiroDiaFormatado = `${('0' + primeiroDia.getDate()).slice(-2)}/${('0' + (primeiroDia.getMonth() + 1)).slice(-2)}`;
    const ultimoDiaFormatado = `${('0' + ultimoDia.getDate()).slice(-2)}/${('0' + (ultimoDia.getMonth() + 1)).slice(-2)}`;
    const dataAtualFormatada = `${('0' + dataAtual.getDate()).slice(-2)}/${('0' + (dataAtual.getMonth() + 1)).slice(-2)}`;
  
    return { primeiroDia, ultimoDia, primeiroDiaFormatado, ultimoDiaFormatado, dataAtualFormatada };
}

  function validarFormatoDDMM(str) {
    const formatoRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])$/;
    const resposta = formatoRegex.test(str);
    return resposta;
}

export {converteData, converteHora, converteDataMySQL, retornaMes, getLastDayOfMonth, validarFormatoHora, obterPrimeiroUltimoDiaSemana, validarFormatoDDMM};