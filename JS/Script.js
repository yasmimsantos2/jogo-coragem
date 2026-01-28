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
let loop; // Variável global para o intervalo

// FIX: Ajuste para altura real no mobile (evita problemas com barras de navegação)
const updateVH = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
};
window.addEventListener('resize', updateVH);
updateVH();

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log("Erro ao entrar em tela cheia");
        });
    } else {
        document.exitFullscreen();
    }
}

function startGame(styleNumber) {
    selectedStyle = styleNumber;
    jumps = 0;
    jumpDisplay.innerText = "0";
    gameActive = true;

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

const jump = (e) => {
    // Previne zoom ou scroll acidental no mobile ao tocar
    if (e && e.type === 'touchstart') e.preventDefault();
    
    if (!gameActive || jogadora.classList.contains('jump')) return;
    
    jogadora.classList.add('jump');
    jumps++;
    jumpDisplay.innerText = jumps;

    if (jumps >= 10) victory();

    setTimeout(() => jogadora.classList.remove('jump'), 500);
};

const runLoop = () => {
    // Limpa qualquer loop anterior antes de começar
    if (loop) clearInterval(loop);

    loop = setInterval(() => {
        if (!gameActive) { 
            clearInterval(loop); 
            return; 
        }

        const pipePos = pipe.offsetLeft;
        // Pega o valor da altura do personagem dinamicamente
        const jogadoraPos = +window.getComputedStyle(jogadora).bottom.replace('px', '');
        
        // AJUSTE MOBILE: No celular, as medidas mudam. 
        // Verificamos a largura do personagem para uma colisão mais precisa
        const jogadoraWidth = jogadora.offsetWidth;
        const colisionPoint = jogadoraWidth + 20; 

        if (pipePos <= colisionPoint && pipePos > 0 && jogadoraPos < 80) {
            gameActive = false;
            clearInterval(loop);
            gameOver();
        }
    }, 10);
};

function gameOver() {
    pipe.style.animation = 'none';
    pipe.style.left = `${pipe.offsetLeft}px`; // Trava o cano onde ele bateu
    
    screenGame.style.display = 'none';
    screenEnd.style.display = 'flex';

    let monsterImg = (selectedStyle === 2 || selectedStyle === 3) ? "IMG/MONSTRO.jpeg" : "IMG/Monstro2.png";
    const deadImg = `IMG/Gameover${selectedStyle}.png`;

    screenEnd.style.backgroundImage = `url('${monsterImg}')`;
    screenEnd.classList.add('screen-game-over-full');

    endContent.innerHTML = `
        <div class="game-over-content-overlay">
            <h2 class="sombrio-title">CONEXÃO INERTE</h2>
            <img src="${deadImg}" class="player-dead-overlay">
            <div class="enigma-text">
                "O monstro que você alimenta no escuro do seu medo cresce com o seu silêncio."
            </div>
            <button onclick="location.reload()" class="btn-restart" style="margin-top: 30px; background: #660000; color: #fff; box-shadow: 0 0 15px #ff0000; border: none; padding: 15px 40px; border-radius: 50px; cursor: pointer; font-weight: bold; text-transform: uppercase;">
                RECOMEÇAR JORNADA
            </button>
        </div>
    `;
}

function victory() {
    gameActive = false;
    clearInterval(loop);
    pipe.style.animation = 'none';
    screenGame.style.display = 'none';
    screenEnd.style.display = 'flex';
    screenEnd.style.background = "#050505";
    screenEnd.style.backgroundImage = 'none';

    endContent.innerHTML = `
       <div class="victory-container" style="display: flex; flex-direction: column; align-items: center; padding: 20px;">
            <img src="IMG/Espelho.png" class="mirror-img">
            <h2 class="game-title" style="color: #fff; text-shadow: 0 0 20px #4A74F3; margin-top: 20px;">REDENÇÃO</h2>
            <div class="marcos-quote">
                <p>"A maior coragem é a de enfrentar a si mesmo e decidir se perdoar."</p>
                <br>
                <strong style="color: #4A74F3;">— MARCOS LACERDA</strong>
            </div>
            <button onclick="location.reload()" class="btn-restart" style="margin-top: 35px; background: #fff; color: #000; box-shadow: 0 0 20px #fff; border: none; padding: 15px 40px; border-radius: 50px; cursor: pointer; font-weight: bold; text-transform: uppercase;">
                RECOMEÇAR A VIDA
            </button>
        </div>
    `;
}

// LISTENERS
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') jump();
});

// FIX MOBILE: Adicionado { passive: false } para permitir o preventDefault()
document.addEventListener('touchstart', jump, { passive: false });