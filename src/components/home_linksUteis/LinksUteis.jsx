import "./index.scss";

function LinksUteis() {
  return (
    <section className="linksUteis">
        <h1>LINKS ÚTEIS</h1>
        <div className="links">

            <div className="link">
                <a href="http://192.168.0.201:8080/DelsoftX_Hom/servlet/loginerp?" target="_blank" rel="noreferrer noopener">
                    <img src="../images/delsoft.png" alt="logo-delsoft" />
                    <p>Delsoft</p>
                </a>
            </div>

            <div className="link teste">
                <a href="http://192.168.0.246:8080/DelsoftXTST/servlet/loginerp?" target="_blank" rel="noreferrer noopener">
                    <img src="../images/delsoft.png" alt="logo-delsoft" />
                    <p>Delsoft Teste</p>
                </a>
            </div>

            <div className="link">
                <a href="http://192.168.0.219/glpi/" target="_blank" rel="noreferrer noopener">
                    <img src="../images/glpi.png" alt="logo-glpi" />
                    <p>GLPI</p>
                </a>
            </div>

            <div className="link">
                <a href="http://192.168.0.204/aims/auth/login" target="_blank" rel="noreferrer noopener">
                    <img src="../images/logoSulplast.png" alt="logo-logoSulplast" />
                    <p>Aims</p>
                </a>
            </div>

            <div className="link teste">
                <a href="http://192.168.0.204/aims-developer/auth/login" target="_blank" rel="noreferrer noopener">
                    <img src="../images/logoSulplast.png" alt="logo-logoSulplast" />
                    <p>Aims Teste</p>
                </a>
            </div>

            <div className="link">
                <a href="http://192.168.0.251:3000" target="_blank" rel="noreferrer noopener">
                    <img src="../images/rocketChat.png" alt="logo-rocketChat" />
                    <p>RocketChat</p>
                </a>
            </div>

{/*             <div className="link">
                <a href="\\192.168.0.245\sgi" target="_blank" rel="noreferrer noopener">
                    <img src="../images/logoSulplast.png" alt="logo-sgi" />
                    <p>SGI</p>
                </a>
            </div>

            <div className="link">
                <a href="file:///C:/Users/ricardo.spicka/Pictures/Screenshots">
                    <img src="../images/logoSulplast.png" alt="logo-sgi-métodos" />
                    <p>SGI Métodos</p>
                </a>
            </div> */}
          
        </div>
    </section>
  )
}

export default LinksUteis