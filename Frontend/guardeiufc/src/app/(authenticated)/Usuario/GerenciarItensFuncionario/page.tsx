"use client";
import { useState } from "react";
import { FaCircleUser } from "react-icons/fa6";
import { FaUserEdit } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import styles from "./page.module.css";

export default function Home() {
  const [menuAberto, setMenuAberto] = useState(false);

  const [localizacoes, setLocalizacoes] = useState([
    { id: 1, nome: "Localização 1", bloco: "Bloco 1", sala: "Sala 1" },
    { id: 2, nome: "Localização 2", bloco: "Bloco 2", sala: "Sala 2" },
  ]);

  const [projetos, setProjetos] = useState([
    { id: 1, nome: "Projeto 1" },
    { id: 2, nome: "Projeto 2" },
  ]);

  const [responsavel, SetResponsavel] = useState([
    { id: 1, nome: "Rossana" },
    { id: 2, nome: "Trinta" },
  ]);

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  return (
    <div>
      <div className={styles.main}>
        <header className={styles.fixedheader}>
          <p className={styles.titulo}>GuardeiUFC</p>
          <div className={styles.profileMenu}>
            <FaCircleUser className={styles.profileIcon} onClick={toggleMenu} />
            {menuAberto && (
              <div
                className={`${styles.menu} ${
                  menuAberto ? styles.menuaberto : ""
                }`}
              >
                <a href="#">
                  <FaUserEdit className={styles.iconMenu} />
                  Editar Perfil
                </a>
                <a href="#">
                  <CiLogout className={styles.iconMenu} />
                  Sair
                </a>
              </div>
            )}
          </div>
        </header>
        <div className={styles.Principal}>
          <p className={styles.estilotitulo}>Editar Itens do patrimônio</p>
          
            <div className={styles.ContainerPrincipalEdicao}>
              <div className={styles.containerBuscar}>
                <div className={styles.divisao}>
                  <div className={styles.inputContainerPatrimonio}>
                    <p className={styles.Nomes}>Número do patrimônio</p>
                    <input
                      type="text"
                      id="id"
                      name="id"
                      placeholder="Digite o número do patrimônio"
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.botaoBuscar}>
                    <p className={styles.estiloBotaoBuscar}>Buscar</p>
                  </div>
                </div>
              </div>
              <div className={styles.containerEdicao}>
                <div className={styles.divisao}>
                  <div className={styles.inputContainer1}>
                    <p className={styles.Nomes}>Número do patrimônio</p>
                    <input
                      type="text"
                      id="id"
                      name="id"
                      placeholder="Digite o número do patrimônio"
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.inputContainer2}>
                    <p className={styles.Nomes}>Nome</p>
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      placeholder="Digite o nome do patrimônio"
                      className={styles.input}
                    />
                  </div>
                </div>
                <div className={styles.divisao}>
                  <div className={styles.inputContainer2}>
                    <p className={styles.Nomes}>Localização</p>
                    <select
                      id="localizacao"
                      name="localizacao"
                      className={styles.input}
                    >
                      <option value="">Selecione a localização</option>
                      {localizacoes.map((localizacao) => (
                        <option key={localizacao.id} value={localizacao.id}>
                          {localizacao.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.inputContainer1}>
                    <p className={styles.Nomes}>Projeto Vinculado</p>
                    <select
                      id="projeto"
                      name="projeto"
                      className={styles.input}
                    >
                      <option value="">Selecione o projeto vinculado</option>
                      {projetos.map((projeto) => (
                        <option key={projeto.id} value={projeto.id}>
                          {projeto.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className={styles.divisao}>
                  <div className={styles.inputContainer}>
                    <p className={styles.Nomes}>Descrição</p>
                    <input
                      type="text"
                      id="descricao"
                      name="descricao"
                      placeholder="Informe uma descrição para o patrimônio"
                      className={styles.input}
                    />
                  </div>
                </div>
                <div className={styles.divisao}>
                  <div className={styles.inputContainer2}>
                    <p className={styles.Nomes}>Responsável</p>
                    <select
                      id="responsavel"
                      name="responsavel"
                      className={styles.input}
                    >
                      <option value="">
                        Selecione o responsável pelo projeto
                      </option>
                      {responsavel.map((responsavel) => (
                        <option key={responsavel.id} value={responsavel.id}>
                          {responsavel.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.inputContainer2}>
                    <p className={styles.Nomes}>Imagem do Patrimônio</p>
                    <input
                      type="file"
                      name="imagem"
                      accept="image/*"
                      className={styles.input}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.botoesInferiores}>
                <p className={styles.estiloBotao}>Salvar Alterações</p>
                <p className={styles.estiloBotaoExcluir}>Excluir patrimônio</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
