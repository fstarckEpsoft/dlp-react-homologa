import React, { Component,Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Spinner from '../app/shared/Spinner';

const Dashboard = lazy(() => import('./dashboard/Dashboard'));
const Buttons = lazy(() => import('./basic-ui/Buttons'));
const Dropdowns = lazy(() => import('./basic-ui/Dropdowns'));
const BasicElements = lazy(() => import('./form-elements/BasicElements'));
const AppConfig = lazy(() => import('./form-elements/AppConfig'));
const ParametrosGerais = lazy(() => import('./form-elements/ParametrosGerais'));
const PalavrasSensiveis = lazy(() => import('./form-elements/PalavrasSensiveis'));
const DadosClientes = lazy(() => import('./form-elements/DadosClientes'));
const AdicionarGrupos = lazy(() => import('./form-elements/AdicionarGrupos'));
const BasicElementsMassa = lazy(() => import('./form-elements/BasicElementsMassa'));
const GrupoDlp = lazy(() => import('./form-elements/GrupoDlp'));
const ExibirGrupoDlp = lazy(() => import('./form-elements/ExibirGrupoDlp'));
const Configuracoes = lazy(() => import('./form-elements/Configuracoes'));
const PainelAdm = lazy(() => import('./form-elements/PainelAdm'));
//const Metadados = lazy(() => import('./form-elements/Metadados'));
//const ExibirMetadados = lazy(() => import('./form-elements/ExibirMetadados'));
//const PastasSensiveis = lazy(() => import('./form-elements/PastasSensiveis'));
//const PastasSensiveisAcessos = lazy(() => import('./form-elements/PastasSensiveisAcessos'));
//const PastasSensiveisLiberacoes = lazy(() => import('./form-elements/PastasSensiveisLiberacoes'));
const ConfiguracoesSensiveis = lazy(() => import('./form-elements/ConfiguracoesSensiveis'));
const BasicTable = lazy(() => import('./tables/BasicTable'));
const Mdi = lazy(() => import('./icons/Mdi'));
const ChartJs = lazy(() => import('./charts/ChartJs'));
const Error404 = lazy(() => import('./error-pages/Error404'));
const Error500 = lazy(() => import('./error-pages/Error500'));
const Login = lazy(() => import('./user-pages/Login'));
const Register1 = lazy(() => import('./user-pages/Register'));

class AppRoutes extends Component {
  render () {

    return (
      <Suspense fallback={<Spinner/>}>
        <Switch>
          <Route exact path="/dashboard" component={ Dashboard } />
          <Route path="/basic-ui/buttons" component={ Buttons } />
          <Route path="/basic-ui/dropdowns" component={ Dropdowns } />
          <Route path="/form-Elements/basic-elements" component={ BasicElements } />
          <Route path="/form-Elements/dados-clientes" component={ DadosClientes } />
          <Route path="/form-Elements/basic-elements-massa" component={ BasicElementsMassa } />
          <Route path="/form-Elements/grupo-dlp" component={GrupoDlp} />
          <Route path="/form-Elements/exibir-grupo-dlp" component={ExibirGrupoDlp} />
          <Route path="/form-Elements/Configuracoes" component={Configuracoes} />
          <Route path="/form-Elements/app-config/" component={ AppConfig } />
          <Route path="/form-Elements/adicionar-grupos/" component={ AdicionarGrupos } />
          <Route path="/form-Elements/parametros-gerais/"  component={ ParametrosGerais } />
          <Route path="/form-Elements/palavras/" component={ PalavrasSensiveis } />
          <Route path="/form-Elements/PainelAdm" component={ PainelAdm } />
          {/* <Route path="/form-Elements/metadados" component={Metadados} /> */}
          {/* <Route path="/form-Elements/exibir-metadados" component={ExibirMetadados} /> */}
          {/* <Route path="/form-Elements/pastas-sensiveis" component={PastasSensiveis} /> */}
          {/* <Route path="/form-Elements/pastas-sensiveis-acessos" component={PastasSensiveisAcessos} /> */}
          {/* <Route path="/form-Elements/pastas-sensiveis-liberacoes" component={PastasSensiveisLiberacoes} /> */}
          <Route path="/form-Elements/configuracoes-sensiveis" component={ConfiguracoesSensiveis} />
          <Route path="/tables/basic-table" component={ BasicTable } />
          <Route path="/icons/mdi" component={ Mdi } />
          <Route path="/charts/chart-js" component={ ChartJs } />
          <Route path="/user-pages/login-1" component={ Login } />
          <Route path="/user-pages/register-1" component={ Register1 } />
          <Route path="/error-pages/error-404" component={ Error404 } />
          <Route path="/error-pages/error-500" component={ Error500 } />

          {/* AO INICIALIZAR A APLICACAO REDIRECIONARA PARA ESSE COMPONENTE INFORMADO */}
          <Redirect to="/form-Elements/Configuracoes" />
        </Switch>
      </Suspense>
    );
  }
}

export default AppRoutes;