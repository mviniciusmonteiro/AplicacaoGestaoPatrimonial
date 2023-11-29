"use client";
import { useState } from "react";
import styles from "./page.module.css";
import Select from "react-select";

interface Usuario {
  matricula: number;
  nome: string;
  email: string;
  user: string;
  senha: string;
  adm: string;
}

interface ItemOpcao {
  value: number;
  label: string;
}

export default function GerenciarUsuarios() {
  const [showCreate, setShowCreate] = useState(false);
  const [showEditDelete, setShowEditDelete] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedItem, setSelectedItem] = useState<ItemOpcao | null>(null);

  const [selectedItemData, setSelectedItemData] = useState<Usuario | null>({
    matricula: 0,
    nome: "",
    email: "",
    user: "",
    senha: "",
    adm: "",
  });

  // Função para lidar com a mudança de seleção do item
  const handleItemChange = (selectedOption: ItemOpcao | null) => {
    setSelectedItem(selectedOption);

    const selectedItemData = usuarios.find(
      (usuarios) => usuarios.matricula === (selectedOption?.value || 0)
    );
    setSelectedItemData(
      selectedItemData || {
        matricula: 0,
        nome: "",
        email: "",
        user: "",
        senha: "",
        adm: "",
      }
    );
  };
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    {
      matricula: 1,
      nome: "Jose",
      email: "jose@gmail",
      senha: "",
      user: "jose",
      adm: "nao",
    },
    {
      matricula: 2,
      nome: "Naa",
      email: "josefa@gmail",
      senha: "",
      user: "carlos",
      adm: "sim",
    },
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
          <p className={styles.estilotitulo}>Gerenciar Usuários</p>
          <div className={styles.EspacoBotoes}>
            <div className={styles.botoes}>
              <button
                className={`${styles.EstilobotaoMenu} ${
                  showCreate ? styles.buttonSelected : styles.buttonUnselected
                }`}
                onClick={telaCriacaoClicada}
              >
                Cadastrar usuário
              </button>
              <button
                className={`${styles.EstilobotaoMenu} ${
                  showEditDelete
                    ? styles.buttonSelected
                    : styles.buttonUnselected
                }`}
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
                        <option value="sim">Sim</option>
                        <option value="nao">Não</option>
                      </select>
                    </div>
                  </div>
                  <div className={styles.botoesInferiores}>
                    <p className={styles.estiloBotao}>Criar Usuário</p>
                  </div>
                </div>
              )}
              {showEditDelete && (
                <div className={styles.ContainerPrincipalEdicao}>
                  <div className={styles.containerBuscar}>
                    <div>
                      <p className={styles.Nomes}>Matricula</p>
                      <Select
                        value={selectedItem}
                        onChange={handleItemChange}
                        options={
                          searchValue.length > 0
                            ? usuarios.map((usuario) => ({
                                value: usuario.matricula,
                                label: `${usuario.matricula} - ${usuario.nome}`,
                              }))
                            : []
                        }
                        placeholder="Digite ou selecione um número de patrimônio"
                        onInputChange={(newValue) => setSearchValue(newValue)}
                        isSearchable
                        noOptionsMessage={() => "Nenhuma opção disponível"}
                      />
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
                          value={selectedItemData?.matricula || ""}
                          readOnly
                        />
                      </div>
                      <div className={styles.inputContainer2}>
                        <p className={styles.Nomes}>Nome</p>
                        <input
                          type="text"
                          id="nome"
                          name="nome"
                          placeholder="Digite o nome do funcionario"
                          className={styles.input}
                          value={selectedItemData?.nome || ""}
                          disabled={!selectedItem}
                          onChange={(e) => {
                            setSelectedItemData(
                              (prevSelectedItemData): Usuario => ({
                                ...prevSelectedItemData!,
                                nome: e.target.value,
                              })
                            );
                          }}
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
                          value={selectedItemData?.email || ""}
                          disabled={!selectedItem}
                          onChange={(e) => {
                            setSelectedItemData(
                              (prevSelectedItemData): Usuario => ({
                                ...prevSelectedItemData!,
                                email: e.target.value,
                              })
                            );
                          }}
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
                          value={selectedItemData?.user || ""}
                          disabled={!selectedItem}
                          onChange={(e) => {
                            setSelectedItemData(
                              (prevSelectedItemData): Usuario => ({
                                ...prevSelectedItemData!,
                                user: e.target.value,
                              })
                            );
                          }}
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
                          disabled={!selectedItem}
                          onChange={(e) => {
                            setSelectedItemData(
                              (prevSelectedItemData): Usuario => ({
                                ...prevSelectedItemData!,
                                senha: e.target.value,
                              })
                            );
                          }}
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
                          disabled={!selectedItem}
                        />
                      </div>
                    </div>
                    <div className={styles.divisao}>
                      <div className={styles.inputContainer}>
                        <p className={styles.Nomes}>
                          Administrador do sistema?
                        </p>
                        <select
                          id="adm"
                          name="administrador"
                          className={styles.input}
                          value={selectedItemData?.adm || ""}
                          disabled={!selectedItem}
                          onChange={(e) => {
                            setSelectedItemData(
                              (prevSelectedItemData): Usuario => ({
                                ...prevSelectedItemData!,
                                adm: e.target.value,
                              })
                            );
                          }}
                        >
                          <option value="">Selecione uma opção</option>
                          <option value="sim">Sim</option>
                          <option value="nao">Não</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className={styles.botoesInferiores}>
                    <p className={styles.estiloBotao}>Salvar Alterações</p>
                    <p className={styles.estiloBotaoExcluir}>
                      Excluir funcionário
                    </p>
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
