"use client";
import { useState, useEffect } from "react";
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
    numberOfPatrimony: 0,
    name: '',
    description: '',
    locationId: 0,
    responsibleRegistration: 0,
    projectId: 0
  });
  const [filteredItems, setFilteredItems] = useState<Item[]>([{
    numberOfPatrimony: 0,
    name: '',
    description: '',
    locationId: 0,
    responsibleRegistration: 0,
    projectId: 0
  }]);

  const handleFilterItems = () => {

    setTabelaVisivel(true);
  }

  useEffect(() => {
    // Obtendos todos os locais
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
    // Obtendos todos os projetos
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
                      type="text"
                      id="id"
                      name="id"
                      placeholder="Filtrar número de patrimônio"
                      className={styles.input}
                      onChange={(e) =>
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          id: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className={styles.inputContainer2}>
                    <p className={styles.Nomes}>Nome</p>
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      placeholder="Filtrar nome do item"
                      className={styles.input}
                      onChange={(e) =>
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          nome: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className={styles.divisao}>
                  <div className={styles.inputContainer2}>
                    <p className={styles.Nomes}>Localização</p>
                    <select
                      id="localizacao"
                      name="localizacao"
                      className={styles.input}
                      onChange={(e) =>
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          localizacao: e.target.value,
                        }))
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
                      id="projeto"
                      name="projeto"
                      className={styles.input}
                      onChange={(e) =>
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          projeto: e.target.value,
                        }))
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
                      id="descricao"
                      name="descricao"
                      placeholder="Filtrar descrição do item"
                      className={styles.textarea}
                      onChange={(e) =>
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          descricao: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
              <div className={styles.botoesInferiores}>
                <p className={styles.estiloBotao} onClick={() => { handleFilterItems }}>
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
