"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Table from "react-bootstrap/Table";
import { FaFilePdf } from "react-icons/fa6";

interface Item {
  matSolicitante: string;
  descricao: string;
  motivo: string;
  data: string;
  status: string;
  motivoIndeferimento: string;
}

export default function AcompanharSolicitacoes() {
  const [selectedOption, setSelectedOption] = useState('');
  const [visualizar, setVisualizar] = useState(false);
  const [selectedRequestStatus, setSelectedRequestStatus] = useState('');

  const handleOptionChange = (status: string) => {
    setSelectedOption(status);
    alert(`Requisita à API as requisições com parâmetro de busca = ${status}`);
  };

  const [formState, setFormState] = useState({
    matricula: "",
    nome: "",
    motivoS: "",
    descricaoR: "",
    motivoI: "",
    status: "",
  });

  const handleVisualizar = (row: Item) => {
    // Define o estado do formulário com os dados da linha clicada
    setFormState({
      matricula: row.matSolicitante,
      nome: "",
      motivoS: row.motivo,
      descricaoR: row.descricao,
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

  const handleDownloadPDFReport = (filename: string) => {
    alert(`Enviar requisição para aixar arquivo com nome ${filename}`);
  }

  //Exemplo de dados para receber
  const [dados, setDados] = useState<Item[]>([
    {
      matSolicitante: "001",
      descricao: "Relatório 1",
      motivo: "Motivo 1",
      data: "01/01/2023",
      status: "Pendente",
      motivoIndeferimento: "",
    },
    {
      matSolicitante: "002",
      descricao: "Relatório 2",
      motivo: "Motivo 2",
      data: "02/01/2023",
      status: "Deferida",
      motivoIndeferimento: "",
    },
    {
      matSolicitante: "003",
      descricao: "Relatório 3",
      motivo: "Motivo 3",
      data: "03/01/2023",
      status: "Indeferida",
      motivoIndeferimento: "Motivo indeferimento 3",
    },
  ]);

  useEffect(() => {
    setSelectedOption('Todas');
    alert('Enviar requisição para obter todas as solicitações ao iniciar página');
  }, []);

  return (
    <div>
      <div className={styles.main}>
        <div className={styles.Principal}>
          <p className={styles.estilotitulo}>
            Acompanhar Solicitações de Relatórios
          </p>
          <p className={styles.estilosubtitulo}>
            Veja abaixo o status dos seus relatórios solicitados
          </p>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                value="pendentes"
                checked={selectedOption == 'Pendentes'}
                onChange={() => { handleOptionChange('Pendentes') }}
              />
              Pendentes
            </label>
            <label>
              <input
                type="radio"
                value="deferidas"
                checked={selectedOption == 'Deferidas'}
                onChange={() => { handleOptionChange('Deferidas') }}
              />
              Deferidas
            </label>
            <label>
              <input
                type="radio"
                value="indeferidas"
                checked={selectedOption == 'Indeferidas'}
                onChange={() => { handleOptionChange('Indeferidas') }}
              />
              Indeferidas
            </label>
            <label>
              <input
                type="radio"
                value="todas"
                checked={selectedOption == 'Todas'}
                onChange={() => { handleOptionChange('Todas') }}
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
                  {dados.map((row, index) => (
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
          {visualizar && (
            <div className={styles.ContainerPrincipalDescricao}>
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
                <p className={styles.Nomes}>Motivo da solicitação</p>
                <textarea
                  id="motivoS"
                  name="motivoS"
                  className={styles.textarea}
                  value={formState.motivoS}
                  readOnly
                />

                <p className={styles.Nomes}>Descrição do relatório</p>
                <textarea
                  id="descricaoR"
                  name="descricaoR"
                  className={styles.textarea}
                  value={formState.descricaoR}
                  readOnly
                />
                { selectedRequestStatus == 'Indeferida' && (
                <div className={'areaIndeferimento'}>
                  <p className={styles.Nomes}>Motivo do indeferimento</p>
                  <textarea
                    id="motivoI"
                    name="motivoI"
                    className={styles.textarea}
                    value={formState.motivoI}
                    readOnly
                  />
                </div>
                )}
                { selectedRequestStatus == 'Deferida' && (
                <div className={styles.areaDeferimento}>
                  <FaFilePdf className={styles.downloadIcon} onClick={() => handleDownloadPDFReport('Nome do relatório.pdf')}/>
                  <p onClick={() => handleDownloadPDFReport('Nome do relatório.pdf')}> Baixar relatório</p>
                </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
