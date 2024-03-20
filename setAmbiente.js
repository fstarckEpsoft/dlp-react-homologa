import readline from 'readline';
import fs from 'fs';
import inquirer from 'inquirer';

const arquivoPackageJSON = 'package.json';
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function exibirOpcoes() {
  const opcoes = [
    'HOMOLOGACAO',
    'HOMOLOGACAO2',
    'PRODUCAO',
    'PRODUCAO1',
    'PRODUCAO2',
    'DISCOVERYSCAN',
    'POC',
    'WEBINAR',
    'DOCKER'
  ];

  const pergunta = [
    {
      type: 'list',
      name: 'opcaoSelecionada',
      message: 'Escolha um ambiente:',
      choices: opcoes
    }
  ];

  inquirer.prompt(pergunta).then(respostas => {
    console.log('Você selecionou:', respostas.opcaoSelecionada);
    criarArquivoJSON(respostas.opcaoSelecionada);
  });
}

function criarArquivoJSON(nomeAmbiente) {

  let jsonConfig = {
    endereco: '',
    endereco_react:'',
    ambiente_end: '',
    porta: '',
    porta_react: '',
    porta_api: '',
    endereco_localhost: '',
    porta_localhost: ''
  }

  switch (nomeAmbiente) {
    case 'HOMOLOGACAO':
      jsonConfig = {
        endereco:  'https://homologa.epsoft.com.br',
        endereco_react:'https://react.epsoft.com.br',
        endereco_localhost: "http://localhost",
        porta_localhost: "8088",
        ambiente_end: 'AWSSERVERDEV',
        porta: '8088',
        porta_react: '3003',
        porta_api: '5003',
      }
      break;
    case 'HOMOLOGACAO-DOCKER':
      jsonConfig = {
        endereco:  'http://152.70.215.102/',
        endereco_react:'http://152.70.215.102/',
        endereco_localhost: "http://localhost",
        porta_localhost: "8088",
        ambiente_end: 'AWSSERVERDEV',
        porta: '8088',
        porta_react: '3003',
        porta_api: '5003',
      }
      break;
    case 'HOMOLOGACAO2':
      jsonConfig = {
        endereco:  'https://homologa.epsoft.com.br',
        endereco_react:'https://homologa.epsoft.com.br',
        endereco_localhost: "http://localhost",
        porta_localhost: "8089",
        ambiente_end: 'AWSSERVERDEV2',
        porta: '8089',
        porta_react: '3032',
        porta_api: '5003',
      }
      break;
    case 'PRODUCAO':
      jsonConfig = {
        endereco:  'https://dlp.epsoft.com.br',
        endereco_react:'https://dlp.epsoft.com.br',
        endereco_localhost: "http://localhost",
        porta_localhost: "8085",
        ambiente_end: 'PROD',
        porta: '8085',
        porta_react: '3005',
        porta_api: '5002',
      }
      break;
    case 'PRODUCAO1':
      jsonConfig = {
        endereco:  'https://dlp.epsoft.com.br',
        endereco_react:'https://dlp.epsoft.com.br',
        endereco_localhost: "http://localhost",
        porta_localhost: "8015",
        ambiente_end: 'PROD1',
        porta: '8015',
        porta_react: '3020',
        porta_api: '5004',
      }
      break;
    case 'PRODUCAO2':
      jsonConfig = {
        endereco:  'https://dlp.epsoft.com.br',
        endereco_react:'https://dlp.epsoft.com.br',
        endereco_localhost: "http://localhost",
        porta_localhost: "8011",
        ambiente_end: 'PROD2',
        porta: '8011',
        porta_react: '3015',
        porta_api: '5004',
      }
      break;
    case 'DISCOVERYSCAN':
      jsonConfig = {
        endereco:  'https://scan.epsoft.com.br',
        endereco_react:'https://scan.epsoft.com.br',
        endereco_localhost: "http://localhost",
        porta_localhost: "8089",
        ambiente_end: 'DISCOVERYSCAN',
        porta: '8089',
        porta_react: '3037',
        porta_api: '5004',
      }
      break;
    case 'POC':
      jsonConfig = {
        endereco:  'https://dlp.epsoft.com.br',
        endereco_react:'https://dlp.epsoft.com.br',
        endereco_localhost: "http://localhost",
        porta_localhost: "8028",
        ambiente_end: 'POCNEW',
        porta: '8028',
        porta_react: '3006',
        porta_api: '5004',
      }
      break;
    case 'WEBINAR':
      jsonConfig = {
        endereco:  'https://dlp.epsoft.com.br',
        endereco_react:'https://dlp.epsoft.com.br',
        endereco_localhost: "http://localhost",
        porta_localhost: "9797",
        ambiente_end: 'WEBINAR',
        porta: '9797',
        porta_react: '3001',
        porta_api: '5004',
      }
      break;
    default:
      alert("Ambiente invalido")
      break;
  }

  const nomeArquivo = `./src/dataConfig.json`;

  fs.writeFile(nomeArquivo, JSON.stringify(jsonConfig, null, 2), (err) => {
    if (err) {
      console.error('Erro ao editar o arquivo:', err);
    } else {
      console.log(`Arquivo editado com sucesso!`);
      editaArquivoJSON(jsonConfig.porta_react)
    }
    rl.close();
  });
}

function editaArquivoJSON(porta) {

  fs.readFile(arquivoPackageJSON, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo:', err);
      return;
    }

    const json = JSON.parse(data);
    json.scripts.start = `set PORT=${porta} && PORT=${porta} react-scripts start || react-scripts start && node ./server`;
    const novoConteudoJSON = JSON.stringify(json, null, 2);
    fs.writeFile(arquivoPackageJSON, novoConteudoJSON, 'utf8', (err) => {
      if (err) {
        console.error('Erro ao salvar o arquivo:', err);
        return;
      }
      console.log('Arquivo JSON atualizado com sucesso!');

    });
  });
};

exibirOpcoes();
