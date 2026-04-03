// 🌹 CONFIGURATION DES ROSES ET DES COULEURS
const ROSES = [
  {emoji:'🌹', msg:'Tu es incroyablement courageuse', delay:0},
  {emoji:'🌷', msg:'Je suis fier de toi', delay:.12},
  {emoji:'🌸', msg:'Tu vas réussir toutes tes épreuves ✨', delay:.24},
  {emoji:'🌹', msg:'Ne stresse pas, tu es la meilleure 💫', delay:.36},
  {emoji:'💐', msg:'Je suis toujours avec toi ❤️', delay:.48}
];

const PETAL_COLORS = [
  'rgba(255,182,193,.8)',
  'rgba(255,105,180,.65)',
  'rgba(255,20,147,.45)',
  'rgba(252,228,236,.9)',
  'rgba(244,143,177,.7)'
];

// 🌹 INITIALISATION DES ROSES
const rosesGrid = document.getElementById('roses-grid');
ROSES.forEach((rose, index) => {
  const card = document.createElement('div');
  card.className = 'rose-card';
  card.style.animationDelay = `${rose.delay}s`;

  const emoji = document.createElement('span');
  emoji.className = 'rose-emoji';
  emoji.textContent = rose.emoji;

  const label = document.createElement('span');
  label.className = 'rose-label';
  label.textContent = 'Clique-moi 💖';

  card.appendChild(emoji);
  card.appendChild(label);
  rosesGrid.appendChild(card);

  // ÉVÉNEMENT CLICK pour la rose
  card.addEventListener('click', () => {
    showModal(rose.msg);
    spawnPetals(rose.emoji);
  });
});

// 🌸 MODAL
const modal = document.getElementById('modal');
const modalMsg = document.getElementById('modal-msg');
const merciBtn2 = document.getElementById('merci-btn2');

function showModal(msg) {
  modal.style.display = 'flex';
  modalMsg.textContent = msg;
}

function closeModal() {
  modal.style.display = 'none';
}

// Événement bouton modal
merciBtn2.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

// 🌸 STRESS BUTTON
const stressBtn = document.getElementById('stress-btn');
const calmCard = document.getElementById('calm-card');
const merciBtn = calmCard.querySelector('.close-small');

stressBtn.addEventListener('click', () => {
  calmCard.style.display = 'block';
  calmCard.scrollIntoView({behavior:'smooth', block:'center'});
});

merciBtn.addEventListener('click', () => {
  calmCard.style.display = 'none';
});

// 🌹 PETALS BURST
const burstLayer = document.getElementById('burst-layer');
function spawnPetals(emoji) {
  for (let i = 0; i < 15; i++) {
    const petal = document.createElement('div');
    petal.className = 'burst-petal';
    petal.style.setProperty('--bx', `${Math.random()*200-100}px`);
    petal.style.setProperty('--by', `${Math.random()*200-100}px`);
    petal.textContent = emoji;
    burstLayer.appendChild(petal);
    setTimeout(() => petal.remove(), 1000 + Math.random()*1000);
  }
}

// 🎵 MUSIQUE
const musicBtn = document.getElementById('music-btn');
const musicLabel = document.getElementById('music-label');
let musicOn = true;

musicBtn.addEventListener('click', () => {
  musicOn = !musicOn;
  musicLabel.textContent = musicOn ? 'Musique ♪ En cours' : 'Musique ♪ Arrêtée';
});