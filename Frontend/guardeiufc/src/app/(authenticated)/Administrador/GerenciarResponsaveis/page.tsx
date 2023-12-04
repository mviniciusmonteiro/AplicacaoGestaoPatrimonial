"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Select from "react-select";
import { axios } from "@/config/axios";
import { AxiosResponse, AxiosError } from "axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface Responsavel {
  registration: number;
  name: string;
  email: string;
}

interface FormData{
  registration: number;
  name: string;
  email: string;
}
interface ErrorInfo {
  message: string;
}

function EditarResponsavel() {
  const [showCreate, setShowCreate] = useState(false);
  const [showEditDelete, setShowEditDelete] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    registration: 0,
    email:''
  });
  const router = useRouter();

  const [searchValue, setSearchValue] = useState("");

  const [selectedResponsavel, setSelectedResponsavel] =
    useState<Responsavel | null>(null);
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([
    {
      registration: 1,
      name: "",
      email: "",
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
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Lógica para lidar com a mudança nos campos de entrada
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const limparCampos = () => {
    setFormData({
      name: "",
      registration: 0,
      email: "",
    });
    setSelectedResponsavel(null);
  };

  const validateData = (name: String, registration: number, email: string) => {
    if (name == "" || registration == 0 || email == ""){
      return false;
    }
    return true;
  };

  const cadastrarFuncionario = () => {
    const dataIsValid = validateData(
      formData.name,
      formData.registration,
      formData.email
    );
    
    if (!dataIsValid) {
      Swal.fire({
        icon: "warning",
        text: "Informe todos os campos para cadastrar um funcionário!",
      });
      return;
    }
    axios
      .post("/employee", {
        name: formData.name,
        registration:Number(formData.registration),
        email:formData.email
      })
      .then((response: AxiosResponse) => {
        if (response.status == 201) {
          Swal.fire({
            icon: "info",
            text: "Funcionário cadastrado com sucesso!",
          });
          limparCampos();
        }
      })
      .catch((error) => {
        if (error.response?.status == 400) {
          const error_info  = error.response?.data as ErrorInfo;
          Swal.fire({
            icon: 'error',
            text: `${error_info.message}`
          });
        }
        else if (error.response?.status == 403) {
          Swal.fire({
            icon: "error",
            text: "Faça login para cadastrar funcionário!",
          }).then(() => {
            router.push("/TelaLogin");
          });
        } else {
          Swal.fire({
            icon: "error",
            text: `Ocorreu um erro ao tentar cadastrar funcionário.\nCódigo do erro: ${error.response?.status}`,
          });
        }
        console.error(error);
      });
  };
  const excluirResponsavel = () =>{
    if (!selectedResponsavel){
      Swal.fire({
        icon: "warning",
        text: "Selecione um funcionário para excluir!",
      });
      return;
    }
  const funcId = selectedResponsavel?.registration;
  axios
      .delete(`/employee/${funcId}`)
      .then((response: AxiosResponse) => {
        if (response.status == 200) {
          Swal.fire({
            icon: "info",
            text: "Funcionário excluído com sucesso!",
          });
          limparCampos();
        }
      })
      .catch((error) => {
        if (error.response?.status == 403) {
          Swal.fire({
            icon: "error",
            text: "Faça login para cadastrar local!",
          }).then(() => {
            limparCampos();
            router.push("/TelaLogin");
          });
        }
        let mensagem = JSON.stringify(error.response?.data);
        let mensagemList = mensagem.split('"');
        if (error.response?.status == 404) {
          Swal.fire({
            icon: "error",
            text: `${mensagemList[3] + "!"}`,
          });
        } else {
          Swal.fire({
            icon: "error",
            text: `Ocorreu um erro ao tentar editar local.\nCódigo do erro: ${error.response?.status}`,
          });
        }
        console.error(error);
      });
  };

  const editarFuncionario = () => {
    if (!selectedResponsavel || selectedResponsavel?.name == '' || selectedResponsavel?.email == ''){
      Swal.fire({
        icon: "warning",
        text: "Informe dados válidos para edição!",
      });
      return;
    }
  const funcId = selectedResponsavel?.registration;
  console.log(selectedResponsavel);
  console.log(funcId);
    axios
      .put(`/employee/${funcId}`, {
        name: selectedResponsavel?.name,
        email:selectedResponsavel?.email
      })
      .then((response: AxiosResponse) => {
        if (response.status == 200) {
          Swal.fire({
            icon: "info",
            text: "Funcionário editado com sucesso!",
          });
          limparCampos();
        }
      })
      .catch((error) => {
        if (error.response?.status == 400) {
          const error_info  = error.response?.data as ErrorInfo;
          Swal.fire({
            icon: 'error',
            text: `${error_info.message}`
          });
        }
        else if (error.response?.status == 403) {
          Swal.fire({
            icon: "error",
            text: "Faça login para editar funcionário!",
          }).then(() => {
            router.push("/TelaLogin");
          });
        } else {
          Swal.fire({
            icon: "error",
            text: `Ocorreu um erro ao tentar editar funcionário.\nCódigo do erro: ${error.response?.status}`,
          });
        }
        console.error(error);
      });
  };

  useEffect(() => {
    axios
      .get("/employee")
      .then((response) => {
        if (response.status == 200) {
          setResponsaveis(response.data.employees);
        }
      })
      .catch((error: AxiosError) => {
        if (error.response?.status == 403) {
          Swal.fire({
            icon: "error",
            text: "Faça login para acessar a tela!",
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
}, [showCreate, showEditDelete, selectedResponsavel]);

  return (
    <div>
      <div className={styles.main}>
        <div className={styles.estiloCadastro}>
          <p>Gerenciar Funcionários</p>
        </div>
        <div className={styles.botoes}>
          <button
            className={`${styles.EstilobotaoMenu} ${
              showCreate ? styles.buttonSelected : styles.buttonUnselected
            }`}
            onClick={telaCriacaoClicada}
          >
            Cadastrar Funcionário
          </button>
          <button
            className={`${styles.EstilobotaoMenu} ${
              showEditDelete ? styles.buttonSelected : styles.buttonUnselected
            }`}
            onClick={telaEdicaoClicada}
          >
            Editar/Excluir Funcionário
          </button>
        </div>
        {showCreate && (
          <div>
            <div className={styles.containerPrincipal}>
            <div className={styles.inputContainer2}>
                <p className={styles.Nomes}>Matrícula</p>
                <input
                  type="text"
                  id="matricula"
                  name="registration"
                  value = {formData.registration}
                  placeholder="Digite o matricula do funcionário"
                  className={styles.input}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.inputContainer2}>
                <p className={styles.Nomes}>Nome do Funcionário</p>
                <input
                  type="text"
                  id="nome"
                  name="name"
                  placeholder="Digite o nome do funcionário"
                  className={styles.input}
                  onChange={handleInputChange}
                  value = {formData.name}
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
                    onChange={handleInputChange}
                    value = {formData.email}
                  />
                </div>
              </div>
            </div>
            <div className={styles.botoesInferiores}>
              <p className={styles.estiloBotao} onClick = {cadastrarFuncionario}>Salvar Alterações</p>
            </div>
          </div>
        )}
        {showEditDelete && (
          <div className={styles.conteudo}>
            <div className={styles.containerBuscar}>
              <div className={styles.divisao}>
                <div className={styles.inputContainer}>
                  <p className={styles.Nomes}>Selecione um Funcionário</p>
                  <Select
                    value={selectedResponsavel}
                    onChange={(selectedOption) =>
                      setSelectedResponsavel(selectedOption as Responsavel)
                    }
                    options={
                      responsaveis
                        ? responsaveis.map((responsavel) => ({
                            label: `${responsavel.registration} - ${responsavel.name}`,
                            value: responsavel.registration,
                            name: responsavel.name,
                            registration: responsavel.registration,
                            email: responsavel.email,
                          }))
                        : []
                    }
                    isSearchable
                    placeholder="Digite ou selecione um funcionário"
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
                  value={selectedResponsavel?.name || ""}
                  onChange={(e) =>
                    setSelectedResponsavel((prev) => ({
                      ...prev,
                      name: e.target.value,
                      registration: prev?.registration || 0,
                      email: prev?.email || '',
                    }))
                  }
                  className={styles.input}
                  disabled={!selectedResponsavel}
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
                    value={selectedResponsavel?.email || ""}
                    className={styles.input}
                    disabled={!selectedResponsavel}
                    onChange={(e) =>
                      setSelectedResponsavel((prev) => ({
                        ...prev,
                        name: prev?.name || '',
                        registration: prev?.registration || 0,
                        email: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
            <div className={styles.botoesInferiores}>
              <p
                className={styles.estiloBotao}
                onClick={editarFuncionario}
              >
                Salvar Alterações
              </p>
              <p className={styles.estiloBotaoExcluir} onClick = {excluirResponsavel}>Excluir Funcionário</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditarResponsavel;
