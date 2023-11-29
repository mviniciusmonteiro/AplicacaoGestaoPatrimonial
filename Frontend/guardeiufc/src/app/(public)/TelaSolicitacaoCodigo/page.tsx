"use client";
import { useState } from "react";
import styles from "./page.module.css";
import image from "/public/Computer login-rafiki (1).png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { axios } from '@/config/axios';
import { AxiosResponse,  AxiosError } from 'axios';

interface FormData {
    username: string;
    email: string;
  }

function TelaSolicitacaoCodigo() {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: ""
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

  const validateData = (username: String, email: String) => {
    if (username == '' || email == '') {
      return false;
    }
    return true;
  }

  const handleRequestCode = async () => {
    const dataIsValid = validateData(formData.username, formData.email);
    if (!dataIsValid) {
      Swal.fire({
        icon: 'warning',
        text: 'Informe nome de usuário e email para solicitar o código de recuperação de senha!'
      });
      return;
    }
    axios.post('/request-recovery-code', {
        username: formData.username,
        email: formData.email
      }).then((response: AxiosResponse) => {
        if (response.status == 200) {
          router.push('/TelaValidacaoCodigo');
        }
      }).catch((error: AxiosError) => {
        if (error.response?.status == 400) {
          Swal.fire({
            icon: 'error',
            text: 'Nome de usuário e/ou email não corresponde(m) aos dados cadastrados. Tente novamente!'
          });
        } else {
          Swal.fire({
            icon: 'error',
            text: `Ocorreu um erro ao tentar solicitar o código de recuperação.\nCódigo do erro: ${error.response?.status}`
          });
        }
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
          <h2 className={styles.titulo}>Solicitar Código de Recuperação de Senha</h2>
          <p className={styles.estilosubtitulo}>
            Preencha os campos de acordo com seu cadastro.
          </p>
          <form className={styles.dadosEntrada}>
            <p className={styles.nomes}>Nome de Usuário*</p>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              placeholder="Digite seu nome de usuário"
              onChange={handleInputChange}
              className={styles.input}
              tabIndex={0}
              required
            />
            <p className={styles.nomes}>Email*</p>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Digite seu email"
              value={formData.email}
              className={styles.input}
              onChange={handleInputChange}
              tabIndex={0}
              required
            />
            <p className={styles.estiloBotao} onClick={handleRequestCode} tabIndex={0}>Solicitar Código</p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TelaSolicitacaoCodigo;