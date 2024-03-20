import React, { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import DlpController from "./controller/DlpController";
import "./css/ParametrosGerais.css";
import ModalExclusao from './ModalExclusao';
import { toast } from "react-toastify";

const App = () => {

  const [data, setData] = useState([]);
  const [array, setArray] = useState([]);
  const [isModified, setIsModified] = useState(false);
  const [grupoSelected, setGrupoSelected] = useState('');
  const [flagIndex, setFlagIndex] = useState('');
  const [flagNewValue, setFlagNewValue] = useState([]);
  const [mensageFlagModal, setMensageFlagModal] = useState('');
  const [listaGrupos, setListaGrupos] = useState([]);
  const [isModalSave, setIsModalSave] = useState(false);
  const [isModalChangeFlag, setIsModalChangeFlag] = useState(false);
  const [isModalPost, setIsModalPost] = useState(false);

  const { grupoEdicao } = useParams();
  const ambiente = DlpController.ambiente();

  useEffect(() => {
    setGrupoSelected(localStorage.getItem('Grupo Ativo'));
  }, [grupoEdicao]);

  useEffect(() => {
    if (grupoSelected) {
      getData();
      getGruposDLP();

    }
  }, [grupoSelected]);

  const getData = async () => {

    const payload = {
      ambiente: DlpController.ambienteAPI(),
      grupo_dlp: grupoSelected,
      op: 'l'
    };

    DlpController.getCrudCfg(payload)
      .then((response) => {
        let mapperAtivado = JSON.parse(decodeURIComponent(escape(window.atob(response.data.v64_vars2))));
        mapperAtivado = mapperAtivado[4].Valor

        let jsonAppConfig = JSON.parse(decodeURIComponent(escape(window.atob(response.data.v64_vars))));

        //if (mapperAtivado !== '2') {
 /*        if (true) {
          jsonAppConfig = jsonAppConfig.filter(item => item["Nome do Parâmetro"] !== "exibirDisplayDiscovery");
          jsonAppConfig = jsonAppConfig.filter(item => item["Nome do Parâmetro"] !== "pastasDiscovery");
        } */

        setData(jsonAppConfig);

        let arrayCompleto = response.data
        setArray(arrayCompleto)

      })
      .catch((e) => {
        console.log(e);
        toast.error(`Não foi possível carregar os dados do grupo.`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  const handleInputChange = () => {
    if (!isModified) {
      setIsModified(true);
    }
  };

  const handleSave = () => {

    const keyMappings = {
      "Grupo DLP": 'grupoDlp',
      "Desativa PrintScreen": 'desativaPrintScreen',
      "Impedir Drag and Drop": 'semDragDrop',
      "Quando pegar dados Sensiveis": 'quandoPegarDadosSensiveis',
      "Drivers Permitidos": 'driversPermitidos',
      "Caminhos Proibidos": 'caminhosProibidos',
      "Exibir display Discovery": 'exibirDisplayDiscovery',
      "Pastas Discovery": 'pastasDiscovery',
      "Tamanho Máx do Arquivo (MB)": 'tamMaximoAutorizadoArquivo',
      "Qtd Máx de Arquivos": 'qtMaximaEnvioArquivos',
      "Monitorar Digitação": 'checar_digitacao',
      "Endereço de impressão": "ambienteImpressao",
      "CPF é sensível": 'cpfSensivel',
      "Mensagem Personalizada para Bandeja": 'mensagemPersonalizada'
    };

    const newJson = data.map(item => {
      const newItem = {
        "Mark": ">>",
      };
      for (const key in item) {
        if (keyMappings[key]) {
          newItem[keyMappings[key]] = item[key];
        } else {
          newItem[key] = item[key];
        }
      }
      return newItem;
    });

    setData([...data]);

    newJson[0]['Conteúdo Sugerido'] = `${data[0]['Conteúdo Sugerido']}`



    let dadosCoding = JSON.stringify(newJson);
    const utf8Bytes = new TextEncoder().encode(dadosCoding);
    const codificaV64vars = btoa(String.fromCharCode(...utf8Bytes));

    const payload = {
      ambiente: DlpController.ambienteAPI(),
      grupo_dlp: grupoSelected,
      op: 'g',
      v64_vars: codificaV64vars,
      v64_vars2: array.v64_vars2,
      v64_configs: array.v64_configs,
      v64_sensiveis: array.v64_sensiveis
    };

    DlpController.getCrudCfg(payload)
      .then((response) => {
        console.log("Gravou no S3")
        toast.success(`As alterações do grupo ${grupoSelected} foram salvas com sucesso!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        handleConfirm2()
      })
      .catch((e) => {
        console.log('Erro ao gravar as alterações.', e);
        toast.error(`Não foi possível gravar as alterações`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });

    setIsModified(false);
    setIsModalSave(false);

  };

  const keyMappings = {
    "grupoDlp": "Configurações para o Grupo DLP",
    "desativaPrintScreen": "Uso do PrintScreen",
    "semDragDrop": "Uso do Drag and Drop",
    "quandoPegarDadosSensiveis": "Quando pegar dados Sensiveis",
    "driversPermitidos": "Drivers Permitidos",
    "caminhosProibidos": "Caminhos Proibidos",
    "exibirDisplayDiscovery": "Display Discovery",
    "pastasDiscovery": "Pastas Discovery",
    "tamMaximoAutorizadoArquivo": 'Tamanho Máx do Arquivo (MB)',
    "qtMaximaEnvioArquivos": 'Qtd Máx de Arquivos',
    "checar_digitacao": 'Monitorar Digitação',
    "ambienteImpressao": "Endereço de impressão",
    "cpfSensivel": 'CPF é sensível',
    "mensagemPersonalizada": 'Mensagem Personalizada para Bandeja'
  };

  const transformValue = (value) => {
    return value;
  };

  const handleSelectChange = (index, newValue) => {
    /*     setFlagIndex(index);
        setFlagNewValue(newValue); */

    const updatedData = [...data];
    updatedData[index]['Conteúdo Sugerido'] = newValue;
    setData(updatedData)

    /*    var newFlag = newValue
   
   
       switch (newFlag) {
         case "1":
           setMensageFlagModal("<strong>Mostra aviso</strong>: O usuário irá receber um aviso que está sendo monitorado nas tentativas de vazar dados sensíveis.");
           break;
         case "2":
           setMensageFlagModal("<strong>Mostra aviso</strong>: Na tentativa de vazar dados sensíveis, a ação será cancelada.");
           break;
         case "5":
           setMensageFlagModal("<strong>Monitora dispositivo</strong>: Permite o vazamento de dados sensíveis, porém o usuário será monitorado.");
           break;
         default:
           alert("Ocorreu algum erro na seleção da opção, por favor, tente novamente.");
       } */


    /* setIsModalChangeFlag(true) */
  };

  const changeFlag = () => {
    const updatedData = [...data];
    updatedData[flagIndex]['Conteúdo Sugerido'] = flagNewValue;
    setData(updatedData)

    setIsModalChangeFlag(false)
  };

  const getGruposDLP = async () => {
    const payload = {
      ambiente: DlpController.ambienteAPI(),
      grupo_dlp_raiz: DlpController.getGrupoBasico(),
    }

    try {
      const response = await DlpController.getGruposDLP(payload);
      const listaGrupos = response.data.split(',').filter(item => item !== "");
      console.log(listaGrupos);
      setListaGrupos(listaGrupos);
    } catch (e) {
      console.log('Erro ao carregar a lista de grupos:', e);
      toast.error(`Não foi possível carregar a lista de grupos.`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleCancel = () => {
    setIsModalSave(false);
    setIsModalPost(false);
    /* setIsModalChangeFlag(false); */
  };

  const timer = () => {
    setTimeout(() => {
      window.location.reload(true)
    }, 50);
  };

  const handleChangeGroup = (e) => {
    setGrupoSelected(e);
    localStorage.setItem('Grupo Ativo', e)
  }

/*   const handlePostClick = () => {
    if (grupoSelected) {
      setIsModalPost(true);
    } else {
      alert('Não é possível atualizar o grupo.');
    }
  }; */

  const handleConfirm2 = () => {
    handlePostGroup();
    setIsModalPost(false);
  };

  const handlePostGroup = () => {

    const payload = {
      ambiente: DlpController.ambienteAPI(),
      grupo_dlp: grupoSelected,
      versao: '',
    }

    DlpController.postGrupoDLP(payload)
      .then((response) => {
        toast.success(`As alterações do grupo ${grupoSelected} foram salvas no sistema com sucesso!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      })
      .catch((e) => {
        console.log('Não foi possível salvar as alterações no sistema', e);
        toast.error(`Não foi possível salvar as alterações do grupo ${grupoSelected} no sistema.`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  return (
    <div className="table-container">
      <h1>Parâmetros Gerais</h1>
      {isModified && <span className='table-lembre-salvar'>Existem modificações não salvas</span>}
      <table>
        <thead>
          <tr>
            <th className='table-titulo-parametro'>Nome</th>
            <th className='table-titulo-parametro'>Valor</th>
          </tr>
        </thead>
        <tbody>
          {data.filter(item => item["Nome do Parâmetro"] !== "semDragDrop").map((item, index) => (
            <tr key={index}>
              <td className='table-nome-parametro'>{keyMappings[item['Nome do Parâmetro']]}</td>
              <td className='table-valor-parametro'>
                {item["Nome do Parâmetro"] === "desativaPrintScreen" ? (
                  <select
                    className='table-select'
                    value={item['Conteúdo Sugerido']}
                    onChange={(e) => {
                      handleInputChange();
                      handleSelectChange(index, e.target.value);
                    }}
                  >
                    <option value="0">Liberado</option>
                    <option value="1">Bloqueado</option>
                  </select>
                ) : item["Nome do Parâmetro"] === "impedirDragDrop" ? (
                <select
                  className='table-select'
                  value={item['Conteúdo Sugerido']}
                  onChange={(e) => {
                    handleInputChange();
                    handleSelectChange(index, e.target.value);
                  }}
                >
                  <option value="0">Filma</option>
                  <option value="1">Monitora</option>
                </select>
              ) : item["Nome do Parâmetro"] === "quandoPegarDadosSensiveis" ? (
                  <select
                    className='table-select'
                    value={item['Conteúdo Sugerido']}
                    onChange={(e) => {
                      handleInputChange();
                      handleSelectChange(index, e.target.value);
                    }}

                  >
                    <option value="5">Apenas Monitora</option>
                    <option value="2" disabled={ambiente === "POCNEW"}>Anula Ação</option>
                    <option value="1" disabled={ambiente === "POCNEW"}>Mostra Aviso</option>
                  </select>
                ) : item["Nome do Parâmetro"] === "grupoDlp" ? (
                  <select
                    className='table-select'
                    value={grupoSelected}
                    onChange={(e) => {
                      handleInputChange();
                      handleSelectChange(index, e.target.value)
                      handleChangeGroup(e.target.value);
                    }}
                  >
                    {listaGrupos.map((groupName, index) => (
                      <option key={index} value={groupName}>
                        {groupName}
                      </option>
                    ))}
                  </select>
                ) : item["Nome do Parâmetro"] === "exibirDisplayDiscovery" ? (
                  <select
                    className='table-select'
                    value={item['Conteúdo Sugerido']}
                    onChange={(e) => {
                      handleInputChange();
                      handleSelectChange(index, e.target.value);
                    }}
                  >
                    <option value="1">Exibir na varredura</option>
                    <option value="0">Não Exibir</option>
                  </select>
                ) : item["Nome do Parâmetro"] ===  "semDragDrop" ? (
                  <select
                    className='table-select'
                    value={item['Conteúdo Sugerido']}
                    onChange={(e) => {
                      handleInputChange();
                      handleSelectChange(index, e.target.value);
                    }}
                  >
                    <option value="1">Monitora</option>
                    <option value="0">Bloqueia</option>
                  </select>
                ) :(
                  <input
                    className='table-input'
                    type='text'
                    /* disabled={item["Nome do Parâmetro"] === "grupoDlp"} */
                    value={transformValue(item['Conteúdo Sugerido'])}
                    onChange={(e) => {
                      handleInputChange();
                      //handleSelectChange(index, e.target.value);
                      const modifiedValue = e.target.value.replace(/\\/g, '/');
                      handleSelectChange(index, modifiedValue);
                    }}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='table-botoes'>
        <button className='table-botoes-salvar' onClick={() => handleSave()} >Salvar</button>

        <NavLink className="link" to="/form-elements/configuracoes" activeClassName="active-link">
          <button className='table-botoes-salvar' onClick={() => timer()}>Voltar</button>
        </NavLink>
{/*         <button className='table-botoes-salvar' onClick={handlePostClick} style={{ backgroundColor: '#560bad' }} >Atualizar Sistema</button>
 */}

      </div>
{/*       <ModalExclusao
        isOpen={isModalSave}
        message="Lembre-se de confirmar as configurações na tela de 'Gestão de configuração do DLP'"
        onCancel={handleCancel}
        onConfirm={handleSave}
      /> */}
      <ModalExclusao
        isOpen={isModalChangeFlag}
        /* message={mensageFlagModal} */
        message="Você esta mudando de flag"
        onCancel={handleCancel}
        onConfirm={changeFlag}
      />

{/*       <ModalExclusao
        isOpen={isModalPost}
        message={`Tem certeza que deseja atualizar as configurações do DLP com o grupo ${grupoSelected}?`}
        onCancel={handleCancel}
        onConfirm={handleConfirm2}
      /> */}
    </div>
  );
};

export default App;
