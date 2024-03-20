import React, { Component, useState } from 'react';
import { Form } from 'react-bootstrap';
import bsCustomFileInput from 'bs-custom-file-input';
import DlpController from './controller/DlpController';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

import './css/style.css';
import { replaceAll } from 'chartist';

export class PastasSensiveis extends Component {

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
      enviarJson: false,
      nome: '',

      token: '',
      url: '',

      id: '',

      alerta: '',

      grupoDlp: '',

      /* CONFIGURACAO METADADO */
      dado: '',
      metadado: '',

      /* SELECIONA UM ITEM */
      selecao: [],

      /* CARREGA ARRAY DE MAQUINAS */
      dadosFiltrados: [],
      todosDadosArrayDlp: [],

      arrayDlp: [],

      arrayPastasSensiveis: [],
      arrayParaEnvioAoServidor: [],
      arrayPastas: [],
      array: [],
      maquinaDPO: '',

      pastaAtualizada: '',
      idPasta: 0,

      arrayNomeMaquinas: [],
      pastas: '',
      tempo: '',
      flags: '',
      maquinaSele: '',

      /* BASE x64 - J1 */
      titulosADesprezar: '',
      classesDebugar: '',
      jansFilhasMonitorar: '',
      ipCloud: '', //'54.207.237.19'
      portaCloud: '', //'8090'
      portaDlp: '', //'8085'
      conectivosExcluir: '',
      driveServer: '',
      cliAtual: '', //epsoft
      grupo_dlp: '',
      computer_name: '',
      hash_maquina: '',
      percentualCompacArquivos: '',
      origensAlarme: '',
      statusAlarme: '',
      tiposAlarme: '',
      extensoesSensiveis: '',
      codCliente: '',
      codigoMaquinaPorUsuario: '', //'0'
      codVBios: '',
      mapperAtivado: '',

      /* BASE x64 - J2 */
      anonimizaDadosRelatorios: '', //1
      ativaEmailAlmGraves: '', //1
      ativaEmailAlmGravissimos: '', //1
      ativaEmailAlmSerios: '', //1
      ativaSmsAlmGraves: '', //1
      ativaSmsAlmGravissimos: '', //1
      ativaSmsAlmSerios: '', //1
      desativaPrintScreen: '0',
      filmar_sempre: '0',
      monitoraDispExternos: '',
      quandoPegarDadosSensiveis: '0',
      imgBlockPrtSc: '',
      qtMinQualifsTab: '',
      qtMinQualifsDoc: '',
      maxQtFalsosNomes: '',
      qtPalsManterQualificador: '',
      QtMaxLinhasResult: '',
      tMinQualifsTab: '',
      comFonetizacao: '',
      notaCorteSerios: '',
      notaCorteGraves: '',
      notaCorteGravissimos: '',
      pastasSensiveis: '',
      tempoDragAndDrop: '',
      impressaoSpooler: '',

      /* BASE x64 - J3 */
      base64_j3: [],
      derruba_app: false,
      filma: false,
      impede_copia: false,
      json: '',
      monitora_dados: false,
      particular: false,
      print: false,
      registra_copia: false,
      tipo: '',
      filtro_titulo: '',
      executavel: '',
      impede_dados: false,

    };

    try{

      /* SEMPRE QUE O COMPONENT E CHAMADO ESSE METODO E INSTANCIADO AUTOMATICAMENTE */
      this.verificarPrivilegio();

      /* ARMAZENA MAQUINA DE DPO */
      this.verificaUsuarioDPO();

      this.findArrayPastas(Buffer.from(DlpController.capituraToken(), "base64").toString().split('-')[0]);
    
    }catch(erro) {
      console.log('VOCÊ ESTA SEM TOKEN, FAÇA LOGIN NOVAMENTE');

      window.location.href = DlpController.ambienteRedirecionamento();

    }

  }

  /* ================== */
  /* == OBSERVADORES == */
  /* ================== */
  handleChange = date => {
    this.setState({
      startDate: date
    });
  };

  handlePastas = event => {
    this.setState({ pastas: event.target.value });

  };

  handlePastaAtualizada = event => {
    this.setState({ pastaAtualizada: event.target.value });

  };

  handleChangeGrupoDlp = event => {
    this.setState({ grupoDlp: event.target.value });

  }

  /* ================================ */
  /* OBSERVADORES INFORMACOES MAQUINA */
  /* ================================ */

  handleChangeMaquinas = event => {
    this.setState({ maquinaSele: event.target.value });
    console.log(`Maquina Selecionada: ${this.state.maquinaSele}`);
    this.state.hash_maquina = event.target.value;

  }

  /* ===================================================================== */
  /* === ADICIONA UMA NOVA PASTA SENSIVEL AO ARRAY DE PASTAS SENSIVEIS === */
  /* ===================================================================== */
  handleSubmitPastasSensiveis = event => {
    event.preventDefault();

    /* CRIA O OBJETO COM OS NOVOS DADOS */
    const novoItem = {
      id: (this.state.arrayPastasSensiveis.length + 1),
      //maquinaDPO: this.state.maquinaDPO,
      pasta: this.state.pastas,
      //arrayUsuarios: this.state.maquinaSele
    };

    /* ENVIA O OBJETO PARA SER INSERIDO NO ARRAY NOVAMENTE */
    if (this.state.arrayPastasSensiveis.length < 4) {
      this.postPastasSensiveis(novoItem);
    }

    this.setState({ pastas: '' }); // ZERA A VARIAVEL DE MEMORIA

  }

  /* =================================================== */
  /* === ATUALIZA NO BANCO DE DADOS PASTAS SENSIVEIS === */
  /* =================================================== */
  handleSubmitEditaPastasSensiveis = event => {
    event.preventDefault();

    /* CRIA O OBJETO COM OS NOVOS DADOS */
    const itemAtualizado = {
      id: this.state.idPasta,
      //maquinaDPO: this.state.maquinaDPO,
      pasta: this.state.pastaAtualizada,
      //arrayUsuarios: this.state.maquinaSele,
    };

    console.log('OBJETO A SER ATUALIZADO (PUT): ');
    console.log(itemAtualizado);

    /* CHAMA O METODO PARA ATUALIZAR O ARRAY DE PASTAS SENSIVEIS */
    this.pullPastasSensiveis(itemAtualizado);

  }

  /* ======================================================= */
  /* === INSERE NO BANCO DE DADOS NOVAS PASTAS SENSIVEIS === */
  /* ======================================================= */
  handleSubmitFormulario = event => {
    event.preventDefault();

    let tratarDados = [];
    let trava = true;

    this.state.arrayPastasSensiveis.map(item => {

      try {
        /* AJUSTA QUALQUER INCONSISTENCIA NAS PASTAS SENSIVEIS */
        item.pasta = item.pasta.split('\\\\').join('\\');
        item.pasta = item.pasta.replace(/\\\\/g,"\\");

        if(!item.pasta.includes(":")) {
          trava = false;
        }
  
      }catch(err) {
        console.log('OCORREU UM ERRO NO AJUSTE DO SCAPE');
      }

      tratarDados.push(item.pasta.replaceAll('\\\\','\\'));

    });

    const objeto = {
      maquinaDPO: this.state.maquinaSele,
      pasta: tratarDados,
      arrayUsuarios: this.state.maquinaSele
    };

    console.log("agora vai")
    console.log(objeto);

    if((objeto.maquinaDPO !== null || objeto.maquinaDPO !== '') && objeto.pasta.length > 0 && (objeto.arrayUsuarios !== null || objeto.arrayUsuarios !== '') && trava) {
      //this.enviarDados(objeto);
      this.enviarDadosAPI(objeto);
    
    }else {
      alert('PREENCHA OS CAMPOS CORRETAMENTE');

    }

  };

  /* ============================================================================ */
  /* === METODO RESPONSAVEL POR CARREGAR OS DADOS DA PASTA SENSIVEL SELECIONA === */
  /* ============================================================================ */
  findByIndex = async (objeto) => {
    this.setState({ idPasta: objeto.id })
    this.setState({ pastaAtualizada: objeto.pasta });
  }

  /* =========================================================================================== */
  /* === CARREGA EM UM ARRAY TODAS AS PASTAS CADASTRADAS NO BANCO DE ACORDO COM O DPO LOGADO === */
  /* =========================================================================================== */
  findArrayPastas = async (maquina) => {
    DlpController.getPastasSensiveisByNomeMaquina(maquina)
      .then(response => {
        try {
          console.log(response.data);

          let auxiliar = response.data;

          let meuObjeto = [];

          console.log('AUXILIAR: ')
          console.log(auxiliar)

          if(auxiliar.length > 0) {
            auxiliar.map(item => {
              let pasta = [];
              pasta = item.nome_pasta.replaceAll('\\\\','\\').split(',');

              console.log(pasta);

              this.state.id = item.id;

              console.log('ID: '+ this.state.id);

              pasta.map(p => {
                console.log(p);

                let obj = {
                  id: (meuObjeto.length + 1),
                  pasta: p
                }

                console.log(obj);
    
                meuObjeto.push(obj);

              });

            });

            console.log('MEU OBJETO');
            console.log(meuObjeto);

            this.setState({ arrayPastas: meuObjeto });
            this.setState({ arrayPastasSensiveis: meuObjeto });

            console.log('PASTAS RETORNADAS: ');
            console.log(this.state.arrayPastasSensiveis);

          }

          /*
          let auxiliar = JSON.stringify(response.data[0]).replace('{"nome_pasta":','').replace('}','').replaceAll('"','').split(',');

          let meuObjeto = [];

          console.log(response.data[0]);

          if(auxiliar[0].length > 2) {
            auxiliar.map(item => {
              let obj = {
                id: (meuObjeto.length + 1),
                pasta: item//.replaceAll('\\\\','\\')
              }

              meuObjeto.push(obj);

            });

            console.log('OBJ: ');
            console.log(auxiliar[0].length);
            console.log('MEU OBJETO');
            console.log(meuObjeto);

            this.setState({ arrayPastas: meuObjeto });
            this.setState({ arrayPastasSensiveis: meuObjeto });

            console.log('PASTAS RETORNADAS: ');
            console.log(this.state.arrayPastasSensiveis);
          }*/

        }catch(erro) {
          console.log(erro);
        }
      })
  }

  /* =================================================== */
  /* === FILTRA O A MAQUINA DO DPO LOGADO NO SISTEMA === */
  /* =================================================== */
  verificaUsuarioDPO = async () => {
    var tokenDPO = DlpController.capituraToken();

    let tokenDescriptografado = '';

    try {
      tokenDescriptografado = Buffer.from(tokenDPO, "base64").toString();

    }catch(erro) {
      console.log('VOCÊ ESTA SEM TOKEN, FAÇA LOGIN NOVAMENTE');

      window.location.href = DlpController.ambienteRedirecionamento();
      
    }

    var usuarioLogado = tokenDescriptografado.split('-')[0];
    usuarioLogado.replace(/[0-9]/g, '');

    let stringValida = usuarioLogado;
    let nomeMaquinaDPO = '';
    let contador = 0; // FAMOSA GAMBI, DEPOIS AJUSTAR ISSO PQ ESTA ERRADO AHHA

    DlpController.getMaquinaDPO()
      .then(response => {

        console.log('RESPONSTA DATA: ');
        console.log(response.data);

        response.data.forEach((dado, i) => {
          if (stringValida.includes(dado.user_name) && contador < 1) {
            this.setState({ maquinaDPO: dado.computer_name })
            this.setState({ hash_maquina: dado.hash_maquina })
            this.setState({ grupoDlp: dado.grupo_dlp })

            nomeMaquinaDPO = dado.computer_name
            console.log("Maquina DPO: "+ nomeMaquinaDPO);
            console.log("Maquina: "+ this.state.hash_maquina);

            contador++;

            /* PESQUISA POR UM NOME ESPECIFICA DE UMA MAQUINA */
            if(nomeMaquinaDPO !== null || nomeMaquinaDPO !== '') {
              //this.findByNomeComputador(nomeMaquinaDPO);
              this.findByJSONMaquina(nomeMaquinaDPO);

              console.log('JSON DPO: ');
              console.log(this.state.arrayDlp);
            
            }

          }

        })

        if(nomeMaquinaDPO === null || nomeMaquinaDPO === '') {
          alert(`Não foi possivel localizar sua maquina no banco de dados, devido a divergência de dados do usuario logado na plataforma FlashSafe com o usuario de sua maquina local. Eles devem ser iguais!! \nPor favor, verifique com o suporte da plataforma. \nLogin que esta sendo utilizado no momento: ${Buffer.from(DlpController.capituraToken(), "base64").toString().split('-')[0]}`);
          window.location.href = DlpController.ambienteRedirecionamento();

        }

        this.setState({ arrayNomeMaquinas: response.data });
        this.setState({ maquinaSele: this.state.hash_maquina });

      }).catch(erro => console.log('OCORREU UM ERRO NA PESQUISA!'));

      /*setTimeout(function () {
        // CARREGA A LISTA DE PASTAS CADASTRADAS NO BANCO
        DlpController.getPastasSensiveisByNomeMaquina(Buffer.from(DlpController.capituraToken(), "base64").toString().split('-')[0])
          .then(response => {

            let auxiliar = JSON.stringify(response.data[0]).replace('{"nome_pasta":','').replace('}','').replaceAll('"','').split(',');
            console.log(auxiliar);

            //this.setState({ arrayPastas: auxiliar });

          }).catch(erro => {
            //console.log('NAO FORAM LOCALIZADOS DADOS COM A PESQUISA: '+ Buffer.from(DlpController.capituraToken(), "base64").toString().split('-')[0]);

          })
  
      }, Math.random() + 300);*/

  }

  /* ========================================================== */
  /* === ADICIONA UM NOVO ITEM NO ARRAY DE PASTAS SENSIVEIS === */
  /* ========================================================== */
  postPastasSensiveis = async (novoItem) => {

    this.state.arrayPastasSensiveis.push(novoItem);

    /* DESSA FORMA OS NOVOS DADOS IRAM REFLETIR NO FRONT-END */
    this.setState({ arrayPastasSensiveis: this.state.arrayPastasSensiveis });

    /* ENVIA UM ALERTA DE FEEDBACK AO USUARIO */
    console.log("Item adicionado com sucesso: " + novoItem.pasta);

  }

  /* ===================================================== */
  /* === ATUALIZA UM ITEM NO ARRAY DE PASTAS SENSIVEIS === */
  /* ===================================================== */
  pullPastasSensiveis = async (novoItem) => {

    console.log('ARRAY: ');
    console.log(this.state.arrayPastasSensiveis);

    for (let i = 0; i < this.state.arrayPastasSensiveis.length; i++) {
      if (this.state.arrayPastasSensiveis[i].id === this.state.idPasta) {
        this.state.arrayPastasSensiveis[i].id = novoItem.id;
        this.state.arrayPastasSensiveis[i].pasta = novoItem.pasta;
        this.state.arrayPastasSensiveis[i].maquinaDPO = novoItem.maquinaDPO;
        this.state.arrayPastasSensiveis[i].maquinaSele = novoItem.maquinaSele;

      }
    }

    console.log('ARRAY ATUALIZADO: ' + this.state.arrayPastasSensiveis);

    /* DESSA FORMA OS NOVOS DADOS IRAM REFLETIR NO FRONT-END */
    this.setState({ arrayPastasSensiveis: this.state.arrayPastasSensiveis });

  }

  /* ========================================= */
  /* === INSERE OS DADOS NO BANCO DE DADOS === */
  /* ========================================= */
  enviarDados = async (postDados) => {

    let auxiliarPastasSensiveis = '';

    auxiliarPastasSensiveis = JSON.stringify(postDados.pasta).replace('[','');
    auxiliarPastasSensiveis = auxiliarPastasSensiveis.replace(']','');
    auxiliarPastasSensiveis = auxiliarPastasSensiveis.replaceAll('","',',');
    auxiliarPastasSensiveis = auxiliarPastasSensiveis.replaceAll('\"','"');
    auxiliarPastasSensiveis = auxiliarPastasSensiveis.replaceAll('/','\\');
    auxiliarPastasSensiveis = auxiliarPastasSensiveis.replaceAll('\\\\','\\');
    auxiliarPastasSensiveis = auxiliarPastasSensiveis.replace('\"','');
    auxiliarPastasSensiveis = auxiliarPastasSensiveis.replace('\"','');
    auxiliarPastasSensiveis = auxiliarPastasSensiveis.replaceAll('\\','\\\\');

    // "\"d:\\teste1,d:\\teste2,d:\\teste3\""

    console.log('PASTA CADASTRADA');
    console.log(auxiliarPastasSensiveis);

    console.log('PASTAS SENSIVEIS base64_j2');
    console.log(this.state.arrayDlp[0].base64_j2.pastasSensiveis);

    this.state.arrayDlp[0].base64_j2.pastasSensiveis = auxiliarPastasSensiveis

    console.log('DADOS CARREGADOS PARA ENVIO: ');
    console.log(this.state.arrayDlp[0]);

    postDados.pasta = auxiliarPastasSensiveis

    /*const dadoEnvio =  {
      "nome_pasta": postDados.pasta,
      "usuario_dpo": postDados.maquinaDPO,
      "data_atualizacao": new Date().getFullYear() +'-'+ (new Date().getMonth() + 1) +'-'+ new Date().getDate() +" "+ new Date().getHours() +":"+ new Date().getMinutes() +":"+ new Date().getSeconds(),
      "maquina": ""
    }*/

    let idMemoria = this.state.id;

    console.log("MeuDado: "+ idMemoria);

    if(idMemoria !== '') {
      console.log('ACESSOU O UPDATE');

      setTimeout(function () {
        // ADICIONA AS PASTAS NA BASE DE DADOS
        DlpController.putPastasSensiveis(postDados, idMemoria)
          .then(response => console.log(response));

      }, 500);

    }else {
      console.log('ACESSOU O POST');
      
      setTimeout(function () {
        // ADICIONA AS PASTAS NA BASE DE DADOS
        DlpController.postPastasSensiveis(postDados)
          .then(response => console.log(response));

      }, 500);

    }

    // ATUALIZA O JSON DO DPO COM AS PASTAS SENSIVEIS
    this.criptografarJSON(this.state.arrayDlp[0]);

    this.state.token = DlpController.capituraToken();

    var tokenAcesso = this.state.token;

    setTimeout(function () {
      //window.location.href = `http://54.207.237.19:3001/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
      //window.location.href = `https://app.flashsafe.com:3003/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
      //window.location.href = `https://app.flashsafe.com:3001/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
      //window.location.href = `https://app.flashsafe.com:3000/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
      //window.location.href = `https://app.flashsafe.com:3007/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
      //window.location.href = `http://m2g.com.br:3000/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
      //window.location.href = `https://app.flashsafe.com:3006/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
      //window.location.href = `https://app.flashsafe.com:3009/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
      //window.location.href = `http://54.207.116.254:3000/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
      window.location.href = `${DlpController.ambienteRedirecionamentoReact()}/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;

    }, 1000);

  }

  /* ========================================= */
  /* === INSERE OS DADOS NO BANCO DE DADOS === */
  /* ========================================= */
  enviarDadosAPI = async (postDados) => {
    var contador = 0;
    var memoriaDadosPastasSensiveis = '';

    console.log("Dados pastas sensiveis: "+ this.state.pastasSensiveis);

    for(let i = 0; i < this.state.pastasSensiveis.length; i++) {
      if(this.state.pastasSensiveis[i] == '\\' && contador < 2) {
        contador++;

      }else if(contador == 2) {
        break;
      }

    }

    contador = 0;

    for(let i = 0; i < this.state.pastasSensiveis.length; i++) {
      if(this.state.pastasSensiveis[i] == '\\' && contador < 2) {
        contador++;

        memoriaDadosPastasSensiveis = memoriaDadosPastasSensiveis + this.state.pastasSensiveis[i] + "\\";

        console.log("Acessou a barra");

      }else if(contador > 1 && this.state.pastasSensiveis[i] != '\\') {
        memoriaDadosPastasSensiveis = memoriaDadosPastasSensiveis + this.state.pastasSensiveis[i];
        
        console.log("Inseriu dado");

      }else {
        memoriaDadosPastasSensiveis = memoriaDadosPastasSensiveis + this.state.pastasSensiveis[i];

        contador = 0;
        
        console.log("Zerou o contador");

      }

    }

    this.state.pastasSensiveis = memoriaDadosPastasSensiveis;

    this.state.pastasSensiveis = this.state.pastasSensiveis.split('\\\\').join('\\');
    this.state.pastasSensiveis = this.state.pastasSensiveis.replace(/\\\\/g,"\\");

    if(contador < 2) {
      try{
        this.state.pastasSensiveis = this.state.pastasSensiveis.split('/').join('\\\\');
        this.state.pastasSensiveis = this.state.pastasSensiveis.replace(/\\/g,"\\\\");
        
        this.state.pastasSensiveis = this.state.pastasSensiveis.replace(/\\\\/g,"\\\\");

      }catch(err) {
        console.log('Nao contem o campo: pastasSensiveis no JSON');
      }

    }else {
      try{
        this.state.pastasSensiveis = this.state.pastasSensiveis.split('/').join('\\');
        this.state.pastasSensiveis = this.state.pastasSensiveis.replace(/\\/g,"\\\\");

        this.state.pastasSensiveis = this.state.pastasSensiveis.replace(/\\\\/g,"\\\\");

      }catch(err) {
        console.log('Nao contem o campo: pastasSensiveis no JSON');
      }

    }

    /* ================================= */
    /* ===  ACRESCENTA O JSON 1 FIXO === */
    /* ================================= */
    const json1Fixo = {
      json:"1",
      tipo:3,
      print:false,
      filma:false,
      impede_copia:false,
      registra_copia:false,
      monitora_dados:false,
      impede_dados:false,
      bloqueia_app:false,
      derruba_app:false
    }

    var verificador = 0;

    for(let i = 0; i < this.state.base64_j3.length; i++) {
      if(String(this.state.base64_j3[i].json) === "1") {
        verificador++;
      }

    }

    if(verificador == 0) {
      console.log(json1Fixo);
      this.state.base64_j3.push(json1Fixo);
    }

    console.log(this.state.hash_maquina);

    const computador = {
      grupo_dlp: this.state.grupo_dlp,
      maquina: this.state.hash_maquina,
      computer_name: this.state.maquinaDPO,
      base64_j1: {
        json: 'vars', //vars
        classesDebugar: this.state.classesDebugar,
        cliAtual: this.state.cliAtual,
        conectivosExcluir: ',DE,DO,DAS,A,O,AS,OS,SA,PELO,PELA,PARA,DEL,DELA,', //,DE,DO,DAS,A,O,AS,OS,SA,PELO,PELA,PARA,DEL,DELA,
        driveServer: 'e:', //e:
        grupoDlp: this.state.grupoDlp,
        ipCloud: this.state.ipCloud,
        jansFilhasMonitorar: 'save,salvar,save file,salvar arquivo,open,open file,abrir,abrir arquivo,anexar,arquivos,arquivo,files,Inserir Arquivo,Inserir Arquivos,Mensagem', //save,salvar,save file,salvar arquivo,open,open file,abrir,abrir arquivo,anexar,arquivos,arquivo,files,Inserir Arquivo,Inserir Arquivos,Mensagem
        origensAlarme: 'CoPIA INDEVIDA,GRAVACAO INDEVIDA,ANEXACAO ARQUIVO,DISPOSITIVO NAO CONHECIDO,DISPOSITIVO SEM IDENT VALIDA,RESPOSTA DE MENSAGEM,ACAO INDEVIDA,ERRO PROCESSAMENTO', //CoPIA INDEVIDA,GRAVACAO INDEVIDA,ANEXACAO ARQUIVO,DISPOSITIVO NAO CONHECIDO,DISPOSITIVO SEM IDENT VALIDA,RESPOSTA DE MENSAGEM,ACAO INDEVIDA,ERRO PROCESSAMENTO
        percentualCompacArquivos: '60%', //60%
        portaCloud: this.state.portaCloud,
        portaDlp: this.state.portaDlp,
        statusAlarme: 'NAO VISTO,VISTO,EM ANDAMENTO,PENDENTE,TRATADO,DISPOSITIVO AUTORIZADO,DISPOSITIVO NAO AUTORIZADO,ARQUIVADO,MENSAGEM LIDA', //NAO VISTO,VISTO,EM ANDAMENTO,PENDENTE,TRATADO,DISPOSITIVO AUTORIZADO,DISPOSITIVO NAO AUTORIZADO,ARQUIVADO,MENSAGEM LIDA
        tiposAlarme: 'SERIO,GRAVE,GRAVISSIMO,INFO', //SERIO,GRAVE,GRAVISSIMO,INFO
        titulosADesprezar: 'Alternancia,salerta,program manager,Emblema,Andamento', //Alternancia,salerta,program manager,Emblema,Andamento
        extensoesSensiveis: "txt,xlsx,docx,ppt,pptx,xls,doc,pdf,html,xml ", //txt,xlsx,docx,ppt,pptx,xls,doc,pdf,html,xml 
        codCliente: this.state.codCliente,
        codigoMaquinaPorUsuario: "0",
        codVBios: "1",
        mapperAtivado:"0",
      },
      base64_j2: {
        anonimizaDadosRelatorios: this.state.anonimizaDadosRelatorios,
        ativaEmailAlmGraves: this.state.ativaEmailAlmGraves,
        ativaEmailAlmGravissimos: this.state.ativaEmailAlmGravissimos,
        ativaEmailAlmSerios: this.state.ativaEmailAlmSerios,
        ativaSmsAlmGraves: this.state.ativaSmsAlmGraves,
        ativaSmsAlmGravissimos: this.state.ativaSmsAlmGravissimos,
        ativaSmsAlmSerios: this.state.ativaSmsAlmSerios,
        desativaPrintScreen: this.state.desativaPrintScreen,
        filmar_sempre: this.state.filmar_sempre,
        monitoraDispExternos: "1", //1
        quandoPegarDadosSensiveis: this.state.quandoPegarDadosSensiveis,
        imgBlockPrtSc: "/j/users/dlp/TELA_BLOQUEIO_PRINT.png  ", // /j/users/dlp/TELA_BLOQUEIO_PRINT.png  
        qtMinQualifsTab:"3", //3
        qtMinQualifsDoc:"5", //5
        maxQtFalsosNomes:"3", //3
        qtPalsManterQualificador:"1", //1
        QtMaxLinhasResult:"60", //60
        tMinQualifsTab:"3", //3
        comFonetizacao:"1", //1
        notaCorteSerios:"20", //20
        notaCorteGraves:"100", //100
        notaCorteGravissimos:"500", //500
        pastasSensiveis: this.state.pastasSensiveis,
        tempoDragAndDrop: this.state.tempoDragAndDrop,
        impressaoSpooler: this.state.impressaoSpooler,

      },
      base64_j3: this.state.base64_j3,
    };

    console.log('OBJ ENVIO: ');
    console.log(computador);


    let auxiliarPastasSensiveis = '';

    auxiliarPastasSensiveis = JSON.stringify(postDados.pasta).replace('[','');
    auxiliarPastasSensiveis = auxiliarPastasSensiveis.replace(']','');
    auxiliarPastasSensiveis = auxiliarPastasSensiveis.replaceAll('","',',');
    auxiliarPastasSensiveis = auxiliarPastasSensiveis.replaceAll('\"','"');
    auxiliarPastasSensiveis = auxiliarPastasSensiveis.replaceAll('/','\\');
    auxiliarPastasSensiveis = auxiliarPastasSensiveis.replaceAll('\\\\','\\');
    auxiliarPastasSensiveis = auxiliarPastasSensiveis.replace('\"','');
    auxiliarPastasSensiveis = auxiliarPastasSensiveis.replace('\"','');
    auxiliarPastasSensiveis = auxiliarPastasSensiveis.replaceAll('\\','\\\\');

    // "\"d:\\teste1,d:\\teste2,d:\\teste3\""

    console.log('PASTA CADASTRADA');
    console.log(auxiliarPastasSensiveis);

    console.log('PASTAS SENSIVEIS base64_j2');
    console.log(computador.base64_j2.pastasSensiveis);

    computador.base64_j2.pastasSensiveis = auxiliarPastasSensiveis

    console.log('DADOS CARREGADOS PARA ENVIO: ');
    console.log(computador);

    postDados.pasta = auxiliarPastasSensiveis

    let idMemoriaGravada = this.state.id;

    if(idMemoriaGravada !== '') {
      console.log('ACESSOU O UPDATE');
      console.log('ID: '+ idMemoriaGravada);

      let idMemoria = this.state.id;

      setTimeout(function () {
        // ADICIONA AS PASTAS NA BASE DE DADOS
        DlpController.putPastasSensiveis(postDados, idMemoria)
          .then(response => console.log(response));

      }, 500);

    }else {
      console.log('ACESSOU O POST');
      
      setTimeout(function () {
        // ADICIONA AS PASTAS NA BASE DE DADOS
        DlpController.postPastasSensiveis(postDados)
          .then(response => console.log(response));

      }, 500);
      
    }

    // ATUALIZA O JSON DO DPO COM AS PASTAS SENSIVEIS
    this.criptografarJSON(computador);

    this.state.token = DlpController.capituraToken();

    var tokenAcesso = this.state.token;

    setTimeout(function () {
      //window.location.href = `http://54.207.237.19:3001/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
      //window.location.href = `https://app.flashsafe.com:3003/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
      //window.location.href = `https://app.flashsafe.com:3001/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
      //window.location.href = `https://app.flashsafe.com:3000/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
      //window.location.href = `https://app.flashsafe.com:3007/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
      //window.location.href = `http://m2g.com.br:3000/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
      //window.location.href = `https://app.flashsafe.com:3006/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
      //window.location.href = `https://app.flashsafe.com:3009/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
      //window.location.href = `http://54.207.116.254:3000/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
      window.location.href = `${DlpController.ambienteRedirecionamentoReact()}/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;

    }, 2000);

  }

  /* =================================================================================================== */
  /* === DELETA UMA PASTA SENSIVEIS ESPECIFICA DO ARRAY DE PASTAS SESIVEIS POR MEIO DO NOME DA PASTA === */
  /* =================================================================================================== */
  deleteIndex = async (nome) => {
    console.log(nome)
    for (let i = 0; i < this.state.arrayPastasSensiveis.length; i++) {

      console.log(this.state.arrayPastasSensiveis[i].pasta)
      if (this.state.arrayPastasSensiveis[i].pasta == nome) {

        // VERIFICA SE O ITEM EXISTE NO ARRAY
        var index = this.state.arrayPastasSensiveis[i].pasta.indexOf(nome);
        console.log(index)
        // DEPENDENDO DA RESPOSTA ELE ACESSA PARA EXCLUIR O ITEM OU NAO
        if (index > -1) {
          // EXCLUI O ITEM ESPECIFICO, PARA ISSO PASSANDO COMO PARAMENTRO O INDICE DO ITEM NO ARRAY E A QTD DE ITENS APOS ELE VC DESEJA EXCLUIR, NESSE CASO SERA APENAS 1, OU SEJA, ELE MESMO
          this.state.arrayPastasSensiveis.splice(i, 1);

        }

      }

    }

    /* DESSA FORMA OS NOVOS DADOS IRAM REFLETIR NO FRONT-END */
    this.setState({ arrayPastasSensiveis: this.state.arrayPastasSensiveis });

    //alert("Item deletado com sucesso!");

  }

  componentDidMount() {
    bsCustomFileInput.init()
  }

  /* ==================================== */
  /* === CRIPTOGRAFAR O OBJETO OBTIDO === */
  /* ==================================== */
  criptografarJSON = async (obj) => {

    /* CRIPTOGRAFA O JSON E ARMAZENA OS DADOS EM VARIAVEIS PARA QUE POSSAM SER MANIPULADAS NO FRONT */
    //for(let i = 0; i < obj.length; i++) {
      var jsonJ1 = JSON.stringify( obj.base64_j1 );
      var converterParaBase64J1 =  jsonJ1;
      // AJUSTA O BASE64 PARA CHARSET-UTF8
      var criptografaStringJ1 = btoa(unescape(encodeURIComponent( converterParaBase64J1 )));
      obj.base64_j1 = criptografaStringJ1;

      /*console.log("J1 - Criptografado");
      console.log(obj.base64_j1);*/

      var jsonJ2 = JSON.stringify( obj.base64_j2 );
      var converterParaBase64J2 =  jsonJ2;
      var criptografaStringJ2 = btoa(converterParaBase64J2);

      obj.base64_j2 = criptografaStringJ2;

      /*console.log("J2 - Criptografado");
      console.log(obj.base64_j2);*/

      var jsonJ3 = JSON.stringify( obj.base64_j3 );

      for(let j = 0; j < jsonJ3.length; j++) {
        jsonJ3 = jsonJ3.replace("[", "");
        jsonJ3 = jsonJ3.replace("]", "");

      }

      /*console.log("J3 - Descriptografado e filtrado");
      console.log(jsonJ3);*/

      var converterParaBase64J3 =  jsonJ3;
      var criptografaStringJ3 = btoa(converterParaBase64J3);
      obj.base64_j3 = criptografaStringJ3;

      /*console.log("J3 - Criptografado");
      console.log(obj.base64_j3);*/

    //}

    /*console.log("Valor contido em OBJ");
    console.log(JSON.stringify(obj));*/

    obj = JSON.stringify(obj);

    /* ARMAZENA O JSON ATUALIZADO E CRIPTOGRAFADO EM UM OBJETO PARA QUE POSSA SER ENVIADO VIA REQUISICAO REST */
    this.state.arrayParaEnvioAoServidor = obj;
    
    /*console.log("JSON criptografado GERADO: ");
    console.log(this.state.arrayParaEnvioAoServidor);*/

    console.log("JSON Configuração");
    console.log(this.state.arrayParaEnvioAoServidor);

    /* ENVIA OS DADOS ATUALIZADOS E CRIPTOGRAFADOS POR MEIO DO METODO postJson */
    DlpController.postJson(this.state.arrayParaEnvioAoServidor)
      .then(response => console.log(response));

    /* REDIRECIONAR USUARIO */
    this.state.token = DlpController.capituraToken();

    var tokenAcesso = this.state.token;

    // Redireciona o usuário para a página informada
    /*setTimeout(function() {
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
      
    }, 300);*/

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

    }

    /* NAVEGA NA STRING DO TOKEN */
    for (let i = 0; i < base64ToString.length; i++) {
      /* VERIFICA SE NA POSICAO ATUAL SE TRATA DE UM *, CASO SEJA RETORNA O VALOR TRUE PARA REALIZAR A LIBERACAO TOTAL AS CONFIGURACOES */
      if (String(base64ToString[i]) == "*") {
        console.log("Contem *");

      }
    }

  }

  /* ====================================== */
  /* === ENVIAR DADOS PARA CRIPTOGRAFAR === */
  /* ====================================== */
  enviarDadosAoServidor = async () => {
    this.setState({ enviarJson: true });

  }

  /* DADOS IMPORTADOS */
  /* ==================================== */
  /* === FIM DOS OBSERVADORES DO JSON === */
  /* ==================================== */

  /* PESQUISA POR NOME DE COMPUTADOR */
  handleSubmitGetByNomeComputador = event => {
    event.preventDefault();

    const pesquisa = {
      filtro: this.state.nome,
      pg: "1", 
      qtPorPg: "100"
    }

    this.zerarVariaveis();
    this.zerarVariaviesJ3();

    /* PESQUISA POR UM NOME ESPECIFICA DE UMA PESSOA */
    this.findByNomeComputador(pesquisa);

    //this.state.nome = '';
    let memoria = pesquisa.filtro;
    this.state.nome = memoria;

    console.log('VALOR DA MEMORIA: ');
    console.log(memoria);
    
    console.log('PESQUISA MEMORIA: ');
    console.log(this.state.nome);

  };

  /* CAPITURA DADOS PARA CRIAR UM NOVO ITEM NO JSON */
  handleSubmitPostL3 = event => {
    event.preventDefault();

    /* CRIA O OBJETO COM OS NOVOS DADOS */
    const novoItem = {
        derruba_app: this.state.derruba_app,
        filma: this.state.filma,
        impede_copia: this.state.impede_copia,
        //json: this.state.json,
        json: "2",
        monitora_dados: this.state.monitora_dados,
        particular: this.state.particular,
        print: this.state.print,
        registra_copia: this.state.registra_copia,
        //tipo: this.state.tipo,
        tipo: "1",
        filtro_titulo: this.state.filtro_titulo,
        executavel: this.state.executavel,
        impede_dados: this.state.impede_dados,
    };

    /*console.log("Gerou o objeto Novo Item");
    console.log(novoItem);*/

    /* ENVIA O OBJETO PARA SER INSERIDO NO ARRAY NOVAMENTE */
    this.postIndexL3(novoItem);

  }

  /* ATUALIZA O USUARIO - ESSE METODO NAO SERA UTILIZADO */
  handleSubmitPutComputador = event => {
    event.preventDefault();
    
    /*if (this.state.pastasSensivei.indexOf("\\\\") >= 0) {
      console.log("Ja se tem 2 barras na String");

    }else {
      console.log("Ainda nao tem 2 barras na String");

    }*/

    var contador = 0;
    var memoriaDadosPastasSensiveis = '';

    console.log("Dados pastas sensiveis: "+ this.state.pastasSensiveis);

    for(let i = 0; i < this.state.pastasSensiveis.length; i++) {
      if(this.state.pastasSensiveis[i] == '\\' && contador < 2) {
        contador++;

      }else if(contador == 2) {
        break;
      }

    }

    contador = 0;

    for(let i = 0; i < this.state.pastasSensiveis.length; i++) {
      if(this.state.pastasSensiveis[i] == '\\' && contador < 2) {
        contador++;

        memoriaDadosPastasSensiveis = memoriaDadosPastasSensiveis + this.state.pastasSensiveis[i] + "\\";

        console.log("Acessou a barra");

      }else if(contador > 1 && this.state.pastasSensiveis[i] != '\\') {
        memoriaDadosPastasSensiveis = memoriaDadosPastasSensiveis + this.state.pastasSensiveis[i];
        
        console.log("Inseriu dado");

      }else {
        memoriaDadosPastasSensiveis = memoriaDadosPastasSensiveis + this.state.pastasSensiveis[i];

        contador = 0;
        
        console.log("Zerou o contador");

      }

    }

    console.log("Endereco: "+ memoriaDadosPastasSensiveis);

    /*try{
      memoriaDadosPastasSensiveis = this.state.arrayDlp[0].base64_j2.pastasSensiveis.split('\\\\').join('\\');
      memoriaDadosPastasSensiveis = this.state.arrayDlp[0].base64_j2.pastasSensiveis.replace(/\\\\/g,"\\");
    
    }catch(err) {
      console.log('Nao contem o campo: pastasSensiveis no JSON');
    
    }*/

    this.state.pastasSensiveis = memoriaDadosPastasSensiveis;

    console.log("Endereco ajustado: "+ this.state.pastasSensiveis);

    this.state.pastasSensiveis = this.state.pastasSensiveis.split('\\\\').join('\\');
    this.state.pastasSensiveis = this.state.pastasSensiveis.replace(/\\\\/g,"\\");

    if(contador < 2) {
      console.log("Resposta: Ainda nao se tem 2 barras, seram incluidas nesse momento");
      try{
        this.state.pastasSensiveis = this.state.pastasSensiveis.split('/').join('\\\\');
        this.state.pastasSensiveis = this.state.pastasSensiveis.replace(/\\/g,"\\\\");
        
        this.state.pastasSensiveis = this.state.pastasSensiveis.replace(/\\\\/g,"\\\\");

      }catch(err) {
        console.log('Nao contem o campo: pastasSensiveis no JSON');
      }
    }else {
      console.log("Resposta: Ja se tem 2 barras na String");
      try{
        this.state.pastasSensiveis = this.state.pastasSensiveis.split('/').join('\\');
        this.state.pastasSensiveis = this.state.pastasSensiveis.replace(/\\/g,"\\\\");

        this.state.pastasSensiveis = this.state.pastasSensiveis.replace(/\\\\/g,"\\\\");

      }catch(err) {
        console.log('Nao contem o campo: pastasSensiveis no JSON');
      }
    }

    //this.state.pastasSensiveis = this.state.pastasSensiveis.split('/').join('\\\\');
    //this.state.pastasSensiveis = this.state.pastasSensiveis.replace(/\\/g,"\\\\");

    //console.log("Pastas sensiveis: ");
    //console.log(this.state.pastasSensiveis);

    /* ================================= */
    /* ===  ACRESCENTA O JSON 1 FIXO === */
    /* ================================= */
    const json1Fixo = {
      json:"1",
      tipo:3,
      print:false,
      filma:false,
      impede_copia:false,
      registra_copia:false,
      monitora_dados:false,
      impede_dados:false,
      bloqueia_app:false,
      derruba_app:false
    }

    var verificador = 0;

    console.log("Verificador inicial: "+ verificador);

    for(let i = 0; i < this.state.base64_j3.length; i++) {
      if(String(this.state.base64_j3[i].json) === "1") {
        verificador++;
      }

    }

    console.log("Verificador final: "+ verificador);

    if(verificador == 0) {
      console.log("JSON 1");
      console.log(json1Fixo);
      this.state.base64_j3.push(json1Fixo);
    }

    console.log("J3 atualizado");
    console.log(this.state.base64_j3);

    const computador = {
      grupo_dlp: this.state.grupo_dlp,
      computer_name: this.state.computer_name,
      maquina: this.state.maquina,
      base64_j1: {
        json: 'vars',
        classesDebugar: this.state.classesDebugar,
        cliAtual: this.state.cliAtual,
        conectivosExcluir: this.state.conectivosExcluir,
        driveServer: this.state.driveServer,
        grupoDlp: this.state.grupoDlp,
        ipCloud: this.state.ipCloud,
        jansFilhasMonitorar: this.state.jansFilhasMonitorar,
        origensAlarme: this.state.origensAlarme,
        percentualCompacArquivos: this.state.percentualCompacArquivos,
        portaCloud: this.state.portaCloud,
        portaDlp: this.state.portaDlp,
        statusAlarme: this.state.statusAlarme,
        tiposAlarme: this.state.tiposAlarme,
        titulosADesprezar: this.state.titulosADesprezar,
        extensoesSensiveis: "txt,xlsx,docx,ppt,pptx,xls,doc,pdf,html,xml",
        //palavrasSensiveis: this.state.palavrasSensiveis,  
        codCliente: this.state.codCliente,
        codigoMaquinaPorUsuario: this.state.codigoMaquinaPorUsuario,
      },
      base64_j2: {
        //---amostragemGravacaoArquivos: this.state.amostragemGravacaoArquivos,
        //---amostragemMonitoraçãoAnexos: this.state.amostragemMonitoraçãoAnexos,
        //---amostragemWatcher: this.state.amostragemWatcher,
        //anonimizaDadosRelatorios: this.state.anonimizaDadosRelatorios,
        anonimizaDadosRelatorios: this.state.anonimizaDadosRelatorios,
        ativaEmailAlmGraves: this.state.ativaEmailAlmGraves,
        ativaEmailAlmGravissimos: this.state.ativaEmailAlmGravissimos,
        ativaEmailAlmSerios: this.state.ativaEmailAlmSerios,
        ativaSmsAlmGraves: this.state.ativaSmsAlmGraves,
        ativaSmsAlmGravissimos: this.state.ativaSmsAlmGravissimos,
        ativaSmsAlmSerios: this.state.ativaSmsAlmSerios,
        desativaPrintScreen: this.state.desativaPrintScreen,
        filmar_sempre: this.state.filmar_sempre,
        //---gatilhoLinhasNaoRelevantes: this.state.gatilhoLinhasNaoRelevantes,
        //---gatilhoLinhasProximas: this.state.gatilhoLinhasProximas,
        //---informaAcoesUsuario: this.state.informaAcoesUsuario,
        //---jaCarregueiServer: this.state.jaCarregueiServer,
        //---maxDadosRelevantes: this.state.maxDadosRelevantes,
        //---maxLinhasComentario: this.state.maxLinhasComentario,
        monitoraDispExternos: "1",//this.state.monitoraDispExternos,
        //---naoDerrubaMaquina: this.state.naoDerrubaMaquina,
        //---naoInicializaMaquina: this.state.naoInicializaMaquina,
        //---percentualRelevancia: this.state.percentualRelevancia,
        //---qtInfosGrave: this.state.qtInfosGrave,
        //---qtInfosGravissimo: this.state.qtInfosGravissimo,
        //---qtInfosSerio: this.state.qtInfosSerio,
        quandoPegarDadosSensiveis: this.state.quandoPegarDadosSensiveis,
        //---tipoDpo: this.state.tipoDpo,
        imgBlockPrtSc: "/j/users/dlp/TELA_BLOQUEIO_PRINT.png",  
        qtMinQualifsTab:"3",
        qtMinQualifsDoc:"5",
        maxQtFalsosNomes:"3",
        qtPalsManterQualificador:"1",
        QtMaxLinhasResult:"60",
        tMinQualifsTab:"3",
        comFonetizacao:"1",
        notaCorteSerios:"20",
        notaCorteGraves:"100",
        notaCorteGravissimos:"500",
        pastasSensiveis: this.state.pastasSensiveis,
        tempoDragAndDrop: this.state.tempoDragAndDrop,
        impressaoSpooler: this.state.impressaoSpooler,
      },
      base64_j3: this.state.base64_j3,
    };

    /*console.log("DADOS J3 DO OBJETO COMPUTADOR");
    console.log(computador);

    console.log("BASE J3");
    console.log(computador.base64_j3);*/

    /* INSERE OS DADOS PARA ATUALIZAR O USUARIO */
    /* SE PASSA COMO PARAMETRO O OBJETO PESSOA, E TRATA ESSES DADOS DESSE OBJETO DENTRO DO METODO, DESSA FORMA FACILITANDO O GERENCIAMENTO DOS DADOS E FUTOS AJUSTES */
    //this.putComputador(computador);
    /* ENVIAR O OBJETO PESSOA PARA O METODO PUT */

  };

  /* CAPITURA DADOS PARA ATUALIZAR UM ITEM NO JSON PEGANDO COMO PARAMENTRO O INDEX E O OBJETO EM SI */
  handleSubmitPutL3 = event => {
    event.preventDefault();

    /*console.log("Retorno do meu J3");
    console.log(this.state.base64_j3);*/

    /* CRIA O OBJETO COM OS NOVOS DADOS */
    const itemExistente = {
        derruba_app: this.state.derruba_app,
        filma: this.state.filma,
        impede_copia: this.state.impede_copia,
        json: this.state.json,
        monitora_dados: this.state.monitora_dados,
        particular: this.state.particular,
        print: this.state.print,
        registra_copia: this.state.registra_copia,
        tipo: this.state.tipo,
        filtro_titulo: this.state.filtro_titulo,
        executavel: this.state.executavel,
        impede_dados: this.state.impede_dados,
    };

    /*console.log("Gerou o objeto Atualizado Item");
    console.log(itemExistente);

    console.log("Dados recebidos do usuario OBSERVADOR L3: ");
    console.log(itemExistente.derruba_app);
    console.log(itemExistente.filma);
    console.log(itemExistente.impede_copia);
    console.log(itemExistente.json);
    console.log(itemExistente.monitora_dados);
    console.log(itemExistente.particular);
    console.log(itemExistente.print);
    console.log(itemExistente.registra_copia);
    console.log(itemExistente.tipo);
    console.log(itemExistente.filtro_titulo);
    console.log(itemExistente.executavel);
    console.log(itemExistente.impede_dados);*/

    /* ENVIA O OBJETO PARA SER INSERIDO NO ARRAY NOVAMENTE, E TAMBEM ENVIA O FILTRO E O EXECUTAVEL PARA SERVIREM DE REFERENCIA PARA ATUALIZAR OS DADOS CORRETAMENTE */
    this.putIndexL3(itemExistente.filtro_titulo, itemExistente.executavel, itemExistente);

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

  /* PESQUISA TODOS OS DADOS CONTIDOS NA BASE DADOS */
  findAllByDLPs = async () => {
    DlpController.getAllDlp()
    .then(response => {
        this.converterJSON(response.data);
        
        this.setState({
            arrayDlp: response.data
        });

    })
    .catch(e => {
        console.log(e);

    });

  }

  /* PESQUISA POR UM USUARIO ESPECIFICO E POPULA AS VARIAVEIS DE AMBIENTE PARA QUE POSSAM SER ALTERADAS */
  findByIndexL3 = async (index, executavel) => {

    /*console.log("Filtro");
    console.log(index);

    console.log("Executavel");
    console.log(executavel);*/

    /* ======================================= */
    /* === CONVERTENDO STRING PARA BOOLEAN === */
    /* ======================================= */

    for(let i = 0; i < this.state.base64_j3.length; i++) {
      
      if(String(this.state.base64_j3[i].derruba_app).toLowerCase() == "true") {
        this.state.base64_j3[i].derruba_app = true;
    
      }else if(String(this.state.base64_j3[i].derruba_app).toLowerCase() == "false") {
        this.state.base64_j3[i].derruba_app = false;

      }

      if(String(this.state.base64_j3[i].filma).toLowerCase() == "true") {
        this.state.base64_j3[i].filma = true;
      
      }else if(String(this.state.base64_j3[i].filma).toLowerCase() == "false") {
        this.state.base64_j3[i].filma = false;

      }

      if(String(this.state.base64_j3[i].impede_copia).toLowerCase() == "true") {
        this.state.base64_j3[i].impede_copia = true;
      
      }else if(String(this.state.base64_j3[i].impede_copia).toLowerCase() == "false") {
        this.state.base64_j3[i].impede_copia = false;

      }

      if(String(this.state.base64_j3[i].monitora_dados).toLowerCase() == "true") {
        this.state.base64_j3[i].monitora_dados = true;
      
      }else if(String(this.state.base64_j3[i].monitora_dados).toLowerCase() == "false") {
        this.state.base64_j3[i].monitora_dados = false;

      }

      if(String(this.state.base64_j3[i].particular).toLowerCase() == "true") {
        this.state.base64_j3[i].particular = true;
      
      }else if(String(this.state.base64_j3[i].particular).toLowerCase() == "false") {
        this.state.base64_j3[i].particular = false;

      }

      if(String(this.state.base64_j3[i].print).toLowerCase() == "true") {
        this.state.base64_j3[i].print = true;
      
      }else if(String(this.state.base64_j3[i].print).toLowerCase() == "false") {
        this.state.base64_j3[i].print = false;

      }

      if(String(this.state.base64_j3[i].registra_copia).toLowerCase() == "true") {
        this.state.base64_j3[i].registra_copia = true;
      
      }else if(String(this.state.base64_j3[i].registra_copia).toLowerCase() == "false") {
        this.state.base64_j3[i].registra_copia = false;

      }

      if(String(this.state.base64_j3[i].impede_dados).toLowerCase() == "true") {
        this.state.base64_j3[i].impede_dados = true;
      
      }else if(String(this.state.base64_j3[i].impede_dados).toLowerCase() == "false") {
        this.state.base64_j3[i].impede_dados = false;

      }

    }

    /* ESTAMOS UTILIZANDO COMO REFERENCIA O ATRIBUTO tipo DO J3, POREM ELE INICIA DO 1 EM DIANTE, DESSA FORMA TEMOS QUE AJUSTAR O VALOR PARA EQUIVALER AO INDEX DO ITEM */
    /* PARA ISSO BASTA SUBITRAIR POR 1, POIS ESTAMOS TRATANDO COM ARRAYs ONDE INICIAM DO 0 [0, 1, 2 ...] */
    for(let i = 0; i < this.state.base64_j3.length; i++) {

      /* AQUI SERA VERIFICADO QUAL DOS ITENS QUE USAMOS COMO REFERENCIA (ID) PARA PODER TRAZER OS DADOS DO ITEM E ATUALIZA-LO */
      if(this.state.base64_j3[i].filtro_titulo == index && String(index).toLowerCase() != "") {
        /* DESSA FORMA ESTA SENDO POSSIVEL ATUALIZAR OS DADOS DENTRO DO MODAL PARA EDICAO DE UM DETERMINADO ITEM/OBJETO DO J3 */

        this.setState({ derruba_app: this.state.base64_j3[i].derruba_app });
        this.setState({ filma: this.state.base64_j3[i].filma });
        this.setState({ impede_copia: this.state.base64_j3[i].impede_copia });
        this.setState({ json: this.state.base64_j3[i].json });
        this.setState({ monitora_dados: this.state.base64_j3[i].monitora_dados });
        this.setState({ particular: this.state.base64_j3[i].particular });
        this.setState({ print: this.state.base64_j3[i].print });
        this.setState({ registra_copia: this.state.base64_j3[i].registra_copia });
        this.setState({ tipo: this.state.base64_j3[i].tipo });
        this.setState({ filtro_titulo: this.state.base64_j3[i].filtro_titulo });
        this.setState({ executavel: this.state.base64_j3[i].executavel });
        this.setState({ impede_dados: this.state.base64_j3[i].impede_dados });

      } else if(this.state.base64_j3[i].executavel == executavel && String(executavel).toLowerCase() != "") {
        /* DESSA FORMA ESTA SENDO POSSIVEL ATUALIZAR OS DADOS DENTRO DO MODAL PARA EDICAO DE UM DETERMINADO ITEM/OBJETO DO J3 */

        this.setState({ derruba_app: this.state.base64_j3[i].derruba_app });
        this.setState({ filma: this.state.base64_j3[i].filma });
        this.setState({ impede_copia: this.state.base64_j3[i].impede_copia });
        this.setState({ json: this.state.base64_j3[i].json });
        this.setState({ monitora_dados: this.state.base64_j3[i].monitora_dados });
        this.setState({ particular: this.state.base64_j3[i].particular });
        this.setState({ print: this.state.base64_j3[i].print });
        this.setState({ registra_copia: this.state.base64_j3[i].registra_copia });
        this.setState({ tipo: this.state.base64_j3[i].tipo });
        this.setState({ filtro_titulo: this.state.base64_j3[i].filtro_titulo });
        this.setState({ executavel: this.state.base64_j3[i].executavel });
        this.setState({ impede_dados: this.state.base64_j3[i].impede_dados });

      }
    
    }

    /*console.log(`Nome: ${index}`);
    console.log(`Executavel: ${executavel}`);

    console.log(this.state.derruba_app);
    console.log(this.state.filma);
    console.log(this.state.impede_copia);
    console.log(this.state.json);
    console.log(this.state.monitora_dados);
    console.log(this.state.particular);
    console.log(this.state.print);
    console.log(this.state.registra_copia);
    console.log(this.state.tipo);
    console.log(this.state.filtro_titulo);
    console.log(this.state.executavel);
    console.log(this.state.impede_dados);*/

  }

  /* METODO RESPONSAVEL POR REALIZAR A BUSCA POR UM ITEM ESPECIFICO NA BASE DE DADOS ex.: /?nome=${nome} */
  findByNomeComputador = async(pesquisa) => {
    try {

      console.log("Pesquisa");
      console.log(pesquisa);

      console.log("PESQUISANDO JSON DO DPO");
      
      DlpController.getJson(pesquisa)
        .then(response => {
          this.setState({
              arrayDlp: response.data
          });

          this.converterJSON(this.state.arrayDlp);

      }).catch(erro => {
        alert('OCORREU UM ERRO COM O CARREGAMENTO DE SEU JSON');

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
          
        }, 300);

      });

    }catch(erro) {
          
    }

  };

  /* METODO RESPONSAVEL POR REALIZAR A BUSCA POR UM ITEM ESPECIFICO NA BASE DE DADOS ex.: /?nome=${nome} */
  findByJSONMaquina = async(pesquisa) => {
    try {
      
      DlpController.getJsonAPI(pesquisa)
        .then(response => {
          console.log(response.data);

          try {
            response.data = response.data.replaceAll("|", "");
            response.data = response.data.replaceAll("        ","");
            response.data = response.data.replaceAll("    ","");

            response.data = JSON.parse(response.data);

          }catch(erro) {

          }

          console.log('JSON TRATADO: ');
          console.log(response.data);

          this.setState({
            arrayDlp: response.data
          });

          console.log(response.data);
  
          /* ARMAZENA OS DADOS INVOD DA RESPOSATA NOS CAMPOS ESPECIFICADOS */
          this.atualizarJSON(this.state.arrayDlp);
  
          // INFORMACOES DA MAQUINA -> NESSE CASO ESSES CAMPOS NAO SE ENQUADRAO POIS O ENVIO EM MASSA E DE UMA FORMA DIFERENTE
          this.setState({ grupo_dlp: this.state.arrayDlp[0].grupoDlp });
          this.setState({ computer_name: this.state.arrayDlp[0].computer_name });
          this.setState({ maquina: this.state.arrayDlp[0].maquina });
  
          // DADOS BASE x64 - J1
          this.setState({ titulosADesprezar: this.state.arrayDlp[0].titulosADesprezar });
          this.setState({ classesDebugar: this.state.arrayDlp[0].classesDebugar });
          this.setState({ jansFilhasMonitorar: this.state.arrayDlp[0].jansFilhasMonitorar });
          this.setState({ ipCloud: this.state.arrayDlp[0].ipCloud });
          this.setState({ portaCloud: this.state.arrayDlp[0].portaCloud });
          this.setState({ portaDlp: this.state.arrayDlp[0].portaDlp });
          this.setState({ conectivosExcluir: this.state.arrayDlp[0].conectivosExcluir });
          this.setState({ driveServer: this.state.arrayDlp[0].driveServer });
          this.setState({ cliAtual: this.state.arrayDlp[0].cliAtual });
          this.setState({ grupoDlp: this.state.arrayDlp[0].grupoDlp });
          this.setState({ percentualCompacArquivos: this.state.arrayDlp[0].percentualCompacArquivos });
          this.setState({ origensAlarme: this.state.arrayDlp[0].origensAlarme });
          this.setState({ statusAlarme: this.state.arrayDlp[0].statusAlarme });
          this.setState({ tiposAlarme: this.state.arrayDlp[0].tiposAlarme });
  
          this.setState({ extensoesSensiveis: "txt,xlsx,docx,ppt,pptx,xls,doc,pdf,html,xml" });
          this.setState({ palavrasSensiveis: this.state.arrayDlp[0].palavrasSensiveis });
  
          this.setState({ codCliente: this.state.arrayDlp[0].codCliente });
          this.setState({ codigoMaquinaPorUsuario: this.state.arrayDlp[0].codigoMaquinaPorUsuario });
  
          // DADOS BASE X64 - J2
          /*this.setState({ amostragemGravacaoArquivos: this.state.arrayDlp[0].base64_j2.amostragemGravacaoArquivos });
          this.setState({ amostragemMonitoraçãoAnexos: this.state.arrayDlp[0].base64_j2.amostragemMonitoraçãoAnexos });
          this.setState({ amostragemWatcher: this.state.arrayDlp[0].base64_j2.amostragemWatcher });
          this.setState({ anonimizaDadosRelatorios: this.state.arrayDlp[0].base64_j2.anonimizaDadosRelatorios });
          this.setState({ ativaEmailAlmGraves: this.state.arrayDlp[0].base64_j2.ativaEmailAlmGraves });
          this.setState({ ativaEmailAlmGravissimos: this.state.arrayDlp[0].base64_j2.ativaEmailAlmGravissimos });
          this.setState({ ativaEmailAlmSerios: this.state.arrayDlp[0].base64_j2.ativaEmailAlmSerios });
          this.setState({ ativaSmsAlmGraves: this.state.arrayDlp[0].base64_j2.ativaSmsAlmGraves });
          this.setState({ ativaSmsAlmGravissimos: this.state.arrayDlp[0].base64_j2.ativaSmsAlmGravissimos });
          this.setState({ ativaSmsAlmSerios: this.state.arrayDlp[0].base64_j2.ativaSmsAlmSerios });
          this.setState({ desativaPrintScreen: this.state.arrayDlp[0].base64_j2.desativaPrintScreen });
          this.setState({ filmar_sempre: this.state.arrayDlp[0].base64_j2.filmar_sempre });
          this.setState({ gatilhoLinhasNaoRelevantes: this.state.arrayDlp[0].base64_j2.gatilhoLinhasNaoRelevantes });
          this.setState({ gatilhoLinhasProximas: this.state.arrayDlp[0].base64_j2.gatilhoLinhasProximas });
          this.setState({ informaAcoesUsuario: this.state.arrayDlp[0].base64_j2.informaAcoesUsuario });
          this.setState({ jaCarregueiServer: this.state.arrayDlp[0].base64_j2.jaCarregueiServer });
          this.setState({ maxDadosRelevantes: this.state.arrayDlp[0].base64_j2.maxDadosRelevantes });
          this.setState({ maxLinhasComentario: this.state.arrayDlp[0].base64_j2.maxLinhasComentario });
          this.setState({ monitoraDispExternos: this.state.arrayDlp[0].base64_j2.monitoraDispExternos });
          this.setState({ naoDerrubaMaquina: this.state.arrayDlp[0].base64_j2.naoDerrubaMaquina });
          this.setState({ naoInicializaMaquina: this.state.arrayDlp[0].base64_j2.naoInicializaMaquina });
          this.setState({ percentualRelevancia: this.state.arrayDlp[0].base64_j2.percentualRelevancia });
          this.setState({ qtInfosGrave: this.state.arrayDlp[0].base64_j2.qtInfosGrave });
          this.setState({ qtInfosGravissimo: this.state.arrayDlp[0].base64_j2.qtInfosGravissimo });
          this.setState({ qtInfosSerio: this.state.arrayDlp[0].base64_j2.qtInfosSerio });
          this.setState({ quandoPegarDadosSensiveis: this.state.arrayDlp[0].base64_j2.quandoPegarDadosSensiveis });
          this.setState({ tipoDpo: this.state.arrayDlp[0].base64_j2.tipoDpo });*/
  
          //J2 FIXO, CASO DESEJE PEGAR AS CONFIGURACOES VINDO DO J2 DA MAQUINAS, APENSAS COMENTE ESSA LINHAS ABAIXO E DESCOMENTE AS LINHAS ACIMA
          //---this.setState({ amostragemGravacaoArquivos: '3000' });
          //---this.setState({ amostragemMonitoraçãoAnexos: '3000' });
          //---this.setState({ amostragemWatcher: '2000' });
          this.setState({ anonimizaDadosRelatorios: this.state.arrayDlp[0].anonimizaDadosRelatorios });
          this.setState({ ativaEmailAlmGraves: '1' });
          this.setState({ ativaEmailAlmGravissimos: '1' });
          this.setState({ ativaEmailAlmSerios: '1' });
          this.setState({ ativaSmsAlmGraves: '1' });
          this.setState({ ativaSmsAlmGravissimos: '1' });
          this.setState({ ativaSmsAlmSerios: '1' });
          this.setState({ desativaPrintScreen: this.state.arrayDlp[0].desativaPrintScreen });
          this.setState({ filmar_sempre: this.state.arrayDlp[0].filmar_sempre });
          //---this.setState({ gatilhoLinhasNaoRelevantes: '5' });
          //---this.setState({ gatilhoLinhasProximas: '5' });
          //---this.setState({ informaAcoesUsuario: '1' });
          //---this.setState({ jaCarregueiServer: '1' });
          //---this.setState({ maxDadosRelevantes: '15' });
          //---this.setState({ maxLinhasComentario: '15' });
          this.setState({ monitoraDispExternos: "1"/*this.state.arrayDlp[0].base64_j2.monitoraDispExternos*/ });
          //---this.setState({ naoDerrubaMaquina: '1' });
          //---this.setState({ naoInicializaMaquina: '1' });
          //---this.setState({ percentualRelevancia: '30' });
          //---this.setState({ qtInfosGrave: '15' });
          //---this.setState({ qtInfosGravissimo: '100' });
          //---this.setState({ qtInfosSerio: '3' });
          this.setState({ quandoPegarDadosSensiveis: this.state.arrayDlp[0].quandoPegarDadosSensiveis });
          //---this.setState({ tipoDpo: '1' });
  
          this.setState({ imgBlockPrtSc: "/j/users/dlp/TELA_BLOQUEIO_PRINT.png" });
          this.setState({ qtMinQualifsTab:"3" });
          this.setState({ qtMinQualifsDoc:"5" });
          this.setState({ maxQtFalsosNomes:"3" });
          this.setState({ qtPalsManterQualificador:"1" });
          this.setState({ QtMaxLinhasResult:"60" });
          this.setState({ tMinQualifsTab:"3" });
          this.setState({ comFonetizacao:"1" });
          this.setState({ notaCorteSerios:"20" });
          this.setState({ notaCorteGraves:"100" });
          this.setState({ notaCorteGravissimos:"500" });
          
          this.setState({ tempoDragAndDrop: this.state.arrayDlp[0].tempoDragAndDrop });
          this.setState({ impressaoSpooler: this.state.arrayDlp[0].impressaoSpooler });

          try {
            this.setState({ codVBios: this.state.arrayDlp[0].codVBios });

          }catch(err) {
            console.log('NAO FOI LOCALIZADO O codVBios');

          }

          try {
            this.setState({ mapperAtivado: this.state.arrayDlp[0].mapperAtivado });

          }catch(err) {
            console.log('NAO FOI LOCALIZADO O mapperAtivado');

          }
          
          if(String(this.state.pastasSensiveis).toLowerCase() === undefined || String(this.state.pastasSensiveis).toLowerCase() === null) {
            this.setState({ pastasSensiveis: 'C:\\temp' });
  
          }else {
            try {
              var memoriaPastasSensiveis = '';
  
              memoriaPastasSensiveis = this.state.arrayDlp[0].pastasSensiveis.split('//').join('\\');
              memoriaPastasSensiveis = this.state.arrayDlp[0].pastasSensiveis.replace(/\\\\/g,"\\");
  
              this.setState({ pastasSensiveis: memoriaPastasSensiveis });
  
            }catch(erro) {
              //alert("ATENCAO | Ocorreu algum erro no carregamento de seu JSON, verifique com o suporte da ferramenta.");
              console.log("ATENCAO | Ocorreu algum erro no carregamento de seu JSON, verifique com o suporte da ferramenta.");
              //console.log(erro);
  
            }
  
          }

          try {
            /* VERIFICA SE O USUARIO TEM codVBios ou nao */
            let memoriaArrayNomeMaquinas = this.state.arrayNomeMaquinas;
            this.state.arrayNomeMaquinas = [];

            let codVBiosIdentificado = false;

            if(this.state.codVBios === "0" || this.state.codVBios === "1") {
              codVBiosIdentificado = true;
            
            }else if(this.state.codVBios === '' || this.state.codVBios === null) {
              codVBiosIdentificado = false;
            }

            let testeMemoria = [];

            memoriaArrayNomeMaquinas.map(item => {
              if(item.hash_maquina.includes('_') && codVBiosIdentificado) {
                testeMemoria.push(item);
                console.log('MAQUINA SOMENTE COM CODIGO VBIOS SERA APRESENTADO');

              }else if(!item.hash_maquina.includes('_') && !codVBiosIdentificado) {
                testeMemoria.push(item);
                console.log('MAQUINA SOMENTE SEM CODIGO VBIOS SERA APRESENTADO');
                
              }

            });

            this.setState({ arrayNomeMaquinas: testeMemoria });

            console.log('VALOR MEMORIA: ');
            console.log(this.state.arrayNomeMaquinas);

          }catch(err) {
            alert(`Não foi possível identificar sua maquina logada. \nPor favor, verifique com o suporte da plataforma. \nLogin que esta sendo utilizado no momento: ${Buffer.from(DlpController.capituraToken(), "base64").toString().split('-')[0]}`);
            window.location.href = DlpController.ambienteRedirecionamento();

          }

      }).catch(erro => {
        alert('OCORREU UM ERRO COM O CARREGAMENTO DE SEU JSON');

        this.state.token = DlpController.capituraToken();

        var tokenAcesso = this.state.token;
        
        setTimeout(function() {
          //window.location.href = `${DlpController.ambienteRedirecionamentoReact()}/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
          
        }, 300);

      });

    }catch(erro) {
          
    }

  };

  /* =================== */
  /* === METODO POST === */
  /* =================== */

  /* ADICIONA UM NOVO ITEM NO L3 */
  postIndexL3 = async(novoItem) => {
    /*console.log("Item recebido")
    console.log(novoItem)*/

    if(String(novoItem.derruba_app).toLowerCase() == "true") {
      novoItem.derruba_app = true;
  
    }else if(String(novoItem.derruba_app).toLowerCase() == "false") {
      novoItem.derruba_app = false;

    }else {
      novoItem.derruba_app = this.state.derruba_app;
    }

    if(String(novoItem.filma).toLowerCase() == "true") {
      novoItem.filma = true;
    
    }else if(String(novoItem.filma).toLowerCase() == "false") {
      novoItem.filma = false;

    }else {
      novoItem.filma = this.state.filma;

    }

    if(String(novoItem.impede_copia).toLowerCase() == "true") {
      novoItem.impede_copia = true;
    
    }else if(String(novoItem.impede_copia).toLowerCase() == "false") {
      novoItem.impede_copia = false;

    }else {
      novoItem.impede_copia = this.state.impede_copia;

    }

    if(String(novoItem.monitora_dados).toLowerCase() == "true") {
      novoItem.monitora_dados = true;
    
    }else if(String(novoItem.monitora_dados).toLowerCase() == "false") {
      novoItem.monitora_dados = false;

    }else {
      novoItem.monitora_dados = this.state.monitora_dados;

    }

    if(String(novoItem.particular).toLowerCase() == "true") {
      novoItem.particular = true;
    
    }else if(String(novoItem.particular).toLowerCase() == "false") {
      novoItem.particular = false;

    }else {
      novoItem.particular = this.state.particular;

    }

    if(String(novoItem.print).toLowerCase() == "true") {
      novoItem.print = true;
    
    }else if(String(novoItem.print).toLowerCase() == "false") {
      novoItem.print = false;

    }else {
      novoItem.print = this.state.print;

    }

    if(String(novoItem.registra_copia).toLowerCase() == "true") {
      novoItem.registra_copia = true;
    
    }else if(String(novoItem.registra_copia).toLowerCase() == "false") {
      novoItem.registra_copia = false;

    }else {
      novoItem.registra_copia = this.state.registra_copia;

    }

    if(String(novoItem.impede_dados).toLowerCase() == "true") {
      novoItem.impede_dados = true;
    
    }else if(String(novoItem.impede_dados).toLowerCase() == "false") {
      novoItem.impede_dados = false;

    }else {
      novoItem.impede_dados = this.state.impede_dados;

    }

    /* ==================================== */
    /* ATRIBUI UM VALOR FIXO AO JSON E TIPO */
    /* ==================================== */
    if(novoItem.json != "1") {
      novoItem.json = 2;
      novoItem.tipo = 1;
    }

    /*console.log("Dados atualizado: ");
    console.log(novoItem);

    console.log("Acessou o metodo POST para inserir um Novo Item");*/

    this.state.base64_j3.push(novoItem);

    /* DESSA FORMA OS NOVOS DADOS IRAM REFLETIR NO FRONT-END */
    this.setState({ base64_j3: this.state.base64_j3 });

    /* AJUSTA QUALQUER INCONSISTENCIA NAS PASTAS SENSIVEIS */
    try {
      this.state.pastasSensiveis = this.state.pastasSensiveis.split('\\\\').join('\\');
      this.state.pastasSensiveis = this.state.pastasSensiveis.replace(/\\\\/g,"\\");

    }catch(err) {
      console.log('Nao contem o campo: pastasSensiveis no JSON');
    }

    /* ENVIA UM ALERTA DE FEEDBACK AO USUARIO */
    alert("Item adicionado com sucesso!");

  }

  validaJSON = async (json, trava) => {

    if(typeof String(json.grupo_dlp).toLowerCase() === 'string' && 
      typeof String(json.computer_name).toLowerCase() === 'string' && 
      typeof String(json.maquina).toLowerCase() === 'string') {
      
        alert('Todos os campos de maquinas foram verificas e estao com as tipagens OK!');

    }else {
      trava = true;

      alert('Existe uma divergencia no JSON (Campos de maquinas) , corrija o erro, antes de enviar ao banco de dados!');

    }

    if(typeof String(json.base64_j1[0].json).toLowerCase() === 'string' && 
      typeof String(json.base64_j1[0].classesDebugar).toLowerCase() === 'string' &&
      typeof String(json.base64_j1[0].cliAtual).toLowerCase() === 'string' &&
      typeof String(json.base64_j1[0].conectivosExcluir).toLowerCase() === 'string' &&
      typeof String(json.base64_j1[0].driveServer).toLowerCase() === 'string' &&
      typeof String(json.base64_j1[0].grupoDlp).toLowerCase() === 'string' && 
      typeof String(json.base64_j1[0].ipCloud).toLowerCase() === 'string' && 
      typeof String(json.base64_j1[0].jansFilhasMonitorar).toLowerCase() === 'string' &&
      typeof String(json.base64_j1[0].origensAlarme).toLowerCase() === 'string' &&
      typeof String(json.base64_j1[0].percentualCompacArquivos).toLowerCase() === 'string' &&
      typeof String(json.base64_j1[0].portaCloud).toLowerCase() === 'string' &&
      typeof String(json.base64_j1[0].portaDlp).toLowerCase() === 'string' &&
      typeof String(json.base64_j1[0].statusAlarme).toLowerCase() === 'string' &&
      typeof String(json.base64_j1[0].tiposAlarme).toLowerCase() === 'string' &&
      typeof String(json.base64_j1[0].titulosADesprezar).toLowerCase() === 'string' &&
      typeof String(json.base64_j1[0].extensoesSensiveis).toLowerCase() === 'string' &&
      typeof String(json.base64_j1[0].codCliente).toLowerCase() === 'string' &&
      typeof String(json.base64_j1[0].codigoMaquinaPorUsuario).toLowerCase() === 'string') {

        alert('Todos os campos do J1 foram verificas e estao com as tipagens OK!');

      }else {
        trava = true;

        alert('Existe uma divergencia no JSON (J1), corrija o erro, antes de enviar ao banco de dados!');

      }

      if(typeof String(json.base64_j2[0].anonimizaDadosRelatorios).toLowerCase() === 'string' &&
        typeof String(json.base64_j2[0].ativaEmailAlmGraves).toLowerCase() === 'string' && 
        typeof String(json.base64_j2[0].ativaEmailAlmGravissimos).toLowerCase() === 'string' &&
        typeof String(json.base64_j2[0].ativaEmailAlmSerios).toLowerCase() === 'string' &&
        typeof String(json.base64_j2[0].ativaSmsAlmGraves).toLowerCase() === 'string' &&
        typeof String(json.base64_j2[0].ativaSmsAlmGravissimos).toLowerCase() === 'string' &&
        typeof String(json.base64_j2[0].ativaSmsAlmSerios).toLowerCase() === 'string' &&
        typeof String(json.base64_j2[0].desativaPrintScreen).toLowerCase() === 'string' &&
        typeof String(json.base64_j2[0].filmar_sempre).toLowerCase() === 'string' &&
        typeof String(json.base64_j2[0].monitoraDispExternos).toLowerCase() === 'string' &&
        typeof String(json.base64_j2[0].quandoPegarDadosSensiveis).toLowerCase() === 'string' &&
        typeof String(json.base64_j2[0].imgBlockPrtSc).toLowerCase() === 'string' &&
        typeof String(json.base64_j2[0].qtMinQualifsTab).toLowerCase() === 'string' &&
        typeof String(json.base64_j2[0].qtMinQualifsDoc).toLowerCase() === 'string' &&
        typeof String(json.base64_j2[0].maxQtFalsosNomes).toLowerCase() === 'string' &&
        typeof String(json.base64_j2[0].qtPalsManterQualificador).toLowerCase() === 'string' &&
        typeof String(json.base64_j2[0].QtMaxLinhasResult).toLowerCase() === 'string' &&
        typeof String(json.base64_j2[0].tMinQualifsTab).toLowerCase() === 'string' &&
        typeof String(json.base64_j2[0].comFonetizacao).toLowerCase() === 'string' &&
        typeof String(json.base64_j2[0].notaCorteSerios).toLowerCase() === 'string' &&
        typeof String(json.base64_j2[0].notaCorteGraves).toLowerCase() === 'string' &&
        typeof String(json.base64_j2[0].notaCorteGravissimos).toLowerCase() === 'string' &&
        typeof String(json.base64_j2[0].pastasSensiveis).toLowerCase() === 'string'
        && typeof String(json.base64_j2[0].tempoDragAndDrop).toLowerCase() === 'string' &&
        typeof String(json.base64_j2[0].impressaoSpooler).toLowerCase() === 'string') {

          alert('Todos os campos do J2 foram verificas e estao com as tipagens OK!');

        }else {
          trava = true;

          alert('Existe uma divergencia no JSON (J2), corrija o erro, antes de enviar ao banco de dados!');

        }

        for(let i = 0; i < json.base64_j3.length; i++){
          if(typeof json.base64_j3[i].derruba_app === 'boolean' &&
            typeof json.base64_j3[i].filma === 'boolean' &&
            typeof json.base64_j3[i].impede_copia === 'boolean' && 
            typeof json.base64_j3[i].json === 'boolean' &&
            typeof json.base64_j3[i].monitora_dados === 'boolean' &&
            typeof json.base64_j3[i].particular === 'boolean' &&
            typeof json.base64_j3[i].print === 'boolean' &&
            typeof json.base64_j3[i].registra_copia === 'boolean' &&
            typeof json.base64_j3[i].tipo === 'boolean' &&
            typeof json.base64_j3[i].filtro_titulo === 'boolean' &&
            typeof json.base64_j3[i].executavel === 'boolean' &&
            typeof json.base64_j3[i].impede_dados === 'boolean') {

              alert('Todos os campos do J2 foram verificas e estao com as tipagens OK!');

          }else {
            trava = true;

            alert(`Existe uma divergencia no JSON (J3) array: [${i}], corrija o erro, antes de enviar ao banco de dados!`);

          }
        }

  }

  /* ATUALIZA UM ITEM DO J3 */
  putIndexL3 = async(index, executavel, itemExistente) => {
    /*console.log("Acessou o metodo PUT para atualizar um Item existente");
    console.log(`Index: ${index}`);
    console.log("Objeto a ser inserido e atualizado");
    console.log(itemExistente);

    console.log("Dados recebidos do OBSERVADOR L3, POSICAO ATUAL PUT: ");
    console.log(itemExistente.derruba_app);
    console.log(itemExistente.filma);
    console.log(itemExistente.impede_copia);
    console.log(itemExistente.json);
    console.log(itemExistente.monitora_dados);
    console.log(itemExistente.particular);
    console.log(itemExistente.print);
    console.log(itemExistente.registra_copia);
    console.log(itemExistente.tipo);
    console.log(itemExistente.filtro_titulo);
    console.log(itemExistente.executavel);*/

    //this.state.base64_j3[index].push(itemExistente);

    for(let i = 0; i < this.state.base64_j3.length; i++) {

      if(this.state.base64_j3[i].filtro_titulo == index && String(index).toLowerCase() != "") { 
        /*console.log("ANTES: ")
        console.log(itemExistente.derruba_app);*/

        if(String(itemExistente.derruba_app).toLowerCase() == "true") {
          itemExistente.derruba_app = true;
      
        }else if(String(itemExistente.derruba_app).toLowerCase() == "false") {
          itemExistente.derruba_app = false;
  
        }else {
          itemExistente.derruba_app = this.state.derruba_app;

        }

        /*console.log("DEPOIS: ")
        console.log(itemExistente.derruba_app);

        console.log("ANTES: ")
        console.log(itemExistente.filma);*/
  
        if(String(itemExistente.filma).toLowerCase() == "true") {
          itemExistente.filma = true;
        
        }else if(String(itemExistente.filma).toLowerCase() == "false") {
          itemExistente.filma = false;
  
        }else {
          itemExistente.filma = this.state.filma;

        }

        /*console.log("DEPOIS: ")
        console.log(itemExistente.filma);

        console.log("ANTES: ")
        console.log(itemExistente.impede_copia);*/
  
        if(String(itemExistente.impede_copia).toLowerCase() == "true") {
          itemExistente.impede_copia = true;
        
        }else if(String(itemExistente.impede_copia).toLowerCase() == "false") {
          itemExistente.impede_copia = false;
  
        }else {
          itemExistente.impede_copia = this.state.impede_copia;

        }

        /*console.log("DEPOIS: ")
        console.log(itemExistente.impede_copia);

        console.log("ANTES: ")
        console.log(itemExistente.monitora_dados);*/
  
        if(String(itemExistente.monitora_dados).toLowerCase() == "true") {
          itemExistente.monitora_dados = true;
        
        }else if(String(itemExistente.monitora_dados).toLowerCase() == "false") {
          itemExistente.monitora_dados = false;
  
        }else {
          itemExistente.monitora_dados = this.state.monitora_dados;

        }

        /*console.log("DEPOIS: ")
        console.log(itemExistente.monitora_dados);

        console.log("ANTES: ")
        console.log(itemExistente.particular);*/
  
        if(String(itemExistente.particular).toLowerCase() == "true") {
          itemExistente.particular = true;
        
        }else if(String(itemExistente.particular).toLowerCase() == "false") {
          itemExistente.particular = false;
  
        }else {
          itemExistente.particular = this.state.particular;

        }

        /*console.log("DEPOIS: ")
        console.log(itemExistente.particular);

        console.log("ANTES: ")
        console.log(itemExistente.print);*/
  
        if(String(itemExistente.print).toLowerCase() == "true") {
          itemExistente.print = true;
        
        }else if(String(itemExistente.print).toLowerCase() == "false") {
          itemExistente.print = false;
  
        }else {
          itemExistente.print = this.state.print;

        }

        /*console.log("DEPOIS: ")
        console.log(itemExistente.print);

        console.log("ANTES: ")
        console.log(itemExistente.registra_copia);*/
  
        if(String(itemExistente.registra_copia).toLowerCase() == "true") {
          itemExistente.registra_copia = true;
        
        }else if(String(itemExistente.registra_copia).toLowerCase() == "false") {
          itemExistente.registra_copia = false;
  
        }else {
          itemExistente.registra_copia = this.state.registra_copia;

        }

        /*console.log("DEPOIS: ")
        console.log(itemExistente.registra_copia);

        console.log("ANTES: ")
        console.log(itemExistente.impede_dados);*/

        if(String(itemExistente.impede_dados).toLowerCase() == "true") {
          itemExistente.impede_dados = true;
        
        }else if(String(itemExistente.impede_dados).toLowerCase() == "false") {
          itemExistente.impede_dados = false;
  
        }else {
          itemExistente.impede_dados = this.state.impede_dados;

        }

        /*console.log("DEPOIS: ")
        console.log(itemExistente.impede_dados);*/

        this.state.base64_j3[i].derruba_app = itemExistente.derruba_app;
        this.state.base64_j3[i].filma = itemExistente.filma;
        this.state.base64_j3[i].impede_copia = itemExistente.impede_copia;
        this.state.base64_j3[i].json = itemExistente.json;
        this.state.base64_j3[i].monitora_dados = itemExistente.monitora_dados;
        this.state.base64_j3[i].particular = itemExistente.particular;
        this.state.base64_j3[i].print = itemExistente.print;
        this.state.base64_j3[i].registra_copia = itemExistente.registra_copia;
        this.state.base64_j3[i].tipo = itemExistente.tipo;
        this.state.base64_j3[i].filtro_titulo = itemExistente.filtro_titulo;
        this.state.base64_j3[i].executavel = itemExistente.executavel;
        this.state.base64_j3[i].impede_dados = itemExistente.impede_dados;

      } else if(this.state.base64_j3[i].executavel == executavel && String(executavel).toLowerCase() != "") {
        /*console.log("ANTES: ")
        console.log(itemExistente.derruba_app);*/

        if(String(itemExistente.derruba_app).toLowerCase() == "true") {
          itemExistente.derruba_app = true;
      
        }else if(String(itemExistente.derruba_app).toLowerCase() == "false") {
          itemExistente.derruba_app = false;
  
        }else {
          itemExistente.derruba_app = this.state.derruba_app;

        }

        /*console.log("DEPOIS: ")
        console.log(itemExistente.derruba_app);

        console.log("ANTES: ")
        console.log(itemExistente.filma);*/
  
        if(String(itemExistente.filma).toLowerCase() == "true") {
          itemExistente.filma = true;
        
        }else if(String(itemExistente.filma).toLowerCase() == "false") {
          itemExistente.filma = false;
  
        }else {
          itemExistente.filma = this.state.filma;

        }

        /*console.log("DEPOIS: ")
        console.log(itemExistente.filma);

        console.log("ANTES: ")
        console.log(itemExistente.impede_copia);*/
  
        if(String(itemExistente.impede_copia).toLowerCase() == "true") {
          itemExistente.impede_copia = true;
        
        }else if(String(itemExistente.impede_copia).toLowerCase() == "false") {
          itemExistente.impede_copia = false;
  
        }else {
          itemExistente.impede_copia = this.state.impede_copia;

        }

        /*console.log("DEPOIS: ")
        console.log(itemExistente.impede_copia);

        console.log("ANTES: ")
        console.log(itemExistente.monitora_dados);*/
  
        if(String(itemExistente.monitora_dados).toLowerCase() == "true") {
          itemExistente.monitora_dados = true;
        
        }else if(String(itemExistente.monitora_dados).toLowerCase() == "false") {
          itemExistente.monitora_dados = false;
  
        }else {
          itemExistente.monitora_dados = this.state.monitora_dados;

        }

        /*console.log("DEPOIS: ")
        console.log(itemExistente.monitora_dados);

        console.log("ANTES: ")
        console.log(itemExistente.particular);*/
  
        if(String(itemExistente.particular).toLowerCase() == "true") {
          itemExistente.particular = true;
        
        }else if(String(itemExistente.particular).toLowerCase() == "false") {
          itemExistente.particular = false;
  
        }else {
          itemExistente.particular = this.state.particular;

        }

        /*console.log("DEPOIS: ")
        console.log(itemExistente.particular);

        console.log("ANTES: ")
        console.log(itemExistente.print);*/
  
        if(String(itemExistente.print).toLowerCase() == "true") {
          itemExistente.print = true;
        
        }else if(String(itemExistente.print).toLowerCase() == "false") {
          itemExistente.print = false;
  
        }else {
          itemExistente.print = this.state.print;

        }

        /*console.log("DEPOIS: ")
        console.log(itemExistente.print);

        console.log("ANTES: ")
        console.log(itemExistente.registra_copia);*/
  
        if(String(itemExistente.registra_copia).toLowerCase() == "true") {
          itemExistente.registra_copia = true;
        
        }else if(String(itemExistente.registra_copia).toLowerCase() == "false") {
          itemExistente.registra_copia = false;
  
        }else {
          itemExistente.registra_copia = this.state.registra_copia;

        }

        /*console.log("DEPOIS: ")
        console.log(itemExistente.registra_copia);
        
        console.log("ANTES: ")
        console.log(itemExistente.impede_dados);*/

        if(String(itemExistente.impede_dados).toLowerCase() == "true") {
          itemExistente.impede_dados = true;
        
        }else if(String(itemExistente.impede_dados).toLowerCase() == "false") {
          itemExistente.impede_dados = false;
  
        }else {
          itemExistente.impede_dados = this.state.impede_dados;

        }

        /*console.log("DEPOIS: ")
        console.log(itemExistente.impede_dados);*/

        this.state.base64_j3[i].derruba_app = itemExistente.derruba_app;
        this.state.base64_j3[i].filma = itemExistente.filma;
        this.state.base64_j3[i].impede_copia = itemExistente.impede_copia;
        this.state.base64_j3[i].json = itemExistente.json;
        this.state.base64_j3[i].monitora_dados = itemExistente.monitora_dados;
        this.state.base64_j3[i].particular = itemExistente.particular;
        this.state.base64_j3[i].print = itemExistente.print;
        this.state.base64_j3[i].registra_copia = itemExistente.registra_copia;
        this.state.base64_j3[i].tipo = itemExistente.tipo;
        this.state.base64_j3[i].filtro_titulo = itemExistente.filtro_titulo;
        this.state.base64_j3[i].executavel = itemExistente.executavel;
        this.state.base64_j3[i].impede_dados = itemExistente.impede_dados;

      }

      /* ==================================== */
      /* ATRIBUI UM VALOR FIXO AO JSON E TIPO */
      /* ==================================== */
      if(this.state.base64_j3[i].json != "1") {
        this.state.base64_j3[i].json = 2;
        this.state.base64_j3[i].tipo = 1;
      }

    }

    /*console.log("DADOS APOS A VERIFICACAO IF ELSE DE TRUE OU FALSE: ");
    console.log(itemExistente.derruba_app);
    console.log(itemExistente.filma);
    console.log(itemExistente.impede_copia);
    console.log(itemExistente.json);
    console.log(itemExistente.monitora_dados);
    console.log(itemExistente.particular);
    console.log(itemExistente.print);
    console.log(itemExistente.registra_copia);
    console.log(itemExistente.tipo);
    console.log(itemExistente.filtro_titulo);
    console.log(itemExistente.executavel);
    console.log(itemExistente.impede_dados);

    console.log("Dados recebidos: ");
    console.log(itemExistente);*/

    console.log("J3 ATUAL");
    console.log(this.state.base64_j3);

    /* DESSA FORMA OS NOVOS DADOS IRAM REFLETIR NO FRONT-END */
    this.setState({ base64_j3: this.state.base64_j3 });

    try{
      /* AJUSTA QUALQUER INCONSISTENCIA NAS PASTAS SENSIVEIS */
      this.state.pastasSensiveis = this.state.pastasSensiveis.split('\\\\').join('\\');
      this.state.pastasSensiveis = this.state.pastasSensiveis.replace(/\\\\/g,"\\");
      
    }catch(err) {
      console.log('Nao contem o campo: pastasSensiveis no JSON');
    }

    /* ENVIA UM ALERTA DE FEEDBACK AO USUARIO */
    alert("Item atualizado com sucesso!");
    //this.mostrarAlerta("Item atualizado com sucesso!");

  }

  /* ===================== */
  /* === METODO DELETE === */
  /* ===================== */

  /* DELETE UM ITEM ESPECIFICO, E PARA ISSO PASSANDO COMO PARAMENTRO SEU tipo */
  deleteIndexL3 = async(nome) => {
    //console.log(`Nome a ser deletado: ${nome}`);

    //console.log("Acessou o metodo DELETE e realizaou a exclusao de um Item");

    if(this.state.base64_j3.length == 1) {
      alert("Você não pode deletar esse item, adicione um novo para poder deleta-lo!");

    }else {

      for(let i = 0; i < this.state.base64_j3.length; i++) {

        if(this.state.base64_j3[i].filtro_titulo == nome) {

          // VERIFICA SE O ITEM EXISTE NO ARRAY
          var index = this.state.base64_j3[i].filtro_titulo.indexOf(nome);

          /*console.log("Resultado: "+ this.state.base64_j3[i].filtro_titulo.indexOf(nome));
          console.log("Valor a ser deletado: "+ this.state.base64_j3[i].filtro_titulo);*/

          // DEPENDENDO DA RESPOSTA ELE ACESSA PARA EXCLUIR O ITEM OU NAO
          if ( index > -1) {
            // EXCLUI O ITEM ESPECIFICO, PARA ISSO PASSANDO COMO PARAMENTRO O INDICE DO ITEM NO ARRAY E A QTD DE ITENS APOS ELE VC DESEJA EXCLUIR, NESSE CASO SERA APENAS 1, OU SEJA, ELE MESMO
            this.state.base64_j3.splice(i, 1);

          }

        }

      }

      /*console.log("J3 atualizado: ");
      console.log(this.state.base64_j3);*/

      /* DESSA FORMA OS NOVOS DADOS IRAM REFLETIR NO FRONT-END */
      this.setState({ base64_j3: this.state.base64_j3 });

      alert("Item deletado com sucesso!");

    }

  }

  /* ================================================ */
  /* === DESCRIPTOGRAFA O JSON OBTIDO DA RESPOSTA === */
  /* ================================================ */

  converterJSON = async (obj) => {
    /* NAVEGA ENTRE O JSON DESCRIPTOGRAFANDO CADA CAMPO ESPECIFICO ARMAZENDO O RESULTADO EM VARIAVEIS */

    /* DESCRIPTOGRAFA O JSON E ARMAZENA OS DADOS EM VARIAVEIS PARA QUE POSSAM SER MANIPULADAS NO FRONT */
    for(let i = 0; i < obj.length; i++) {
      let base64ToString = Buffer.from(obj[i].base64_j1, "base64").toString();
      base64ToString = JSON.parse(base64ToString);

      obj[i].base64_j1 = base64ToString;
      obj[i].base64_j1.json = "vars";

      console.log("J1");
      console.log(obj[i].base64_j1);

      let base64ToString2 = Buffer.from(obj[i].base64_j2, "base64").toString();
      base64ToString2 = JSON.parse(base64ToString2);

      obj[i].base64_j2 = base64ToString2;

      console.log("J2");
      console.log(obj[i].base64_j2);

      let base64ToString3 = Buffer.from(obj[i].base64_j3, "base64").toString();

      console.log('J3')
      console.log(base64ToString3)

      base64ToString3 = JSON.parse(base64ToString3);

      obj[i].base64_j3 = base64ToString3;

      console.log("Meu J3");
      console.log(obj[i].base64_j3);

    }

    /* ======================================= */
    /* === CONVERTENDO STRING PARA BOOLEAN === */
    /* ======================================= */
    
    try {
      for(let i = 0; i < obj[0].base64_j3.length; i++) {
        
        if(String(obj[0].base64_j3[i].derruba_app).toLowerCase() == "true") {
          obj[0].base64_j3[i].derruba_app = true;
      
        }else if(String(obj[0].base64_j3[i].derruba_app).toLowerCase() == "false") {
          obj[0].base64_j3[i].derruba_app = false;

        }

        if(String(obj[0].base64_j3[i].filma).toLowerCase() == "true") {
          obj[0].base64_j3[i].filma = true;
        
        }else if(String(obj[0].base64_j3[i].filma).toLowerCase() == "false") {
          obj[0].base64_j3[i].filma = false;

        }

        if(String(obj[0].base64_j3[i].impede_copia).toLowerCase() == "true") {
          obj[0].base64_j3[i].impede_copia = true;
        
        }else if(String(obj[0].base64_j3[i].impede_copia).toLowerCase() == "false") {
          obj[0].base64_j3[i].impede_copia = false;

        }

        if(String(obj[0].base64_j3[i].monitora_dados).toLowerCase() == "true") {
          obj[0].base64_j3[i].monitora_dados = true;
        
        }else if(String(obj[0].base64_j3[i].monitora_dados).toLowerCase() == "false") {
          obj[0].base64_j3[i].monitora_dados = false;

        }

        if(String(obj[0].base64_j3[i].particular).toLowerCase() == "true") {
          obj[0].base64_j3[i].particular = true;
        
        }else if(String(obj[0].base64_j3[i].particular).toLowerCase() == "false") {
          obj[0].base64_j3[i].particular = false;

        }

        if(String(obj[0].base64_j3[i].print).toLowerCase() == "true") {
          obj[0].base64_j3[i].print = true;
        
        }else if(String(obj[0].base64_j3[i].print).toLowerCase() == "false") {
          obj[0].base64_j3[i].print = false;

        }

        if(String(obj[0].base64_j3[i].registra_copia).toLowerCase() == "true") {
          obj[0].base64_j3[i].registra_copia = true;
        
        }else if(String(obj[0].base64_j3[i].registra_copia).toLowerCase() == "false") {
          obj[0].base64_j3[i].registra_copia = false;

        }

        if(String(obj[0].base64_j3[i].impede_dados).toLowerCase() == "true") {
          obj[0].base64_j3[i].impede_dados = true;
        
        }else if(String(obj[0].base64_j3[i].impede_dados).toLowerCase() == "false") {
          obj[0].base64_j3[i].impede_dados = false;

        }

      }

    

    /* ATRIBUI OS DADOS DESCRIPTOGRAFADOS AO ARRAY NOVAMENTE PARA QUE POSSA SER MANIPULADO */
    this.setState({
      arrayDlp: obj

    });

    /* ARMAZENA SOMENTE O CONTEUDO DE J3 */
    this.setState({
      base64_j3: obj[0].base64_j3
    });

    }catch(erro) {

    }

  }

  /* ================================================ */
  /* === DESCRIPTOGRAFA O JSON OBTIDO DA RESPOSTA === */
  /* ================================================ */

  atualizarJSON = async (obj) => {
    for(let i = 1; i < obj.length; i++) {
      
      if(String(obj[i].derruba_app).toLowerCase() == "true") {
        obj[i].derruba_app = true;
    
      }else if(String(obj[i].derruba_app).toLowerCase() == "false") {
        obj[i].derruba_app = false;

      }

      if(String(obj[i].filma).toLowerCase() == "true") {
        obj[i].filma = true;
      
      }else if(String(obj[i].filma).toLowerCase() == "false") {
        obj[i].filma = false;

      }

      if(String(obj[i].impede_copia).toLowerCase() == "true") {
        obj[i].impede_copia = true;
      
      }else if(String(obj[i].impede_copia).toLowerCase() == "false") {
        obj[i].impede_copia = false;

      }

      if(String(obj[i].monitora_dados).toLowerCase() == "true") {
        obj[i].monitora_dados = true;
      
      }else if(String(obj[i].monitora_dados).toLowerCase() == "false") {
        obj[i].monitora_dados = false;

      }

      if(String(obj[i].particular).toLowerCase() == "true") {
        obj[i].particular = true;
      
      }else if(String(obj[i].particular).toLowerCase() == "false") {
        obj[i].particular = false;

      }

      if(String(obj[i].print).toLowerCase() == "true") {
        obj[i].print = true;
      
      }else if(String(obj[i].print).toLowerCase() == "false") {
        obj[i].print = false;

      }

      if(String(obj[i].registra_copia).toLowerCase() == "true") {
        obj[i].registra_copia = true;
      
      }else if(String(obj[i].registra_copia).toLowerCase() == "false") {
        obj[i].registra_copia = false;

      }

      if(String(obj[i].impede_dados).toLowerCase() == "true") {
        obj[i].impede_dados = true;
      
      }else if(String(obj[i].impede_dados).toLowerCase() == "false") {
        obj[i].impede_dados = false;

      }

    }

    /* ATRIBUI OS DADOS DESCRIPTOGRAFADOS AO ARRAY NOVAMENTE PARA QUE POSSA SER MANIPULADO */
    this.setState({
      arrayDlp: obj

    });

    var objetoJsonDefault = [];

    for(let i = 1; i < obj.length; i++) {
      objetoJsonDefault.push(obj[i]);
    }

    /* ARMAZENA SOMENTE O CONTEUDO DE J3 */
    this.setState({
      base64_j3: objetoJsonDefault
    });

    console.log(this.state.base64_j3);

  }

  /* ================== */
  /* === ZERA ARRAY === */
  /* ================== */
  zerarVariaveis = async () => {
    this.state.nome = '';

    this.setState({
      arrayDlp: []
    });

  }

  /* ===================================== */
  /* === ZERA VARIAVEIS DE AMBIENTE J3 === */
  /* ===================================== */
  zerarVariaviesJ3 = async () => {
    this.state.derruba_app = false;
    this.state.filma = false;
    this.state.impede_copia = false;
    this.state.json = 0;
    this.state.monitora_dados = false;
    this.state.particular = false;
    this.state.print = false;
    this.state.registra_copia = false;
    this.state.tipo = '';
    this.state.filtro_titulo = '';
    this.state.executavel = '';
    this.state.impede_dados = false;

  }

  ajustaBarras = async () => {
    try{
      /* AJUSTA QUALQUER INCONSISTENCIA NAS PASTAS SENSIVEIS */
      this.state.pastasSensiveis = this.state.pastasSensiveis.split('\\\\').join('\\');
      this.state.pastasSensiveis = this.state.pastasSensiveis.replace(/\\\\/g,"\\");

    }catch(err) {
      console.log('Nao contem o campo: pastasSensiveis no JSON');
    }

  }

  /* ========================== */
  /* CONTADOR DE COMPRIMENTO J3 */ /* VERIFICAR SE ESSE PODE SER O OCASIONADOR DO ERRO APOS TRES ALTERACOES OS DADOS RESETAM TEM QUE VER ISSO */
  /* ========================== */
  verificadorIndexJ3 = async () => {
    this.setState({
      comprimentoJ3: this.state.comprimentoJ3 + 1
    });

    //console.log(this.state.comprimentoJ3);

  }

  /* ================================= */
  /* VERIFICA PERMISSAO DE USUARIO (*) */
  /* ================================= */
  verificarPrivilegio = async () => {
    //console.log("Acessou o Verifica Privilegio");

    /* CAPTURA O TOKEN POR MEIO DO METODO CONTROLLER QUE TRAZ DO AXIOS O TOKEN DO USUARIO CADASTRADO */
    let tokenUsuario = DlpController.capituraToken();
    /*console.log("Token CRIPTOGRAFADO");
    console.log(tokenUsuario);*/

    /* DESCRIPTOGRAFA O TOKEN */
    let base64ToString = '';
    try {
      base64ToString = Buffer.from(tokenUsuario, "base64").toString()
    
    }catch(erro) {
      console.log('VOCE ESTA SEM TOKEN, FAÇA O LOGIN NOVAMENTE');

      window.location.href = DlpController.ambienteRedirecionamento();
      
    }
    
    /*console.log("Token DESCRIPTOGRAFADO");
    console.log(base64ToString);*/
    
    /* NAVEGA NA STRING DO TOKEN */
    for(let i = 0; i < base64ToString.length; i++) {
      /* VERIFICA SE NA POSICAO ATUAL SE TRATA DE UM *, CASO SEJA RETORNA O VALOR TRUE PARA REALIZAR A LIBERACAO TOTAL AS CONFIGURACOES */
      if(String(base64ToString[i]) == "*") {
        console.log("Contem *");

        // window.document.querySelector('#privilegio').setAttribute('style','display: block !important;');
        // document.getElementById('privilegio').style.display = "block";
      }
    }

    // window.document.querySelector('#privilegio').setAttribute('style', 'display: none !important;');
    // document.getElementById('privilegio').style.display = "none";
  }

  /* === CONVERTE STRING PARA BOOLEAN === */
  converteStringParaBoolean = async () => {
    /* ======================================= */
    /* === CONVERTENDO STRING PARA BOOLEAN === */
    /* ======================================= */

    for(let i = 0; i < this.state.base64_j3.length; i++) {
      
      if(String(this.state.base64_j3[i].derruba_app).toLowerCase() == "true") {
        this.state.base64_j3[i].derruba_app = true;
    
      }else if(String(this.state.base64_j3[i].derruba_app).toLowerCase() == "false") {
        this.state.base64_j3[i].derruba_app = false;

      }

      if(String(this.state.base64_j3[i].filma).toLowerCase() == "true") {
        this.state.base64_j3[i].filma = true;
      
      }else if(String(this.state.base64_j3[i].filma).toLowerCase() == "false") {
        this.state.base64_j3[i].filma = false;

      }

      if(String(this.state.base64_j3[i].impede_copia).toLowerCase() == "true") {
        this.state.base64_j3[i].impede_copia = true;
      
      }else if(String(this.state.base64_j3[i].impede_copia).toLowerCase() == "false") {
        this.state.base64_j3[i].impede_copia = false;

      }

      if(String(this.state.base64_j3[i].monitora_dados).toLowerCase() == "true") {
        this.state.base64_j3[i].monitora_dados = true;
      
      }else if(String(this.state.base64_j3[i].monitora_dados).toLowerCase() == "false") {
        this.state.base64_j3[i].monitora_dados = false;

      }

      if(String(this.state.base64_j3[i].particular).toLowerCase() == "true") {
        this.state.base64_j3[i].particular = true;
      
      }else if(String(this.state.base64_j3[i].particular).toLowerCase() == "false") {
        this.state.base64_j3[i].particular = false;

      }

      if(String(this.state.base64_j3[i].print).toLowerCase() == "true") {
        this.state.base64_j3[i].print = true;
      
      }else if(String(this.state.base64_j3[i].print).toLowerCase() == "false") {
        this.state.base64_j3[i].print = false;

      }

      if(String(this.state.base64_j3[i].registra_copia).toLowerCase() == "true") {
        this.state.base64_j3[i].registra_copia = true;
      
      }else if(String(this.state.base64_j3[i].registra_copia).toLowerCase() == "false") {
        this.state.base64_j3[i].registra_copia = false;

      }

      if(String(this.state.base64_j3[i].impede_dados).toLowerCase() == "true") {
        this.state.base64_j3[i].impede_dados = true;
      
      }else if(String(this.state.base64_j3[i].impede_dados).toLowerCase() == "false") {
        this.state.base64_j3[i].impede_dados = false;

      }

    }

  }

  render() {
    return (
      <div>

        <div className="row adicionar ativar" id="adicionarAncoramento">

          <div className="col-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">

                <div className="row criacao-metadado">
                  <h1 className="titulo-metadados">Pastas Controladas</h1>
                </div>

                {/* ENVIANDO ITENS PADROES PARA DIVERSAS MAQUINAS */}
                <form className="row mt-3 ajuste-form" onSubmit={this.handleSubmitFormulario} >

                  <div className="row col-md-12 inputs">
                    <div className="col-md-12">

                      <Form.Group className="row">
                        <div className="col-sm-12">
                          Maquina DPO:
                          <Form.Control type="text" value={this.state.maquinaDPO} disabled />
                        </div>
                      </Form.Group>

                    </div>

                    <div className="col-md-12">
                      Máquinas:
                      <select className="opcoes-select" name="maquinas" value={this.state.maquinaSele} onChange={this.handleChangeMaquinas} >
                        {this.state.arrayNomeMaquinas.map((maquina) => {
                          return (
                            <option value={maquina.hash_maquina}>{
                              maquina.computer_name
                            } | { maquina.hash_maquina }
                            </option>
                          )
                        })}
                      </select>
                      <button type="button" data-toggle="modal" data-target="#adicionarItemModal" className="botao-adicionar-pastas" >Adicionar Pasta</button>
                      
                      {/* LISTA DE PASTAS SENSIVEIS */}
                      {this.state.arrayPastasSensiveis.map((endereco) => {
                        return (
                          <div className="row col-md-12 inputs">
                            <Form.Group className="row itens-pastas">
                              <div className="col-md-12 input-adicionado">
                                <Form.Control type="text" value={endereco.pasta} disabled />
                                <div className="opcoes">

                                  <button type="button" onClick={() => this.findByIndex(endereco)} data-toggle="modal" data-target="#editaItemModal">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                      <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                    </svg>
                                  </button>

                                  <button type="button" onClick={() => this.deleteIndex(endereco.pasta)} >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
                                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                    </svg>
                                  </button>

                                </div>
                              </div>
                            </Form.Group>
                          </div>
                        )
                      })}

                    </div>
                  </div>

                  <div className="botoes-acoes col-md-12">
                    <div className="botao-salvar-alteracoes" >
                      <button type="submit"  > Enviar </button>
                    </div>
                  </div>

                </form>

              </div>
            </div>
          </div>

        </div >

        {/* MODAL ADCIONAR NOVA PASTA SENSIVEL */}
        <div class="modal fade" id="adicionarItemModal" tabindex="-1" role="dialog" aria-labelledby="adicionarItemModalLabel" aria-hidden="true" >
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <p className="card-description"> Adicionar nova pasta </p>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close" >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">

                <form className="row mt-12" onSubmit={this.handleSubmitPastasSensiveis} >

                  <div className="col-md-12">

                    <Form.Group className="row">
                      <div className="col-sm-12">
                        Maquina DPO:
                        <Form.Control type="text" value={this.state.maquinaDPO} disabled />
                      </div>
                    </Form.Group>

                    <Form.Group className="row">
                      <div className="col-sm-12">
                        Pasta:
                        <Form.Control type="text" value={this.state.pastas} onChange={this.handlePastas} />
                      </div>
                    </Form.Group>

                  </div>

                  <div class="modal-footer col-md-12 botao-enviar" >
                    <button type="button" data-dismiss="modal" aria-label="Close" >Fechar</button>
                    <button type="submit" >Adicionar</button>
                  </div>

                </form>

              </div>
            </div>
          </div>
        </div>


        <div class="modal fade" id="editaItemModal" tabindex="-1" role="dialog" aria-labelledby="editaItemModalLabel" aria-hidden="true" >
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <p className="card-description"> Atualizar pasta </p>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close" >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">

                <form className="row col-md-12" onSubmit={this.handleSubmitEditaPastasSensiveis} >
                  
                  <div className="col-md-12">

                    <Form.Group className="row">
                      <div className="col-sm-12">
                        Pasta:
                        <Form.Control type="text" value={this.state.pastaAtualizada} onChange={this.handlePastaAtualizada} />
                      </div>
                    </Form.Group>

                  </div>

                  <div class="modal-footer col-md-12 botao-enviar" >
                    <button type="button" data-dismiss="modal" aria-label="Close" >Fechar</button>
                    <button type="submit" >Atualizar</button>
                  </div>

                </form>

              </div>
            </div>
          </div>
        </div>

      </div >
    )
  }
}

export default PastasSensiveis
