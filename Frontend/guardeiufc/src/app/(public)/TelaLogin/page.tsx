"use client";
import { useState } from "react";
import styles from "./page.module.css";
import image from "/public/Computer login-rafiki (1).png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

  const handleLogin = (): void => {
    // Simule uma verificação de login aqui
    if (formData.nome === "usuario" && formData.senha === "senha") {
      alert("Login bem-sucedido!");
      router.push("/TelaAdministrador");
    } else {
      alert("Nome de usuário ou senha inválidos. Tente novamente.");
    }
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
            />
            <p className={styles.Nomes}>Senha</p>
            <input
              type="text"
              id="senha"
              name="senha"
              placeholder="Digite sua senha"
              value={formData.senha}
              className={styles.input}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.botaoLogin}>
            <p className={styles.textoBotao} onClick={handleLogin}>Login</p>
          </div>
          <div className={styles.textosSaida}>
            <p>Esqueceu a senha?</p>
            <Link href = "/TelaCadastro">Não possui uma conta? Cadastre -se </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TelaLogin;
