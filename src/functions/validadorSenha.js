const validadorSenha = (senha) => {
    if (senha.length < 8) {
      return false;
    }
  
    if (!/[a-z]/.test(senha)) {
      return false;
    }
  
    if (!/[A-Z]/.test(senha)) {
      return false;
    }
  
    if (!/\d/.test(senha)) {
      return false;
    }
  
    if (!/[!@#$%^&*()_+{}\[\]:;<>,.?\\/-]/.test(senha)) {
      return false;
    }
    
    return true;
  };
  
  export default validadorSenha;