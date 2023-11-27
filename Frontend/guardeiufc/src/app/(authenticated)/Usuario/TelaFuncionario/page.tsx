"use client";
import styles from "./page.module.css";
import { useState } from "react";
import SidebarMenuFuncionario from "@/components/SidebarMenuFuncionario/page";
import Image from "next/image";
import imagem from "/public/imagemHome.png";

function TelaAdministrador() {
  
  return (
    <div>
      <div className={styles.main}>
        <div className={styles.telaPrincipal}>
          <div className={styles.menuLateral}>
            <SidebarMenuFuncionario/>
          </div>
          <div className={styles.telaSecundaria}>
            <div className={styles.textoPrincipal}>
              <p>Gerencie e organize o sistema</p>
            </div>
            <div className={styles.containerVazio}>
              <p className={styles.textoContainer}>
                Explore o GuardeiUFC, para acessar todas as funcionalidades do
                nosso sistema de controle patrimonial.
              </p>
            </div>
          </div>
          <div className={styles.imagemContainer}>
            <Image
              src={imagem}
              className={styles.image}
              fill
              alt="Imagem de um computador sistema de arquivos"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TelaAdministrador;
