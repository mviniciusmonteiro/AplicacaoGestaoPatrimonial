"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Tabela, { Item } from "@/components/Table/page";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader/page";
import { axios } from '@/config/axios';
import { AxiosError } from "axios";
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

interface Employee {
  registration: number;
  name: string;
}

interface ResponseLocalReq {
  locations: Local[];
}

interface ResponseProjectReq {
  projects: Project[];
}

interface ResponseEmployeeReq {
  employees: Employee[];
}

export default function GerarRelatorios() {
  const router = useRouter();
  const [localizacoes, setLocalizacoes] = useState<Local[]>([{
    id: 0,
    departmentBuilding: '',
    room: ''
  }]);
  const [projetos, setProjetos] = useState<Project[]>([{
    id: 0,
    name: ''
  }]);
  const [funcionarios, setFuncionarios] = useState<Employee[]>([{
    registration: 0,
    name: ''
  }]);
  const [formData, setFormData] = useState<Item>({
    numberOfPatrimony: null,
    name: null,
    description: null,
    locationId: null,
    projectId: null,
    responsibleRegistration: null
  });
  const [filteredItems, settFilteredItems] = useState<Item[]>([{
    numberOfPatrimony: null,
    name: null,
    description: null,
    locationId: null,
    projectId: null,
    responsibleRegistration: null
  }]);
  const [loader, setLoader] = useState(true);
  const [numFieldIsValid, setNumFieldIsValid] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [tabelaVisivel, setTabelaVisivel] = useState(false);

  const handleValidateNumericField = (number: string) => {
    setNumFieldIsValid(/^[0-9]*$/.test(number));
  }

  const handleFilterItems = () => {
    alert(`Filtrar itens com parâmetros:\nnúmero patrimonio: ${formData.numberOfPatrimony}\nnome: ${formData.name}\ndescrição: ${formData.description}\nlocalização: ${formData.locationId}\nprojeto: ${formData.projectId}\nresponsável: ${formData.responsibleRegistration}`);
  }

  useEffect(() => {
    // Obtendo todos os locais
    axios.get<ResponseLocalReq>('/local')
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
    axios.get<ResponseProjectReq>('/project')
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
    // Obtendo todos os funcionários
    axios.get<ResponseEmployeeReq>('/employee')
    .then(response => {
      if (response.status == 200) {
        setFuncionarios(response.data.employees);
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
              Deixe o componente vazio para não considerá-lo na
              busca.
            </p>
            <div className={styles.ContainerPrincipalEdicao}>
              <div className={styles.containerEdicao}>
                <div className={styles.divisao}>
                  <div className={styles.inputContainer1}>
                    <p className={styles.Nomes}>Número do patrimônio</p>
                    <input
                      type="text"
                      id="numberOfPatrimony"
                      name="id"
                      placeholder="Filtrar número do patrimônio"
                      className={styles.input}
                      onChange={(e) => {
                          setNotFound(false);
                          setTabelaVisivel(false);                        
                          const {id, value} = e.target;
                          handleValidateNumericField(value);
                          setFormData((prevFormData) => ({
                            ...prevFormData,
                            [id]: value
                          }));
                        }
                      }
                    />
                  </div>
                  <div className={styles.inputContainer2}>
                    <p className={styles.Nomes}>Nome</p>
                    <input
                      type="text"
                      id="name"
                      name="nome"
                      placeholder="Filtrar nome do item"
                      className={styles.input}
                      onChange={(e) => {
                          setNotFound(false);
                          setTabelaVisivel(false);
                          const { id, value } = e.target;                      
                          setFormData((prevFormData) => ({
                            ...prevFormData,
                            [id]: value
                          }));
                        }
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
                      className={styles.input}
                      onChange={(e) => {
                          setNotFound(false);
                          setTabelaVisivel(false);
                          const { id, value } = e.target;
                          setFormData((prevFormData) => ({
                            ...prevFormData,
                            [id]: value
                          }));
                        }
                      }
                    >
                      <option value="">Selecione a localização</option>
                      {localizacoes.map((localizacao: Local) => (
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
                      className={styles.input}
                      onChange={(e) => {
                          setNotFound(false);
                          setTabelaVisivel(false);
                          const { id, value } = e.target;
                          setFormData((prevFormData) => ({
                            ...prevFormData,
                            [id]: value
                          }));
                        }
                      }
                    >
                      <option value="">Selecione o projeto vinculado</option>
                      {projetos.map((projeto) => (
                        <option key={projeto.id} value={projeto.id}>
                          {projeto.id} - {projeto.name}
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
                      id="description"
                      name="descricao"
                      placeholder="Informe uma descrição para o patrimônio"
                      className={styles.input}
                      onChange={(e) => {
                          setNotFound(false);
                          setTabelaVisivel(false);
                          const { id, value } = e.target;
                          setFormData((prevFormData) => ({
                            ...prevFormData,
                            [id]: value
                          }));
                        }
                      }
                    />
                  </div>
                </div>
                <div className={styles.divisao}>
                  <div className={styles.inputContainer2}>
                    <p className={styles.Nomes}>Responsável</p>
                    <select
                      id="responsibleRegistration"
                      name="responsavel"
                      className={styles.input}
                      onChange={(e) => {
                          setNotFound(false);
                          setTabelaVisivel(false);
                          const { id, value } = e.target;
                          setFormData((prevFormData) => ({
                            ...prevFormData,
                            [id]: value
                          }));
                        }
                      }
                    >
                      <option value="">
                        Selecione o responsável pelo projeto
                      </option>
                      {funcionarios.map((funcionario) => (
                        <option key={funcionario.registration} value={funcionario.registration}>
                          {`${funcionario.registration} - ${funcionario.name}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                { !numFieldIsValid && (
                  <div>
                    <p className={styles.sinalizadorCampoNumInvalido} tabIndex={0}>O campo número de patrimônio deve ser numérico!</p>
                  </div>
                )}
              </div>
              <div className={styles.botoesInferiores}>
                <p className={styles.estiloBotao} onClick={numFieldIsValid ? handleFilterItems : () => {}}>
                  Buscar itens
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
