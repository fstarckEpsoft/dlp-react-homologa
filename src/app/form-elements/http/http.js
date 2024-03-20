import axios from 'axios';
import DlpController from "../controller/DlpController";

/* CAPITURA DA URL O TOKEN ENVIADO PELO USUARIO AO CLICAR NO BOTAO DO VUE JS */
let tokenURL = window.document.URL;
tokenURL = tokenURL.split('ss=')[1]

/* CRIA UMA VARIAVEL AUXILIAR PARA ARMAZENAR O TOKEN FILTRADO */
let chave = '';

chave = tokenURL;

console.log(`Token armazenado: ${chave}`);

/* ATRIBUI O TOKEN AO AXIOS EM AUTHORIZATION */
axios.defaults.headers.common['Authorization'] = chave; 

console.log("Token");
console.log(axios.defaults.headers.common['Authorization']);

export default axios.create({
  baseURL: DlpController.enderecoHttp(),
 // baseURL: 'https://app.epsoft.com.br:8025', // AWSSERVER


  headers: {
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*",  
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
  }
});