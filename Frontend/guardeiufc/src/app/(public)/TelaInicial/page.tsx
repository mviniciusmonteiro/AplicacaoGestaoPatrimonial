import styles from "./page.module.css";
import imagem from "/public/primeira.png";
import imagem2 from "/public/filearquivo.png";
import Image from "next/image";

function TelaInicial() {
  return (
    <div>
      <div className={styles.main}>
        <header className={styles.fixedheader}>
          <p className={styles.titulo}>GuardeiUFC</p>
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
      </div>
      <div className={styles.telaPrincipal}>
        <div className={styles.conteudo}>
          <div className={styles.textos}>
            <div className={styles.tituloTela}>
              <p>GuardeiUFC</p>
            </div>
            <div className={styles.descricao}>
              <p>Gestão de bens patrimoniais do Departamento de Computação</p>
            </div>
          </div>
          <Image
            src={imagem}
            alt="Imagem"
            width={596}
            height={349}
            layout="responsive"
          />
        </div>
      </div>

      <div className={styles.segundaTela} id="TelaRecursos">
        <h1 className={styles.tituloRecursos}>Recursos</h1>
        <div className={styles.contsegundaTela}>
          <div className={styles.imagemContainer}>
            <Image src={imagem2} alt="Imagem" width={504} height={545} />
          </div>
          <div className={styles.funcionalidades}>
            <div className={styles.caixaFuncionalidade}>
              <div className={styles.item}>Filtrar itens vinculados*</div>
            </div>
            <div className={styles.caixaFuncionalidade}>
              <div className={styles.item}>Gerar relatórios de itens vinculados</div>
            </div>
            <div className={styles.caixaFuncionalidade}>
              <div className={styles.item}>Solicitar relatórios mais detalhados de itens</div>
            </div>
            <div className={styles.caixaFuncionalidade}>
              <div className={styles.item}>Acompanhar solicitações de relatórios mais detalhados** de itens</div>
            </div>
          </div>
        </div>
        <p className={styles.contExplicacao}>*Itens sob responsabilidade do usuário ou vinculados a projetos que ele coordena</p>
        <p className={styles.contExplicacao}>**Relatórios contendo itens que não estão sob responsabilidade do usuário ou que não estão vinculados a projetos que ele coordena</p>
      </div>

      <div className = {styles.terceiraTela} id = "TelaSobre">
        <h1 className = {styles.tituloRecursos}>Sobre</h1>
        <div className = {styles.contterceiraTela}>
          <div className={styles.textosSobre}>
            <p>GuardeiUFC é uma ferramenta concebida e desenvolvida ao longo da disciplina de Desenvolvimento de Software para Web (CK0207 - 2023.2).</p>
            <p></p>
            <p>A proposta dessa aplicação web é que ela ofereça serviços de gestão do patrimônio vinculado ao Departamento de Computação da Universidade Federal do Ceará, agilizando e facilitando esse gerenciamento.</p>
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
