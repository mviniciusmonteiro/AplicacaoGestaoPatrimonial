"use client";
import { useState } from "react";
import styles from "./page.module.css";
import image from "/public/Computer login-rafiki (1).png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { axios } from '@/config/axios';
import { AxiosResponse, AxiosError } from 'axios';

interface FormData {
    code: string;
}

function TelaValidacaoCodigo() {
  const [formData, setFormData] = useState<FormData>({
    code: ""
  });
  const router = useRouter();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Lógica para lidar com a mudança nos campos de entrada
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateData = (code: String) => {
    if (code == '') {
      return false;
    }
    return true;
  }

  const handleValidateCode = (): void => {
    const dataIsValid = validateData(formData.code);
    if (!dataIsValid) {
      Swal.fire({
        icon: 'warning',
        text: 'Informe o código de recuperação de senha!'
      });
      return;
    }
    axios.post(process.env.NEXT_PUBLIC_BASE_URL + '/validate-recovery-code', {
      code: formData.code
    }).then((response: AxiosResponse) => {
      if (response.status == 200) {
        router.push('/TelaAlteracaoSenha');
      }
    }).catch((error: AxiosError) => {
      if (error.response?.status == 400) {
        Swal.fire({
          icon: 'error',
          text: 'Código de recuperação de senha é inválido. Para tentar novamente solicite um novo código!'
        });
      } else {
        Swal.fire({
          icon: 'error',
          text: `Ocorreu um erro ao tentar validar código de recuperação de senha.\nCódigo do erro: ${error.response?.status}`
        });
      }
      router.push('/TelaSolicitacaoCodigo');
      console.error(error);
    });
  };

  return (
    <div>
      <div className={styles.main}>
        <div className={styles.imagemContainer}>
          <Image
            src={image}
            className={styles.image}
            objectFit="cover"
            fill
            alt="Imagem de Exemplo Login"
          />
        </div>
        <div className={styles.containerEntrada}>
          <h2 className={styles.titulo}>Validar Código de Recuperação de Senha</h2>
          <p className={styles.estilosubtitulo}>
            Informe o código de seis dígitos enviado para seu email.
          </p>
          <form className={styles.dadosEntrada}>
            <p className={styles.nomes}>Código</p>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              placeholder="Digite o código enviado por email"
              onChange={handleInputChange}
              className={styles.input}
              tabIndex={0}
              required
            />
            <p className={styles.estiloBotao} onClick={handleValidateCode} tabIndex={0}>Validar Código</p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TelaValidacaoCodigo;