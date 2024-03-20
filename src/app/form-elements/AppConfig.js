import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import DlpController from "./controller/DlpController";
import "./css/AppConfig.css";
import ModalExclusao from './ModalExclusao';
import ModalAlerta from './ModalAlerta';
import { toast } from "react-toastify";


const options = [
  { value: 'Sim', label: 'Sim' },
  { value: 'Não', label: 'Não' }
];

const AppConfig = () => {
  const [data, setData] = useState([]);
  const [array, setArray] = useState([]);
  const [dataExecutavel, setDataExecutavel] = useState([]);
  const [inputData, setInputData] = useState(data);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [isModified, setIsModified] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalSave, setIsModalSave] = useState(false);
  const [isModalDuplicated, setIsModalDuplicated] = useState(false);
  const [isModalClean, setIsModalClean] = useState(false);
  const [indexDelete, setIndexDelete] = useState('');
  const [grupoSelected, setGrupoSelected] = useState('');
  const [grupoToken, setGrupoToken] = useState('');
  const [listaGrupos, setListaGrupos] = useState([]);
  const [isModalPost, setIsModalPost] = useState(false);
  const [isModalConfirmFilma, setIsModalConfirmFilma] = useState(false);

  //const [isDuplicate , setIsDuplicate] = useState('');
  /*   const [modifiedFields, setModifiedFields] = useState([]); */


  useEffect(() => {
    setGrupoSelected(localStorage.getItem('Grupo Ativo'));
  }, []);

  useEffect(() => {
    if (grupoSelected) {
      getExecutavel();
      getGruposDLP();
      getData();
    }
  }, [grupoSelected]);

  useEffect(() => {
    try {
      let tokenGrupo = DlpController.capturaGrupoToken().replace('*', '').toString();
      setGrupoToken(tokenGrupo);
    } catch (e) {
      console.log('Erro ao carregar o grupo token:', e);
      toast.error(`Não foi possível carregar o grupo, tente novamente`, {
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
  }, []);

  const getData = async () => {
    const payload = {
      ambiente: DlpController.ambienteAPI(),
      grupo_dlp: grupoSelected,
      op: 'l'
    };

    DlpController.getCrudCfg(payload)
      .then((response) => {
        let jsonAppConfig = JSON.parse(decodeURIComponent(escape(window.atob(response.data.v64_configs))));
        let arrayCompleto = response.data
        setArray(arrayCompleto)

        let newjsonAppConfig = jsonAppConfig.map(item => {
          const newItem = {};
          newItem.filtroTitulo = item['Filtro título'];
          newItem.executavel = item['Executável (.exe)'];
          newItem.url = item['URL'];
          newItem.acaoEsperada = item['Ação esperada'];
          newItem.permiteColarDadosSensiveis = item['Permite Colar Dados Sensíveis'];
          newItem.impedeColarDados = item['Impede Colar Dados'];
          newItem.impedeCopiar = item['Impede Copiar'];
          newItem.derrubaAplicacao = item['Derruba Aplicação'];
          //newItem.checaDigitacao = item['Monitora Digitação']; //AQUI
          newItem.filma = item['Filma'];
          newItem.impedePrintscreen = item['Impede Print Screen'];
          return newItem;
        });

        const checaDefault = newjsonAppConfig.some(item => item.filtroTitulo === 'CONFIGURAÇÃO DEFAULT');
        if (!checaDefault) {
          newjsonAppConfig = ([
            {
              filtroTitulo: 'CONFIGURAÇÃO DEFAULT',
              executavel: '',
              url: '',
              acaoEsperada: '',
              permiteColarDadosSensiveis: 'Não',
              impedeColarDados: 'Não',
              impedeCopiar: 'Não',
              derrubaAplicacao: 'Não',
              //checaDigitacao: 'Não', //AQUI
              filma: 'Não',
              impedePrintscreen: 'Não'
            },
            ...newjsonAppConfig]);
        }

        console.log("jsonAppConfig");
        console.table(newjsonAppConfig);

        setData(newjsonAppConfig);
        setInputData(newjsonAppConfig);

      })
      .catch((e) => {
        console.log('Erro ao carregar os dados do S3.', e);
        toast.error(`Não foi possível carregar os dados do grupo ${grupoSelected}`, {
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



  const getExecutavel = async () => {

    const payload = {
      grupo_dlp: grupoToken,
    };

    DlpController.getExecutavel(payload)
      .then((response) => {
        let executaveisGrupo = response.data.executaveis.split(',');
        setDataExecutavel(executaveisGrupo)
      })
      .catch((e) => {
        console.log('Erro ao carregar os executaveis.', e);
        toast.error(`Não foi possível carregar a lista de executaveis.`, {
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

  const handleSave = () => {

    const keyMappings = {
      "filtroTitulo": "Filtro título",
      "executavel": "Executável (.exe)",
      "url": "URL",
      "acaoEsperada": "Ação esperada",
      "permiteColarDadosSensiveis": "Permite Colar Dados Sensíveis",
      "impedeColarDados": "Impede Colar Dados",
      "impedeCopiar": "Impede Copiar",
      "derrubaAplicacao": "Derruba Aplicação",
      // "checaDigitacao": "Monitora Digitação", //AQUI
      "filma": "Filma",
      "impedePrintscreen": "Impede Print Screen"
    };

    let newJson = inputData.map(item => {
      const newItem = {
        "Status": "PEND", //ACRESCENTA O STATUS PEND PARA O JSON FICAR IGUAL A PLANILHA TEMPLATE
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

    setData([...inputData]);

    console.log(newJson);
    let dadosCoding = JSON.stringify(newJson);
    const utf8Bytes = new TextEncoder().encode(dadosCoding);
    const codificaV64Configs = btoa(String.fromCharCode(...utf8Bytes));

    const payload = {
      ambiente: DlpController.ambienteAPI(),
      grupo_dlp: grupoSelected,
      op: 'g',
      v64_vars: array.v64_vars,
      v64_vars2: array.v64_vars2,
      v64_configs: codificaV64Configs,
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

        handlePostGroup();
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

    setIsModalSave(false)
    setIsModified(false);
  };

  const handleDelete = () => {
    const updatedInputData = [...inputData];
    updatedInputData.splice(indexDelete, 1);
    setInputData(updatedInputData);
    setIsModified(true);

  };

  const handleDeleteClick = (index) => {
    setIndexDelete(index);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalSave(false);
    setIsModalDuplicated(false);
    setIsModalClean(false);
    setIsModalPost(false);
    setIsModalConfirmFilma(false);
  };

  const handleConfirm = (index) => {
    handleDelete();
    setIsModalOpen(false);
  };

  const handleInsert = () => {
    const newRow = {
      filtroTitulo: '',
      executavel: '',
      url: '',
      acaoEsperada: '',
      permiteColarDadosSensiveis: 'Não',
      impedeColarDados: 'Não',
      impedeCopiar: 'Não',
      derrubaAplicacao: 'Não',
      // checaDigitacao: 'Não', //AQUI
      filma: 'Não',
      impedePrintscreen: 'Não'
    };

    setInputData([...inputData, newRow]);
    setIsModified(true);
  };

  const handleInputChange = (index, key, value) => {
    const updatedInputData = [...inputData];
    updatedInputData[index][key] = value;
    setInputData(updatedInputData);
    if (!isModified) {
      setIsModified(true);
    }

  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
  };

  const handleDrop = (e, destinationIndex) => {
    e.preventDefault();
    const updatedInputData = [...inputData];
    const [draggedItem] = updatedInputData.splice(draggedIndex, 1);
    updatedInputData.splice(destinationIndex, 0, draggedItem);
    setInputData(updatedInputData);
    setDraggedIndex(null);
    setIsModified(true);
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
      toast.error(`Não foi possível carregar a lista de grupos`, {
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

  const timer = () => {
    setTimeout(() => {
      window.location.reload(true)
    }, 50);
  };

  const getOptions = (key) => {
    if (key === 'acaoEsperada') {
      return [
        { value: '', label: 'Segue Flag Geral' },
        { value: 'Flag 5 - Apenas monitora', label: 'Apenas Monitora' },
        { value: 'Flag 1 - Avisa ação com dados sensíveis', label: 'Mostra Aviso' },
        { value: 'Flag 2 - Impede ação com dados sensíveis', label: 'Anula Ação' }
      ];
    } else {
      return options;
    }
  };

  const handleSelectChange = (e) => {
    setGrupoSelected(e);
    localStorage.setItem('Grupo Ativo', e)
  }

  const checaDuplicidade = () => {

    let count = 0;
    let isDuplicated = true

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      count += item.filtroTitulo !== '' ? 1 : 0;
      count += item.executavel !== '' ? 1 : 0;
      count += item.url !== '' ? 1 : 0;
    }

    if (count / data.length != 1) {
      console.log('Existem itens duplicados')
      setIsModalDuplicated(true)
    } else {
      console.log('A lista esta correta')
      checaEmBranco()
    }

    return isDuplicated
  };

  const checaEmBranco = () => {

    let count = 0;
    let isDuplicated = true

    for (let i = 0; i < inputData.length; i++) {
      const item = inputData[i];
      count += item.filtroTitulo == '' ? 1 : 0;
      count += item.executavel == '' ? 1 : 0;
      //count += item.url !== '' ? 1 : 0;
    }

    if (count / inputData.length != 1) {
      console.log('Existem linhas em branco')
      setIsModalClean(true)
    } else {
      console.log('As linhas esta correta')
      handleSave()
    }

    return isDuplicated
  };

  /*   const handlePostClick = () => {
      if (grupoSelected) {
        setIsModalPost(true);
      } else {
        alert('Não é possível atualizar o grupo.');
      }
    }; */

  /*   const handleConfirm2 = () => {
      handlePostGroup();
      setIsModalPost(false);
    }; */

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
    <div id='table-container'>
      <div className='table-grupo-ativo'>
        <label>Configuração para o grupo: </label>
        <select
          className='table-select'
          value={grupoSelected}
          onChange={(e) => handleSelectChange(e.target.value)}
        >
          {listaGrupos.map((grupo) => (
            <option key={grupo} value={grupo}>
              {grupo}
            </option>
          ))}
        </select>
        {isModified && <span className='table-lembre-salvar'>Existem modificações não salvas</span>}
      </div>
      <table>
        <thead>
          <tr>
            <th >Filtro Título</th>
            <th >Executável</th>
            {/* <th >URL</th> */}
            <th >Ação Esperada</th>
            <th >Permite Colar Dados Sensíveis</th>
            <th >Impede Colar Dados</th>
            <th >Impede Copiar</th>
            <th >Derruba Aplicação</th>
            {/*<th >Monitora Digitação</th>*/} {/* AQUI */}
            <th >Filma</th>
            <th >Impede Printscreen</th>
          </tr>
        </thead>
        <tbody>
          {inputData.map((item, index) => (
            <tr
              key={index}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
            >
              <td className='table-td-input'>
                <input
                  type="text"
                  value={item.filtroTitulo}
                  onChange={(e) => { handleInputChange(index, 'filtroTitulo', e.target.value) }}
                  disabled={item.filtroTitulo === 'CONFIGURAÇÃO DEFAULT'}
                />
              </td>

              <td className='table-td-input'>
                <select
                  value={item.executavel}
                  onChange={(e) => { handleInputChange(index, 'executavel', e.target.value) }}
                  className='table-select-executavel'
                >
                  <option value={""}></option>
                  {dataExecutavel.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </td>

              {/*               <td className='table-td-input'>
                <input
                  type="text"
                  value={item.url}
                  onChange={(e) => { handleInputChange(index, 'url', e.target.value) }}
                />
              </td> */}

              {Object.keys(item).slice(3).map((key) => (
                <td key={key} className='table-td-select'>
                  <select
                    value={item[key]}
                    onChange={(e) => {
                      handleInputChange(index, key, e.target.value);
                      if (key === 'filma' && e.target.value === 'Sim') {
                        setIsModalConfirmFilma(true)
                      }
                    }}
                  >
                    {getOptions(key).map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </td>
              ))}
              <td className='table-bt-acoes'>
                <button
                  title="Deleta aplicativo"
                  className='table-bt-del'
                  onClick={() => handleDeleteClick(index)}
                  disabled={item.filtroTitulo === 'CONFIGURAÇÃO DEFAULT'} // Condição para desabilitar
                >
                  <ion-icon name="trash-outline"></ion-icon>
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
      <ModalExclusao
        isOpen={isModalOpen}
        message="Tem certeza de que deseja excluir?"
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
      {/*       <ModalExclusao
        isOpen={isModalSave}
        message="Lembre-se de confirmar as configurações na tela de 'Gestão de configuração do DLP'"
        onCancel={handleCancel}
        onConfirm={handleSave}
      /> */}

      <ModalAlerta
        isOpen={isModalDuplicated}
        message="Existem itens com mais de uma coluna preenchida, por favor verifique e tente novamente."
        onConfirm={handleCancel}
      />
      <ModalAlerta
        isOpen={isModalClean}
        message="Existem linhas sem título ou executável preenchidos, por favor verifique e tente novamente."
        onConfirm={handleCancel}
      />

      {/*       <ModalExclusao
        isOpen={isModalPost}
        message={`Tem certeza que deseja atualizar as configurações do DLP com o grupo ${grupoSelected}?`}
        onCancel={handleCancel}
        onConfirm={handleConfirm2}
      /> */}

      <ModalAlerta
        isOpen={isModalConfirmFilma}
        message={`<strong>Atenção: Consumo de CPU aumenta ao ativar "Filma"</strong> <br><br>

        Ao ativar a opção "Filma", a CPU pode ter um aumento de até 30%. `}
        onConfirm={handleCancel}
      />

      <div className='table-botoes'>
        <button className='table-botoes-salvar' onClick={() => handleInsert()}>Adicionar</button>
        <button className='table-botoes-salvar' onClick={() => checaDuplicidade()}>Salvar</button>

        <NavLink className="link" to="/form-elements/configuracoes" activeClassName="active-link">
          <button className='table-botoes-salvar' onClick={() => timer()}>Voltar</button>
        </NavLink>

        {/*         <button className='table-botoes-salvar' onClick={handlePostClick} style={{ backgroundColor: '#560bad' }} >Atualizar Sistema</button>
 */}
      </div>
    </div>
  );
};

export default AppConfig;
