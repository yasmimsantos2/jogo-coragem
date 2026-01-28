const jogadora = document.querySelector('.Jogadora');
const pipe = document.querySelector('.pipe');
const jumpDisplay = document.querySelector('#jump-count');
const screenStart = document.getElementById('screen-start');
const screenGame = document.getElementById('screen-game');
const screenEnd = document.getElementById('screen-end');
const endContent = document.getElementById('end-content');

let jumps = 0;
let gameActive = false;
let loop;

function startGame(styleNumber) {
    // 1. Reset imediato de variáveis
    gameActive = true;
    jumps = 0;
    if (jumpDisplay) jumpDisplay.innerText = "0";

    // 2. Troca de telas
    screenStart.style.display = 'none';
    screenGame.style.display = 'flex';
    screenEnd.style.display = 'none';

    // 3. Define personagem
    const imgMap = { 1: 'Darlin.png', 2: 'V2.png', 3: 'V3.png' };
    jogadora.src = `IMG/${imgMap[styleNumber]}`;

    // 4. Reset do Cano (Pipe) - ESSENCIAL PARA NÃO DAR GAME OVER DIRETO
    pipe.style.animation = 'none';
    void pipe.offsetWidth; // Truque para resetar animação
    pipe.style.left = '';
    pipe.classList.add('pipe-animation');
    pipe.style.animation = ''; // Reativa a animação do CSS

    runLoop();
}

const jump = (e) => {
    // Bloqueia qualquer outra ação do celular (zoom/scroll) para focar no pulo
    if (e) {
        if (e.cancelable) e.preventDefault();
    }
    
    if (!gameActive || jogadora.classList.contains('jump')) return;
    
    jogadora.classList.add('jump');
    jumps++;
    if (jumpDisplay) jumpDisplay.innerText = jumps;
    
    setTimeout(() => {
        jogadora.classList.remove('jump');
    }, 500);
};

const runLoop = () => {
    if (loop) clearInterval(loop);
    
    loop = setInterval(() => {
        if (!gameActive) return;

        const pipePos = pipe.offsetLeft;
        const jogadoraPos = +window.getComputedStyle(jogadora).bottom.replace('px', '');
        
        // AJUSTE DE COLISÃO PARA CELULAR (Mais permissivo para não morrer sem querer)
        const hitZone = window.innerWidth < 600 ? 70 : 100;

        if (pipePos <= hitZone && pipePos > 0 && jogadoraPos < 70) {
            gameActive = false;
            clearInterval(loop);
            gameOver();
        }
    }, 10);
};

function gameOver() {
    gameActive = false;
    pipe.style.animation = 'none';
    pipe.style.left = `${pipe.offsetLeft}px`;
    
    screenGame.style.display = 'none';
    screenEnd.style.display = 'flex';
    
    // Mantendo seu botão de recomeçar
    endContent.innerHTML = `<button onclick="location.reload()" style="padding:15px 30px; background:red; color:white; border:none; border-radius:50px; cursor:pointer; font-weight:bold;">RECOMEÇAR</button>`;
}

// --- CONTROLES (A PARTE QUE FAZ FUNCIONAR NO CELULAR) ---

// Teclado
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') jump();
});

// Toque na tela (QUALQUER LUGAR DA TELA)
// Usamos 'pointerdown' que funciona melhor em navegadores mobile modernos que o touchstart
document.addEventListener('pointerdown', (e) => {
    if (gameActive) {
        jump(e);
    }
}, { passive: false });