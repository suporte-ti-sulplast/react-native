import senhaValidator from './validadorSenha';

const generatePassword = (lgth) => {

    const length = lgth;
    
    const chars = 
    "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNOPQRSTUWXYZ23456789?!@#$%*()[]";

    let password = "";

    for (let i = 0; i < length; i++){
        const randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber + 1)
    }

    const isValid = senhaValidator(password);

    if (isValid) {
        return password;
        /* return "JKZq6(bm";  //alterado para desenvolvimento */
    } else {
        return generatePassword(lgth); // If not valid, generate a new password
    }
  };
  
  export default generatePassword;