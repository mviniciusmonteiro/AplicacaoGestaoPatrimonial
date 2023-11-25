import styles from "./page.module.css";
import Link from "next/link"
function TelaCadastro() {
  return (
    <div>
      <div className={styles.main}>
        <header className={styles.fixedheader}>
          <p className={styles.titulo}>GuardeiUFC</p>
        </header>
        <div className={styles.estiloCadastro}>
          <p>Cadastre-se</p>
        </div>
        <div className={styles.containerPrincipal}>
          <div className={styles.divisao}>
            <div className={styles.inputContainer1}>
              <p className={styles.Nomes}>Matrícula</p>
              <input
                type="text"
                id="matricula"
                name="matricula"
                placeholder="Digite sua matricula"
                className={styles.input}
              />
            </div>
            <div className={styles.inputContainer2}>
              <p className={styles.Nomes}>Nome</p>
              <input
                type="text"
                id="nome"
                name="nome"
                placeholder="Digite seu nome"
                className={styles.input}
              />
            </div>
          </div>
          <div className={styles.divisao}>
            <div className={styles.inputContainer2}>
              <p className={styles.Nomes}>Email</p>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Digite seu email"
                className={styles.input}
              />
            </div>
            <div className={styles.inputContainer1}>
              <p className={styles.Nomes}>Nome de Usuário</p>
              <input
                type="text"
                id="user"
                name="user"
                placeholder="Digite seu nome de usuário"
                className={styles.input}
              />
            </div>
          </div>
          <div className={styles.divisao}>
            <div className={styles.inputContainer}>
              <p className={styles.Nomes}>Senha</p>
              <input
                type="text"
                id="senha"
                name="senha"
                placeholder="Digite sua senha"
                className={styles.input}
              />
            </div>
            <div className={styles.inputContainer}>
              <p className={styles.Nomes}>Confirmar senha</p>
              <input
                type="text"
                id="senha"
                name="senha"
                placeholder="Confirme sua senha"
                className={styles.input}
              />
            </div>
          </div>
        </div>
        <div className={styles.botoesInferiores}>
          <p className={styles.estiloBotao}>Criar Cadastro</p>
          <Link href = "/TelaLogin">Já possui uma conta? Entrar</Link>
        </div>
      </div>
    </div>
  );
}

export default TelaCadastro;
