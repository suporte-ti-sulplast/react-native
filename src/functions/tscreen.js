const tScreen = (numero) => {
    
    // Captura a largura da tela
    const larguraTela = window.innerWidth;
    
    // Captura a altura da tela
    const alturaTela = window.innerHeight;
    
    return `${larguraTela} x ${alturaTela}`
};

export { tScreen };