const jogadora = document.querySelector('.Jogadora');
const pipe = document.querySelector('.pipe');
const jumpDisplay = document.querySelector('#jump-count');
const screenStart = document.getElementById('screen-start');
const screenGame = document.getElementById('screen-game');
const screenEnd = document.getElementById('screen-end');
const endContent = document.getElementById('end-content');
const gameBoard = document.querySelector('.Game-Board');

let jumps = 0;
let gameActive = false;
let selectedStyle = 1;

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

function startGame(styleNumber) {
    selectedStyle = styleNumber;
    jumps = 0;
    jumpDisplay.innerText = "0";
    gameActive = true;

    // Reset de Telas e Estilos
    screenEnd.style.backgroundImage = 'none';
    screenEnd.classList.remove('screen-game-over-full');
    screenStart.style.display = 'none';
    screenGame.style.display = 'block';
    screenEnd.style.display = 'none';

    const imgMap = { 1: 'Darlin.png', 2: 'V2.png', 3: 'V3.png' };
    jogadora.src = `IMG/${imgMap[styleNumber]}`;

    pipe.classList.add('pipe-animation');
    runLoop();
}

const jump = () => {
    if (!gameActive || jogadora.classList.contains('jump')) return;
    jogadora.classList.add('jump');
    jumps++;
    jumpDisplay.innerText = jumps;

    // Altere para 10 se quiser o jogo completo, deixei 1 conforme seu código anterior
    if (jumps >= 10) victory();

    setTimeout(() => jogadora.classList.remove('jump'), 500);
};

const runLoop = () => {
    const loop = setInterval(() => {
        if (!gameActive) { clearInterval(loop); return; }
        const pipePos = pipe.offsetLeft;
        const jogadoraPos = +window.getComputedStyle(jogadora).bottom.replace('px', '');

        if (pipePos <= 120 && pipePos > 0 && jogadoraPos < 80) {
            gameActive = false;
            clearInterval(loop);
            gameOver();
        }
    }, 10);
};

function gameOver() {
    pipe.style.animation = 'none';
    screenGame.style.display = 'none';
    screenEnd.style.display = 'flex';

    let monsterImg = (selectedStyle === 2 || selectedStyle === 3) ? "IMG/MONSTRO.jpeg" : "IMG/Monstro2.png";
    const deadImg = `IMG/Gameover${selectedStyle}.png`;

    // Aplica o monstro como fundo da tela
    screenEnd.style.backgroundImage = `url('${monsterImg}')`;
    screenEnd.classList.add('screen-game-over-full');

    endContent.innerHTML = `
        <div class="game-over-content-overlay">
            <h2 class="sombrio-title">CONEXÃO INERTE</h2>
            
            <img src="${deadImg}" class="player-dead-overlay">
            
            <div class="enigma-text">
                "Muitos caminham, mas poucos estão de fato aqui. <br>
                O monstro que você alimenta no escuro do seu medo cresce com o seu silêncio. <br>
                Quando você acende a luz da consciência, percebe que o monstro era apenas a sua própria sombra projetada na parede."
            </div>

            <!-- Botão único centralizado -->
            <button onclick="location.reload()" class="btn-restart" style="margin-top: 30px; background: #660000; color: #fff; box-shadow: 0 0 15px #ff0000; border: none; padding: 15px 40px; border-radius: 50px; cursor: pointer; font-weight: bold; text-transform: uppercase;">
                RECOMEÇAR JORNADA
            </button>
        </div>
    `;
}

function victory() {
    gameActive = false;
    pipe.style.animation = 'none';
    screenGame.style.display = 'none';
    screenEnd.style.display = 'flex';
    screenEnd.style.background = "#050505";
    screenEnd.style.backgroundImage = 'none'; // Garante que o monstro não apareça na vitória

    endContent.innerHTML = `
       <div class="victory-container" style="display: flex; flex-direction: column; align-items: center; padding: 20px;">
            <img src="IMG/Espelho.png" class="mirror-img" style="width: 200px; filter: drop-shadow(0 0 30px #fff); image-rendering: pixelated;">
            
            <h2 class="game-title" style="color: #fff; text-shadow: 0 0 20px #4A74F3; font-size: 3rem; margin-top: 20px;">REDENÇÃO</h2>
            
            <div class="marcos-quote" style="border-left: 5px solid #fff; padding: 25px; background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(5px); margin-top: 20px; max-width: 600px;">
                <p style="font-size: 1.2rem; line-height: 1.7; color: #fff; text-align: left;">
                    "A maior coragem que você pode ter não é a de enfrentar os outros, mas a de enfrentar a si mesmo e decidir se perdoar. <br><br>
                    Agora você é livre para ser quem realmente é."
                </p>
                <br>
                <strong style="color: #4A74F3; font-size: 1rem; letter-spacing: 3px;">— MARCOS LACERDA</strong>
            </div>

            <p class="dark-truth" style="margin-top: 30px; color: #fff; font-weight: bold; letter-spacing: 2px;">
                VOCÊ SE RECONHECEU NO REFLEXO.
            </p>

            <!-- Botão único centralizado -->
            <button onclick="location.reload()" class="btn-restart" style="margin-top: 35px; background: #fff; color: #000; box-shadow: 0 0 20px #fff; border: none; padding: 15px 40px; border-radius: 50px; cursor: pointer; font-weight: bold; text-transform: uppercase;">
                RECOMEÇAR A VIDA
            </button>
        </div>
    `;
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') jump();
});
document.addEventListener('touchstart', jump);