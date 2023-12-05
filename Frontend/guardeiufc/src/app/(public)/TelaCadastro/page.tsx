"use client";
import { useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { axios } from '@/config/axios';
import { AxiosResponse, AxiosError } from 'axios';

interface FormData {
  matricula: string;
  nome: string;
  email: string;
  nomeUsuario: string;
  senha: string;
  senhaConfirmacao: string;
}

interface ErrorInfo {
  message: string;
}


function TelaCadastro() {
  const [formData, setFormData] = useState<FormData>({
    matricula: '',
    nome: '',
    email: '',
    nomeUsuario: '',
    senha: '',
    senhaConfirmacao: ''
  });
  const router = useRouter();
  const [numFieldIsValid, setNumFieldIsValid] = useState(true);
  const [passwordEquals, setPasswordEquals] = useState(true);

  const handleValidateNumericField = (number: string) => {
    setNumFieldIsValid(/^[0-9]*$/.test(number));
  }

  const validateData = (matricula: string, nome: string, email: string, nomeUsuario: string, senha: string, senhaConfirmacao: string) => {
    if (matricula == '' || nome == '' || email == '' || nomeUsuario == '' || senha == '' || senhaConfirmacao == '') {
      return false;
    }
    return true;
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Lógica para lidar com a mudança nos campos de entrada
    const { name, value } = event.target;
    if (name == 'matricula') {
      handleValidateNumericField(value);
    }
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if ((name == 'senha' || name == 'senhaConfirmacao')) {
      // Verificando se as senhas são iguais
      const inputPass = document.getElementsByName('senha')[0] as HTMLInputElement;
      const inputPassConfirm = document.getElementsByName('senhaConfirmacao')[0] as HTMLInputElement;
      if (inputPass.value.length == 0 || inputPass.value != inputPassConfirm.value) {
        setPasswordEquals(false);
      } else {
        setPasswordEquals(true);
      }
    }
  }

  const handleCadastrar = function(): void {
    const dataIsValid = validateData(formData.matricula, formData.nome, formData.email, formData.nomeUsuario, formData.senha, formData.senhaConfirmacao);
    if (!dataIsValid) {
      Swal.fire({
        icon: 'warning',
        text: 'Os campos marcados com * são de preenchimento obrigatório!'
      });
      return;
    }

    axios.post('/sign-up', {
      username: formData.nomeUsuario,
      password: formData.senha,
      registration: Number(formData.matricula),
      name: formData.nome,
      email: formData.email
    }).then((response: AxiosResponse) => {
      if (response.status == 201) {
        Swal.fire({
          icon: 'info',
          text: 'Cadastro realizado com sucesso!'
        }).then(() => { router.push('/TelaLogin'); });
      }
    }).catch((error: AxiosError) => {
      let mensagem = JSON.stringify(error.response?.data);
      let mensagemList = mensagem.split('"');
      if (error.response?.status == 400) {
        const error_info  = error.response?.data as ErrorInfo;
        Swal.fire({
          icon: 'error',
          text: `${error_info.message}`
        });
      } else {
        Swal.fire({
          icon: 'error',
          text: `Ocorreu um erro ao tentar fazer cadastro.\nCódigo do erro: ${error.response?.status}`
        });
      }
      console.error(error);
    });
  }  

  return (
    <div>
      <div className={styles.main}>
        <header className={styles.fixedheader}>
          <p className={styles.titulo}>GuardeiUFC</p>
        </header>
        <div className={styles.estiloCadastro}>
          <p>Cadastre-se</p>
        </div>
        <div className={styles.containerPrincipal}>
          <div className={styles.divisao}>
            <div className={styles.inputContainer1}>
              <p className={styles.Nomes}>Matrícula*</p>
              <input
                type="number"
                id="matricula"
                name="matricula"
                onChange={handleInputChange}
                placeholder="Digite sua matrícula"
                className={styles.input}
                tabIndex={0}
              />
            </div>
            <div className={styles.inputContainer2}>
              <p className={styles.Nomes}>Nome*</p>
              <input
                type="text"
                id="nome"
                name="nome"
                onChange={handleInputChange}
                placeholder="Digite seu nome"
                className={styles.input}
                tabIndex={0}
              />
            </div>
          </div>
          <div className={styles.divisao}>
            <div className={styles.inputContainer2}>
              <p className={styles.Nomes}>Email*</p>
              <input
                type="email"
                id="email"
                name="email"
                onChange={handleInputChange}
                placeholder="Digite seu email"
                className={styles.input}
                tabIndex={0}
              />
            </div>
            <div className={styles.inputContainer1}>
              <p className={styles.Nomes}>Nome de Usuário*</p>
              <input
                type="text"
                id="nomeUsuario"
                name="nomeUsuario"
                onChange={handleInputChange}
                placeholder="Digite seu nome de usuário"
                className={styles.input}
                tabIndex={0}
              />
            </div>
          </div>
          <div className={styles.divisao}>
            <div className={styles.inputContainer}>
              <p className={styles.Nomes}>Senha*</p>
              <input
                type="password"
                id="senha"
                name="senha"
                onChange={handleInputChange}
                placeholder="Digite sua senha"
                className={styles.input}
                tabIndex={0}
              />
            </div>
            <div className={styles.inputContainer}>
              <p className={styles.Nomes}>Confirmar Senha*</p>
              <input
                type="password"
                id="senhaConfirmacao"
                name="senhaConfirmacao"
                onChange={handleInputChange}
                placeholder="Confirme sua senha"
                className={styles.input}
                tabIndex={0}
              />
            </div>
          </div>
          <div>
            { !passwordEquals && (
              <div>
                <p className={styles.sinalizadorDadosInvalidos}>As senhas não correspondem!</p>
              </div>
            )}
            { !numFieldIsValid && (
              <div>
                <p className={styles.sinalizadorDadosInvalidos} tabIndex={0}>O campo número de patrimônio deve ser numérico!</p>
              </div>
            )}
          </div>
        </div>
        <div className={styles.botoesInferiores}>
          <p id={'btnCadastrar'} className={styles.estiloBotao} onClick={passwordEquals && numFieldIsValid  ? handleCadastrar : ()=>{}} tabIndex={0}>Criar Cadastro</p>
          <Link href = "/TelaLogin">Já possui uma conta? Entrar</Link>
        </div>
      </div>
    </div>
  );
}

export default TelaCadastro;
