// manipuladorSenhas.js
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
  
  const generatePassword = (lgth) => {
    const length = lgth;
  
    const chars =
      "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNOPQRSTUWXYZ23456789?!@#$%*()[]";
  
    let password = "";
  
    for (let i = 0; i < length; i++) {
      const randomNumber = Math.floor(Math.random() * chars.length);
      password += chars.substring(randomNumber, randomNumber + 1);
    }
  
    const isValid = validadorSenha(password);
  
    if (isValid) {
      return password;
    } else {
      return generatePassword(lgth);
    }
  };
  
  const calcularDiferencaEmDias = (datePassword) => {
    const updatedAtDate = new Date(datePassword);
    const hoje = new Date();
  
    const diferencaEmTempo = hoje.getTime() - updatedAtDate.getTime();
    const diferencaEmDias = Math.floor(diferencaEmTempo / (1000 * 3600 * 24));
  
    return diferencaEmDias;
  };
  
  export { validadorSenha, generatePassword, calcularDiferencaEmDias };