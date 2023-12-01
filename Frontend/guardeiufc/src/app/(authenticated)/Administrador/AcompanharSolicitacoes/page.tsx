"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import Loader from "@/components/Loader/page";
import { FaFilePdf } from "react-icons/fa6";
import { PiMagnifyingGlassDuotone } from "react-icons/pi";
import Swal from "sweetalert2";
import { axios } from '@/config/axios';
import { AxiosResponse, AxiosError} from 'axios';
import { useRouter } from "next/navigation";
import fileDownload from 'js-file-download'

interface ReportRequest {
  requestedBy: string;
  answeredBy: string;
  description: string;
  motiveOfRequest: string;
  solicitedAt: string;
  answeredAt: string;
  status: string;
  motiveOfIndefer: string;
  filePath: string;
}

interface Response {
  filteredReportReq: ReportRequest[];
}

export default function AcompanharRelatorios() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState("");
  const [visualizar, setVisualizar] = useState(false);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [loader, setLoader] = useState(true);
  const [selectedRequestStatus, setSelectedRequestStatus] = useState('');
  const [newStatus, setNewStatus] = useState('Deferida');
  const [data, setData] = useState<ReportRequest[]>([{
    requestedBy: '',
    answeredBy: '',
    description: '',
    motiveOfRequest: '',
    solicitedAt: '',
    answeredAt: '',
    status: '',
    motiveOfIndefer: '',
    filePath: ''    
  }]);
  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
  };

  const [formState, setFormState] = useState({
    matricula: "",
    matriculaRespondente: "",
    motivoS: "",
    descricaoR: "",
    dataResposta: "",
    motivoI: "",
    status: "",
    nomeArquivo: ""
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

  const handleDownloadPDFReport = () => {
    const fileNameDownload = formState.nomeArquivo;

    axios.get(`/download-anexed-pdf/${fileNameDownload}`, { responseType: 'blob'})
    .then((response: AxiosResponse) => {
      if (response.status == 200) {
        fileDownload(response.data, fileNameDownload);
      }
    }).catch((error: AxiosError) => {
      if (error.response?.status == 403) {
        Swal.fire({
          icon: 'error',
          text: 'Faça login para baixar um relatório anexado a uma solicitação!'
        }).then(({value}) => {
          if (value === true) {
            router.push('/TelaLogin');
          }
        });
      } else {
        Swal.fire({
          icon: 'error',
          text: `Ocorreu um erro ao tentar baixar o relatório anexado. Por favor, tente novamente!\nCódigo do erro: ${error.response?.status}`
        });
      }
      console.error(error);        
    })    

  }

  const formatDate = (date: string) => {
    var date_ = new Date(date);
    return ((date_.getDate() )) + "/" + ((date_.getMonth() + 1)) + "/" + date_.getFullYear();
  }  

  const handleVisualizar = (row: ReportRequest) => {
    // Define o estado do formulário com os dados da linha clicada
    setFormState({
      matricula: row.requestedBy,
      matriculaRespondente: row.answeredBy,
      motivoS: row.motiveOfRequest,
      descricaoR: row.description,
      dataResposta: formatDate(row.answeredAt),
      motivoI: row.motiveOfIndefer,
      status: row.status,
      nomeArquivo: row.filePath
    });
    setSelectedRequestStatus(row.status);
    setSelectedRequestStatus(row.status);
    setVisualizar(true);
  }

  const handleGetReportByStatus = (status: string) => {
    setSelectedOption(status);
    setVisualizar(false);

    axios.get<Response>(`/report-request/${status}`)
    .then(response => {
      if (response.status == 200) {
        setData(response.data.filteredReportReq);
      }
    }).catch((error: AxiosError) => {
      if (error.response?.status == 403) {
        Swal.fire({
          icon: 'error',
          text: 'Faça login para visualizar as solicitações de relatórios!'
        }).then(({value}) => {
          if (value === true) {
            router.push('/TelaLogin');
          }
        });
      } else {      
        Swal.fire({
          icon: 'error',
          text: `Ocorreu um erro ao tentar buscar as solicitações. Por favor, tente novamente!\nCódigo do erro: ${error.response?.status}`
        });
      }
      console.error(error);
    });
  }

  useEffect(() => {
    handleGetReportByStatus('Todas');
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
                  value="Pendente"
                  checked={selectedOption == 'Pendente'}
                  onChange={() => handleGetReportByStatus('Pendente')}
                />
                Pendentes
              </label>
              <label>
                <input
                  type="radio"
                  value="Deferida"
                  checked={selectedOption == 'Deferida'}
                  onChange={() => handleGetReportByStatus('Deferida')}
                />
                Deferidas
              </label>
              <label>
                <input
                  type="radio"
                  value="Indeferida"
                  checked={selectedOption == "Indeferida"}
                  onChange={() => handleGetReportByStatus('Indeferida')}
                />
                Indeferidas
              </label>
              <label>
                <input
                  type="radio"
                  value="Todas"
                  checked={selectedOption == 'Todas'}
                  onChange={() => handleGetReportByStatus('Todas')}
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
                      <th>Motivo Indeferimento</th>
                      <th>Acão</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, index) => (
                      <tr key={index}>
                        <td>{row.requestedBy}</td>
                        <td>{row.description}</td>
                        <td>{row.motiveOfRequest}</td>
                        <td>{formatDate(row.solicitedAt)}</td>
                        <td>{row.status}</td>
                        <td>{row.motiveOfIndefer}</td>
                        <td>
                        <div className={styles.areaVisualizar}>
                          <PiMagnifyingGlassDuotone className={styles.lupa} onClick={() => handleVisualizar(row)}/>
                        </div>
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
                      <FaFilePdf className={styles.downloadIcon} onClick={handleDownloadPDFReport}/>
                      <p onClick={handleDownloadPDFReport}> Baixar relatório</p>
                    </div>
                )}
              </div>
            )} {/*FECHAMENTO DO CONTAINER DE VISUALIZAÇÃO /*}
            {/* ÁREA DE RESPOSTA: Mostra os campos de resposta à solicitação pendente */}
            { visualizar && selectedRequestStatus == 'Pendente' && (
              <>
                <div className={styles.containerSecundario}>
                  <div className={styles.divisao}>
                    <div>
                      <p className={styles.Nomes}>Status</p>
                      <div className={styles.radioGroup}>
                        <label className={styles.Nomes}>
                          <input
                            type="radio"
                            value="solicitacaoDeferida"
                            checked={newStatus === "Deferida"}
                            onChange={() => setNewStatus('Deferida')}
                          />
                          Deferida
                        </label>
                        <label className={styles.Nomes}>
                          <input
                            type="radio"
                            value="solicitacaoIndeferida"
                            checked={newStatus === "Indeferida"}
                            onChange={() => setNewStatus('Indeferida')}
                          />
                          Indeferida
                        </label>
                      </div>
                    </div>
                    <div>
                      {/* Condicionalmente renderizar o input de arquivo */}
                      {newStatus === "Deferida" && (
                        <>
                          <p className={styles.Nomes}>Anexar relatório</p>
                          <input type="file" onChange={handleFileChange}></input>
                        </>
                      )}
                      {newStatus === "Indeferida" && (
                        <>
                          <p className={styles.Nomes}>Motivo do Indeferimento</p>
                          <textarea
                            id="indeferimento"
                            name="motivoI"
                            className={styles.textarea}
                            value={formState.motivoI}
                            placeholder="Informe o motivo da solicitação estar sendo indeferida"
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
