import React, { useState, useEffect } from 'react';
import {  NavLink } from 'react-router-dom';
import DlpController from "./controller/DlpController";
import "./css/DadosClientes.css";
import { toast } from "react-toastify";

const App = () => {

    const [data, setData] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {

        const payload = {
            ambiente: DlpController.ambienteAPI(),
            grupo_dlp: DlpController.capturaGrupoToken().replace('*', ''),
            op: 'l'
        };

        DlpController.getCrudCfg(payload)
            .then((response) => {
                let jsonAppConfig = JSON.parse(decodeURIComponent(escape(window.atob(response.data.v64_vars2))));
                setData(jsonAppConfig);
            })
            .catch((e) => {
                console.log('Erro ao carregar os dados do grupo.' , e);
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

    const timer = () => {
        setTimeout(() => {
            window.location.reload(true)
        }, 50);
      }
    

    const keyMappings = {
        "nomeCliente": "Nome Cliente",
        "ipCloud": "IP Cloud",
        "portaCloud": "Porta Cloud",
        "portaDlp": "Porta DLP",
        "mapperAtivado": "Ação Discovery",
        "tamMaximoArquivoAnalise": "Tamanho Máx. de Arquivo para analise (bytes)",
        "horasBoot": "Horas Boot",
    };

    return (
        <div className='table-container'>
            <h1>Dados Clientes</h1>
            <table>
                <thead>
                    <tr>
                        <th className='table-nome-parametro'>Nome</th>
                        <th className='table-valor-parametro'>Valor</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        item.Nome !== 'naoTestarDragDrop' && 
                        item.Nome !== 'newDiscovery' && (
                            <tr key={index}>
                                <td className='table-nome-parametro'>{keyMappings[item.Nome] || item.Nome}</td>
                                <td className='table-valor-parametro'>
                                    {item.Nome === 'mapperAtivado'
                                        ? item.Valor === '0'
                                            ? 'Não contratado'
                                            : item.Valor === '2'
                                                ? 'Discovery Ativo'
                                                : item.Valor === '3'
                                                    ? 'Discovery Scan'
                                                    : item.Valor // Se nenhum dos valores corresponder, exiba o valor original
                                        : item.Valor}
                               </td>
                            </tr>
                        )
                    ))}
                </tbody>
            </table>
            <div className='table-botoes'>
                <NavLink className="link" to="/form-elements/configuracoes" activeClassName="active-link">
                    <button className='table-botoes-salvar' onClick={() => timer()}>Voltar</button>
                </NavLink>
            </div>
        </div>
    );
};

export default App;
