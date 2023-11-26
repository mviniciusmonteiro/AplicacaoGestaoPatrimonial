"use client";
import { useState } from "react";
import styles from "./page.module.css";
import Tabela from "@/components/Table/page";

export default function SolicitarRelatorios() {

  const [localizacoes, setLocalizacoes] = useState([
    { id: 1, nome: "Localização 1", bloco: "Bloco 1", sala: "Sala 1" },
    { id: 2, nome: "Localização 2", bloco: "Bloco 2", sala: "Sala 2" },
  ]);

  const [tabelaVisivel, setTabelaVisivel] = useState(false);

  const [projetos, setProjetos] = useState([
    { id: 1, nome: "Projeto 1" },
    { id: 2, nome: "Projeto 2" },
  ]);

  const [responsavel, SetResponsavel] = useState([
    { id: 1, nome: "Rossana" },
    { id: 2, nome: "Trinta" },
  ]);

  const [formData, setFormData] = useState({
    id: "",
    nome: "",
    localizacao: "",
    projeto: "",
    descricao: "",
    responsavel: "",
  });

  const handleImprimirDados = () => {
    console.log("Dados do Formulário:", formData);
    setFormData({
      id: "",
      nome: "",
      localizacao: "",
      projeto: "",
      descricao: "",
      responsavel: "",
    });
    setTabelaVisivel(true);
  };

  const dadosExemplo = [
    {
      numeroPatrimonio: "001",
      nome: "Item A",
      descricao: "Descrição A",
      idLocalizacao: "L1",
      responsavel: "Usuario 1",
      idProjeto: "P1",
    },
    {
      numeroPatrimonio: "002",
      nome: "Item B",
      descricao: "Descrição B",
      idLocalizacao: "L2",
      responsavel: "Usuario 2",
      idProjeto: "P2",
    },
  ];

  return (
    <div>
      <div className={styles.main}>
  
        <div className={styles.Principal}>
          <p className={styles.estilotitulo}>Gerenciar Relatórios de Itens</p>
          <p className={styles.estilosubtitulo}>
            Informe abaixo os critérios de busca a serem utilizados.
            Deixe o componente vazio ou desmarcado para não considerá-lo na
            busca.
          </p>
          <div className={styles.ContainerPrincipalEdicao}>
            <div className={styles.containerEdicao}>
              <div className={styles.divisao}>
                <div className={styles.inputContainer1}>
                  <p className={styles.Nomes}>Número do patrimônio</p>
                  <input
                    type="text"
                    id="id"
                    name="id"
                    placeholder="Digite o número do patrimônio"
                    className={styles.input}
                    onChange={(e) =>
                      setFormData((prevFormData) => ({
                        ...prevFormData,
                        id: e.target.value,
                      }))
                    }
                    value={formData.id}
                  />
                </div>
                <div className={styles.inputContainer2}>
                  <p className={styles.Nomes}>Nome</p>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    placeholder="Digite o nome do patrimônio"
                    className={styles.input}
                    onChange={(e) =>
                      setFormData((prevFormData) => ({
                        ...prevFormData,
                        nome: e.target.value,
                      }))
                    }
                    value={formData.nome}
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
                    value={formData.localizacao}
                  >
                    <option value="">Selecione a localização</option>
                    {localizacoes.map((localizacao) => (
                      <option key={localizacao.id} value={localizacao.id}>
                        {localizacao.nome}
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
                    value={formData.projeto}
                  >
                    <option value="">Selecione o projeto vinculado</option>
                    {projetos.map((projeto) => (
                      <option key={projeto.id} value={projeto.id}>
                        {projeto.nome}
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
                    id="descricao"
                    name="descricao"
                    placeholder="Informe uma descrição para o patrimônio"
                    className={styles.input}
                    onChange={(e) =>
                      setFormData((prevFormData) => ({
                        ...prevFormData,
                        descricao: e.target.value,
                      }))
                    }
                    value={formData.descricao}
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
                    onChange={(e) =>
                      setFormData((prevFormData) => ({
                        ...prevFormData,
                        responsavel: e.target.value,
                      }))
                    }
                    value={formData.responsavel}
                  >
                    <option value="">
                      Selecione o responsável pelo projeto
                    </option>
                    {responsavel.map((responsavel) => (
                      <option key={responsavel.id} value={responsavel.id}>
                        {responsavel.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className={styles.botoesInferiores}>
              <p className={styles.estiloBotao} onClick={handleImprimirDados}>
                Buscar itens
              </p>
            </div>
            {tabelaVisivel && (
              <div className={styles.tabela}>
                <Tabela data={dadosExemplo}></Tabela>
                <p className={styles.estiloBotaoGerar}>Exportar Relatório</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
