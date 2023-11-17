// manipuladorNumeros.js
const formatarNumeroComPontos = (numero) => {
    if (!numero) {
        return ''; // Retorna vazio se a hora for falsy (undefined, null, vazia, etc.)
    }

    return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const isValidNumberInput = (value) => {

    return /^(\d{1,3}(\.\d{3})*(,\d{1,2})?|\d+)$/.test(value);
};

export { formatarNumeroComPontos, isValidNumberInput };