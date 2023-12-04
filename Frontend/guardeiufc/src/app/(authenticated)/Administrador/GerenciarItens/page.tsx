"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import Select from "react-select";
import { axios } from "@/config/axios";
import { AxiosResponse, AxiosError } from "axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface PatrimonioItem {
  numberOfPatrimony: number;
  name: string;
  locationId: number;
  projectId: number;
  description: string;
  responsibleRegistration: number;
  imageName: string;
}

interface FormData {
  matricula: string;
  nome: string;
  descricao: string;
  numero: string;
}

interface ItemOpcao {
  value: number;
  label: string;
}
interface Responsavel {
  registration: number;
  name: string;
}
interface Projeto {
  name: string;
  coordinatorRegistration: number;
  id: number;
}
interface ErrorResponse {
  message?: string;
  mensagem?: string;
}

interface Local {
  id: number;
  departmentBuilding: string;
  room: string;
  value: number;
}

export default function Home() {
  const [showCreate, setShowCreate] = useState(false);
  const [showEditDelete, setShowEditDelete] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedLocal, setSelectedLocal] = useState<Local | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [patrimonios, setPatrimonios] = useState<PatrimonioItem[]>([]);

  const [localizacoes, setLocalizacoes] = useState<Local[]>([
    { id: 1, departmentBuilding: "", room: "", value: 0 },
  ]);
  const [formData, setFormData] = useState<FormData>({
    matricula: "",
    nome: "",
    descricao: "",
    numero: "",
  });

  const [selectedItem, setSelectedItem] = useState<ItemOpcao | null>(null);
  const [selectedResponsavel, setSelectedResponsavel] =
    useState<Responsavel | null>(null);
  const [selectedProjeto, setSelectedProjeto] = useState<Projeto>({
    name: "",
    coordinatorRegistration: 0,
    id: 0,
  });

  const [selectedItemData, setSelectedItemData] =
    useState<PatrimonioItem | null>({
      numberOfPatrimony: 0,
      name: "",
      locationId: 0,
      projectId: 0,
      description: "",
      responsibleRegistration: 0,
      imageName: "",
    });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Lógica para lidar com a mudança nos campos de entrada
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [projetos, setProjetos] = useState<Projeto[]>([
    { id: 0, name: "", coordinatorRegistration: 1 },
  ]);

  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([
    {
      registration: 1,
      name: "",
    },
  ]);

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

  const validateData = (nome: string, descricao: string, matricula: string) => {
    if (nome == "" || descricao == "" || matricula == "") {
      return false;
    }
    return true;
  };

  const limparCampos = () => {
    setFormData({
      matricula: "",
      nome: "",
      descricao: "",
      numero: "",
    });
    setSelectedResponsavel(null);
    setSelectedLocal(null);
    setSelectedItem(null);
    setSelectedItemData(null);
    setSelectedImage(null);
    setSelectedProjeto({
      name: "",
      coordinatorRegistration: 0,
      id: 0,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const camposPreenchidos = () => {
    return (
      selectedItemData?.name.trim() !== "" &&
      selectedItemData?.description.trim() !== "" &&
      !isNaN(selectedItemData?.locationId || NaN)
    );
  };

  // Cadastro de item
  const handleCadastrar = function (): void {
    const dataIsValid = validateData(
      formData.nome,
      formData.descricao,
      formData.matricula
    );
    if (!dataIsValid || !selectedLocal) {
      Swal.fire({
        icon: "warning",
        text: "Os campos marcados com * são de preenchimento obrigatório!",
      });
      return;
    }
    const newFormData = new FormData();
    // Adicionar os dados do formulário ao objeto FormData
    newFormData.append("numberOfPatrimony", formData.matricula.toString());
    newFormData.append("name", formData.nome);
    newFormData.append("description", formData.descricao);
    newFormData.append("locationId", selectedLocal?.id.toString());

    if (selectedResponsavel && selectedResponsavel.registration) {
      newFormData.append(
        "responsibleRegistration",
        selectedResponsavel.registration.toString()
      );
    }
    if (selectedProjeto && selectedProjeto.id) {
      newFormData.append("projectId", selectedProjeto?.id.toString());
    }
    if (selectedImage) {
      newFormData.append("image", selectedImage);
    }

    axios
      .post("/item", newFormData, {
        headers: { Accept: "*/*", "Content-Type": `multipart/form-data` },
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
        } else if (error.response?.status == 403) {
          Swal.fire({
            icon: "error",
            text: "Faça login para cadastrar um novo item!",
          }).then(({ value }) => {
            if (value === true) {
              router.push("/TelaLogin");
            }
          });
        } else {
          Swal.fire({
            icon: "error",
            text: `Ocorreu um erro ao tentar fazer cadastro.\nCódigo do erro: ${error.response?.status}`,
          });
        }
        console.error(error);
      });
  };

  const handleSalvarAlteracoes = function (): void {
    if (!selectedItemData) {
      Swal.fire({
        icon: "warning",
        text: "Selecione um item para editar!",
      });
      return;
    }
    if (!camposPreenchidos()) {
      Swal.fire({
        icon: "warning",
        text: "Por favor, preencha todos os campos obrigatórios!",
      });
      return;
    }
    console.log(selectedItemData.locationId)
    const itemData = selectedItemData ?? {
      numberOfPatrimony: 0,
      name: "",
      locationId: 0,
      projectId: 0,
      description: "",
      responsibleRegistration: 0,
    };
    const newFormData = new FormData();
    // Adicionar os dados do formulário ao objeto FormData
    newFormData.append("name", itemData.name);
    newFormData.append("description", itemData.description);
    newFormData.append("locationId", itemData.locationId.toString());
    if (itemData.responsibleRegistration) {
      newFormData.append(
        "responsibleRegistration",
        itemData.responsibleRegistration.toString()
      );
    }
    if (itemData.projectId) {
      newFormData.append("projectId", itemData.projectId.toString());
    }

    axios
      .put(`/item/${itemData.numberOfPatrimony}`, newFormData, {
        headers: { Accept: "*/*", "Content-Type": `multipart/form-data` },
      })
      .then((response: AxiosResponse) => {
        if (response.status == 200) {
          Swal.fire({
            icon: "info",
            text: "Item alterado com sucesso!",
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
        } else if (error.response?.status == 403) {
          Swal.fire({
            icon: "error",
            text: "Faça login para cadastrar um novo item!",
          }).then(({ value }) => {
            if (value === true) {
              router.push("/TelaLogin");
            }
          });
        } else {
          Swal.fire({
            icon: "error",
            text: `Ocorreu um erro ao tentar fazer cadastro.\nCódigo do erro: ${error.response?.status}`,
          });
        }
        console.error(error);
      });
  };

  const handleBuscarItem = () => {
    // Verifica se o número do item foi fornecido no campo de entrada
    const numeroDoItem = Number(formData.numero);
    if (!numeroDoItem) {
      Swal.fire({
        icon: "warning",
        text: "Digite um número válido para buscar o item.",
      });
      return;
    }
    axios
      .get(`/item/${numeroDoItem}`)
      .then((response: AxiosResponse) => {
        if (response.status == 200) {
          const itemEncontrado = response.data.item;
          if (itemEncontrado) {
            setSelectedItem({
              value: itemEncontrado.id,
              label: itemEncontrado.nome,
            });
            setSelectedItemData(itemEncontrado);
          } else {
            Swal.fire({
              icon: "info",
              text: "Item não encontrado com o número fornecido.",
            });
          }
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar o item:", error);
        Swal.fire({
          icon: "error",
          text: "Ocorreu um erro ao buscar o item. Tente novamente.",
        });
      });
  };

  const handleExcluirItem = () => {
    // Verifica se o número do item foi fornecido no campo de entrada
    const numeroDoItem = Number(selectedItemData?.numberOfPatrimony);
    if (!numeroDoItem) {
      Swal.fire({
        icon: "warning",
        text: "Selecione um item para excluir!",
      });
      return;
    }
    axios
      .delete(`/item/${numeroDoItem}`)
      .then((response: AxiosResponse) => {
        if (response.status == 200) {
          Swal.fire({
            icon: "info",
            text: "Item excluído com sucesso!",
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
          }
        } else if (error.response?.status == 403) {
          Swal.fire({
            icon: "error",
            text: "Faça login para excluir um item!",
          }).then(({ value }) => {
            if (value === true) {
              router.push("/TelaLogin");
            }
          });
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
    axios
      .get("/project")
      .then((response) => {
        if (response.status == 200) {
          setProjetos(response.data.projects);
        }
      })
      .catch((error: AxiosError) => {
        if (error.response?.status == 403) {
          Swal.fire({
            icon: "error",
            text: "Faça login para gerar relatório de itens!",
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
    axios
      .get("/local")
      .then((response) => {
        if (response.status == 200) {
          setLocalizacoes(response.data.locations);
        }
      })
      .catch((error: AxiosError) => {
        if (error.response?.status == 403) {
          Swal.fire({
            icon: "error",
            text: "Faça login para acessar localizações!",
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

    axios
      .get("/item")
      .then((response) => {
        if (response.status === 200) {
          setPatrimonios(response.data.items);
        }
      })
      .catch((error: AxiosError) => {
        if (error.response?.status == 403) {
          Swal.fire({
            icon: "error",
            text: "Faça login para acessar items!",
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
  }, [showCreate, selectedResponsavel, selectedLocal, selectedProjeto]);

  return (
    <div>
      <div className={styles.main}>
        <div className={styles.Principal}>
          <p className={styles.estilotitulo}>Gerenciar Itens do Patrimônio</p>
          <div className={styles.EspacoBotoes}>
            <div className={styles.botoes}>
              <button
                className={`${styles.EstilobotaoMenu} ${
                  showCreate ? styles.buttonSelected : styles.buttonUnselected
                }`}
                onClick={telaCriacaoClicada}
              >
                Cadastrar Item
              </button>
              <button
                className={`${styles.EstilobotaoMenu} ${
                  showEditDelete
                    ? styles.buttonSelected
                    : styles.buttonUnselected
                }`}
                onClick={telaEdicaoClicada}
              >
                Editar/Excluir Item
              </button>
            </div>
            <div className={styles.conteudo}>
              {showCreate && (
                <div className={styles.containerPrincipalCriacao}>
                  <div className={styles.containerCriacao}>
                    <div className={styles.divisao}>
                      <div className={styles.inputContainer1}>
                        <p className={styles.Nomes}>Número de patrimônio*</p>
                        <input
                          type="number"
                          id="id"
                          name="matricula"
                          placeholder="Digite o número de patrimônio"
                          className={styles.input}
                          tabIndex={0}
                          value={formData.matricula}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className={styles.inputContainer2}>
                        <p className={styles.Nomes}>Nome*</p>
                        <input
                          type="text"
                          id="nome"
                          name="nome"
                          placeholder="Digite o nome do item"
                          className={styles.input}
                          value={formData.nome}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className={styles.divisao}>
                      <div className={styles.inputContainer2}>
                        <p className={styles.Nomes}>Localização*</p>
                        <Select
                          value={selectedLocal}
                          onChange={(selectedOption) =>
                            setSelectedLocal(selectedOption as Local)
                          }
                          options={localizacoes.map((localizacao) => ({
                            label: `${localizacao.departmentBuilding} - ${localizacao.room}`,
                            value: localizacao.id,
                            departmentBuilding: localizacao.departmentBuilding,
                            room: localizacao.room,
                            id: localizacao.id,
                          }))}
                          isSearchable
                          placeholder="Digite ou selecione um local"
                          noOptionsMessage={() => "Nenhuma opção disponível"}
                        />
                      </div>
                      <div className={styles.inputContainer2}>
                        <p className={styles.Nomes}>Projeto Vinculado</p>
                        <Select
                          value={selectedProjeto}
                          onChange={(selectedOption) => {
                            setSelectedProjeto(selectedOption as Projeto);
                          }}
                          options={projetos.map((projeto) => ({
                            label: `${projeto.name}`,
                            value: projeto.id,
                            id: projeto.id,
                            name: projeto.name,
                            coordinatorRegistration:
                            projeto.coordinatorRegistration,
                          }))}
                          isSearchable
                          placeholder="Selecione um projeto"
                          noOptionsMessage={() => "Nenhuma opção disponível"}
                        />
                      </div>
                    </div>
                    <div className={styles.divisao}>
                      <div className={styles.inputContainer}>
                        <p className={styles.Nomes}>Descrição</p>
                        <input
                          type="text"
                          id="descricao"
                          name="descricao"
                          placeholder="Informe uma descrição para o item"
                          className={styles.input}
                          value={formData.descricao}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className={styles.divisao}>
                      <div className={styles.inputContainer2}>
                        <p className={styles.Nomes}>Responsável</p>
                        <Select
                          value={selectedResponsavel}
                          onChange={(selectedOption) =>
                            setSelectedResponsavel(
                              selectedOption as Responsavel
                            )
                          }
                          options={
                            responsaveis
                              ? responsaveis.map((responsavel) => ({
                                  label: `${responsavel.registration} - ${responsavel.name}`,
                                  value: responsavel.registration,
                                  name: responsavel.name,
                                  registration: responsavel.registration,
                                }))
                              : []
                          }
                          isSearchable
                          placeholder="Selecione um responsável"
                          noOptionsMessage={() => "Nenhuma opção disponível"}
                        />
                      </div>
                      <div className={styles.inputContainer2}>
                        <p className={styles.Nomes}>Imagem do Item</p>
                        <input
                          type="file"
                          name="imagem"
                          accept="image/*"
                          className={styles.input}
                          ref={fileInputRef}
                          onChange={(e) =>
                            setSelectedImage(e.target.files?.[0] || null)
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles.botoesInferiores}>
                    <p className={styles.estiloBotao} onClick={handleCadastrar}>
                      Salvar Alterações
                    </p>
                  </div>
                </div>
              )}
              {showEditDelete && (
                <div className={styles.ContainerPrincipalEdicao}>
                  <div className={styles.containerBuscar}>
                    <div className={styles.divisao}>
                      <div className={styles.inputContainer}>
                        <p className={styles.Nomes}>Selecione um item</p>
                        <Select
                          value={selectedItem}
                          onChange={(selectedOption) => {
                            const selectedItemValue =
                              selectedOption as ItemOpcao;
                            setSelectedItem(selectedItemValue);
                            // Encontrar os dados do item selecionado na lista completa
                            const selectedPatrimonio = patrimonios.find(
                              (item) =>
                                item.numberOfPatrimony ===
                                selectedItemValue.value
                            );
                            // Definir os dados do item selecionado
                            setSelectedItemData(selectedPatrimonio || null);
                          }}
                          options={patrimonios.map((patrimonio) => ({
                            label:`${patrimonio.numberOfPatrimony} - ${patrimonio.name}`,
                            value: patrimonio.numberOfPatrimony,
                          }))}
                          isSearchable
                          placeholder="Digite e selecione um item"
                          noOptionsMessage={() => "Nenhum item disponível"}
                        />
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
                          placeholder="Número do patrimônio"
                          className={styles.input}
                          value={selectedItemData?.numberOfPatrimony || ""}
                          readOnly
                        />
                      </div>
                      <div className={styles.inputContainer2}>
                        <p className={styles.Nomes}>Nome*</p>
                        <input
                          type="text"
                          id="nome"
                          name="name"
                          placeholder="Digite o nome do item"
                          className={styles.input}
                          disabled={!selectedItem}
                          value={selectedItemData?.name || ""}
                          onChange={(e) => {
                            setSelectedItemData(
                              (prevSelectedItemData): PatrimonioItem => ({
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
                        <p className={styles.Nomes}>Localização*</p>
                        <select
                          id="localizacao"
                          name="localizacao"
                          className={styles.input}
                          disabled={!selectedItem}
                          value={selectedItemData?.locationId || ""}
                          onChange={(e) => {
                            setSelectedItemData(
                              (prevSelectedItemData): PatrimonioItem => ({
                                ...prevSelectedItemData!,
                                locationId: parseInt(e.target.value, 10),
                              })
                            );
                          }}
                        >
                          <option value="">Selecione a localização</option>
                          {localizacoes.map((localizacao) => (
                            <option key={localizacao.id} value={localizacao.id}>
                              {localizacao.departmentBuilding} -{" "}
                              {localizacao.room}
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
                          disabled={!selectedItem}
                          value={selectedItemData?.projectId || ""}
                          onChange={(e) => {
                            setSelectedItemData(
                              (prevSelectedItemData): PatrimonioItem => ({
                                ...prevSelectedItemData!,
                                projectId: parseInt(e.target.value, 10),
                              })
                            );
                          }}
                        >
                          <option value="">
                            Selecione o projeto vinculado
                          </option>
                          {projetos.map((projeto) => (
                            <option key={projeto.id} value={projeto.id}>
                              {projeto.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className={styles.divisao}>
                      <div className={styles.inputContainer}>
                        <p className={styles.Nomes}>Descrição*</p>
                        <input
                          type="text"
                          id="descricao"
                          name="descricao"
                          placeholder="Informe uma descrição para o item"
                          className={styles.input}
                          disabled={!selectedItem}
                          value={selectedItemData?.description || ""}
                          onChange={(e) => {
                            setSelectedItemData(
                              (prevSelectedItemData): PatrimonioItem => ({
                                ...prevSelectedItemData!,
                                description: e.target.value,
                              })
                            );
                          }}
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
                          disabled={!selectedItem}
                          value={
                            selectedItemData?.responsibleRegistration || ""
                          }
                          onChange={(e) => {
                            setSelectedItemData(
                              (prevSelectedItemData): PatrimonioItem => ({
                                ...prevSelectedItemData!,
                                responsibleRegistration: parseInt(
                                  e.target.value,
                                  10
                                ),
                              })
                            );
                          }}
                        >
                          <option value="">
                            Selecione o responsável pelo projeto
                          </option>
                          {responsaveis.map((responsavel) => (
                            <option
                              key={responsavel.registration}
                              value={responsavel.registration}
                            >
                              {responsavel.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className={styles.inputContainer2}>
                        <p className={styles.Nomes}>Imagem do Item</p>
                        <input
                          type="file"
                          name="imagem"
                          disabled={!selectedItem}
                          accept="image/*"
                          className={styles.input}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles.botoesInferiores}>
                    <p
                      className={styles.estiloBotao}
                      onClick={handleSalvarAlteracoes}
                    >
                      Salvar Alterações
                    </p>
                    <p
                      className={styles.estiloBotaoExcluir}
                      onClick={handleExcluirItem}
                    >
                      Excluir item
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
