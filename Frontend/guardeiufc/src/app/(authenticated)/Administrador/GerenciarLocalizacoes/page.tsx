"use client";
import { useState } from "react";
import styles from "./page.module.css";

function EditarLocal() {
  const [showCreate, setShowCreate] = useState(false);
  const [showEditDelete, setShowEditDelete] = useState(false);
  const [searchByBlock, setSearchByBlock] = useState("");
  const [searchByRoom, setSearchByRoom] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [sala, setSala] = useState("");

  const [localizacoes, setLocalizacoes] = useState([
    { id: 1, nome: "Localização 1", bloco: "Bloco 1", sala: "Sala 1" },
    { id: 2, nome: "Localização 2", bloco: "Bloco 2", sala: "Sala 2" },
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
      setSearchByBlock("");
      setSearchByRoom("");
    }
  };

  const buscarLocalizacao = () => {
    // Encontrar a localização com base no bloco ou sala selecionado
    let localizacaoEncontrada;
    if (searchByBlock) {
      localizacaoEncontrada = localizacoes.find(
        (localizacao) => localizacao.bloco === searchByBlock
      );
    } else if (searchByRoom) {
      localizacaoEncontrada = localizacoes.find(
        (localizacao) => localizacao.sala === searchByRoom
      );
    }
    if (localizacaoEncontrada) {
      setDepartamento(localizacaoEncontrada.bloco);
      setSala(localizacaoEncontrada.sala);
    } else {
      setDepartamento("");
      setSala("");
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
            className={`${styles.EstilobotaoMenu} ${showCreate ? styles.buttonSelected : styles.buttonUnselected}`}
            onClick={telaCriacaoClicada}
          >
            Cadastrar Local
          </button>
          <button
            className={`${styles.EstilobotaoMenu} ${showEditDelete ? styles.buttonSelected : styles.buttonUnselected}`}
            onClick={telaEdicaoClicada}
          >
            Editar/Excluir Local
          </button>
        </div>
        {showCreate && (
          <div>
            <div className={styles.containerPrincipal}>
              <div className={styles.inputContainer2}>
                <p className={styles.Nomes}>Departamento</p>
                <input
                  type="text"
                  id="departamento"
                  name="departamento"
                  placeholder="Digite o departamento (bloco) do local "
                  className={styles.input}
                />
              </div>
              <div className={styles.divisao}>
                <div className={styles.inputContainer2}>
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
                  <p className={styles.Nomes}>Buscar por Bloco</p>
                  <select
                    id="blocoEdit"
                    name="blocoEdit"
                    value={searchByBlock}
                    onChange={(e) => setSearchByBlock(e.target.value)}
                    className={styles.input}
                  >
                    <option value="">Selecione um bloco</option>
                    {localizacoes.map((localizacao) => (
                      <option key={localizacao.id} value={localizacao.bloco}>
                        {localizacao.bloco}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.inputContainer}>
                  <p className={styles.Nomes}>Buscar por Sala</p>
                  <select
                    id="salaEdit"
                    name="salaEdit"
                    value={searchByRoom}
                    onChange={(e) => setSearchByRoom(e.target.value)}
                    className={styles.input}
                  >
                    <option value="">Selecione uma sala</option>
                    {localizacoes.map((localizacao) => (
                      <option key={localizacao.id} value={localizacao.sala}>
                        {localizacao.sala}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.botaoBuscar}>
                  <p
                    className={styles.estiloBotaoBuscar}
                    onClick={buscarLocalizacao}
                  >
                    Buscar
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.containerPrincipal}>
              <div className={styles.inputContainer2}>
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
                <div className={styles.inputContainer2}>
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditarLocal;
