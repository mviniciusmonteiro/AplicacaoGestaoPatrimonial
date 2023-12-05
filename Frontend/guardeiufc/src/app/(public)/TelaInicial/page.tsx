"use client";
import styles from "./page.module.css";
import imagem from "/public/primeira.png";
import imagem2 from "/public/filearquivo.png";
import Image from "next/image";
import { FaUser } from "react-icons/fa";
import { FaFolderOpen } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { axios } from '@/config/axios';
import { AxiosError } from 'axios';

interface Response {
  itemsQuantity: number;
  usersQuantity: number;
}

function TelaInicial() {
  const [usuariosCadastrados, setUsuariosCadastrados] = useState(0);
  const [itensCadastrados, setItensCadastrados] = useState(0);

  const router = useRouter();

  const handleClick = () => {
    router.push('/TelaInicial');
  };

  useEffect(() => {
    axios.get<Response>('/our-numbers')
    .then(response => {
      if (response.status == 200) {
        animateCounters(response.data.usersQuantity, response.data.itemsQuantity);
      }
    })
    .catch((error: AxiosError) => {
      console.error(error);
    });
  }, []);

  const animateCounters = (end1: number, end2: number) => {
    const duracao = 1000; // Duração da animação em milissegundos
    const intervalo = 10; // Intervalo de atualização em milissegundos

    let start1 = 0;
    let start2 = 0;
    const incremento = (end1 / duracao) * intervalo;
    const incremento2 = (end2 / duracao) * intervalo;

    const timer = setInterval(() => {
      if (start1 < end1) {
        setUsuariosCadastrados(Math.ceil(start1));
        start1 += incremento;
      }

      if (start2 < end2) {
        setItensCadastrados(Math.ceil(start2));
        start2 += incremento2;
      }
    }, intervalo);

    // Limpar intervalo quando o componente for desmontado ou a animação for concluída
    return () => clearInterval(timer);
  };

  return (
      <div className={styles.main}>
        <header className={styles.fixedheader}>
        <div className={styles.titulo} onClick={handleClick}>
            GuardeiUFC
          </div>
          <nav className="menu">
            <a className={styles.menuItem} href="#TelaSobre">
              Sobre
            </a>
            <a className={styles.menuItem} href="#TelaRecursos">
              Recursos
            </a>
            <a className={styles.menuItemLogin} href="/TelaLogin">
              Login
            </a>
          </nav>
        </header>
        <div className={styles.telaPrincipal}>
          <div className={styles.conteudo}>
            <div className={styles.textos}>
              <div className={styles.tituloTela}>
                <p>GuardeiUFC</p>
              </div>
              <div className={styles.descricao}>
                <p>Gestão de bens patrimoniais do Departamento de Computação</p>
              </div>
              <div className={styles.containerInfos}>
                <div className={styles.circle}>
                  <FaUser className={styles.usericon} />
                  <p className={styles.count}>{usuariosCadastrados}</p>
                  <p className={styles.label}>Usuários</p>
                  <p className={styles.label}>Cadastrados</p>
                </div>
                <div className={styles.circle}>
                  <FaFolderOpen className={styles.usericon} />
                  <p className={styles.count}>{itensCadastrados}</p>
                  <p className={styles.label}>Itens</p>
                  <p className={styles.label}>Cadastrados</p>
                </div>
              </div>
            </div>
            <div className={styles.imagemContainer}>
              <Image
                src={imagem}
                className={styles.image}
                fill
                alt="Imagem de Exemplo Gerenciamento de arquivos"
              />
            </div>
          </div>
        </div>

        <div className={styles.segundaTela} id="TelaRecursos">
          <h1 className={styles.tituloRecursos}>Recursos</h1>
          <div className={styles.contsegundaTela}>
            <div className={styles.imagemContainer}>
              <Image
                src={imagem2}
                className={styles.image}
                fill
                alt="Imagem de Exemplo Computador com arquivos"
              />
            </div>
            <div className={styles.funcionalidades}>
              <div className={styles.caixaFuncionalidade}>
                <div className={styles.item}>
                  Filtrar itens vinculados*
                  <span className={styles.aviso}>
                    *Itens relacionados ao usuário ou a projetos que ele
                    coordena
                  </span>
                </div>
              </div>
              <div className={styles.caixaFuncionalidade}>
                <div className={styles.item}>
                  Gerar relatórios de itens vinculados
                </div>
              </div>
              <div className={styles.caixaFuncionalidade}>
                <div className={styles.item}>
                  Solicitar relatórios mais detalhados** de itens
                  <span className={styles.aviso}>
                    **Relatórios contendo itens que não estão sob
                    responsabilidade do usuário ou que não estão vinculados a
                    projetos que ele coordena
                  </span>
                </div>
              </div>
              <div className={styles.caixaFuncionalidade}>
                <div className={styles.item}>
                  Acompanhar solicitações de relatórios mais detalhados de itens
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.terceiraTela} id="TelaSobre">
          <h1 className={styles.tituloRecursos}>Sobre</h1>
          <div className={styles.contterceiraTela}>
            <div className={styles.textosSobre}>
              <p>
                GuardeiUFC é uma ferramenta concebida e desenvolvida ao longo da
                disciplina de Desenvolvimento de Software para Web (CK0207 -
                2023.2).
              </p>
              <p></p>
              <p>
                A proposta dessa aplicação web é que ela ofereça serviços de
                gestão do patrimônio vinculado ao Departamento de Computação da
                Universidade Federal do Ceará, agilizando e facilitando esse
                gerenciamento.
              </p>
            </div>
            <div className={styles.Logo}>
              <p>GuardeiUFC</p>
            </div>
          </div>
        </div>
      </div>
  );
}

export default TelaInicial;
