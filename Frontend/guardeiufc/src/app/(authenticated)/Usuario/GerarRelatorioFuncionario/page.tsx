"use client";
import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import Tabela, { Item } from "@/components/Table/page";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader/page";
import { axios } from '@/config/axios';
import { AxiosError } from 'axios';
import Swal from "sweetalert2";

interface Local {
  id: number;
  departmentBuilding: string;
  room: string;
}

interface Project {
  id: number;
  name: string;
}

interface ResponseLocalReq {
  locations: Local[];
}

interface ResponseProjectReq {
  projects: Project[];
}

interface ResponseItemReq {
  items: Item[];
}

interface ParametersItemReq {
  numberOfPatrimony: string | null;
  name: string | null;
  description: string | null;
  locationId: number | null;
  projectId: number | null;
}

export default function SolicitarRelatorios() {
  const router = useRouter();
  const [loader, setLoader] = useState(true);
  const [localizacoes, setLocalizacoes] = useState<Local[]>([
    { id: 1, departmentBuilding: "", room: "" }
  ]);
  const [projetos, setProjetos] = useState<Project[]>([
    { id: 1, name: "" },
  ]);
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [formData, setFormData] = useState<Item>({
    numberOfPatrimony: null,
    name: null,
    description: null,
    locationId: null,
    responsibleRegistration: null,
    projectId: null
  });
  const [filteredItems, setFilteredItems] = useState<Item[]>([{
    numberOfPatrimony: null,
    name: null,
    description: null,
    locationId: null,
    responsibleRegistration: null,
    projectId: null
  }]);
  const [numFieldIsValid, setNumFieldIsValid] = useState(true);

  const handleValidateNumericField = (number: string) => {
    setNumFieldIsValid(/^[0-9]*$/.test(number));
  }

  const handleFilterItems = () => {
    const parameters = {
      ...(formData.numberOfPatrimony && { numberOfPatrimony: formData.numberOfPatrimony.toString() }),
      ...(formData.name && { name: formData.name }),
      ...(formData.description && { description: formData.description }),
      ...(formData.locationId && { locationId: formData.locationId }),
      ...(formData.projectId && { projectId: formData.projectId }),
      status: "1"
    }

    axios.get<ResponseItemReq>(process.env.NEXT_PUBLIC_BASE_URL + '/report/items/', { params: parameters }
    ).then(response => {
      if (response.status == 200) {
        setFilteredItems(response.data.items);
      }
      setTabelaVisivel(true);
    }).catch((error: AxiosError) => {
      if (error.response?.status == 403) {
        Swal.fire({
          icon: 'error',
          text: 'Faça login para gerar relatório de itens!'
        }).then(({value}) => {
          if (value == true) {
            router.push('/TelaLogin');
          }
        });
      } else {
        Swal.fire({
          icon: 'error',
          text: `Ocorreu um erro ao tentar gerar o relatório. Tente novamente!\nCódigo do erro: ${error.response?.status}`
        });
      }
      console.error(error);
    });
  }

  useEffect(() => {
    // Obtendo todos os locais
    axios.get<ResponseLocalReq>(process.env.NEXT_PUBLIC_BASE_URL + '/local')
    .then(response => {
      if (response.status == 200) {
        setLocalizacoes(response.data.locations);
      }
    }).catch((error: AxiosError) => {
      if (error.response?.status == 403) {
        Swal.fire({
          icon: 'error',
          text: 'Faça login para gerar relatório de itens!'
        }).then(({value}) => {
          if (value == true) {
            router.push('/TelaLogin');
          }
        });
      } else {
        Swal.fire({
          icon: 'error',
          text: `Ocorreu um erro ao tentar inicializar a tela. Tente novamente!\nCódigo do erro: ${error.response?.status}`
        });
      }
      console.error(error);
    });
    // Obtendo todos os projetos
    axios.get<ResponseProjectReq>(process.env.NEXT_PUBLIC_BASE_URL + '/project')
    .then(response => {
      if (response.status == 200) {
        setProjetos(response.data.projects);
      }
    }).catch((error: AxiosError) => {
      if (error.response?.status == 403) {
        Swal.fire({
          icon: 'error',
          text: 'Faça login para gerar relatório de itens!'
        }).then(({value}) => {
          if (value == true) {
            router.push('/TelaLogin');
          }
        });
      } else {
        Swal.fire({
          icon: 'error',
          text: `Ocorreu um erro ao tentar inicializar a tela. Tente novamente!\nCódigo do erro: ${error.response?.status}`
        });
      }
      console.error(error);
    });
    setLoader(false);
  }, []);

  return (
    <div>
      { loader && (
        <Loader></Loader>
      )}
      { !loader && (
        <div className={styles.main}>
    
          <div className={styles.Principal}>
            <p className={styles.estilotitulo}>Gerar Relatórios de Itens</p>
            <p className={styles.estilosubtitulo}>
              Informe abaixo os critérios de busca a serem utilizados.
              Deixe o componente vazio ou desmarcado para não considerá-lo na
              busca.
            </p>
            <div className={styles.ContainerPrincipalEdicao}>
              <div className={styles.containerEdicao}>
                <div className={styles.divisao}>
                  <div className={styles.inputContainer1}>
                    <p className={styles.Nomes}>Número de Patrimônio</p>
                    <input
                      type="number"
                      id="numberOfPatrimony"
                      name="id"
                      tabIndex={0}
                      placeholder="Filtrar número de patrimônio"
                      className={styles.input}
                      onChange={(e) => {
                        const { id, value } = e.target;
                        handleValidateNumericField(value);
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          [id]: value
                        }))}
                      }
                    />
                  </div>
                  <div className={styles.inputContainer2}>
                    <p className={styles.Nomes}>Nome</p>
                    <input
                      type="text"
                      id="name"
                      name="nome"
                      tabIndex={0}
                      placeholder="Filtrar nome do item"
                      className={styles.input}
                      onChange={(e) => {
                        const { id, value } = e.target;
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          [id]: value,
                        }))}
                      }
                    />
                  </div>
                </div>
                <div className={styles.divisao}>
                  <div className={styles.inputContainer2}>
                    <p className={styles.Nomes}>Localização</p>
                    <select
                      id="locationId"
                      name="localizacao"
                      tabIndex={0}
                      className={styles.input}
                      onChange={(e) => {
                        const { id, value } = e.target;
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          [id]: value,
                        }))}
                      }
                    >
                      <option value="">Selecione a localização</option>
                      {localizacoes.map((localizacao) => (
                        <option key={localizacao.id} value={localizacao.id}>
                          {`${localizacao.departmentBuilding} - ${localizacao.room}`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.inputContainer1}>
                    <p className={styles.Nomes}>Projeto Vinculado</p>
                    <select
                      id="projectId"
                      name="projeto"
                      tabIndex={0}
                      className={styles.input}
                      onChange={(e) => {
                        const { id, value } = e.target;
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          [id]: value,
                        }))}
                      }
                    >
                      <option value="">Selecione o projeto vinculado</option>
                      {projetos.map((projeto) => (
                        <option key={projeto.id} value={projeto.id}>
                          {`${projeto.id} - ${projeto.name}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className={styles.divisao}>
                  <div className={styles.inputContainer}>
                    <p className={styles.Nomes}>Descrição</p>
                    <textarea
                      id="description"
                      name="descricao"
                      tabIndex={0}
                      placeholder="Filtrar descrição do item"
                      className={styles.textarea}
                      onChange={(e) => {
                        const { id, value } = e.target;
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          [id]: value,
                        }))}
                      }
                    />
                  </div>
                </div>
                { !numFieldIsValid && (
                    <div>
                      <p className={styles.sinalizadorCampoNumInvalido} tabIndex={0}>O campo número de patrimônio deve ser numérico!</p>
                    </div>
                  )}
              </div>
              <div className={styles.botoesInferiores}>
                <p className={styles.estiloBotao} onClick={numFieldIsValid ? () => { handleFilterItems() } : () => {}}>
                  Buscar Itens
                </p>
              </div>
              {tabelaVisivel && (
                <div className={styles.tabela}>
                  <Tabela data={filteredItems}></Tabela>
                  <p className={styles.estiloBotaoGerar}>Exportar Relatório</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
