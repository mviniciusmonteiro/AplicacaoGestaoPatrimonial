"use client";
import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [showCreate, setShowCreate] = useState(false);
  const [showEditDelete, setShowEditDelete] = useState(false);


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
          <p className = {styles.estilotitulo}>Gerenciar Itens do patrimônio</p>
          <div className={styles.EspacoBotoes}>
            <div className={styles.botoes}>
              <button
                className={styles.EstilobotaoMenu}
                onClick={telaCriacaoClicada}
              >
                Cadastrar Item
              </button>
              <button
                className={styles.EstilobotaoMenu}
                onClick={telaEdicaoClicada}
              >
                Editar/Excluir Item
              </button>
            </div>
            <div className={styles.conteudo}>
              {showCreate && (
                <div className={styles.containerCriacao}>
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
                        name="repsonsavel"
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
                        id= "nome"
                        name= "nome"
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
