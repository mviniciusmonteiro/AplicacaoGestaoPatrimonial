"use client";
import { useState } from "react";
import styles from "./page.module.css";

function SolicitarRelatorios() {

  const [descricao, setDescricao] = useState("");
  const [motivo, setMotivo] = useState("");

  const SolicitarRelatorio = () => {
    // Verifica se os campos foram preenchidos
    if (!descricao || !motivo) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    setDescricao("");
    setMotivo("");
    console.log("Campos não preenchidos:", { descricao, motivo });

  };
  return (
    <div>
      <div className={styles.main}>
        <div className={styles.estiloCadastro}>
          <p>Solicitar relatório mais detalhado</p>
        </div>
        <div className={styles.containersubtitulo}>
        <p className={styles.estilosubtitulo}>Solicite ao administrador um relatório mais detalhado, ou seja, que contenha itens que não estejam vinculados à sua matrícula<br /> A busca feita pelo administrador pode retornar quaisquer itens cadastrados</p>
        </div>
        <div className={styles.containerPrincipal}>
            <div className={styles.inputContainer}>
              <p className={styles.Nomes}>Descrição do relatório</p>
              <textarea
                id="descricao"
                name="descricao"
                placeholder="Detalhe o tipo de relatório que você deseja. Você pode, por exemplo, solicitar um relatório com todos os itens sem responsável definido e que estejam no bloco 910."
                className={styles.textarea}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>
            <div className={styles.inputContainer}>
              <p className={styles.Nomes}>Motivo da solicitação</p>
              <textarea
                id="motivo"
                name="motivo"
                placeholder="Explique os motivos pelos quais você necessita do relatório detalhado."
                className={styles.textarea}
                onChange={(e) => setMotivo(e.target.value)}
              />
            </div>
        </div>
        <div className={styles.botoesInferiores}>
          <p className={styles.estiloBotao} onClick={SolicitarRelatorio}>Solicitar relatório</p>
        </div>
      </div>
    </div>
  );
}

export default SolicitarRelatorios;