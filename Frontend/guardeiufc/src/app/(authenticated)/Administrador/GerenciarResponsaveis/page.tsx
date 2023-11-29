"use client";
import { useState } from "react";
import styles from "./page.module.css";
import Select from "react-select";

function EditarLocal() {
  const [showCreate, setShowCreate] = useState(false);
  const [showEditDelete, setShowEditDelete] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [responsavelSelecionado, setResponsavelSelecionado] =
    useState<boolean>(false);
  const [selectedFuncionario, setSelectedFuncionario] = useState<{
    label: string;
    value: number;
    nome: string;
    id: number;
    email: string;
  } | null>(null);

  const [searchValue, setSearchValue] = useState("");

  const resetSeletores = () => {
    console.log("Antes do reset:", {
      selectedFuncionario,
      nome,
      email,
    });

    setSelectedFuncionario(null);
    setNome("");
    setEmail("");

    console.log("Depois do reset:", {
      selectedFuncionario,
      nome,
      email,
    });
  };

  const salvarAlteracoesClicado = () => {
    resetSeletores();
  };

  const [responsaveis, setResponsaveis] = useState([
    { id: 123, nome: "João da Silva", email: "wdnoewfn" },
    { id: 456, nome: "Maria Oliveira", email: "ejwfnqefjiqe" },
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
      if (selectedFuncionario) {
        setResponsavelSelecionado((prev) => !prev);
      }
    }
  };

  return (
    <div>
      <div className={styles.main}>
        <div className={styles.estiloCadastro}>
          <p>Gerenciar Responsáveis</p>
        </div>
        <div className={styles.botoes}>
          <button
            className={`${styles.EstilobotaoMenu} ${
              showCreate ? styles.buttonSelected : styles.buttonUnselected
            }`}
            onClick={telaCriacaoClicada}
          >
            Cadastrar Responsável
          </button>
          <button
            className={`${styles.EstilobotaoMenu} ${
              showEditDelete ? styles.buttonSelected : styles.buttonUnselected
            }`}
            onClick={telaEdicaoClicada}
          >
            Editar/Excluir Responsável
          </button>
        </div>
        {showCreate && (
          <div>
            <div className={styles.containerPrincipal}>
              <div className={styles.inputContainer2}>
                <p className={styles.Nomes}>Nome do Responsável</p>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  placeholder="Digite o nome do funcionário"
                  className={styles.input}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>
              <div className={styles.divisao}>
                <div className={styles.inputContainer}>
                  <p className={styles.Nomes}>Email do funcionário</p>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    placeholder="Digite o email do funcionário"
                    className={styles.input}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className={styles.botoesInferiores}>
              <p className={styles.estiloBotao}>Salvar Alterações</p>
            </div>
          </div>
        )}
        {showEditDelete && (
          <div className={styles.conteudo}>
            <div className={styles.containerBuscar}>
              <div className={styles.divisao}>
                <div className={styles.inputContainer}>
                  <p className={styles.Nomes}>Selecione um Responsável</p>
                  <Select
                    value={selectedFuncionario}
                    onChange={(selectedOption) => {
                      setSelectedFuncionario(selectedOption);
                      setNome(selectedOption?.nome || "");
                      setEmail(selectedOption?.email || "");
                      setResponsavelSelecionado(true);
                    }}
                    options={
                      searchValue.length > 0
                        ? responsaveis.map((responsavel) => ({
                            label: `${responsavel.id} - ${responsavel.nome}`,
                            value: responsavel.id,
                            id: responsavel.id,
                            nome: responsavel.nome,
                            email: responsavel.email,
                          }))
                        : []
                    }
                    onInputChange={(newValue) => setSearchValue(newValue)}
                    isSearchable
                    placeholder="Digite ou selecione um responsável"
                    noOptionsMessage={() => "Nenhuma opção disponível"}
                  />
                </div>
              </div>
            </div>
            <div className={styles.containerPrincipal}>
              <div className={styles.inputContainer}>
                <p className={styles.Nomes}>Nome</p>
                <input
                  type="text"
                  id="nomeEdicao"
                  name="nomeEdicao"
                  placeholder="Nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className={styles.input}
                  disabled={!responsavelSelecionado}
                />
              </div>
              <div className={styles.divisao}>
                <div className={styles.inputContainer}>
                  <p className={styles.Nomes}>Email</p>
                  <input
                    type="text"
                    id="emailEdicao"
                    name="emailEdicao"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                    disabled={!responsavelSelecionado}
                  />
                </div>
              </div>
            </div>
            <div className={styles.botoesInferiores}>
              <p
                className={styles.estiloBotao}
                onClick={salvarAlteracoesClicado}
              >
                Salvar Alterações
              </p>
              <p className={styles.estiloBotaoExcluir}>Excluir Local</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditarLocal;
