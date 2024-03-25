import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import DlpController from "./controller/DlpController";
import ModalExclusao from './ModalExclusao';
import "./css/PalavrasSensiveis.css";
import { toast } from "react-toastify";

const PalavrasSensiveisTable = () => {
    const [data, setData] = useState([]);
    const [array, setArray] = useState([]);
    const [image, setImage] = useState('');
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [isModified, setIsModified] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalSave, setIsModalSave] = useState(false);
    const [indexDelete, setIndexDelete] = useState('');
    const [grupoSelected, setGrupoSelected] = useState('');
    const [listaGrupos, setListaGrupos] = useState([]);
    const [isModalPost, setIsModalPost] = useState(false);
    const [isModalUploadTemplate, setIsModalUpoadTempate] = useState(false);


    useEffect(() => {
        setGrupoSelected(localStorage.getItem('Grupo Ativo'));
    }, []);

    useEffect(() => {
        if (grupoSelected) {
            getGruposDLP();
            getData();
        }
    }, [grupoSelected]);

    const getData = async () => {
        const payload = {
            ambiente: DlpController.ambienteAPI(),
            grupo_dlp: grupoSelected,
            op: 'l'
        };

        try {
            const response = await DlpController.getCrudCfg(payload);
            const jsonAppConfig = JSON.parse(decodeURIComponent(escape(window.atob(response.data.v64_sensiveis))));
            setArray(response.data);
            setData(jsonAppConfig);
        } catch (e) {
            console.log('Erro ao carregar os dados do grupo.', e);
            toast.error(`Não foi possível carregar os dados do grupo`, {
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

    const handleDragStart = (index) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (index) => {
        if (draggedIndex === null || draggedIndex === index) return;

        const updatedArray = [...data];
        const draggedRow = updatedArray.splice(draggedIndex, 1)[0];
        updatedArray.splice(index, 0, draggedRow);

        setData(updatedArray);
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setIsModified(true);
    };

    const handleSave = async () => {

        setIsModalSave(false);

        const todosValoresDiferentesDeVazio = data.every(objeto =>
            Object.values(objeto).every(valor => typeof valor === 'string' && valor.trim() !== "")
        );

        if (todosValoresDiferentesDeVazio){
        const dadosCoding = JSON.stringify(data);
        const utf8Bytes = new TextEncoder().encode(dadosCoding);
        const codificaV64Sensiveis = btoa(String.fromCharCode(...utf8Bytes));

        const payload = {
            ambiente: DlpController.ambienteAPI(),
            grupo_dlp: grupoSelected,
            op: 'g',
            v64_vars: array.v64_vars,
            v64_vars2: array.v64_vars2,
            v64_configs: array.v64_configs,
            v64_sensiveis: codificaV64Sensiveis
        };

        try {
            await DlpController.getCrudCfg(payload);
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

            handlePostGroup()
        } catch (e) {
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
        }
    } else {
        toast.error(`Por favor, preencha todos os campos.`, {
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

        setIsModified(false);
    };

    const handleDeleteClick = (index) => {
        setIndexDelete(index);
        setIsModalOpen(true);
    };

    const deleteRow = () => {
        const updatedArray = [...data];
        updatedArray.splice(indexDelete, 1);
        setData(updatedArray);
        setIsModified(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setIsModalSave(false);
        setIsModalPost(false);
    };

    const handleConfirm = (index) => {
        deleteRow(index);
        setIsModalOpen(false);
    };

    const handleChange = (index, field, value) => {
        const updatedArray = [...data];
        updatedArray[index][field] = value;
        setData(updatedArray);
        setIsModified(true);
    };

    const handleInputChange = () => {
        if (!isModified) {
            setIsModified(true);
        }
    };

    const addNewRow = () => {
        const newPalavra = {
            palavra: '',
            tipo: '',
            gravidade: 'SERIO',
        };
        setData([...data, newPalavra]);
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
            console.log('Erro ao carregar a lista de grupos.', e);
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
        }, 10);
    };

    const handleSelectChange = (e) => {
        setGrupoSelected(e);
        localStorage.setItem('Grupo Ativo', e)
    }

    /*     const handlePostClick = () => {
            if (grupoSelected) {
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

    const getTemplate = () => {
        const templateUrl = process.env.PUBLIC_URL + '/templateSensiveis.xlsx';
        window.location.href = templateUrl;
    }

    const uploadArchive = async (e) => {
        e.preventDefault();

        if (image && image.name.endsWith('.xlsx')) {
            console.log('Arquivo xlsx selecionado:', image.name);
        } else {
            alert('Por favor, selecione um arquivo do tipo xlsx.');
            setImage(null);
        }
    }

    const onFileUpload = async (grupoDlp) => {
        const formData = new FormData();
        formData.append("file", image);

        console.log(image);

        await DlpController.uploadSensiveis(formData, grupoDlp)
        try {

            DlpController.uploadAws(DlpController.ambienteAPI(), grupoDlp)
            try {
                const payload = {
                    ambiente: DlpController.ambienteAPI(),
                    grupo_dlp: grupoDlp,
                    versao: '',
                }
                DlpController.postGrupoDLP(payload)
                try {
                    console.log("postei sai correndo")
                    setTimeout(() => {
                        window.location.reload(true)
                    }, 500);
                } catch (e) {
                    console.log(e)
                }

            } catch (e) {
                console.log(e)
            }
        } catch (error) {
            console.error('Error uploading the file:', error);
        }
    };

    return (
        <div className='table-container'>
            <h1>Palavras Sensíveis</h1>
            <div className='table-grupo-ativo'>
                <label>Configuração para o grupo: </label>
                <select className='table-select' value={grupoSelected} onChange={(e) => handleSelectChange(e.target.value)}>
                    {listaGrupos.map((grupo) => (
                        <option key={grupo} value={grupo}>
                            {grupo}
                        </option>
                    ))}
                </select>
                <button className="table-botoes-salvar" onClick={() => setIsModalUpoadTempate(true)} style={{ "margin-left": "2vw" }}>Upload Palavras Sensíveis</button>

                {isModified && <span className='table-lembre-salvar'>Existem modificações não salvas</span>}
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Expressão</th>
                        <th>Tipo</th>
                        <th>Gravidade</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((palavra, index) => (
                        <tr
                            key={index}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={() => handleDragOver(index)}
                            onDragEnd={handleDragEnd}
                        >
                            <td className='table-input-palavra'>
                                <input
                                    type="text"
                                    value={palavra.palavra}
                                    onChange={(e) => { handleInputChange(); handleChange(index, 'palavra', e.target.value) }}
                                />
                            </td>
                            <td className='table-input-tipo'>
                                <input
                                    type="text"
                                    value={palavra.tipo}
                                    onChange={(e) => { handleInputChange(); handleChange(index, 'tipo', e.target.value) }}
                                />
                            </td>
                            <td className='table-select-gravidade'>
                                <select
                                    value={palavra.gravidade}
                                    onChange={(e) => { handleInputChange(); handleChange(index, 'gravidade', e.target.value) }}
                                >
                                    <option value="SERIO">Sério</option>
                                    <option value="GRAVE">Grave</option>
                                    <option value="GRAVISSIMO">Gravíssimo</option>
                                </select>
                            </td>
                            <td className='table-bt-acoes'>
                                <button title="Deleta palavra" className='table-bt-del' onClick={() => handleDeleteClick(index)}>
                                    <ion-icon name="trash-outline"></ion-icon>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className='table-botoes'>
                <button className='table-botoes-salvar' onClick={addNewRow}>Adicionar</button>
                <button className='table-botoes-salvar' onClick={() => handleSave()}>Salvar</button>

                <NavLink className="link" to="/form-elements/configuracoes" activeClassName="active-link">
                    <button className='table-botoes-salvar' onClick={() => timer()}>Voltar</button>
                </NavLink>
                {/*                 <button className='table-botoes-salvar' onClick={handlePostClick} style={{ backgroundColor: '#560bad' }} >Atualizar Sistema</button>
 */}
            </div>
            <ModalExclusao
                isOpen={isModalOpen}
                message="Tem certeza de que deseja excluir?"
                onCancel={handleCancel}
                onConfirm={handleConfirm}
            />
            {/*             <ModalExclusao
                isOpen={isModalSave}
                message="Lembre-se de confirmar as configurações na tela de 'Gestão de configuração do DLP'"
                onCancel={handleCancel}
                onConfirm={handleSave}
            /> */}
            {/*             <ModalExclusao
                isOpen={isModalPost}
                message={`Tem certeza que deseja atualizar as configurações do DLP com o grupo ${grupoSelected}?`}
                onCancel={handleCancel}
                onConfirm={handleConfirm2}
            /> */}

            {isModalUploadTemplate && (
                <div className="modal-container">

                    <div className="modal-find-opcoes-tabela atualizar-pesquisa">
                        <div className="divider-modal">
                            <h1>Upload Template</h1>
                        </div>

                        <div>
                            <form onSubmit={uploadArchive}>
                                <input className="input-file" type="file" name="image" id="image" accept=".xlsx" onChange={e => setImage(e.target.files[0])} />
                                <p>Insira um arquivo xlsx com a estrutura do arquivo de template.<br />O nome do arquivo deve ser templateSensiveis.xlsx</p>
                                <button type='submit' className="table-botoes-salvar" onClick={() => { onFileUpload(grupoSelected) }}>Enviar</button>
                            </form>
                        </div>
                        <div className="botoes-modal">
                            <button className="table-botoes-salvar" onClick={() => { getTemplate() }}>Download Template</button>
                            <button className="table-botoes-salvar" onClick={() => { setIsModalUpoadTempate(false) }}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PalavrasSensiveisTable;
