import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import DlpController from "./controller/DlpController";
import "./css/PainelAdm.css";

const App = () => {

    const [data, setData] = useState([]);
    const [jsonVars, setJsonVars] = useState([]);
    const [jsonNewVars, setJsonNewVars] = useState([]);
    const [jsonVars2, setJsonVars2] = useState([]);
    const [jsonConfig, setJsonConfig] = useState([]);
    const [jsonSensiveis, setJsonSensiveis] = useState([]);
    const [gruposAmbiente, setGruposAmbiente] = useState([]);
    const [grupoAmbiente, setGrupoAmbiente] = useState([]);
    const [ambiente, setAmbiente] = useState([]);
    const [campoJson, setCampoJson] = useState([]);
    const [newParametro, setNewParametro] = useState('');
    const [newValorParametro, setNewValorParametro] = useState('');
    const [newDescricaoParametro, setNewDescricaoParametro] = useState('');
    const [newAmbiente, setNewAmbiente] = useState([]);
    const [array, setArray] = useState([]);
    const [newGroupName, setNewGroupName] = useState('');
    const [admin, setAdmin] = useState(false);
    const [isModalNewClient, setIsModalNewClient] = useState(false);
    const [isModalDeleteClient, setIsModalDeleteClient] = useState(false);
    const [isModalUpdateBD, setIsModalUpdateBD] = useState(false);
    const [isModalAddNewParameter, setIsModalAddNewParameter] = useState(false);

    useEffect(() => {
        testaAdmin();
    }, []);


    /* !  
!  oooooooooooo ooooo     ooo ooooo      ooo   .oooooo.     .oooooo.   oooooooooooo  .oooooo..o 
!  `888'     `8 `888'     `8' `888b.     `8'  d8P'  `Y8b   d8P'  `Y8b  `888'     `8 d8P'    `Y8 
!   888          888       8   8 `88b.    8  888          888      888  888         Y88bo.      
!   888oooo8     888       8   8   `88b.  8  888          888      888  888oooo8     `"Y8888o.  
!   888    "     888       8   8     `88b.8  888          888      888  888    "         `"Y88b 
!   888          `88.    .8'   8       `888  `88b    ooo  `88b    d88'  888       o oo     .d8P 
!  o888o           `YbodP'    o8o        `8   `Y8bood8P'   `Y8bood8P'  o888ooooood8 8""88888P'  
!   */

    const testaAdmin = async () => {
        const tokenGrupo = DlpController.capturaGrupoToken().toString();
        tokenGrupo === "*" ? setAdmin(true) : setAdmin(false);
    };

    const getGruposAmbiente = async (ambiente) => {
        const payload = {
            ambiente: ambiente,
            grupo_dlp_raiz: '',
        };

        DlpController.getGruposDLP(payload)
            .then((response) => {
                let gruposAmbiente = response.data.split(',').sort();
                setGruposAmbiente(gruposAmbiente)
            })
            .catch((e) => {
                alert("Error: Não consegui carregar a lista de grupos para o Ambiente")
            });
    };

    const getDadosGrupo = async (grupoAmbiente) => {
        const payload = {
            ambiente: ambiente,
            grupo_dlp: grupoAmbiente,
            op: 'l'
        };

        DlpController.getCrudCfg(payload)
            .then((response) => {

                let jsonVars2 = JSON.parse(decodeURIComponent(escape(window.atob(response.data.v64_vars2))));
                let jsonVars = JSON.parse(decodeURIComponent(escape(window.atob(response.data.v64_vars))));
                let jsonConfig = response.data.v64_configs;
                let jsonSensiveis = response.data.v64_sensiveis;

                setJsonVars(jsonVars)
                setJsonVars2(jsonVars2)
                setJsonConfig(jsonConfig)
                setJsonSensiveis(jsonSensiveis)

            })
            .catch((e) => {
                alert("Error: Não consegui carregar a lista de grupos para o Ambiente")
            });
    };

    const deleteCliente = async () => {

        if (grupoAmbiente === "default") {
            alert("Não é possível excluir um grupo default");
        } else {
            const payload = {
                ambiente: ambiente,
                grupo_dlp: grupoAmbiente,
                op: 'd'
            };

            DlpController.getCrudCfg(payload)
                .then((response) => {
                    alert(`Grupo ${grupoAmbiente} deletado com sucesso do ambiente ${ambiente}.`)
                    setIsModalDeleteClient(false)
                    window.location.reload()

                })
                .catch((e) => {
                    alert("Error: Não consegui carregar a lista de grupos para o Ambiente")
                    setIsModalDeleteClient(false)
                });
        }
        setIsModalDeleteClient(false)

    };

    const handleInputChangeVars = (e, index) => {
        const { value } = e.target;
        setJsonVars(prevData => {
            const newData = [...prevData];
            newData[index]["Conteúdo Sugerido"] = value;
            return newData;
        });
    };

    const handleInputChangeVars2 = (e, index) => {
        const { value } = e.target;
        setJsonVars2(prevData => {
            const newData = [...prevData];
            newData[index].Valor = value;
            return newData;
        });
    };

    const handleSelectChangeVars2 = (e, index) => {
        const { value } = e.target;
        setJsonVars2(prevData => {
            const newData = [...prevData];
            newData[index].Valor = value;
            return newData;
        });
    };

    const handleUpdateGroup = () => {
        if (grupoAmbiente === "default") {
            alert("Não é possível editar um grupo default.");
        } else {

            let codingVars = JSON.stringify(jsonVars);
            const utf8BytesVars = new TextEncoder().encode(codingVars);
            const codificaV64Vars = btoa(String.fromCharCode(...utf8BytesVars));

            let codingVars2 = JSON.stringify(jsonVars2);
            const utf8BytesVars2 = new TextEncoder().encode(codingVars2);
            const codificaV64Vars2 = btoa(String.fromCharCode(...utf8BytesVars2));

            let payload = "";

            payload = {
                ambiente: ambiente,
                grupo_dlp: grupoAmbiente,
                op: 'g',
                v64_vars: codificaV64Vars,
                v64_vars2: codificaV64Vars2,
                v64_configs: jsonConfig,
                v64_sensiveis: jsonSensiveis
            }

            DlpController.getCrudCfg(payload)
                .then((response) => {
                    alert(`Grupo ${grupoAmbiente} atualizado com sucesso!`);
                })
                .catch((e) => {

                });
        }
    };

    const updateBD = () => {
        if (grupoAmbiente !== 'default') {
            setIsModalUpdateBD(true);
        } else {
            alert('Não é possível atualizar o grupo default.');
        }
    };

    const handlePostGroup = () => {
        const payload = {
            ambiente: ambiente,
            grupo_dlp: grupoAmbiente,
            versao: '',
        }

        DlpController.postGrupoDLP(payload)
            .then((response) => {
                alert(`As alterações do grupo ${grupoAmbiente} foram atualizadas no BD com sucesso!`)
                setIsModalUpdateBD(false);

            })
            .catch((e) => {
                alert(`Não foi possível salvar as alterações do grupo ${grupoAmbiente} no BD.`)
            });
    };

    const getData = async () => {
        const payload = {
            ambiente: DlpController.ambienteAPI(),
            grupo_dlp: 'default',
            op: 'l'
        };

        DlpController.getCrudCfg(payload)
            .then((response) => {

                let arrayCompleto = response.data
                setArray(arrayCompleto)

                let jsonNewVars2 = JSON.parse(decodeURIComponent(escape(window.atob(response.data.v64_vars2))));
                let jsonNewVars = JSON.parse(decodeURIComponent(escape(window.atob(response.data.v64_vars))));

                setData(jsonNewVars2);
                setJsonNewVars(jsonNewVars);

            })
            .catch((e) => {
                alert("Error: Não consegui carregar o Json Default")
            });
    };

    const handleCreateGroup = () => {
        if (newGroupName.trim() === '') {
            alert("Nome do grupo é obrigatório.");
        } else {

            jsonNewVars[0]["Conteúdo Sugerido"] = newGroupName

            let codingVars = JSON.stringify(jsonNewVars);
            const utf8BytesVars = new TextEncoder().encode(codingVars);
            const codificaV64Vars = btoa(String.fromCharCode(...utf8BytesVars));

            let codingVars2 = JSON.stringify(data);
            const utf8BytesVars2 = new TextEncoder().encode(codingVars2);
            const codificaV64Vars2 = btoa(String.fromCharCode(...utf8BytesVars2));

            const payload = {
                ambiente: newAmbiente,
                grupo_dlp: newGroupName,
                op: 'g',
                v64_vars: codificaV64Vars,
                v64_vars2: codificaV64Vars2,
                v64_configs: array.v64_configs,
                v64_sensiveis: array.v64_sensiveis
            }

            DlpController.getCrudCfg(payload)
                .then((response) => {
                    console.log(`Grupo ${newGroupName} criado`);
                })
                .catch((e) => {
                });
        }
    };

    const handleInputNewGroupName = (e) => {
        const value = e.target.value;
        if (/[*_ ]/.test(value)) {
            alert("Não são permitidos os caracteres '*' e '_'");
        } else {
            setNewGroupName(value);
        }
    };

    const handleInputNewChange = (e, index) => {
        const { value } = e.target;
        setData(prevData => {
            const newData = [...prevData];
            newData[index].Valor = value;
            return newData;
        });
    };

    const handleSelectNewChange = (e, index) => {
        const { value } = e.target;
        setData(prevData => {
            const newData = [...prevData];
            newData[index].Valor = value;
            return newData;
        });
    };

    const addNovoParametro = async () => {
        console.clear();

        // LIMPA O ARRAY DE ITENS VAZIOS
        let limparArray = "";
        let indiceParaLimpar = gruposAmbiente.indexOf(limparArray);
        if (indiceParaLimpar !== -1) {
            gruposAmbiente.splice(indiceParaLimpar, 1);
        }

        let gruposComParametro = [];
        let gruposSemParametro = [];

        // Função auxiliar para processar um grupo
        const processarGrupo = async (item) => {
            try {
                const payload = {
                    ambiente: ambiente,
                    grupo_dlp: item,
                    op: 'l'
                };

                const response = await DlpController.getCrudCfg(payload);

                switch (campoJson) {
                    case 'vars':
                        let jsonVarsDecoded = JSON.parse(decodeURIComponent(escape(window.atob(response.data.v64_vars))));
                        const jsonVarsDoValorVerificado = jsonVarsDecoded.find(objeto => objeto["Nome do Parâmetro"] === newParametro);
                        if (jsonVarsDoValorVerificado) {
                            console.log(`%c O parâmetro "${newParametro}" existe no grupo ${item}.`, "background-color: #00FF00 ; color: black ; font-weight: bold");
                            gruposComParametro.push(item);
                        } else {
                            console.log(`%c O parâmetro "${newParametro}" não existe no grupo ${item}.`, "background-color: #FF0000 ; color: black ; font-weight: bold");
                            gruposSemParametro.push(item);

                            // SE O JSON NÃO POSSUIR O PARAMETRO, INCREMENTAR ESTE PARAMETRO NO JSON
                            var novoParametro = {
                                "Mark": ">>",
                                "Nome do Parâmetro": newParametro,
                                "Conteúdo Sugerido": newValorParametro,
                                "Descrição": newDescricaoParametro
                            };
                            jsonVarsDecoded.push(novoParametro);

                            // CODIFICAR NOVAMENTE O JSON
                            let codingVars = JSON.stringify(jsonVarsDecoded);
                            const utf8BytesVars = new TextEncoder().encode(codingVars);
                            const codificaV64Vars = btoa(String.fromCharCode(...utf8BytesVars));

                            // MONTAR NOVO ARRAY PARA ENVIAR AO S3
                            let payload = {
                                ambiente: ambiente,
                                grupo_dlp: item,
                                op: 'g',
                                v64_vars: codificaV64Vars,
                                v64_vars2: response.data.v64_vars2,
                                v64_configs: response.data.v64_configs,
                                v64_sensiveis: response.data.v64_sensiveis,
                            }

                            // SALVA O NOVO ARRAY NO S3
                            DlpController.getCrudCfg(payload)
                                // UTILIZAR O ENDPOINT DE ATUALIZAR O SISTEMA APÓS ENVIAR O PARAMETRO PARA O S3
                                .then((response) => {
                                    const payloadPostGroup = {
                                        ambiente: ambiente,
                                        grupo_dlp: item,
                                        versao: '',
                                    }
                                    DlpController.postGrupoDLP(payloadPostGroup)
                                        .then((response) => {
                                            console.log(`%c As alterações do grupo ${item} foram atualizadas no BD do ambiente ${ambiente} com sucesso!`, "background-color: #ADFF2F ; color: black ; font-weight: bold")
                                        })
                                        .catch((e) => {
                                            console.log(`%c Não foi possível salvar as alterações do grupo ${item} no BD do ambiente ${ambiente}.`, "background-color: #FFA500 ; color: black ; font-weight: bold")
                                        });
                                })
                                .catch((e) => {
                                    console.log("Não consegui carregar o grupo ${item}");
                                });
                        }
                        break;

                    case 'vars2':
                        let jsonVars2Decoded = JSON.parse(decodeURIComponent(escape(window.atob(response.data.v64_vars2))));
                        const jsonVars2DoValorVerificado = jsonVars2Decoded.find(objeto => objeto["Nome"] === newParametro);
                        if (jsonVars2DoValorVerificado) {
                            console.log(`%c O parâmetro "${newParametro}" existe no grupo ${item}.`, "background-color: #00FF00 ; color: black ; font-weight: bold");
                            gruposComParametro.push(item);
                        } else {
                            console.log(`%c O parâmetro "${newParametro}" não existe no grupo ${item}.`, "background-color: #FF0000 ; color: black ; font-weight: bold");
                            gruposSemParametro.push(item);

                            // SE O JSON NÃO POSSUIR O PARAMETRO, INCREMENTAR ESTE PARAMETRO NO JSON
                            var novoParametro = {
                                "Nome": newParametro,
                                "Valor": newValorParametro
                            };
                            jsonVars2Decoded.push(novoParametro);

                            // CODIFICAR NOVAMENTE O JSON
                            let codingVars2 = JSON.stringify(jsonVars2Decoded);
                            const utf8BytesVars2 = new TextEncoder().encode(codingVars2);
                            const codificaV64Vars2 = btoa(String.fromCharCode(...utf8BytesVars2));

                            // MONTAR NOVO ARRAY PARA ENVIAR AO S3
                            let payload = {
                                ambiente: ambiente,
                                grupo_dlp: item,
                                op: 'g',
                                v64_vars: response.data.v64_vars,
                                v64_vars2: codificaV64Vars2,
                                v64_configs: response.data.v64_configs,
                                v64_sensiveis: response.data.v64_sensiveis,
                            }

                            // SALVA O NOVO ARRAY NO S3
                            DlpController.getCrudCfg(payload)
                                // UTILIZAR O ENDPOINT DE ATUALIZAR O SISTEMA APÓS ENVIAR O PARAMETRO PARA O S3
                                .then(() => {
                                    const payloadPostGroup = {
                                        ambiente: ambiente,
                                        grupo_dlp: item,
                                        versao: '',
                                    }
                                    DlpController.postGrupoDLP(payloadPostGroup)
                                        .then(() => {
                                            console.log(`%c As alterações do grupo ${item} foram atualizadas no BD do ambiente ${ambiente} com sucesso!`, "background-color: #ADFF2F ; color: black ; font-weight: bold")
                                        })
                                        .catch(() => {
                                            console.log(`%c Não foi possível salvar as alterações do grupo ${item} no BD do ambiente ${ambiente}.`, "background-color: #FFA500 ; color: black ; font-weight: bold")
                                        });
                                })
                                .catch((e) => {
                                    console.log("Não consegui carregar o grupo ${item}");
                                });
                        }
                        break;

                    case 'config':
                        let jsonConfigsDecoded = JSON.parse(decodeURIComponent(escape(window.atob(response.data.v64_configs))));
                        console.log(jsonConfigsDecoded)

                        for (const objeto of jsonConfigsDecoded) {
                            if (objeto.hasOwnProperty(newParametro)) {
                                console.log(`%c O parâmetro "${newParametro}" existe no grupo ${item}.`, "background-color: #00FF00 ; color: black ; font-weight: bold");
                                gruposComParametro.push(item);
                            } else {
                                console.log(`%c O parâmetro "${newParametro}" não existe no grupo ${item}.`, "background-color: #FF0000 ; color: black ; font-weight: bold");
                                gruposSemParametro.push(item);

                                // SE O JSON NÃO POSSUIR O PARAMETRO, INCREMENTAR ESTE PARAMETRO NO JSON
                                for (let i = 0; i < jsonConfigsDecoded.length; i++) {
                                    jsonConfigsDecoded[i][newParametro] = newValorParametro;
                                }

                                // CODIFICAR NOVAMENTE O JSON
                                let codingConfigs = JSON.stringify(jsonConfigsDecoded);
                                const utf8BytesConfigs = new TextEncoder().encode(codingConfigs);
                                const codificaV64Configs = btoa(String.fromCharCode(...utf8BytesConfigs));

                                // MONTAR NOVO ARRAY PARA ENVIAR AO S3
                                let payload = {
                                    ambiente: ambiente,
                                    grupo_dlp: item,
                                    op: 'g',
                                    v64_vars: response.data.v64_vars,
                                    v64_vars2: response.data.v64_vars2,
                                    v64_configs: codificaV64Configs,
                                    v64_sensiveis: response.data.v64_sensiveis,
                                }

                                // SALVA O NOVO ARRAY NO S3
                                DlpController.getCrudCfg(payload)
                                    // UTILIZAR O ENDPOINT DE ATUALIZAR O SISTEMA APÓS ENVIAR O PARAMETRO PARA O S3
                                    .then((response) => {
                                        const payloadPostGroup = {
                                            ambiente: ambiente,
                                            grupo_dlp: item,
                                            versao: '',
                                        }
                                        DlpController.postGrupoDLP(payloadPostGroup)
                                            .then((response) => {
                                                console.log(`%c As alterações do grupo ${item} foram atualizadas no BD do ambiente ${ambiente} com sucesso!`, "background-color: #ADFF2F ; color: black ; font-weight: bold")
                                            })
                                            .catch((e) => {
                                                console.log(`%c Não foi possível salvar as alterações do grupo ${item} no BD do ambiente ${ambiente}.`, "background-color: #FFA500 ; color: black ; font-weight: bold")
                                            });
                                    })
                                    .catch((e) => {
                                        console.log("Não consegui carregar o grupo ${item}");
                                    });

                            }
                        }
                        break;
                    default:
                        console.log("Selecione um campo JSON");
                }
            } catch (e) {
                console.log(`Não consegui pegar o JSON do S3 para o grupo ${item}`);
            }
        };

        // Executa as operações assíncronas para cada grupo
        await Promise.all(gruposAmbiente.map(async (item, index) => {
            await new Promise(resolve => {
                setTimeout(async () => {
                    await processarGrupo(item);
                    resolve();
                }, index * 350);
            });
        }));

        console.log("Grupos com Parametro");
        console.table(gruposComParametro);
        console.log("================================================");
        console.log("Grupos sem Parametro");
        console.table(gruposSemParametro);
    };

    const procuraParametro = async () => {
        console.clear();

        // LIMPA O ARRAY DE ITENS VAZIOS
        let limparArray = "";
        let indiceParaLimpar = gruposAmbiente.indexOf(limparArray);
        if (indiceParaLimpar !== -1) {
            gruposAmbiente.splice(indiceParaLimpar, 1);
        }

        let gruposComParametro = [];
        let gruposSemParametro = [];

        // Função auxiliar para processar um grupo
        const processarGrupo = async (item) => {
            try {
                const payload = {
                    ambiente: ambiente,
                    grupo_dlp: item,
                    op: 'l'
                };

                const response = await DlpController.getCrudCfg(payload);

                switch (campoJson) {
                    case 'vars':
                        let jsonVarsDecoded = JSON.parse(decodeURIComponent(escape(window.atob(response.data.v64_vars))));
                        const jsonVarsDoValorVerificado = jsonVarsDecoded.find(objeto => objeto["Nome do Parâmetro"] === newParametro);
                        if (jsonVarsDoValorVerificado) {
                            console.log(`%c O parâmetro "${newParametro}" existe no grupo ${item}.`, "background-color: #00FF00 ; color: black ; font-weight: bold");
                            gruposComParametro.push(item);
                        } else {
                            console.log(`%c O parâmetro "${newParametro}" não existe no grupo ${item}.`, "background-color: #FF0000 ; color: black ; font-weight: bold");
                            gruposSemParametro.push(item);
                        }
                        break;

                    case 'vars2':
                        let jsonVars2Decoded = JSON.parse(decodeURIComponent(escape(window.atob(response.data.v64_vars2))));
                        const jsonVars2DoValorVerificado = jsonVars2Decoded.find(objeto => objeto["Nome"] === newParametro);
                        if (jsonVars2DoValorVerificado) {
                            console.log(`%c O parâmetro "${newParametro}" existe no grupo ${item}.`, "background-color: #00FF00 ; color: black ; font-weight: bold");
                            gruposComParametro.push(item);
                        } else {
                            console.log(`%c O parâmetro "${newParametro}" não existe no grupo ${item}.`, "background-color: #FF0000 ; color: black ; font-weight: bold");
                            gruposSemParametro.push(item);
                        }
                        break;

                    case 'config':
                        let jsonConfigsDecoded = JSON.parse(decodeURIComponent(escape(window.atob(response.data.v64_configs))));
                        for (const objeto of jsonConfigsDecoded) {
                            if (objeto.hasOwnProperty(newParametro)) {
                                console.log(`%c O parâmetro "${newParametro}" existe no grupo ${item}.`, "background-color: #00FF00 ; color: black ; font-weight: bold");
                                gruposComParametro.push(item);
                            } else {
                                console.log(`%c O parâmetro "${newParametro}" não existe no grupo ${item}.`, "background-color: #FF0000 ; color: black ; font-weight: bold");
                                gruposSemParametro.push(item);
                            }
                        }
                        break;

                    default:
                        console.log("Aqui é default");
                }
            } catch (e) {
                console.log(`Não consegui pegar o JSON do S3 para o grupo ${item}`);
            }
        };

        // Executa as operações assíncronas para cada grupo
        await Promise.all(gruposAmbiente.map(async (item, index) => {
            await new Promise(resolve => {
                setTimeout(async () => {
                    await processarGrupo(item);
                    resolve();
                }, index * 350);
            });
        }));

        // Imprime os resultados após todas as operações assíncronas
        console.clear();
        console.log("Grupos com Parametro");
        console.table(gruposComParametro);
        console.log("================================================");
        console.log("Grupos sem Parametro");
        console.table(gruposSemParametro);
    };

    const removeParametro = async () => {

        console.clear();

        // LIMPA O ARRAY DE ITENS VAZIOS
        let limparArray = "";
        let indiceParaLimpar = gruposAmbiente.indexOf(limparArray);
        if (indiceParaLimpar !== -1) {
            gruposAmbiente.splice(indiceParaLimpar, 1);
        }

        let gruposComParametro = [];
        let gruposSemParametro = [];

        // Função auxiliar para processar um grupo
        const processarGrupo = async (item) => {
            try {
                const payload = {
                    ambiente: ambiente,
                    grupo_dlp: item,
                    op: 'l'
                };

                const response = await DlpController.getCrudCfg(payload);

                switch (campoJson) {
                    case 'vars':
                        let jsonVarsDecoded = JSON.parse(decodeURIComponent(escape(window.atob(response.data.v64_vars))));
                        const jsonVarsDoValorVerificado = jsonVarsDecoded.find(objeto => objeto["Nome do Parâmetro"] === newParametro);
                        if (jsonVarsDoValorVerificado) {

                            // REMOVE O OBJETO QUE CONTEM O PARAMETRO
                            let jsonVarsFiltered = jsonVarsDecoded.filter(objeto => objeto["Nome do Parâmetro"] !== newParametro);

                            // CODIFICAR NOVAMENTE O JSON
                            let codingVars = JSON.stringify(jsonVarsFiltered);
                            const utf8BytesVars = new TextEncoder().encode(codingVars);
                            const codificaV64Vars = btoa(String.fromCharCode(...utf8BytesVars));

                            // MONTAR NOVO ARRAY PARA ENVIAR AO S3
                            let payload = {
                                ambiente: ambiente,
                                grupo_dlp: item,
                                op: 'g',
                                v64_vars: codificaV64Vars,
                                v64_vars2: response.data.v64_vars2,
                                v64_configs: response.data.v64_configs,
                                v64_sensiveis: response.data.v64_sensiveis,
                            }

                            // SALVA O NOVO ARRAY NO S3
                            DlpController.getCrudCfg(payload)
                                // UTILIZAR O ENDPOINT DE ATUALIZAR O SISTEMA APÓS ENVIAR O PARAMETRO PARA O S3
                                .then((response) => {
        
                                    const payloadPostGroup = {
                                        ambiente: ambiente,
                                        grupo_dlp: item,
                                        versao: '',
                                    }
                                    DlpController.postGrupoDLP(payloadPostGroup)
                                        .then((response) => {
                                            console.log(`%c O parâmetro "${newParametro}" foi removido do grupo ${item}.`, "background-color: #00FF00 ; color: black ; font-weight: bold");
                                            gruposComParametro.push(item);
        
                                        })
                                        .catch((e) => {
                                            console.log(`%cNão foi possível salvar as alterações do grupo ${item} no BD do ambiente ${ambiente}.`, "background-color: #FF0000 ; color: black ; font-weight: bold");
                                        });
                                })
                                .catch(() => {
                                });


                        } else {
                            console.log(`%c O parâmetro "${newParametro}" não existe no grupo ${item}.`, "background-color: #FF0000 ; color: black ; font-weight: bold");
                            gruposSemParametro.push(item);

                        }
                        break;

                    case 'vars2':
                        let jsonVars2Decoded = JSON.parse(decodeURIComponent(escape(window.atob(response.data.v64_vars2))));
                        const jsonVars2DoValorVerificado = jsonVars2Decoded.find(objeto => objeto["Nome"] === newParametro);
                        if (jsonVars2DoValorVerificado) {

                            const parametroIndex = jsonVars2Decoded.findIndex(item => item.Nome === newParametro);

                            if (parametroIndex !== -1) {
                                jsonVars2Decoded.splice(parametroIndex, 1);
                            }

                            // CODIFICAR NOVAMENTE O JSON
                            let codingVars2 = JSON.stringify(jsonVars2Decoded);
                            const utf8BytesVars2 = new TextEncoder().encode(codingVars2);
                            const codificaV64Vars2 = btoa(String.fromCharCode(...utf8BytesVars2));

                            // MONTAR NOVO ARRAY PARA ENVIAR AO S3
                            let payload = {
                                ambiente: ambiente,
                                grupo_dlp: item,
                                op: 'g',
                                v64_vars: response.data.v64_vars,
                                v64_vars2: codificaV64Vars2,
                                v64_configs: response.data.v64_configs,
                                v64_sensiveis: response.data.v64_sensiveis,
                            }

                            // SALVA O NOVO ARRAY NO S3
                            DlpController.getCrudCfg(payload)
                                // UTILIZAR O ENDPOINT DE ATUALIZAR O SISTEMA APÓS ENVIAR O PARAMETRO PARA O S3
                                .then((response) => {
                                    const payloadPostGroup = {
                                        ambiente: ambiente,
                                        grupo_dlp: item,
                                        versao: '',
                                    }
                                    DlpController.postGrupoDLP(payloadPostGroup)
                                        .then((response) => {
                                            console.log(`%c O parâmetro "${newParametro}" foi removido do grupo ${item}.`, "background-color: #00FF00 ; color: black ; font-weight: bold");
                                            gruposComParametro.push(item);
                                        })
                                        .catch((e) => {
                                            console.log(`%cNão foi possível salvar as alterações do grupo ${item} no BD do ambiente ${ambiente}.`, "background-color: #FF0000 ; color: black ; font-weight: bold");
                                        });
                                })
                                .catch((e) => {
                                });
                        } else {
                            console.log(`%c O parâmetro "${newParametro}" não existe no grupo ${item}.`, "background-color: #FF0000 ; color: black ; font-weight: bold");
                            gruposSemParametro.push(item);

                        }
                        break;

                    case 'config':
                        let jsonConfigsDecoded = JSON.parse(decodeURIComponent(escape(window.atob(response.data.v64_configs))));
                        for (const objeto of jsonConfigsDecoded) {
                            if (objeto.hasOwnProperty(newParametro)) {

                                for (let i = 0; i < jsonConfigsDecoded.length; i++) {
                                    if (jsonConfigsDecoded[i].hasOwnProperty(newParametro)) {
                                        delete jsonConfigsDecoded[i][newParametro];
                                    }
                                }
                                // CODIFICAR NOVAMENTE O JSON
                                let codingConfigs = JSON.stringify(jsonConfigsDecoded);
                                const utf8BytesConfigs = new TextEncoder().encode(codingConfigs);
                                const codificaV64Configs = btoa(String.fromCharCode(...utf8BytesConfigs));

                                // MONTAR NOVO ARRAY PARA ENVIAR AO S3
                                let payload = {
                                    ambiente: ambiente,
                                    grupo_dlp: item,
                                    op: 'g',
                                    v64_vars: response.data.v64_vars,
                                    v64_vars2: response.data.v64_vars2,
                                    v64_configs: codificaV64Configs,
                                    v64_sensiveis: response.data.v64_sensiveis,
                                }

                                // SALVA O NOVO ARRAY NO S3
                                DlpController.getCrudCfg(payload)
                                    // UTILIZAR O ENDPOINT DE ATUALIZAR O SISTEMA APÓS ENVIAR O PARAMETRO PARA O S3
                                    .then((response) => {
                                        const payloadPostGroup = {
                                            ambiente: ambiente,
                                            grupo_dlp: item,
                                            versao: '',
                                        }
                                        DlpController.postGrupoDLP(payloadPostGroup)
                                            .then((response) => {
                                                console.log(`%c O parâmetro "${newParametro}" foi removido do grupo ${item}.`, "background-color: #00FF00 ; color: black ; font-weight: bold");
                                                gruposComParametro.push(item);
                                                })
                                            .catch((e) => {
                                                console.log(`%cNão foi possível salvar as alterações do grupo ${item} no BD do ambiente ${ambiente}.`, "background-color: #FF0000 ; color: black ; font-weight: bold");
                                            });
                                    })
                                    .catch((e) => {
                                    }); 


                            } else {
                                console.log(`%c O parâmetro "${newParametro}" não existe no grupo ${item}.`, "background-color: #FF0000 ; color: black ; font-weight: bold");
                                gruposSemParametro.push(item);
                                }
                        }
                        break;

                    default:
                        console.log("Aqui é default");
                }
            } catch (e) {
                console.log(`Não consegui pegar o JSON do S3 para o grupo ${item}`);
            }
        };

        // Executa as operações assíncronas para cada grupo
        await Promise.all(gruposAmbiente.map(async (item, index) => {
            await new Promise(resolve => {
                setTimeout(async () => {
                    await processarGrupo(item);
                    resolve();
                }, index * 350);
            });
        }));

        // Imprime os resultados após todas as operações assíncronas
        console.log("Grupos com Parametro");
        console.table(gruposComParametro);
        console.log("================================================");
        console.log("Grupos sem Parametro");
        console.table(gruposSemParametro);
    };

    const checaGrupoDlpDuplicado = async () => {
        console.clear();

        // LIMPA O ARRAY DE ITENS VAZIOS
        let limparArray = "";
        let indiceParaLimpar = gruposAmbiente.indexOf(limparArray);
        if (indiceParaLimpar !== -1) {
            gruposAmbiente.splice(indiceParaLimpar, 1);
        }

        // Função auxiliar para processar um grupo
        const processarGrupo = async (item, index) => {
            try {
                const payload = {
                    ambiente: ambiente,
                    grupo_dlp: item,
                    op: 'l'
                };

                const response = await DlpController.getCrudCfg(payload);

                let jsonVars2Decoded = JSON.parse(decodeURIComponent(escape(window.atob(response.data.v64_vars))));

                if (jsonVars2Decoded[0]['Conteúdo Sugerido'] === item) {
                    console.log(`%c O grupo  ${item} esta correto.`, "background-color: #00FF00 ; color: black ; font-weight: bold");
                } else {
                    console.log(`%c Grupo ${item} esta com nome ${jsonVars2Decoded[0]['Conteúdo Sugerido']}`, "background-color: #FF0000 ; color: black ; font-weight: bold");
                }

            } catch (e) {
                console.log(`Não consegui pegar o JSON do S3 para o grupo ${item}`);
            }
        };

        // Executa as operações assíncronas para cada grupo
        await Promise.all(gruposAmbiente.map(async (item, index) => {
            await new Promise(resolve => {
                setTimeout(async () => {
                    await processarGrupo(item, index);
                    resolve();
                }, index * 350);
            });
        }));

    };

    return (
        <div className="container">
            {admin ? (
                <>
                    <div className='cabecalho'>
                        <h1>Informações do Cliente no S3</h1>
                        <button className='botoes-salvar' title={"Adiciona novo grupo."} onClick={() => getData() > setIsModalNewClient(true)}><ion-icon name="person-add-outline" /></button>
                        <button className='botoes-salvar' title={"Deleta grupo."} onClick={() => setIsModalDeleteClient(true)}><ion-icon name="trash-outline" /></button>
                        <button className='botoes-salvar' title={"Adiciona novo parâmetro."} onClick={() => setIsModalAddNewParameter(true)}><ion-icon name="enter-outline" /></button>
                        <button className='botoes-salvar' title={"Checa nome do grupo com conteúdo do JSON (apenas no console f12)."} onClick={() => checaGrupoDlpDuplicado()}><ion-icon name="git-compare-outline" /></button>
                    </div>
                    <div className='selects-linha'>
                        <select id='select-ambiente' onChange={(e) => getGruposAmbiente(e.target.value) > setAmbiente(e.target.value)}>
                            <option value="" disabled selected hidden>Selecione o Ambiente</option>
                            <option value="AWSSERVERDEV">Homologação</option>
                            <option value="POCNEW">POC</option>
                            <option value="PROD1">Produção</option>
                            <option value="PROD2">Produção2</option>
                            <option value="WEBINAR">Webinar</option>
                            <option value="TESTE">Teste</option>
                        </select>
                        <select onChange={(e) => getDadosGrupo(e.target.value) > setGrupoAmbiente(e.target.value)}>
                            <option value="" disabled selected hidden>Selecione o grupo</option>
                            {gruposAmbiente.map((opcao, index) => (
                                <option key={index} value={opcao}>
                                    {opcao}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="tabelas-dados">
                        <div>
                            <h1>Dados do cliente</h1>
                            <table className='table-dados'>
                                <thead>
                                    <tr>
                                        <th className='nome-parametro'>Nome</th>
                                        <th className='valor-parametro'>Valor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jsonVars2.map((item, index) => (
                                        item.Nome !== 'newDiscovery' && (
                                            <tr key={index}>
                                                <td className='nome-parametro'>{item.Nome}</td>
                                                <td className='valor-parametro'>
                                                    {item.Nome === 'mapperAtivado' ? (
                                                        <select value={item.Valor} onChange={(e) => handleSelectChangeVars2(e, index)}>
                                                            <option value="0">Não contratado</option>
                                                            <option value="2">Discovery Ativo</option>
                                                            <option value="3">Discovery Scan</option>
                                                        </select>
                                                    ) : (
                                                        <input
                                                            type='text'
                                                            value={item.Valor}
                                                            onChange={(e) => handleInputChangeVars2(e, index)}
                                                        />
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div>
                            <h1>Parametros Gerais</h1>
                            <table className='table-dados'>
                                <thead>
                                    <tr>
                                        <th className='nome-parametro'>Nome</th>
                                        <th className='valor-parametro'>Valor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jsonVars.map((item, index) => (
                                        <tr key={index}>
                                            <td className='nome-parametro'>{item["Nome do Parâmetro"]}</td>
                                            <td className='valor-parametro'>
                                                <input
                                                    type='text'
                                                    value={item["Conteúdo Sugerido"]}
                                                    onChange={(e) => handleInputChangeVars(e, index)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className='botoes'>
                        <button className='botoes-salvar' onClick={() => handleUpdateGroup()}>Salvar Alterações</button>
                        <button className='botoes-salvar' onClick={() => updateBD()} style={{ backgroundColor: '#560bad' }}>Atualizar BD</button>
                        <NavLink className="link" to="/form-elements/configuracoes" activeClassName="active-link">
                            <button className='botoes-salvar'>Voltar</button>
                        </NavLink>
                    </div>

                    {isModalNewClient && (
                        <div className="modal-container">
                            <div className="modal-find-opcoes-tabela">
                                <h1>Criar novo Cliente</h1>
                                <table>
                                    <thead>
                                        <tr>
                                            <th className='nome-parametro'>Nome</th>
                                            <th className='valor-parametro'>Valor</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                Selecione o Ambiente
                                            </td>
                                            <td>
                                                <select id='select-ambiente' required onChange={(e) => setNewAmbiente(e.target.value)}>
                                                    <option value="ambiente" disabled selected hidden>Ambiente</option>
                                                    <option value="AWSSERVERDEV">Homologação</option>
                                                    <option value="POCNEW">POC</option>
                                                    <option value="PROD1">Produção</option>
                                                    <option value="PROD2">Produção2</option>
                                                    <option value="WEBINAR">Webinar</option>
                                                    <option value="TESTE">Teste</option>
                                                </select>
                                            </td>

                                        </tr>
                                        <tr>
                                            <td>
                                                Nome do novo grupo default
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    placeholder="Nome do novo grupo"
                                                    value={newGroupName}
                                                    onChange={handleInputNewGroupName}
                                                    title="Os caracteres '*' , '_' e ' ' não são permitidos"
                                                    required
                                                />
                                            </td>
                                        </tr>
                                        {data.map((item, index) => (
                                            item.Nome !== 'newDiscovery' && (
                                                <tr key={index}>
                                                    <td className='nome-parametro'>{item.Nome}</td>
                                                    <td className='valor-parametro'>
                                                        {item.Nome === 'mapperAtivado' ? (
                                                            <select value={item.Valor} onChange={(e) => handleSelectNewChange(e, index)}>
                                                                <option value="0">Não contratado</option>
                                                                <option value="2">Discovery Ativo</option>
                                                                <option value="3">Discovery Scan</option>
                                                            </select>
                                                        ) : (
                                                            <input
                                                                type='text'
                                                                value={item.Valor}
                                                                onChange={(e) => handleInputNewChange(e, index)}
                                                            />
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        ))}
                                    </tbody>
                                </table>
                                <div className='botoes'>
                                    <button className='botoes-salvar' onClick={() => setIsModalNewClient(false) > handleCreateGroup()}>Criar</button>
                                    <button className='botoes-salvar' onClick={() => setIsModalNewClient(false)}>Cancelar</button>
                                </div >
                            </div >
                        </div >
                    )}

                    {isModalDeleteClient && (
                        grupoAmbiente !== "default" ?
                            (
                                <div className="modal-container">
                                    <div className="modal-find-opcoes-tabela">
                                        <h1>Deletar Cliente</h1>
                                        <p>Você tem certeza que deseja deletar o grupo <b>{grupoAmbiente}</b> do ambiente <b>{ambiente}</b>?</p>
                                        <div className='botoes'>
                                            <button className='botoes-salvar' onClick={() => deleteCliente()}>Sim</button>
                                            <button className='botoes-salvar' onClick={() => setIsModalDeleteClient(false)}>Cancelar</button>
                                        </div >
                                    </div >
                                </div >
                            ) : alert("Não é possível excluir um grupo default")
                    )}

                    {isModalAddNewParameter && (
                        grupoAmbiente !== "default" ?
                            (
                                <div className="modal-container">
                                    <div className="modal-find-opcoes-tabela">
                                        <h1>Novo Parametro</h1>

                                        <div className='selects-linha'>
                                            <select id='select-ambiente' onChange={(e) => getGruposAmbiente(e.target.value) > setAmbiente(e.target.value)}>
                                                <option value="" disabled selected hidden>Selecione o Ambiente</option>
                                                <option value="AWSSERVERDEV">Homologação</option>
                                                <option value="POCNEW">POC</option>
                                                <option value="PROD1">Produção</option>
                                                <option value="PROD2">Produção2</option>
                                                <option value="WEBINAR">Webinar</option>
                                                <option value="TESTE">Teste</option>
                                            </select>
                                        </div>

                                        <div className='selects-linha'>
                                            <select id='select-ambiente' onChange={(e) => getDadosGrupo(e.target.value) > setGrupoAmbiente(e.target.value)}>
                                                <option value="" disabled selected hidden>Selecione o Grupo</option>
                                                {gruposAmbiente.map((opcao, index) => (
                                                    <option key={index} value={opcao}>
                                                        {opcao}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className='selects-linha'>
                                            <select id='select-ambiente' onChange={(e) => setCampoJson(e.target.value)}>
                                                <option value="" disabled selected hidden>Selecione o Campo do Json</option>
                                                <option value="vars">vars (usuário pode editar)</option>
                                                <option value="vars2">vars2 (somente infra pode editar)</option>
                                                <option value="config">Configuração APP</option>
                                            </select>
                                        </div>

                                        <div className='selects-linha'>
                                            <label for="nome">Parametro:</label>
                                            <input type="text" id="nome" name="nome" placeholder="Digite como deve ficar no JSON" onChange={(e) => setNewParametro(e.target.value)} />
                                        </div>

                                        <div className='selects-linha'>
                                            <label for="nome">Valor Inicial:</label>
                                            <input type="text" id="nome" name="nome" placeholder="Digite como deve ficar no JSON" onChange={(e) => setNewValorParametro(e.target.value)} />
                                        </div>

                                        <div className='selects-linha'>
                                            <label for="nome">Descrição do Parametro:</label>
                                            <input type="text" id="nome" name="nome" placeholder="Digite como deve ficar no JSON" onChange={(e) => setNewDescricaoParametro(e.target.value)} />
                                        </div>


                                        <div className='botoes'>
                                            <button className='botoes-salvar' onClick={() => procuraParametro()}>Verificar Parametro</button>
                                            <button className='botoes-salvar' onClick={() => addNovoParametro()}>Cadastrar Parametro</button>
                                            <button className='botoes-salvar' onClick={() => removeParametro()}>Deletar Parametro</button>
                                            <button className='botoes-salvar' onClick={() => setIsModalAddNewParameter(false)}>Cancelar</button>
                                        </div >
                                    </div >
                                </div >
                            ) : alert("Não é possível excluir um grupo default")
                    )}

                    {isModalUpdateBD && (
                        grupoAmbiente !== "default" ?
                            (
                                <div className="modal-container">
                                    <div className="modal-find-opcoes-tabela">
                                        <h1>Atualizar BD</h1>
                                        <p>Você tem certeza que deseja atualizar o Banco de Dados para o grupo <b>{grupoAmbiente}</b> do ambiente <b>{ambiente}</b>?</p>
                                        <div className='botoes'>
                                            <button className='botoes-salvar' onClick={() => handlePostGroup()}>Sim</button>
                                            <button className='botoes-salvar' onClick={() => setIsModalUpdateBD(false)}>Cancelar</button>
                                        </div >
                                    </div >
                                </div >
                            ) : alert("Não é possível atualizar um grupo default")
                    )}

                </>
            ) : (
                <div>
                    <h1>Página não encontrada</h1>
                </div >
            )}
        </div >
    );
};

export default App;
