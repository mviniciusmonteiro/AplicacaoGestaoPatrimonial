// SidebarMenu.js
import React, { useState } from "react";
import { FaBars, FaHome, FaUser, FaCog } from "react-icons/fa";
import { VscFileSubmodule } from "react-icons/vsc";
import styles from "./page.module.css"; 
import {useRouter} from "next/navigation"

const SidebarMenu = () => {
  const [menuAberto, setMenuAberto] = useState(false);
  const router = useRouter()

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  return (
    <div className={`${styles.sidebar} ${menuAberto ? styles.menuAberto : ''}`}>
      <div className={styles.toggleBtn} onClick={toggleMenu}>
        <FaBars className={styles.iconMenu} />
      </div>
      <nav className={`${styles.menu} ${menuAberto ? styles.menuAberto : ""}`}>
        <div className={styles.espacoMenu}>
          <p className={styles.nomeMenu}>Menu</p>
        </div>
        <ul>
          <li onClick={() => router.push('/GerenciarItens')}>
            <VscFileSubmodule className = {styles.iconsMenu}/> Gerenciar itens do patrimônio
          </li>
          <li onClick={() => router.push('/GerenciarRelatorios')}>
            <FaUser /> Gerenciar relatórios de itens
          </li>
          <li onClick={() => router.push('/AcompanhaRelatorios')}>
            <FaCog /> Ver solicitações de relatórios
          </li>
          <li onClick={() => router.push('/GerenciarUsuarios')}>
            <FaCog /> Gerenciar usuários
          </li>
          <li>
            <FaCog /> Gerenciar localizações
          </li>
          <li>
            <FaCog /> Gerenciar projetos
          </li>
          <li>
            <FaCog /> Gerenciar responsáveis
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SidebarMenu;
