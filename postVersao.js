/* SCRIPT PARA ATUALIZAR O CÓDIGO DO SERVIDOR DE HOMOLOGAÇÃO COM BASE NA ÚLTIMA VERSÃO DISPONÍVEL LOCALMENTE;
PARA UTILIZAR ESTE CÓDIGO, ALTERE O DRIVE DO SERVIDOR DA SUA MÁQUINA (LINHA 9) E ONDE O CÓDIGO ESTA SALVO 
NA SUA MÁQUINA (LINHA 11);
CASO HAJA ALTERAÇÕES NAS CONFIGURAÇÕES DO AMBIENTE, EDITAR O OBJETO DA LINHA 62 COM OS NOVOS DADOS; */

import fs from 'fs';
import path from 'path';
import moment from 'moment';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const pastaOrigem = process.cwd();
const pastaDestino = 'Y:\\Homologacao-8091-8088\\flash_safe8088\\HOMOLOG\\';
const pastaOrigemBkp = pastaDestino;
const arquivoPackageJSON = 'package.json';
const caminhoData = 'R:\\src\\app\\form-elements\\controller\\DlpController.js';
const arquivosEPastasSelecionados = [
        'src',
        'public',
        'package.json',
        'package-lock.json',
        'README.md',
        'setAmbiente.js' 
/*     'starck.txt',
    'starck' */
];

async function confirmaAcao() {
    try {
        await solicitarConfirmacao();
        criaPastaBkp();
    } catch (erro) {
        console.error('Erro:', erro.message);
    } finally {
        rl.close();
    }
}

function solicitarConfirmacao() {
    return new Promise((resolve, reject) => {
        rl.question('Finalize o processo do REACT no servidor de homologação. Pressione Enter para confirmar', (resposta) => {
            if (resposta === '') {
                resolve();
            } else {
                reject(new Error('Usuário não confirmou a execução da função.'));
            }
        });
    });
}

function criaPastaBkp() {

    const dataHoraAtual = moment();
    const nomeDaPasta = pastaDestino + dataHoraAtual.format('YYMMDD.HHmm');

    fs.mkdir(nomeDaPasta, (erro) => {
        if (erro) {
            console.error('Erro ao criar a pasta:', erro);
            return;
        }
        console.log('Pasta criada com sucesso!');
        bkpArquivos(nomeDaPasta)
            .then(() => {
                console.log('Todos os arquivos foram movidos com sucesso.');
                editarVersaoArquivo();
            })
            .catch(error => {
                console.error('Erro ao fazer backup de arquivos:', error);
            });
    });
}

function bkpArquivos(nomeDaPasta) {
    return new Promise((resolve, reject) => {
        const promises = [];
        
        arquivosEPastasSelecionados.forEach(item => {
            const origem = path.join(pastaOrigemBkp, item);
            const destino = path.join(nomeDaPasta, item);
            
            const promise = new Promise((resolve, reject) => {
                fs.rename(origem, destino, err => {
                    if (err) {
                        reject(`Erro ao mover ${item}: ${err}`);
                    } else {
                        console.log(`${item} movido com sucesso para ${pastaDestino}`);
                        resolve();
                    }
                });
            });
            
            promises.push(promise);
        });
        
        Promise.all(promises)
            .then(() => resolve())
            .catch(error => reject(error));
    });
}

function editarVersaoArquivo() {

    fs.readFile(caminhoData, 'utf8', (err, data) => {
        if (err) {
            console.error('X Erro ao ler o arquivo:', caminhoData);
            return;
        }

        const linhaVersao = data.split('\n').findIndex(line => line.includes('const versao'));

        if (linhaVersao === -1) {
            console.error('X Não foi encontrada a declaração da constante "versao" no arquivo.');
            return;
        }

        const dataHoraAtual = moment().format('YYMMDD.HHmm');

        const novoConteudo = data.replace(/const versao = '[\d.]*'/, `const versao = '${dataHoraAtual}'`);

        fs.writeFile(caminhoData, novoConteudo, 'utf8', err => {
            if (err) {
                console.error('Erro ao escrever no arquivo:', err);
                return;
            }
            console.log('A versão no arquivo foi atualizada para:', dataHoraAtual);
            criarArquivoJSON()
        });
    });
}

function criarArquivoJSON() {

    let jsonConfig = {
        endereco:   'https://homologa.epsoft.com.br',
        endereco_react: 'https://react.epsoft.com.br',
        endereco_localhost: "http://localhost",
        porta_localhost: "8088",
        ambiente_end: 'AWSSERVERDEV',
        porta: '8088',
        porta_react: '3003',
        porta_api: '5003'
    }

    const nomeArquivo = `./src/dataConfig.json`;

    fs.writeFile(nomeArquivo, JSON.stringify(jsonConfig, null, 2), (err) => {
        if (err) {
            console.error('X Erro ao editar o arquivo:', nomeArquivo);
        } else {
            console.log(`> Arquivo editado com sucesso!`);
            editaArquivoJSON(jsonConfig.porta_react)
        }
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
                console.error('X Erro ao salvar o arquivo:', arquivoPackageJSON);
                return;
            }
            console.log('> Arquivo JSON atualizado com sucesso!');
            postArquivos();
        });
    });
};



function postArquivos() {
    arquivosEPastasSelecionados.forEach(item => {
        const origem = path.join(pastaOrigem, item);
        const destino = path.join(pastaDestino, item);

        if (fs.statSync(origem).isDirectory()) {
            copiarPasta(origem, destino);
        } else {
            copiarArquivo(origem, destino);
        }
    });
}

function copiarArquivo(origem, destino) {
    fs.copyFile(origem, destino, err => {
        if (err) {
            console.error(`Erro ao copiar o arquivo ${origem}:`, err);
            return;
        }
        console.log(`Arquivo ${origem} copiado para ${destino}`);
    });
}

function copiarPasta(origem, destino) {
    if (!fs.existsSync(origem)) {
        console.error(`X A pasta de origem ${origem} não existe.`);
        return;
    }

    if (!fs.existsSync(destino)) {
        fs.mkdirSync(destino);
    }

    const arquivos = fs.readdirSync(origem);

    arquivos.forEach(arquivo => {
        const caminhoOrigem = path.join(origem, arquivo);
        const caminhoDestino = path.join(destino, arquivo);

        if (fs.statSync(caminhoOrigem).isDirectory()) {
            copiarPasta(caminhoOrigem, caminhoDestino);
        } else {
            copiarArquivo(caminhoOrigem, caminhoDestino);
        }
    });
}

confirmaAcao();
