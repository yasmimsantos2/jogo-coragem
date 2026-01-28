const jogadora = document.querySelector('.Jogadora');
const pipe = document.querySelector('.pipe');
const jumpDisplay = document.querySelector('#jump-count');
const screenStart = document.getElementById('screen-start');
const screenGame = document.getElementById('screen-game');
const screenEnd = document.getElementById('screen-end');
const endContent = document.getElementById('end-content');

let jumps = 0;
let gameActive = false;
let selectedStyle = 1;
let loop;

function startGame(styleNumber) {
    selectedStyle = styleNumber;
    jumps = 0;
    if (jumpDisplay) jumpDisplay.innerText = "0";
    gameActive = true;

    screenStart.style.display = 'none';
    screenGame.style.display = 'block';
    screenEnd.style.display = 'none';

    const imgMap = { 1: 'Darlin.png', 2: 'V2.png', 3: 'V3.png' };
    jogadora.src = `IMG/${imgMap[styleNumber]}`;

    pipe.style.left = '';
    pipe.classList.remove('pipe-animation');
    void pipe.offsetWidth;
    pipe.classList.add('pipe-animation');

    runLoop();
}

const jump = (e) => {
    if (e && e.cancelable) e.preventDefault();
    if (!gameActive || jogadora.classList.contains('jump')) return;

    jogadora.classList.add('jump');
    jumps++;
    if (jumpDisplay) jumpDisplay.innerText = jumps;

    if (jumps >= 10) victory();

    setTimeout(() => jogadora.classList.remove('jump'), 500);
};

const runLoop = () => {
    if (loop) clearInterval(loop);
    loop = setInterval(() => {
        if (!gameActive) return;
        const pipePos = pipe.offsetLeft;
        const jogadoraPos = +window.getComputedStyle(jogadora).bottom.replace('px', '');
        const limit = window.innerWidth < 600 ? 80 : 120;

        if (pipePos <= limit && pipePos > 0 && jogadoraPos < 80) {
            gameActive = false;
            clearInterval(loop);
            gameOver();
        }
    }, 10);
};

function gameOver() {
    pipe.style.animation = 'none';
    pipe.style.left = `${pipe.offsetLeft}px`;
    screenGame.style.display = 'none';
    screenEnd.style.display = 'flex';

    let monsterImg = (selectedStyle === 2 || selectedStyle === 3) ? "IMG/MONSTRO.jpeg" : "IMG/Monstro2.png";
    const deadImg = `IMG/Gameover${selectedStyle}.png`;
    screenEnd.style.backgroundImage = `url('${monsterImg}')`;
    screenEnd.style.backgroundSize = "cover";

    endContent.innerHTML = `
        <div class="game-over-content-overlay">
            <h2 class="sombrio-title">CONEXÃO INERTE</h2>
            <img src="${deadImg}" class="player-dead-overlay">
            <div class="enigma-text">
                "O monstro que você alimenta no escuro do seu medo cresce com o seu silêncio."
            </div>
            <button onclick="location.reload()" style="margin-top:30px; background:#660000; color:#fff; padding:15px 40px; border-radius:50px; border:none; font-weight:bold; cursor:pointer;">RECOMEÇAR JORNADA</button>
        </div>
    `;
}

function victory() {
    gameActive = false;
    clearInterval(loop);
    screenGame.style.display = 'none';
    screenEnd.style.display = 'flex';
    screenEnd.style.background = "#050505";

    endContent.innerHTML = `
       <div class="victory-container">
            <img src="IMG/Espelho.png" style="width:180px; filter:drop-shadow(0 0 20px #fff);">
            <h2 class="game-title" style="font-size:2.5rem; margin-top:20px;">REDENÇÃO</h2>
            <div class="marcos-quote">
                <p>"A maior coragem é enfrentar a si mesmo e se perdoar."</p>
                <br><strong>— MARCOS LACERDA</strong>
            </div>
            <button onclick="location.reload()" style="margin-top:35px; background:#fff; color:#000; padding:15px 40px; border-radius:50px; border:none; font-weight:bold; cursor:pointer;">RECOMEÇAR A VIDA</button>
        </div>
    `;
}

document.addEventListener('keydown', (e) => { if (e.code === 'Space' || e.code === 'ArrowUp') jump(); });
document.addEventListener('touchstart', (e) => { if (gameActive) jump(e); }, { passive: false });