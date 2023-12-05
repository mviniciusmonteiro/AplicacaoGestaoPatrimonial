"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Swal from "sweetalert2";
import { axios } from '@/config/axios';
import { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader/page";

interface FormData {
  registration: number | null;
  username: string;
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

interface ResponseUser {
  loggedUser: {
    registration: number;
    username: string;
    name: string;
    email: string;
  }
}

interface ErrorInfo {
  message: string;
}

function EditarPerfilFuncionario() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    registration: null,
    username: '',
    name: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  });
  const [passwordEquals, setPasswordEquals] = useState(true);
  const [loader, setLoader] = useState(true);
  const [changePassword, setChangePassword] = useState(false);

  const validateFormData = () => {
    if (changePassword) {
      if (formData.password == '' || formData.passwordConfirmation == '') {
        return false;
      }
    }
    if (formData.name == '' || formData.email == '' || formData.username == '') {
      return false;
    }
    return true;
  }

  const handleShowPasswordArea = () => {
    const passwordComponent = document.getElementById('password') as HTMLInputElement;
    const passwordConfirmComponent = document.getElementById('passwordConfirmation') as HTMLInputElement;
    // Limpa caixas de senha e confirmação de senha
    if (passwordComponent) {
      passwordComponent.value = '';
    }
    if (passwordConfirmComponent) {
      passwordConfirmComponent.value = '';
    }
    // Atualiza formData
    setFormData({
      ...formData,
      ...{ password: '', passwordConfirmation: '' }
    });
    setPasswordEquals(true);
    setChangePassword(!changePassword);
  }

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Lógica para lidar com a mudança nos campos de entrada
    const { name, value } = event.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if ((name == 'password' || name == 'passwordConfirmation')) {
      // Verificando se as senhas são iguais
      const inputPass = document.getElementsByName('password')[0] as HTMLInputElement;
      const inputPassConfirm = document.getElementsByName('passwordConfirmation')[0] as HTMLInputElement;
      if (inputPass.value.length == 0 || inputPass.value != inputPassConfirm.value) {
        setPasswordEquals(false);
      } else {
        setPasswordEquals(true);
      }
    }    
  }

  const handleUpdateProfile = () => {
    const dataIsValid = validateFormData();
    if (!dataIsValid) {
      Swal.fire({
        icon: 'warning',
        text: 'Os campos marcados com * são de preenchimento obrigatório!'
      });
      return;
    }

    const data = {
      username: formData.username,
      ...(changePassword && {password: formData.password}),
      name: formData.name,
      email: formData.email,
      isAdmin: false      
    }

    axios.put('/user', data).then((response: AxiosResponse) => {
      if (response.status == 200) {
        Swal.fire({
          icon: 'info',
          text: 'Dados atualizados com sucesso!'
        });
        setChangePassword(false);
      }
    }).catch((error: AxiosError) => {
      if (error.response?.status == 403) {
        Swal.fire({
          icon: 'error',
          text: 'Faça login para atualizar os dados do seu perfil!'
        }).then(({value}) => {
          if (value == true) {
            router.push('/TelaLogin');
          }
        });
      } else if (error.response?.status == 400) {
        // Obtém a mensagem enviada do back: necessário para obter qual foi a ocorrência que gerou o erro, uma vez que o erro 400 pode ser gerado por mais de um motivo
        const error_info  = error.response?.data as ErrorInfo;
        Swal.fire({
          icon: 'error',
          text: `${error_info.message}`
        });
      } else {
        Swal.fire({
          icon: 'error',
          text: `Ocorreu um erro ao tentar atualizar os dados do seu perfil!\nCódigo do erro: ${error.response?.status}`
        });
      }
      console.log(error);
    });
  }
  
  useEffect(() => {
    axios.get<ResponseUser>('/logged-user')
    .then(response => {
      if (response.status == 200) {
        const loggedUser = response.data.loggedUser;
        setFormData({
          registration: loggedUser.registration,
          username: loggedUser.username,
          name: loggedUser.name,
          email: loggedUser.email,
          password: '',
          passwordConfirmation: ''
        });
      }
    }).catch((error: AxiosError) => {
      if (error.response?.status == 403) {
        Swal.fire({
          icon: 'error',
          text: 'Faça login para atualizar os dados do seu perfil!'
        }).then(({value}) => {
          if (value == true) {
            router.push('/TelaLogin');
          }
        });
      } else {
        Swal.fire({
          icon: 'error',
          text: `Ocorreu um erro ao tentar atualizar os dados do seu perfil!\nCódigo do erro: ${error.response?.status}`
        });
        console.log(error);
      }
    });
    setLoader(false)
  }, []);

  return (
    <div>
      { loader && (
        <Loader></Loader>
      )}
      { !loader && (
        <div className={styles.main}>
          <div className={styles.estiloCadastro}>
            <p>Meus Dados</p>
          </div>
          <div className={styles.containerPrincipal}>
            <div className={styles.divisao}>
              <div className={styles.inputContainer1}>
                <p className={styles.Nomes}>Matrícula*</p>
                <input
                  type="text"
                  id="registration"
                  name="registration"
                  value={formData.registration ? formData.registration : ''}
                  tabIndex={0}
                  readOnly={true}
                  className={styles.input}
                />
              </div>
              <div className={styles.inputContainer2}>
                <p className={styles.Nomes}>Nome*</p>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  tabIndex={0}
                  placeholder="Digite seu nome"
                  onChange={handleChangeInput}
                  className={styles.input}
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
                  value={formData.email}
                  tabIndex={0}
                  placeholder="Digite seu email"
                  onChange={handleChangeInput}
                  className={styles.input}
                />
              </div>
              <div className={styles.inputContainer1}>
                <p className={styles.Nomes}>Nome de Usuário*</p>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  tabIndex={0}
                  placeholder="Digite seu nome de usuário"
                  onChange={handleChangeInput}
                  className={styles.input}
                />
              </div>
            </div>
            <div>
              <input name={'updatePassword'} checked={changePassword} type={'checkbox'} onChange={handleShowPasswordArea}></input>
              <label htmlFor='updatePassword' className={styles.Nomes}> Alterar Senha</label>
            </div>
            { changePassword && (
              <div className={styles.divisao}>
                <div className={styles.inputContainer}>
                  <p className={styles.Nomes}>Nova Senha*</p>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    tabIndex={0}
                    placeholder="Digite sua nova senha"
                    onChange={handleChangeInput}
                    className={styles.input}
                  />
                </div>
                <div className={styles.inputContainer}>
                  <p className={styles.Nomes}>Confirmar Senha*</p>
                  <input
                    type="password"
                    id="passwordConfirmation"
                    name="passwordConfirmation"
                    tabIndex={0}
                    placeholder="Confirme sua nova senha"
                    onChange={handleChangeInput}
                    className={styles.input}
                  />
                </div>
              </div>
            )}
            { !passwordEquals && (
                <div>
                  <p className={styles.sinalizadorDadosInvalidos}>As senhas não correspondem!</p>
                </div>
              )}
          </div>
          <div className={styles.botoesInferiores} tabIndex={0}>
            <p className={styles.estiloBotao} onClick={passwordEquals ? handleUpdateProfile : () => {}}>Salvar Alterações</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditarPerfilFuncionario;
