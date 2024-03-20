import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import bsCustomFileInput from 'bs-custom-file-input';
import DlpController from './controller/DlpController';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

import './css/style.css';

import http from "./http/http.js";

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
      arrayDlp: [],
      comprimentoJ3: 0,
      enviarJson: false,
      arrayParaEnvioAoServidor: [],

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
      todosDadosArrayDlpEmailAutomatico: [],

    };

    /* CARREGA A LISTA DE GRUPOS POR MEIO DO TOKEN DO USUARIO */
    this.findAllGrupoDlpDefault();

    /* SEMPRE QUE O COMPONENT E CHAMADO ESSE METODO E INSTANCIADO AUTOMATICAMENTE */
    this.verificarPrivilegio();

    /* CARREGA TODA A LISTA DE METADADOS CADASTROS NO BANCO DE ACORDO COM O GRUPO DLP */
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
  handleMetadado = event => {
    this.setState({ metadado: event.target.value });
  }

  /* === OBSERVADOR DADO === */
  handleDado = event => {
    this.setState({ dado: event.target.value });
  }

  /* ATUALIZA O USUARIO - ESSE METODO NAO SERA UTILIZADO */
  handleSubmitPutComputador = event => {
    event.preventDefault();

    const computador = {
      metadado: this.state.metadado,
      dado: this.state.dado,
      grupo_dlp: this.state.grupoDlp
    };

    console.log('GRUPO DLP SELECIONADO');
    console.log(this.state.grupoDlp);

    console.log('OBJ ENVIO');
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

        for (let i = 0; i < response.data.length; i++) {
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

          token = token.replace('*', '');
          console.log(`Grupo DLP: ${token}`);

        } catch (erro) {
          console.log('Nao foi localizado * na String');

        }

        response.data.map(item => {
          // SMS DESTS
          if (item.metadado.includes('sms dests serio') || item.metadado.includes('sms dests grave') || item.metadado.includes('sms dests gravissimo') && token.includes(item.grupo_dlp)) {
            arrayMemoria.push(item);
          }

          // EMAIL AUTOMATICO
          if (item.metadado.includes('emailautomatico') && token.includes(item.grupo_dlp)) {
            arrayMemoriaEmail.push(item);
          }

        });

        this.setState({
          todosDadosArrayDlp: arrayMemoria
        });

        this.setState({
          todosDadosArrayDlpEmailAutomatico: arrayMemoriaEmail
        });

        console.log('RETORNO OBJ <LIST METADADOS SMS>: ');
        console.log(this.state.todosDadosArrayDlp);

        console.log('RETORNO OBJ <LIST METADADOS EMAIL>: ');
        console.log(this.state.todosDadosArrayDlpEmailAutomatico);

      });

  }

  /* ================== */
  /* === METODO PUT === */
  /* ================== */

  /* ENVIA TODOS OS DADOS ATUALIZADOS DO JSON INCLUINDO (J1, J2 E J3) */
  putComputador = async (postDados) => {

    if (postDados.metadado !== '' && postDados.dado !== '') {
      DlpController.postMetadado(postDados)
        .then(response => {
          console.log(response);

          if (postDados.metadado.includes('email')) {
            this.state.todosDadosArrayDlpEmailAutomatico.map(item => {

              if (!item.dado.includes(postDados.dado) && item.dado.split(',').length > 1) {
                item.dado = `${item.dado},${postDados.dado}`;

                console.log('ITEM ATUAZALIDO: ');
                console.log(item);

                DlpController.putMetadado(item.metadado, item)
                  .then(response => console.log(response));

              } else if (!item.dado.includes(postDados.dado)) {
                item.dado = `${postDados.dado}`;

                console.log('ITEM ATUAZALIDO: ');
                console.log(item);

                DlpController.putMetadado(item.metadado, item)
                  .then(response => console.log(response));

              }

            });

          } else {

            this.state.todosDadosArrayDlp.map(item => {

              if (!item.dado.includes(postDados.metadado) && item.dado.split(',').length > 1) {
                item.dado = `${item.dado},<<${postDados.metadado}>>`;

                DlpController.putMetadado(item.metadado, item)
                  .then(response => console.log(response));

              } else if (!item.dado.includes(postDados.metadado)) {
                item.dado = `<<${postDados.metadado}>>`;

                DlpController.putMetadado(item.metadado, item)
                  .then(response => console.log(response));

              }

            });

          }

        })
        .catch(erro => {
          console.log('OCORREU UM ERRO COM O REGISTRO DO DADO NO BANCO DE DADOS');
        });

      this.state.token = DlpController.capituraToken();

      var tokenAcesso = this.state.token;

      setTimeout(function () {
        window.location.href = `${DlpController.ambienteRedirecionamentoReact()}/flashsafe/conf/form-Elements/basic-elements/?ss=${tokenAcesso}`;

      }, 2000);

    } else {
      alert('PREENCHA OS CAMPOS CORRETAMENTE!!');

    }

  }

  /* ===================== */
  /* === METODO DELETE === */
  /* ===================== */

  /* DELETE UM ITEM ESPECIFICO, E PARA ISSO PASSANDO COMO PARAMENTRO SEU tipo */
  deleteIndexL3 = async (nome) => {

    if (this.state.base64_j3.length == 1) {
      alert("Você não pode deletar esse item, adicione um novo para poder deleta-lo!");

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

  }

  componentDidMount() {
    bsCustomFileInput.init()
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

    } catch (erro) {
      console.log('VOCÊ ESTA SEM TOKEN, FAÇA O LOGIN NOVAMENTE');

      window.location.href = DlpController.ambienteRedirecionamento();

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

  render() {
    return (
      <div>

        <div className="row adicionar ativar" id="adicionarAncoramento">

          <div className="col-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">

                <div className="row criacao-metadado">
                  <h1 className="titulo-metadados">Metadados</h1>
                  <p className="dados-metadados">
                    Importante cadastro prévio na Ferramenta DlpAdmin, para inserir dados de telefones, emails, texto padrão  de sms/e-mail, utilizados na Solução, em cada aviso ou alerta existente.
                    Dentro do Metadados,  geramos a política de acionamento por tipo de alarme.
                  </p>
                  <p className="exemplos-metadados" >
                    sms <strong>nome:</strong> cadastrar  (nome) para o número de telefone que será enviado sms.
                  </p>
                  <p className="exemplos-metadados" >
                    email <strong>nome:</strong>  (nome) para o destinatário de email.
                  </p>

                  <table className="tabela-metadados-exemplos">
                    {/*<tr>
                      <th>Metadado</th>
                      <th>Dados</th>
                    </tr>
                    <tr>
                      <td>E-mail</td>
                      <td>inserir o email para ser acionado. 
                        <br />Exemplo1: <strong>nome1@nome1.com.br</strong><br />
                        Exemplo2: <strong>email nome1</strong>
                      </td>
                    </tr>*/}
                    <tr>
                      <td>sms<br />
                        Exemplo: <strong>sms nome</strong>
                      </td>
                      <td>inserir número de telefone completo<br />
                        Exemplo: <strong>1199999999</strong>
                      </td>
                    </tr>
                  </table>

                </div>

                {/* ENVIANDO ITENS PADROES PARA DIVERSAS MAQUINAS */}
                <form className="row mt-3 ajuste-form" onSubmit={this.handleSubmitPutComputador} >

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
                            <option value="">Selecione o grupo</option>
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
                      <button type="submit" onClick={() => this.enviarDadosAoServidor()} > Enviar </button>
                    </div>
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

export default GrupoDlp
