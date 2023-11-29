"use client";
import { useState } from "react";
import styles from "./page.module.css";
import Select from "react-select";

function EditarLocal() {
  const [showCreate, setShowCreate] = useState(false);
  const [showEditDelete, setShowEditDelete] = useState(false);
  const [departamento, setDepartamento] = useState("");
  const [sala, setSala] = useState("");
  const [selectedLocal, setSelectedLocal] = useState<{
    label: string;
    value: number;
    bloco: string;
    sala: string;
  } | null>(null);

  const [searchValue, setSearchValue] = useState("");
  const [isSearchable, setIsSearchable] = useState(false);

  const [localizacoes, setLocalizacoes] = useState([
    { id: 1, bloco: "Bloco 1", sala: "Sala 1" },
    { id: 2, bloco: "Bloco 2", sala: "Sala 2" },
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
          <p>Gerenciar Localizações</p>
        </div>
        <div className={styles.botoes}>
          <button
            className={`${styles.EstilobotaoMenu} ${
              showCreate ? styles.buttonSelected : styles.buttonUnselected
            }`}
            onClick={telaCriacaoClicada}
          >
            Cadastrar Local
          </button>
          <button
            className={`${styles.EstilobotaoMenu} ${
              showEditDelete ? styles.buttonSelected : styles.buttonUnselected
            }`}
            onClick={telaEdicaoClicada}
          >
            Editar/Excluir Local
          </button>
        </div>
        {showCreate && (
          <div>
            <div className={styles.containerPrincipal}>
              <div className={styles.inputContainer2}>
                <p className={styles.Nomes}>Bloco</p>
                <input
                  type="text"
                  id="departamento"
                  name="departamento"
                  placeholder="Digite o bloco do local (Ex: Bloco - 910)"
                  className={styles.input}
                />
              </div>
              <div className={styles.divisao}>
                <div className={styles.inputContainer}>
                  <p className={styles.Nomes}>Sala</p>
                  <input
                    type="text"
                    id="sala"
                    name="sala"
                    placeholder="Digite a sala do local"
                    className={styles.input}
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
                  <p className={styles.Nomes}>Selecione um local</p>
                  <Select
                    value={selectedLocal}
                    onChange={(selectedOption) => {
                      setSelectedLocal(selectedOption);
                      setDepartamento(selectedOption?.bloco || "");
                      setSala(selectedOption?.sala || "");
                    }}
                    options={
                      searchValue.length > 0
                        ? localizacoes.map((localizacao) => ({
                            label: `${localizacao.bloco} - ${localizacao.sala}`,
                            value: localizacao.id,
                            bloco: localizacao.bloco,
                            sala: localizacao.sala,
                          }))
                        : []
                    }
                    onInputChange={(newValue) => setSearchValue(newValue)}
                    isSearchable
                    placeholder="Digite ou selecione um local"
                    noOptionsMessage={() => "Nenhuma opção disponível"}
                  />
                </div>
              </div>
            </div>
            <div className={styles.containerPrincipal}>
              <div className={styles.inputContainer}>
                <p className={styles.Nomes}>Departamento</p>
                <input
                  type="text"
                  id="departamentoEdicao"
                  name="departamentoEdicao"
                  placeholder="Departamento"
                  value={departamento}
                  onChange={(e) => setDepartamento(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div className={styles.divisao}>
                <div className={styles.inputContainer}>
                  <p className={styles.Nomes}>Sala</p>
                  <input
                    type="text"
                    id="salaEdicao"
                    name="salaEdicao"
                    placeholder="Sala"
                    value={sala}
                    onChange={(e) => setSala(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>
            </div>
            <div className={styles.botoesInferiores}>
              <p className={styles.estiloBotao}>Salvar Alterações</p>
              <p className={styles.estiloBotaoExcluir}>Excluir Local</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditarLocal;
