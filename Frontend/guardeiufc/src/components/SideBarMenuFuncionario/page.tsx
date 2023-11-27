import React, { useState } from "react";
import { FaBars} from "react-icons/fa";
import { TbReportSearch } from "react-icons/tb";
import { FaLaptopFile } from "react-icons/fa6";
import { TbReport } from "react-icons/tb";
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
          <li onClick={() => router.push('/Usuario/GerarRelatorioFuncionario')}>
            <TbReportSearch className = {styles.iconsMenu}/> Gerar relatórios de itens
          </li>
          <li onClick={() => router.push('/Usuario/SolicitarRelatorios')}>
            <TbReport className = {styles.iconsMenu}/> Solicitar relatório mais geral
          </li>
          <li onClick={() => router.push('/Usuario/AcompanharSolicitacoes')}>
            <FaLaptopFile className = {styles.iconsMenu}/> Minhas solicitações de relatórios
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SidebarMenu;
