"use client";
import { useState } from "react";
import styles from "./page.module.css";
import image from "/public/Computer login-rafiki (1).png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import Swal from "sweetalert2";

interface FormData {
  nome: string;
  senha: string;
}

function TelaLogin() {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    senha: "",
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

  const validateData = (username: String, password: String) => {
    if (username == '' || password == '') {
      return false;
    }
    return true;
  }

  const handleLogin = (): void => {
    const dataIsValid = validateData(formData.nome, formData.senha);
    if (!dataIsValid) {
      Swal.fire({
        icon: 'warning',
        text: 'Informe nome de usuário e senha para realizar login!'
      });
      return;
    }
    axios.post(process.env.NEXT_PUBLIC_BASE_URL + '/login', {
      username: formData.nome,
      password: formData.senha
    }).then((response) => {
      if (response.status == 200) {
        if (response.data.isAdmin) {
          router.push('/TelaAdministrador');
        } else {
          // router.push('/TelaComum');
        }
      }
    }).catch((error) => {
      if (error.response.status == 400) {
        Swal.fire({
          icon: 'error',
          text: 'Nome de usuário e/ou senha incorretos. Tente novamente!',
          footer: '<a href="/TelaSolicitarCodigo">Esqueceu sua senha?</a>'
        });
      } else {
        Swal.fire({
          icon: 'error',
          text: `Ocorreu um erro ao tentar fazer login.\nStatus do erro: (${error.response.status})`
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
          <h2 className={styles.titulo}>ENTRE NA SUA CONTA</h2>
          <div className={styles.dadosEntrada}>
            <p className={styles.Nomes}>Nome de Usuário</p>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              placeholder="Digite seu nome de usuário"
              onChange={handleInputChange}
              className={styles.input}
              tabIndex={0}
            />
            <p className={styles.Nomes}>Senha</p>
            <input
              type="password"
              id="senha"
              name="senha"
              placeholder="Digite sua senha"
              value={formData.senha}
              className={styles.input}
              onChange={handleInputChange}
              tabIndex={0}
            />
          </div>
          <div className={styles.botaoLogin} tabIndex={0}>
            <p className={styles.textoBotao} onClick={handleLogin}>Login</p>
          </div>
          <div className={styles.textosSaida}>
            <Link href = "/TelaSolicitarCodigo" tabIndex={0}>Esqueceu a senha?</Link>
            <br></br>
            <Link href = "/TelaCadastro" tabIndex={0}>Não possui uma conta? Cadastre-se</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TelaLogin;
