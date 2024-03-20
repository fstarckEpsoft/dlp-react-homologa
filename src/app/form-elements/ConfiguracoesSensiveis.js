import React, { useState } from "react";
import axios from "axios";
import DlpController from "./controller/DlpController";
import Button from "react-bootstrap/Button";
import "./css/style.css";

function ConfiguracoesSensiveis() {
  const [nomeMaquina, setNomeMaquina] = useState();
  const [inputList, setInputList] = useState([{ id: "1", dado: "", qtd: "" }]);
  const [teste, setTeste] = useState([]);
  const token = DlpController.capituraToken();
  const grupo_dlp = DlpController.retornaGrupoUsuarioLogado();
  const ambiente = DlpController.ambienteAPI();
  const urlApi = DlpController.urlApiHomolog();

  const selectPalavraSensivel = [
    { id: 1, value: "", text: "Selecione" },
    { id: 2, value: "cpf", text: "Cpf" },
    { id: 3, value: "cnpj", text: "Cnpj" },
    { id: 4, value: "rg", text: "Rg" },
    { id: 5, value: "cc", text: "CC" },
    { id: 6, value: "cnh", text: "Cnh" },
    { id: 7, value: "rne", text: "Rne" },
    { id: 8, value: "titulo_de_eleitor", text: "Titulo de Eleitor" },
    { id: 9, value: "certificado_de_reservista", text: "Certificado de Reservista" },
    { id: 10, value: "pis", text: "Pis" },
    { id: 11, value: "conselho", text: "Conselho" },
    { id: 12, value: "carteira_de_trabalho", text: "Carteira de Trabalho" },
    { id: 13, value: "renavan", text: "Renavan" },

    
  ];

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  const handleMaquinaChange = (e) => {
    setNomeMaquina(e.target.value);
  };

  const handleRemoveClick = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  const handleRemoveClickSaved = (index) => {
    const listTeste = [...teste];
    listTeste.splice(index, 1);
    setTeste(listTeste);
  };

  const handleAddClick = () => {
    setInputList([
      ...inputList,
      { id: inputList.length + 1, dado: "", qtd: "" },
    ]);
  };

  const updateJson = () => {
    let string = stringEnviada();

    let grupoNew = grupo_dlp;
//.replace(/[^0-9]/g,'');
   grupoNew = grupoNew.replace(/\*/g, '');
   //grupoNew = grupoNew.replace(/[^0-9]/g,'');


    let grupoDefault = nomeMaquina;

    //adicionar metadados aqui o endpoint


   // let url = `${urlApi}/api/grupoflash/updatejsonmaquinasgrupo/${string}/${grupoDefault}/${ambiente}/${token}`;
    let url = `${urlApi}/api/metaflash/updatepormetadado/metadadoantigo/${ambiente}/${token}`;



   // https://app.epsoft.com.br:5o01/api/metaflash/updatepormetadado/AQUI_VAI_O_METADADO_ANTIGO/PROD/ZmVsaXBlLmxpbWEtTVRjek4yUTBPVGMzTnpJMk9ESTFNekpoTkRGaU1HUmtPVEprWkdVNFpXVTVZV0V5TVdRNE9XWXlaV1E0WWpJMU5UaGhNREl5TjJGbE9HVTJOVGhoT1E9PV4q




    if (string === "") {
      alert("Nenhum dado informado");
    } else {
      axios.put(url).then((response) => {

      alert("Configurações adicionadas");
        console.log(response.data);
      });
    }
  };

  const getJson = () => {

    let url = `${urlApi}/api/pastasflash/jsonbyname/${grupo_dlp}/${nomeMaquina}/${ambiente}/${token}`;
    let json = "";
    let stringNew = stringEnviada();

    alert(grupo_dlp)
    alert (nomeMaquina)
    alert(ambiente)
    alert(token)
    if (nomeMaquina === '') {
      alert("Digite o nome da máquina a ser buscada");
    } else {
      axios.get(url).then((response) => {
        json = JSON.stringify(response.data);
        console.log(json);
        let jsonTemp = JSON.parse(json);
        
        let novoJson = [];
        // novoJson.push(jsonTemp[0].qtdSensivel);
        // novoJson.push(jsonTemp[0].qtd);

        // console.log(jsonTemp);
        // console.log("novoJson");
        // console.log(novoJson[0].json)
        // console.log(novoJson);
      });
    }
  };

  const stringEnviada = () => {
    let stringCortada = [];
    let stringFormatada = "";

    inputList.map((corte) => stringCortada.push(corte.dado + ":" + corte.qtd));

    stringFormatada = stringCortada.toString().replaceAll(",", "$");

    console.log("String Enviada: " + stringFormatada.toUpperCase());

    if (stringFormatada === ":") {
      //alert("Nenhum dado sensível selecionado");
    } else {
      return stringFormatada.toUpperCase();
    }
  };

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> Configurações Sensíveis </h3>
      </div>
      
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4>Adicionar Dados - Recebimento fluxo de aprovação</h4>
              
              <input
                className="input-sensivel"
                name="maquina"
                placeholder="Digite o Email"
                // value={nomeMaquina}
                onChange={(e) => handleMaquinaChange(e)}
              />
              <input
                className="input-sensivel"
                name="maquina"
                placeholder="Digite o Telefone"
                // value={nomeMaquina}
                onChange={(e) => handleMaquinaChange(e)}
              />
              {/*<button
                type="button"
                class="btn btn-primary"
                onClick={() => getJson()}
              >
                Buscar
              </button>

  */}


              <button
                type="button"
                class="btn btn-primary"
                onClick={() => updateJson()}
              >
                Salvar
              </button>
              {/* <div style={{ marginTop: 20 }}>{JSON.stringify(inputList)}</div> */}
              {/* <div style={{ marginTop: 20 }}>{JSON.stringify(teste)}</div> */}
              {/* <div>{nomeMaquina}</div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfiguracoesSensiveis;
