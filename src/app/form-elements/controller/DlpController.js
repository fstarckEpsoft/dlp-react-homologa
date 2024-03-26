import http from "../http/http";
import apiJson from 'axios';
import { TEXT } from "react-dnd-html5-backend/lib/NativeTypes";
import BasicElements from "../BasicElements";
import dataConfig from "./../../../dataConfig.json";

let endereco = dataConfig.endereco;
let endereco_react = dataConfig.endereco_react;
let ambiente_end = dataConfig.ambiente_end;
let porta = dataConfig.porta;
let porta_react = dataConfig.porta_react;
let porta_api = dataConfig.porta_api;
let endereco_localhost = dataConfig.endereco_localhost;
let porta_localhost = dataConfig.porta_localhost;

const versao = '240326.0953';

console.log("%c Versão Front REACT: " + versao + " do ambiente " + ambiente_end, "color: black ; background-color: #00ff0085 ; font-weight: bold")

let url = window.document.URL

let TOKEN_ACESSO_JSON = '';

if (url.includes('ss=')) {
  const TOKEN_URL = window.document.URL.split('ss=')[1];
  const TOKEN_SECRET = decodeURIComponent(TOKEN_URL);
  localStorage.setItem('TOKEN', TOKEN_SECRET);
  TOKEN_ACESSO_JSON = TOKEN_SECRET;
} else if (!!localStorage.getItem('TOKEN')) {
  TOKEN_ACESSO_JSON = localStorage.getItem('TOKEN');
} else {
  alert('Voce esta sem token, sera redirecionado ao Painel de Configurações');
  window.location.href = endereco + ":" + porta;
}

let AMBIENTE = endereco + ":" + porta; //'https://app.epsoft.com.br:8o25';
let AMBIENTE_REACT = endereco_react + ":" + porta_react; // 'https://app.epsoft.com.br:3o03';  ATUALIZAR ESSE ENDEREÇO


if (window.document.URL.includes('localhost')) {
  AMBIENTE = endereco_localhost + ":" + porta_localhost; // 'http://localhost:8080'; 

} else {
  AMBIENTE = endereco + ":" + porta; //'https://app.epsoft.com.br:8o25' 
}

if (TOKEN_ACESSO_JSON === undefined) {
  alert('Voce esta sem token, sera redirecionado ao Painel de Configurações');
  window.location.href = endereco + ":" + porta;
}

// CAMINHO E AMBIENTE API
let ambiente = ambiente_end; // 'PROD';
let urlAPI = endereco + ":" + porta_api // 'https://app.epsoft.com.br:5o01';
//let urlAPI = "https://dlp.epsoft.com.br" + ":" + porta_api // 'https://app.epsoft.com.br:5o01';


class DlpController {

  enderecoHttp() {
    return endereco + ":" + porta;
  }

  urlApiHomolog() {
    return urlAPI;
  }

  ambienteAPI() {
    return ambiente;
  }

  ambiente() {
    return ambiente_end;
  }

  ambienteRedirecionamento() {
    return AMBIENTE;
  }

  ambienteRedirecionamentoReact() {
    return AMBIENTE_REACT;
  }

  getAllDlp() {
    return http.get("/dlpteste1");
  }

  get(id) {
    return http.get(`/dlpteste1/${id}`);
  }

  create(data) {
    return http.post("/dlpteste1", data);
  }

  update(nome, data) {
    return http.put(`/dlpteste1?cliAtual=${nome}`, data);
  }

  delete(id) {
    return http.delete(`/dlpteste1/${id}`);
  }

  deleteAll() {
    return http.delete(`/dlpteste1`);
  }

  findByNome(nome) {
    return http.get(`/dlpteste1?computer_name=${nome}`);
  }

  /* METODOS BUSCA ENDPOINTS DLP */


  postJson(objeto) {
    /* QUANDO FOR TESTAR EM AMBIENTE DE PRODUCAO O ENDERECO DO SERVIDOR SERA O PROVISORIO, NO MOMENTO ESTAMOS LOCALMENTE */
    return http.post(`/configs/putJson/${TOKEN_ACESSO_JSON}/resp_rest`, objeto);
  }

  capituraToken() {
    return TOKEN_ACESSO_JSON;
  }

  capturaGrupoToken() {
    try {
      let tokenTratado = TOKEN_ACESSO_JSON.replace('=', '')
      let grupoToken = Buffer.from(tokenTratado, "base64").toString();
      grupoToken = grupoToken.split('^')[1];

      return grupoToken;

    } catch (erro) {
      console.error('Erro na obtenção do grupo do token');
      console.log(erro);
    }
  }

  /* CARREGA A LISTA DE MAQUINAS */putJson
  getMaquinaDPO() {
    return http.get(`/maquinas/listaSecret/${TOKEN_ACESSO_JSON}/resp_rest `);
  }

  retornaGrupoUsuarioLogado() {
    let token = Buffer.from(TOKEN_ACESSO_JSON, "base64").toString();

    token = token.replaceAll('�', '');

    try {
      token = token.split('^')[1];

    } catch (erro) {
      console.log('Nao foi localizado chapeu na String');

    }

    try {

      // console.log('MEU GRUPO: '+ token);

      let filtro = token.replace(/[0-9]/g, '');
      filtro = filtro.replaceAll(' ', '');

      token = filtro;

      // console.log(`TOKEN: ${token}`);

      if (token.length === 1) {
        console.log('GRUPO MODIFICADO!!');
        token = "epsoft*";
      }

      if (token.length === 2) {
        console.log('GRUPO MODIFICADO!!');
        token = "epsoft*";
      }

      // console.log(`Grupo DLP: ${token}`);
      alert(`Grupo DLP: ${token}`);
    } catch (erro) {
      console.log('Nao foi localizado * na String');

    }

    /*var correcao = Buffer.from(TOKEN_ACESSO_JSON, "base64").toString().split('^')[1];
    console.log("Correcao: "+ correcao);
    if(correcao.includes('�')) {
      token = "epsoft*";
      console.log("Corrigiu grupo: "+ token);
    }*/

    return token;
  }

  getJson(pesquisa) {
    return http.post(`/configs/getJsons/${TOKEN_ACESSO_JSON}/resp_rest `, pesquisa);
  }

  getJsonAPI(pesquisa) {
    let token = '';

    try {
      token = Buffer.from(TOKEN_ACESSO_JSON, "base64").toString();
      token = token.replaceAll('�', '');
      token = token.split('^')[1];

    } catch (erro) {
      console.log('Nao foi localizado chapeu na String');

    }

    try {

      console.log('MEU GRUPO: ' + token);

      let filtro = token.replace(/[0-9]/g, '');
      filtro = filtro.replaceAll(' ', '');

      token = filtro;

      console.log(`TOKEN: ${token}`);

      if (token.length === 1) {
        console.log('GRUPO MODIFICADO!!');
        token = "epsoft*";
      }

      if (token.length === 2) {
        console.log('GRUPO MODIFICADO!!');
        token = "epsoft*";
      }

      /*let trava = false;

      for(let i = 0; i < token.length; i++) {
        if(token.charAt(i) === '*') {
          token = token.split('*')[0];

          trava = true;

        }

      }

      if(trava) {
        token = token + '*';

        trava = false;

      }*/

      console.log(`Grupo DLP: ${token}`);

    } catch (erro) {
      console.log('Nao foi localizado * na String');

    }

    console.log(`${urlAPI}/api/pastasflash/jsonbyname/${token}/${pesquisa}/${ambiente}`);
    console.log("PESQUISA" + pesquisa)
    return apiJson.get(`${urlAPI}/api/pastasflash/jsonbyname/epsoft/${pesquisa}/${ambiente}/${TOKEN_ACESSO_JSON}`);
  }


  getJsonAPIss() {
    let token = '';
    alert("chamou");
    try {
      token = Buffer.from(TOKEN_ACESSO_JSON, "base64").toString();
      token = token.replaceAll('�', '');
      token = token.split('^')[1];

    } catch (erro) {
      console.log('Nao foi localizado chapeu na String');

    }

    try {

      console.log('MEU GRUPO: ' + token);

      let filtro = token.replace(/[0-9]/g, '');
      filtro = filtro.replaceAll(' ', '');

      token = filtro;

      console.log(`TOKEN: ${token}`);

      if (token.length === 1) {
        console.log('GRUPO MODIFICADO!!');
        token = "epsoft*";
      }

      if (token.length === 2) {
        console.log('GRUPO MODIFICADO!!');
        token = "epsoft*";
      }

      /*let trava = false;

      for(let i = 0; i < token.length; i++) {
        if(token.charAt(i) === '*') {
          token = token.split('*')[0];

          trava = true;

        }

      }

      if(trava) {
        token = token + '*';

        trava = false;

      }*/

      console.log(`Grupo DLP: ${token}`);

    } catch (erro) {
      console.log('Nao foi localizado * na String');

    }


    return (`${urlAPI}/api/alertas/getalertacountperiodo/PROD/epsoft/2022-07-08 14-01-17/2022-07-10 13-55-12/${TOKEN_ACESSO_JSON}`);
    //console.log("PESQUISA" + pesquisa)
    //return apiJson.get(`${urlAPI}/api/pastasflash/jsonbyname/epsoft/${pesquisa}/${ambiente}/${TOKEN_ACESSO_JSON}`);
  }


  postJsonMass(objeto) {
    return http.post(`/configs/updJsons/${TOKEN_ACESSO_JSON}/resp_rest `, objeto);
  }

  getAllGrupoDlpByToken() {
    let token = '';

    try {
      token = Buffer.from(TOKEN_ACESSO_JSON, "base64").toString();
      token = token.replaceAll('�', '');
      token = token.split('^')[1];

    } catch (erro) {
      console.log('Nao foi localizado chapeu na String');

    }

    try {
      //token = token.split('*')[0];
      //token = token.replace(/[^0-9]/g,'');

      console.log('MEU GRUPO: ' + token);

      let filtro = token.replace(/[0-9]/g, '');
      filtro = filtro.replaceAll(' ', '');

      token = filtro;

      console.log(`TOKEN: ${token}`);

      if (token.length === 1) {
        console.log('GRUPO MODIFICADO!!');
        token = "epsoft*";
      }

      if (token.length === 2) {
        console.log('GRUPO MODIFICADO!!');
        token = "epsoft*";
      }

      /*let trava = false;

      for(let i = 0; i < token.length; i++) {
        if(token.charAt(i) === '*') {
          token = token.split('*')[0];

          trava = true;

        }

      }

      if(trava) {
        token = token + '*';

        trava = false;

      }*/

      console.log(`Grupo DLP: ${token}`);

    } catch (erro) {
      console.log('Nao foi localizado * na String');

    }

    /*try {
      if(token.length === 0) {
        //token = "*";
        token = "epsoft";
      }

      console.log('SPLIT TOKEN GRUPO DLP');
      console.log(token);
      console.log(token.length);

    }catch(erro) {
      console.log('Ocorreu um erro na String');

    }*/

    try {

      var str = Buffer.from(TOKEN_ACESSO_JSON, "base64").toString().split('^')[1];

      if (str.includes("m2g*")) {
        console.log(str.includes("m2g*"));
        token = Buffer.from(TOKEN_ACESSO_JSON, "base64").toString().split('^')[1];
        token = token.replaceAll('�', '');
        token = "m2g*";
      }

    } catch (erro) {
      console.log('Nao foi localizado chapeu na String');
      //alert('OCORREU UM ERRO COM O CARREGAMENTO DO SEU GRUPO DLP, VERIFIQUE COM O SUPORTE!');

    }

    /*var correcao = Buffer.from(TOKEN_ACESSO_JSON, "base64").toString().split('^')[1];
    console.log("Correcao: "+ correcao);
    if(correcao.includes('�')) {
      token = "epsoft*";
      console.log("Corrigiu grupo: "+ token);
    }*/

    return http.get(`${urlAPI}/api/apiflashsafe/b/${token}/${ambiente}/${TOKEN_ACESSO_JSON}`);
  }

  getByJsonDefault() {
    let token = '';

    try {
      token = Buffer.from(TOKEN_ACESSO_JSON, "base64").toString();
      token = token.replaceAll('�', '');
      token = token.split('^')[1];

    } catch (erro) {
      console.log('Nao foi localizado chapeu na String');

    }

    try {
      //token = token.split('*')[0];
      //token = token.replace(/[^0-9]/g,'');

      console.log('MEU GRUPO: ' + token);

      let filtro = token.replace(/[0-9]/g, '');
      filtro = filtro.replaceAll(' ', '');

      token = filtro;

      console.log(`TOKEN: ${token}`);
      console.log((token === "*"));
      console.log((token.length));

      if (token.length === 1) {
        console.log('GRUPO MODIFICADO!!');
        token = "epsoft*";
      }

      if (token.length === 2) {
        console.log('GRUPO MODIFICADO!!');
        token = "epsoft*";
      }

      /*let trava = false;

      for(let i = 0; i < token.length; i++) {
        if(token.charAt(i) === '*') {
          token = token.split('*')[0];

          trava = true;

        }

      }

      if(trava) {
        token = token + '*';

        trava = false;

      }*/

      console.log(`Grupo DLP: ${token}`);

    } catch (erro) {
      console.log('Nao foi localizado * na String');

    }

    /*try {
      if(token.length === 0) {
        //token = "*";
        token = "epsoft";
      }

      console.log('SPLIT TOKEN GRUPO DLP');
      console.log(token);
      console.log(token.length);

    }catch(erro) {
      console.log('Ocorreu um erro na String');

    }*/

    try {
      var str = Buffer.from(TOKEN_ACESSO_JSON, "base64").toString().split('^')[1];

      if (str.includes("m2g*")) {
        console.log(str.includes("m2g*"));
        token = Buffer.from(TOKEN_ACESSO_JSON, "base64").toString().split('^')[1];
        token = token.replaceAll('�', '');
        token = "m2g*";
      }

    } catch (erro) {
      console.log('Nao foi localizado chapeu na String');
      //alert('OCORREU UM ERRO COM O CARREGAMENTO DO SEU GRUPO DLP, VERIFIQUE COM O SUPORTE!');

    }

    /*var correcao = Buffer.from(TOKEN_ACESSO_JSON, "base64").toString().split('^')[1];
    console.log("Correcao: "+ correcao);
    if(correcao.includes('�')) {
      token = "epsoft*";
      console.log("Corrigiu grupo: "+ token);
    }*/

    return apiJson.get(`${urlAPI}/api/apiflashsafe/jsondefault/${token}/${ambiente}/${TOKEN_ACESSO_JSON}`);
  }

  getByJsonDefault2() {
    let token = '';

    try {
      token = Buffer.from(TOKEN_ACESSO_JSON, "base64").toString();
      token = token.replaceAll('�', '');
      token = token.split('^')[1];

    } catch (erro) {
      console.log('Nao foi localizado chapeu na String');

    }

    try {
      //token = token.split('*')[0];
      //token = token.replace(/[^0-9]/g,'');

      console.log('MEU GRUPO: ' + token);

      let filtro = token.replace(/[0-9]/g, '');
      filtro = filtro.replaceAll(' ', '');

      token = filtro;

      console.log(`TOKEN: ${token}`);
      console.log((token === "*"));
      console.log((token.length));

      if (token.length === 1) {
        console.log('GRUPO MODIFICADO!!');
        token = "epsoft*";
      }

      if (token.length === 2) {
        console.log('GRUPO MODIFICADO!!');
        token = "epsoft*";
      }

      /*let trava = false;

      for(let i = 0; i < token.length; i++) {
        if(token.charAt(i) === '*') {
          token = token.split('*')[0];

          trava = true;

        }

      }

      if(trava) {
        token = token + '*';

        trava = false;

      }*/

      console.log(`Grupo DLP: ${token}`);

    } catch (erro) {
      console.log('Nao foi localizado * na String');

    }

    /*try {
      if(token.length === 0) {
        //token = "*";
        token = "epsoft";
      }

      console.log('SPLIT TOKEN GRUPO DLP');
      console.log(token);
      console.log(token.length);

    }catch(erro) {
      console.log('Ocorreu um erro na String');

    }*/

    try {
      var str = Buffer.from(TOKEN_ACESSO_JSON, "base64").toString().split('^')[1];

      if (str.includes("m2g*")) {
        console.log(str.includes("m2g*"));
        token = Buffer.from(TOKEN_ACESSO_JSON, "base64").toString().split('^')[1];
        token = token.replaceAll('�', '');
        token = "m2g*";
      }

    } catch (erro) {
      console.log('Nao foi localizado chapeu na String');
      //alert('OCORREU UM ERRO COM O CARREGAMENTO DO SEU GRUPO DLP, VERIFIQUE COM O SUPORTE!');

    }

    /*var correcao = Buffer.from(TOKEN_ACESSO_JSON, "base64").toString().split('^')[1];
    console.log("Correcao: "+ correcao);
    if(correcao.includes('�')) {
      token = "epsoft*";
      console.log("Corrigiu grupo: "+ token);
    }*/

    return apiJson.get(`${urlAPI}/api/apiflashsafe/jsondefault/${token}/${ambiente}/${TOKEN_ACESSO_JSON}`);
  }


  /* ENDPOINTS GRUPO DLP */
  getPorGrupo() {
    let token = '';

    try {
      token = Buffer.from(TOKEN_ACESSO_JSON, "base64").toString();
      token = token.replaceAll('�', '');
      token = token.split('^')[1];

    } catch (erro) {
      console.log('Nao foi localizado chapeu na String');

    }

    try {
      //token = token.split('*')[0];
      //token = token.replace(/[^0-9]/g,'');

      console.log('MEU GRUPO: ' + token);

      let filtro = token.replace(/[0-9]/g, '');
      filtro = filtro.replaceAll(' ', '');

      token = filtro;

      console.log(`TOKEN: ${token}`);

      if (token.length === 1) {
        console.log('GRUPO MODIFICADO!!');
        token = "epsoft*";
      }

      if (token.length === 2) {
        console.log('GRUPO MODIFICADO!!');
        token = "epsoft*";
      }

      /*let trava = false;

      for(let i = 0; i < token.length; i++) {
        if(token.charAt(i) === '*') {
          token = token.split('*')[0];

          trava = true;

        }

      }

      if(trava) {
        token = token + '*';

        trava = false;

      }*/

      console.log(`Grupo DLP: ${token}`);

    } catch (erro) {
      console.log('Nao foi localizado * na String');

    }

    /*try {
      if(token.length === 0) {
        //token = "*";
        token = "epsoft";
      }

      console.log('SPLIT TOKEN GRUPO DLP');
      console.log(token);
      console.log(token.length);

    }catch(erro) {
      console.log('Ocorreu um erro na String');

    }*/

    try {
      var str = Buffer.from(TOKEN_ACESSO_JSON, "base64").toString().split('^')[1];

      if (str.includes("m2g*")) {
        console.log(str.includes("m2g*"));
        token = Buffer.from(TOKEN_ACESSO_JSON, "base64").toString().split('^')[1];
        token = token.replaceAll('�', '');
        token = "m2g*";
      }

    } catch (erro) {
      console.log('Nao foi localizado chapeu na String');
      //alert('OCORREU UM ERRO COM O CARREGAMENTO DO SEU GRUPO DLP, VERIFIQUE COM O SUPORTE!');

    }

    /*var correcao = Buffer.from(TOKEN_ACESSO_JSON, "base64").toString().split('^')[1];
    console.log("Correcao: "+ correcao);
    if(correcao.includes('�')) {
      token = "epsoft*";
      console.log("Corrigiu grupo: "+ token);
    }*/

    return http.get(`${urlAPI}/api/grupoflash/getporgrupo/${token}/${ambiente}/${TOKEN_ACESSO_JSON}`);
  }

  /* ENDPOINTS GRUPO DLP */
  getByGrupoDlpSelecionado(grupo) {

    return http.get(`${urlAPI}/api/grupoflash/getporgrupo/${grupo}/${ambiente}/${TOKEN_ACESSO_JSON}`);
  }

  /*   postGrupoDLP(objeto) {
  
      return http.post(`${urlAPI}/api/grupoflash/create/${ambiente}/${TOKEN_ACESSO_JSON}`, objeto);
    } */

  putGrupoDLP(grupoAntigo, objeto) {

    return http.put(`${urlAPI}/api/grupoflash/updateporgrupo/${grupoAntigo}/${ambiente}/${TOKEN_ACESSO_JSON}`, objeto);
  }

  deleteGrupoDLP(objeto) {

    console.log('OBJETO PARA DELECAO: ');
    console.log(objeto);
    return http.put(`${urlAPI}/api/grupoflash/deleteporgrupo/${ambiente}/${TOKEN_ACESSO_JSON}`, objeto);
  }

  /* ENDPOINTS METADADOS */
  getMetadados() {
    let token = '';

    try {
      token = Buffer.from(TOKEN_ACESSO_JSON, "base64").toString();
      token = token.replaceAll('�', '');
      token = token.split('^')[1];

    } catch (erro) {
      console.log('Nao foi localizado chapeu na String');

    }

    try {
      //token = token.split('*')[0];
      //token = token.replace(/[^0-9]/g,'');

      console.log('MEU GRUPO: ' + token);

      let filtro = token.replace(/[0-9]/g, '');
      filtro = filtro.replaceAll(' ', '');

      token = filtro;

      console.log(`TOKEN: ${token}`);

      if (token.length === 1) {
        console.log('GRUPO MODIFICADO!!');
        token = "epsoft*";
      }

      if (token.length === 2) {
        console.log('GRUPO MODIFICADO!!');
        token = "epsoft*";
      }

      /*let trava = false;

      for(let i = 0; i < token.length; i++) {
        if(token.charAt(i) === '*') {
          token = token.split('*')[0];

          trava = true;

        }

      }

      if(trava) {
        token = token + '*';

        trava = false;

      }*/

      console.log(`Grupo DLP: ${token}`);

    } catch (erro) {
      console.log('Nao foi localizado * na String');

    }

    try {

      var str = Buffer.from(TOKEN_ACESSO_JSON, "base64").toString().split('^')[1];

      if (str.includes("m2g*")) {
        console.log(str.includes("m2g*"));
        token = Buffer.from(TOKEN_ACESSO_JSON, "base64").toString().split('^')[1];
        token = token.replaceAll('�', '');
        token = "m2g*";
      }

    } catch (erro) {
      console.log('Nao foi localizado chapeu na String');
      //alert('OCORREU UM ERRO COM O CARREGAMENTO DO SEU GRUPO DLP, VERIFIQUE COM O SUPORTE!');

    }

    /*var correcao = Buffer.from(TOKEN_ACESSO_JSON, "base64").toString().split('^')[1];
    console.log("Correcao: "+ correcao);
    if(correcao.includes('�')) {
      token = "epsoft*";
      console.log("Corrigiu grupo: "+ token);
    }*/

    return http.get(`${urlAPI}/api/metaflash/getmetabygrupo/${token}/${ambiente}/${TOKEN_ACESSO_JSON}`);
  }

  postMetadado(objeto) {

    console.log('URL: ');
    console.log(`${urlAPI}/api/metaflash/postmeta/${ambiente}/${TOKEN_ACESSO_JSON}`);

    console.log('OBJ: ');
    console.log(objeto);

    return http.post(`${urlAPI}/api/metaflash/postmeta/${ambiente}/${TOKEN_ACESSO_JSON}`, objeto);
  }

  putMetadado(metadadoAntigo, objeto) {

    return http.put(`${urlAPI}/api/metaflash/updatepormetadado/${metadadoAntigo}/${ambiente}/${TOKEN_ACESSO_JSON}`, objeto);
  }

  deleteMetadado(objeto) {

    return http.put(`${urlAPI}/api/metaflashflash/deletepormetadado/${ambiente}/${TOKEN_ACESSO_JSON}`, objeto);
  }

  //pastas sensiveis
  postPastasSensiveis(objeto) {

    let token = Buffer.from(TOKEN_ACESSO_JSON, "base64").toString();

    let tokenGrupo = '';

    try {
      tokenGrupo = Buffer.from(TOKEN_ACESSO_JSON, "base64").toString();
      tokenGrupo = tokenGrupo.replaceAll('�', '');
      tokenGrupo = tokenGrupo.split('^')[1];

    } catch (erro) {
      console.log('Nao foi localizado chapeu na String');

    }

    try {
      //token = token.split('*')[0];
      //token = token.replace(/[^0-9]/g,'');

      console.log('MEU GRUPO: ' + tokenGrupo);

      let filtro = tokenGrupo.replace(/[0-9]/g, '');
      filtro = filtro.replaceAll(' ', '');

      tokenGrupo = filtro;

      console.log(`TOKEN: ${tokenGrupo}`);

      if (tokenGrupo.length === 1) {
        console.log('GRUPO MODIFICADO!!');
        tokenGrupo = "epsoft*";
      }

      if (tokenGrupo.length === 2) {
        console.log('GRUPO MODIFICADO!!');
        tokenGrupo = "epsoft*";
      }

      /*let trava = false;

      for(let i = 0; i < token.length; i++) {
        if(token.charAt(i) === '*') {
          token = token.split('*')[0];

          trava = true;

        }

      }

      if(trava) {
        token = token + '*';

        trava = false;

      }*/

      console.log(`Grupo DLP: ${tokenGrupo}`);

    } catch (erro) {
      console.log('Nao foi localizado * na String');

    }

    try {

      var str = Buffer.from(TOKEN_ACESSO_JSON, "base64").toString().split('^')[1];

      if (str.includes("m2g*")) {
        console.log(str.includes("m2g*"));
        tokenGrupo = Buffer.from(TOKEN_ACESSO_JSON, "base64").toString().split('^')[1];
        tokenGrupo = tokenGrupo.replaceAll('�', '');
        tokenGrupo = "m2g*";
      }

    } catch (erro) {
      console.log('Nao foi localizado chapeu na String');
      //alert('OCORREU UM ERRO COM O CARREGAMENTO DO SEU GRUPO DLP, VERIFIQUE COM O SUPORTE!');

    }

    let param = {
      "nome_pasta": objeto.pasta,
      "usuario_dpo": token.split('-')[0],
      "data_atualizacao": new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + " " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds(),
      "obs": null,
      "maquina": objeto.arrayUsuarios,
      "grupo_dlp": tokenGrupo
    }
    console.log("MAQUINA")
    console.log(objeto.maquina)
    //return http.post(`/sql/updateSql/${TOKEN_ACESSO_JSON}/resp_rest`, param);
    return apiJson.post(`${urlAPI}/api/pastasflash/postpastas/${ambiente}/${TOKEN_ACESSO_JSON}`, param);
    //return apiJson.post(`${urlAPI}/api/dispositivos/updatestatuspen/${this.pesquisa}/${ambiente}/${TOKEN_ACESSO_JSON}`, param);
  }

  putPastasSensiveis(objeto, id) {
    console.log('ENDPOINST PUT');

    let token = Buffer.from(TOKEN_ACESSO_JSON, "base64").toString();

    let tokenGrupo = '';

    try {
      tokenGrupo = Buffer.from(TOKEN_ACESSO_JSON, "base64").toString();
      tokenGrupo = tokenGrupo.replaceAll('�', '');
      tokenGrupo = tokenGrupo.split('^')[1];

    } catch (erro) {
      console.log('Nao foi localizado chapeu na String');

    }

    try {
      //token = token.split('*')[0];
      //token = token.replace(/[^0-9]/g,'');

      console.log('MEU GRUPO: ' + tokenGrupo);

      let filtro = tokenGrupo.replace(/[0-9]/g, '');
      filtro = filtro.replaceAll(' ', '');

      tokenGrupo = filtro;

      console.log(`TOKEN: ${tokenGrupo}`);

      if (tokenGrupo.length === 1) {
        console.log('GRUPO MODIFICADO!!');
        tokenGrupo = "epsoft*";
      }

      if (tokenGrupo.length === 2) {
        console.log('GRUPO MODIFICADO!!');
        tokenGrupo = "epsoft*";
      }

      /*let trava = false;

      for(let i = 0; i < token.length; i++) {
        if(token.charAt(i) === '*') {
          token = token.split('*')[0];

          trava = true;

        }

      }

      if(trava) {
        token = token + '*';

        trava = false;

      }*/

      console.log(`Grupo DLP: ${tokenGrupo}`);

    } catch (erro) {
      console.log('Nao foi localizado * na String');

    }

    try {

      var str = Buffer.from(TOKEN_ACESSO_JSON, "base64").toString().split('^')[1];

      if (str.includes("m2g*")) {
        console.log(str.includes("m2g*"));
        tokenGrupo = Buffer.from(TOKEN_ACESSO_JSON, "base64").toString().split('^')[1];
        tokenGrupo = tokenGrupo.replaceAll('�', '');
        tokenGrupo = "m2g*";
      }

    } catch (erro) {
      console.log('Nao foi localizado chapeu na String');
      //alert('OCORREU UM ERRO COM O CARREGAMENTO DO SEU GRUPO DLP, VERIFIQUE COM O SUPORTE!');

    }

    let param = {
      "nome_pasta": objeto.pasta,
      "usuario_dpo": token.split('-')[0],
      "data_atualizacao": new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + " " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds(),
      "obs": "teste",
      "maquina": objeto.arrayUsuarios,
      "grupo_dlp": tokenGrupo
    }

    console.log(`ID: ${id} | OBJETO A SER ENVIADO: `);
    console.log(param);

    return apiJson.put(`${urlAPI}/api/pastasflash/updatepastas/${id}/${ambiente}/${TOKEN_ACESSO_JSON}`, param);
  }

  getPastasSensiveis() {

    return http.get(`${urlAPI}/api/<endpoint>/${ambiente}/${TOKEN_ACESSO_JSON}`);
  }

  getPastasSensiveisByNomeMaquina(dpo) {
    /*let param = {
      "tabela":"pastas_sensiveis",
      "select": "usuario_dpo='"+ dpo +"'",
      "pagina": "1",
      "qt": "100",
      "campos_select_end_point":"id^nome_pasta"
    }

    console.log('MINHA PESQUISA: ');
    console.log(param);*/

    return apiJson.get(`${urlAPI}/api/pastasflash/getpastasbyuser/${dpo}/${ambiente}/${TOKEN_ACESSO_JSON}`);
    //return http.post(`/sql/selectSql/${TOKEN_ACESSO_JSON}/resp_rest`, param);
  }

  getPortas(ambiente_end) {

    return apiJson.get(`${urlAPI}/api/ambfront/getambfrontamb/${ambiente_end}/${TOKEN_ACESSO_JSON}`);
  }

  putAtualizaSenha(objeto) {

    let token = Buffer.from(TOKEN_ACESSO_JSON, "base64").toString()

    let tokenGrupo = '';

    try {
      tokenGrupo = Buffer.from(TOKEN_ACESSO_JSON, "base64").toString();
      tokenGrupo = tokenGrupo.replaceAll('�', '');
      tokenGrupo = tokenGrupo.split('^')[1];

    } catch (erro) {
      console.log('Nao foi localizado chapeu na String');

    }

    try {
      //token = token.split('*')[0];
      //token = token.replace(/[^0-9]/g,'');

      console.log('MEU GRUPO: ' + tokenGrupo);

      let filtro = tokenGrupo.replace(/[0-9]/g, '');
      filtro = filtro.replaceAll(' ', '');

      tokenGrupo = filtro;

      console.log(`TOKEN: ${tokenGrupo}`);

      if (tokenGrupo.length === 1) {
        console.log('GRUPO MODIFICADO!!');
        tokenGrupo = "epsoft*";
      }

      if (tokenGrupo.length === 2) {
        console.log('GRUPO MODIFICADO!!');
        tokenGrupo = "epsoft*";
      }

      /*let trava = false;

      for(let i = 0; i < token.length; i++) {
        if(token.charAt(i) === '*') {
          token = token.split('*')[0];

          trava = true;

        }

      }

      if(trava) {
        token = token + '*';

        trava = false;

      }*/

      console.log(`Grupo DLP: ${tokenGrupo}`);

    } catch (erro) {
      console.log('Nao foi localizado * na String');

    }

    try {

      var str = Buffer.from(TOKEN_ACESSO_JSON, "base64").toString().split('^')[1];

      if (str.includes("m2g*")) {
        console.log(str.includes("m2g*"));
        tokenGrupo = Buffer.from(TOKEN_ACESSO_JSON, "base64").toString().split('^')[1];
        tokenGrupo = tokenGrupo.replaceAll('�', '');
        tokenGrupo = "m2g*";
      }

    } catch (erro) {
      console.log('Nao foi localizado chapeu na String');
      //alert('OCORREU UM ERRO COM O CARREGAMENTO DO SEU GRUPO DLP, VERIFIQUE COM O SUPORTE!');

    }

    const obj = {
      "usuario_dpo": token.split('-')[0],
      "password": objeto.password,
      "data_atualizacao": new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + " " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds(),
      "grupo_dlp": tokenGrupo
    }

    console.log(obj);

    return apiJson.put(`${urlAPI}/api/senhapflash/updatesenhapasta/${objeto.id}/${ambiente}/${TOKEN_ACESSO_JSON}`, obj);
  }

  getSenhaAntiga() {
    let token = Buffer.from(TOKEN_ACESSO_JSON, "base64").toString();

    /*
    let param = {
      "tabela":"pastas_pass",
      "select": "usuario_dpo='"+ token.split('-')[0] +"'",
      "pagina": "1",
      "qt": "100",
      "campos_select_end_point":"id^password"
    }

    console.log('MINHA PESQUISA: ');
    console.log(param);
    */

    return apiJson.get(`${urlAPI}/api/senhapflash/getsenhapastabyuser/${token.split('-')[0]}/${ambiente}/${TOKEN_ACESSO_JSON}`);
    //return apiJson.get(`${urlAPI}/api/senhapflash/getsenhapastabyuser/${TOKEN_ACESSO_JSON}/${ambiente}/${token}`);
    //return http.post(`/sql/selectSql/${TOKEN_ACESSO_JSON}/resp_rest`, param);
  }

  liberaPasta(objeto) {
    return http.post(`/palavras/liberaPasta/${TOKEN_ACESSO_JSON}/resp_rest`, objeto);
  }

  /* VERIFICA QUAL MAQUINA ESTA ATIVA CASO EXISTA MAQUINAS DUPLICADAS NO BANCO DE DADOS */
  getVerificaMaquinaAtiva() {

    return http.get(`/maquinas/listaSecret/${TOKEN_ACESSO_JSON}/resp_rest`);
  }

  getCrudCfg(body) {
    return http.post(`/cfgs/crudCfg/${TOKEN_ACESSO_JSON}/resp_rest `, body);
  }

  getExecutavel(body) {
    return http.post(`/cfgs/pegaExecutaveis/${TOKEN_ACESSO_JSON}/resp_rest `, body);
  }

  postGrupoDLP(body) {
    return http.post(`/cfgs/postGrupoDlp/${TOKEN_ACESSO_JSON}/resp_rest `, body);
  }

  getGruposDLP(body) {
    return http.post(`/cfgs/getGruposDlp/${TOKEN_ACESSO_JSON}/resp_rest `, body);
  }

  getGrupoBasico() {
    try {
      let grupoBasico = Buffer.from(TOKEN_ACESSO_JSON, "base64").toString();
      grupoBasico = grupoBasico.split('^')[1];
      grupoBasico = grupoBasico.split('_')[0].replace('*', '');

      return grupoBasico;

    } catch (erro) {
      console.error('Erro na obtenção do grupo do token');
      console.log(erro);
    }
  };

  uploadSensiveis(formData, grupoDlp) {

    return apiJson.post(`${urlAPI}/api/upload/arquivo/${grupoDlp}/${TOKEN_ACESSO_JSON}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

  trocaGrupo(body) {
    return http.post(`/cfgs/trocaGrupo/${TOKEN_ACESSO_JSON}/resp_rest `, body);
    //return http.post(`${urlAPI}/api/trocagrupo/${TOKEN_ACESSO_JSON} `, body);
  };

  sendSensiveis(body) {
    return http.post(`/cfgs/sendSensiveis/${TOKEN_ACESSO_JSON}/resp_rest `, body);

    /*     body{
          "ambiente": "AWSSERVERDEV",
          "grupo_dlp": "epsoft_starck",
          "arquivo": "D:/Homologacao-8091-8088/j/users/dlp/publico/palavrasSensiveis/Template Cadastramento Expressões Sensíveis -epsoft_starck.csv"
        } */
  };

  uploadAws(ambiente , grupoDlp) {
    return http.post(`${urlAPI}/api/uploadaws/${ambiente}/${grupoDlp}`);
  };

};

export default new DlpController();