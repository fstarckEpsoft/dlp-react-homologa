import React, { Component } from 'react';
import bsCustomFileInput from 'bs-custom-file-input';
import DlpController from './controller/DlpController';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

import './css/style.css';

export class PastasSensiveisLiberacoes extends Component {

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

      token: '',

      arrayPastas: [],
      pastas: '',
      tempo: '',
      senha: '',

      maquinaDPO: '',
      maquinaLiberacaoDPO: '',
      arrayNomeMaquinas: [],
      maquinaSele: '',

      senhaAntigaRecuperada: '',

      id: 0

    };

    try {

    /* CARREGA A LISTA DE GRUPOS POR MEIO DO TOKEN DO USUARIO */
    this.findAllTodasPastasDpo(Buffer.from(DlpController.capituraToken(), "base64").toString().split('-')[0]);

    /* SEMPRE QUE O COMPONENT E CHAMADO ESSE METODO E INSTANCIADO AUTOMATICAMENTE */
    this.verificarPrivilegio();

    /* CARREGA A LISTA DE PASTAS CADASTRADAS NO BANCO */
    this.findArrayPastas();

    /* ARMAZENA MAQUINA DE DPO */
    this.verificaUsuarioDPO();

    /* CARREGA A SENHA ANTIGA */
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

  handleChangeTempo = event => {
    this.setState({ tempo: event.target.value });
  };

  handleChangeSenha = event => {
    this.setState({ senha: event.target.value });
  }

  handleChangePastas = event => {
    this.setState({ pastas: event.target.value });
  };

  findSenhaAntiga = async () => {
    try {
      DlpController.getSenhaAntiga()
        .then(response => {

          try {
          this.state.senhaAntigaRecuperada = response.data[0].password;
          console.log('Senha antiga: '+ this.state.senhaAntigaRecuperada);

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


  /* =================================================== */
  /* === FILTRA O A MAQUINA DO DPO LOGADO NO SISTEMA === */
  /* =================================================== */
  verificaUsuarioDPO = async () => {
    var tokenDPO = DlpController.capituraToken();

    let tokenDescriptografado = '';

    try {
      tokenDescriptografado = Buffer.from(tokenDPO, "base64").toString();

    } catch (erro) {
      console.log('VOCÊ ESTA SEM TOKEN, FAÇA LOGIN NOVAMENTE');

      window.location.href = DlpController.ambienteRedirecionamento();

    }

    var usuarioLogado = tokenDescriptografado.split('-')[0];
    usuarioLogado.replace(/[0-9]/g, '');

    let stringValida = usuarioLogado;

    DlpController.getMaquinaDPO()
      .then(response => {

        console.log(response.data);

        response.data.forEach((dado, i) => {
          if (stringValida.includes(dado.user_name)) {
            this.setState({ maquinaDPO: dado.cod_maquina })
            this.setState({ grupoDlp: dado.grupo_dlp })
            //alert(`NOME MAQUINA DE DPO: ${this.state.maquinaDPO} USUARIO LOGADO: ${dado.user_name}`);
          }
        })

        this.setState({ arrayNomeMaquinas: response.data });
        this.setState({ maquinaSele: this.state.maquinaDPO });

      }).catch(erro => console.log('OCORREU UM ERRO NA PESQUISA!'));

  }


  /* === CONSTROE O OBJETO PARA ENVIO AO BANCO ==== */
  handleSubmitPastasSensiveis = event => {
    event.preventDefault();

    let auxiliarPastasSensiveis = '';

    auxiliarPastasSensiveis = JSON.stringify(this.state.pastas).replace('[', '');
    auxiliarPastasSensiveis = auxiliarPastasSensiveis.replace(']','');
    auxiliarPastasSensiveis = auxiliarPastasSensiveis.replaceAll('","',',');
    auxiliarPastasSensiveis = auxiliarPastasSensiveis.replaceAll('\"','"');
    auxiliarPastasSensiveis = auxiliarPastasSensiveis.replaceAll('/','\\');
    auxiliarPastasSensiveis = auxiliarPastasSensiveis.replaceAll('\\\\','\\');
    auxiliarPastasSensiveis = auxiliarPastasSensiveis.replace('\"','');
    auxiliarPastasSensiveis = auxiliarPastasSensiveis.replace('\"','');
    auxiliarPastasSensiveis = auxiliarPastasSensiveis.replaceAll('\\','\\\\');
    auxiliarPastasSensiveis = auxiliarPastasSensiveis.replaceAll('\\\\','\\');

    let valorRamdom = parseInt(Math.random() * (20 - 1) + 1, 10);
    let calulo = parseInt(this.state.tempo) + parseInt(valorRamdom);

    const objeto = {
      pasta: auxiliarPastasSensiveis.replaceAll('\\','\\\\'),
      //prazo: this.state.tempo,
      prazo: calulo,
      //senha: this.state.senha,
      //maquina: this.state.maquinaDPO
      maquina: this.state.maquinaLiberacaoDPO
    };

    console.log('OBJ ENVIO');
    console.log(objeto);

    console.log('SENHA DIGITADA: '+ this.state.senha);
    console.log('SENHA RECUPERADA: '+ this.state.senhaAntigaRecuperada);

    if(this.state.senha === this.state.senhaAntigaRecuperada) {

      alert(`LIBERAÇÃO DE ${this.state.tempo} SEGUNDOS`);
      
      DlpController.liberaPasta(objeto).then(resp => {
        console.log(resp);

      }).catch(err => {
        console.log(err);

      });

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
  
      }, 5000);

    }else {
      alert('A SENHA DIGITADA ESTA INCORRETA');

    }

  };

  /* ================== */
  /* === METODO GET === */
  /* ================== */
  findAllTodasPastasDpo = async (maquina) => {
      console.log(`Maquina: ${maquina}`);

      DlpController.getPastasSensiveisByNomeMaquina(maquina)
      .then(response => {

        try {
          console.log('RETORNO ENDPOINT: (GET)');
          console.log(response.data);

          let auxiliar = response.data;

          let meuObjeto = [];

          console.log('AUXILIAR: ')
          console.log(auxiliar)

          if(auxiliar.length > 0) {
            let meuObjeto = [];

            auxiliar.map(item => {
              let pasta = [];
              pasta = item.nome_pasta.replaceAll('\\\\','\\').split(',');

              console.log(`Maquina ENVIO: ${item.maquina}`);
              this.state.maquinaLiberacaoDPO = item.maquina;

              this.setState({ id: item.id });

              pasta.map(p => {
                console.log(p);

                let obj = {
                  id: (meuObjeto.length + 1),
                  pasta: p
                }
    
                meuObjeto.push(obj);

              });

            });

            this.setState({ arrayPastas: meuObjeto });
            this.setState({ maquina: this.state.maquinaDPO });

            if(meuObjeto.length > 0) {
              this.setState({ pastas: meuObjeto[0].pasta }); // INICIAIZA A VARIAVEL
              this.setState({ tempo: 600 }); // INICIAIZA A VARIAVEL
            }

            console.log('PASTAS SENSIVEIS: ');
            console.log(this.state.pastas);

            console.log('MAQUINA SELECIONADA: '+ this.state.maquinaLiberacaoDPO);

          }

        }catch(erro) {
          console.log(erro);
        }
        
        /*let auxiliar = JSON.stringify(response.data[0]).replace('{"nome_pasta":','').replace('}','').replaceAll('"','').split(',');

        let meuObjeto = [];

        if(auxiliar[0] !== '[') {
          auxiliar.map(item => {
            let obj = {
              id: (meuObjeto.length + 1),
              pasta: item.replaceAll('\\\\','\\')
            }

            meuObjeto.push(obj);

          });

          this.setState({ arrayPastas: meuObjeto });
          this.setState({ maquina: this.state.maquinaDPO });

          if(meuObjeto.length > 0) {
            this.setState({ pastas: meuObjeto[0].pasta }); // INICIAIZA A VARIAVEL
            this.setState({ tempo: 10 }); // INICIAIZA A VARIAVEL
          }

          console.log('MEU OBJETO');
          console.log(this.state.arrayPastas);
          
        }*/

      })

  }


  /* =========================================================================================== */
  /* === CARREGA EM UM ARRAY TODAS AS PASTAS CADASTRADAS NO BANCO DE ACORDO COM O DPO LOGADO === */
  /* =========================================================================================== */
  findArrayPastas = async () => {
    DlpController.getPastasSensiveis()
      .then(response => {

        this.setState({ arrayPastas: response.data });
      })
  }

  /* ======================================================== */
  /* === ATUALIZA PERMISSAO DA PASTA SENSIVEL SELECIONADA === */
  /* ======================================================== */
  putPastasSensiveis = async (objeto) => {

    DlpController.putPastasSensiveis(objeto, this.state.id)
      .then(response => console.log(response));

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

    }, 5000);

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
                  <h1 className="titulo-metadados">Pastas Controladas</h1>
                </div>

                {/* CHAMA O METOFO PARA ENVIAR OS DADOS COLETADOS NO FORMULARIO */}
                <form className="row mt-3 ajuste-form" onSubmit={this.handleSubmitPastasSensiveis} >

                  <div className="row col-md-12 inputs">

                    <div className="col-md-12 select">
                      Pastas:
                      <select className="opcoes-select" name="flags" value={this.state.pastas} onChange={this.handleChangePastas}>
                        {this.state.arrayPastas.map((item) => {
                          return (
                            <option value={item.pasta}>{
                              item.pasta
                            }
                            </option>
                          )
                        })}
                      </select>
                    </div>

                    <div className="col-md-12">
                      Tempo:
                      <select className="opcoes-select" name="tempo" value={this.state.tempo} onChange={this.handleChangeTempo} >
                        <option value="35">35 segundos</option>
                        <option value="600">10 minutos</option>
                        <option value="1800">30 minutos</option>
                        <option value="3600">1 hora</option>
                        <option value="28800">8 horas</option>
                      </select>
                    </div>

                    <div className="col-md-12">
                      Senha:
                      <input type="password" className="opcoes-select" value={this.state.senha} onChange={this.handleChangeSenha} />
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

      </div >
    )
  }
}

export default PastasSensiveisLiberacoes
