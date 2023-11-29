"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Select from "react-select";

interface ProjetoSelecionado {
  nomeProjeto: string;
  idProjeto: number;
  idResponsavel: number;
}
interface Responsavel {
  matricula: number;
  nome: string;
}

interface Projeto {
  id: number;
  nome: string;
  idResponsavel: number;
}

function EditarProjetos() {
  const [showCreate, setShowCreate] = useState(false);
  const [showEditDelete, setShowEditDelete] = useState(false);
  const [responsavel, setResponsavel] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [isSearchable, setIsSearchable] = useState(false);

  const [selectedResponsavel, setSelectedResponsavel] = useState<{
    label: string;
    value: number;
    matresponsavel: number;
    nomeResponsavel: string;
  } | null>(null);

  const [selectedProjeto, setSelectedProjeto] = useState<{
    label: string;
    value: number;
    nomeProjeto: string;
    idProjeto: number;
    idResponsavel: number;
  } | null>(null);

  const [projetoSelecionado, setProjetoSelecionado] =
    useState<ProjetoSelecionado>({
      nomeProjeto: "",
      idProjeto: 0,
      idResponsavel: 0,
    });

  const [responsaveis, setResponsaveis] = useState([
    { matricula: 123, nome: "João da Silva" },
    { matricula: 456, nome: "Maria Oliveira" },
  ]);
  // Atualiza o estado inicial de selectedResponsavel ao carregar
  useEffect(() => {
    if (projetoSelecionado && projetoSelecionado.idResponsavel) {
      const responsavelSelecionado = responsaveis.find(
        (r) => r.matricula === projetoSelecionado.idResponsavel
      );
      if (responsavelSelecionado) {
        setSelectedResponsavel({
          label: `${responsavelSelecionado.matricula} - ${responsavelSelecionado.nome}`,
          value: responsavelSelecionado.matricula,
          nomeResponsavel: responsavelSelecionado.nome,
          matresponsavel: responsavelSelecionado.matricula,
        });
      }
    }
  }, [projetoSelecionado]);

  const [projetos, setProjetos] = useState([
    { id: 1, nome: "Projeto A", idResponsavel: 123 },
    { id: 2, nome: "Projeto B", idResponsavel: 456 },
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
        <div className={styles.estiloCadastro}>
          <p>Gerenciar Projetos</p>
        </div>
        <div className={styles.botoes}>
          <button
            className={`${styles.EstilobotaoMenu} ${
              showCreate ? styles.buttonSelected : styles.buttonUnselected
            }`}
            onClick={telaCriacaoClicada}
          >
            Criar Projeto
          </button>
          <button
            className={`${styles.EstilobotaoMenu} ${
              showEditDelete ? styles.buttonSelected : styles.buttonUnselected
            }`}
            onClick={telaEdicaoClicada}
          >
            Editar/Excluir Projeto
          </button>
        </div>
        {showCreate && (
          <div>
            <div className={styles.containerPrincipal}>
              <div className={styles.inputContainer2}>
                <p className={styles.Nomes}>Nome do projeto</p>
                <input
                  type="text"
                  id="projeto"
                  name="projeto"
                  placeholder="Digite o nome do projeto"
                  className={styles.input}
                />
              </div>
              <div className={styles.divisao}>
                <div className={styles.inputContainer}>
                  <p className={styles.Nomes}>Responsável</p>
                  <Select
                    value={selectedResponsavel}
                    onChange={(selectedOption) => {
                      setSelectedResponsavel(selectedOption);
                      setResponsavel(String(selectedOption?.value || ""));
                    }}
                    options={
                      searchValue.length > 0
                        ? responsaveis.map((responsavel) => ({
                            label: `${responsavel.matricula} - ${responsavel.nome}`,
                            value: responsavel.matricula,
                            nomeResponsavel: responsavel.nome,
                            matresponsavel: responsavel.matricula,
                          }))
                        : []
                    }
                    onInputChange={(newValue) => setSearchValue(newValue)}
                    isSearchable
                    placeholder="Selecione um responsável"
                    noOptionsMessage={() => "Nenhuma opção disponível"}
                  />
                </div>
              </div>
            </div>
            <div className={styles.botoesInferiores}>
              <p className={styles.estiloBotao}>Criar Projeto</p>
            </div>
          </div>
        )}
        {showEditDelete && (
          <div className={styles.conteudo}>
            <div className={styles.containerBuscar}>
              <div className={styles.divisao}>
                <div className={styles.inputContainer}>
                  <p className={styles.Nomes}>Selecione um projeto</p>
                  <Select
                    value={selectedProjeto}
                    onChange={(selectedOption) => {
                      setSelectedProjeto(selectedOption);
                      setProjetoSelecionado({
                        nomeProjeto: selectedOption?.nomeProjeto || "",
                        idProjeto: selectedOption?.idProjeto || 0,
                        idResponsavel: selectedOption?.idResponsavel || 0,
                      });
                    }}
                    options={projetos.map((projeto) => ({
                      label: `${projeto.nome} - ID: ${projeto.id}`,
                      value: projeto.id,
                      nomeProjeto: projeto.nome,
                      idProjeto: projeto.id,
                      idResponsavel: projeto.idResponsavel,
                    }))}
                    placeholder="Selecione um projeto"
                    noOptionsMessage={() => "Nenhuma opção disponível"}
                  />
                </div>
              </div>
            </div>
            <div className={styles.containerPrincipal}>
              <div className={styles.inputContainer}>
                <p className={styles.Nomes}>Nome do Projeto</p>
                <input
                  type="text"
                  id="nomeProjeto"
                  name="nomeProjeto"
                  placeholder="Nome do projeto"
                  value={projetoSelecionado?.nomeProjeto || ""}
                  onChange={(e) =>
                    setProjetoSelecionado((prev) => ({
                      ...prev,
                      nomeProjeto: e.target.value,
                    }))
                  }
                  className={styles.input}
                />
              </div>
              <div className={styles.divisao}>
                <div className={styles.inputContainer}>
                  <p className={styles.Nomes}>Selecione um responsável</p>
                  <Select
                    value={selectedResponsavel}
                    onChange={(selectedOption) => {
                      setSelectedResponsavel(selectedOption);
                      setProjetoSelecionado((prev) => ({
                        ...prev,
                        idResponsavel: selectedOption?.value || 0,
                      }));
                    }}
                    options={responsaveis.map((responsavel) => ({
                      label: `${responsavel.matricula} - ${responsavel.nome}`,
                      value: responsavel.matricula,
                      nomeResponsavel: responsavel.nome,
                      matresponsavel: responsavel.matricula,
                    }))}
                    placeholder="Selecione um responsável"
                    noOptionsMessage={() => "Nenhuma opção disponível"}
                  />
                </div>
              </div>
            </div>
            <div className={styles.botoesInferiores}>
              <p className={styles.estiloBotao}>Salvar Alterações</p>
              <p className={styles.estiloBotaoExcluir}>Excluir Projeto</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditarProjetos;
