"use client";
import { useState } from "react";
import { FaCircleUser } from "react-icons/fa6";
import { FaUserEdit } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { getStoredItem, removeStoredItem } from "@/config/localStorage";
import { axios } from '@/config/axios';
import { AxiosError, AxiosResponse } from "axios";
import Swal from "sweetalert2";

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };
  const router = useRouter();

  const handleBackToHome = () => {
    setMenuAberto(false);
    const userRole = getStoredItem('userRole');
    if (userRole == null) {
      router.push("/TelaLogin");
    } else if (userRole == 'admin') {
      router.push("/Administrador/TelaAdministrador");
    } else {
      router.push("/Usuario/TelaFuncionario");
    }
  };

  const handleGoToUpdateProfile = () => {
    setMenuAberto(false);
    const userRole = getStoredItem('userRole');
    if (userRole == null) {
      router.push("/TelaLogin");
    } else if (userRole == 'admin') {
      router.push("/Administrador/EditarPerfilAdmin");
    } else {
      router.push("/Usuario/EditarPerfilFuncionario");
    }
  }

  const handleLogoff = () => {
    axios.post('/logout')
    .then((response: AxiosResponse) => {
      if (response.status == 200) {
        removeStoredItem('userRole');
        router.push('/TelaLogin');
      }
    }).catch((error: AxiosError) => {
      if (error.response?.status == 403) {
        router.push('/TelaLogin');
      } else {
        Swal.fire({
          icon: 'error',
          text: `Ocorreu um erro ao tentar sair da sua conta. Tente novamente!\nCódigo do erro: ${error.response?.status}`
        });
        console.error(error);
      }
    });
  }

  return (
    <div>
      <div className={styles.main}>
        <header className={styles.fixedheader}>
          <div className={styles.titulo} onClick={handleBackToHome}>
            GuardeiUFC
          </div>
          <div className={styles.profileMenu}>
            <FaCircleUser className={styles.profileIcon} onClick={toggleMenu} />
            {menuAberto && (
              <div
                className={`${styles.menu} ${
                  menuAberto ? styles.menuaberto : ""
                }`}
              >
                <div onClick={ () => { handleGoToUpdateProfile() }}>
                  <FaUserEdit className={styles.iconMenu}/>
                  Editar Perfil
                </div>
                <div onClick={() => { handleLogoff() }}>
                  <CiLogout className={styles.iconMenu}/>
                  Sair
                </div>
              </div>
            )}
          </div>
        </header>
      </div>
    </div>
  );
}
