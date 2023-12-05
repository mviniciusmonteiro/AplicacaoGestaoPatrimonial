"use client";
import { useState } from "react";
import styles from "./page.module.css";
import Swal from "sweetalert2";
import { axios } from '@/config/axios';
import { AxiosResponse, AxiosError } from 'axios';
import { useRouter } from "next/navigation";

interface FormData {
  descricao: string;
  motivo: string;
}

function SolicitarRelatorios() {
  const [formData, setFormData] = useState<FormData>({ descricao: '', motivo: ''});
  const router = useRouter();

  const handleClear = () => {
    const descElement = document.getElementById('descricao') as HTMLTextAreaElement;
    const motiveElement= document.getElementById('motivo') as HTMLTextAreaElement;
    if (descElement) {
      descElement.value = '';
    }
    if (motiveElement) {
      motiveElement.value = '';
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Lógica para lidar com a mudança nos campos de entrada
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    event.target.value = value;
  }

  const validateData = (descricao: string) => {
    if (descricao == '') {
      return false;
    }
    return true;
  }

  const SolicitarRelatorio = () => {
    const dataIsValid = validateData(formData.descricao);
    if (!dataIsValid) {
      Swal.fire({
        icon: 'warning',
        text: 'Informe a descrição do relatório para realizar a solicitação!'
      });
      return;
    }

    axios.post('/report-request', {
      description: formData.descricao,
      motiveOfRequest: formData.motivo
    }).then((response: AxiosResponse) => {
      if (response.status == 201) {
        Swal.fire({
          icon: 'info',
          text: 'Solicitação de relatório cadastrada com sucesso!'
        });
        handleClear();
      }
    }).catch((error: AxiosError) => {
      if (error.response?.status == 403) {
        Swal.fire({
          icon: 'error',
          text: 'Faça login para solicitar relatório!'
        }).then(() => {
          handleClear();
          router.push('/TelaLogin');
        });
      } else {
        Swal.fire({
          icon: 'error',
          text: `Ocorreu um erro ao tentar cadastrar solicitação de relatório.\nCódigo do erro ${error.response?.status}`
        });
      }
      console.error(error);
    });
  };
  return (
    <div>
      <div className={styles.main}>
        <div className={styles.estiloCadastro}>
          <p>Solicitar Relatório Mais Detalhado</p>
        </div>
        <div className={styles.containersubtitulo}>
        <p className={styles.estilosubtitulo}>Solicite ao administrador um relatório mais detalhado, ou seja, que contenha itens que não estejam vinculados à sua matrícula ou que não estejam alocados a projetos que você coordena.<br/> A busca feita pelo administrador pode retornar quaisquer itens cadastrados.</p>
        </div>
        <div className={styles.containerPrincipal}>
            <div className={styles.inputContainer}>
              <p className={styles.Nomes}>Descrição do relatório*</p>
              <textarea
                id="descricao"
                name="descricao"
                tabIndex={0}
                placeholder="Detalhe o tipo de relatório que você deseja. Você pode, por exemplo, solicitar um relatório com todos os itens sem responsável definido e que estejam no LEC do bloco 910."
                className={styles.textarea}
                onChange={ handleInputChange }
              />
            </div>
            <div className={styles.inputContainer}>
              <p className={styles.Nomes}>Motivo da solicitação</p>
              <textarea
                id="motivo"
                name="motivo"
                tabIndex={0}
                placeholder="Explique os motivos pelos quais você necessita do relatório detalhado."
                className={styles.textarea}
                onChange={ handleInputChange }
              />
            </div>
        </div>
        <div className={styles.botoesInferiores}>
          <p tabIndex={0} className={styles.estiloBotao} onClick={SolicitarRelatorio}>Solicitar relatório</p>
        </div>
      </div>
    </div>
  );
}

export default SolicitarRelatorios;