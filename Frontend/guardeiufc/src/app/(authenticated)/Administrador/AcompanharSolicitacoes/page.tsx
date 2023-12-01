"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import Loader from "@/components/Loader/page";
import { FaFilePdf } from "react-icons/fa6";

interface Item {
  matSolicitante: string;
  matRespondente: string;
  descricao: string;
  motivo: string;
  data: string;
  status: string;
  motivoIndeferimento: string;
}

export default function AcompanharRelatorios() {
  const [selectedOption, setSelectedOption] = useState("");
  const [visualizar, setVisualizar] = useState(false);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [loader, setLoader] = useState(true);
  const [selectedRequestStatus, setSelectedRequestStatus] = useState('');
  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
  };

  const [formState, setFormState] = useState({
    matricula: "",
    matriculaRespondente: "",
    nome: "",
    motivoS: "",
    descricaoR: "",
    dataResposta: "",
    motivoI: "",
    status: "",
  });

  const handleVisualizar = (row: Item) => {
    // Define o estado do formulário com os dados da linha clicada
    setFormState({
      matricula: row.matSolicitante,
      matriculaRespondente: row.matRespondente,
      nome: "",
      motivoS: row.motivo,
      descricaoR: row.descricao,
      dataResposta: row.data,
      motivoI: row.motivoIndeferimento,
      status: row.status,
    });
    setSelectedRequestStatus(row.status);
    setVisualizar(true);
  };

  const handleAction = (row: Item) => {
    //teste para o envio
    console.log(`Ação realizada para o solicitante ${row.matSolicitante}`);
    // Abre os contêineres do formulário
    handleVisualizar(row);
  };

  //Exemplo de dados para receber
  const [dados, setDados] = useState<Item[]>([
    {
      matSolicitante: "001",
      matRespondente: "002",
      descricao: "Relatório 1",
      motivo: "Motivo 1",
      data: "01/01/2023",
      status: "Pendente",
      motivoIndeferimento: "",
    },
    {
      matSolicitante: "002",
      matRespondente: "001",
      descricao: "Relatório 2",
      motivo: "Motivo 2",
      data: "02/01/2023",
      status: "Deferida",
      motivoIndeferimento: "",
    },
    {
      matSolicitante: "003",
      matRespondente: "001",
      descricao: "Relatório 3",
      motivo: "Motivo 3",
      data: "03/01/2023",
      status: "Indeferida",
      motivoIndeferimento: "Motivo indeferimento 3",
    },
  ]);

  const dadosFiltrados =
    selectedOption === "todas"
      ? dados
      : dados.filter((item) => {
          if (selectedOption === "pendentes") {
            return item.status.toLowerCase() === "pendente";
          } else if (selectedOption === "deferidas") {
            return item.status.toLowerCase() === "deferida";
          } else if (selectedOption === "indeferidas") {
            return item.status.toLowerCase() === "indeferida";
          }
          return false;
        });
  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    // Lógica para lidar com a mudança no campo de textarea
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Lógica para lidar com a seleção de arquivo
    const file = event.target.files?.[0];
    setArquivo(file || null);
  };

  const enviarRelatorio = () => {
    // Preparar os dados para envio
    const dadosParaEnvio = {
      ...formState,
      status: selectedOption, // Usar o status do radio button
      arquivo: arquivo, // Adicionar o arquivo
      motivoI: formState.motivoI
    };
    console.log("Dados para envio:", dadosParaEnvio);

    // Limpar o formulário
    setVisualizar(false);
  };

  useEffect(() => {
    alert('Enviar requisição GET para obter TODAS as solicitações de relatório');
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
            <p className={styles.estilotitulo}>
              Acompanhar Solicitações de Relatórios
            </p>
            <p className={styles.estilosubtitulo}>
              Visualize abaixo os relatórios solicitados por funcionários e
              responda às solicitações.
            </p>
            <div className={styles.radioGroup}>
              <label>
                <input
                  type="radio"
                  value="pendentes"
                  checked={selectedOption === "pendentes"}
                  onChange={() => handleOptionChange("pendentes")}
                />
                Pendentes
              </label>
              <label>
                <input
                  type="radio"
                  value="deferidas"
                  checked={selectedOption === "deferidas"}
                  onChange={() => handleOptionChange("deferidas")}
                />
                Deferidas
              </label>
              <label>
                <input
                  type="radio"
                  value="indeferidas"
                  checked={selectedOption === "indeferidas"}
                  onChange={() => handleOptionChange("indeferidas")}
                />
                Indeferidas
              </label>
              <label>
                <input
                  type="radio"
                  value="todas"
                  checked={selectedOption === "todas"}
                  onChange={() => handleOptionChange("todas")}
                />
                Todas
              </label>
            </div>
            <div className={styles.tabela}>
              <div className="table-responsive" style={{ overflowX: "auto" }}>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Solicitante</th>
                      <th>Descrição do Relatório</th>
                      <th>Motivo da Solicitação</th>
                      <th>Data Solicitação</th>
                      <th>Status</th>
                      <th>Motivo indeferimento</th>
                      <th>Acão</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dadosFiltrados.map((row, index) => (
                      <tr key={index}>
                        <td>{row.matSolicitante}</td>
                        <td>{row.descricao}</td>
                        <td>{row.motivo}</td>
                        <td>{row.data}</td>
                        <td>{row.status}</td>
                        <td>{row.motivoIndeferimento}</td>
                        <td>
                          <button onClick={() => handleAction(row)}>
                            Visualizar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
            {/* ÁREA DE VISUALIZAÇÃO: Mostra mais detalhes de uma solicitação específica */}
            {visualizar && (
              <div className={styles.containerDescricao}>
                <div className={styles.divisao}>
                  <div className={styles.inputContainer1}>
                    <p className={styles.Nomes}>Matrícula Solicitante</p>
                    <input
                      type="text"
                      id="matricula"
                      name="matricula"
                      className={styles.input}
                      readOnly
                      value={formState.matricula}
                    />
                  </div>
                </div>
                <p className={styles.Nomes}>Motivo da Solicitação</p>
                <input
                  type="text"
                  id="motivoS"
                  name="motivoS"
                  className={styles.input}
                  value={formState.motivoS}
                  readOnly
                />
                <p className={styles.Nomes}>Descrição do Relatório</p>
                <input
                  type="text"
                  id="descricaoR"
                  name="descricaoR"
                  className={styles.input}
                  value={formState.descricaoR}
                  readOnly
                />
                { selectedRequestStatus != 'Pendente' && (
                  <div className={styles.inputContainer1}>
                    <div className={styles.verticalContainer}>
                      <div className={styles.horizontalContainer}>
                        <p className={styles.Nomes}>Matrícula Respondente</p>
                        <input
                          type="text"
                          id="matriculaRespondente"
                          name="matriculaRespondente"
                          className={styles.input}
                          readOnly
                          value={formState.matriculaRespondente}
                        />
                      </div>
                      <div className={styles.horizontalContainer}>
                        <p className={styles.Nomes}>Data Resposta</p>
                        <input
                          type="text"
                          id="dataResposta"
                          name="dataResposta"
                          className={styles.input}
                          readOnly
                          value={formState.dataResposta}
                        />
                      </div>
                    </div>
                  </div>                  
                )}                
                {/* ÁREA DE INDEFERIMENTO: Mostra os detalhes do indeferimento da solicitação */}
                { selectedRequestStatus == 'Indeferida' && (
                  <div className='areaIndeferimento'>
                    <p className={styles.Nomes}>Motivo do Indeferimento</p>
                    <input
                      type="text"
                      id="motivoI"
                      name="motivoI"
                      className={styles.input}
                      value={formState.motivoI}
                      readOnly
                    />
                  </div>
                )}
                {/* ÁREA DE DEFERIMENTO: Mostra botão para baixar relatório anexado à solicitação */}
                { selectedRequestStatus == 'Deferida' && (
                    <div className={styles.areaDeferimento}>
                      <FaFilePdf className={styles.downloadIcon} onClick={() => alert('handleDownloadPDFReport')}/>
                      <p onClick={() => alert('handleDownloadPDFReport')}> Baixar relatório</p>
                    </div>
                )}
              </div>
            )} {/*FECHAMENTO DO CONTAINER DE VISUALIZAÇÃO /*}
            {/* ÁREA DE RESPOSTA: Mostra os campos de resposta à solicitação pendente */}
            { selectedRequestStatus == 'Pendente' && (
              <>
                <div className={styles.containerSecundario}>
                  <div className={styles.divisao}>
                    <div>
                      <p className={styles.Nomes}>Status</p>
                      <div className={styles.radioGroup}>
                        <label>
                          <input
                            type="radio"
                            value="solicitacaodeferida"
                            checked={selectedOption === "solicitacaodeferida"}
                            onChange={() =>
                              handleOptionChange("solicitacaodeferida")
                            }
                          />
                          Deferida
                        </label>
                        <label>
                          <input
                            type="radio"
                            value="solicitacaoindeferida"
                            checked={selectedOption === "solicitacaoindeferida"}
                            onChange={() =>
                              handleOptionChange("solicitacaoindeferida")
                            }
                          />
                          Indeferida
                        </label>
                      </div>
                    </div>
                    <div>
                      {/* Condicionalmente renderizar o input de arquivo */}
                      {selectedOption === "solicitacaodeferida" && (
                        <>
                          <p className={styles.Nomes}>Anexar relatório</p>
                          <input type="file" onChange={handleFileChange}></input>
                        </>
                      )}
                      {selectedOption === "solicitacaoindeferida" && (
                        <>
                          <p className={styles.Nomes}>Motivo do indeferimento</p>
                          <textarea
                            id="indeferimento"
                            name="motivoI"
                            className={styles.textareaEstilizado}
                            value={formState.motivoI}
                            onChange={handleTextareaChange}
                            ></textarea>
                        </>
                      )}
                    </div>
                  </div>                
                </div>
                <div className={styles.botoesInferiores}>
                  <p className={styles.estiloBotao} onClick={enviarRelatorio}>
                    Responder Solicitação
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
