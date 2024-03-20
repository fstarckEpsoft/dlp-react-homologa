import React, { Component } from 'react';
import bsCustomFileInput from 'bs-custom-file-input';
import DlpController from './controller/DlpController';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

import './css/style.css';

export class PastasSensiveisAcessos extends Component {

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

      senhaA: '',
      senhaN: '',
      senhaAntigaRecuperada: '',
      id: 0,

      token: ''

    };

    try{
      /* CARREGA A LISTA DE GRUPOS POR MEIO DO TOKEN DO USUARIO */
      //this.findAllGrupoDlpDefault();

      /* SEMPRE QUE O COMPONENT E CHAMADO ESSE METODO E INSTANCIADO AUTOMATICAMENTE */
      this.verificarPrivilegio();

      this.findSenhaAntiga();

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

  senhaNova = event => {
    this.setState({ senhaN: event.target.value });

  };

  senhaAntiga = event => {
    this.setState({ senhaA: event.target.value });

  };

  /* ============================================= */
  /* === CONSTROE O OBJETO PARA ENVIO AO BANCO === */
  /* ============================================= */
  handleSubmitAtualizarSenha = event => {
    event.preventDefault();

    const objeto = {
      senhaA: this.state.senhaA,
      senhaN: this.state.senhaN,
    };

    if(this.state.senhaA === this.state.senhaAntigaRecuperada) {
      console.log('OBJ ENVIO');
      console.log(objeto);

      this.putAtualizaSenha(objeto);

    }else {
      alert('Digite corretamente sua senha antiga');

    }

  };

  /* ================== */
  /* === METODO GET === */
  /* ================== */

  findSenhaAntiga = async () => {
    try {
      DlpController.getSenhaAntiga()
      .then(response => {

        try {
          console.log('SENHAS: ');
          console.log(response.data);

          this.state.senhaAntigaRecuperada = response.data[0].password;
          this.state.id = response.data[0].id;
          console.log('Senha antiga: '+ this.state.senhaAntigaRecuperada);
          console.log('ID: '+ this.state.id);

        }catch(err) {
          alert(`Não foi possível localizar sua senha no banco de dados. \nPor favor, verifique com o suporte da plataforma. \nLogin que esta sendo utilizado no momento: ${Buffer.from(DlpController.capituraToken(), "base64").toString().split('-')[0]}`);
          window.location.href = DlpController.ambienteRedirecionamento();
        }

      }).catch(err => {
        alert(`Não foi possível localizar sua senha no banco de dados. \nPor favor, verifique com o suporte da plataforma. \nLogin que esta sendo utilizado no momento: ${Buffer.from(DlpController.capituraToken(), "base64").toString().split('-')[0]}`);
        window.location.href = DlpController.ambienteRedirecionamento();
      });
    
    }catch(err) {
      alert(`Não foi possível localizar sua senha no banco de dados. \nPor favor, verifique com o suporte da plataforma. \nLogin que esta sendo utilizado no momento: ${Buffer.from(DlpController.capituraToken(), "base64").toString().split('-')[0]}`);
      window.location.href = DlpController.ambienteRedirecionamento();
    }
    
  }

  /* ========================================== */
  /* === ATUALIZA A SENHA NO BANCO DE DADOS === */
  /* ========================================== */
  putAtualizaSenha = async (objeto) => {

    const obj = {
      "id": this.state.id,
      "password": objeto.senhaN
    }
    
    console.log(obj);

    DlpController.putAtualizaSenha(obj)
      .then(response => console.log(response.data));

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

  componentDidMount() {
    bsCustomFileInput.init()
  }

  /* ========================================= */
  /* === VERIFICA PERMISSAO DE USUARIO (*) === */
  /* ========================================= */
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
    for (let i = 0; i < base64ToString.length; i++) {
      /* VERIFICA SE NA POSICAO ATUAL SE TRATA DE UM *, CASO SEJA RETORNA O VALOR TRUE PARA REALIZAR A LIBERACAO TOTAL AS CONFIGURACOES */
      if (String(base64ToString[i]) == "*") {
        console.log("Contem *");

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
                  <h1 className="titulo-metadados">Cadastrar nova Senha</h1>
                </div>

                {/* CHAMA O METOFO PARA ENVIAR OS DADOS COLETADOS NO FORMULARIO */}
                <form className="row mt-3 ajuste-form" onSubmit={this.handleSubmitAtualizarSenha} >

                  <div className="row col-md-12 inputs">
                    <div className="col-md-12">
                      <div className="input">
                        Senha Antiga:
                        <input type="password" className="input-pastas" value={this.state.senhaA} onChange={this.senhaAntiga} />

                        Nova Senha:
                        <input type="password" className="input-pastas" value={this.state.senhaN} onChange={this.senhaNova} />
                      </div>

                    </div>

                  </div>

                  <div className="botoes-acoes col-md-12">
                    <div className="botao-salvar-alteracoes" >
                      <button type="submit"  > Ok </button>
                    </div>
                  </div>

                </form>

              </div>
            </div>
          </div>

        </div >

      </div >
    )
  }
}

export default PastasSensiveisAcessos
