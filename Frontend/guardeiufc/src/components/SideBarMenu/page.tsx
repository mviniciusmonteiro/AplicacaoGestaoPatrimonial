// SidebarMenu.js
import React, { useState, useEffect } from "react";
import { FaBars, FaSearchLocation, FaUsers } from "react-icons/fa";
import { VscFileSubmodule } from "react-icons/vsc";
import { FaComputer } from "react-icons/fa6";
import { TbReportSearch } from "react-icons/tb";
import { TbReport } from "react-icons/tb";
import { RiUserSettingsLine } from "react-icons/ri";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { axios } from '@/config/axios';
import { AxiosError } from 'axios';
import Swal from "sweetalert2";

interface Response {
  pendentReqCount: number;
}

const SidebarMenu = () => {
  const [menuAberto, setMenuAberto] = useState(false);
  const [verSolicitacoesAtivo, setVerSolicitacoesAtivo] = useState(true);
  const [pendentRequestCount, setPendentRequestCount] = useState(0);
  const router = useRouter();

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  const handleAddZeroes = (num: string, len: number) => {
    var numberWithZeroes = num;
    var counter = numberWithZeroes.length;
    while(counter < len) {
      numberWithZeroes = '0' + numberWithZeroes;
      counter++;
    }
    return numberWithZeroes;
  }

  useEffect(() => {
    axios.get<Response>('/pendent-report-request')
    .then(response => {
      if (response.status == 200) {
        setPendentRequestCount(response.data.pendentReqCount);
      }
    }).catch((error: AxiosError) => {
      if (error.response?.status == 403) {
        Swal.fire({
          icon: 'error',
          text: 'Faça login como administrador para visualizar a tela inicial!'
        }).then(value => {
          if (value) {
            router.push('/TelaLogin');
          }
        });
      } else {
        Swal.fire({
          icon: 'error',
          text: `Ocorreu um erro ao iniciar a tela. Por favor, tente novamente!\nCódigo do erro: ${error.response?.status}`
        });
        console.error(error);
      }
    });
  });

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
              onClick={() => router.push("/Administrador/GerarRelatorios")}
            >
              <TbReportSearch className={styles.iconsMenu} /> Gerar
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
              {verSolicitacoesAtivo && pendentRequestCount > 0 && (
                <div className={styles.notificacaoIcone}>
                  {pendentRequestCount <= 99 && (handleAddZeroes(pendentRequestCount.toString(), 2))}
                  {pendentRequestCount > 99 && ('+99')}
                </div>
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
