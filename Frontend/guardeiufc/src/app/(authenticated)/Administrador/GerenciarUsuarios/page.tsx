"use client";
import { useState } from "react";
import styles from "./page.module.css";

export default function GerenciarUsuarios() {
  const [showCreate, setShowCreate] = useState(false);
  const [showEditDelete, setShowEditDelete] = useState(false);

  // Verifica se a outra tela não está aberta antes de abrir a tela desejada
  const telaCriacaoClicada = () => {
    if (!showEditDelete) {
      setShowCreate(!showCreate);
    }
  };

  // Verifica se a outra tela não está aberta antes de abrir a tela desejada
  const telaEdicaoClicada = () => {
    if (!showCreate) {
      setShowEditDelete(!showEditDelete);
    }
  };

  return (
    <div>
      <div className={styles.main}>
        <div className={styles.Principal}>
          <p className = {styles.estilotitulo}>Gerenciar Usuários</p>
          <div className={styles.EspacoBotoes}>
            <div className={styles.botoes}>
              <button
                className={styles.EstilobotaoMenu}
                onClick={telaCriacaoClicada}
              >
                Cadastrar usuário
              </button>
              <button
                className={styles.EstilobotaoMenu}
                onClick={telaEdicaoClicada}
              >
                Editar/Excluir usuário
              </button>
            </div>
            <div className={styles.conteudo}>
              {showCreate && (
                <div className={styles.containerCriacao}>
                  <div className={styles.divisao}>
                    <div className={styles.inputContainer1}>
                      <p className={styles.Nomes}>Matrícula</p>
                      <input
                        type="text"
                        id="matricula"
                        name="matricula"
                        placeholder="Digite o número da matricula"
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.inputContainer2}>
                      <p className={styles.Nomes}>Nome</p>
                      <input
                        type="text"
                        id="nome"
                        name="nome"
                        placeholder="Digite o nome do usuário"
                        className={styles.input}
                      />
                    </div>
                  </div>
                  <div className={styles.divisao}>
                  <div className={styles.inputContainer}>
                      <p className={styles.Nomes}>Email</p>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Digite o email do usuário"
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.inputContainer1}>
                      <p className={styles.Nomes}>Nome de usuário</p>
                      <input
                        type="text"
                        id="user"
                        name="user"
                        placeholder="Digite o nome de usuário"
                        className={styles.input}
                      />
                    </div>
                  </div>
                  <div className={styles.divisao}>
                    <div className={styles.inputContainer}>
                      <p className={styles.Nomes}>Senha</p>
                      <input
                        type="text"
                        id="senha"
                        name="senha"
                        placeholder="Digite uma senha"
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.inputContainer}>
                      <p className={styles.Nomes}>Confirmar a senha</p>
                      <input
                        type="text"
                        id="Csenha"
                        name="Csenha"
                        placeholder="Confirme a senha"
                        className={styles.input}
                      />
                    </div>
                  </div>
                  <div className={styles.divisao}>
                  <div className={styles.inputContainer}>
                      <p className={styles.Nomes}>Administrador do sistema?</p>
                  <select
                        id="adm"
                        name="administrador"
                        className={styles.input}
                      >
                        <option value="">Selecione uma opção</option>
                        <option value = "sim">Sim</option>
                        <option value = "nao">Não</option>
                      </select>
                  </div>
                  </div>
                  <div className={styles.botoesInferiores}>
                    <p className={styles.estiloBotao}>Salvar Alterações</p>
                  </div>
                </div>
              )}
              {showEditDelete && (
                <div className = {styles.ContainerPrincipalEdicao}>
                <div className = {styles.containerBuscar}>
                <div className={styles.divisao}>
                    <div className={styles.inputContainerPatrimonio}>
                      <p className={styles.Nomes}>Matricula</p>
                      <input
                        type="text"
                        id="matricula"
                        name="matricula"
                        placeholder="Digite o número da matricula"
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
                      <p className={styles.Nomes}>Matricula</p>
                      <input
                        type="text"
                        id="matricula"
                        name="matricula"
                        placeholder="Digite o número da matricula"
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.inputContainer2}>
                      <p className={styles.Nomes}>Nome</p>
                      <input
                        type="text"
                        id= "nome"
                        name= "nome"
                        placeholder="Digite o nome do funcionario"
                        className={styles.input}
                      />
                    </div>
                  </div>
                  <div className={styles.divisao}>
                    <div className={styles.inputContainer2}>
                      <p className={styles.Nomes}>Email</p>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Digite o email do usuário"
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.inputContainer1}>
                    <p className={styles.Nomes}>Nome de usuário</p>
                      <input
                        type="text"
                        id="user"
                        name="user"
                        placeholder="Digite o nome de usuário"
                        className={styles.input}
                      />
                    </div>
                  </div>
                  <div className={styles.divisao}>
                    <div className={styles.inputContainer}>
                    <p className={styles.Nomes}>Senha</p>
                      <input
                        type="text"
                        id="senha"
                        name="senha"
                        placeholder="Digite uma senha"
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.inputContainer2}>
                    <p className={styles.Nomes}>Confirmar a senha</p>
                      <input
                        type="text"
                        id="Csenha"
                        name="Csenha"
                        placeholder="Confirme a senha"
                        className={styles.input}
                      />
                      </div>
                  </div>
                  <div className={styles.divisao}>
                  <div className={styles.inputContainer}>
                      <p className={styles.Nomes}>Administrador do sistema?</p>
                  <select
                        id="adm"
                        name="administrador"
                        className={styles.input}
                      >
                        <option value="">Selecione uma opção</option>
                        <option value = "sim">Sim</option>
                        <option value = "nao">Não</option>
                      </select>
                  </div>
                  </div>
                </div>
                <div className={styles.botoesInferiores}>
                    <p className={styles.estiloBotao}>Salvar Alterações</p>
                    <p className={styles.estiloBotaoExcluir}>Excluir funcionário</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
