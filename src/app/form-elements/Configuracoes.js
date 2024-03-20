import React, { useState, useEffect } from 'react';
import DlpController from "./controller/DlpController";
import { NavLink } from 'react-router-dom';
import ModalExclusao from './ModalExclusao';
import "./css/Configuracoes.css";
import { toast } from "react-toastify";

const App = () => {
    const [labelVariable, setLabelVariable] = useState('');
    const [tokenGrupo, setTokenGrupo] = useState('');
    const [listaGrupos, setListaGrupos] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModal2Open, setIsModal2Open] = useState(false);

    useEffect(() => {
        try {
            setTokenGrupo(DlpController.capturaGrupoToken().replace('*', '').toString());
            getGruposDLP(tokenGrupo);

            if (localStorage.getItem('Grupo Ativo')) {
                setLabelVariable(localStorage.getItem('Grupo Ativo'));
            } else {
                localStorage.setItem('Grupo Ativo', DlpController.capturaGrupoToken().replace('*', '').toString());
                setLabelVariable(DlpController.capturaGrupoToken().replace('*', '').toString());
            }

        } catch (e) {
            console.log('Erro ao carregar o grupo DLP:', e);
            toast.error(`Não foi possível carregar o grupo DLP.`, {
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

    const getGruposDLP = async (tokenGrupo) => {

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

    const handleSelectChange = (e) => {
        const value = e.target.value;
        localStorage.setItem('Grupo Ativo', value);
        setLabelVariable(value);
    };

    const handleDeleteGroup = () => {

        const payload = {
            ambiente: DlpController.ambienteAPI(),
            grupo_dlp: labelVariable,
            op: 'd',
        }

        DlpController.getCrudCfg(payload)
            .then((response) => {
                toast.success(`O grupo ${labelVariable} foi deletado com sucesso`, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

                getGruposDLP();
                setLabelVariable(tokenGrupo);
                localStorage.setItem('Grupo Ativo', tokenGrupo);


            })
            .catch((e) => {
                console.log('Não foi possível deletar o grupo:', e);
                toast.error(`Não foi possível deletar o grupo ${labelVariable}.`, {
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

    const handleConfirm = () => {
        handleDeleteGroup();
        setIsModalOpen(false);
    };

    const handleConfirm2 = () => {
        handlePostGroup();
        setIsModal2Open(false);
    };

    const handleDeleteClick = () => {
        if (labelVariable.includes("_")) {
            setIsModalOpen(true);
        } else {
            alert('Não é possível excluir o grupo raiz.');
        }


    };

    const handlePostClick = () => {
        if (labelVariable) {
            setIsModal2Open(true);
        } else {
            alert('Não é possível atualizar o grupo.');
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setIsModal2Open(false);

    };

    const handlePostGroup = () => {

        const payload = {
            ambiente: DlpController.ambienteAPI(),
            grupo_dlp: labelVariable,
            versao: '',
        }

        DlpController.postGrupoDLP(payload)
            .then((response) => {
                toast.success(`As alterações do grupo ${labelVariable} foram salvas no sistema com sucesso!`, {
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
                toast.error(`Não foi possível salvar as alterações do grupo ${labelVariable} no sistema.`, {
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

    const timer = () => {
        setTimeout(() => {
            window.location.reload(true)
        }, 50);
    };

    return (
        <div className='table-container' >
            <h1>Gestão de configuração do DLP</h1>
            <div className='table-existente'>
                <label>Grupo: </label>
                <select onChange={handleSelectChange} value={labelVariable}>
                    {listaGrupos.map((groupName, index) => (
                        <option key={index} value={groupName}>
                            {groupName}
                        </option>
                    ))}
                </select>
            </div>

            <div className='table-botoes div-menuinicial'>

                <NavLink className="link" to="/form-elements/dados-clientes" activeClassName="active-link">
                    <button className='table-botao' onClick={() => timer()}>Visualizar dados clientes</button>
                </NavLink>

                <NavLink className="link" to={`/form-elements/parametros-gerais/`} activeClassName="active-link">
                    <button className='table-botao' onClick={() => timer()}>Parâmetros Gerais</button>
                </NavLink>

                <NavLink className="link" to={`/form-elements/app-config/`} activeClassName="active-link">
                    <button className='table-botao' onClick={() => timer()}>Configurações APP</button>
                </NavLink>

                <NavLink className="link" to={`/form-elements/palavras/`} activeClassName="active-link">
                    <button className='table-botao' onClick={() => timer()}>Palavras Sensíveis</button>
                </NavLink>

                <NavLink className="link" to={`/form-elements/basic-elements-massa/`} activeClassName="active-link">
                    <button className='table-botao' onClick={() => timer()}>Configurar Grupo das máquinas</button>
                </NavLink>

{/*                 <button className='table-botao' onClick={handlePostClick} style={{ backgroundColor: '#560bad' }}>Confirmar os dados editados e atualizar o Sistema</button>
 */}                <button className='table-botao' onClick={handleDeleteClick}>Deletar o grupo DLP que esta sendo editado</button>

                <NavLink className="link" to={`/form-elements/adicionar-grupos/`} activeClassName="active-link">
                    <button className='table-botao' onClick={() => timer()}>Criar novo grupo </button>
                </NavLink>
            </div>

            <ModalExclusao
                isOpen={isModalOpen}
                message={`Tem certeza que deseja deletar o grupo ${labelVariable}?<br />Esta opção não deleta os dados do grupo no sistema`}
                onCancel={handleCancel}
                onConfirm={handleConfirm}
            />

            <ModalExclusao
                isOpen={isModal2Open}
                message={`Tem certeza que deseja atualizar as configurações do DLP com o grupo ${labelVariable}?`}
                onCancel={handleCancel}
                onConfirm={handleConfirm2}
            />

        </div>
    );
};

export default App;
