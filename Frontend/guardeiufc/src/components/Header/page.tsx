"use client";
import { useState } from "react";
import { FaCircleUser } from "react-icons/fa6";
import { FaUserEdit } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  const router = useRouter();

  const handleBackToHome = () => {
    router.push("/Administrador/TelaAdministrador");
  };

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
                <a href="/EditarPerfilAdm">
                  <FaUserEdit className={styles.iconMenu} />
                  Editar Perfil
                </a>
                <a href="/TelaInicial">
                  <CiLogout className={styles.iconMenu} />
                  Sair
                </a>
              </div>
            )}
          </div>
        </header>
      </div>
    </div>
  );
}
