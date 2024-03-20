import React, { Component } from "react";
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import bsCustomFileInput from "bs-custom-file-input";
import DlpController from "./controller/DlpController";

import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";

import "./css/style.css";

import Switch from "react-switch";

import http from "./http/http.js";

/* CONFIGURACAO DE TABELA */
const columns = [
  {
    dataField: "cksum",
    text: "Codigo grupo",
    placeholder: "cksum",
    filter: textFilter(),
  },
  {
    dataField: "maquina",
    text: "Maquina",
    placeholder: "Nome da maquina",
    filter: textFilter(),
  },
  {
    dataField: "grupo_dlp",
    text: "Grupo DLP",
    placeholder: "Grupo DLP",
    filter: textFilter(),
  },
  {
    dataField: "data_atualizacao",
    text: "Data atuallização",
    placeholder: "Data atuallização",
    filter: textFilter(),
  },
];

export class GrupoDlp extends Component {
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
      nome: "",
      arrayDlp: [],
      comprimentoJ3: 0,
      enviarJson: false,
      arrayParaEnvioAoServidor: [],

      /* INFORMACOES DA MAQUINA */
      grupo_dlp: "",
      computer_name: "",
      maquina: "",

      token: "",
      url: "",

      alerta: "",

      /* SELECIONA UM ITEM */
      selecao: [],

      /* CARREGA ARRAY DE MAQUINAS */
      dadosFiltrados: [],
      todosDadosArrayDlp: [],

      /* BASE x64 - J1 */
      titulosADesprezar: "",
      classesDebugar: "",
      jansFilhasMonitorar: "",
      ipCloud: "", //'54.207.237.19'
      portaCloud: "", //'8090'
      portaDlp: "", //'8085'
      conectivosExcluir: "",
      driveServer: "",
      cliAtual: "", //epsoft
      grupoDlp: "",
      percentualCompacArquivos: "",
      origensAlarme: "",
      statusAlarme: "",
      tiposAlarme: "",
      extensoesSensiveis: "",
      codCliente: "",
      codigoMaquinaPorUsuario: "", //'0'

      /* BASE x64 - J2 */
      anonimizaDadosRelatorios: "", //1
      ativaEmailAlmGraves: "", //1
      ativaEmailAlmGravissimos: "", //1
      ativaEmailAlmSerios: "", //1
      ativaSmsAlmGraves: "", //1
      ativaSmsAlmGravissimos: "", //1
      ativaSmsAlmSerios: "", //1
      desativaPrintScreen: "0",
      filmar_sempre: "0",
      monitoraDispExternos: "",
      quandoPegarDadosSensiveis: "",
      quando_pegar_dados_sensiveis: "",
      driversPermitidos: "",
      impedirDragDrop: "",
      semDragDrop: "",
      imgBlockPrtSc: "",
      qtMinQualifsTab: "",
      qtMinQualifsDoc: "",
      maxQtFalsosNomes: "",
      qtPalsManterQualificador: "",
      QtMaxLinhasResult: "",
      tMinQualifsTab: "",
      comFonetizacao: "",
      notaCorteSerios: "",
      tamMaximoArquivoAnalise: "10000000",
      exibirDIsplayDiscovery: "6",
      notaCorteGraves: "",
      notaCorteGravissimos: "",
      pastasSensiveis: "",
      tempoDragAndDrop: "",
      impressaoSpooler: "",
      arquivosZip:
        "7z,ACE,ARJ,BZ2,CAB,ISO,JAR,LZH,RAR,TAR,TAR.BZ2,TAR.GZ,TGZ,UUE,7-Zip,B1 Free Archiver,PKZIP,WinRAR,WinZip,zip",
      ehS3: "1",
      classificacaoAlarmeDragDrop: "INFO",
      naoTestarCopiaArquivo: "",
      naoTestarDragDrop: "",

      /* BASE x64 - J3 */
      /* SEPARADOS POR INDEX */
      base64_j3: [],
      derruba_app: false,
      filma: false,
      permite_colar: false,
      monitora_ctrl: false,
      json: "",
      monitora_dados: false,
      particular: false,
      print: false,
      registra_copia: false,
      tipo: "2",
      filtro_titulo: "",
      executavel: "",
      impede_dados: false,
    };

    /* REALIZA O CARREGAMENTO DO JSON DEFAULT NAS VARIAVEIS COM BASE NO GRUPO_DLP DO USUARIO LOGADO */
    this.findByJsonDefault();

    /* SEMPRE QUE O COMPONENT E CHAMADO ESSE METODO E INSTANCIADO AUTOMATICAMENTE */
    this.verificarPrivilegio();

    /* TRAZ TODOS OS DADOS DA BASE DE DADOS */
    //this.findAllByComputadores();

    /* METODOS PARA O SWITCH */
    this.handleChangePrint = this.handleChangePrint.bind(this);
    this.handleChangepermite_colar = this.handleChangepermite_colar.bind(this);
    this.handleChangemonitora_ctrl = this.handleChangemonitora_ctrl.bind(this);
    this.handleChangeRegistra_copia = this.handleChangeRegistra_copia.bind(
      this
    );
    this.handleChangeMonitora_dados = this.handleChangeMonitora_dados.bind(
      this
    );
    this.handleChangeParticular = this.handleChangeParticular.bind(this);
    this.handleChangeDerruba_app = this.handleChangeDerruba_app.bind(this);
    this.handleChangeFilma = this.handleChangeFilma.bind(this);
    this.handleChangeImpedeDados = this.handleChangeImpedeDados.bind(this);
  }

  /* ================== */
  /* == OBSERVADORES == */
  /* ================== */

  handleChange = (date) => {
    this.setState({
      startDate: date,
    });
  };

  /* ARMAZENA O NOME DO COMPUTADOR PESQUISADO = Angular ngModel -> faz a funcao de um observador */
  handleChangeNome = (event) => {
    this.setState({ nome: event.target.value });
  };

  /* ================================ */
  /* OBSERVADORES INFORMACOES MAQUINA */
  /* ================================ */

  handleChangeGrupo_Dlp = (event) => {
    this.setState({ grupo_dlp: event.target.value });
  };

  handleChangeComputerName = (event) => {
    this.setState({ computer_name: event.target.value });
  };

  handleChangeMaquina = (event) => {
    this.setState({ maquina: event.target.value });
  };

  /* ========================== */
  /* OBSERVADORES BASE x64 - J1 */
  /* ========================== */

  /* OBSERVADOR DO ATRIBUTO 'tituloADesprezar' */
  handleChangeTitulosADesprezar = (event) => {
    this.setState({ titulosADesprezar: event.target.value });
  };

  handleChangeClassesDebugar = (event) => {
    this.setState({ classesDebugar: event.target.value });
  };

  handleChangeJansFilhasMonitorar = (event) => {
    this.setState({ jansFilhasMonitorar: event.target.value });
  };

  handleChangeIpCloud = (event) => {
    this.setState({ ipCloud: event.target.value });

    this.converteStringParaBoolean();
    this.ajustaBarras();
  };

  handleChangePortaCloud = (event) => {
    this.setState({ portaCloud: event.target.value });

    this.converteStringParaBoolean();
    this.ajustaBarras();
  };

  handleChangePortaDlp = (event) => {
    this.setState({ portaDlp: event.target.value });

    this.converteStringParaBoolean();
    this.ajustaBarras();
  };

  handleChangeConectivosExcluir = (event) => {
    this.setState({ conectivosExcluir: event.target.value });
  };

  handleChangeDriveServer = (event) => {
    this.setState({ driveServer: event.target.value });
  };

  handleChangeCliAtual = (event) => {
    this.setState({ cliAtual: event.target.value });

    this.converteStringParaBoolean();
    this.ajustaBarras();
  };

  handleChangeGrupoDlp = (event) => {
    this.setState({ grupoDlp: event.target.value });

    this.converteStringParaBoolean();
    this.ajustaBarras();
  };

  handleChangePercentualCompacArquivos = (event) => {
    this.setState({ percentualCompacArquivos: event.target.value });
  };

  handleChangeOrigensAlarme = (event) => {
    this.setState({ origensAlarme: event.target.value });
  };

  handleChangeStatusAlarme = (event) => {
    this.setState({ statusAlarme: event.target.value });
  };

  handleChangeTiposAlarme = (event) => {
    this.setState({ tiposAlarme: event.target.value });
  };

  handleChangeExtensoesSensiveis = (event) => {
    this.setState({ extensoesSensiveis: event.target.value });
  };

  handleChangeCodCliente = (event) => {
    this.setState({ codCliente: event.target.value });

    this.converteStringParaBoolean();
    this.ajustaBarras();
  };

  handleChangeCodigoMaquinaPorUsuario = (event) => {
    this.setState({ codigoMaquinaPorUsuario: event.target.value });

    this.converteStringParaBoolean();
    this.ajustaBarras();
  };

  /* ========================== */
  /* OBSERVADORES BASE x64 - J2 */
  /* ========================== */

  handleChangeAmostragemGravacaoArquivos = (event) => {
    this.setState({ amostragemGravacaoArquivos: event.target.value });
  };

  handleChangeAmostragemMonitoracaoAnexos = (event) => {
    this.setState({ amostragemMonitoraçãoAnexos: event.target.value });
  };

  handleChangeAmostragemWatcher = (event) => {
    this.setState({ amostragemWatcher: event.target.value });
  };

  handleChangeAnonimizaDadosRelatorios = (event) => {
    this.setState({ anonimizaDadosRelatorios: event.target.value });

    this.ajustaBarras();
  };

  handleChangeAtivaEmailAlmGraves = (event) => {
    this.setState({ ativaEmailAlmGraves: event.target.value });
  };

  handleChangeAtivaEmailAlmGravissimos = (event) => {
    this.setState({ ativaEmailAlmGravissimos: event.target.value });
  };

  handleChangeAtivaEmailAlmSerios = (event) => {
    this.setState({ ativaEmailAlmSerios: event.target.value });
  };

  handleChangeAtivaSmsAlmGraves = (event) => {
    this.setState({ ativaSmsAlmGraves: event.target.value });
  };

  handleChangeAtivaSmsAlmGravissimos = (event) => {
    this.setState({ ativaSmsAlmGravissimos: event.target.value });
  };

  handleChangeAtivaSmsAlmSerios = (event) => {
    this.setState({ ativaSmsAlmSerios: event.target.value });
  };

  handleChangeDesativaPrintScreen = (event) => {
    this.setState({ desativaPrintScreen: event.target.value });

    this.converteStringParaBoolean();
    this.ajustaBarras();
  };

  handleChangeFilmarSempre = (event) => {
    this.setState({ filmar_sempre: event.target.value });

    this.converteStringParaBoolean();
    this.ajustaBarras();
  };

  handleChangeGatilhoLinhasNaoRelevantes = (event) => {
    this.setState({ gatilhoLinhasNaoRelevantes: event.target.value });
  };

  handleChangeGatilhoLinhasProximas = (event) => {
    this.setState({ gatilhoLinhasProximas: event.target.value });
  };

  handleChangeInformaAcoesUsuario = (event) => {
    this.setState({ informaAcoesUsuario: event.target.value });
  };

  handleChangeJaCarregueiServer = (event) => {
    this.setState({ jaCarregueiServer: event.target.value });
  };

  handleChangeMaxDadosRelevantes = (event) => {
    this.setState({ maxDadosRelevantes: event.target.value });
  };

  handleChangeMaxLinhasComentario = (event) => {
    this.setState({ maxLinhasComentario: event.target.value });
  };

  handleChangeMonitoraDispExternos = (event) => {
    this.setState({ monitoraDispExternos: event.target.value });

    this.converteStringParaBoolean();
    this.ajustaBarras();
  };

  handleChangeNaoDerrubaMaquina = (event) => {
    this.setState({ naoDerrubaMaquina: event.target.value });
  };

  handleChangeNaoInicializaMaquina = (event) => {
    this.setState({ naoInicializaMaquina: event.target.value });
  };

  handleChangePercentualRelevancia = (event) => {
    this.setState({ percentualRelevancia: event.target.value });
  };

  handleChangeQtInfosGrave = (event) => {
    this.setState({ qtInfosGrave: event.target.value });
  };

  handleChangeQtInfosGravissimo = (event) => {
    this.setState({ qtInfosGravissimo: event.target.value });
  };

  handleChangeQtInfosSerio = (event) => {
    this.setState({ qtInfosSerio: event.target.value });
  };

  handleChangeQuandoPegarDadosSensiveis = (event) => {
    this.setState({ quandoPegarDadosSensiveis: event.target.value });

    this.converteStringParaBoolean();
    this.ajustaBarras();
  };

    handleChangeQuando_pegar_dados_sensiveis = (event) => {
    this.setState({ quando_pegar_dados_sensiveis: event.target.value });
  };

  handleChangedriversPermitidos = (event) => {
    this.setState({ driversPermitidos: event.target.value });
  };

    handleChangeDragAndDrop = (event) => {
    this.setState({ impedirDragDrop: event.target.value });

    this.converteStringParaBoolean();
    this.ajustaBarras();
  };

  handleChangesemDragDrop = (event) => {
    this.setState({ semDragDrop: event.target.value });
  };

  handleChangeTipoDpo = (event) => {
    this.setState({ tipoDpo: event.target.value });
  };

  // novos dados
  handleChangeImgBlockPrtSc = (event) => {
    this.setState({ imgBlockPrtSc: event.target.value });
  };

  handleChangeQtMinQualifsTab = (event) => {
    this.setState({ qtMinQualifsTab: event.target.value });
  };

  handleChangeQtMinQualifsDoc = (event) => {
    this.setState({ qtMinQualifsDoc: event.target.value });
  };

  handleChangeMaxQtFalsosNomes = (event) => {
    this.setState({ maxQtFalsosNomes: event.target.value });
  };

  handleChangeQtPalsManterQualificador = (event) => {
    this.setState({ qtPalsManterQualificador: event.target.value });
  };

  handleChangeQtMaxLinhasResult = (event) => {
    this.setState({ QtMaxLinhasResult: event.target.value });
  };

  handleChangeTMinQualifsTab = (event) => {
    this.setState({ tMinQualifsTab: event.target.value });
  };

  handleChangeComFonetizacao = (event) => {
    this.setState({ comFonetizacao: event.target.value });
  };

  handleChangeNotaCorteSerios = (event) => {
    this.setState({ notaCorteSerios: event.target.value });
  };

  handleChangeNotaCorteSerios = (event) => {
    this.setState({ notaCorteSerios: event.target.value });
  };

  handleChangetamMaximoArquivoAnalise = (event) => {
    this.setState({ tamMaximoArquivoAnalise: event.target.value });
  };

  handleChangeexibirDIsplayDiscovery = (event) => {
    this.setState({ exibirDIsplayDiscovery: event.target.value });
  };

  handleChangeNotaCorteGraves = (event) => {
    this.setState({ notaCorteGraves: event.target.value });
  };

  handleChangeNotaCorteGraves = (event) => {
    this.setState({ notaCorteGravissimos: event.target.value });
  };

  handleChangePastasSensiveis = (event) => {
    this.setState({ pastasSensiveis: event.target.value });

    this.converteStringParaBoolean();
  };

  handleChangeTempoDragAndDrop = (event) => {
    this.setState({ tempoDragAndDrop: event.target.value });

    this.converteStringParaBoolean();
  };

  handleChangeImpressaoSpooler = (event) => {
    this.setState({ impressaoSpooler: event.target.value });

    this.converteStringParaBoolean();
  };

  handleChangenaoTestarDragDrop = (event) => {
    this.setState({ naoTestarDragDrop: event.target.value });
  };

  handleChangenaoTestarCopiaArquivo = (event) => {
    this.setState({ naoTestarCopiaArquivo: event.target.value });
  };

  handleChangeclassificacaoAlarmeDragDrop = (event) => {
    this.setState({ classificacaoAlarmeDragDrop: event.target.value });

    //this.converteStringParaBoolean();
  };

  handleChangeehS3 = (event) => {
    this.setState({ ehS3: event.target.value });
  };
  /* ========================== */
  /* OBSERVADORES BASE x64 - J3 */
  /* ========================== */

  /*handleChangeDerruba_app = event => {
    this.setState({ derruba_app: event.target.value });
  }*/

  handleChangeDerruba_app(derruba_app) {
    this.setState({ derruba_app });
  }

  /*handleChangeFilma = event => {
    this.setState({ filma: event.target.value });
  }*/

  handleChangeFilma(filma) {
    this.setState({ filma });
  }

  handleChangeUrl = (event) => {
    this.setState({ url: event.target.value });
  }

  /*handleChangepermite_colar = event => {
    this.setState({ permite_colar: event.target.value });
  }*/

  handleChangepermite_colar(permite_colar) {
    this.setState({ permite_colar });
  }

  handleChangemonitora_ctrl(monitora_ctrl) {
    this.setState({ monitora_ctrl });
  }

  handleChangeJson = (event) => {
    this.setState({ json: event.target.value });
  };

  /*handleChangeMonitora_dados = event => {
    this.setState({ monitora_dados: event.target.value });
  }*/

  handleChangeMonitora_dados(monitora_dados) {
    this.setState({ monitora_dados });
  }

  /*handleChangeParticular = event => {
    this.setState({ particular: event.target.value });
  }*/

  handleChangeParticular(particular) {
    this.setState({ particular });
  }

  /*handleChangePrint = event => {
    this.setState({ print: event.target.value });
  }*/

  handleChangePrint(print) {
    this.setState({ print });
  }

  /*handleChangeRegistra_copia = event => {
    this.setState({ registra_copia: event.target.value });
  }*/

  handleChangeRegistra_copia(registra_copia) {
    this.setState({ registra_copia });

    this.ajustaBarras();
  }

  /*handleChangeImpedeDados = event => {
    this.setState({ impede_dados: event.target.value });
  }*/

  handleChangeImpedeDados(impede_dados) {
    this.setState({ impede_dados });
  }

  handleChangeTipo = (event) => {
    this.setState({ tipo: event.target.value });
  };

  handleChangeFiltro_titulo = (event) => {
    this.setState({ filtro_titulo: event.target.value });

    /*
    if(event.target.value.length > 0) {
      window.document.getElementById('controle-executavel').disabled = true;

    }else {
      window.document.getElementById('controle-executavel').disabled = false;

    }
    /*

  }

  handleChangeExecutavel = event => {
    this.setState({ executavel: event.target.value });
/*
    if(event.target.value.length > 0) {
      window.document.getElementById('controle-filtro').disabled = true;
    
    }else {
      window.document.getElementById('controle-filtro').disabled = false;

    }
    */
  };

  /* ==================================== */
  /* === FIM DOS OBSERVADORES DO JSON === */
  /* ==================================== */

  /* CAPITURA DADOS PARA CRIAR UM NOVO ITEM NO JSON */
  handleSubmitPostL3 = (event) => {
    event.preventDefault();

    /* CRIA O OBJETO COM OS NOVOS DADOS */
    const novoItem = {
      json: "2",
      tipo: "0",
      filtro_titulo: this.state.filtro_titulo,
      executavel: this.state.executavel,
      url: this.state.url,
      print: this.state.print,
      derruba_app: this.state.derruba_app,
      quando_pegar_dados_sensiveis: this.state.quando_pegar_dados_sensiveis,
      
      filma: this.state.filma,
      monitora_dados: this.state.monitora_dados,
      particular: this.state.particular,
      registra_copia: this.state.registra_copia,
      impede_dados: this.state.impede_dados,
    };

    /*console.log("Gerou o objeto Novo Item");
    console.log(novoItem);*/

    /* ENVIA O OBJETO PARA SER INSERIDO NO ARRAY NOVAMENTE */

    if (
      this.state.filtro_titulo.length > 0 ||
      this.state.executavel.length > 0 ||
      this.state.url.length > 0
    ) {
      this.postIndexL3(novoItem);
    } else {
      alert(
        "Favor preencher algum dos campos: Informar o título da Janela ou Nome da aplicação "
      );
    }
  };

  /* ATUALIZA O USUARIO - ESSE METODO NAO SERA UTILIZADO */
  handleSubmitPutComputador = (event) => {
    event.preventDefault();

    var contador = 0;
    var memoriaDadosPastasSensiveis = "";

    console.log("Dados pastas sensiveis: " + this.state.pastasSensiveis);

    for (let i = 0; i < this.state.pastasSensiveis.length; i++) {
      if (this.state.pastasSensiveis[i] == "\\" && contador < 2) {
        contador++;
      } else if (contador == 2) {
        break;
      }
    }

    contador = 0;

    for (let i = 0; i < this.state.pastasSensiveis.length; i++) {
      if (this.state.pastasSensiveis[i] == "\\" && contador < 2) {
        contador++;

        memoriaDadosPastasSensiveis =
          memoriaDadosPastasSensiveis + this.state.pastasSensiveis[i] + "\\";

        console.log("Acessou a barra");
      } else if (contador > 1 && this.state.pastasSensiveis[i] != "\\") {
        memoriaDadosPastasSensiveis =
          memoriaDadosPastasSensiveis + this.state.pastasSensiveis[i];

        console.log("Inseriu dado");
      } else {
        memoriaDadosPastasSensiveis =
          memoriaDadosPastasSensiveis + this.state.pastasSensiveis[i];

        contador = 0;

        console.log("Zerou o contador");
      }
    }

    this.state.pastasSensiveis = memoriaDadosPastasSensiveis;

    this.state.pastasSensiveis = this.state.pastasSensiveis
      .split("\\\\")
      .join("\\");
    this.state.pastasSensiveis = this.state.pastasSensiveis.replace(
      /\\\\/g,
      "\\"
    );

    if (contador < 2) {
      try {
        this.state.pastasSensiveis = this.state.pastasSensiveis
          .split("/")
          .join("\\\\");
        this.state.pastasSensiveis = this.state.pastasSensiveis.replace(
          /\\/g,
          "\\\\"
        );

        this.state.pastasSensiveis = this.state.pastasSensiveis.replace(
          /\\\\/g,
          "\\\\"
        );
      } catch (err) {
        console.log("Nao contem o campo: pastasSensiveis no JSON");
      }
    } else {
      try {
        this.state.pastasSensiveis = this.state.pastasSensiveis
          .split("/")
          .join("\\");
        this.state.pastasSensiveis = this.state.pastasSensiveis.replace(
          /\\/g,
          "\\\\"
        );

        this.state.pastasSensiveis = this.state.pastasSensiveis.replace(
          /\\\\/g,
          "\\\\"
        );
      } catch (err) {
        console.log("Nao contem o campo: pastasSensiveis no JSON");
      }
    }

    /* ================================= */
    /* ===  ACRESCENTA O JSON 1 FIXO === */
    /* ================================= */
    const json1Fixo = {
      json: "1",
      tipo: 3,
      print: false,
      filma: false,
      permite_colar: false,
      registra_copia: false,
      monitora_dados: false,
      impede_dados: false,
      bloqueia_app: false,
      derruba_app: false,
    };

    var verificador = 0;

    for (let i = 0; i < this.state.base64_j3.length; i++) {
      if (String(this.state.base64_j3[i].json) === "1") {
        verificador++;
      }
    }

    if (verificador == 0) {
      console.log(json1Fixo);
      this.state.base64_j3.push(json1Fixo);
    }

    const computador = {
      grupo_dlp: this.state.grupo_dlp,
      computer_name: this.state.computer_name,
      maquina: this.state.maquina,
      base64_j1: {
        json: "vars",
        grupoDlp: this.state.grupoDlp,
        desativaPrintScreen: this.state.desativaPrintScreen,
        quandoPegarDadosSensiveis: this.state.quandoPegarDadosSensiveis,
        impedirDragDrop: this.state.impedirDragDrop,
        semDragDrop: this.state.semDragDrop,
        driversPermitidos: this.state.driversPermitidos,
      },
      base64_j3: this.state.base64_j3,
    };

    /* INSERE OS DADOS PARA ATUALIZAR O USUARIO */
    /* SE PASSA COMO PARAMETRO O OBJETO PESSOA, E TRATA ESSES DADOS DESSE OBJETO DENTRO DO METODO, DESSA FORMA FACILITANDO O GERENCIAMENTO DOS DADOS E FUTOS AJUSTES */
    this.putComputador(computador);
    /* ENVIAR O OBJETO PESSOA PARA O METODO PUT */
  };

  /* CAPITURA DADOS PARA ATUALIZAR UM ITEM NO JSON PEGANDO COMO PARAMENTRO O INDEX E O OBJETO EM SI */
  handleSubmitPutL3 = (event) => {
    event.preventDefault();

    /* CRIA O OBJETO COM OS NOVOS DADOS */
    const itemExistente = {
      json: this.state.json,
      tipo: "0",
      filtro_titulo: this.state.filtro_titulo,
      executavel: this.state.executavel,
      url: this.state.url,
      print: this.state.print,
      derruba_app: this.state.derruba_app,
      quando_pegar_dados_sensiveis: this.state.quando_pegar_dados_sensiveis,

      filma: this.state.filma,
      monitora_dados: this.state.monitora_dados,
      particular: this.state.particular,
      registra_copia: this.state.registra_copia,
      impede_dados: this.state.impede_dados,
      permite_colar: this.state.permite_colar,
    };

    /* ENVIA O OBJETO PARA SER INSERIDO NO ARRAY NOVAMENTE, E TAMBEM ENVIA O FILTRO E O EXECUTAVEL PARA SERVIREM DE REFERENCIA PARA ATUALIZAR OS DADOS CORRETAMENTE */
    this.putIndexL3(
      itemExistente.filtro_titulo,
      itemExistente.executavel,
      itemExistente.url,
      itemExistente
    );
  };

  /* ================== */
  /* === METODO GET === */
  /* ================== */

  /* PESQUISA TODOS OS DADOS CONTIDOS NA BASE DADOS */
  findAllByDLPs = async () => {
    DlpController.getAllDlp()
      .then((response) => {
        this.converterJSON(response.data);

        this.setState({
          arrayDlp: response.data,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  /* CARREGA AS MAQUINAS DO GRUPO DLP ESPECIFICADO */
  findAllByComputadores = async () => {
    /* ENVIA O OBJETO DE PESQUISA PARA O BANCO DE DADOS */
    DlpController.getPorGrupo().then((response) => {
      console.log(response.data);

      this.setState({
        todosDadosArrayDlp: response.data,
      });

      console.log("Array coletado");
      console.log(this.state.todosDadosArrayDlp);
      console.log(this.state.todosDadosArrayDlp.length);

      let variavelAuxiliar = [];

      for (let i = 0; i < this.state.todosDadosArrayDlp.length; i++) {
        let contador = 0;

        for (let j = 0; j < this.state.todosDadosArrayDlp.length; j++) {
          if (
            String(this.state.todosDadosArrayDlp[i].maquina).toLowerCase() ==
            String(this.state.todosDadosArrayDlp[j].maquina).toLowerCase()
          ) {
            contador++;

            console.log("Valor do contador");
            console.log(contador);
          }
        }

        if (
          String(this.state.todosDadosArrayDlp[i].maquina).toLowerCase() !=
            "" &&
          contador <= 1
        ) {
          let obj = {
            maquina: this.state.todosDadosArrayDlp[i].maquina,
            computer_name: this.state.todosDadosArrayDlp[i].computer_name,
            grupo_dlp: this.state.todosDadosArrayDlp[i].grupo_dlp,
            hash_maquina: this.state.todosDadosArrayDlp[i].hash_maquina,
            json: this.state.todosDadosArrayDlp[i].json,
            cksum: this.state.todosDadosArrayDlp[i].cksum,
            data_atualizacao: this.state.todosDadosArrayDlp[i].data_atualizacao,
            filter: textFilter(),
          };

          variavelAuxiliar.push(obj);
        }
      }

      this.setState({ dadosFiltrados: variavelAuxiliar });
    });
  };

  /* PESQUISA POR UM USUARIO ESPECIFICO E POPULA AS VARIAVEIS DE AMBIENTE PARA QUE POSSAM SER ALTERADAS */
  findByIndexL3 = async (index, executavel) => {
    /* ======================================= */
    /* === CONVERTENDO STRING PARA BOOLEAN === */
    /* ======================================= */

    for (let i = 0; i < this.state.base64_j3.length; i++) {
      if (String(this.state.base64_j3[i].derruba_app).toLowerCase() == "true") {
        this.state.base64_j3[i].derruba_app = true;
      } else if (
        String(this.state.base64_j3[i].derruba_app).toLowerCase() == "false"
      ) {
        this.state.base64_j3[i].derruba_app = false;
      }

      if (String(this.state.base64_j3[i].filma).toLowerCase() == "true") {
        this.state.base64_j3[i].filma = true;
      } else if (
        String(this.state.base64_j3[i].filma).toLowerCase() == "false"
      ) {
        this.state.base64_j3[i].filma = false;
      }

      if (
        String(this.state.base64_j3[i].permite_colar).toLowerCase() == "true"
      ) {
        this.state.base64_j3[i].permite_colar = true;
      } else if (
        String(this.state.base64_j3[i].permite_colar).toLowerCase() == "false"
      ) {
        this.state.base64_j3[i].permite_colar = false;
      }

      if (
        String(this.state.base64_j3[i].monitora_ctrl).toLowerCase() == "true"
      ) {
        this.state.base64_j3[i].monitora_ctrl = true;
      } else if (
        String(this.state.base64_j3[i].permite_colar).toLowerCase() == "false"
      ) {
        this.state.base64_j3[i].monitora_ctrl = false;
      }

      if (
        String(this.state.base64_j3[i].monitora_dados).toLowerCase() == "true"
      ) {
        this.state.base64_j3[i].monitora_dados = true;
      } else if (
        String(this.state.base64_j3[i].monitora_dados).toLowerCase() == "false"
      ) {
        this.state.base64_j3[i].monitora_dados = false;
      }

      if (String(this.state.base64_j3[i].particular).toLowerCase() == "true") {
        this.state.base64_j3[i].particular = true;
      } else if (
        String(this.state.base64_j3[i].particular).toLowerCase() == "false"
      ) {
        this.state.base64_j3[i].particular = false;
      }

      if (String(this.state.base64_j3[i].print).toLowerCase() == "true") {
        this.state.base64_j3[i].print = true;
      } else if (
        String(this.state.base64_j3[i].print).toLowerCase() == "false"
      ) {
        this.state.base64_j3[i].print = false;
      }

      if (
        String(this.state.base64_j3[i].registra_copia).toLowerCase() == "true"
      ) {
        this.state.base64_j3[i].registra_copia = true;
      } else if (
        String(this.state.base64_j3[i].registra_copia).toLowerCase() == "false"
      ) {
        this.state.base64_j3[i].registra_copia = false;
      }

      if (
        String(this.state.base64_j3[i].impede_dados).toLowerCase() == "true"
      ) {
        this.state.base64_j3[i].impede_dados = true;
      } else if (
        String(this.state.base64_j3[i].impede_dados).toLowerCase() == "false"
      ) {
        this.state.base64_j3[i].impede_dados = false;
      }
    }

    /* ESTAMOS UTILIZANDO COMO REFERENCIA O ATRIBUTO tipo DO J3, POREM ELE INICIA DO 1 EM DIANTE, DESSA FORMA TEMOS QUE AJUSTAR O VALOR PARA EQUIVALER AO INDEX DO ITEM */
    /* PARA ISSO BASTA SUBITRAIR POR 1, POIS ESTAMOS TRATANDO COM ARRAYs ONDE INICIAM DO 0 [0, 1, 2 ...] */
    for (let i = 0; i < this.state.base64_j3.length; i++) {
      /* AQUI SERA VERIFICADO QUAL DOS ITENS QUE USAMOS COMO REFERENCIA (ID) PARA PODER TRAZER OS DADOS DO ITEM E ATUALIZA-LO */
      if (
        this.state.base64_j3[i].filtro_titulo == index &&
        String(index).toLowerCase() != ""
      ) {
        /* DESSA FORMA ESTA SENDO POSSIVEL ATUALIZAR OS DADOS DENTRO DO MODAL PARA EDICAO DE UM DETERMINADO ITEM/OBJETO DO J3 */

        this.setState({ derruba_app: this.state.base64_j3[i].derruba_app });
        this.setState({ filma: this.state.base64_j3[i].filma });
        this.setState({ permite_colar: this.state.base64_j3[i].permite_colar });
        this.setState({ monitora_ctrl: this.state.base64_j3[i].monitora_ctrl });
        this.setState({ json: this.state.base64_j3[i].json });
        this.setState({ monitora_dados: this.state.base64_j3[i].monitora_dados, });
        this.setState({ particular: this.state.base64_j3[i].particular });
        this.setState({ print: this.state.base64_j3[i].print });
        this.setState({ registra_copia: this.state.base64_j3[i].registra_copia, });
        this.setState({ tipo: this.state.base64_j3[i].tipo });
        this.setState({ filtro_titulo: this.state.base64_j3[i].filtro_titulo });
        this.setState({ executavel: this.state.base64_j3[i].executavel });
        this.setState({ url: this.state.base64_j3[i].url });
        this.setState({ quando_pegar_dados_sensiveis: this.state.base64_j3[i].quando_pegar_dados_sensiveis });
        this.setState({ impede_dados: this.state.base64_j3[i].impede_dados });
      } else if (
        this.state.base64_j3[i].executavel == executavel &&
        String(executavel).toLowerCase() != ""
      ) {
        /* DESSA FORMA ESTA SENDO POSSIVEL ATUALIZAR OS DADOS DENTRO DO MODAL PARA EDICAO DE UM DETERMINADO ITEM/OBJETO DO J3 */

        this.setState({ derruba_app: this.state.base64_j3[i].derruba_app });
        this.setState({ filma: this.state.base64_j3[i].filma });
        this.setState({ permite_colar: this.state.base64_j3[i].permite_colar });
        this.setState({ monitora_ctrl: this.state.base64_j3[i].monitora_ctrl });
        this.setState({ json: this.state.base64_j3[i].json });
        this.setState({ monitora_dados: this.state.base64_j3[i].monitora_dados, });
        this.setState({ particular: this.state.base64_j3[i].particular });
        this.setState({ print: this.state.base64_j3[i].print });
        this.setState({ registra_copia: this.state.base64_j3[i].registra_copia, });
        this.setState({ tipo: this.state.base64_j3[i].tipo });
        this.setState({ filtro_titulo: this.state.base64_j3[i].filtro_titulo });
        this.setState({ executavel: this.state.base64_j3[i].executavel });
        this.setState({ url: this.state.base64_j3[i].url });
        this.setState({ quando_pegar_dados_sensiveis: this.state.base64_j3[i].quando_pegar_dados_sensiveis });
        this.setState({ impede_dados: this.state.base64_j3[i].impede_dados });
      }
    }
  };

  /* METODO RESPONSAVEL POR TRAZER OS DADOS DO JSON DEFAULT LOGADO */
  findByJsonDefault = async () => {
    DlpController.getByJsonDefault().then((response) => {
      this.setState({ arrayDlp: response.data });

      /* ARMAZENA OS DADOS INVOD DA RESPOSATA NOS CAMPOS ESPECIFICADOS */

      this.converterJSON(this.state.arrayDlp);

      // INFORMACOES DA MAQUINA -> NESSE CASO ESSES CAMPOS NAO SE ENQUADRAO POIS O ENVIO EM MASSA E DE UMA FORMA DIFERENTE
      this.setState({ grupo_dlp: this.state.arrayDlp[0].grupo_dlp });
      console.log("GRUPO DLP");
      console.log(this.state.arrayDlp);
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
      //---this.setState({ gatilhoLinhasNaoRelevantes: '5' });
      //---this.setState({ gatilhoLinhasProximas: '5' });
      //---this.setState({ informaAcoesUsuario: '1' });
      //---this.setState({ jaCarregueiServer: '1' });
      //---this.setState({ maxDadosRelevantes: '15' });
      //---this.setState({ maxLinhasComentario: '15' });
      //---this.setState({ naoDerrubaMaquina: '1' });
      //---this.setState({ naoInicializaMaquina: '1' });
      //---this.setState({ percentualRelevancia: '30' });
      //---this.setState({ qtInfosGrave: '15' });
      //---this.setState({ qtInfosGravissimo: '100' });
      //---this.setState({ qtInfosSerio: '3' });
      //---this.setState({ tipoDpo: '1' });
      this.setState({ anonimizaDadosRelatorios: this.state.arrayDlp[0].anonimizaDadosRelatorios });
      this.setState({ ativaEmailAlmGraves: "1" });
      this.setState({ ativaEmailAlmGravissimos: "1" });
      this.setState({ ativaEmailAlmSerios: "1" });
      this.setState({ ativaSmsAlmGraves: "1" });
      this.setState({ ativaSmsAlmGravissimos: "1" });
      this.setState({ ativaSmsAlmSerios: "1" });
      this.setState({ desativaPrintScreen: this.state.arrayDlp[0].desativaPrintScreen });
      this.setState({ filmar_sempre: this.state.arrayDlp[0].filmar_sempre });
      this.setState({ monitoraDispExternos: "1" });
      this.setState({ quandoPegarDadosSensiveis: this.state.arrayDlp[0].quandoPegarDadosSensiveis });
      this.setState({ driversPermitidos: this.state.arrayDlp[0].driversPermitidos });
      this.setState({ impedirDragDrop: this.state.arrayDlp[0].impedirDragDrop });
      this.setState({ semDragDrop: this.state.arrayDlp[0].semDragDrop });
      this.setState({ imgBlockPrtSc: "/j/users/dlp/TELA_BLOQUEIO_PRINT.png" });
      this.setState({ qtMinQualifsTab: "3" });
      this.setState({ qtMinQualifsDoc: "5" });
      this.setState({ maxQtFalsosNomes: "3" });
      this.setState({ qtPalsManterQualificador: "1" });
      this.setState({ QtMaxLinhasResult: "60" });
      this.setState({ tMinQualifsTab: "3" });
      this.setState({ comFonetizacao: "1" });
      this.setState({ notaCorteSerios: "20" });
      this.setState({ tamMaximoArquivoAnalise: "10000000" });
      this.setState({ exibirDIsplayDiscovery: "6" });
      this.setState({ notaCorteGraves: "100" });
      this.setState({ notaCorteGravissimos: "500" });
      this.setState({ tempoDragAndDrop: this.state.arrayDlp[0].tempoDragAndDrop });
      this.setState({ impressaoSpooler: this.state.arrayDlp[0].impressaoSpooler });
      this.setState({ naoTestarDragDrop: this.state.arrayDlp[0].naoTestarDragDrop });
      this.setState({ naoTestarCopiaArquivo: this.state.arrayDlp[0].naoTestarCopiaArquivo });
      this.setState({ classificacaoAlarmeDragDrop: this.state.arrayDlp[0].classificacaoAlarmeDragDrop });
      this.setState({ ehS3: "1" });
      this.setState({ arquivosZip: "7z,ACE,ARJ,BZ2,CAB,ISO,JAR,LZH,RAR,TAR,TAR.BZ2,TAR.GZ,TGZ,UUE,7-Zip,B1 Free Archiver,PKZIP,WinRAR,WinZip,zip" });

      if (
        String(this.state.pastasSensiveis).toLowerCase() === undefined ||
        String(this.state.pastasSensiveis).toLowerCase() === null
      ) {
        this.setState({ pastasSensiveis: "C:\\temp" });
      } else {
        try {
          var memoriaPastasSensiveis = "";

          console.log("Dado JSON: ");
          console.log(this.state.arrayDlp[0].pastasSensiveis);

          memoriaPastasSensiveis = this.state.arrayDlp[0].pastasSensiveis
            .split("//")
            .join("\\");
          memoriaPastasSensiveis = this.state.arrayDlp[0].pastasSensiveis.replace(
            /\\\\/g,
            "\\"
          );

          this.setState({ pastasSensiveis: memoriaPastasSensiveis });

          console.log("Pastas Sensiveis: ");
          console.log(this.state.pastasSensiveis);
        } catch (erro) {
          //alert("ATENCAO | Ocorreu algum erro no carregamento de seu JSON, verifique com o suporte da ferramenta.");
          console.log(
            "ATENCAO | Ocorreu algum erro no carregamento de seu JSON, verifique com o suporte da ferramenta."
          );
          //console.log(erro);
        }
      }
    });
  };

  /* =================== */
  /* === METODO POST === */
  /* =================== */

  /* ADICIONA UM NOVO ITEM NO L3 */
  postIndexL3 = async (novoItem) => {
    if (String(novoItem.derruba_app).toLowerCase() == "true") {
      novoItem.derruba_app = true;
    } else if (String(novoItem.derruba_app).toLowerCase() == "false") {
      novoItem.derruba_app = false;
    } else {
      novoItem.derruba_app = this.state.derruba_app;
    }

    if (String(novoItem.filma).toLowerCase() == "true") {
      novoItem.filma = true;
    } else if (String(novoItem.filma).toLowerCase() == "false") {
      novoItem.filma = false;
    } else {
      novoItem.filma = this.state.filma;
    }

    if (String(novoItem.permite_colar).toLowerCase() == "true") {
      novoItem.permite_colar = true;
    } else if (String(novoItem.permite_colar).toLowerCase() == "false") {
      novoItem.permite_colar = false;
    } else {
      novoItem.permite_colar = this.state.permite_colar;
    }

    if (String(novoItem.monitora_ctrl).toLowerCase() == "true") {
      novoItem.monitora_ctrl = true;
    } else if (String(novoItem.monitora_ctrl).toLowerCase() == "false") {
      novoItem.monitora_ctrl = false;
    } else {
      novoItem.monitora_ctrl = this.state.monitora_ctrl;
    }

    if (String(novoItem.monitora_dados).toLowerCase() == "true") {
      novoItem.monitora_dados = true;
    } else if (String(novoItem.monitora_dados).toLowerCase() == "false") {
      novoItem.monitora_dados = false;
    } else {
      novoItem.monitora_dados = this.state.monitora_dados;
    }

    if (String(novoItem.particular).toLowerCase() == "true") {
      novoItem.particular = true;
    } else if (String(novoItem.particular).toLowerCase() == "false") {
      novoItem.particular = false;
    } else {
      novoItem.particular = this.state.particular;
    }

    if (String(novoItem.print).toLowerCase() == "true") {
      novoItem.print = true;
    } else if (String(novoItem.print).toLowerCase() == "false") {
      novoItem.print = false;
    } else {
      novoItem.print = this.state.print;
    }

    if (String(novoItem.registra_copia).toLowerCase() == "true") {
      novoItem.registra_copia = true;
    } else if (String(novoItem.registra_copia).toLowerCase() == "false") {
      novoItem.registra_copia = false;
    } else {
      novoItem.registra_copia = this.state.registra_copia;
    }

    if (String(novoItem.impede_dados).toLowerCase() == "true") {
      novoItem.impede_dados = true;
    } else if (String(novoItem.impede_dados).toLowerCase() == "false") {
      novoItem.impede_dados = false;
    } else {
      novoItem.impede_dados = this.state.impede_dados;
    }

    /* ==================================== */
    /* ATRIBUI UM VALOR FIXO AO JSON E TIPO */
    /* ==================================== */
    if (novoItem.json != "1") {
      novoItem.json = 2;
      novoItem.tipo = 1;
    }

    this.state.base64_j3.push(novoItem);

    /* DESSA FORMA OS NOVOS DADOS IRAM REFLETIR NO FRONT-END */
    this.setState({ base64_j3: this.state.base64_j3 });

    /* AJUSTA QUALQUER INCONSISTENCIA NAS PASTAS SENSIVEIS */
    try {
      this.state.pastasSensiveis = this.state.pastasSensiveis
        .split("\\\\")
        .join("\\");
      this.state.pastasSensiveis = this.state.pastasSensiveis.replace(
        /\\\\/g,
        "\\"
      );
    } catch (err) {
      console.log("Nao contem o campo: pastasSensiveis no JSON");
    }

    /* ENVIA UM ALERTA DE FEEDBACK AO USUARIO */
    alert("Item adicionado com sucesso!");
  };

  /* ================== */
  /* === METODO PUT === */
  /* ================== */

  /* ENVIA TODOS OS DADOS ATUALIZADOS DO JSON INCLUINDO (J1, J2 E J3) */
  putComputador = async (putDados) => {
    /* TODOS OS DADOS ESTAO SENDO ENVIDOS PARA ATUALIZACAO MESMO SEM APERTAR O BOTAO, ISSO PQ ESTAMOS LIDANDO COM UM CONJUNTO DE FORMS, E O BOTAO SALVAR ALTERACOES, ESTA ENTRE ELES */

    let trava = false;

    if (this.state.enviarJson) {
      /* CRIPTOGRAFA OS DADOS NOVAMENTE */
      if (!trava) {
        this.criptografarJSON(putDados);

        /* ENVIA UM ALERTA DE FEEDBACK AO USUARIO */
        //alert("Os dados foram salvos com sucesso!");
      } else {
        alert(
          "Foi identificado uma discrepancia no JSON, corrija-o imediatamente antes de enviar ao JSON"
        );
      }
    } else {
      console.log("O botao para enviar os dados ainda nao foi pressionado!");
    }
  };

  validaJSON = async (json, trava) => {
    /*if(typeof String(json.grupo_dlp).toLowerCase() === 'string' && 
      typeof String(json.computer_name).toLowerCase() === 'string' && 
      typeof String(json.maquina).toLowerCase() === 'string') {
      
        alert('Todos os campos de maquinas foram verificas e estao com as tipagens OK!');

    }else {
      trava = true;

      alert('Existe uma divergencia no JSON (Campos de maquinas) , corrija o erro, antes de enviar ao banco de dados!');

    }*/

    if (
      typeof String(json.base64_j1[0].json).toLowerCase() === "string" &&
      typeof String(json.base64_j1[0].classesDebugar).toLowerCase() ===
        "string" &&
      typeof String(json.base64_j1[0].cliAtual).toLowerCase() === "string" &&
      typeof String(json.base64_j1[0].conectivosExcluir).toLowerCase() ===
        "string" &&
      typeof String(json.base64_j1[0].driveServer).toLowerCase() === "string" &&
      typeof String(json.base64_j1[0].grupoDlp).toLowerCase() === "string" &&
      typeof String(json.base64_j1[0].ipCloud).toLowerCase() === "string" &&
      typeof String(json.base64_j1[0].jansFilhasMonitorar).toLowerCase() ===
        "string" &&
      typeof String(json.base64_j1[0].origensAlarme).toLowerCase() ===
        "string" &&
      typeof String(
        json.base64_j1[0].percentualCompacArquivos
      ).toLowerCase() === "string" &&
      typeof String(json.base64_j1[0].portaCloud).toLowerCase() === "string" &&
      typeof String(json.base64_j1[0].portaDlp).toLowerCase() === "string" &&
      typeof String(json.base64_j1[0].statusAlarme).toLowerCase() ===
        "string" &&
      typeof String(json.base64_j1[0].tiposAlarme).toLowerCase() === "string" &&
      typeof String(json.base64_j1[0].titulosADesprezar).toLowerCase() ===
        "string" &&
      typeof String(json.base64_j1[0].extensoesSensiveis).toLowerCase() ===
        "string" &&
      typeof String(json.base64_j1[0].codCliente).toLowerCase() === "string" &&
      typeof String(json.base64_j1[0].codigoMaquinaPorUsuario).toLowerCase() ===
        "string"
    ) {
      alert(
        "Todos os campos do J1 foram verificas e estao com as tipagens OK!"
      );
    } else {
      trava = true;

      alert(
        "Existe uma divergencia no JSON (J1), corrija o erro, antes de enviar ao banco de dados!"
      );
    }

    if (
      typeof String(
        json.base64_j2[0].anonimizaDadosRelatorios
      ).toLowerCase() === "string" &&
      typeof String(json.base64_j2[0].ativaEmailAlmGraves).toLowerCase() ===
        "string" &&
      typeof String(
        json.base64_j2[0].ativaEmailAlmGravissimos
      ).toLowerCase() === "string" &&
      typeof String(json.base64_j2[0].ativaEmailAlmSerios).toLowerCase() ===
        "string" &&
      typeof String(json.base64_j2[0].ativaSmsAlmGraves).toLowerCase() ===
        "string" &&
      typeof String(json.base64_j2[0].ativaSmsAlmGravissimos).toLowerCase() ===
        "string" &&
      typeof String(json.base64_j2[0].ativaSmsAlmSerios).toLowerCase() ===
        "string" &&
      typeof String(json.base64_j2[0].desativaPrintScreen).toLowerCase() ===
        "string" &&
      typeof String(json.base64_j2[0].filmar_sempre).toLowerCase() ===
        "string" &&
      typeof String(json.base64_j2[0].monitoraDispExternos).toLowerCase() ===
        "string" &&
      typeof String(
        json.base64_j2[0].quandoPegarDadosSensiveis
      ).toLowerCase() === "string" &&
      typeof String(json.base64_j2[0].imgBlockPrtSc).toLowerCase() ===
        "string" &&
      typeof String(json.base64_j2[0].qtMinQualifsTab).toLowerCase() ===
        "string" &&
      typeof String(json.base64_j2[0].qtMinQualifsDoc).toLowerCase() ===
        "string" &&
      typeof String(json.base64_j2[0].maxQtFalsosNomes).toLowerCase() ===
        "string" &&
      typeof String(
        json.base64_j2[0].qtPalsManterQualificador
      ).toLowerCase() === "string" &&
      typeof String(json.base64_j2[0].QtMaxLinhasResult).toLowerCase() ===
        "string" &&
      typeof String(json.base64_j2[0].tMinQualifsTab).toLowerCase() ===
        "string" &&
      typeof String(json.base64_j2[0].comFonetizacao).toLowerCase() ===
        "string" &&
      typeof String(json.base64_j2[0].notaCorteSerios).toLowerCase() ===
        "string" &&
      typeof String(json.base64_j2[0].notaCorteGraves).toLowerCase() ===
        "string" &&
      typeof String(json.base64_j2[0].notaCorteGravissimos).toLowerCase() ===
        "string" &&
      typeof String(json.base64_j2[0].pastasSensiveis).toLowerCase() ===
        "string" &&
      typeof String(json.base64_j2[0].tempoDragAndDrop).toLowerCase() ===
        "string" &&
      typeof String(json.base64_j2[0].impressaoSpooler).toLowerCase() ===
        "string"
    ) {
      alert(
        "Todos os campos do J2 foram verificas e estao com as tipagens OK!"
      );
    } else {
      trava = true;

      alert(
        "Existe uma divergencia no JSON (J2), corrija o erro, antes de enviar ao banco de dados!"
      );
    }

    for (let i = 0; i < json.base64_j3.length; i++) {
      if (
        typeof json.base64_j3[i].derruba_app === "boolean" &&
        typeof json.base64_j3[i].filma === "boolean" &&
        typeof json.base64_j3[i].permite_colar === "boolean" &&
        typeof json.base64_j3[i].monitora_ctrl === "boolean" &&
        typeof json.base64_j3[i].json === "boolean" &&
        typeof json.base64_j3[i].monitora_dados === "boolean" &&
        typeof json.base64_j3[i].particular === "boolean" &&
        typeof json.base64_j3[i].print === "boolean" &&
        typeof json.base64_j3[i].registra_copia === "boolean" &&
        typeof json.base64_j3[i].tipo === "boolean" &&
        typeof json.base64_j3[i].filtro_titulo === "boolean" &&
        typeof json.base64_j3[i].executavel === "boolean" &&
        typeof json.base64_j3[i].impede_dados === "boolean"
      ) {
        alert(
          "Todos os campos do J2 foram verificas e estao com as tipagens OK!"
        );
      } else {
        trava = true;

        alert(
          `Existe uma divergencia no JSON (J3) array: [${i}], corrija o erro, antes de enviar ao banco de dados!`
        );
      }
    }
  };

  /* ATUALIZA UM ITEM DO J3 */
  putIndexL3 = async (index, executavel, itemExistente) => {
    for (let i = 0; i < this.state.base64_j3.length; i++) {
      if (
        this.state.base64_j3[i].filtro_titulo == index &&
        String(index).toLowerCase() != ""
      ) {
        if (String(itemExistente.derruba_app).toLowerCase() == "true") {
          itemExistente.derruba_app = true;
        } else if (String(itemExistente.derruba_app).toLowerCase() == "false") {
          itemExistente.derruba_app = false;
        } else {
          itemExistente.derruba_app = this.state.derruba_app;
        }

        if (String(itemExistente.filma).toLowerCase() == "true") {
          itemExistente.filma = true;
        } else if (String(itemExistente.filma).toLowerCase() == "false") {
          itemExistente.filma = false;
        } else {
          itemExistente.filma = this.state.filma;
        }

        if (String(itemExistente.permite_colar).toLowerCase() == "true") {
          itemExistente.permite_colar = true;
        } else if (
          String(itemExistente.permite_colar).toLowerCase() == "false"
        ) {
          itemExistente.permite_colar = false;
        } else {
          itemExistente.permite_colar = this.state.permite_colar;
        }

        if (String(itemExistente.monitora_ctrl).toLowerCase() == "true") {
          itemExistente.monitora_ctrl = true;
        } else if (
          String(itemExistente.monitora_ctrl).toLowerCase() == "false"
        ) {
          itemExistente.monitora_ctrl = false;
        } else {
          itemExistente.monitora_ctrl = this.state.monitora_ctrl;
        }

        if (String(itemExistente.monitora_dados).toLowerCase() == "true") {
          itemExistente.monitora_dados = true;
        } else if (
          String(itemExistente.monitora_dados).toLowerCase() == "false"
        ) {
          itemExistente.monitora_dados = false;
        } else {
          itemExistente.monitora_dados = this.state.monitora_dados;
        }

        if (String(itemExistente.particular).toLowerCase() == "true") {
          itemExistente.particular = true;
        } else if (String(itemExistente.particular).toLowerCase() == "false") {
          itemExistente.particular = false;
        } else {
          itemExistente.particular = this.state.particular;
        }

        if (String(itemExistente.print).toLowerCase() == "true") {
          itemExistente.print = true;
        } else if (String(itemExistente.print).toLowerCase() == "false") {
          itemExistente.print = false;
        } else {
          itemExistente.print = this.state.print;
        }

        if (String(itemExistente.registra_copia).toLowerCase() == "true") {
          itemExistente.registra_copia = true;
        } else if (
          String(itemExistente.registra_copia).toLowerCase() == "false"
        ) {
          itemExistente.registra_copia = false;
        } else {
          itemExistente.registra_copia = this.state.registra_copia;
        }

        if (String(itemExistente.impede_dados).toLowerCase() == "true") {
          itemExistente.impede_dados = true;
        } else if (
          String(itemExistente.impede_dados).toLowerCase() == "false"
        ) {
          itemExistente.impede_dados = false;
        } else {
          itemExistente.impede_dados = this.state.impede_dados;
        }

        this.state.base64_j3[i].derruba_app = itemExistente.derruba_app;
        this.state.base64_j3[i].filma = itemExistente.filma;
        this.state.base64_j3[i].permite_colar = itemExistente.permite_colar;
        this.state.base64_j3[i].monitora_ctrl = itemExistente.monitora_ctrl;
        this.state.base64_j3[i].json = itemExistente.json;
        this.state.base64_j3[i].monitora_dados = itemExistente.monitora_dados;
        this.state.base64_j3[i].particular = itemExistente.particular;
        this.state.base64_j3[i].print = itemExistente.print;
        this.state.base64_j3[i].registra_copia = itemExistente.registra_copia;
        this.state.base64_j3[i].tipo = itemExistente.tipo;
        this.state.base64_j3[i].filtro_titulo = itemExistente.filtro_titulo;
        this.state.base64_j3[i].executavel = itemExistente.executavel;
        this.state.base64_j3[i].url = itemExistente.url;
        this.state.base64_j3[i].quando_pegar_dados_sensiveis = itemExistente.quando_pegar_dados_sensiveis;
        this.state.base64_j3[i].impede_dados = itemExistente.impede_dados;
      } else if (
        this.state.base64_j3[i].executavel == executavel &&
        String(executavel).toLowerCase() != ""
      ) {
        if (String(itemExistente.derruba_app).toLowerCase() == "true") {
          itemExistente.derruba_app = true;
        } else if (String(itemExistente.derruba_app).toLowerCase() == "false") {
          itemExistente.derruba_app = false;
        } else {
          itemExistente.derruba_app = this.state.derruba_app;
        }

        if (String(itemExistente.filma).toLowerCase() == "true") {
          itemExistente.filma = true;
        } else if (String(itemExistente.filma).toLowerCase() == "false") {
          itemExistente.filma = false;
        } else {
          itemExistente.filma = this.state.filma;
        }

        if (String(itemExistente.permite_colar).toLowerCase() == "true") {
          itemExistente.permite_colar = true;
        } else if (
          String(itemExistente.permite_colar).toLowerCase() == "false"
        ) {
          itemExistente.permite_colar = false;
        } else {
          itemExistente.permite_colar = this.state.permite_colar;
        }

        if (String(itemExistente.monitora_dados).toLowerCase() == "true") {
          itemExistente.monitora_dados = true;
        } else if (
          String(itemExistente.monitora_dados).toLowerCase() == "false"
        ) {
          itemExistente.monitora_dados = false;
        } else {
          itemExistente.monitora_dados = this.state.monitora_dados;
        }

        if (String(itemExistente.particular).toLowerCase() == "true") {
          itemExistente.particular = true;
        } else if (String(itemExistente.particular).toLowerCase() == "false") {
          itemExistente.particular = false;
        } else {
          itemExistente.particular = this.state.particular;
        }

        if (String(itemExistente.print).toLowerCase() == "true") {
          itemExistente.print = true;
        } else if (String(itemExistente.print).toLowerCase() == "false") {
          itemExistente.print = false;
        } else {
          itemExistente.print = this.state.print;
        }

        if (String(itemExistente.registra_copia).toLowerCase() == "true") {
          itemExistente.registra_copia = true;
        } else if (
          String(itemExistente.registra_copia).toLowerCase() == "false"
        ) {
          itemExistente.registra_copia = false;
        } else {
          itemExistente.registra_copia = this.state.registra_copia;
        }

        if (String(itemExistente.impede_dados).toLowerCase() == "true") {
          itemExistente.impede_dados = true;
        } else if (
          String(itemExistente.impede_dados).toLowerCase() == "false"
        ) {
          itemExistente.impede_dados = false;
        } else {
          itemExistente.impede_dados = this.state.impede_dados;
        }

        this.state.base64_j3[i].derruba_app = itemExistente.derruba_app;
        this.state.base64_j3[i].filma = itemExistente.filma;
        this.state.base64_j3[i].permite_colar = itemExistente.permite_colar;
        this.state.base64_j3[i].monitora_ctrl = itemExistente.monitora_ctrl;
        this.state.base64_j3[i].json = itemExistente.json;
        this.state.base64_j3[i].monitora_dados = itemExistente.monitora_dados;
        this.state.base64_j3[i].particular = itemExistente.particular;
        this.state.base64_j3[i].print = itemExistente.print;
        this.state.base64_j3[i].registra_copia = itemExistente.registra_copia;
        this.state.base64_j3[i].tipo = itemExistente.tipo;
        this.state.base64_j3[i].filtro_titulo = itemExistente.filtro_titulo;
        this.state.base64_j3[i].executavel = itemExistente.executavel;
        this.state.base64_j3[i].url = itemExistente.url;
        this.state.base64_j3[i].quando_pegar_dados_sensiveis = itemExistente.quando_pegar_dados_sensiveis;
        this.state.base64_j3[i].impede_dados = itemExistente.impede_dados;
      }

      /* ==================================== */
      /* ATRIBUI UM VALOR FIXO AO JSON E TIPO */
      /* ==================================== */
      if (this.state.base64_j3[i].json != "1") {
        this.state.base64_j3[i].json = 2;
        this.state.base64_j3[i].tipo = 1;
      }
    }

    /* DESSA FORMA OS NOVOS DADOS IRAM REFLETIR NO FRONT-END */
    this.setState({ base64_j3: this.state.base64_j3 });

    try {
      /* AJUSTA QUALQUER INCONSISTENCIA NAS PASTAS SENSIVEIS */
      this.state.pastasSensiveis = this.state.pastasSensiveis
        .split("\\\\")
        .join("\\");
      this.state.pastasSensiveis = this.state.pastasSensiveis.replace(
        /\\\\/g,
        "\\"
      );
    } catch (err) {
      console.log("Nao contem o campo: pastasSensiveis no JSON");
    }

    /* ENVIA UM ALERTA DE FEEDBACK AO USUARIO */
    alert("Item atualizado com sucesso!");
  };

  /* ===================== */
  /* === METODO DELETE === */
  /* ===================== */

  /* DELETE UM ITEM ESPECIFICO, E PARA ISSO PASSANDO COMO PARAMENTRO SEU tipo */
  deleteIndexL3 = async (nome) => {
    if (this.state.base64_j3.length == 1) {
      alert(
        "Você não pode deletar esse item, adicione um novo para poder deleta-lo!"
      );
    } else {
      for (let i = 0; i < this.state.base64_j3.length; i++) {
        if (this.state.base64_j3[i].filtro_titulo == nome) {
          // VERIFICA SE O ITEM EXISTE NO ARRAY
          var index = this.state.base64_j3[i].filtro_titulo.indexOf(nome);

          // DEPENDENDO DA RESPOSTA ELE ACESSA PARA EXCLUIR O ITEM OU NAO
          if (index > -1) {
            // EXCLUI O ITEM ESPECIFICO, PARA ISSO PASSANDO COMO PARAMENTRO O INDICE DO ITEM NO ARRAY E A QTD DE ITENS APOS ELE VC DESEJA EXCLUIR, NESSE CASO SERA APENAS 1, OU SEJA, ELE MESMO
            this.state.base64_j3.splice(i, 1);
          }
        }
      }

      /* DESSA FORMA OS NOVOS DADOS IRAM REFLETIR NO FRONT-END */
      this.setState({ base64_j3: this.state.base64_j3 });

      alert("Item deletado com sucesso!");
    }
  };

  componentDidMount() {
    bsCustomFileInput.init();
  }

  /* ================================================ */
  /* === DESCRIPTOGRAFA O JSON OBTIDO DA RESPOSTA === */
  /* ================================================ */

  converterJSON = async (obj) => {
    /* DESCRIPTOGRAFA O JSON E ARMAZENA OS DADOS EM VARIAVEIS PARA QUE POSSAM SER MANIPULADAS NO FRONT */
    /*for(let i = 0; i < obj.length; i++) {
      //let base64ToString = Buffer.from(obj[i].base64_j1, "base64").toString();
      //base64ToString = JSON.parse(base64ToString);

      //obj[i].base64_j1 = base64ToString;

      console.log("J1");
      console.log(obj[i].base64_j1);

      //let base64ToString2 = Buffer.from(obj[i].base64_j2, "base64").toString();
      //base64ToString2 = JSON.parse(base64ToString2);

      //obj[i].base64_j2 = base64ToString2;

      console.log("J2");
      console.log(obj[i].base64_j2);

      //let base64ToString3 = Buffer.from(obj[i].base64_j3, "base64").toString();
      //base64ToString3 = JSON.parse(base64ToString3);

      //obj[i].base64_j3 = base64ToString3;

      console.log("Meu J3");
      console.log(obj[i].base64_j3);

    }*/

    /* ======================================= */
    /* === CONVERTENDO STRING PARA BOOLEAN === */
    /* ======================================= */

    for (let i = 1; i < obj.length; i++) {
      if (String(obj[i].derruba_app).toLowerCase() == "true") {
        obj[i].derruba_app = true;
      } else if (String(obj[i].derruba_app).toLowerCase() == "false") {
        obj[i].derruba_app = false;
      }

      if (String(obj[i].filma).toLowerCase() == "true") {
        obj[i].filma = true;
      } else if (String(obj[i].filma).toLowerCase() == "false") {
        obj[i].filma = false;
      }

      if (String(obj[i].permite_colar).toLowerCase() == "true") {
        obj[i].permite_colar = true;
      } else if (String(obj[i].permite_colar).toLowerCase() == "false") {
        obj[i].permite_colar = false;
      }

      if (String(obj[i].monitora_dados).toLowerCase() == "true") {
        obj[i].monitora_dados = true;
      } else if (String(obj[i].monitora_dados).toLowerCase() == "false") {
        obj[i].monitora_dados = false;
      }

      if (String(obj[i].particular).toLowerCase() == "true") {
        obj[i].particular = true;
      } else if (String(obj[i].particular).toLowerCase() == "false") {
        obj[i].particular = false;
      }

      if (String(obj[i].print).toLowerCase() == "true") {
        obj[i].print = true;
      } else if (String(obj[i].print).toLowerCase() == "false") {
        obj[i].print = false;
      }

      if (String(obj[i].registra_copia).toLowerCase() == "true") {
        obj[i].registra_copia = true;
      } else if (String(obj[i].registra_copia).toLowerCase() == "false") {
        obj[i].registra_copia = false;
      }

      if (String(obj[i].impede_dados).toLowerCase() == "true") {
        obj[i].impede_dados = true;
      } else if (String(obj[i].impede_dados).toLowerCase() == "false") {
        obj[i].impede_dados = false;
      }
    }

    /* ATRIBUI OS DADOS DESCRIPTOGRAFADOS AO ARRAY NOVAMENTE PARA QUE POSSA SER MANIPULADO */
    this.setState({
      arrayDlp: obj,
    });

    var objetoJsonDefault = [];

    for (let i = 1; i < obj.length; i++) {
      objetoJsonDefault.push(obj[i]);
    }

    /* ARMAZENA SOMENTE O CONTEUDO DE J3 */
    this.setState({
      base64_j3: objetoJsonDefault,
    });

    console.log("J3 CONVERTIDO: ");
    console.log(this.state.base64_j3);
  };

  /* ==================================== */
  /* === CRIPTOGRAFAR O OBJETO OBTIDO === */
  /* ==================================== */

  criptografarJSON = async (obj) => {
    let trava = false;
    let tempo = 5000000 * 500;
    let contadorUnidade = 0;

    /* GARANTE QUE NAO TERA BARRAS A MAIS SENSO ENVIADAS AO BANCO */
    try {
      obj.base64_j2.pastasSensiveis = obj.base64_j2.pastasSensiveis.replaceAll(
        "\\\\",
        "\\"
      );
    } catch (e) {}

    /* CRIPTOGRAFA JSON */
    var jsonJ1 = JSON.stringify(obj.base64_j1);
    var converterParaBase64J1 = jsonJ1;
    obj.base64_j1 = converterParaBase64J1;

    var jsonJ3 = JSON.stringify(obj.base64_j3);

    for (let j = 0; j < jsonJ3.length; j++) {
      jsonJ3 = jsonJ3.replace("[", "");
      jsonJ3 = jsonJ3.replace("]", "");
    }

    /*console.log("J3 - Descriptografado e filtrado");
    console.log(jsonJ3);*/

    var converterParaBase64J3 = jsonJ3;
    obj.base64_j3 = converterParaBase64J3;

    //obj = JSON.stringify(obj);

    let memoriaObjetoEnvio = JSON.stringify(obj);

    memoriaObjetoEnvio = memoriaObjetoEnvio.replace('{"base64_j1":"', "");
    memoriaObjetoEnvio = memoriaObjetoEnvio.replace('"base64_j3":"', "");
    memoriaObjetoEnvio = memoriaObjetoEnvio.replace('}"}', "}");
    memoriaObjetoEnvio = memoriaObjetoEnvio.replace('}",', "},");
    memoriaObjetoEnvio = memoriaObjetoEnvio.replace('"""', '"');

    memoriaObjetoEnvio = "[" + memoriaObjetoEnvio + "]";

    console.log("ENVIO PARA O POST: ");
    console.log(memoriaObjetoEnvio);

    try {
      memoriaObjetoEnvio = memoriaObjetoEnvio.replaceAll("\\", "");
    } catch (erro) {}

    const objetoEnvio = {
      maquina: "default",
      hash_maquina: null,
      computer_name: null,
      grupo_dlp: this.state.grupoDlp,
      json: memoriaObjetoEnvio,
      cksum:
        Math.floor(Math.random() * (9 - 1 + 1) + 1) +
        Math.floor(Math.random() * (9 - 1 + 1) + 1) +
        "0928388957859716925780694" +
        Math.floor(Math.random() * (9 - 1 + 1) + 1) +
        Math.floor(Math.random() * (9 - 1 + 1) + 1),
      data_atualizacao:
        new Date().getFullYear() +
        "-" +
        (new Date().getMonth() + 1) +
        "-" +
        new Date().getDate() +
        " " +
        new Date().getHours() +
        ":" +
        new Date().getMinutes() +
        ":" +
        new Date().getSeconds(),
    };

    console.log("OBJ ENVIO");
    console.log(objetoEnvio);

    /* MODELO ANTIGO 
    DlpController.postGrupoDLP(objetoEnvio).then((response) =>
      console.log(response)
    );
    */

    DlpController.postGrupoDLP(objetoEnvio).then((response) =>{
      if(response.status >= 200 && response.status < 299){
        alert(response.data);
      }else {
        alert("Ocorreu um erro com o seu processamento! Favor tentar novamente mais tarde ou consultar o suporte técnico.");
        throw new Error(response.status);
      }
    });


    this.state.token = DlpController.capituraToken();

    var tokenAcesso = this.state.token;

    setTimeout(function () {
      window.location.href = `${DlpController.ambienteRedirecionamentoReact()}/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
    }, 300);

    /*for(let i = 0; i < this.state.todosDadosArrayDlp.length; i++) {
      for(let j = 0; j < this.state.selecao.length; j++) {
        
        if(this.state.todosDadosArrayDlp[i].maquina === this.state.selecao[j] && !trava) {
          //console.log("Array Dados: "+ this.state.todosDadosArrayDlp[i].maquina);
          //console.log("Selecao: "+ this.state.selecao[j]);

          obj.grupo_dlp = this.state.todosDadosArrayDlp[i].grupo_dlp;
          obj.maquina = this.state.todosDadosArrayDlp[i].maquina;
          obj.computer_name = this.state.todosDadosArrayDlp[i].computer_name;

          let memoriaObjetoEnvio = JSON.stringify(obj);

          //console.log(memoriaObjetoEnvio);

          // ARMAZENA O JSON ATUALIZADO E CRIPTOGRAFADO EM UM OBJETO PARA QUE POSSA SER ENVIADO VIA REQUISICAO REST
          //this.state.arrayParaEnvioAoServidor = memoriaObjetoEnvio;
          this.state.arrayParaEnvioAoServidor.push(memoriaObjetoEnvio);

          // ENDPOINT DE ENVIO UNITARIO 
          //DlpController.postJson(this.state.arrayParaEnvioAoServidor)
          //.then(response => console.log(response));

          //while(tempo > 0) {
          //  tempo--;
          //}

          //tempo = (5000000 * 500);

          // REDIRECIONAR USUARIO
          this.state.token = DlpController.capituraToken();

          var tokenAcesso = this.state.token;

          // Redireciona o usuário para a página informada
          //setTimeout(function() {
            //window.location.href = `http://54.207.237.19:3001/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
            //window.location.href = `https://app.flashsafe.com:3003/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
            //window.location.href = `https://app.flashsafe.com:3001/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
            //window.location.href = `https://app.flashsafe.com:3000/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
            //window.location.href = `https://app.flashsafe.com:3007/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
            //window.location.href = `http://m2g.com.br:3000/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
            //window.location.href = `https://app.flashsafe.com:3006/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
            //window.location.href = `https://app.flashsafe.com:3009/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
            //window.location.href = `http://54.207.116.254:3000/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
            //window.location.href = `http://localhost:3000/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
            
          //}, 300);


          trava = true;

          //console.log(`NOVO ENVIO: ${contadorUnidade}`);
          //console.log(this.state.arrayParaEnvioAoServidor);
          //contadorUnidade++;
          
        }

        if(trava) {
          break;
        }

      }

      trava = false;

    }*/

    this.state.arrayParaEnvioAoServidor.forEach((dado, i) => {
      setTimeout(function () {
        console.log("Timer contador!!");
        console.log("Posicao: " + i);
        console.log(dado);

        //DlpController.postJson(dado)
        //.then(response => console.log(response))
        //console.log(dado);
      }, i * 500 + 500);
    });

    //setTimeout(function() {
    //window.location.href = `http://54.207.237.19:3001/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
    //window.location.href = `https://app.flashsafe.com:3003/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
    //window.location.href = `https://app.flashsafe.com:3001/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
    //window.location.href = `https://app.flashsafe.com:3000/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
    //window.location.href = `https://app.flashsafe.com:3007/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
    //window.location.href = `http://m2g.com.br:3000/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
    //window.location.href = `https://app.flashsafe.com:3006/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
    //window.location.href = `https://app.flashsafe.com:3009/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
    //window.location.href = `http://54.207.116.254:3000/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
    //window.location.href = `http://localhost:3000/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;

    //}, (this.state.arrayParaEnvioAoServidor.length * 1000));

    //if(this.state.arrayParaEnvioAoServidor.length > 0) {
    //  this.recursaoMetodo(this.state.arrayParaEnvioAoServidor[0], (Math.random() * (10 - 1) + 1));
    //}
  };

  /*recursaoMetodo = async (obj, i) => {
    setTimeout(
      function(){
        console.log('Timer contador!!');
        DlpController.postJson(obj)
        .then(response => console.log(response))
      }
    , (i * 10000) + 10000);

    this.state.arrayParaEnvioAoServidor.shift();

    if(this.state.arrayParaEnvioAoServidor.length > 0) {
      this.recursaoMetodo(this.state.arrayParaEnvioAoServidor[0], (Math.random() * (10 - 1) + 1));
    }
  } */

  /* ================== */
  /* === ZERA ARRAY === */
  /* ================== */
  zerarVariaveis = async () => {
    this.state.nome = "";

    this.setState({
      arrayDlp: [],
    });
  };

  /* ===================================== */
  /* === ZERA VARIAVEIS DE AMBIENTE J3 === */
  /* ===================================== */
  zerarVariaviesJ3 = async () => {
    this.state.derruba_app = false;
    this.state.filma = false;
    this.state.permite_colar = false;
    this.state.monitora_ctrl = false;
    this.state.json = 0;
    this.state.monitora_dados = false;
    this.state.particular = false;
    this.state.print = false;
    this.state.registra_copia = false;
    this.state.tipo = "";
    this.state.filtro_titulo = "";
    this.state.executavel = "";
    this.state.url = "";
    this.state.quando_pegar_dados_sensiveis = "";
    this.state.impede_dados = false;
  };

  ajustaBarras = async () => {
    try {
      /* AJUSTA QUALQUER INCONSISTENCIA NAS PASTAS SENSIVEIS */
      this.state.pastasSensiveis = this.state.pastasSensiveis
        .split("\\\\")
        .join("\\");
      this.state.pastasSensiveis = this.state.pastasSensiveis.replace(
        /\\\\/g,
        "\\"
      );
    } catch (err) {
      console.log("Nao contem o campo: pastasSensiveis no JSON");
    }
  }; /* VERIFICAR SE ESSE PODE SER O OCASIONADOR DO ERRO APOS TRES ALTERACOES OS DADOS RESETAM TEM QUE VER ISSO */ /* ========================== */

  /* ========================== */
  /* CONTADOR DE COMPRIMENTO J3 */ verificadorIndexJ3 = async () => {
    this.setState({
      comprimentoJ3: this.state.comprimentoJ3 + 1,
    });
  };

  /* ================================= */
  /* VERIFICA PERMISSAO DE USUARIO (*) */
  /* ================================= */
  verificarPrivilegio = async () => {
    /* CAPTURA O TOKEN POR MEIO DO METODO CONTROLLER QUE TRAZ DO AXIOS O TOKEN DO USUARIO CADASTRADO */
    let tokenUsuario = DlpController.capituraToken();

    /* DESCRIPTOGRAFA O TOKEN */
    let base64ToString = "";

    try {
      base64ToString = Buffer.from(tokenUsuario, "base64").toString();
    } catch (erro) {
      console.log("VOCÊ ESTA SEM TOKEN, FAÇA O LOGIN NOVAMENTE");

      window.location.href = DlpController.ambienteRedirecionamento();
    }

    /* NAVEGA NA STRING DO TOKEN */
    for (let i = 0; i < base64ToString.length; i++) {
      /* VERIFICA SE NA POSICAO ATUAL SE TRATA DE UM *, CASO SEJA RETORNA O VALOR TRUE PARA REALIZAR A LIBERACAO TOTAL AS CONFIGURACOES */
      if (String(base64ToString[i]) == "*") {
        console.log("Contem *");
      }
    }
  };

  /* === CONVERTE STRING PARA BOOLEAN === */
  converteStringParaBoolean = async () => {
    /* ======================================= */
    /* === CONVERTENDO STRING PARA BOOLEAN === */
    /* ======================================= */

    for (let i = 0; i < this.state.base64_j3.length; i++) {
      if (String(this.state.base64_j3[i].derruba_app).toLowerCase() == "true") {
        this.state.base64_j3[i].derruba_app = true;
      } else if (
        String(this.state.base64_j3[i].derruba_app).toLowerCase() == "false"
      ) {
        this.state.base64_j3[i].derruba_app = false;
      }

      if (String(this.state.base64_j3[i].filma).toLowerCase() == "true") {
        this.state.base64_j3[i].filma = true;
      } else if (
        String(this.state.base64_j3[i].filma).toLowerCase() == "false"
      ) {
        this.state.base64_j3[i].filma = false;
      }

      if (
        String(this.state.base64_j3[i].permite_colar).toLowerCase() == "true"
      ) {
        this.state.base64_j3[i].permite_colar = true;
      } else if (
        String(this.state.base64_j3[i].permite_colar).toLowerCase() == "false"
      ) {
        this.state.base64_j3[i].permite_colar = false;
      }

      if (
        String(this.state.base64_j3[i].monitora_dados).toLowerCase() == "true"
      ) {
        this.state.base64_j3[i].monitora_dados = true;
      } else if (
        String(this.state.base64_j3[i].monitora_dados).toLowerCase() == "false"
      ) {
        this.state.base64_j3[i].monitora_dados = false;
      }

      if (String(this.state.base64_j3[i].particular).toLowerCase() == "true") {
        this.state.base64_j3[i].particular = true;
      } else if (
        String(this.state.base64_j3[i].particular).toLowerCase() == "false"
      ) {
        this.state.base64_j3[i].particular = false;
      }

      if (String(this.state.base64_j3[i].print).toLowerCase() == "true") {
        this.state.base64_j3[i].print = true;
      } else if (
        String(this.state.base64_j3[i].print).toLowerCase() == "false"
      ) {
        this.state.base64_j3[i].print = false;
      }

      if (
        String(this.state.base64_j3[i].registra_copia).toLowerCase() == "true"
      ) {
        this.state.base64_j3[i].registra_copia = true;
      } else if (
        String(this.state.base64_j3[i].registra_copia).toLowerCase() == "false"
      ) {
        this.state.base64_j3[i].registra_copia = false;
      }

      if (
        String(this.state.base64_j3[i].impede_dados).toLowerCase() == "true"
      ) {
        this.state.base64_j3[i].impede_dados = true;
      } else if (
        String(this.state.base64_j3[i].impede_dados).toLowerCase() == "false"
      ) {
        this.state.base64_j3[i].impede_dados = false;
      }
    }
  };

  semAcesso = async () => {
    window.document
      .querySelector(".privilegio")
      .setAttribute("style", "display: block !important;");
  };

  /* ====================================== */
  /* === MOSTRAR ADICIONAR NOVO ITEM L3 === */
  /* ====================================== */
  mostrarAdicionar = async () => {
    window.document
      .querySelector(".adicionar")
      .setAttribute("style", "display: block !important;");
  };

  /* ======================================= */
  /* === ESCONDER ADICIONAR NOVO ITEM L3 === */
  /* ======================================= */
  esconderAdicionar = async () => {
    window.document
      .querySelector(".adicionar")
      .setAttribute("style", "display: none !important;");
  };

  /* ================================= */
  /* === MOSTRAR ATUALIZAR ITEM L3 === */
  /* ================================= */
  mostrarAtualizar = async () => {
    window.document
      .querySelector(".modal")
      .setAttribute("style", "display: block !important;");
    window.document
      .querySelector(".modal-backdrop")
      .setAttribute("style", "display: block !important;");
  };

  /* ======================================= */
  /* === ESCONDER ADICIONAR NOVO ITEM L3 === */
  /* ======================================= */
  esconderAtualizar = async () => {
    window.document
      .querySelector(".modal")
      .setAttribute("style", "display: none !important;");
    window.document
      .querySelector(".modal-backdrop")
      .setAttribute("style", "display: none !important;");
  };

  /* ====================================== */
  /* === ENVIAR DADOS PARA CRIPTOGRAFAR === */
  /* ====================================== */
  enviarDadosAoServidor = async () => {
    this.setState({ enviarJson: true });

    /*if(this.state.grupoDlp.length > 0 && this.state.selecao.length > 0) {
      this.setState({enviarJson: true});

    }else {
      this.setState({enviarJson: false});

      alert('Preencha os campos corretamente antes de enviar o JSON');

    }*/
  };

  /* ========================= */
  /* === ICONE DE PESQUISA === */
  /* ========================= */
  carregadandoPesquisa = async () => {
    window.document
      .querySelector(".buttonload")
      .setAttribute("style", "display: block !important;");
    window.document
      .querySelector(".carregando")
      .setAttribute("style", "display: block !important;");

    setTimeout(function () {
      window.document.querySelector(".pesquisando").disabled = true;
    }, 100);

    setTimeout(function () {
      window.document
        .querySelector(".buttonload")
        .setAttribute("style", "display: none !important;");
      window.document
        .querySelector(".carregando")
        .setAttribute("style", "display: none !important;");
      window.document.querySelector(".pesquisando").disabled = false;
    }, 1000);
  };

  /* =================================== */
  /* === CONFIGURACAO MOSTRAR ALETAS === */
  /* =================================== */
  mostrarAlerta = async (mensagem) => {
    window.document
      .querySelector(".alerta")
      .setAttribute("style", "display: block !important;");

    this.state.alerta = mensagem;
  };

  /* =================================== */
  /* === CONFIGURACAO OCULTAR ALETAS === */
  /* =================================== */
  ocultarAlerta = async () => {
    window.document
      .querySelector(".alerta")
      .setAttribute("style", "display: none !important;");

    this.state.alerta = "";
  };

  /* ===================== */
  /* === AJUSTA INPUTS === */
  /* ===================== */
  ajustaInputs = async () => {
    /* DEIXAR OS BOTOES COM PADRAO HABILITADO */
    window.document.getElementById("controle-executavel").disabled = false;
    window.document.getElementById("controle-filtro").disabled = false;
  };

  /* =================================== */
  /* === ESTRUTURA SWITCH === */
  /* =================================== */
  handleOnSelect = (row, isSelect) => {
    if (isSelect) {
      this.setState(() => ({
        selecao: [...this.state.selecao, row.cksum],
      }));
    } else {
      this.setState(() => ({
        selecao: this.state.selecao.filter((x) => x !== row.cksum),
      }));
    }
  };

  handleOnSelectAll = (isSelect, rows) => {
    const ids = rows.map((r) => r.cksum);
    if (isSelect) {
      this.setState(() => ({
        selecao: ids,
      }));
    } else {
      this.setState(() => ({
        selecao: [],
      }));
    }
  };

  render() {
    const selectRow = {
      mode: "checkbox",
      clickToSelect: true,
      selecao: this.state.selecao,
      onSelect: this.handleOnSelect,
      onSelectAll: this.handleOnSelectAll,
    };
    return (
      <div>
        {/*<div className="row">

          <div className="col-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <BootstrapTable keyField='cksum' data={ this.state.dadosFiltrados } columns={ columns } selectRow={ selectRow } filter={ filterFactory() } pagination={ paginationFactory() } />
                <p>{ this.state.selecao }</p>

                <div className="botoes-acoes">
                  <a href="#adicionarAncoramento" className="botao-salvar-alteracoes" >
                    <button type="button" onClick={ () => this.mostrarAdicionar() } > Proximo passo </button>
                  </a>
                </div>

              </div>
            </div>
          </div>

        </div>*/}

        <div className="row adicionar ativar" id="adicionarAncoramento">
          <div className="col-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                {/* ENVIANDO ITENS PADROES PARA DIVERSAS MAQUINAS */}
                <form
                  className="row mt-3 ajuste-form"
                  onSubmit={this.handleSubmitPutComputador}
                >
                  {/*<p className="card-description"> Configuração Grupo DLP. </p>*/}
                  {/*<Form.Group>
                    <label htmlFor="exampleInputName1">Inserir Grupo DLP</label>
                    <Form.Control type="text" name="name" className="form-control" id="exampleInputName1" placeholder="Digite o nome do grupo" onChange={this.handleChangeNome} />
                  </Form.Group>*/}

                  {/* BASE x64 - J1 */}
                  <p className="card-description">
                    {" "}
                    JSON - Configurações | J1{" "}
                  </p>
                  <div className="row col-md-12 inputs">
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Titulos A Desprezar"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value={this.state.titulosADesprezar}
                            onChange={this.handleChangeTitulosADesprezar}
                          />
                        </div>
                      </Form.Group>
                    </div>

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Classes Debugar"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value={this.state.classesDebugar}
                            onChange={this.handleChangeClassesDebugar}
                          />
                        </div>
                      </Form.Group>
                    </div>

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Jans Filhas Monitorar"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value={this.state.jansFilhasMonitorar}
                            onChange={this.handleChangeJansFilhasMonitorar}
                          />
                        </div>
                      </Form.Group>
                    </div>

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control type="text" value="IP Cloud" disabled />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value={this.state.ipCloud}
                            onChange={this.handleChangeIpCloud}
                          />
                        </div>
                      </Form.Group>
                    </div>

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Porta Cloud"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value={this.state.portaCloud}
                            onChange={this.handleChangePortaCloud}
                          />
                        </div>
                      </Form.Group>
                    </div>

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Porta DLP"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value={this.state.portaDlp}
                            onChange={this.handleChangePortaDlp}
                          />
                        </div>
                      </Form.Group>
                    </div>

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Conectivos Excluir"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value={this.state.conectivosExcluir}
                            onChange={this.handleChangeConectivosExcluir}
                          />
                        </div>
                      </Form.Group>
                    </div>

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Drive Server"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value={this.state.driveServer}
                            onChange={this.handleChangeDriveServer}
                          />
                        </div>
                      </Form.Group>
                    </div>

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Percentual Compac. Arquivos"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value={this.state.percentualCompacArquivos}
                            onChange={this.handleChangePercentualCompacArquivos}
                          />
                        </div>
                      </Form.Group>
                    </div>

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Origens Alarme"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value={this.state.origensAlarme}
                            onChange={this.handleChangeOrigensAlarme}
                          />
                        </div>
                      </Form.Group>
                    </div>

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Status Alarme"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value={this.state.statusAlarme}
                            onChange={this.handleChangeStatusAlarme}
                          />
                        </div>
                      </Form.Group>
                    </div>

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Tipo Alarme"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value={this.state.tiposAlarme}
                            onChange={this.handleChangeTiposAlarme}
                          />
                        </div>
                      </Form.Group>
                    </div>

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-12">
                          <Form.Control
                            type="text"
                            value="Cliente Atual"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-12">
                          <Form.Control
                            type="text"
                            value={this.state.cliAtual}
                            onChange={this.handleChangeCliAtual}
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>

                    <div className="col-md-6">
                      <Form.Group className="row">
                        <div className="col-sm-12">
                          <Form.Control
                            type="text"
                            value="Grupo DLP"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group className="row">
                        <div className="col-sm-12">
                          <Form.Control
                            type="text"
                            pattern="^[a-zA-Z0-9_]{4,100}$"
                            value= {this.state.grupoDlp}
                            onChange={this.handleChangeGrupoDlp}
                          />
                        </div>
                      </Form.Group>
                    </div>

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Extensões sensíveis"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value={this.state.extensoesSensiveis}
                            onChange={this.handleChangeExtensoesSensiveis}
                          />
                        </div>
                      </Form.Group>
                    </div>

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-12">
                          <Form.Control
                            type="text"
                            value="Cod. Cliente"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-12">
                          <Form.Control
                            type="number"
                            value={this.state.codCliente}
                            onChange={this.handleChangeCodCliente}
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-12">
                          <Form.Control
                            type="text"
                            value="Cod. Maquina Usuario"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-12">
                          <Form.Control
                            type="number"
                            value={this.state.codigoMaquinaPorUsuario}
                            onChange={this.handleChangeCodigoMaquinaPorUsuario}
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                  </div>

                  {/* BASE x64 - J2 */}
                  <p className="card-description">
                    {" "}
                    JSON - Configurações | J2{" "}
                  </p>
                  <div className="row col-md-12 inputs">
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Anonimiza Dados Relatorios"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <select
                            className="opcoes-select"
                            name="estado"
                            value={this.state.anonimizaDadosRelatorios}
                            onChange={this.handleChangeAnonimizaDadosRelatorios}
                          >
                            {/*<option value="">Selecione</option>*/}
                            <option value="0">0 - Desabilitar</option>
                            <option value="1">1 - habilitar</option>
                          </select>
                          {/*<Form.Control type="text" value={this.state.anonimizaDadosRelatorios} onChange={this.handleChangeAnonimizaDadosRelatorios} />*/}
                        </div>
                      </Form.Group>
                    </div>

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Ativa Email Alm. Graves"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value={this.state.ativaEmailAlmGraves}
                            onChange={this.handleChangeAtivaEmailAlmGraves}
                          />
                        </div>
                      </Form.Group>
                    </div>

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Ativa Email Alm. Gravissimos"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value={this.state.ativaEmailAlmGravissimos}
                            onChange={this.handleChangeAtivaEmailAlmGravissimos}
                          />
                        </div>
                      </Form.Group>
                    </div>

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Ativa Email Alm. Serios"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value={this.state.ativaEmailAlmSerios}
                            onChange={this.handleChangeAtivaEmailAlmSerios}
                          />
                        </div>
                      </Form.Group>
                    </div>

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Ativa SMS Alm. Graves"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value={this.state.ativaSmsAlmGraves}
                            onChange={this.handleChangeAtivaSmsAlmGraves}
                          />
                        </div>
                      </Form.Group>
                    </div>

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Ativa SMS Alm. Gravissimos"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value={this.state.ativaSmsAlmGravissimos}
                            onChange={this.handleChangeAtivaSmsAlmGravissimos}
                          />
                        </div>
                      </Form.Group>
                    </div>

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Ativa SMS Alm. Serios"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value={this.state.ativaSmsAlmSerios}
                            onChange={this.handleChangeAtivaSmsAlmSerios}
                          />
                        </div>
                      </Form.Group>
                    </div>

                    <div className="col-md-6">
                      <Form.Group className="row">
                        <div className="col-sm-12">
                          <Form.Control
                            type="text"
                            value="Print Screen"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group className="row">
                        <div className="col-sm-12">
                          <select
                            className="opcoes-select"
                            name="estado"
                            value={this.state.desativaPrintScreen}
                            onChange={this.handleChangeDesativaPrintScreen}
                          >
                            {/*<option value="">Selecione</option>*/}
                            <option value="0">Libera</option>
                            <option value="1">Bloqueia</option>
                          </select>
                          {/*<Form.Control type="text" value={this.state.desativaPrintScreen} onChange={this.handleChangeDesativaPrintScreen} />*/}
                        </div>
                      </Form.Group>
                    </div>

                    {/*
                    <div className="col-md-6">
                      <Form.Group className="row">
                        <div className="col-sm-12">
                        <Form.Control type="text" value="Filmar Sempre" disabled />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group className="row">
                        <div className="col-sm-12">
                          <select className="opcoes-select" name="estado" value={this.state.filmar_sempre} onChange={this.handleChangeFilmarSempre} >
                           
                            <option value="0">0 - Desabilitar</option>
                            <option value="1">1 - habilitar</option>
                          </select>
                        </div>
                      </Form.Group>
                    </div>

                    {/*<div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                        <Form.Control type="text" value="Gatilho Linhas Não Relevantes" disabled />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                        <Form.Control type="text" value={this.state.gatilhoLinhasNaoRelevantes} onChange={this.handleChangeGatilhoLinhasNaoRelevantes} />
                        </div>
                      </Form.Group>
                    </div>*/}

                    {/*<div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                        <Form.Control type="text" value="Gatilho Linhas Proximas" disabled />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                        <Form.Control type="text" value={this.state.gatilhoLinhasProximas} onChange={this.handleChangeGatilhoLinhasProximas} />
                        </div>
                      </Form.Group>
                    </div>*/}

                    {/*<div className="col-md-6">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                        <Form.Control type="text" value="Informa Ações Usuário" disabled />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                        <Form.Control type="text" value={this.state.informaAcoesUsuario} onChange={this.handleChangeInformaAcoesUsuario} />
                        </div>
                      </Form.Group>
                    </div>*/}

                    {/*<div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                        <Form.Control type="text" value="Ja Carreguei Server" disabled />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                        <Form.Control type="text" value={this.state.jaCarregueiServer} onChange={this.handleChangeJaCarregueiServer} />
                        </div>
                      </Form.Group>
                    </div>*/}

                    {/*<div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                        <Form.Control type="text" value="Max. Dados Relevantes" disabled />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                        <Form.Control type="text" value={this.state.maxDadosRelevantes} onChange={this.handleChangeMaxDadosRelevantes} />
                        </div>
                      </Form.Group>
                    </div>*/}

                    {/*<div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                        <Form.Control type="text" value="Max. Linhas Comentário" disabled />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                        <Form.Control type="text" value={this.state.maxLinhasComentario} onChange={this.handleChangeMaxLinhasComentario} />
                        </div>
                      </Form.Group>
                    </div>*/}

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Monitora Disp. Externos"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <select
                            className="opcoes-select"
                            name="estado"
                            value={this.state.monitoraDispExternos}
                            onChange={this.handleChangeMonitoraDispExternos}
                          >
                            {/*<option value="">Selecione</option>*/}
                            <option value="0">0 - Desabilitar</option>
                            <option value="1">1 - habilitar</option>
                          </select>
                          {/*<Form.Control type="text" value={this.state.monitoraDispExternos} onChange={this.handleChangeMonitoraDispExternos} />*/}
                        </div>
                      </Form.Group>
                    </div>

                    {/*<div className="col-md-6">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                        <Form.Control type="text" value="Não Derruba Maquina" disabled />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                        <Form.Control type="text" value={this.state.naoDerrubaMaquina} onChange={this.handleChangeNaoDerrubaMaquina} />
                        </div>
                      </Form.Group>
                    </div>*/}

                    {/*<div className="col-md-6">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                        <Form.Control type="text" value="Não Inicializa Maquina" disabled />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                        <Form.Control type="text" value={this.state.naoInicializaMaquina} onChange={this.handleChangeNaoInicializaMaquina} />
                        </div>
                      </Form.Group>
                    </div>*/}

                    {/*<div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                        <Form.Control type="text" value="Percentual Relevancia" disabled />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                        <Form.Control type="text" value={this.state.percentualRelevancia} onChange={this.handleChangePercentualRelevancia} />
                        </div>
                      </Form.Group>
                    </div>*/}

                    {/*<div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                        <Form.Control type="text" value="Qt. Infos. Graves" disabled />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                        <Form.Control type="text" value={this.state.qtInfosGrave} onChange={this.handleChangeQtInfosGrave} />
                        </div>
                      </Form.Group>
                    </div>*/}

                    {/*<div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                        <Form.Control type="text" value="Qt. Infos. Gravissimos" disabled />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                        <Form.Control type="text" value={this.state.qtInfosGravissimo} onChange={this.handleChangeQtInfosGravissimo} />
                        </div>
                      </Form.Group>
                    </div>*/}

                    {/*<div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                        <Form.Control type="text" value="Qt. Infos. Serios" disabled />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                        <Form.Control type="text" value={this.state.qtInfosSerio} onChange={this.handleChangeQtInfosSerio} />
                        </div>
                      </Form.Group>
                    </div>*/}

                    <div className="col-md-6">
                      <Form.Group className="row">
                        <div className="col-sm-12">
                          <Form.Control
                            type="text"
                            value="Quando Pegar Dados Sensíveis"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group className="row">
                        <div className="col-sm-12">
                          <select
                            className="opcoes-select"
                            name="estado"
                            value={this.state.quandoPegarDadosSensiveis}
                            onChange={
                              this.handleChangeQuandoPegarDadosSensiveis
                            }
                          >
                            <option value="1">Mostra aviso</option>
                            <option value="2">Anula ação</option>
                            <option value="5">Apenas monitora dispositivo</option>
                          </select>
                        </div>
                      </Form.Group>
                    </div>

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-12">
                          <Form.Control
                            type="text"
                            value="Movimentação de arquivo(s)"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-12">
                          <select
                            className="opcoes-select"
                            name="estado"
                            value={this.state.semDragDrop}
                            onChange={this.handleChangesemDragDrop}
                          >
                            <option value="1">Ativar Monitoramento</option>
                            <option value="2">Desativar Monitoramento</option>
                            <option value="3">Bloqueio de Movimentação de Arquivos</option>
                          </select>
                        </div>
                      </Form.Group>
                    </div>

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="IMG Block PrtSc"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value={this.state.imgBlockPrtSc}
                            onChange={this.handleChangeImgBlockPrtSc}
                          />
                        </div>
                      </Form.Group>
                    </div>

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Qt. Min. QualifsTab"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value={this.state.qtMinQualifsTab}
                            onChange={this.handleChangeQtMinQualifsTab}
                          />
                        </div>
                      </Form.Group>
                    </div>

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Qt. Min. QualifsDoc"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value={this.state.qtMinQualifsDoc}
                            onChange={this.handleChangeQtMinQualifsDoc}
                          />
                        </div>
                      </Form.Group>
                    </div>

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Max. Qt. Falsos Nomes"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value={this.state.maxQtFalsosNomes}
                            onChange={this.handleChangeMaxQtFalsosNomes}
                          />
                        </div>
                      </Form.Group>
                    </div>

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Qt. Pals. Manter Qualificador"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value={this.state.qtPalsManterQualificador}
                            onChange={this.handleChangeQtPalsManterQualificador}
                          />
                        </div>
                      </Form.Group>
                    </div>

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Qt. Max. Linhas Result."
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value={this.state.QtMaxLinhasResult}
                            onChange={this.handleChangeQtMaxLinhasResult}
                          />
                        </div>
                      </Form.Group>
                    </div>

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="TMin. QualifsTab"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value={this.state.tMinQualifsTab}
                            onChange={this.handleChangeTMinQualifsTab}
                          />
                        </div>
                      </Form.Group>
                    </div>

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Com Fonetizacao"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value={this.state.comFonetizacao}
                            onChange={this.handleChangeComFonetizacao}
                          />
                        </div>
                      </Form.Group>
                    </div>

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Nota Corte Serios"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value={this.state.notaCorteSerios}
                            onChange={this.handleChangeNotaCorteSerios}
                          />
                        </div>
                      </Form.Group>
                    </div>

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Nota Corte Graves"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value={this.state.notaCorteGraves}
                            onChange={this.handleChangeNotaCorteGraves}
                          />
                        </div>
                      </Form.Group>
                    </div>

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Nota Corte Gravissimos"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value={this.state.notaCorteGravissimos}
                            onChange={this.handleChangeNotaCorteGravissimos}
                          />
                        </div>
                      </Form.Group>
                    </div>

                    {/*<div className="col-md-6">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                        <Form.Control type="text" value="Tipo DPO" disabled />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                        <Form.Control type="text" value={this.state.tipoDpo} onChange={this.handleChangeTipoDpo} />
                        </div>
                      </Form.Group>
                    </div> 
                          */}
 
                    <div className="col-md-6">
                      <Form.Group className="row">
                        <div className="col-sm-12">
                        <Form.Control type="text" value="Drivers Permitidos" disabled />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group className="row">
                        <div className="col-sm-12">
                        <Form.Control type="text" value={this.state.driversPermitidos} onChange={this.handleChangedriversPermitidos} />
                        </div>
                      </Form.Group>
                    </div>
                    
                    <div className="col-md-6">
                      <Form.Group className="row">
                        <div className="col-sm-12">
                        <Form.Control type="text" value="Movimentação de Arquivos" disabled />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                        <Form.Group className="row">
                          <div className="col-sm-12">
                            <select
                              className="opcoes-select"
                              name="estado"
                              value={this.state.impedirDragDrop}
                              onChange={this.handleChangeDragAndDrop}
                            >
                              <option value="0">Libera</option>
                              <option value="1">Bloqueia</option>
                            </select>
                          </div>
                        </Form.Group>
                      </div>

                    {/*
                    <div className="col-md-6">
                      <Form.Group className="row">
                        <div className="col-sm-12">
                        <Form.Control type="text" value="Tempo Drag and Drop" disabled />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group className="row">
                        <div className="col-sm-12">
                          <select className="opcoes-select" name="estado" value={this.state.tempoDragAndDrop} onChange={this.handleChangeTempoDragAndDrop} >
                            <option value="1">1 HORA</option>
                            <option value="8">8 HORA</option>
                            <option value="INDETERMINADO">INDETERMINADO</option>
                            <option value="BLOQUEADO">BLOQUEADO</option>
                          </select>
                        </div>
                      </Form.Group>
                    </div>
*/}
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-12">
                          <Form.Control
                            type="text"
                            value="Impressão"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-12">
                          <select
                            className="opcoes-select"
                            name="estado"
                            value={this.state.impressaoSpooler}
                            onChange={this.handleChangeImpressaoSpooler}
                          >
                            <option value="LIBERADO">LIBERADO</option>
                            <option value="BLOQUEADO">BLOQUEADO</option>
                          </select>
                        </div>
                      </Form.Group>
                    </div>
                  </div>

                  {/* BASE x64 - J3 */}
                  <p className="card-description">
                    {" "}
                    JSON - Configurações | J3 | Adicione uma Configuração{" "}
                  </p>

                  {this.state.base64_j3.map((conteudoJ3) => {
                    //if(conteudoJ3.filtro_titulo === '' || conteudoJ3.executavel === '') {
                    if (true) {
                      return (
                        <div className="row col-md-12 inputs">
                          <div className="col-md-12">
                            <p className="card-description">
                              {" "}
                              Configurações{" "}
                              <strong>
                                {conteudoJ3.filtro_titulo}
                                {conteudoJ3.executavel}
                                {conteudoJ3.url}
                              </strong>
                              :{" "}
                            </p>
                          </div>

                          <div className="col-md-6">
                            <Form.Group className="row">
                              <div className="col-sm-12">
                                <Form.Control
                                  type="text"
                                  value="Mostrar aviso aplicação"
                                  disabled
                                />
                              </div>
                            </Form.Group>
                          </div>
                          <div className="col-md-6">
                            <Form.Group className="row">
                              <div className="col-sm-12">
                                <select
                                  className="opcoes-select"
                                  name="estado"
                                  value={conteudoJ3.quando_pegar_dados_sensiveis}
                                  onChange={
                                    this.handleChangeQuando_pegar_dados_sensiveis
                                  }
                                >
                                  <option value="" disabled>Desligado</option>
                                  <option value="1" disabled>Mostra aviso</option>
                                  <option value="2" disabled>Anula ação</option>
                                  <option value="5" disabled>Apenas monitora dispositivo</option>
                                </select>
                              </div>
                            </Form.Group>
                          </div>

                          <div className="col-md-6">
                            <Form.Group className="row">
                              <div className="col-sm-12">
                                <Form.Control
                                  type="text"
                                  value="Informar o título da Janela"
                                  disabled
                                />
                              </div>
                            </Form.Group>
                          </div>
                          <div className="col-md-6">
                            <Form.Group className="row">
                              <div className="col-sm-9 pr-0">
                                <Form.Control
                                  type="text"
                                  value={conteudoJ3.filtro_titulo}
                                  disabled
                                />
                              </div>

                              <div className="col-sm-3 botao-editar-excluir-j3">
                                <button
                                  type="button"
                                  onClick={() =>
                                    this.deleteIndexL3(conteudoJ3.filtro_titulo)
                                  }
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    class="bi bi-x-circle"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                  </svg>
                                </button>
                              </div>
                            </Form.Group>
                          </div>

                          <div className="col-md-6">
                            <Form.Group className="row">
                              <div className="col-sm-12">
                                <Form.Control
                                  type="text"
                                  value="Nome da aplicação"
                                  disabled
                                />
                              </div>
                            </Form.Group>
                          </div>
                          <div className="col-md-6">
                            <Form.Group className="row">
                              <div className="col-sm-12 pr-0">
                                <Form.Control
                                  type="text"
                                  value={conteudoJ3.executavel}
                                  disabled
                                />
                              </div>
                            </Form.Group>
                          </div>

                            <div className="col-md-6">
                              <Form.Group className="row">
                                <div className="col-sm-12">
                                  <Form.Control
                                    type="text"
                                    value="URL"
                                    disabled
                                  />
                                </div>
                              </Form.Group>
                            </div>
                            <div className="col-md-6">
                              <Form.Group className="row">
                                <div className="col-sm-12 pr-0">
                                  <Form.Control
                                    type="text"
                                    value={conteudoJ3.url}
                                    disabled
                                  />
                                </div>
                              </Form.Group>
                            </div>                          

                          {/* <div className="col-md-6">
                            <Form.Group className="row">
                              <div className="col-sm-12">
                                <Form.Control
                                  type="text"
                                  value="Bloqueia Print Screen"
                                  disabled
                                />
                              </div>
                            </Form.Group>
                          </div>
                          <Switch
                            onChange={this.handleChangePrint}
                            checked={conteudoJ3.print}
                          />
                          <div className="col-md-6 d-none">
                            <Form.Group className="row">
                              <div className="col-sm-9">
                              <Form.Control type="text" value={conteudoJ3.print} />
                              </div>
                            </Form.Group>
                          </div> */}
{/*
                          <div className="col-md-6">
                            <Form.Group className="row">
                              <div className="col-sm-12">
                                <Form.Control
                                  type="text"
                                  value="Permite Colar dados sensíveis"
                                  disabled
                                />
                              </div>
                            </Form.Group>
                          </div>
                          <Switch
                            onChange={this.handleChangepermite_colar}
                            checked={conteudoJ3.permite_colar}
                          />
                          <div className="col-md-6">
                            <Form.Group className="row">
                              <div className="col-sm-9">
                              <Form.Control type="text" value={conteudoJ3.permite_colar} />
                              </div>
                            </Form.Group>
                          </div>*/}

                          <div className="col-md-6">
                            <Form.Group className="row">
                              <div className="col-sm-12">
                                <Form.Control
                                  type="text"
                                  value="Derruba a aplicação"
                                  disabled
                                />
                              </div>
                            </Form.Group>
                          </div>
                          <Switch
                            onChange={this.handleChangeDerruba_app}
                            checked={conteudoJ3.derruba_app}
                          />
                          {/*
                          <div className="col-md-6">
                            <Form.Group className="row">
                              <div className="col-sm-9">
                              <Form.Control type="text" value={conteudoJ3.derruba_app} />
                              </div>
                            </Form.Group>
                          </div>*/}
                          {/*
                          <div className="col-md-6">
                            <Form.Group className="row">
                              <div className="col-sm-12">
                                <Form.Control
                                  type="text"
                                  value="Registra a ação do usuario"
                                  disabled
                                />
                              </div>
                            </Form.Group>
                          </div>
                          <Switch
                            onChange={this.handleChangeFilma}
                            checked={conteudoJ3.filma}
                          />
                         <div className="col-md-6">
                            <Form.Group className="row">
                              <div className="col-sm-9">
                              <Form.Control type="text" value={conteudoJ3.filma} />
                              </div>
                            </Form.Group>
                          </div>*/}




                          {/*
                          <div className="col-md-6 d-none">
                            <Form.Group className="row">
                              <div className="col-sm-12">
                                <Form.Control
                                  type="text"
                                  value="Monitora CTRL"
                                  disabled
                                />
                              </div>
                            </Form.Group>
                          </div>

                          {/*<Switch onChange={this.handleChangemonitora_ctrl} checked={conteudoJ3.monitora_ctrl} />*/}

                          {/*<div className="col-md-6 d-none">
                            <Form.Group className="row">
                              <div className="col-sm-9">
                                <Form.Control
                                  type="text"
                                  value="Registra a ação de copiar"
                                  disabled
                                />
                              </div>
                            </Form.Group>
                          </div>
                          <div className="col-md-6">
                            <Form.Group className="row">
                              <div className="col-sm-9">
                              <Form.Control type="text" value={conteudoJ3.registra_copia} />
                              </div>
                            </Form.Group>
                          </div>*/}

                          {/*<Switch onChange={this.handleChangeRegistra_copia} checked={conteudoJ3.registra_copia} />
                          
                          <div className="col-md-6 d-none">
                            <Form.Group className="row">
                              <div className="col-sm-9">
                                <Form.Control
                                  type="text"
                                  value="Monitora a digitação de dados sensíveis. Exemplo: CPF"
                                  disabled
                                />
                              </div>
                            </Form.Group>
                          </div>
                          {/*<div className="col-md-6">
                            <Form.Group className="row">
                              <div className="col-sm-9">
                              <Form.Control type="text" value={conteudoJ3.monitora_dados} />
                              </div>
                            </Form.Group>
                          </div>*/}

                          {/*<Switch onChange={this.handleChangeMonitora_dados} checked={conteudoJ3.monitora_dados} />

                          <div className="col-md-6 d-none">
                            <Form.Group className="row">
                              <div className="col-sm-9">
                                <Form.Control
                                  type="text"
                                  value="Registra a janela/aplicação como Particular."
                                  disabled
                                />
                              </div>
                            </Form.Group>
                          </div>
                          {/*<div className="col-md-6">
                            <Form.Group className="row">
                              <div className="col-sm-9">
                              <Form.Control type="text" value={conteudoJ3.particular} />
                              </div>
                            </Form.Group>
                          </div>

                          {/*<Switch onChange={this.handleChangeParticular} checked={conteudoJ3.particular} />


                          <div className="col-md-6 d-none">
                            <Form.Group className="row">
                              <div className="col-sm-9">
                                <Form.Control
                                  type="text"
                                  value="Impede dados"
                                  disabled
                                />
                              </div>
                            </Form.Group>
                          </div>
                          {/*<div className="col-md-6">
                            <Form.Group className="row">
                              <div className="col-sm-9">
                              <Form.Control type="text" value={conteudoJ3.impede_dados} />
                              </div>
                            </Form.Group>
                          </div>

                          {/*<Switch onChange={this.handleChangeImpedeDados} checked={conteudoJ3.impede_dados} />

                          <div className="col-md-6 d-none">
                            <Form.Group className="row">
                              <div className="col-sm-9">
                                <Form.Control
                                  type="text"
                                  value="JSON"
                                  disabled
                                />
                              </div>
                            </Form.Group>
                          </div>
                          <div className="col-md-6 d-none">
                            <Form.Group className="row">
                              <div className="col-sm-9">
                                <Form.Control
                                  type="text"
                                  value={conteudoJ3.json}
                                />
                              </div>
                            </Form.Group>
                          </div>

                          <div className="col-md-6 d-none">
                            <Form.Group className="row">
                              <div className="col-sm-9">
                                <Form.Control
                                  type="text"
                                  value="Tipo"
                                  disabled
                                />
                              </div>
                            </Form.Group>
                          </div>
                          <div className="col-md-6 d-none">
                            <Form.Group className="row">
                              <div className="col-sm-9">
                                <Form.Control
                                  type="text"
                                  value={conteudoJ3.tipo}
                                />
                              </div>
                            </Form.Group>
                          </div>

                          {/*<div className="botoes">
                            <div className="botao" >
                              <button type="button" onClick={ () => this.findByIndexL3(conteudoJ3.filtro_titulo, conteudoJ3.executavel) } data-toggle="modal" data-target="#editaItemModal">
                                Editar
                              </button>
                            </div>

                            <div className="botao" >
                              <button type="button" onClick={ () => this.deleteIndexL3(conteudoJ3.filtro_titulo) } > X </button>
                            </div>
                          </div>*/}

                          <p>ㅤ</p>
                        </div>
                      );
                    }
                  })}

                  <div className="botoes-acoes col-md-12">
                    <div className="botao-salvar-alteracoes">
                      <button
                        type="submit"
                        onClick={() => this.enviarDadosAoServidor()}
                      >
                        {" "}
                        Salvar Alterações{" "}
                      </button>
                    </div>
                    <a
                      href="#adicionarAncoramento"
                      className="botao-salvar-alteracoes"
                      onClick={() => this.zerarVariaviesJ3()}
                    >
                      <button
                        type="button"
                        data-toggle="modal"
                        data-target="#adicionarItemModal"
                      >
                        {" "}
                        Nova Configuração{" "}
                      </button>
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* CAMPO PARA ATUALIZAR UM ITEM NO J3, POREM ELE SO E HABILITADO QUANDO CLICADO NO BOTAO EDITAR */}
          <div
            class="modal fade"
            id="editaItemModal"
            tabindex="-1"
            role="dialog"
            aria-labelledby="editaItemModalLabel"
            aria-hidden="true"
          >
            {/* ALERTAS */}
            <div
              class="alert alert-primary alert-dismissible fade show alerta"
              role="alert"
            >
              {this.state.alerta}
              <button
                type="button"
                class="close"
                onClick={() => this.ocultarAlerta()}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <p className="card-description">
                    {" "}
                    Atualizar Item - Configurações | J3{" "}
                  </p>
                  {/*<button
                    type="button"
                    class="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                </button>*/}
                </div>
                <div class="modal-body">
                  <h2>
                    <strong>{this.state.filtro_titulo}</strong>
                  </h2>
                  <form className="row mt-3" onSubmit={this.handleSubmitPutL3}>
                    <div className="col-md-6">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Informar o título da Janela"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value={this.state.filtro_titulo}
                            onChange={this.handleChangeFiltro_titulo}
                            disabled
                          />
                          <p class="informacao-campo">
                            <strong>*</strong>
                            Esse campo não pode ser editado por motivos de
                            segurança.
                          </p>
                        </div>
                      </Form.Group>
                    </div>

                    <div className="col-md-6">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Nome da aplicação"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value={this.state.executavel}
                            onChange={this.handleChangeExecutavel}
                            disabled
                          />
                          <p class="informacao-campo">
                            <strong>*</strong>
                            Esse campo não pode ser editado por motivos de
                            segurança.
                          </p>
                        </div>
                      </Form.Group>
                    </div>

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Impede o printscreen do teclado"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    {/*<div className="col-md-6">
                        <Form.Group className="row">
                          <div className="col-sm-9">
                          <Form.Control type="text" value={this.state.print} onChange={this.handleChangePrint} />
                          </div>
                        </Form.Group>
                      </div>*/}

                    {/*<Switch onChange={this.handleChangePrint} checked={this.state.print} />*/}

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Libera ou impede Copy/Paste"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    {/*<div className="col-md-6">
                        <Form.Group className="row">
                          <div className="col-sm-9">
                          <Form.Control type="text" value={this.state.permite_colar} onChange={this.handleChangepermite_colar} />
                          </div>
                        </Form.Group>
                      </div>*/}

                    {/*<Switch onChange={this.handleChangepermite_colar} checked={this.state.permite_colar} />*/}

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Registra a ação de copiar"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    {/*<div className="col-md-6">
                        <Form.Group className="row">
                          <div className="col-sm-9">
                          <Form.Control type="text" value={this.state.registra_copia} onChange={this.handleChangeRegistra_copia} />
                          </div>
                        </Form.Group>
                      </div>*/}

                    {/*<Switch onChange={this.handleChangeRegistra_copia} checked={this.state.registra_copia} />*/}

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Monitora a digitação de dados sensíveis. Exemplo: CPF"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    {/*<div className="col-md-6">
                        <Form.Group className="row">
                          <div className="col-sm-9">
                          <Form.Control type="text" value={this.state.monitora_dados} onChange={this.handleChangeMonitora_dados} />
                          </div>
                        </Form.Group>
                      </div>*/}

                    {/*<Switch onChange={this.handleChangeMonitora_dados} checked={this.state.monitora_dados} />*/}

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Registra a janela/aplicação como Particular"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    {/*<div className="col-md-6">
                        <Form.Group className="row">
                          <div className="col-sm-9">
                          <Form.Control type="text" value={this.state.particular} onChange={this.handleChangeParticular} />
                          </div>
                        </Form.Group>
                      </div>*/}

                    {/*<Switch onChange={this.handleChangeParticular} checked={this.state.particular} />*/}

                    {/*<div className="col-md-6">
                        <Form.Group className="row">
                          <div className="col-sm-9">
                          <Form.Control type="text" value="Impede a aplicação de funcionar" disabled />
                          </div>
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group className="row">
                          <div className="col-sm-9">
                          <Form.Control type="text" value={this.state.derruba_app} onChange={this.handleChangeDerruba_app} />
                          </div>
                        </Form.Group>
                      </div>

                      <Switch onChange={this.handleChangeDerruba_app} checked={this.state.derruba_app} />
*/}{/*
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Registra a ação do usuario"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                        <Form.Group className="row">
                          <div className="col-sm-9">
                          <Form.Control type="text" value={this.state.filma} onChange={this.handleChangeFilma} />
                          </div>
                        </Form.Group>
                      </div>*/}

                    {/*<Switch onChange={this.handleChangeFilma} checked={this.state.filma} />*/}

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Impede dados"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    {/*<div className="col-md-6">
                        <Form.Group className="row">
                          <div className="col-sm-9">
                          <Form.Control type="text" value={conteudoJ3.impede_dados} />
                          </div>
                        </Form.Group>
                      </div>*/}

                    {/*<Switch onChange={this.handleChangeImpedeDados} checked={this.state.impede_dados} />*/}

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control type="text" value="JSON" disabled />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value={this.state.json}
                            onChange={this.handleChangeJson}
                          />
                        </div>
                      </Form.Group>
                    </div>

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control type="text" value="Tipo" disabled />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value={this.state.tipo}
                            onChange={this.handleChangeTipo}
                          />
                        </div>
                      </Form.Group>
                    </div>

                    <div class="modal-footer col-md-12 botao-enviar">
                      <button type="button" data-dismiss="modal">
                        Fechar
                      </button>
                      <button type="submit" data-dismiss="modal">
                        Salvar
                      </button>
                    </div>

                    {/*<div className="col-md-12 botao-enviar" >
                        <button type="submit" > Atualizar </button>
                      </div>*/}
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* ADICIONAR UM NOVO ITEM AO J3 */}
          <div
            class="modal fade"
            id="adicionarItemModal"
            tabindex="-1"
            role="dialog"
            aria-labelledby="adicionarItemModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <p className="card-description">
                    {" "}
                    Adicionar Item - Configurações | J3{" "}
                  </p>
                  {/*<button
                    type="button"
                    class="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                    </button>*/}
                </div>
                <div class="modal-body">
                  <form className="row mt-3">

                    <div className="col-md-6">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value= "Mostrar aviso aplicação"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <select
                            className="opcoes-select"
                            name="estado"
                            value={this.state.quando_pegar_dados_sensiveis}
                            onChange={
                              this.handleChangeQuando_pegar_dados_sensiveis
                            }
                          >
                            <option value="">Desligar</option>
                            <option value="1">Mostra aviso</option>
                            <option value="2">Anula ação</option>
                            <option value="5">Apenas monitora dispositivo</option>
                          </select>
                        </div>
                      </Form.Group>
                    </div>  

                    <div className="col-md-6">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Informar o título da Janela"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value={this.state.filtro_titulo}
                            onChange={this.handleChangeFiltro_titulo}
                          />
                        </div>
                      </Form.Group>
                    </div>

                    <div className="col-md-6">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Nome da aplicação"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value={this.state.executavel}
                            onChange={this.handleChangeExecutavel}
                          />
                        </div>
                      </Form.Group>
                    </div>

                    <div className="col-md-6">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="URL"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value={this.state.url}
                            onChange={this.handleChangeUrl}
                          />
                        </div>
                      </Form.Group>
                    </div>                    

                    {/* <div className="col-md-6">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Bloqueia Print Screen"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <Switch
                      onChange={this.handleChangePrint}
                      checked={this.state.print}
                    /> */}
                    {/*
                      <div className="col-md-6">
                        <Form.Group className="row">
                          <div className="col-sm-9">
                          <Form.Control type="text" value={this.state.print} onChange={this.handleChangePrint} />
                          </div>
                        </Form.Group>
                      </div>
                    */}

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Monitora CTRL"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>

                    {/*<Switch
                      onChange={this.handleChangemonitora_ctrl}
                      checked={this.state.monitora_ctrl}
                    />*/}
{/*
                    <div className="col-md-6">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Permite Colar dados sensíveis"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                        <Form.Group className="row">
                          <div className="col-sm-9">
                          <Form.Control type="text" value={this.state.permite_colar} onChange={this.handleChangepermite_colar} />
                          </div>
                        </Form.Group>
                      </div>

                    <Switch
                      onChange={this.handleChangepermite_colar}
                      checked={this.state.permite_colar}
                    />*/}

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Registra a ação de copiar"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    {/*<div className="col-md-6">
                        <Form.Group className="row">
                          <div className="col-sm-9">
                          <Form.Control type="text" value={this.state.registra_copia} onChange={this.handleChangeRegistra_copia} />
                          </div>
                        </Form.Group>
                      </div>*/}

                    {/*<Switch onChange={this.handleChangeRegistra_copia} checked={this.state.registra_copia} />*/}

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Monitora a digitação de dados sensíveis. Exemplo: CPF"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    {/*<div className="col-md-6">
                        <Form.Group className="row">
                          <div className="col-sm-9">
                          <Form.Control type="text" value={this.state.monitora_dados} onChange={this.handleChangeMonitora_dados} />
                          </div>
                        </Form.Group>
                      </div>*/}

                    {/*<Switch onChange={this.handleChangeMonitora_dados} checked={this.state.monitora_dados} />*/}

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Registra a janela/aplicação como Particular"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    {/*<div className="col-md-6">
                        <Form.Group className="row">
                          <div className="col-sm-9">
                          <Form.Control type="text" value={this.state.particular} onChange={this.handleChangeParticular} />
                          </div>
                        </Form.Group>
                      </div>*/}

                    {/*<Switch onChange={this.handleChangeParticular} checked={this.state.particular} />*/}

                    <div className="col-md-6">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Derruba a aplicação"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    {/*
                      <div className="col-md-6">
                        <Form.Group className="row">
                          <div className="col-sm-9">
                          <Form.Control type="text" value={this.state.derruba_app} onChange={this.handleChangeDerruba_app} />
                          </div>
                        </Form.Group>
                      </div>
                      */}

                    <Switch
                      onChange={this.handleChangeDerruba_app}
                      checked={this.state.derruba_app}
                    />
 {/*
                    <div className="col-md-6 ">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Registra a ação do usuario"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                   <div className="col-md-6">
                        <Form.Group className="row">
                          <div className="col-sm-9">
                          <Form.Control type="text" value={this.state.filma} onChange={this.handleChangeFilma} />
                          </div>
                        </Form.Group>
                      </div>

                    <Switch
                      onChange={this.handleChangeFilma}
                      checked={this.state.filma}
                    />*/}

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control type="text" value="JSON" disabled />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value={this.state.json}
                            onChange={this.handleChangeJson}
                          />
                        </div>
                      </Form.Group>
                    </div>

                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control type="text" value="Tipo" disabled />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-none">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value={this.state.tipo}
                            onChange={this.handleChangeTipo}
                          />
                        </div>
                      </Form.Group>
                    </div>

                    <div class="modal-footer col-md-12 botao-enviar">
                      <button type="button" data-dismiss="modal">
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        data-dismiss="modal"
                        onClick={this.handleSubmitPostL3}
                      >
                        Salvar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default GrupoDlp;
