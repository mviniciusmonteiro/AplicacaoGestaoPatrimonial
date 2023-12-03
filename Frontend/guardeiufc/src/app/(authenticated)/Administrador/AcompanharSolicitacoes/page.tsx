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
import FormData from "form-data";

interface ReportRequest {
  id: string;
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
    id: '',
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
  const [formState, setFormState] = useState({
    id: "",
    matricula: "",
    matriculaRespondente: "",
    motivoS: "",
    descricaoR: "",
    dataResposta: "",
    motivoI: "",
    status: "",
    nomeArquivo: ""
  });

  const handleChangeNewStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setNewStatus(value);

    // Limpa caixa de indeferimento ou arquivo ao mudar o novo status
    if (id == 'Deferida') {
      // Limpa o arquivo
      setArquivo(null);
    } else {
      // Limpa caixa do indeferimento
      const motiveOfIndeferComp = document.getElementById(id) as HTMLInputElement;
      if (motiveOfIndeferComp) {
        motiveOfIndeferComp.value = '';
        // Atualiza o formulário
        setFormState({
          ...formState,
          ...{motivoI: ''}
        });
      }
    }
  }

  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
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

  const validateResponseData = () => {
    if (newStatus == 'Deferida') {
      // Se solicitação for deferida, anexar relatório pdf é obrigatório
      if (arquivo == null) {
        return false;
      }
    } else {
      // Se solicitação for indeferida, informar motivo é obrigatório
      if (formState.motivoI == '') {
        return false;
      }
    }
    return true;
  }

  const handleRespondToRequest = () => {
    const responseDataIsValid = validateResponseData();

    if (!responseDataIsValid) {
      if (newStatus == 'Deferida') {
        Swal.fire({
          icon: 'warning',
          text: 'Anexe um relatório em formato pdf para responder à solicitação!'
        });        
      } else {
        Swal.fire({
          icon: 'warning',
          text: 'Informe o motivo do indeferimento para responder à solicitação!'
        });
      }
      return;
    }
    // Seta os dados do body da requisição PUT (deve ser enviado num form-data)
    const data: FormData = new FormData();
    if (newStatus == 'Deferida') {
      data.append('report', arquivo, arquivo?.name);
    } else {
      data.append('motiveOfIndefer', formState.motivoI);
    }

    axios.put(`/respond-report-request/${formState.id}`, data, {
      headers: { "Accept": '*/*', "Content-Type": `multipart/form-data` }
    })
    .then((response: AxiosResponse) => {
      if (response.status == 200) {
        Swal.fire({
          icon: 'info',
          text: 'Solicitação de relatório respondida com sucesso!'
        }).then(value => {
          if (value) {
            // Atualiza a visualização das solicitações
            handleGetReportByStatus(selectedRequestStatus);            
          }
        });
      }
    }).catch((error: AxiosError) => {
      if (error.response?.status == 403) {
        Swal.fire({
          icon: 'error',
          text: 'Faça login como administrador para responder uma solicitação de relatório!'
        }).then(({value}) => {
          if (value === true) {
            router.push('/TelaLogin');
          }
        });
      } else {
        Swal.fire({
          icon: 'error',
          text: `Ocorreu um erro ao tentar responder a solicitação. Por favor, tente novamente!\nCódigo do erro: ${error.response?.status}`
        });
      }
      console.error(error);
    })
  }

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
          text: 'Faça login como administrador para baixar um relatório anexado a uma solicitação!'
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
      id: row.id,
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
    setNewStatus('Deferida'); // Restaura o novo status para o padrão
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
          text: 'Faça login como administrador para visualizar as solicitações de relatórios!'
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
                      <th>Ação</th>
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
                      <div className={styles.horizontalContainer2}>
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
                    <div>
                      <p className={styles.Nomes}>Status</p>
                      <div className={styles.radioGroup}>
                        <label className={styles.Nomes}>
                          <input
                            type="radio"
                            id="Deferida"
                            name="Deferida"
                            value="Deferida"
                            tabIndex={0}
                            checked={newStatus === "Deferida"}
                            onChange={handleChangeNewStatus}
                          />
                          Deferida
                        </label>
                        <label className={styles.Nomes}>
                          <input
                            type="radio"
                            id="Indeferida"
                            name="Indeferida"
                            value="Indeferida"
                            tabIndex={0}
                            checked={newStatus === "Indeferida"}
                            onChange={handleChangeNewStatus}
                          />
                          Indeferida
                        </label>
                      </div>
                    </div>
                    <div>
                      {/* Condicionalmente renderizar o input de arquivo */}
                      {newStatus === "Deferida" && (
                        <>
                          <p className={styles.Nomes}>Anexar relatório*</p>
                          <input id="chooseFile" type="file" onChange={handleFileChange} tabIndex={0}></input>
                        </>
                      )}
                      {newStatus === "Indeferida" && (
                        <>
                          <p className={styles.Nomes}>Motivo do Indeferimento*</p>
                          <textarea
                            id="indeferimento"
                            name="motivoI"
                            className={styles.textarea}
                            value={formState.motivoI}
                            tabIndex={0}
                            placeholder="Informe o motivo da solicitação estar sendo indeferida"
                            onChange={handleTextareaChange}
                            ></textarea>
                        </>
                      )}
                    </div>
                  </div>
                <div className={styles.botoesInferiores}>
                  <p className={styles.estiloBotao} onClick={handleRespondToRequest} tabIndex={0}>
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
