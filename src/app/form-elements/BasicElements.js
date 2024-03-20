import React, { Component } from "react";
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import bsCustomFileInput from "bs-custom-file-input";
import DlpController from "./controller/DlpController";
import "./css/style.css";
import Switch from "react-switch";
import http from "./http/http.js";
import Botao from "../Fcomponents/Botao";
import Input from "../Fcomponents/Input";
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Cache-Control", "no-cache");
myHeaders.append("Expires", "-1");
myHeaders.append("Pragma", "no-cache");
myHeaders.append("Origin", "*");

export class BasicElements extends Component {

  constructor() {
    super();

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
      grupoDlp: "",
      computer_name: "",
      maquina: "",

      /* ARRAY DE GRUPOS CARREGADOS */
      gruposDlps: [],
      token: "",
      url: "",
      alerta: "",

      /* BASE x64 - J1 */
      titulosADesprezar: "",
      classesDebugar: "",
      jansFilhasMonitorar: "",
      ipCloud: "",
      portaCloud: "",
      portaDlp: "",
      conectivosExcluir: "",
      driveServer: "",
      cliAtual: "",
      grupoDlp: "",
      percentualCompacArquivos: "",
      origensAlarme: "",
      statusAlarme: "",
      tiposAlarme: "",
      extensoesSensiveis: "",
      palavrasSensiveis: "",
      codCliente: "",
      codigoMaquinaPorUsuario: "",
      codVBios: "",
      mapperAtivado: "",

      /* BASE x64 - J2 */
      anonimizaDadosRelatorios: "",
      ativaEmailAlmGraves: "",
      ativaEmailAlmGravissimos: "",
      ativaEmailAlmSerios: "",
      ativaSmsAlmGraves: "",
      ativaSmsAlmGravissimos: "",
      ativaSmsAlmSerios: "",
      desativaPrintScreen: "",
      impedirDragDrop: "",
      pastasDiscovery: "",
      pastasDiscoveryNaoConsiderar: "",
      caminhosProibidos: "",
      exibirDisplayDiscovery: "",
      filmar_sempre: "",
      monitoraDispExternos: "",
      quandoPegarDadosSensiveis: "",
      quando_pegar_dados_sensiveis: "",
      driversPermitidos: "",
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
      notaCorteGraves: "",
      notaCorteGravissimos: "",
      pastasSensiveis: "",
      tempoDragAndDrop: "",
      impressaoSpooler: "",
      arquivosZip: "7z,ACE,ARJ,BZ2,CAB,ISO,JAR,LZH,RAR,TAR,TAR.BZ2,TAR.GZ,TGZ,UUE,7-Zip,B1 Free Archiver,PKZIP,WinRAR,WinZip,zip",
      ehS3: "1",
      classificacaoAlarmeDragDrop: "INFO",
      naoTestarCopiaArquivo: "",
      naoTestarDragDrop: "",

      /* BASE x64 - J3 */
      /* SEPARADOS POR INDEX */
      base64_j3: [],
      permite_colar: false,
      impede_colar: false,
      impede_copiar: false,
      derruba_app: false,

      
      filma: false,
      json: "",
      print: false,
      monitora_ctrl: false,
      tipo: "2",
      filtro_titulo: "",
      executavel: "",
    };

    window.document.querySelector("#pesquisa-invalida");

    /* CARREGA A LISTA DE GRUPOS POR MEIO DO TOKEN DO USUARIO */
    this.findAllGrupoDlpDefault();
    this.verificarPrivilegio();

    /* METODOS PARA O SWITCH */
    this.handleChangePrint = this.handleChangePrint.bind(this);
    this.handleChangeQuandoPegarDadosSensiveis = this.handleChangeQuandoPegarDadosSensiveis.bind(this);
    this.handleChangeMonitoraCtrl = this.handleChangeMonitoraCtrl.bind(this);
    this.handleChangeDerruba_app = this.handleChangeDerruba_app.bind(this);
    this.handleChangeFilma = this.handleChangeFilma.bind(this);
    this.handleChangeImpede_copiar = this.handleChangeImpede_copiar.bind(this);
    this.handleChangeImpede_colar = this.handleChangeImpede_colar.bind(this);
    this.handleChangePermite_colar = this.handleChangePermite_colar.bind(this);
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

  handleChangeGrupoDlp = (event) => {
    this.setState({ grupoDlp: event.target.value });
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
  };

  handleChangePortaCloud = (event) => {
    this.setState({ portaCloud: event.target.value });
  };

  handleChangePortaDlp = (event) => {
    this.setState({ portaDlp: event.target.value });
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

  handleChangePalavrasSensiveis = (event) => {
    this.setState({ palavrasSensiveis: event.target.value });

    this.converteStringParaBoolean();
    this.ajustaBarras();
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

  handleChangeDragAndDrop = (event) => {
    this.setState({ impedirDragDrop: event.target.value });

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

  handleChangesemDragDrop = (event) => {
    this.setState({ semDragDrop: event.target.value });
  };

  handleChangeTipoDpo = (event) => {
    this.setState({ tipoDpo: event.target.value });
  };

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

  handleChangetamMaximoArquivoAnalise = (event) => {
    this.setState({ tamMaximoArquivoAnalise: event.target.value });
  };

  handleChangeExibirDisplayDiscovery = (event) => {
    this.setState({ exibirDisplayDiscovery: event.target.value });
  };

  handleChangePastasDiscovery = (event) => {
    this.setState({ pastasDiscovery: event.target.value });
  };

  handleChangePastasDiscoveryNaoConsiderar = (event) => {
    this.setState({ pastasDiscoveryNaoConsiderar: event.target.value });
  };

  handleChangeCaminhosProibidos = (event) => {
    this.setState({ caminhosProibidos: event.target.value });
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
  };

  handleChangeehS3 = (event) => {
    this.setState({ ehS3: event.target.value });
  };

  /* ========================== */
  /* OBSERVADORES BASE x64 - J3 */
  /* ========================== */

  handleChangeDerruba_app(derruba_app) {
    this.setState({ derruba_app });
  }

  handleChangeFilma(filma) {
    this.setState({ filma });
  }
  
  handleChangeImpede_copiar (impede_copiar) {
    this.setState({ impede_copiar });
  }

  handleChangeImpede_colar (impede_colar) {
    this.setState({ impede_colar });
  }

  handleChangePermite_colar (permite_colar) {
    this.setState({ permite_colar });
  }

  handleChangeJson = (event) => {
    this.setState({ json: event.target.value });
  };

  handleChangePrint(print) {
    this.setState({ print });
  }

  handleChangeMonitoraCtrl(monitora_ctrl) {
    this.setState({ monitora_ctrl });
  }

  handleChangeTipo = (event) => {
    this.setState({ tipo: "0" });
  }

  handleChangeFiltro_titulo = (event) => {
    this.setState({ filtro_titulo: event.target.value });
  };

  handleChangeExecutavel = (event) => {
    this.setState({ executavel: event.target.value });
  };

  handleChangeUrl = (event) => {
    this.setState({ url: event.target.value });
  };


  /* ==================================== */
  /* === FIM DOS OBSERVADORES DO JSON === */
  /* ==================================== */

  /* PESQUISA POR NOME DE COMPUTADOR */
  handleSubmitGetByNomeComputador = (event) => {
    event.preventDefault();

    const pesquisa = {
      filtro: this.state.nome,
      pg: "1",
      qtPorPg: "100",
    };

    this.zerarVariaveis();
    this.zerarVariaviesJ3();

    /* PESQUISA POR UM NOME ESPECIFICA DE UMA PESSOA */
    this.findByNomeComputador(pesquisa);

    let memoria = pesquisa.filtro;
    this.state.nome = memoria;
    console.log("VALOR DA MEMORIA: ");
    console.log(memoria);
    console.log("PESQUISA MEMORIA: ");
    console.log(this.state.nome);
  };

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
      quando_pegar_dados_sensiveis: this.state.quando_pegar_dados_sensiveis,
      permite_colar: this.state.permite_colar,
      impede_colar: this.state.impede_colar,
      impede_copiar: this.state.impede_copiar,
      filma: this.state.filma,
      print: this.state.print,
      derruba_app: this.state.derruba_app,
    };

    /* ENVIA O OBJETO PARA SER INSERIDO NO ARRAY NOVAMENTE */

    if (
      this.state.filtro_titulo.length > 0 ||
      this.state.executavel.length > 0 ||
      this.state.url.length > 0
    ) {
      this.postIndexL3(novoItem);
    } else {
      alert(
        "Favor preencher algum dos campos: Informar o título da Janela, Nome da aplicação ou a URL"
      );
    }
  };

  /* ATUALIZA O USUARIO  */
  handleSubmitPutComputador = (event) => {
    event.preventDefault();

    /* ==================================== */
    /* ===  ACRESCENTA O JSON 1 DEFAULT === */
    /* ==================================== */
    const json1Fixo = {
      json: "1",
      tipo: "3",
      filtro_titulo: "",
      executavel: "",
      url: "",
      quando_pegar_dados_sensiveis: "",
      permite_colar: false,
      impede_colar: false,
      impede_copiar: false,
      filma: false,
      print: false,
      derruba_app: false,
    };

    var verificador = 0;

    for (let i = 0; i < this.state.base64_j3.length; i++) {
      if (String(this.state.base64_j3[i].json) === "1") {
        verificador++;
      }
    }

/*     if (verificador == 0) {
      this.state.base64_j3.push(json1Fixo);
    } */

    if (verificador == 0) {
      this.state.base64_j3 = json1Fixo;
    }

    const computador = {
      grupo_dlp: this.state.grupoDlp,
      computer_name: "^" + this.state.maquina,
      maquina: this.state.maquina + ",",
      base64_j1: {
        json: "vars",
        grupoDlp: this.state.grupoDlp,
        desativaPrintScreen: this.state.desativaPrintScreen,
        impedirDragDrop: this.state.impedirDragDrop,
        quandoPegarDadosSensiveis: this.state.quandoPegarDadosSensiveis,
        caminhosProibidos: this.state.caminhosProibidos,
        exibirDisplayDiscovery: this.state.exibirDisplayDiscovery,
        pastasDiscovery: this.state.pastasDiscovery,
        pastasDiscoveryNaoConsiderar: this.state.pastasDiscoveryNaoConsiderar,
        //ativaOCR: "0", //Deixar oculto por enquanto
        //permiteImpressao: "0", //Deixar oculto para usar no futuro
        //impedeImpressao: "0" //Deixar oculto para usar no futuro

      },
      base64_j2: {
        driversPermitidos: this.state.driversPermitidos,
      },
      base64_j3: this.state.base64_j3,
    };

    this.putComputador(computador);

  };

  /* CAPTURA DADOS PARA ATUALIZAR UM ITEM NO JSON PEGANDO COMO PARAMENTRO O INDEX E O OBJETO EM SI */
  handleSubmitPutL3 = (event) => {
    event.preventDefault();

    /* CRIA O OBJETO COM OS NOVOS DADOS */
    const itemExistente = {
      json: this.state.json,
      tipo: "0",
      filtro_titulo: this.state.filtro_titulo,
      executavel: this.state.executavel,
      url: this.state.url,
      quando_pegar_dados_sensiveis: this.state.quando_pegar_dados_sensiveis,
      permite_colar: this.state.permite_colar,
      impede_colar: this.state.impede_colar,
      impede_copiar: this.state.impede_copiar,
      filma: this.state.filma,
      print: this.state.print,
      derruba_app: this.state.derruba_app,
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

  findAllGrupoDlpDefault = async () => {
    DlpController.getAllGrupoDlpByToken().then((response) => {
      let gruposSalvos = [];

      for (let i = 0; i < response.data.length; i++) {
        gruposSalvos.push(response.data[i].grupo);
      }

      this.setState({
        gruposDlps: gruposSalvos,
      });

      console.log("GRUPOS BUSCADOS: ");
      console.log(this.state.gruposDlps);
    });
  };

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

  /* PESQUISA POR UM USUARIO ESPECIFICO E POPULA AS VARIAVEIS DE AMBIENTE PARA QUE POSSAM SER ALTERADAS */
  findByIndexL3 = async (index, executavel) => {

    /* ======================================= */
    /* === CONVERTENDO STRING PARA BOOLEAN === */
    /* ======================================= */

    for (let i = 0; i < this.state.base64_j3.length; i++) {
      if (
        String(this.state.base64_j3[i].derruba_app).toLowerCase() === "true"
      ) {
        this.state.base64_j3[i].derruba_app = true;
      } else if (
        String(this.state.base64_j3[i].derruba_app).toLowerCase() === "false"
      ) {
        this.state.base64_j3[i].derruba_app = false;
      }

      if (String(this.state.base64_j3[i].filma).toLowerCase() === "true") {
        this.state.base64_j3[i].filma = true;
      } else if (
        String(this.state.base64_j3[i].filma).toLowerCase() === "false"
      ) {
        this.state.base64_j3[i].filma = false;
      }

      if (
        String(this.state.base64_j3[i].permite_colar).toLowerCase() === "true"
      ) {
        this.state.base64_j3[i].permite_colar = true;
      } else if (
        String(this.state.base64_j3[i].permite_colar).toLowerCase() === "false"
      ) {
        this.state.base64_j3[i].permite_colar = false;
      }
      

      if (
        String(this.state.base64_j3[i].impede_colar).toLowerCase() === "true"
      ) {
        this.state.base64_j3[i].impede_colar = true;
      } else if (
        String(this.state.base64_j3[i].impede_colar).toLowerCase() === "false"
      ) {
        this.state.base64_j3[i].impede_colar = false;
      }
      

      if (
        String(this.state.base64_j3[i].impede_copiar).toLowerCase() === "true"
      ) {
        this.state.base64_j3[i].impede_copiar = true;
      } else if (
        String(this.state.base64_j3[i].impede_copiar).toLowerCase() === "false"
      ) {
        this.state.base64_j3[i].impede_copiar = false;
      }

      if (
        String(this.state.base64_j3[i].monitora_ctrl).toLowerCase() === "true"
      ) {
        this.state.base64_j3[i].monitora_ctrl = true;
      } else if (
        String(this.state.base64_j3[i].monitora_ctrl).toLowerCase() === "false"
      ) {
        this.state.base64_j3[i].monitora_ctrl = false;
      }

      if (String(this.state.base64_j3[i].print).toLowerCase() === "true") {
        this.state.base64_j3[i].print = true;
      } else if (
        String(this.state.base64_j3[i].print).toLowerCase() === "false"
      ) {
        this.state.base64_j3[i].print = false;
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
        this.setState({ impede_colar: this.state.base64_j3[i].impede_colar });
        this.setState({ impede_copiar: this.state.base64_j3[i].impede_copiar });
        this.setState({ json: this.state.base64_j3[i].json });
        this.setState({ monitora_ctrl: this.state.base64_j3[i].monitora_ctrl });
        this.setState({ print: this.state.base64_j3[i].print });
        this.setState({ tipo: this.state.base64_j3[i].tipo });
        this.setState({ filtro_titulo: this.state.base64_j3[i].filtro_titulo });
        this.setState({ executavel: this.state.base64_j3[i].executavel });
        this.setState({ url: this.state.base64_j3[i].url });
        this.setState({ quando_pegar_dados_sensiveis: this.state.base64_j3[i].quando_pegar_dados_sensiveis });
      } else if (
        this.state.base64_j3[i].executavel == executavel &&
        String(executavel).toLowerCase() != ""
      ) {
        /* DESSA FORMA ESTA SENDO POSSIVEL ATUALIZAR OS DADOS DENTRO DO MODAL PARA EDICAO DE UM DETERMINADO ITEM/OBJETO DO J3 */

        this.setState({ derruba_app: this.state.base64_j3[i].derruba_app });
        this.setState({ filma: this.state.base64_j3[i].filma });
        this.setState({ permite_colar: this.state.base64_j3[i].permite_colar });
        this.setState({ impede_colar: this.state.base64_j3[i].impede_colar });
        this.setState({ impede_copiar: this.state.base64_j3[i].impede_copiar });
        this.setState({ json: this.state.base64_j3[i].json });
        this.setState({ monitora_ctrl: this.state.base64_j3[i].monitora_ctrl });
        this.setState({ print: this.state.base64_j3[i].print });
        this.setState({ tipo: this.state.base64_j3[i].tipo });
        this.setState({ filtro_titulo: this.state.base64_j3[i].filtro_titulo });
        this.setState({ executavel: this.state.base64_j3[i].executavel });
        this.setState({ url: this.state.base64_j3[i].url });
        this.setState({ quando_pegar_dados_sensiveis: this.state.base64_j3[i].quando_pegar_dados_sensiveis });
      }
    }

  };

  /* METODO RESPONSAVEL POR REALIZAR A BUSCA POR UM ITEM ESPECIFICO NA BASE DE DADOS ex.: /?nome=${nome} */
  findByNomeComputador = async (pesquisa) => {
    this.zerarVariaveis();
    this.zerarVariaviesJ3();

    if (String(pesquisa.filtro).toLowerCase() != "") {
      /* RETIRA O FEEDBACK DA TELA */
      window.document
        .querySelector("#pesquisa-invalida")
        .setAttribute("style", "display: none;");

      console.log("Pesquisa");
      console.log(pesquisa);

      console.log("Minha pesquisa via GET");
      DlpController.getJson(pesquisa).then((response) => {
        this.setState({
          arrayDlp: response.data,
        });

        console.log("MEU JSON RETORNADO: ");
        console.log(response.data);

        /*
          UTILIZAR O MESMO FILTRO DO EM MASSA
          */

        this.converterJSON(this.state.arrayDlp);

        // INFORMACOES DA MAQUINA
        this.setState({ grupo_dlp: this.state.arrayDlp[0].grupo_dlp });
        this.setState({ grupoDlp: this.state.arrayDlp[0].grupoDlp });
        this.setState({ computer_name: this.state.arrayDlp[0].computer_name });
        this.setState({ maquina: this.state.arrayDlp[0].maquina });

        // DADOS BASE x64 - J1
        this.setState({ titulosADesprezar: this.state.arrayDlp[0].base64_j1.titulosADesprezar });
        this.setState({ classesDebugar: this.state.arrayDlp[0].base64_j1.classesDebugar });
        this.setState({ jansFilhasMonitorar: this.state.arrayDlp[0].base64_j1.jansFilhasMonitorar });
        this.setState({ ipCloud: this.state.arrayDlp[0].base64_j1.ipCloud });
        this.setState({ portaCloud: this.state.arrayDlp[0].base64_j1.portaCloud });
        this.setState({ portaDlp: this.state.arrayDlp[0].base64_j1.portaDlp });
        this.setState({ conectivosExcluir: this.state.arrayDlp[0].base64_j1.conectivosExcluir });
        this.setState({ driveServer: this.state.arrayDlp[0].base64_j1.driveServer });
        this.setState({ cliAtual: this.state.arrayDlp[0].base64_j1.cliAtual });
        this.setState({ grupoDlp: this.state.arrayDlp[0].base64_j1.grupoDlp });
        this.setState({ percentualCompacArquivos: this.state.arrayDlp[0].base64_j1.percentualCompacArquivos });
        this.setState({ origensAlarme: this.state.arrayDlp[0].base64_j1.origensAlarme });
        this.setState({ statusAlarme: this.state.arrayDlp[0].base64_j1.statusAlarme });
        this.setState({ tiposAlarme: this.state.arrayDlp[0].base64_j1.tiposAlarme });
        this.setState({ extensoesSensiveis: "txt,xlsx,docx,ppt,pptx,xls,doc,pdf,html,xml" });
        this.setState({ palavrasSensiveis: this.state.arrayDlp[0].base64_j1.palavrasSensiveis });
        this.setState({ codCliente: this.state.arrayDlp[0].base64_j1.codCliente });
        this.setState({ codigoMaquinaPorUsuario: this.state.arrayDlp[0].base64_j1.codigoMaquinaPorUsuario });
        this.setState({ codVBios: this.state.arrayDlp[0].base64_j1.codVBios });
        this.setState({ mapperAtivado: this.state.arrayDlp[0].base64_j1.mapperAtivado });

        //J2 FIXO, CASO DESEJE PEGAR AS CONFIGURACOES VINDO DO J2 DA MAQUINAS, APENSAS COMENTE ESSA LINHAS ABAIXO E DESCOMENTE AS LINHAS ACIMA
        this.setState({ anonimizaDadosRelatorios: this.state.arrayDlp[0].base64_j1.anonimizaDadosRelatorios });
        this.setState({ ativaEmailAlmGraves: "1" });
        this.setState({ ativaEmailAlmGravissimos: "1" });
        this.setState({ ativaEmailAlmSerios: "1" });
        this.setState({ ativaSmsAlmGraves: "1" });
        this.setState({ ativaSmsAlmGravissimos: "1" });
        this.setState({ ativaSmsAlmSerios: "1" });
        this.setState({ desativaPrintScreen: this.state.arrayDlp[0].base64_j1.desativaPrintScreen });
        this.setState({ impedirDragDrop: this.state.arrayDlp[0].base64_j1.impedirDragDrop });
        this.setState({ filmar_sempre: this.state.arrayDlp[0].base64_j1.filmar_sempre });
        this.setState({ monitoraDispExternos: "1" });
        this.setState({ quandoPegarDadosSensiveis: this.state.arrayDlp[0].base64_j1.quandoPegarDadosSensiveis });
        this.setState({ driversPermitidos: this.state.arrayDlp[0].base64_j1.driversPermitidos });
        this.setState({ semDragDrop: this.state.arrayDlp[0].base64_j1.semDragDrop });
        this.setState({ imgBlockPrtSc: "/j/users/dlp/TELA_BLOQUEIO_PRINT.png" });
        this.setState({ qtMinQualifsTab: "3" });
        this.setState({ qtMinQualifsDoc: "5" });
        this.setState({ maxQtFalsosNomes: "3" });
        this.setState({ qtPalsManterQualificador: "1" });
        this.setState({ QtMaxLinhasResult: "60" });
        this.setState({ tMinQualifsTab: "3" });
        this.setState({ comFonetizacao: "1" });
        this.setState({ tamMaximoArquivoAnalise: "10000000" });
        this.setState({ notaCorteSerios: "20" });
        this.setState({ notaCorteGraves: "100" });
        this.setState({ notaCorteGravissimos: "500" });
        this.setState({ exibirDisplayDiscovery: this.state.arrayDlp[0].base64_j1.exibirDisplayDiscovery });
        this.setState({ pastasDiscovery: this.state.arrayDlp[0].base64_j1.pastasDiscovery });
        this.setState({ caminhosProibidos: this.state.arrayDlp[0].base64_j1.caminhosProibidos });
        this.setState({ pastasDiscoveryNaoConsiderar: this.state.arrayDlp[0].base64_j1.pastasDiscoveryNaoConsiderar });
        this.setState({ tempoDragAndDrop: this.state.arrayDlp[0].base64_j1.tempoDragAndDrop });
        this.setState({ impressaoSpooler: this.state.arrayDlp[0].base64_j1.impressaoSpooler });
        this.setState({ naoTestarDragDrop: this.state.arrayDlp[0].base64_j1.naoTestarDragDrop });
        this.setState({ naoTestarCopiaArquivo: this.state.arrayDlp[0].base64_j1.naoTestarCopiaArquivo });
        this.setState({ classificacaoAlarmeDragDrop: this.state.arrayDlp[0].base64_j1.classificacaoAlarmeDragDrop });
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
            console.log(this.state.arrayDlp[0].base64_j1.pastasSensiveis);

            memoriaPastasSensiveis =
              this.state.arrayDlp[0].base64_j1.pastasSensiveis
                .split("//")
                .join("\\");
            memoriaPastasSensiveis =
              this.state.arrayDlp[0].base64_j1.pastasSensiveis.replace(
                /\\\\/g,
                "\\"
              );

            this.setState({ pastasSensiveis: memoriaPastasSensiveis });

            console.log("Pastas Sensiveis: ");
            console.log(this.state.pastasSensiveis);
          } catch (erro) {
            console.log(
              "ATENCAO | Ocorreu algum erro no carregamento de seu JSON, verifique com o suporte da ferramenta."
            );
          }
        }
      });
    } else {
      /* ZERA AS VARIAVEIS */
      this.zerarVariaveis();

      /* HABILITA O FEEDBACK DA TELA */
      window.document
        .querySelector("#pesquisa-invalida")
        .setAttribute("style", "display: block;");
    }
  };

  /* =================== */
  /* === METODO POST === */
  /* =================== */

  /* ADICIONA UM NOVO ITEM NO L3 */
  postIndexL3 = async (novoItem) => {

    if (String(novoItem.derruba_app).toLowerCase() === "true") {
      novoItem.derruba_app = true;
    } else if (String(novoItem.derruba_app).toLowerCase() === "false") {
      novoItem.derruba_app = false;
    } else {
      novoItem.derruba_app = this.state.derruba_app;
    }

    if (String(novoItem.filma).toLowerCase() === "true") {
      novoItem.filma = true;
    } else if (String(novoItem.filma).toLowerCase() === "false") {
      novoItem.filma = false;
    } else {
      novoItem.filma = this.state.filma;
    }

    if (String(novoItem.permite_colar).toLowerCase() === "true") {
      novoItem.permite_colar = true;
    } else if (String(novoItem.permite_colar).toLowerCase() === "false") {
      novoItem.permite_colar = false;
    } else {
      novoItem.permite_colar = this.state.permite_colar;
    }
    
    if (String(novoItem.impede_colar).toLowerCase() === "true") {
      novoItem.impede_colar = true;
    } else if (String(novoItem.impede_colar).toLowerCase() === "false") {
      novoItem.impede_colar = false;
    } else {
      novoItem.impede_colar = this.state.impede_colar;
    }
    
    if (String(novoItem.impede_copiar).toLowerCase() === "true") {
      novoItem.impede_copiar = true;
    } else if (String(novoItem.impede_copiar).toLowerCase() === "false") {
      novoItem.impede_copiar = false;
    } else {
      novoItem.impede_copiar = this.state.impede_copiar;
    }

    if (String(novoItem.print).toLowerCase() === "true") {
      novoItem.print = true;
    } else if (String(novoItem.print).toLowerCase() === "false") {
      novoItem.print = false;
    } else {
      novoItem.print = this.state.print;
    }

    /* ==================================== */
    /* ATRIBUI UM VALOR FIXO AO JSON E TIPO */
    /* ==================================== */
    if (novoItem.json != "1") {
      novoItem.json = 2;
      novoItem.tipo = "0";
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
      } else {
        alert(
          "Foi identificado um erro no JSON, corrija-o imediatamente antes de enviar ao JSON"
        );
      }
    } else {
      console.log("O botao para enviar os dados ainda nao foi pressionado!");
    }
  };

  validaJSON = async (json, trava) => {
    if (
      typeof String(json.grupo_dlp).toLowerCase() === "string" &&
      typeof String(json.computer_name).toLowerCase() === "string" &&
      typeof String(json.maquina).toLowerCase() === "string"
    ) {
      alert("Todos os campos de maquinas foram verificas e estao com as tipagens OK!");
    } else {
      trava = true;
      alert("Existe uma divergencia no JSON (Campos de maquinas) , corrija o erro, antes de enviar ao banco de dados!");
    }

    if (
      typeof String(json.base64_j1[0].json).toLowerCase() === "string" &&
      typeof String(json.base64_j1[0].classesDebugar).toLowerCase() === "string" &&
      typeof String(json.base64_j1[0].cliAtual).toLowerCase() === "string" &&
      typeof String(json.base64_j1[0].conectivosExcluir).toLowerCase() === "string" &&
      typeof String(json.base64_j1[0].driveServer).toLowerCase() === "string" &&
      typeof String(json.base64_j1[0].grupoDlp).toLowerCase() === "string" &&
      typeof String(json.base64_j1[0].ipCloud).toLowerCase() === "string" &&
      typeof String(json.base64_j1[0].jansFilhasMonitorar).toLowerCase() === "string" &&
      typeof String(json.base64_j1[0].origensAlarme).toLowerCase() === "string" &&
      typeof String(json.base64_j1[0].percentualCompacArquivos).toLowerCase() === "string" &&
      typeof String(json.base64_j1[0].portaCloud).toLowerCase() === "string" &&
      typeof String(json.base64_j1[0].portaDlp).toLowerCase() === "string" &&
      typeof String(json.base64_j1[0].statusAlarme).toLowerCase() === "string" &&
      typeof String(json.base64_j1[0].tiposAlarme).toLowerCase() === "string" &&
      typeof String(json.base64_j1[0].titulosADesprezar).toLowerCase() === "string" &&
      typeof String(json.base64_j1[0].extensoesSensiveis).toLowerCase() === "string" &&
      typeof String(json.base64_j1[0].codCliente).toLowerCase() === "string" &&
      typeof String(json.base64_j1[0].codigoMaquinaPorUsuario).toLowerCase() === "string"
    ) {
      alert("Todos os campos do J1 foram verificados e estao com as tipagens OK!");
    } else {
      trava = true;
      alert("Existe uma divergencia no JSON (J1), corrija o erro, antes de enviar ao banco de dados!");
    }

    if (
      typeof String( json.base64_j1[0].anonimizaDadosRelatorios ).toLowerCase() === "string" &&
      typeof String( json.base64_j1[0].ativaEmailAlmGraves ).toLowerCase() === "string" &&
      typeof String( json.base64_j1[0].ativaEmailAlmGravissimos ).toLowerCase() === "string" &&
      typeof String( json.base64_j1[0].ativaEmailAlmSerios ).toLowerCase() === "string" &&
      typeof String( json.base64_j1[0].ativaSmsAlmGraves ).toLowerCase() === "string" &&
      typeof String( json.base64_j1[0].ativaSmsAlmGravissimos ).toLowerCase() === "string" &&
      typeof String( json.base64_j1[0].ativaSmsAlmSerios ).toLowerCase() === "string" &&
      typeof String( json.base64_j1[0].desativaPrintScreen ).toLowerCase() === "string" &&
      typeof String( json.base64_j1[0].impedirDragDrop ).toLowerCase() === "string" &&
      typeof String( json.base64_j1[0].pastasDiscovery ).toLowerCase() === "string" &&
      typeof String( json.base64_j1[0].caminhosProibidos ).toLowerCase() === "string" &&
      typeof String( json.base64_j1[0].pastasDiscoveryNaoConsiderar ).toLowerCase() === "string" &&
      typeof String( json.base64_j1[0].exibirDisplayDiscovery ).toLowerCase() === "string" &&
      typeof String( json.base64_j1[0].filmar_sempre ).toLowerCase() === "string" &&
      typeof String( json.base64_j1[0].monitoraDispExternos ).toLowerCase() === "string" &&
      typeof String( json.base64_j1[0].quandoPegarDadosSensiveis ).toLowerCase() === "string" &&
      typeof String( json.base64_j1[0].imgBlockPrtSc ).toLowerCase() === "string" &&
      typeof String( json.base64_j1[0].qtMinQualifsTab ).toLowerCase() === "string" &&
      typeof String( json.base64_j1[0].qtMinQualifsDoc ).toLowerCase() === "string" &&
      typeof String( json.base64_j1[0].maxQtFalsosNomes ).toLowerCase() === "string" &&
      typeof String( json.base64_j1[0].qtPalsManterQualificador ).toLowerCase() === "string" &&
      typeof String( json.base64_j1[0].QtMaxLinhasResult ).toLowerCase() === "string" &&
      typeof String( json.base64_j1[0].tMinQualifsTab ).toLowerCase() === "string" &&
      typeof String( json.base64_j1[0].comFonetizacao ).toLowerCase() === "string" &&
      typeof String( json.base64_j1[0].notaCorteSerios ).toLowerCase() === "string" &&
      typeof String( json.base64_j1[0].notaCorteGraves ).toLowerCase() === "string" &&
      typeof String( json.base64_j1[0].notaCorteGravissimos ).toLowerCase() === "string" &&
      typeof String( json.base64_j1[0].pastasSensiveis ).toLowerCase() === "string" &&
      typeof String( json.base64_j1[0].tempoDragAndDrop ).toLowerCase() === "string" &&
      typeof String( json.base64_j1[0].impressaoSpooler ).toLowerCase() === "string" &&
      typeof String( json.base64_j1[0].classificacaoAlarmeDragDrop ).toLowerCase() === "string" &&
      typeof String( json.base64_j1[0].ehS3 ).toLowerCase() === "string" &&
      typeof String( json.base64_j1[0].arquivosZip ).toLowerCase() === "string"
    ) {
      alert("Todos os campos do J2 foram verificas e estao com as tipagens OK!");
    } else {
      trava = true;
      alert("Existe uma divergencia no JSON (J2), corrija o erro, antes de enviar ao banco de dados!");
    }

    for (let i = 0; i < json.base64_j3.length; i++) {
      if (
        typeof json.base64_j3[i].derruba_app === "boolean" &&
        typeof json.base64_j3[i].filma === "boolean" &&
        typeof json.base64_j3[i].permite_colar === "boolean" &&
        typeof json.base64_j3[i].impede_colar === "boolean" &&
        typeof json.base64_j3[i].impede_copiar === "boolean" &&
        typeof json.base64_j3[i].json === "boolean" &&
        typeof json.base64_j3[i].print === "boolean" &&
        typeof json.base64_j3[i].tipo === "boolean" &&
        typeof json.base64_j3[i].filtro_titulo === "boolean" &&
        typeof json.base64_j3[i].executavel === "boolean"
      ) {
        alert("Todos os campos do J2 foram verificas e estao com as tipagens OK!");
      } else {
        trava = true;
        alert(`Existe uma divergencia no JSON (J3) array: [${i}], corrija o erro, antes de enviar ao banco de dados!`);
      }
    }
  };

  /* ATUALIZA UM ITEM DO J3 */
  putIndexL3 = async (index, executavel, itemExistente) => {

    for (let i = 0; i < this.state.base64_j3.length; i++) {
      if (
        this.state.base64_j3[i].filtro_titulo === index &&
        String(index).toLowerCase() != ""
      ) {
        if (String(itemExistente.derruba_app).toLowerCase() === "true") {
          itemExistente.derruba_app = true;
        } else if (
          String(itemExistente.derruba_app).toLowerCase() === "false"
        ) {
          itemExistente.derruba_app = false;
        } else {
          itemExistente.derruba_app = this.state.derruba_app;
        }

        if (String(itemExistente.filma).toLowerCase() === "true") {
          itemExistente.filma = true;
        } else if (String(itemExistente.filma).toLowerCase() === "false") {
          itemExistente.filma = false;
        } else {
          itemExistente.filma = this.state.filma;
        }

        if (String(itemExistente.permite_colar).toLowerCase() === "true") {
          itemExistente.permite_colar = true;
        } else if (
          String(itemExistente.permite_colar).toLowerCase() === "false"
        ) {
          itemExistente.permite_colar = false;
        } else {
          itemExistente.permite_colar = this.state.permite_colar;
        }

        if (String(itemExistente.impede_colar).toLowerCase() === "true") {
          itemExistente.impede_colar = true;
        } else if (
          String(itemExistente.impede_colar).toLowerCase() === "false"
        ) {
          itemExistente.impede_colar = false;
        } else {
          itemExistente.impede_colar = this.state.impede_colar;
        }

        if (String(itemExistente.impede_copiar).toLowerCase() === "true") {
          itemExistente.impede_copiar = true;
        } else if (
          String(itemExistente.impede_copiar).toLowerCase() === "false"
        ) {
          itemExistente.impede_copiar = false;
        } else {
          itemExistente.impede_copiar = this.state.impede_copiar;
        }

        if (String(itemExistente.print).toLowerCase() === "true") {
          itemExistente.print = true;
        } else if (String(itemExistente.print).toLowerCase() === "false") {
          itemExistente.print = false;
        } else {
          itemExistente.print = this.state.print;
        }

        this.state.base64_j3[i].derruba_app = itemExistente.derruba_app;
        this.state.base64_j3[i].filma = itemExistente.filma;
        this.state.base64_j3[i].permite_colar = itemExistente.permite_colar;
        this.state.base64_j3[i].impede_colar = itemExistente.impede_colar;
        this.state.base64_j3[i].impede_copiar = itemExistente.impede_copiar;
        this.state.base64_j3[i].json = itemExistente.json;
        this.state.base64_j3[i].print = itemExistente.print;
        this.state.base64_j3[i].tipo = itemExistente.tipo;
        this.state.base64_j3[i].filtro_titulo = itemExistente.filtro_titulo;
        this.state.base64_j3[i].executavel = itemExistente.executavel;
        this.state.base64_j3[i].url = itemExistente.url;
        this.state.base64_j3[i].quando_pegar_dados_sensiveis = itemExistente.quando_pegar_dados_sensiveis;
      } else if (
        this.state.base64_j3[i].executavel === executavel &&
        String(executavel).toLowerCase() != ""
      ) {

        if (String(itemExistente.derruba_app).toLowerCase() === "true") {
          itemExistente.derruba_app = true;
        } else if (
          String(itemExistente.derruba_app).toLowerCase() === "false"
        ) {
          itemExistente.derruba_app = false;
        } else {
          itemExistente.derruba_app = this.state.derruba_app;
        }

        if (String(itemExistente.filma).toLowerCase() === "true") {
          itemExistente.filma = true;
        } else if (String(itemExistente.filma).toLowerCase() === "false") {
          itemExistente.filma = false;
        } else {
          itemExistente.filma = this.state.filma;
        }

        if (String(itemExistente.permite_colar).toLowerCase() === "true") {
          itemExistente.permite_colar = true;
        } else if (
          String(itemExistente.permite_colar).toLowerCase() === "false"
        ) {
          itemExistente.permite_colar = false;
        } else {
          itemExistente.permite_colar = this.state.permite_colar;
        }

        if (String(itemExistente.impede_colar).toLowerCase() === "true") {
          itemExistente.impede_colar = true;
        } else if (
          String(itemExistente.impede_colar).toLowerCase() === "false"
        ) {
          itemExistente.impede_colar = false;
        } else {
          itemExistente.impede_colar = this.state.impede_colar;
        }

        if (String(itemExistente.impede_copiar).toLowerCase() === "true") {
          itemExistente.impede_copiar = true;
        } else if (
          String(itemExistente.impede_copiar).toLowerCase() === "false"
        ) {
          itemExistente.impede_copiar = false;
        } else {
          itemExistente.impede_copiar = this.state.impede_copiar;
        }

        if (String(itemExistente.print).toLowerCase() === "true") {
          itemExistente.print = true;
        } else if (String(itemExistente.print).toLowerCase() === "false") {
          itemExistente.print = false;
        } else {
          itemExistente.print = this.state.print;
        }

        this.setState.base64_j3[i].derruba_app = itemExistente.derruba_app;
        this.setState.base64_j3[i].filma = itemExistente.filma;
        this.setState.base64_j3[i].permite_colar = itemExistente.permite_colar;
        this.setState.base64_j3[i].impede_colar = itemExistente.impede_colar;
        this.setState.base64_j3[i].impede_copiar = itemExistente.impede_copiar;
        this.setState.base64_j3[i].json = itemExistente.json;
        this.setState.base64_j3[i].print = itemExistente.print;
        this.setState.base64_j3[i].tipo = itemExistente.tipo;
        this.setState.base64_j3[i].filtro_titulo = itemExistente.filtro_titulo;
        this.setState.base64_j3[i].executavel = itemExistente.executavel;
        this.setState.base64_j3[i].url = itemExistente.url;
        this.setState.base64_j3[i].quando_pegar_dados_sensiveis = itemExistente.quando_pegar_dados_sensiveis;
      }

      /* ==================================== */
      /* ATRIBUI UM VALOR FIXO AO JSON E TIPO */
      /* ==================================== */
      if (this.setState.base64_j3[i].json != "1") {
        this.setState.base64_j3[i].json = 2;
        this.setState.base64_j3[i].tipo = 1;
      }
    }


    console.log("J3 ATUAL");
    console.log(this.state.base64_j3);

    /* DESSA FORMA OS NOVOS DADOS IRAM REFLETIR NO FRONT-END */
    this.setState({ base64_j3: this.state.base64_j3 });

    try {
      /* AJUSTA QUALQUER INCONSISTENCIA NAS PASTAS SENSIVEIS */
      this.setState.pastasSensiveis = this.state.pastasSensiveis
        .split("\\\\")
        .join("\\");
      this.setState.pastasSensiveis = this.state.pastasSensiveis.replace(
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

    if (nome === undefined || nome === null) {
      alert("Você não pode deletar esse item - Sem título");
    } else {
      if (this.state.base64_j3.length === 1) {
        alert(
          "Você não pode deletar esse item, adicione um novo para poder deleta-lo!"
        );
      } else {
        for (let i = 0; i < this.state.base64_j3.length; i++) {
          if (this.state.base64_j3[i].filtro_titulo === nome) {
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
    }
  };

  componentDidMount() {
    bsCustomFileInput.init();
  }

  /* ================================================ */
  /* === DESCRIPTOGRAFA O JSON OBTIDO DA RESPOSTA === */
  /* ================================================ */

  converterJSON = async (obj) => {
    /* NAVEGA ENTRE O JSON DESCRIPTOGRAFANDO CADA CAMPO ESPECIFICO ARMAZENDO O RESULTADO EM VARIAVEIS */

    /* DESCRIPTOGRAFA O JSON E ARMAZENA OS DADOS EM VARIAVEIS PARA QUE POSSAM SER MANIPULADAS NO FRONT */
    for (let i = 0; i < obj.length; i++) {
      let base64ToString = Buffer.from(obj[i].base64_j1, "base64").toString();
      base64ToString = JSON.parse(base64ToString);

      obj[i].base64_j1 = base64ToString;

      console.log("J1");
      console.log(obj[i].base64_j1);

      let base64ToString3 = Buffer.from(obj[i].base64_j3, "base64").toString();

      console.log("J3");
      console.log(base64ToString3);

      base64ToString3 = JSON.parse(base64ToString3);

      obj[i].base64_j3 = base64ToString3;

      console.log("Meu J3");
      console.log(obj[i].base64_j3);
    }

    /* ======================================= */
    /* === CONVERTENDO STRING PARA BOOLEAN === */
    /* ======================================= */

    for (let i = 0; i < obj[0].base64_j3.length; i++) {
      if (String(obj[0].base64_j3[i].derruba_app).toLowerCase() == "true") {
        obj[0].base64_j3[i].derruba_app = true;
      } else if (
        String(obj[0].base64_j3[i].derruba_app).toLowerCase() == "false"
      ) {
        obj[0].base64_j3[i].derruba_app = false;
      }

      if (String(obj[0].base64_j3[i].filma).toLowerCase() == "true") {
        obj[0].base64_j3[i].filma = true;
      } else if (String(obj[0].base64_j3[i].filma).toLowerCase() == "false") {
        obj[0].base64_j3[i].filma = false;
      }

      if (String(obj[0].base64_j3[i].permite_colar).toLowerCase() == "true") {
        obj[0].base64_j3[i].permite_colar = true;
      } else if (
        String(obj[0].base64_j3[i].permite_colar).toLowerCase() == "false"
      ) {
        obj[0].base64_j3[i].permite_colar = false;
      }

      if (String(obj[0].base64_j3[i].impede_colar).toLowerCase() == "true") {
        obj[0].base64_j3[i].impede_colar = true;
      } else if (
        String(obj[0].base64_j3[i].impede_colar).toLowerCase() == "false"
      ) {
        obj[0].base64_j3[i].impede_colar = false;
      }

      if (String(obj[0].base64_j3[i].impede_copiar).toLowerCase() == "true") {
        obj[0].base64_j3[i].impede_copiar = true;
      } else if (
        String(obj[0].base64_j3[i].impede_copiar).toLowerCase() == "false"
      ) {
        obj[0].base64_j3[i].impede_copiar = false;
      }

      if (String(obj[0].base64_j3[i].print).toLowerCase() == "true") {
        obj[0].base64_j3[i].print = true;
      } else if (String(obj[0].base64_j3[i].print).toLowerCase() == "false") {
        obj[0].base64_j3[i].print = false;
      }
    }

    /* ATRIBUI OS DADOS DESCRIPTOGRAFADOS AO ARRAY NOVAMENTE PARA QUE POSSA SER MANIPULADO */
    this.setState({
      arrayDlp: obj,
    });

    /* ARMAZENA SOMENTE O CONTEUDO DE J3 */
    this.setState({
      base64_j3: obj[0].base64_j3,
    });
  };

  /* ==================================== */
  /* === CRIPTOGRAFAR O OBJETO OBTIDO === */
  /* ==================================== */

  criptografarJSON = async (obj) => {

    /* ======================================= */
    /* === CONVERTENDO BOOLEAN PARA STRING === */
    /* ======================================= */

    /* CRIPTOGRAFA O JSON E ARMAZENA OS DADOS EM VARIAVEIS PARA QUE POSSAM SER MANIPULADAS NO FRONT */
    var jsonJ1 = JSON.stringify(obj.base64_j1);
    var converterParaBase64J1 = jsonJ1;
    var criptografaStringJ1 = btoa(
      unescape(encodeURIComponent(converterParaBase64J1))
    );
    obj.base64_j1 = criptografaStringJ1;

    var jsonJ2 = JSON.stringify(obj.base64_j2);
    var converterParaBase64J2 = jsonJ2;
    var criptografaStringJ2 = btoa(converterParaBase64J2);

    obj.base64_j2 = criptografaStringJ2;

    var jsonJ3 = JSON.stringify(obj.base64_j3);

    for (let j = 0; j < jsonJ3.length; j++) {
      jsonJ3 = jsonJ3.replace("[", "");
      jsonJ3 = jsonJ3.replace("]", "");
    }

    var converterParaBase64J3 = jsonJ3;
    var criptografaStringJ3 = btoa(converterParaBase64J3);
    obj.base64_j3 = criptografaStringJ3;

    console.log("Meu Objeto");
    console.log(obj);

    /* ENVIA OS DADOS ATUALIZADOS E CRIPTOGRAFADOS POR MEIO DO METODO postJson */
    DlpController.postJson(obj).then((response) => console.log(response));

    setTimeout(function () { alert("Dado(s) Alterados com sucesso!") }, 500);

    /* REDIRECIONAR USUARIO */
    this.state.token = DlpController.capituraToken();

    var tokenAcesso = this.state.token;

    // Redireciona o usuário para a página informada
    setTimeout(function () {
      window.location.href = `${DlpController.ambienteRedirecionamentoReact()}/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;
    }, 1000);
  };

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
    this.state.impede_colar = false;
    this.state.impede_copiar = false;
    this.state.json = 0;
    this.state.print = false;
    this.state.tipo = "";
    this.state.filtro_titulo = "";
    this.state.executavel = "";
    this.state.url = "";
    this.state.quando_pegar_dados_sensiveis = "";
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
      console.log("VOCE ESTA SEM TOKEN, FAÇA O LOGIN NOVAMENTE");

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
        String(this.state.base64_j3[i].impede_colar).toLowerCase() == "true"
      ) {
        this.state.base64_j3[i].impede_colar = true;
      } else if (
        String(this.state.base64_j3[i].impede_colar).toLowerCase() == "false"
      ) {
        this.state.base64_j3[i].impede_colar = false;
      }

      if (
        String(this.state.base64_j3[i].impede_copiar).toLowerCase() == "true"
      ) {
        this.state.base64_j3[i].impede_copiar = true;
      } else if (
        String(this.state.base64_j3[i].impede_copiar).toLowerCase() == "false"
      ) {
        this.state.base64_j3[i].impede_copiar = false;
      }

      if (String(this.state.base64_j3[i].print).toLowerCase() == "true") {
        this.state.base64_j3[i].print = true;
      } else if (
        String(this.state.base64_j3[i].print).toLowerCase() == "false"
      ) {
        this.state.base64_j3[i].print = false;
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
    this.state.enviarJson = true;
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

  render() {
    return (
      <div>
        <div className="page-header">
          <h3 className="page-title"> Configurações - Máquinas (endpoints) </h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="!#" onClick={(event) => event.preventDefault()}>
                  Forms
                </a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Form elements
              </li>
            </ol>
          </nav>
        </div>
        <div className="row">
          <div className="col-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                {/*<h4 className="card-title">Negócio</h4>*/}
                <p className="card-description"> Conf. </p>
                <form
                  className="forms-sample"
                  onSubmit={this.handleSubmitGetByNomeComputador}
                >
                  <Form.Group>
                    <label htmlFor="exampleInputName1">
                      Pesquisa (pesquise a estação)
                    </label>
                    <Form.Control
                      type="text"
                      name="name"
                      className="form-control"
                      id="exampleInputName1"
                      placeholder="Digite o nome da estação"
                      onChange={this.handleChangeNome}
                    />
                  </Form.Group>

                  <div className="mr-12 d-flex justify-content-start">
                    <button
                      type="submit"
                      className="btn btn-primary m-0 text-light pesquisando"
                      onClick={() => this.carregadandoPesquisa()}
                    >
                      Carregar
                    </button>
                    <div class="buttonload">
                      <i class="fa fa-refresh fa-spin"></i>
                    </div>
                  </div>

                  <div className="mt-2 mb-2">
                    <p className="m-0 carregando">
                      Carregando, por favor aguarde!
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* GET | USUARIO */}
          {this.state.arrayDlp.map((arrayDlp) => (
            <div className="col-12 grid-margin" key={arrayDlp.computer_name}>
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Dados pesquisa:</h4>
                  <form
                    className="form-sample"
                    onSubmit={this.handleSubmitPutComputador}
                  >
                    {" "}
                    <p className="card-description">
                      {" "}
                      Dados relacionados a pesquisa executada acima{" "}
                    </p>
                    <div className="row">

                      <div className="col-md-4">
                        <Form.Group className="row">
                          <label className="col-sm-3 col-form-label">
                            Nome
                          </label>
                          <div className="col-sm-9">
                            <Form.Control
                              type="text"
                              value={this.state.computer_name}
                              onChange={this.handleChangeComputerName}
                              disabled
                            />
                          </div>
                        </Form.Group>
                      </div>

                      <div className="col-md-4">
                        <Form.Group className="row">
                          <label className="col-sm-3 col-form-label">
                            Grupo Dlp
                          </label>
                          <div className="col-sm-9">
                            <Form.Control
                              type="text"
                              value={this.state.grupo_dlp}
                              onChange={this.handleChangeGrupo_Dlp}
                              disabled
                            />
                          </div>
                        </Form.Group>
                      </div>

                      <div className="col-md-4">
                        <Form.Group className="row">
                          <label className="col-sm-3 col-form-label">
                            Máquina
                          </label>
                          <div className="col-sm-9">
                            <Form.Control
                              type="text"
                              value={this.state.maquina}
                              onChange={this.handleChangeMaquina}
                              disabled
                            />
                          </div>
                        </Form.Group>
                      </div>
                    </div>
                    
                    {/* BASE x64 - J1 */}
                    <p class="privilegio" className="card-description">
                      {" "}
                      JSON - Configurações | J1{" "}
                    </p>
                    <div className="row">

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
                            <select
                              className="opcoes-select"
                              name="estado"
                              value={this.state.grupoDlp}
                              onChange={this.handleChangeGrupoDlp}
                            //disabled
                            //Esta desabilitado pois no momento o Endpoint 'putJson' não pode mudar o grupo quando enviamos apenas uma máquina. A mudança de grupo deve ocorrer pelo configuração em Massa.
                            >
                              {this.state.gruposDlps.map((grupo) => {
                                return <option value={grupo}>{grupo}</option>;
                              })}
                            </select>
                          </div>
                        </Form.Group>
                      </div>

                    </div>
                    {/* BASE x64 - J2 */}
                    <p className="card-description">
                      {" "}
                      JSON - Configurações | J2{" "}
                    </p>

                    <div className="row">

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

                      <div className="col-md-6">
                        <Form.Group className="row">
                          <div className="col-sm-12">
                            <Form.Control type="text" value="Caminhos Proibidos" disabled />
                          </div>
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group className="row">
                          <div className="col-sm-12">
                            <Form.Control type="text"
                              value={this.state.caminhosProibidos}
                              onChange={this.handleChangeCaminhosProibidos}
                            />
                          </div>
                        </Form.Group>
                      </div>


                        {/** 
                        * Este trecho esta oculto do front até desenvolvimento do Backend
                        * \/  \/  \/  \/  \/  \/  \/  \/  \/  \/  \/  \/  \/  \/  \/ 
                        */}


                      <div className="col-md-6 d-none">
                        <Form.Group className="row">
                          <div className="col-sm-12">
                            <Form.Control type="text" value="Ativa OCR" disabled />
                          </div>
                        </Form.Group>
                      </div>
                      <div className="col-md-6 d-none">
                      <Form.Group className="row">
                          <div className="col-sm-12">
                            <select
                              className="opcoes-select"
                            >
                              <option value="0">Não</option>
                              <option value="1">Sim</option>
                            </select>
                          </div>
                        </Form.Group>
                      </div>

                      <div className="col-md-6 d-none">
                        <Form.Group className="row">
                          <div className="col-sm-12">
                            <Form.Control type="text" value="Permite Impressão" disabled />
                          </div>
                        </Form.Group>
                      </div>
                      <div className="col-md-6 d-none">
                      <Form.Group className="row">
                          <div className="col-sm-12">
                            <select
                              className="opcoes-select"
                            >
                              <option value="0">Não</option>
                              <option value="1">Sim</option>
                            </select>
                          </div>
                        </Form.Group>
                      </div>

                      <div className="col-md-6 d-none">
                        <Form.Group className="row">
                          <div className="col-sm-12">
                            <Form.Control type="text" value="Impede Impressão" disabled />
                          </div>
                        </Form.Group>
                      </div>
                      <div className="col-md-6 d-none">
                      <Form.Group className="row">
                          <div className="col-sm-12">
                            <select
                              className="opcoes-select"
                            >
                              <option value="0">Não</option>
                              <option value="1">Sim</option>
                            </select>
                          </div>
                        </Form.Group>
                      </div>


                        {/** 
                        * /\  /\  /\  /\  /\  /\  /\  /\  /\  /\  /\  /\  /\  /\                            
                        * Este trecho esta oculto do front até desenvolvimento do Backend
                        * */}

                        {/** 
                        * Este trecho esta no front para desenvolvimento do Discovery
                        * \/  \/  \/  \/  \/  \/  \/  \/  \/  \/  \/  \/  \/  \/  \/ 
                        */}


                      <div className="col-md-6 d-none">
                        <Form.Group className="row">
                          <div className="col-sm-12">
                            <Form.Control type="text" value="Exibir Display do Discovery" disabled />
                          </div>
                        </Form.Group>
                      </div>
                      <div className="col-md-6 d-none">
                        <Form.Group className="row">
                          <div className="col-sm-12">
                            <select
                              className="opcoes-select"
                              value={this.state.exibirDisplayDiscovery}
                              onChange={this.handleChangeExibirDisplayDiscovery}
                            >
                              <option value="0">Não</option>
                              <option value="1">Sim</option>
                            </select>
                          </div>
                        </Form.Group>
                      </div>

                      <div className="col-md-6 d-none">
                        <Form.Group className="row">
                          <div className="col-sm-12">
                            <Form.Control type="text" value="Pastas Discovery" disabled />
                          </div>
                        </Form.Group>
                      </div>
                      <div className="col-md-6 d-none">
                        <Form.Group className="row">
                          <div className="col-sm-12">
                            <Form.Control type="text"
                              value={this.state.pastasDiscovery}
                              onChange={this.handleChangePastasDiscovery}
                            />
                          </div>
                        </Form.Group>
                      </div>

                      <div className="col-md-6 d-none">
                        <Form.Group className="row">
                          <div className="col-sm-12">
                            <Form.Control type="text" value="Pastas Discovery Não Considerar" disabled />
                          </div>
                        </Form.Group>
                      </div>
                      <div className="col-md-6 d-none">
                        <Form.Group className="row">
                          <div className="col-sm-12">
                            <Form.Control type="text"
                              value={this.state.pastasDiscoveryNaoConsiderar}
                              onChange={this.handleChangePastasDiscoveryNaoConsiderar}
                            />
                          </div>
                        </Form.Group>
                      </div>


                        {/** 
                        * /\  /\  /\  /\  /\  /\  /\  /\  /\  /\  /\  /\  /\  /\                            
                        * Este trecho esta no front para desenvolvimento do Discovery
                        */}


                    </div>

                    {/* BASE x64 - J3 */}
                    <p className="card-description">
                      {" "}
                      JSON - Configurações | J3{" "}
                    </p>

                    {this.state.base64_j3.map((conteudoJ3) => {
                      if (true) {
                        return (
                          <div className="row mt-3 col-md-12 inputs">
                            <div className="col-md-12">
                              <p className="card-description">
                                {" "}
                                Configurações{" "}
                                <strong>
                                  {conteudoJ3.filtro_titulo}
                                  {conteudoJ3.executavel}
                                  {/* {conteudoJ3.url} */}
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
                                    <option value="" disabled>Segue Flag Geral</option>
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
                                      this.deleteIndexL3(
                                        conteudoJ3.filtro_titulo
                                      )
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
                                <div className="col-sm-12">
                                  <Form.Control
                                    type="text"
                                    value={conteudoJ3.executavel}
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
                                    value="URL"
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
                                    value={conteudoJ3.url}
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
                                    value="Permite Colar"
                                    disabled
                                  />
                                </div>
                              </Form.Group>
                            </div>
                            <Switch
                              onChange={this.handleChangePermite_colar}
                              checked={conteudoJ3.permite_colar}
                              disabled
                            />

                            <div className="col-md-6">
                              <Form.Group className="row">
                                <div className="col-sm-12">
                                  <Form.Control
                                    type="text"
                                    value="Impede Colar"
                                    disabled
                                  />
                                </div>
                              </Form.Group>
                            </div>
                            <Switch
                              onChange={this.handleChangeImpede_colar}
                              checked={conteudoJ3.impede_colar}
                              disabled
                            />

                            <div className="col-md-6">
                              <Form.Group className="row">
                                <div className="col-sm-12">
                                  <Form.Control
                                    type="text"
                                    value="Impede Copiar"
                                    disabled
                                  />
                                </div>
                              </Form.Group>
                            </div>
                            <Switch
                              onChange={this.handleChangeImpede_copiar}
                              checked={conteudoJ3.impede_copiar}
                              disabled
                            />

                            <div className="col-md-6">
                              <Form.Group className="row">
                                <div className="col-sm-12">
                                  <Form.Control
                                    type="text"
                                    value="Filma"
                                    disabled
                                  />
                                </div>
                              </Form.Group>
                            </div>
                            <Switch
                              onChange={this.handleChangeFilma}
                              checked={conteudoJ3.filma}
                              disabled
                            />

                            <div className="col-md-6">
                              <Form.Group className="row">
                                <div className="col-sm-12">
                                  <Form.Control
                                    type="text"
                                    value="Print"
                                    disabled
                                  />
                                </div>
                              </Form.Group>
                            </div>
                            <Switch
                              onChange={this.handleChangePrint}
                              checked={conteudoJ3.print}
                              disabled
                            />

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
                              disabled
                            />

                            


                          </div>
                        );
                      }
                    })}
                    <div className="botoes-acoes">
                      <div className="botao-salvar-alteracoes mr-1">
                        <button
                          type="submit"
                          //onClick={() => this.enviarDadosAoServidor()}
                          onClick={() => this.enviarDadosAoServidor()}

                        >
                          Salvar Alterações
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
          ))}

          {/* FEEDBACK DE PESQUISA */}
          <div id="pesquisa-invalida">
            <p> Pesquisa vazia... </p>
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
                    Adicionar Item - Configurações | J3
                  </p>
                </div>

                <div class="modal-body">
                  <form className="row mt-3">
                    <div className="col-md-6">
                      <Form.Group className="row">
                        <div className="col-sm-9">
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
                        <div className="col-sm-9">
                          <select
                            className="opcoes-select"
                            name="estado"
                            value={this.state.quando_pegar_dados_sensiveis}
                            onChange={
                              this.handleChangeQuando_pegar_dados_sensiveis
                            }
                          >
                            <option value="0">Segue Flag Geral</option>
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

                    <div className="col-md-6 d-none">
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
                    <div className="col-md-6 d-none">
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

                    <div className="col-md-6">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Permite Colar"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <Switch
                      onChange={this.handleChangePermite_colar}
                      checked={this.state.permite_colar}
                    />

                    <div className="col-md-6">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Impede Colar"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <Switch
                      onChange={this.handleChangeImpede_colar}
                      checked={this.state.impede_colar}
                    />

                    <div className="col-md-6">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Impede Copiar"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <Switch
                      onChange={this.handleChangeImpede_copiar}
                      checked={this.state.impede_copiar}
                    />

                    <div className="col-md-6">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Filma"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <Switch
                      onChange={this.handleChangeFilma}
                      checked={this.state.filma}
                    />

                    <div className="col-md-6">
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value="Print"
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <Switch
                      onChange={this.handleChangePrint}
                      checked={this.state.print}
                    />

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
                    <Switch
                      onChange={this.handleChangeDerruba_app}
                      checked={this.state.derruba_app}
                    />

                    <div class="modal-footer col-md-12 botao-enviar">
                      <button 
                        type="button" 
                        data-dismiss="modal"
                      >
                        Fechar
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

export default BasicElements;
