import "./index.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
import Carousel from 'react-bootstrap/Carousel';

function Noticias() {

  return (
    <section className="Noticias">
        <h1>NOTÍCIAS</h1>

      <Carousel>

            <Carousel.Item> 
              <div className="inner">
                <div>
                <img src="../images/45anos.png" alt="45anos" />
                </div>
                
                <div className="card">
                  <h3>Sulplast 45 anos</h3>
                  <h5>16 de Agosto</h5>
                  <p>Em 16 de agosto de 2023 completamos 45 anos de história.
                    Agradecemos a todos que contribuíram para esta jornada de resiliência, 
                    inovação, sustentabilidade e muito sucesso, conduzida por gente que 
                    faz a diferença.
                  </p>
                </div>
            </div>

            </Carousel.Item>

            <Carousel.Item>
              <div className="inner">
                <div><img src="../images/meioAmbiente.png" alt="meioAmbiente" /></div>
                <div className="card">
                  <h3>Dia Mundial do Meio Ambiente</h3>
                  <h5>05 de Junho</h5>
                  <p>O Dia Mundial do Meio Ambiente, comemorado anualmente em 5 de junho, 
                    é uma data importante para refletirmos sobre a preservação do nosso 
                    planeta e buscar soluções para os desafios ambientais que enfrentamos. 
                    Em 2023, o tema central da data é a poluição plástica, um problema que 
                    afeta o meio ambiente em todo o mundo, e, portanto, é de extrema 
                    importância encontrar soluções para combatê-lo.
                  </p>
                </div>
              </div>
            </Carousel.Item>

            <Carousel.Item>
              <div className="inner">
                <div><img src="../images/brigadista.png" alt="brigadista" /></div>
                <div className="card">
                  <h3>Dia do brigadista</h3>
                  <h5>02 de Julho</h5>
                  <p>A prevenção é o melhor caminho para garantir que a vida seja preservada, 
                    esse é o principal objetivo dos brigadistas. No dia 2 de julho é comemorado o Dia do Brigadista, 
                    “Cada membro da brigada executa uma função, seja no combate ao incêndio, 
                    primeiros socorros ou na evacuação/retirada de pessoas em caso de emergência".
                  </p>
                </div>
              </div>
            </Carousel.Item>

            <Carousel.Item>
              <div className="inner">
                <div><img src="../images/profissionaTI.png" alt="profissionaTI" /></div>
                <div className="card">
                  <h3>Dia do Profissional de Informática</h3>
                  <h5>19 de Outubro</h5>
                  <p>Também conhecido como Dia do Profissional de TI (Tecnologia da Informação), 
                    esta data homenageia as pessoas que se dedicam a estudar as tecnologias da informação.</p>
                </div>
              </div>
            </Carousel.Item>

      </Carousel> 

    </section>
  )
}

export default Noticias