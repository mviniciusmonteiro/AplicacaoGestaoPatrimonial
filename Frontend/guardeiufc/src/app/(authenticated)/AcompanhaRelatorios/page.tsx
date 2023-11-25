"use client";
import { useState } from "react";
import styles from "./page.module.css";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";

interface Item {
  matSolicitante: string;
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
  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
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
    setVisualizar(true);
  };

  const handleAction = (row: Item) => {
    // Implemente a lógica da ação aqui
    console.log(`Ação realizada para o solicitante ${row.matSolicitante}`);
    // Abre os contêineres do formulário
    handleVisualizar(row);
  };

  //Exemplo de dados para receber
  const [dados, setDados] = useState<Item[]>([
    {
      matSolicitante: "001",
      descricao: "Relatório 1",
      motivo: "Motivo 1",
      data: "01/01/2023",
      status: "pendente",
      motivoIndeferimento: "",
    },
    {
      matSolicitante: "002",
      descricao: "Relatório 2",
      motivo: "Motivo 2",
      data: "02/01/2023",
      status: "deferida",
      motivoIndeferimento: "",
    },
    {
      matSolicitante: "003",
      descricao: "Relatório 3",
      motivo: "Motivo 3",
      data: "03/01/2023",
      status: "indeferida",
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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Lógica para lidar com a mudança nos campos de entrada
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
    };
    console.log("Dados para envio:", dadosParaEnvio);

    // Limpar o formulário ou realizar ações adicionais, se necessário
    setVisualizar(false);
  };

  return (
    <div>
      <div className={styles.main}>
        <div className={styles.Principal}>
          <p className={styles.estilotitulo}>
            Acompanhar Solicitação de Relatórios
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
                  <div className={styles.inputContainer}>
                    <p className={styles.Nomes}>Nome do Solicitante</p>
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      className={styles.input}
                      readOnly
                      value={formState.nome}
                    />
                  </div>
                </div>
                <p className={styles.Nomes}>Motivo da solicitação</p>
                <input
                  type="text"
                  id="motivoS"
                  name="motivoS"
                  className={styles.input}
                  value={formState.motivoS}
                  readOnly
                />

                <p className={styles.Nomes}>Descrição do relatório</p>
                <input
                  type="text"
                  id="descricaoR"
                  name="descricaoR"
                  className={styles.input}
                  value={formState.descricaoR}
                  readOnly
                />

                <p className={styles.Nomes}>Motivo do indeferimento</p>
                <input
                  type="text"
                  id="motivoI"
                  name="motivoI"
                  className={styles.input}
                  value={formState.motivoI}
                  readOnly
                />
              </div>
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
                      <p className={styles.Nomes}>Anexar relatório</p>
                      <input type="file" onChange={handleFileChange}></input>
                    </div>
                  </div>
                  <div className={styles.botoesInferiores}>
                    <p className={styles.estiloBotao} onClick={enviarRelatorio}>
                      Enviar Relatório
                    </p>
                  </div>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
