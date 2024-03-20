import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import bsCustomFileInput from 'bs-custom-file-input';
import DlpController from './controller/DlpController';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';

import './css/style.css';

import http from "./http/http.js";

/* CONFIGURACAO DE TABELA */
const columns = [{
  dataField: 'metadado',
  text: 'Metadado',
  placeholder: 'Metadado',
  filter: textFilter()
}, {
  dataField: 'grupo_dlp',
  text: 'Grupo',
  placeholder: 'Grupo',
  filter: textFilter()
}, {
  dataField: 'dado',
  text: 'Dado',
  placeholder: 'Nome do dado',
  filter: textFilter()
}];

export class BasicElements extends Component {
  
  /* ================== */
  /* === CONSTRUTOR === */
  /* ================== */
  
  constructor() {
    super();

    /* ============================= */
    /* === VARIAVEIS DE AMBIENTE === */
    /* ============================= */
    
    this.state = {
      startDate: new Date(),
      pessoas: [],
      nome: '',
      arrayDlp: [],
      comprimentoJ3: 0,
      enviarJson: false,
      arrayParaEnvioAoServidor: [],

      grupoAntigo: '',
      metadadoAntigo: '',
      dadoAntigo: '',

      memoriaMetadado: [],
  
      /* INFORMACOES DA MAQUINA */
      grupo_dlp: '',
      computer_name: '',
      maquina: '',

      token: '',
      url: '',

      alerta: '',

      /* ARRAY DE GRUPOS CARREGADOS */
      gruposDlps: [],

      /* CONFIGURACAO METADADO */
      dado: '',
      metadado: '',

      /* SELECIONA UM ITEM */
      selecao: [],

      /* CARREGA ARRAY DE MAQUINAS */
      dadosFiltrados: [],
      todosDadosArrayDlp: [],
      objetosFiltrados:[],
      todosDadosArrayDlpEmailAutomatico: [],
  
    };

    this.findAllGrupoDlpDefault();

    /* SEMPRE QUE O COMPONENT E CHAMADO ESSE METODO E INSTANCIADO AUTOMATICAMENTE */
    this.verificarPrivilegio();

    /* TRAZ TODOS OS DADOS DA BASE DE DADOS */
    this.findAllByComputadores();

    /* FILTRA OS DADOS RETORNANDOS DO ARRAY */
    this.findAllMetadados();

  }

  /* ================================ */
  /* OBSERVADORES INFORMACOES MAQUINA */
  /* ================================ */

  handleChangeGrupo_Dlp = event => {
    this.setState({ grupo_dlp: event.target.value });
  }

  handleChangeGrupoDlp = event => {
    this.setState({ grupoDlp: event.target.value });

  }

  /* === OBSERVADOR METADADO === */
  handleMetadado= event => {
    this.setState({ metadado: event.target.value });
  }

  /* === OBSERVADOR DADO === */
  handleDado = event => {
    this.setState({ dado: event.target.value });
  }

  /* ==================================== */
  /* === FIM DOS OBSERVADORES DO JSON === */
  /* ==================================== */

  /* ATUALIZA O USUARIO - ESSE METODO NAO SERA UTILIZADO */
  handleSubmitPutComputador = event => {
    event.preventDefault();

    const computador = {
      metadado: this.state.metadado,
      dado: this.state.dado,
      grupo_dlp: this.state.grupoDlp
    };

    console.log('OBJ PARA ENVIO: ');
    console.log(computador);

    this.putComputador(computador);

  };

  /* ================== */
  /* === METODO GET === */
  /* ================== */
  findAllGrupoDlpDefault = async () => {
    DlpController.getAllGrupoDlpByToken()
    .then(response => {

      let gruposSalvos = [];

      for(let i = 0; i < response.data.length; i++) {
        gruposSalvos.push(response.data[i].grupo);
      }

      this.setState({
        gruposDlps: gruposSalvos
      });

      console.log('GRUPOS BUSCADOS: ');
      console.log(this.state.gruposDlps);

    });
  }

  /* CARREGA AS MAQUINAS DO GRUPO DLP ESPECIFICADO */
  findAllMetadados = async () => {

    /* ENVIA O OBJETO DE PESQUISA PARA O BANCO DE DADOS */
    //DlpController.getMetadados('epsoft')
    DlpController.getMetadados()
      .then(response => {
        console.log('DADOS RETORNADOS: ');
        console.log(response.data)

        let arrayMemoria = [];
        let arrayMemoriaEmail = [];

        let token = '';

        try {
          token = Buffer.from(DlpController.capituraToken(), "base64").toString();
          token = token.replaceAll('�','');
          token = token.split('^')[1];

        }catch(erro) {
          console.log('Nao foi localizado chapeu na String');

        }
        
        try {

          console.log('MEU GRUPO: '+ token);

          let filtro = token.replace(/[0-9]/g,'');
          filtro = filtro.replaceAll(' ','');

          token = filtro;

          console.log(`TOKEN: ${token}`);

          if(token.length === 1) {
            console.log('GRUPO MODIFICADO!!');
            token = "epsoft*";
          }

          if(token.length === 2) {
            console.log('GRUPO MODIFICADO!!');
            token = "epsoft*";
          }

          token = token.replace('*','');
          console.log(`Grupo DLP: ${token}`);

        }catch(erro) {
          console.log('Nao foi localizado * na String');

        }

        response.data.map(item => {
          // SMS DESTS
          if(item.metadado.includes('sms dests serio') || item.metadado.includes('sms dests grave') || item.metadado.includes('sms dests gravissimo') && token.includes(item.grupo_dlp)) {
            arrayMemoria.push(item);
          }

          // EMAIL AUTOMATICO
          if(item.metadado.includes('emailautomatico') && token.includes(item.grupo_dlp)) {
            arrayMemoriaEmail.push(item);
          }

        });

        this.setState({
          objetosFiltrados: arrayMemoria
        });

        this.setState({
          todosDadosArrayDlpEmailAutomatico: arrayMemoriaEmail
        });

        console.log('RETORNO OBJ <LIST METADADOS SMS>: ');
        console.log(this.state.objetosFiltrados);

        console.log('RETORNO OBJ <LIST METADADOS EMAIL>: ');
        console.log(this.state.todosDadosArrayDlpEmailAutomatico);

      });

  }

  /* CARREGA AS MAQUINAS DO GRUPO DLP ESPECIFICADO */
  findAllByComputadores = async () => {

    /* ENVIA O OBJETO DE PESQUISA PARA O BANCO DE DADOS */
    //DlpController.getMetadados('epsoft')
    DlpController.getMetadados()
      .then(response => {
        console.log('DADOS RETORNADOS: ');
        console.log(response.data)

        this.setState({
          todosDadosArrayDlp: response.data
        });

        console.log("Array coletado");
        console.log(this.state.todosDadosArrayDlp);
        console.log(this.state.todosDadosArrayDlp.length);

        let variavelAuxiliar = [];

        let token = '';

        try {
          token = Buffer.from(DlpController.capituraToken(), "base64").toString();
          token = token.replaceAll('�','');
          token = token.split('^')[1];

        }catch(erro) {
          console.log('Nao foi localizado chapeu na String');

        }
        
        try {

          console.log('MEU GRUPO: '+ token);

          let filtro = token.replace(/[0-9]/g,'');
          filtro = filtro.replaceAll(' ','');

          token = filtro;

          console.log(`TOKEN: ${token}`);

          if(token.length === 1) {
            console.log('GRUPO MODIFICADO!!');
            token = "epsoft*";
          }

          if(token.length === 2) {
            console.log('GRUPO MODIFICADO!!');
            token = "epsoft*";
          }

          token = token.replace('*','');
          console.log(`Grupo DLP: ${token}`);

        }catch(erro) {
          console.log('Nao foi localizado * na String');

        }

        for(let i = 0; i < this.state.todosDadosArrayDlp.length; i++) {
          
          if(!this.state.todosDadosArrayDlp[i].metadado.includes('sms dests serio') && !this.state.todosDadosArrayDlp[i].metadado.includes('sms dests grave') && !this.state.todosDadosArrayDlp[i].metadado.includes('sms dests gravissimo') && token.includes(this.state.todosDadosArrayDlp[i].grupo_dlp)) {
            
            console.log('IF CONDICAO: ');
            console.log("sms dests serio: "+ this.state.todosDadosArrayDlp[i].metadado.includes('sms dests serio'));
            console.log("sms dests grave: "+ this.state.todosDadosArrayDlp[i].metadado.includes('sms dests grave'));
            console.log("sms dests gravissimo: "+ this.state.todosDadosArrayDlp[i].metadado.includes('sms dests gravissimo'));

            let obj = {
              metadado: this.state.todosDadosArrayDlp[i].metadado, 
              dado: this.state.todosDadosArrayDlp[i].dado, 
              grupo_dlp: this.state.todosDadosArrayDlp[i].grupo_dlp, 
              filter: textFilter()
            }

            variavelAuxiliar.push(obj);
          
          }

        }
        
        console.log('ARRAY FILTRADO COM OS DADOS DE SMS: ');
        console.log(variavelAuxiliar);

        this.setState({ dadosFiltrados: variavelAuxiliar });

      });

  }

  /* METODO RESPONSAVEL POR TRAZER OS DADOS DO JSON DEFAULT LOGADO */
  findByJsonDefault = async (objeto) => {
    console.log(objeto.metadado);

    this.converterJSON(objeto);

    this.state.metadadoAntigo = objeto.metadado;
    this.state.dadoAntigo = objeto.dado;

    console.log(this.state.dadoAntigo);

  } 

  /* ================== */
  /* === METODO PUT === */
  /* ================== */

  /* ENVIA TODOS OS DADOS ATUALIZADOS DO JSON INCLUINDO (J1, J2 E J3) */
  putComputador = async(putDados) => {

    if(putDados.metadado !== '' && putDados.dado !== '') {

      console.log('PUT PARA ATUALIZAR: ');
      console.log(putDados);

      if(putDados.metadado.includes('email')) {

        DlpController.putMetadado(this.state.metadadoAntigo, putDados)
          .then(response => {

            console.log(response);

            this.state.todosDadosArrayDlpEmailAutomatico.map(item => {
          
              if(item.dado.includes(this.state.dadoAntigo)) {
                
                item.dado = item.dado.replaceAll(`${this.state.dadoAntigo}`, `${putDados.dado}`);
      
                DlpController.putMetadado(item.metadado, item)
                  .then(response => console.log(response));
      
              }
      
            });

          });

      }else {

        DlpController.putMetadado(this.state.metadadoAntigo, putDados)
          .then(response => {

            this.state.objetosFiltrados.map(item => {
          
              if(item.dado.includes(this.state.metadadoAntigo)) {
                
                item.dado = item.dado.replaceAll(`<<${this.state.metadadoAntigo}>>`, `<<${putDados.metadado}>>`);
    
                DlpController.putMetadado(item.metadado, item)
                  .then(response => console.log(response));
    
              }
      
            });

          });

      }

      this.state.token = DlpController.capituraToken();

      var tokenAcesso = this.state.token;

      setTimeout(function() {
        //window.location.href = `http://54.207.116.254:3000/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
        //window.location.href = `https://app.flashsafe.com:3003/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
        //window.location.href = `https://app.flashsafe.com:3001/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
        //window.location.href = `https://app.flashsafe.com:3000/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
        //window.location.href = `https://app.flashsafe.com:3007/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
        //window.location.href = `http://m2g.com.br:3000/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
        //window.location.href = `https://app.flashsafe.com:3006/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
        //window.location.href = `https://app.flashsafe.com:3009/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
        //window.location.href = `http://54.207.116.254:3000/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
        //window.location.href = `http://localhost:3000/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
        window.location.href = `${DlpController.ambienteRedirecionamentoReact()}/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
        
      }, 2000);

    }else {
      alert('PREENCHA OS CAMPOS CORRETAMENTE!!');
      
    }

  }

  /* ===================== */
  /* === METODO DELETE === */
  /* ===================== */

  componentDidMount() {
    bsCustomFileInput.init()
  }

  /* ================================================ */
  /* === DESCRIPTOGRAFA O JSON OBTIDO DA RESPOSTA === */
  /* ================================================ */

  converterJSON = async (obj) => {

    const computador = {
      metadado: obj.metadado,
      dado: obj.dado,
      grupo_dlp: obj.grupo_dlp
    };

    this.state.metadado = obj.metadado
    this.state.dado = obj.dado
    this.state.grupo_dlp = obj.grupo_dlp;
    this.state.grupoDlp = obj.grupo_dlp;
    
    /* ATRIBUI OS DADOS DESCRIPTOGRAFADOS AO ARRAY NOVAMENTE PARA QUE POSSA SER MANIPULADO */
    this.setState({
      arrayDlp: computador

    });

  }

  /* ================================= */
  /* VERIFICA PERMISSAO DE USUARIO (*) */
  /* ================================= */
  verificarPrivilegio = async () => {

    /* CAPTURA O TOKEN POR MEIO DO METODO CONTROLLER QUE TRAZ DO AXIOS O TOKEN DO USUARIO CADASTRADO */
    let tokenUsuario = DlpController.capituraToken();

    /* DESCRIPTOGRAFA O TOKEN */
    let base64ToString = '';

    try {
      base64ToString = Buffer.from(tokenUsuario, "base64").toString();

    }catch(erro) {
      console.log('VOCÊ ESTA SEM TOKEN, FAÇA LOGIN NOVAMENTE');

      window.location.href = DlpController.ambienteRedirecionamento();

    }
    
    /* NAVEGA NA STRING DO TOKEN */
    for(let i = 0; i < base64ToString.length; i++) {
      /* VERIFICA SE NA POSICAO ATUAL SE TRATA DE UM *, CASO SEJA RETORNA O VALOR TRUE PARA REALIZAR A LIBERACAO TOTAL AS CONFIGURACOES */
      if(String(base64ToString[i]) == "*") {
        console.log("Contem *");

      }
    }

  }

  semAcesso = async () => {
    window.document.querySelector('.privilegio').setAttribute('style','display: block !important;');

  }

  /* ====================================== */
  /* === MOSTRAR ADICIONAR NOVO ITEM L3 === */
  /* ====================================== */
  mostrarAdicionar = async () => {
    if(this.state.selecao.length > 0) {
      window.document.querySelector('.adicionar').setAttribute('style', 'display: block !important;');
      
      this.findByJsonDefault(this.state.selecao);

    }else {
      alert('Você precisa adicionar pelo menos uma maquina para o envio em massa');

    }

  }

  /* ==================== */
  /* === DELETAR ITEM === */
  /* ==================== */
  deletarItem = async () => {
    console.log('ITEM A SER DELETADO');
    console.log(this.state.memoriaMetadado);

    const objeto = {
      "metadado" : this.state.memoriaMetadado.metadado
    }

    console.log(JSON.stringify(objeto));

    DlpController.deleteMetadado(this.state.memoriaMetadado)
      .then(response => {

        console.log(response);

        if(this.state.memoriaMetadado.metadado.includes('email')) {

          this.state.todosDadosArrayDlpEmailAutomatico.map(item => {

            if(item.dado.includes(this.state.memoriaMetadado.dado)) {
    
              if(item.dado.split(',').length > 1) {
                item.dado = item.dado.replaceAll(`,${this.state.memoriaMetadado.dado}`, '');
    
              }else {
                item.dado = item.dado.replaceAll(`${this.state.memoriaMetadado.dado}`, '');
                
              }
    
              DlpController.putMetadado(item.metadado, item)
              .then(response => console.log(response));
            }
    
          });
  
        }else {

          this.state.objetosFiltrados.map(item => {
          
            if(item.dado.includes(this.state.memoriaMetadado.metadado)) {
              if(item.dado.split(',').length > 1) {
                item.dado = item.dado.replaceAll(`,<<${this.state.memoriaMetadado.metadado}>>`, '');
    
              }else {
                item.dado = item.dado.replaceAll(`<<${this.state.memoriaMetadado.metadado}>>`, '');
                
              }

              DlpController.putMetadado(item.metadado, item)
              .then(response => console.log(response));
            }
    
          });

        }

      })
      .catch(erro => console.log(erro));

      console.log('ARRAY ATUALIZADO DELETE');
      console.log(this.state.objetosFiltrados);

    this.state.token = DlpController.capituraToken();

    var tokenAcesso = this.state.token;
      
    setTimeout(function() {
      //window.location.href = `http://54.207.116.254:3000/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
      //window.location.href = `https://app.flashsafe.com:3003/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
      //window.location.href = `https://app.flashsafe.com:3001/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
      //window.location.href = `https://app.flashsafe.com:3000/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
      //window.location.href = `https://app.flashsafe.com:3007/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
      //window.location.href = `http://m2g.com.br:3000/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
      //window.location.href = `https://app.flashsafe.com:3006/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
      //window.location.href = `https://app.flashsafe.com:3009/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
      //window.location.href = `http://54.207.116.254:3000/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
      //window.location.href = `http://localhost:3000/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
      window.location.href = `${DlpController.ambienteRedirecionamentoReact()}/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;

    }, 2000);
  
  }

  ajustaJSONparaDelecao = async (obj) => {

    /* GARANTE QUE NAO TERA BARRAS A MAIS SENSO ENVIADAS AO BANCO */
    try{
      obj.base64_j2.pastasSensiveis = obj.base64_j2.pastasSensiveis.replaceAll('\\\\','\\');
    
    }catch(e) {
      
    }

    /* CRIPTOGRAFA JSON */
    var jsonJ1 = JSON.stringify( obj.base64_j1 );
    var converterParaBase64J1 =  jsonJ1;
    obj.base64_j1 = converterParaBase64J1;

    var jsonJ3 = JSON.stringify( obj.base64_j3 );

    for(let j = 0; j < jsonJ3.length; j++) {
      jsonJ3 = jsonJ3.replace("[", "");
      jsonJ3 = jsonJ3.replace("]", "");

    }

    var converterParaBase64J3 =  jsonJ3;
    obj.base64_j3 = converterParaBase64J3;

    let memoriaObjetoEnvio = JSON.stringify(obj);
    memoriaObjetoEnvio = memoriaObjetoEnvio.replace('{"base64_j1":"', '');
    memoriaObjetoEnvio = memoriaObjetoEnvio.replace('"base64_j3":"', '');
    memoriaObjetoEnvio = memoriaObjetoEnvio.replace('}"}', '}');
    memoriaObjetoEnvio = memoriaObjetoEnvio.replace('}",', '},');
    memoriaObjetoEnvio = memoriaObjetoEnvio.replace('"""', '"');

    memoriaObjetoEnvio = "["+ memoriaObjetoEnvio +"]";

    console.log('ENVIO PARA O DELETE: ');
    console.log(memoriaObjetoEnvio);

    try {
      memoriaObjetoEnvio = memoriaObjetoEnvio.replaceAll('\\', '');

    }catch(erro){}

    const objetoEnvio = {
      "maquina": this.state.dadosFiltrados[0].maquina,
      "hash_maquina": null,
      "computer_name": null,
      "grupo_dlp": this.state.grupoDlp,
      "json": memoriaObjetoEnvio,
      "cksum": this.state.dadosFiltrados[0].cksum,
      "data_atualizacao": this.state.dadosFiltrados[0].data_atualizacao
    }

    console.log('OBJ ENVIO (DELETE): ');
    console.log(objetoEnvio);

    this.state.arrayParaEnvioAoServidor.forEach((dado,i) => {
      
      setTimeout(
          function(){
            console.log('Timer contador!!');
            console.log('Posicao: '+ i); 
            console.log(dado); 
          }
      , (i * 500) + 500);
    
    });

  }

  /* ======================================= */
  /* === ESCONDER ADICIONAR NOVO ITEM L3 === */
  /* ======================================= */
  esconderAdicionar = async () => {
    window.document.querySelector('.adicionar').setAttribute('style', 'display: none !important;');

  }

  /* ================================= */
  /* === MOSTRAR ATUALIZAR ITEM L3 === */
  /* ================================= */
  mostrarAtualizar = async () => {
    window.document.querySelector('.modal').setAttribute('style', 'display: block !important;');
    window.document.querySelector('.modal-backdrop').setAttribute('style', 'display: block !important;');

  }

  /* ======================================= */
  /* === ESCONDER ADICIONAR NOVO ITEM L3 === */
  /* ======================================= */
  esconderAtualizar = async () => {
    window.document.querySelector('.modal').setAttribute('style', 'display: none !important;');
    window.document.querySelector('.modal-backdrop').setAttribute('style', 'display: none !important;');

  }

  /* ====================================== */
  /* === ENVIAR DADOS PARA CRIPTOGRAFAR === */
  /* ====================================== */
  enviarDadosAoServidor = async () => {
    this.setState({enviarJson: true});

  }

  /* ========================= */
  /* === ICONE DE PESQUISA === */
  /* ========================= */
  carregadandoPesquisa = async () => {
    window.document.querySelector('.buttonload').setAttribute('style', 'display: block !important;');
    window.document.querySelector('.carregando').setAttribute('style', 'display: block !important;');
    
    setTimeout(function(){  
      window.document.querySelector('.pesquisando').disabled = true;
      
    }, 100);

    setTimeout(function(){  
      window.document.querySelector('.buttonload').setAttribute('style', 'display: none !important;');
      window.document.querySelector('.carregando').setAttribute('style', 'display: none !important;');
      window.document.querySelector('.pesquisando').disabled = false;
      
    }, 1000);

  }

  /* =================================== */
  /* === CONFIGURACAO MOSTRAR ALETAS === */
  /* =================================== */
  mostrarAlerta = async (mensagem) => {
    window.document.querySelector('.alerta').setAttribute('style', 'display: block !important;');

    this.state.alerta = mensagem;

  }

  /* =================================== */
  /* === CONFIGURACAO OCULTAR ALETAS === */
  /* =================================== */
  ocultarAlerta = async () => {
    window.document.querySelector('.alerta').setAttribute('style', 'display: none !important;');

    this.state.alerta = '';

  }

  /* ===================== */
  /* === AJUSTA INPUTS === */
  /* ===================== */
  ajustaInputs = async () => {
    /* DEIXAR OS BOTOES COM PADRAO HABILITADO */
    window.document.getElementById('controle-executavel').disabled = false;
    window.document.getElementById('controle-filtro').disabled = false;

  }

  /* =================================== */
  /* === ESTRUTURA SWITCH === */
  /* =================================== */
  handleOnSelect = (row, isSelect) => {
    window.document.querySelector('.adicionar').setAttribute('style', 'display: block !important;');
    
    this.findByJsonDefault(row);

    this.state.memoriaMetadado = row;
    
    if (isSelect) {
      this.setState(() => ({
        selecao: [...this.state.selecao, row.cksum]
      }));
    } else {
      this.setState(() => ({
        selecao: this.state.selecao.filter(x => x !== row.cksum)
      }));
    }

  }

  handleOnSelectAll = (isSelect, rows) => {
    const ids = rows.map(r => r.cksum);
    if (isSelect) {
      this.setState(() => ({
        selecao: ids
      }));
    } else {
      this.setState(() => ({
        selecao: []
      }));
    }

  }

  render() {
    const selectRow = {
      mode: 'button',
      clickToSelect: true,
      selecao: this.state.selecao,
      onSelect: this.handleOnSelect,
      onSelectAll: this.handleOnSelectAll,
    };
    return (
      <div>
        <div className="row">

          <div className="col-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <BootstrapTable keyField='metadado' data={ this.state.dadosFiltrados } columns={ columns } selectRow={ selectRow } filter={ filterFactory() } pagination={ paginationFactory() } />
              </div>
            </div>
          </div>

        </div>

        <div className="row adicionar" id="adicionarAncoramento">

          <div className="col-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">

                {/* ENVIANDO ITENS PADROES PARA DIVERSAS MAQUINAS */}
                <form className="row mt-3 ajuste-form" onSubmit={this.handleSubmitPutComputador} >

                  <p className="card-description"> Configuração Metadado </p>
                  <div className="row col-md-12 inputs">
                    <div className="col-md-12">
                      Metadado:
                      <Form.Group className="row">
                        <div className="col-sm-12">
                        <Form.Control type="text" value={this.state.metadado} onChange={this.handleMetadado} />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-12">
                      Dado:
                      <Form.Group className="row">
                        <div className="col-sm-12">
                        <Form.Control type="text" value={this.state.dado} onChange={this.handleDado} />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-12">
                      Grupo DLP:
                      <Form.Group className="row">
                        <div className="col-sm-12">
                          <select className="opcoes-select" name="estado" value={this.state.grupoDlp} onChange={this.handleChangeGrupoDlp} >
                          {this.state.gruposDlps.map(grupo => {
                              return (
                                <option value={grupo}>{grupo}</option>
                              )
                            })
                          }
                          </select>
                        </div>
                      </Form.Group>
                    </div>
                  </div>

                  <div className="botoes-acoes col-md-12">
                    <div className="botao-salvar-alteracoes" >
                      <button type="submit" onClick={ () => this.enviarDadosAoServidor() } > Atualizar </button>
                    </div>
                    <a href="#adicionarAncoramento" className="botao-salvar-alteracoes" >
                      <button type="button" onClick={ () => this.deletarItem() } >Deletar Item</button>
                    </a>
                  </div>

                </form>

              </div>
            </div>
          </div>

        </div>

      </div>
    )
  }
}

export default BasicElements
