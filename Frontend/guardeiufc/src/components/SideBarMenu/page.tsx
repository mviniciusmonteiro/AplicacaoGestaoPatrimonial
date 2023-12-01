// SidebarMenu.js
import React, { useState } from "react";
import { FaBars, FaSearchLocation, FaCircle, FaUsers } from "react-icons/fa";
import { VscFileSubmodule } from "react-icons/vsc";
import { FaComputer } from "react-icons/fa6";
import { TbReportSearch } from "react-icons/tb";
import { TbReport } from "react-icons/tb";
import { FiBell } from "react-icons/fi";
import { RiUserSettingsLine } from "react-icons/ri";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

const SidebarMenu = () => {
  const [menuAberto, setMenuAberto] = useState(false);
  const [verSolicitacoesAtivo, setVerSolicitacoesAtivo] = useState(true);
  const router = useRouter();

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  return (
    <div className={styles.main}>
      <div
        className={`${styles.sidebar} ${menuAberto ? styles.menuAberto : ""}`}
      >
        <div className={styles.toggleBtn} onClick={toggleMenu}>
          <FaBars className={styles.iconMenu} />
        </div>
        <nav
          className={`${styles.menu} ${menuAberto ? styles.menuAberto : ""}`}
        >
          <div className={styles.espacoMenu}>
            <p className={styles.nomeMenu}>Menu</p>
          </div>
          <ul>
            <li onClick={() => router.push("/Administrador/GerenciarItens")}>
              <VscFileSubmodule className={styles.iconsMenu} /> Gerenciar itens
              do patrimônio
            </li>
            <li
              onClick={() => router.push("/Administrador/GerenciarRelatorios")}
            >
              <TbReportSearch className={styles.iconsMenu} /> Gerenciar
              relatórios de itens
            </li>
            <li
              onClick={() => {
                router.push("/Administrador/AcompanharSolicitacoes");
                setVerSolicitacoesAtivo(true);
              }}
              className={verSolicitacoesAtivo ? styles.menuAtivo : ""}
            >
              <TbReport className={styles.iconsMenu} />
              Ver solicitações de relatórios
              {verSolicitacoesAtivo && (
                <FaCircle className={styles.notificacaoIcone} />
              )}
            </li>
            <li onClick={() => router.push("/Administrador/GerenciarUsuarios")}>
              <FaUsers className={styles.iconsMenu} /> Gerenciar usuários
            </li>
            <li
              onClick={() =>
                router.push("/Administrador/GerenciarLocalizacoes")
              }
            >
              <FaSearchLocation className={styles.iconsMenu} /> Gerenciar
              localizações
            </li>
            <li onClick={() => router.push("/Administrador/GerenciarProjetos")}>
              <FaComputer className={styles.iconsMenu} /> Gerenciar projetos
            </li>
            <li
              onClick={() => router.push("/Administrador/GerenciarResponsaveis")}
            >
              <RiUserSettingsLine className={styles.iconsMenu} /> Gerenciar
              responsáveis
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default SidebarMenu;
