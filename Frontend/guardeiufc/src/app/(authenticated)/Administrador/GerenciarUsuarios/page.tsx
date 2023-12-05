"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Select from "react-select";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { axios } from "@/config/axios";
import { AxiosResponse, AxiosError } from "axios";

interface Usuario {
  registration: number;
  name: string;
  email: string;
}

interface ItemOpcao {
  value: number;
  label: string;
  data: Usuario;
}

interface User {
  username: string;
  isAdmin: boolean;
  employeeRegistration: number;
}

interface FormData {
  matricula: string;
  nome: string;
  email: string;
  nomeUsuario: string;
  senha: string;
  senhaConfirmacao: string;
}
interface ErrorResponse {
  message?: string;
  mensagem?: string;
}
export default function GerenciarUsuarios() {
  const [showCreate, setShowCreate] = useState(false);
  const [showEditDelete, setShowEditDelete] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isAdmin, setIsAdmin] = useState<string>("");
  const [selectedUsuario, setSelectedUsuario] = useState<User | null>(null);
  const [editedUsuarioUser, setEditedUsuarioUser] = useState<string>("");
  const [editedAdmin, setEditedAdmin] = useState<string>("");
  const [selectedItemData, setSelectedItemData] = useState<Usuario | null>({
    registration: 0,
    name: "",
    email: "",
  });
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [formData, setFormData] = useState<FormData>({
    matricula: "",
    nome: "",
    email: "",
    nomeUsuario: "",
    senha: "",
    senhaConfirmacao: "",
  });
  const [passwordEquals, setPasswordEquals] = useState(true);
  const [loader, setLoader] = useState(true);
  const [changePassword, setChangePassword] = useState(false);
  const router = useRouter();
  const [numFieldIsValid, setNumFieldIsValid] = useState(true);
  const handleValidateNumericField = (number: string) => {
    setNumFieldIsValid(/^[0-9]*$/.test(number));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Lógica para lidar com a mudança nos campos de entrada
    const { name, value } = event.target;
    if (name == "matricula") {
      handleValidateNumericField(value);
    }
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (name == "senha" || name == "senhaConfirmacao") {
      // Verificando se as senhas são iguais
      const inputPass = document.getElementsByName(
        "senha"
      )[0] as HTMLInputElement;
      const inputPassConfirm = document.getElementsByName(
        "senhaConfirmacao"
      )[0] as HTMLInputElement;
      if (
        inputPass.value.length == 0 ||
        inputPass.value != inputPassConfirm.value
      ) {
        setPasswordEquals(false);
      } else {
        setPasswordEquals(true);
      }
    }
  };
  // Verifica se a outra tela não está aberta antes de abrir a tela desejada
  const telaCriacaoClicada = () => {
    if (!showEditDelete) {
      setShowCreate(!showCreate);
    }
    limparCampos();
  };
  // Verifica se a outra tela não está aberta antes de abrir a tela desejada
  const telaEdicaoClicada = () => {
    if (!showCreate) {
      setShowEditDelete(!showEditDelete);
    }
    limparCampos();
  };
  const validateData = (
    matricula: string,
    nome: string,
    email: string,
    nomeUsuario: string,
    senha: string,
    senhaConfirmacao: string
  ) => {
    if (
      matricula == "" ||
      nome == "" ||
      email == "" ||
      nomeUsuario == "" ||
      senha == "" ||
      senhaConfirmacao == ""
    ) {
      return false;
    }
    return true;
  };

  const validateDataEdicao = (
    nome: string,
    email: string,
    nomeUsuario: string,
    senha: string,
    senhaConfirmacao: string
  ) => {
    if (
      nome == "" ||
      email == "" ||
      nomeUsuario == ""
    ){
      return false
    }
    if (changePassword){
      if (senha == "" || senhaConfirmacao == ""){
        return false;
      }
    }
    return true;
  };

  const handleShowPasswordArea = () => {
    const passwordComponent = document.getElementById(
      "senha"
    ) as HTMLInputElement;
    const passwordConfirmComponent = document.getElementById(
      "senhaConfirmacao"
    ) as HTMLInputElement;
    // Limpa caixas de senha e confirmação de senha
    if (passwordComponent) {
      passwordComponent.value = "";
    }
    if (passwordConfirmComponent) {
      passwordConfirmComponent.value = "";
    }
    // Atualiza formData
    setFormData({
      ...formData,
      ...{ senha: "", senhaConfirmacao: "" },
    });
    setPasswordEquals(true);
    setChangePassword(!changePassword);
  };

  const limparCampos = () => {
    setFormData((prevState) => ({
      ...prevState,
      matricula: "",
      nome: "",
      email: "",
      nomeUsuario: "",
      senha: "",
      senhaConfirmacao: "",
    }));
    setSelectedUsuario(null);
    setSelectedItemData(null);
    setEditedUsuarioUser("");
    setEditedAdmin("");
    setIsAdmin('');
  };

  // Cadastro de Perfil
  const handleCadastrar = function (): void {
    const dataIsValid = validateData(
      formData.matricula,
      formData.nome,
      formData.email,
      formData.nomeUsuario,
      formData.senha,
      formData.senhaConfirmacao
    );
    if (!dataIsValid || isAdmin === "") {
      Swal.fire({
        icon: "warning",
        text: "Os campos marcados com * são de preenchimento obrigatório!",
      });
      return;
    }

    axios
      .post("/user", {
        username: formData.nomeUsuario,
        password: formData.senha,
        registration: Number(formData.matricula),
        name: formData.nome,
        email: formData.email,
        isAdmin: isAdmin === "sim",
      })
      .then((response: AxiosResponse) => {
        if (response.status == 201) {
          Swal.fire({
            icon: "info",
            text: "Cadastro realizado com sucesso!",
          });
          limparCampos();
        }
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        if (error.response?.status === 400) {
          const errorMessage = error.response?.data?.mensagem;
          if (errorMessage) {
            Swal.fire({
              icon: "error",
              text: errorMessage,
            });
          } else {
            Swal.fire({
              icon: "error",
              text: "Ocorreu um erro ao tentar fazer cadastro.",
            });
          }
        } else {
          Swal.fire({
            icon: "error",
            text: `Ocorreu um erro ao tentar fazer cadastro.\nCódigo do erro: ${error.response?.status}`,
          });
        }
        console.error(error);
      });
  };

  //Editar usuarios
  const handleSaveChanges = () => {
    if (!selectedUsuario) {
      Swal.fire({
        icon: "warning",
        text: "Selecione um usuário para editar!",
      });
      return;
    }

    const dataIsValid = validateDataEdicao(
      editedUsuarioUser,
      selectedItemData?.name ? selectedItemData?.name : "",
      selectedItemData?.email ? selectedItemData?.email: "",
      formData.senha,
      formData.senhaConfirmacao
    );
    if (!dataIsValid){
      Swal.fire({
        icon: "warning",
        text: "Preencha as informações corretas para edição!",
      });
      return;
    }

    const data = {
      username: editedUsuarioUser,
      ...(changePassword && { password: formData.senha }),
      name: selectedItemData?.name,
      email: selectedItemData?.email,
      isAdmin: editedAdmin === "sim",
    };
    const nomeUser = selectedUsuario?.username;
    axios
      .put(`/user/${nomeUser}`, data)
      .then((response: AxiosResponse) => {
        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            text: "Alterações salvas com sucesso!",
          });
          limparCampos();
          setChangePassword(false);
        }
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        if (error.response?.status === 400) {
          const errorMessage = error.response?.data?.message;
          if (errorMessage) {
            Swal.fire({
              icon: "error",
              text: errorMessage,
            });
          } else {
            Swal.fire({
              icon: "error",
              text: "Ocorreu um erro ao tentar fazer edição.",
            });
          }
        } else {
          Swal.fire({
            icon: "error",
            text: `Ocorreu um erro ao tentar fazer cadastro.\nCódigo do erro: ${error.response?.status}`,
          });
        }
        console.error(error);
      });
  };

  //Editar usuarios
  const excluirUsuario = () => {
    if (!selectedUsuario) {
      Swal.fire({
        icon: "warning",
        text: "Selecione um usuário para excluir!",
      });
      return;
    }
    const nomeUser = selectedUsuario?.username;
    axios
      .delete(`/user/${nomeUser}`,)
      .then((response: AxiosResponse) => {
        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            text: "Usuário excluido com sucesso!",
          });
          limparCampos();
          setChangePassword(false);
        }
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        if (error.response?.status === 400) {
          const errorMessage = error.response?.data?.mensagem;
          if (errorMessage) {
            Swal.fire({
              icon: "error",
              text: errorMessage,
            });
          } else {
            Swal.fire({
              icon: "error",
              text: "Ocorreu um erro ao tentar fazer exclusão.",
            });
          }
        } else {
          Swal.fire({
            icon: "error",
            text: `Ocorreu um erro ao tentar fazer exclusão.\nCódigo do erro: ${error.response?.status}`,
          });
        }
        console.error(error);
      });
  };

  useEffect(() => {
    // Obtendo todos os usuarios
    axios
      .get("/user")
      .then((response) => {
        if (response.status == 200) {
          setUsuarios(response.data.users);
          console.log(usuarios);
        }
      })
      .catch((error: AxiosError) => {
        if (error.response?.status == 403) {
          Swal.fire({
            icon: "error",
            text: "Faça login para acessar os usuários!",
          }).then(({ value }) => {
            if (value == true) {
              router.push("/TelaLogin");
            }
          });
        } else {
          Swal.fire({
            icon: "error",
            text: `Ocorreu um erro ao tentar inicializar a tela. Tente novamente!\nCódigo do erro: ${error.response?.status}`,
          });
        }
        console.error(error);
      });
  }, [showEditDelete, selectedUsuario]);

  useEffect(() => {
    if (selectedUsuario) {
      const idFunc = selectedUsuario.employeeRegistration;
      axios
        .get(`/employee/${idFunc}`)
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            const userData = response.data.employee;
            console.log(userData);
            setSelectedItemData({
              registration: userData.registration,
              name: userData.name,
              email: userData.email,
            });
            setEditedAdmin(selectedUsuario?.isAdmin ? "sim" : "nao");
          }
        })
        .catch((error: AxiosError) => {
          if (error.response?.status == 403) {
            Swal.fire({
              icon: "error",
              text: "Faça login para acessar os usuários!",
            }).then(({ value }) => {
              if (value == true) {
                router.push("/TelaLogin");
              }
            });
          }
          else {
            Swal.fire({
              icon: "error",
              text: `Ocorreu um erro ao tentar inicializar a tela. Tente novamente!\nCódigo do erro: ${error.response?.status}`,
            });
          }
          console.error(error);
        });
    }
    if (selectedUsuario) {
      setEditedUsuarioUser(selectedUsuario.username || "");
    }
  }, [selectedUsuario]);

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
                      <p className={styles.Nomes}>Matrícula*</p>
                      <input
                        type="number"
                        id="matricula"
                        name="matricula"
                        placeholder="Digite o número da matricula"
                        className={styles.input}
                        tabIndex={0}
                        onChange={handleInputChange}
                        value = {formData.matricula}
                      />
                    </div>
                    <div className={styles.inputContainer2}>
                      <p className={styles.Nomes}>Nome*</p>
                      <input
                        type="text"
                        id="nome"
                        name="nome"
                        placeholder="Digite o nome do usuário*"
                        className={styles.input}
                        value = {formData.nome}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className={styles.divisao}>
                    <div className={styles.inputContainer}>
                      <p className={styles.Nomes}>Email*</p>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Digite o email do usuário*"
                        className={styles.input}
                        value = {formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className={styles.inputContainer1}>
                      <p className={styles.Nomes}>Nome de usuário*</p>
                      <input
                        type="text"
                        id="user"
                        name="nomeUsuario"
                        placeholder="Digite o nome de usuário*"
                        className={styles.input}
                        onChange={handleInputChange}
                        value = {formData.nomeUsuario}
                      />
                    </div>
                  </div>
                  <div className={styles.divisao}>
                    <div className={styles.inputContainer}>
                      <p className={styles.Nomes}>Senha*</p>
                      <input
                        type="password"
                        id="senha"
                        name="senha"
                        placeholder="Digite uma senha*"
                        className={styles.input}
                        onChange={handleInputChange}
                        value = {formData.senha}
                      />
                    </div>
                    <div className={styles.inputContainer}>
                      <p className={styles.Nomes}>Confirmar a senha*</p>
                      <input
                        type="password"
                        id="Csenha"
                        name="senhaConfirmacao"
                        placeholder="Confirme a senha*"
                        className={styles.input}
                        onChange={handleInputChange}
                        value = {formData.senhaConfirmacao}
                      />
                    </div>
                  </div>
                  <div className={styles.inputContainer}>
                    <p className={styles.Nomes}>Administrador do sistema?*</p>
                    <select
                      id="adm"
                      name="administrador"
                      className={styles.input}
                      value={isAdmin}
                      onChange={(e) => setIsAdmin(e.target.value)}
                    >
                      <option value="">Selecione uma opção</option>
                      <option value="sim">Sim</option>
                      <option value="nao">Não</option>
                    </select>
                  </div>
                  <div>
                    {!passwordEquals && (
                      <div>
                        <p className={styles.sinalizadorDadosInvalidos}>
                          As senhas não correspondem!
                        </p>
                      </div>
                    )}
                    {!numFieldIsValid && (
                      <div>
                        <p
                          className={styles.sinalizadorDadosInvalidos}
                          tabIndex={0}
                        >
                          O campo número de matricula deve ser numérico!
                        </p>
                      </div>
                    )}
                  </div>
                  <div className={styles.botoesInferiores}>
                    <p className={styles.estiloBotao} onClick={handleCadastrar}>
                      Criar Usuário
                    </p>
                  </div>
                </div>
              )}
              {showEditDelete && (
                <div className={styles.ContainerPrincipalEdicao}>
                  <div className={styles.containerBuscar}>
                    <div>
                      <p className={styles.Nomes}>Matricula</p>
                      <Select
                        value={selectedUsuario}
                        onChange={(selectedOption) =>
                          setSelectedUsuario(selectedOption as User)
                        }
                        options={usuarios.map((usuario) => ({
                          label: `${usuario.employeeRegistration} - ${usuario.username}`,
                          value: usuario.employeeRegistration,
                          username: usuario.username,
                          isAdmin: usuario.isAdmin,
                          employeeRegistration: usuario.employeeRegistration,
                        }))}
                        placeholder="Digite ou selecione um usuário"
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
                          placeholder="Matricula"
                          className={styles.input}
                          value={selectedUsuario?.employeeRegistration || ""}
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
                          value={selectedItemData?.name || ""}
                          disabled={!selectedUsuario}
                          onChange={(e) => {
                            setSelectedItemData(
                              (prevSelectedItemData): Usuario => ({
                                ...prevSelectedItemData!,
                                name: e.target.value,
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
                          disabled={!selectedUsuario}
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
                          value={editedUsuarioUser}
                          disabled={!selectedUsuario}
                          onChange={(e) => setEditedUsuarioUser(e.target.value)}
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
                          disabled={!selectedUsuario}
                          value={editedAdmin || ""}
                          onChange={(e) => setEditedAdmin(e.target.value)}
                        >
                          <option value="">Selecione uma opção</option>
                          <option value="sim">Sim</option>
                          <option value="nao">Não</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <input
                        name={"updatePassword"}
                        checked={changePassword}
                        type={"checkbox"}
                        onChange={handleShowPasswordArea}
                      ></input>
                      <label htmlFor="updatePassword" className={styles.Nomes}>
                        {" "}
                        Alterar Senha
                      </label>
                    </div>
                    {changePassword && (
                      <div className={styles.divisao}>
                        <div className={styles.inputContainer}>
                          <p className={styles.Nomes}>Nova Senha*</p>
                          <input
                            type="password"
                            id="senha"
                            name="senha"
                            tabIndex={0}
                            placeholder="Digite sua nova senha"
                            onChange={handleInputChange}
                            className={styles.input}
                            value = {formData.senha}
                          />
                        </div>
                        <div className={styles.inputContainer}>
                          <p className={styles.Nomes}>Confirmar Senha*</p>
                          <input
                            type="password"
                            id="senhaConfirmacao"
                            name="senhaConfirmacao"
                            tabIndex={0}
                            placeholder="Confirme sua nova senha"
                            onChange={handleInputChange}
                            className={styles.input}
                            value = {formData.senhaConfirmacao}
                          />
                        </div>
                      </div>
                    )}
                    <div>
                      {!passwordEquals && (
                        <div>
                          <p className={styles.sinalizadorDadosInvalidos}>
                            As senhas não correspondem!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={styles.botoesInferiores}>
                    <p
                      className={styles.estiloBotao}
                      onClick={passwordEquals ? handleSaveChanges : () => {}}
                    >
                      Salvar Alterações
                    </p>
                    <p className={styles.estiloBotaoExcluir} onClick = {excluirUsuario}>Excluir Usuário</p>
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
