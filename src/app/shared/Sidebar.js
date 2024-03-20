import React, { Component, useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Collapse } from 'react-bootstrap';
import { Trans } from 'react-i18next';
import './css/Sidebar.css';
import http from '../form-elements/http/http';
import DlpController from '../form-elements/controller/DlpController';

//const [admin, setAdmin] = useState(false);


class Sidebar extends Component {
  state = {};

  toggleMenuState(menuState) {
    if (this.state[menuState]) {
      this.setState({ [menuState]: false });
    } else if (Object.keys(this.state).length === 0) {
      this.setState({ [menuState]: true });
    } else {
      Object.keys(this.state).forEach(i => {
        this.setState({ [i]: false });
      });
      this.setState({ [menuState]: true });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

   testaAdmin() {
    const tokenGrupo = DlpController.capturaGrupoToken().toString();
    //tokenGrupo === "*" ?  setAdmin(true) : setAdmin(false);
    tokenGrupo === "*" ?   this.admin = true : this.admin = false;
  };

   timer() {
    setTimeout(() => {
        window.location.reload(true)
    }, 50);
};



  redirecionarUsuario() {
    window.location.href = http.defaults.baseURL + '/#/configuracoes';
    //window.location.href = 'http://localhost:8080/#/configuracoes';
  }

  redirecionarUsuarioRedes() {
    window.location.href = http.defaults.baseURL + '/#/redes';
    //window.location.href = 'http://localhost:8080/#/configuracoes';
  }

  onRouteChanged() {
    this.testaAdmin();
    document.querySelector('#sidebar').classList.remove('active');
    Object.keys(this.state).forEach(i => {
      this.setState({ [i]: false });
    });

    const dropdownPaths = [
      { path: '/apps', state: 'appsMenuOpen' },
      { path: '/basic-ui', state: 'basicUiMenuOpen' },
      { path: '/form-elements', state: 'formElementsMenuOpen' },
      { path: '/form-Elements/basic-elements-massa', state: 'formElementsMenuMassaOpen' },
      { path: '/form-Elements/grupo-dlp', state: 'formElementsMenuGrupoOpen' },
      { path: '/form-Elements/exibir-grupo-dlp', state: 'formElementsMenuGrupoOpen' },
      { path: '/form-Elements/metadados', state: 'formElementsMenuMetadados' },
      { path: '/form-Elements/exibir-metadados', state: 'formElementsMenuMetadados' },
      { path: '/form-Elements/pastas-sensiveis', state: 'formElementsMenuPastasSensiveis' },
      { path: '/form-Elements/pastas-sensiveis-acessos', state: 'formElementsMenuPastasSensiveis' },
      { path: '/form-Elements/pastas-sensiveis-liberacoes', state: 'formElementsMenuPastasSensiveis' },
      { path: '/form-Elements/liberacoes', state: 'formElementsMenuLiberacoes' },
      { path: '/form-Elements/configuracoes-sensiveis', state: 'formElementsMenuOpenSensiveis' },
      { path: '/tables', state: 'tablesMenuOpen' },
      { path: '/icons', state: 'iconsMenuOpen' },
      { path: '/charts', state: 'chartsMenuOpen' },
      { path: '/user-pages', state: 'userPagesMenuOpen' },
      { path: '/error-pages', state: 'errorPagesMenuOpen' },
    ];

    dropdownPaths.forEach((obj => {
      if (this.isPathActive(obj.path)) {
        this.setState({ [obj.state]: true })
      }

    }));

  }
  render() {
    try {
      if (true) {
        return (
          <nav className="sidebar sidebar-offcanvas" id="sidebar">
            <div className="text-center sidebar-brand-wrapper d-flex align-items-center">
              <div className="sidebar-brand brand-logo" id='brand-logo'><img src={require("../../assets/images/H - DLP - LOGO.png")} alt="logo" /></div>
              <div className="sidebar-brand brand-logo-mini" ><img src={require("../../assets/images/H - DLP - LOGO.png")} alt="logo" /></div>
            </div>
            <ul className="nav">
              <li className="nav-item nav-profile not-navigation-link">
                {/*<div className="nav-link">
              <Dropdown>
                <Dropdown.Toggle className="nav-link user-switch-dropdown-toggler p-0 toggle-arrow-hide bg-transparent border-0 w-100">
                  <div className="text-wrapper">
                      <p className="profile-name">Bem-vindo</p>
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu className="preview-list navbar-dropdown">
                  <Dropdown.Item className="dropdown-item p-0 preview-item d-flex align-items-center" href="!#" onClick={evt =>evt.preventDefault()}>
                    <div className="d-flex">
                      <div className="py-3 px-4 d-flex align-items-center justify-content-center">
                        <i className="mdi mdi-bookmark-plus-outline mr-0"></i>
                      </div>
                      <div className="py-3 px-4 d-flex align-items-center justify-content-center border-left border-right">
                        <i className="mdi mdi-account-outline mr-0"></i>
                      </div>
                      <div className="py-3 px-4 d-flex align-items-center justify-content-center">
                        <i className="mdi mdi-alarm-check mr-0"></i>
                      </div>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center text-small" onClick={evt =>evt.preventDefault()}>
                    <Trans>Manage Accounts</Trans>
                  </Dropdown.Item>
                  <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center text-small" onClick={evt =>evt.preventDefault()}>
                    <Trans>Change Password</Trans>
                  </Dropdown.Item>
                  <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center text-small" onClick={evt =>evt.preventDefault()}>
                    <Trans>Check Inbox</Trans>
                  </Dropdown.Item>
                  <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center text-small" onClick={evt =>evt.preventDefault()}>
                    <Trans>Sign Out</Trans>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>*/}
                <div className="bem-vindo">
                  <div className="text-wrapper">
                    <p className="profile-name">Bem-vindo</p>
                  </div>
                </div>
              </li>


              {/*
          <li className={ this.isPathActive('/dashboard') ? 'nav-item active' : 'nav-item' }>
            <Link className="nav-link" to="/dashboard">
              <i className="mdi mdi-television menu-icon"></i>
              <span className="menu-title"><Trans>Dashboard - Dados</Trans></span>
            </Link>
          </li>
          */}


              <li className={this.isPathActive('/form-elements/configuracoes') ? 'nav-item active' : 'nav-item'} >
                <Link className="nav-link" to="/form-elements/configuracoes">
                  <i className="mdi mdi-television menu-icon"></i>
                  <span className="menu-title" onClick={() => this.timer()}><Trans>Configurações de Grupo</Trans></span>
                </Link>
              </li>

              { this.admin && (
                <li className={'nav-item'} >
                  <Link className="nav-link" to="/form-elements/painelAdm">
                    <i className="mdi mdi-television menu-icon"></i>
                    <span className="menu-title" onClick={() => this.timer()}><Trans>Painel Admin</Trans></span>
                  </Link>
                </li>
              )}

              {/* 
          <li className={ this.isPathActive('/form-elements/dados-clientes') ? 'nav-item active' : 'nav-item' }>
            <Link className="nav-link" to="/form-elements/dados-clientes">
              <i className="mdi mdi-television menu-icon"></i>
              <span className="menu-title"><Trans>Dados Clientes</Trans></span>
            </Link>
          </li>

          <li className={ this.isPathActive('/form-elements/parametros-gerais') ? 'nav-item active' : 'nav-item' }>
            <Link className="nav-link" to="/form-elements/parametros-gerais">
              <i className="mdi mdi-television menu-icon"></i>
              <span className="menu-title"><Trans>Parametros Gerais</Trans></span>
            </Link>
          </li>

          <li className={ this.isPathActive('/form-elements/app-config') ? 'nav-item active' : 'nav-item' }>
            <Link className="nav-link" to="/form-elements/app-config">
              <i className="mdi mdi-television menu-icon"></i>
              <span className="menu-title"><Trans>Configuração de App</Trans></span>
            </Link>
          </li>

          <li className={ this.isPathActive('/form-elements/palavras') ? 'nav-item active' : 'nav-item' }>
            <Link className="nav-link" to="/form-elements/palavras">
              <i className="mdi mdi-television menu-icon"></i>
              <span className="menu-title"><Trans>Palavras Sensíveis</Trans></span>
            </Link>
          </li>

          <li className={ this.isPathActive('/form-elements/adicionar-grupos') ? 'nav-item active' : 'nav-item' }>
            <Link className="nav-link" to="/form-elements/adicionar-grupos">
              <i className="mdi mdi-television menu-icon"></i>
              <span className="menu-title"><Trans>Adicionar Grupos</Trans></span>
            </Link>
          </li>

          <div className='divider'></div> */}

              {/*               <li className={this.isPathActive('/form-elements/basic-elements') ? 'nav-item active' : 'nav-item'}>
                <Link className="nav-link" to="/form-elements/basic-elements">
                  <i className="mdi mdi-television menu-icon"></i>
                  <span className="menu-title"><Trans>Configuração de máquina</Trans></span>
                </Link>
              </li> */}

              {/*               <li className={this.isPathActive('/form-Elements/basic-elements-massa') ? 'nav-item active' : 'nav-item'}>
                <Link className="nav-link" to="/form-Elements/basic-elements-massa">
                  <i className="mdi mdi-television menu-icon"></i>
                  <span className="menu-title"><Trans>Configuração em massa</Trans></span>
                </Link>
              </li> 

              {/*           <li className={ this.isPathActive('/form-Elements/exibir-grupo-dlp') ? 'nav-item active' : 'nav-item' }>
            <Link className="nav-link" to="/form-Elements/exibir-grupo-dlp">
              <i className="mdi mdi-television menu-icon"></i>
              <span className="menu-title"><Trans>Exibir grupos DLP</Trans></span>
            </Link>
          </li> */}

              {/*<li className={this.isPathActive('/form-Elements/grupo-dlp') ? 'nav-item active' : 'nav-item'}>
            <Link className={this.state.formElementsMenuGrupoOpen ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('formElementsMenuGrupoOpen')} data-toggle="collapse">
              <i className="mdi mdi-format-list-bulleted menu-icon"></i>
              <span className="menu-title"><Trans>Configuração grupo DLP</Trans></span>
              <i className="menu-arrow"></i>
            </Link>
            <Collapse in={this.state.formElementsMenuGrupoOpen}>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={this.isPathActive('/form-Elements/grupo-dlp') ? 'nav-link active' : 'nav-link'} to="/form-Elements/grupo-dlp"><Trans>Criar grupo DLP</Trans></Link></li>
                <li className="nav-item"> <Link className={this.isPathActive('/form-Elements/exibir-grupo-dlp') ? 'nav-link active' : 'nav-link'} to="/form-Elements/exibir-grupo-dlp"><Trans>Exibir grupos DLP</Trans></Link></li>
              </ul>
            </Collapse>
          </li> */}

              {/*           <li className='nav-item'>
            <Link onClick={ () => this.redirecionarUsuario() } className='nav-link'>
              <i className="mdi mdi-format-list-bulleted menu-icon"></i>
              <span className="menu-title"><Trans>Painel Configurações</Trans></span>
              <i className="menu-arrow"></i>
            </Link>
          </li> */}

              <li className='nav-item'>
                <Link onClick={() => this.redirecionarUsuarioRedes()} className='nav-link'>
                  <i className="mdi mdi-format-list-bulleted menu-icon"></i>
                  <span className="menu-title"><Trans>Voltar</Trans></span>
                </Link>
              </li>

              {/*               <li className={this.isPathActive('/form-elements/PainelAdm') ? 'nav-item active' : 'nav-item'} >
                <Link className="nav-link" to="/form-elements/PainelAdm">
                  <i className="mdi mdi-television menu-icon"></i>
                  <span className="menu-title">Administrador</span>
                </Link>
              </li> */}


              {/*   LINK PARA CONFIGURAÇÃO DE MÁQUINAS COM SUBMENU DE ABRIR
          <li className={ this.isPathActive('/form-elements') ? 'nav-item active' : 'nav-item' }>
            <div className={ this.state.formElementsMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('formElementsMenuOpen') } data-toggle="collapse">
              <i className="mdi mdi-format-list-bulleted menu-icon"></i>
              <span className="menu-title"><Trans>Configuração Máquina</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={ this.state.formElementsMenuOpen }>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={ this.isPathActive('/form-elements/basic-elements') ? 'nav-link active' : 'nav-link' } to="/form-elements/basic-elements"><Trans>Abrir</Trans></Link></li>
              </ul>
            </Collapse>
          </li>*/}



              {/*   LINK PARA CONFIGURAÇÃO DE MÁQUINAS EM MASSA COM SUBMENU DE ABRIR
          <li className={ this.isPathActive('/form-Elements/basic-elements-massa') ? 'nav-item active' : 'nav-item' }>
            <div className={ this.state.formElementsMenuMassaOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('formElementsMenuMassaOpen') } data-toggle="collapse">
              <i className="mdi mdi-format-list-bulleted menu-icon"></i>
              <span className="menu-title"><Trans>Configuração em Massa</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={ this.state.formElementsMenuMassaOpen }>
              <ul className="nav flex-column sub-menu">
                 {/*  no item to -> e resposavel por apontar para o endpoint que servira por rotear para a pagina correta 
                <li className="nav-item"> <Link className={ this.isPathActive('/form-Elements/basic-elements-massa/basic-elements') ? 'nav-link active' : 'nav-link' } to="/form-Elements/basic-elements-massa/basic-elements-massa"><Trans>Abrir</Trans></Link></li>
              </ul>
            </Collapse>
          </li>*/}



              {/* <li className={this.isPathActive('/form-Elements/metadados') ? 'nav-item active' : 'nav-item'}>
            <div className={this.state.formElementsMenuMetadados ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('formElementsMenuMetadados')} data-toggle="collapse">
              <i className="mdi mdi-format-list-bulleted menu-icon"></i>
              <span className="menu-title"><Trans>Configuração Metadados</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={this.state.formElementsMenuMetadados}>
              <ul className="nav flex-column sub-menu"> */}
              {/* no item to -> e resposavel por apontar para o endpoint que servira por rotear para a pagina correta */}
              {/* <li className="nav-item"> <Link className={this.isPathActive('/form-Elements/metadados') ? 'nav-link active' : 'nav-link'} to="/form-Elements/metadados"><Trans>Metadados</Trans></Link></li>
                <li className="nav-item"> <Link className={this.isPathActive('/form-Elements/exibir-metadados') ? 'nav-link active' : 'nav-link'} to="/form-Elements/exibir-metadados"><Trans>Exibir Metadados</Trans></Link></li>
              </ul>
            </Collapse>
          </li> */}


              {/* <li className={this.isPathActive('/form-Elements/pastas-sensiveis') ? 'nav-item active' : 'nav-item'}>
            <div className={this.state.formElementsMenuPastasSensiveis ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('formElementsMenuPastasSensiveis')} data-toggle="collapse">
              <i className="mdi mdi-format-list-bulleted menu-icon"></i>
              <span className="menu-title"><Trans>Pastas Controladas</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={this.state.formElementsMenuPastasSensiveis}>
              <ul className="nav flex-column sub-menu"> */}
              {/* no item to -> e resposavel por apontar para o endpoint que servira por rotear para a pagina correta */}
              {/* <li className="nav-item"> <Link className={this.isPathActive('/form-Elements/pastas-sensiveis') ? 'nav-link active' : 'nav-link'} to="/form-Elements/pastas-sensiveis"><Trans>Cadastro</Trans></Link></li>
                <li className="nav-item"> <Link className={this.isPathActive('/form-Elements/pastas-sensiveis-acessos') ? 'nav-link active' : 'nav-link'} to="/form-Elements/pastas-sensiveis-acessos"><Trans>Acessos</Trans></Link></li>
                <li className="nav-item"> <Link className={this.isPathActive('/form-Elements/pastas-sensiveis-liberacoes') ? 'nav-link active' : 'nav-link'} to="/form-Elements/pastas-sensiveis-liberacoes"><Trans>Liberações</Trans></Link></li>
                </ul>
                </Collapse>
              </li> */}

              {/* <li className='nav-item'>
            <Link className="nav-link" to="/form-Elements/liberacoes">
            <i className="mdi mdi-television menu-icon"></i>
            <span className="menu-title"><Trans>Liberações</Trans></span>
            </Link>
            </li>
            
            <li className='nav-item'>
            <Link className="nav-link" to="/form-Elements/configuracoes-sensiveis">
            <i className="mdi mdi-television menu-icon"></i>
            <span className="menu-title"><Trans>Configurações Sensíveis</Trans></span>
            </Link>
            </li>
          */}


              {/*<li className={ this.isPathActive('/tables') ? 'nav-item active' : 'nav-item' }>
            <div className={ this.state.tablesMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('tablesMenuOpen') } data-toggle="collapse">
              <i className="mdi mdi-table-large menu-icon"></i>
              <span className="menu-title"><Trans>Tabelas - Exemplos</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={ this.state.tablesMenuOpen }>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={ this.isPathActive('/tables/basic-table') ? 'nav-link active' : 'nav-link' } to="/tables/basic-table"><Trans>Basic Table</Trans></Link></li>
              </ul>
            </Collapse>
          </li>
          
          <li className={ this.isPathActive('/charts') ? 'nav-item active' : 'nav-item' }>
            <div className={ this.state.chartsMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('chartsMenuOpen') } data-toggle="collapse">
              <i className="mdi mdi-chart-line menu-icon"></i>
              <span className="menu-title"><Trans>Dashboards - Dados 2</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={ this.state.chartsMenuOpen }>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={ this.isPathActive('/charts/chart-js') ? 'nav-link active' : 'nav-link' } to="/charts/chart-js">Acessar</Link></li>
              </ul>
            </Collapse>
          </li>
        */}

              {/*<li className="nav-item">
            <a className="nav-link" href="https://epsoft.com.br" rel="noopener noreferrer" target="_blank">
              <i className="mdi mdi-file-outline menu-icon"></i>
              <span className="menu-title"><Trans>Documentação</Trans></span>
            </a>
          </li>*/}


            </ul>

          </nav>
        );
      } else {
        return (
          <nav className="sidebar sidebar-offcanvas" id="sidebar">
            <div className="text-center sidebar-brand-wrapper d-flex align-items-center">
              <div className="sidebar-brand brand-logo" ><img src={require("../../assets/images/logoho.png")} alt="logo" /></div>
              <div className="sidebar-brand brand-logo-mini" ><img src={require("../../assets/images/vertical_PB_DLP.svg")} alt="logo" /></div>
              {/* <div className="sidebar-brand brand-logo" ><img src={require("../../assets/images/horizontal_PB_DLP.svg")} alt="logo" /></div>
            <div className="sidebar-brand brand-logo-mini" ><img src={require("../../assets/images/vertical_PB_DLP.svg" )} alt="logo" /></div>*/}
            </div>
            <ul className="nav">
              {/*<li className="nav-item nav-profile not-navigation-link">
              <div className="nav-link">
                <Dropdown>
                  <Dropdown.Toggle className="nav-link user-switch-dropdown-toggler p-0 toggle-arrow-hide bg-transparent border-0 w-100">
                    <div className="text-wrapper">
                        <p className="profile-name">Bem-vindo</p>
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="preview-list navbar-dropdown">
                    <Dropdown.Item className="dropdown-item p-0 preview-item d-flex align-items-center" href="!#" onClick={evt =>evt.preventDefault()}>
                      <div className="d-flex">
                        <div className="py-3 px-4 d-flex align-items-center justify-content-center">
                          <i className="mdi mdi-bookmark-plus-outline mr-0"></i>
                        </div>
                        <div className="py-3 px-4 d-flex align-items-center justify-content-center border-left border-right">
                          <i className="mdi mdi-account-outline mr-0"></i>
                        </div>
                        <div className="py-3 px-4 d-flex align-items-center justify-content-center">
                          <i className="mdi mdi-alarm-check mr-0"></i>
                        </div>
                      </div>
                    </Dropdown.Item>
                    <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center text-small" onClick={evt =>evt.preventDefault()}>
                      <Trans>Manage Accounts</Trans>
                    </Dropdown.Item>
                    <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center text-small" onClick={evt =>evt.preventDefault()}>
                      <Trans>Change Password</Trans>
                    </Dropdown.Item>
                    <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center text-small" onClick={evt =>evt.preventDefault()}>
                      <Trans>Check Inbox</Trans>
                    </Dropdown.Item>
                    <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center text-small" onClick={evt =>evt.preventDefault()}>
                      <Trans>Sign Out</Trans>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>*/}
              {/*               <div className="bem-vindo">
                <div className="text-wrapper">
                    <p className="profile-name">Bem-vindo</p>
                </div>
              </div>
            </li> */}

              {/*<li className={ this.isPathActive('/dashboard') ? 'nav-item active' : 'nav-item' }>
              <Link className="nav-link" to="/dashboard">
                <i className="mdi mdi-television menu-icon"></i>
                <span className="menu-title"><Trans>Dashboard - Dados</Trans></span>
              </Link>
            </li>*/}

              {/*             <li className={ this.isPathActive('/form-elements') ? 'nav-item active' : 'nav-item' }>
              <div className={ this.state.formElementsMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('formElementsMenuOpen') } data-toggle="collapse">
                <i className="mdi mdi-format-list-bulleted menu-icon"></i>
                <span className="menu-title"><Trans>Configuração Máquina</Trans></span>
                <i className="menu-arrow"></i>
              </div>
              <Collapse in={ this.state.formElementsMenuOpen }>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"> <Link className={ this.isPathActive('/form-elements/basic-elements') ? 'nav-link active' : 'nav-link' } to="/form-elements/basic-elements"><Trans>Abrir</Trans></Link></li>
                </ul>
              </Collapse>
            </li> */}

              {/*             <li className={ this.isPathActive('/form-Elements/basic-elements-massa') ? 'nav-item active' : 'nav-item' }>
              <div className={ this.state.formElementsMenuMassaOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('formElementsMenuMassaOpen') } data-toggle="collapse">
                <i className="mdi mdi-format-list-bulleted menu-icon"></i>
                <span className="menu-title"><Trans>Configuração em Massa</Trans></span>
                <i className="menu-arrow"></i>
              </div>
              <Collapse in={ this.state.formElementsMenuMassaOpen }>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"> <Link className={ this.isPathActive('/form-Elements/basic-elements-massa/basic-elements') ? 'nav-link active' : 'nav-link' } to="/form-Elements/basic-elements-massa/basic-elements-massa"><Trans>Abrir</Trans></Link></li>
                </ul>
              </Collapse>
            </li> */}

              {/*             <li className={this.isPathActive('/form-Elements/grupo-dlp') ? 'nav-item active' : 'nav-item'}>
              <div className={this.state.formElementsMenuGrupoOpen ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('formElementsMenuGrupoOpen')} data-toggle="collapse">
                <i className="mdi mdi-format-list-bulleted menu-icon"></i>
                <span className="menu-title"><Trans>Configuração Grupo DLP</Trans></span>
                <i className="menu-arrow"></i>
              </div>
              <Collapse in={this.state.formElementsMenuGrupoOpen}>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"> <Link className={this.isPathActive('/form-Elements/grupo-dlp') ? 'nav-link active' : 'nav-link'} to="/form-Elements/grupo-dlp"><Trans>Grupo DLP</Trans></Link></li>
                  <li className="nav-item"> <Link className={this.isPathActive('/form-Elements/exibir-grupo-dlp') ? 'nav-link active' : 'nav-link'} to="/form-Elements/exibir-grupo-dlp"><Trans>Exibir Grupos</Trans></Link></li>
                </ul>
              </Collapse>
            </li> */}

              {/*<li className={this.isPathActive('/form-Elements/metadados') ? 'nav-item active' : 'nav-item'}>
              <div className={this.state.formElementsMenuMetadados ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('formElementsMenuMetadados')} data-toggle="collapse">
                <i className="mdi mdi-format-list-bulleted menu-icon"></i>
                <span className="menu-title"><Trans>Configuração Metadados</Trans></span>
                <i className="menu-arrow"></i>
              </div>
              <Collapse in={this.state.formElementsMenuMetadados}>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"> <Link className={this.isPathActive('/form-Elements/metadados') ? 'nav-link active' : 'nav-link'} to="/form-Elements/metadados"><Trans>Metadados</Trans></Link></li>
                  <li className="nav-item"> <Link className={this.isPathActive('/form-Elements/exibir-metadados') ? 'nav-link active' : 'nav-link'} to="/form-Elements/exibir-metadados"><Trans>Exibir Metadados</Trans></Link></li>
                </ul>
              </Collapse>
            </li> */}

              {/*<li className={this.isPathActive('/form-Elements/pastas-sensiveis') ? 'nav-item active' : 'nav-item'}>
              <div className={this.state.formElementsMenuPastasSensiveis ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('formElementsMenuPastasSensiveis')} data-toggle="collapse">
                <i className="mdi mdi-format-list-bulleted menu-icon"></i>
                <span className="menu-title"><Trans>Pastas Controladas</Trans></span>
                <i className="menu-arrow"></i>
              </div>
              <Collapse in={this.state.formElementsMenuPastasSensiveis}>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"> <Link className={this.isPathActive('/form-Elements/pastas-sensiveis') ? 'nav-link active' : 'nav-link'} to="/form-Elements/pastas-sensiveis"><Trans>Cadastro</Trans></Link></li>
                  <li className="nav-item"> <Link className={this.isPathActive('/form-Elements/pastas-sensiveis-acessos') ? 'nav-link active' : 'nav-link'} to="/form-Elements/pastas-sensiveis-acessos"><Trans>Acessos</Trans></Link></li>
                  <li className="nav-item"> <Link className={this.isPathActive('/form-Elements/pastas-sensiveis-liberacoes') ? 'nav-link active' : 'nav-link'} to="/form-Elements/pastas-sensiveis-liberacoes"><Trans>Liberações</Trans></Link></li>
                </ul>
              </Collapse>
            </li>*/}

              {/*             <li className='nav-item'>
              <div onClick={ () => this.redirecionarUsuario() } className='nav-link'>
                <i className="mdi mdi-format-list-bulleted menu-icon"></i>
                <span className="menu-title"><Trans>Painel Configurações</Trans></span>
                <i className="menu-arrow"></i>
              </div>
            </li> */}

              {/*<li className={ this.isPathActive('/tables') ? 'nav-item active' : 'nav-item' }>
              <div className={ this.state.tablesMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('tablesMenuOpen') } data-toggle="collapse">
                <i className="mdi mdi-table-large menu-icon"></i>
                <span className="menu-title"><Trans>Tabelas - Exemplos</Trans></span>
                <i className="menu-arrow"></i>
              </div>
              <Collapse in={ this.state.tablesMenuOpen }>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"> <Link className={ this.isPathActive('/tables/basic-table') ? 'nav-link active' : 'nav-link' } to="/tables/basic-table"><Trans>Basic Table</Trans></Link></li>
                </ul>
              </Collapse>
            </li>*/}

              {/*<li className={ this.isPathActive('/charts') ? 'nav-item active' : 'nav-item' }>
              <div className={ this.state.chartsMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('chartsMenuOpen') } data-toggle="collapse">
                <i className="mdi mdi-chart-line menu-icon"></i>
                <span className="menu-title"><Trans>Dashboards - Exemplos</Trans></span>
                <i className="menu-arrow"></i>
              </div>
              <Collapse in={ this.state.chartsMenuOpen }>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"> <Link className={ this.isPathActive('/charts/chart-js') ? 'nav-link active' : 'nav-link' } to="/charts/chart-js">Chart Js</Link></li>
                </ul>
              </Collapse>
            </li>*/}


              {/*<li className="nav-item">
              <a className="nav-link" href="https://epsoft.com.br" rel="noopener noreferrer" target="_blank">
                <i className="mdi mdi-file-outline menu-icon"></i>
                <span className="menu-title"><Trans>Documentação</Trans></span>
              </a>
            </li>*/}

            </ul>
          </nav>
        );
      }
    } catch (erro) {
      window.location.href = http.defaults.baseURL + '/#/configuracoes';
    }
  }

  isPathActive(path) {
    return this.props.location.pathname.startsWith(path);
  }

  componentDidMount() {
    this.onRouteChanged();
    // add className 'hover-open' to sidebar navitem while hover in sidebar-icon-only menu



    const body = document.querySelector('body');
    document.querySelectorAll('.sidebar .nav-item').forEach((el) => {

      el.addEventListener('mouseover', function () {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.add('hover-open');
        }
      });
      el.addEventListener('mouseout', function () {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.remove('hover-open');
        }
      });
    });
  }

}

export default withRouter(Sidebar);