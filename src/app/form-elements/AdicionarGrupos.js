import React, { useState, useEffect } from 'react';
import "./css/AdicionarGrupos.css";
import DlpController from "./controller/DlpController";
import { NavLink, useParams } from 'react-router-dom';
import ModalExclusao from './ModalExclusao';
import { toast } from "react-toastify";



const App = () => {
    const [newGroupName, setNewGroupName] = useState('');
    const [labelVariable, setLabelVariable] = useState('');
    const [isModalPost, setIsModalPost] = useState(false);
    const [grupoToken, setGrupoToken] = useState('');
    const [data, setData] = useState([]);
    const [array, setArray] = useState([]);
    const [grupoSelected, setGrupoSelected] = useState('');
    const [listaGrupos, setListaGrupos] = useState([]);
    const [isModalSave, setIsModalSave] = useState(false);

    useEffect(() => {
        if (grupoSelected) {
            getData();
            getGruposDLP();
        }
    }, [grupoSelected]);

    useEffect(() => {
        try {
            setGrupoSelected(localStorage.getItem('Grupo Ativo'));
            setLabelVariable(localStorage.getItem('Grupo Ativo'));
            let tokenGrupo = DlpController.capturaGrupoToken().replace('*', '').toString();
            setGrupoToken(tokenGrupo);
        } catch (e) {
            console.log('Erro ao carregar o grupo token:', e);
            toast.error(`Não foi possível carregar o grupo.`, {
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

    const handleInputChange = (e) => {
        const value = e.target.value;
        if (/[*_ ,]/.test(value)) {
            alert("Não são permitidos os caracteres '*' , ',' e '_'");
        } else {
            setNewGroupName(value);
        }
    };

    const getData = async (grupo = labelVariable) => {
        if (grupo.trim() === '') {
            return;
        }

        let payload;
        if (grupoToken === grupo) {
            payload = {
                ambiente: DlpController.ambienteAPI(),
                grupo_dlp: grupo,
                op: 'l'
            }
        } else {
            payload = {
                ambiente: DlpController.ambienteAPI(),
                grupo_dlp: grupo,
                op: 'l'
            }
        }

        DlpController.getCrudCfg(payload)
            .then((response) => {
                let jsonAppConfig = JSON.parse(decodeURIComponent(escape(window.atob(response.data.v64_vars))));
                let arrayCompleto = response.data
                setArray(arrayCompleto)
                setData(jsonAppConfig);
            })
            .catch((e) => {
                console.log('Erro ao carregar o grupo token:', e);
                toast.error(`Não foi possível carregar o grupo.`, {
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

    const getGruposDLP = async () => {

        const payload = {
            ambiente: DlpController.ambienteAPI(),
            grupo_dlp_raiz: DlpController.getGrupoBasico(),
        }

        DlpController.getGruposDLP(payload)
            .then((response) => {
                const listaGrupos = response.data.split(',').filter(item => item !== "")
                console.log(listaGrupos)
                setListaGrupos(listaGrupos)

            })
            .catch((e) => {
                console.log('Erro ao carregar o grupo token:', e);
                toast.error(`Não foi possível carregar o grupo.`, {
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

    const handleCreateGroup = () => {
        /* setIsModalSave(false) */

        if (newGroupName.trim() === '') {
            alert("Nome do grupo é obrigatório");

        } else {

            data[0]['Conteúdo Sugerido'] = `${grupoToken}_${newGroupName}`

            let dadosCoding = JSON.stringify(data);
            const utf8Bytes = new TextEncoder().encode(dadosCoding);
            const codificaV64Vars = btoa(String.fromCharCode(...utf8Bytes));

            let payload = {
                ambiente: DlpController.ambienteAPI(),
                grupo_dlp: `${grupoToken}_${newGroupName}`,
                op: 'g',
                v64_vars: codificaV64Vars,
                v64_vars2: array.v64_vars2,
                v64_configs: array.v64_configs,
                v64_sensiveis: array.v64_sensiveis
            }

            DlpController.getCrudCfg(payload)
                .then((response) => {
                    console.log("Gravou no S3")

                    //window.location.reload(true)

                    toast.success(`Grupo ${grupoToken}_${newGroupName} criado com sucesso!`, {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });

                    setLabelVariable(`${grupoToken}_${newGroupName}`);
                    setNewGroupName('');
                    getGruposDLP();
                    handlePostGroup()
                    localStorage.setItem('Grupo Ativo', `${grupoToken}_${newGroupName}`);


                })
                .catch((e) => {

                    console.log('Erro ao criar o grupo:', e);
                    toast.error('Não foi possível criar o novo grupo.', {
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
        }

    };

    const handleSelectChange = (e) => {
        const value = e.target.value;
        setLabelVariable(value);
        localStorage.setItem('Grupo Ativo', value);
        getData(value)
    };

    const handleCancel = () => {
        setIsModalSave(false);
        setIsModalPost(false);
    };

    const timer = () => {
        setTimeout(() => {
            window.location.reload(true)
        }, 50);
    }

/*     const handlePostClick = () => {
        if (labelVariable) {
            setIsModalPost(true);
        } else {
            alert('Não é possível atualizar o grupo.');
        }
    }; */

/*     const handleConfirm2 = () => {
        handlePostGroup();
        setIsModalPost(false);
    }; */

    const handlePostGroup = () => {

        const payload = {
            ambiente: DlpController.ambienteAPI(),
            grupo_dlp: `${grupoToken}_${newGroupName}`,
            versao: '',
        }

        DlpController.postGrupoDLP(payload)
            .then((response) => {
                toast.success(`As alterações do grupo ${grupoToken}_${newGroupName} foram salvas no sistema com sucesso!`, {
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
                toast.error(`Não foi possível salvar as alterações do grupo ${grupoToken}_${newGroupName} no sistema.`, {
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
        <div className='table-container'>
            <h1>Criar novo grupo</h1>
            <div className='table-existente'>
                <label>A partir do grupo</label>
                <select onChange={handleSelectChange} value={labelVariable}>
                    {listaGrupos.map((groupName, index) => (
                        <option key={index} value={groupName}>
                            {groupName}
                        </option>
                    ))}
                </select>
            </div>
            <div className='table-novo'>
                <label>Novo Grupo: {grupoToken}_</label>
                <input
                    type="text"
                    placeholder="Nome do novo grupo"
                    value={newGroupName}
                    onChange={handleInputChange}
                    title="Os caracteres '*' , '_' e ' ' não são permitidos"
                    required
                />
            </div>
            <div className='table-botoes'>
                <button className='table-botoes-salvar' onClick={() => handleCreateGroup()} >Criar</button>

                <NavLink className="link" to="/form-elements/configuracoes" activeClassName="active-link">
                    <button className='table-botoes-salvar' onClick={() => timer()} >Voltar</button>
                </NavLink>

{/*                 <button className='table-botoes-salvar' onClick={handlePostClick} style={{ backgroundColor: '#560bad' }} >Atualizar Sistema</button>
 */}            </div>

{/*             <ModalExclusao
                isOpen={isModalSave}
                message="Lembre-se de confirmar as configurações na tela de 'Gestão de configuração do DLP'"
                onCancel={handleCancel}
                onConfirm={handleCreateGroup}
            /> */}

{/*             <ModalExclusao
                isOpen={isModalPost}
                message={`Tem certeza que deseja atualizar as configurações do DLP com o grupo ${labelVariable}?`}
                onCancel={handleCancel}
                onConfirm={handleConfirm2}
            /> */}

        </div>
    );
};

export default App;