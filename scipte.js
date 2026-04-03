const ROSES=[
  {emoji:'🌹',msg:'Tu es incroyablement courageuse',delay:0},
  {emoji:'🌷',msg:'Je suis fier de toi',delay:.12},
  {emoji:'🌸',msg:'Tu vas réussir tout tes epreuve✨',delay:.24},
  {emoji:'🌹',msg:'Ne stresse pas, tu es la meilleure 💫',delay:.36},
  {emoji:'💐',msg:'Je suis toujours avec toi ❤️',delay:.48}
];
const PETAL_COLORS=['rgba(255,182,193,.8)','rgba(255,105,180,.65)','rgba(255,20,147,.45)','rgba(252,228,236,.9)','rgba(244,143,177,.7)'];

let AC=null;
function getAC(){
  if(!AC) AC=new(window.AudioContext||window.webkitAudioContext)();
  if(AC.state==='suspended') AC.resume();
  return AC;
}

function sfxHarp(freq=880,vol=.18){
  const ac=getAC(),t=ac.currentTime;
  const o=ac.createOscillator(),g=ac.createGain();
  const o2=ac.createOscillator(),g2=ac.createGain();
  o.type='sine';o.frequency.value=freq;
  o2.type='sine';o2.frequency.value=freq*2.005;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.01);g.gain.exponentialRampToValueAtTime(.001,t+.55);
  g2.gain.setValueAtTime(0,t);g2.gain.linearRampToValueAtTime(vol*.4,t+.01);g2.gain.exponentialRampToValueAtTime(.001,t+.4);
  o.connect(g);g.connect(ac.destination);
  o2.connect(g2);g2.connect(ac.destination);
  o.start(t);o.stop(t+.56);
  o2.start(t);o2.stop(t+.41);
}

function sfxChime(freqs=[523,659,784],vol=.14){
  const ac=getAC(),t=ac.currentTime;
  freqs.forEach((f,i)=>{
    const o=ac.createOscillator(),g=ac.createGain();
    o.type='sine';o.frequency.value=f;
    g.gain.setValueAtTime(0,t+i*.08);
    g.gain.linearRampToValueAtTime(vol,t+i*.08+.015);
    g.gain.exponentialRampToValueAtTime(.001,t+i*.08+.7);
    o.connect(g);g.connect(ac.destination);
    o.start(t+i*.08);o.stop(t+i*.08+.71);
  });
}

function sfxSparkle(){
  const ac=getAC(),t=ac.currentTime;
  [1047,1175,1319,1568,1760,2093].forEach((f,i)=>{
    const o=ac.createOscillator(),g=ac.createGain();
    o.type='sine';o.frequency.value=f;
    g.gain.setValueAtTime(0,t+i*.045);
    g.gain.linearRampToValueAtTime(.11,t+i*.045+.01);
    g.gain.exponentialRampToValueAtTime(.001,t+i*.045+.35);
    o.connect(g);g.connect(ac.destination);
    o.start(t+i*.045);o.stop(t+i*.045+.36);
  });
}

function sfxBell(vol=.15){
  const ac=getAC(),t=ac.currentTime;
  [[523,1],[659,.7],[784,.5],[1047,.3]].forEach(([f,v],i)=>{
    const o=ac.createOscillator(),g=ac.createGain();
    o.type='sine';o.frequency.value=f;
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol*v,t+.008);
    g.gain.exponentialRampToValueAtTime(.001,t+1.2+i*.1);
    o.connect(g);g.connect(ac.destination);
    o.start(t);o.stop(t+1.3);
  });
}

function sfxBreath(){
  const ac=getAC(),t=ac.currentTime;
  const buf=ac.createBuffer(1,ac.sampleRate*.6,ac.sampleRate);
  const data=buf.getChannelData(0);
  for(let i=0;i<data.length;i++) data[i]=(Math.random()*2-1)*.4;
  const src=ac.createBufferSource(),g=ac.createGain();
  const filter=ac.createBiquadFilter();
  filter.type='bandpass';filter.frequency.value=400;filter.Q.value=.5;
  src.buffer=buf;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.12,t+.2);
  g.gain.linearRampToValueAtTime(0,t+.6);
  src.connect(filter);filter.connect(g);g.connect(ac.destination);
  src.start(t);
  sfxChime([392,494,587],.1);
}

function sfxModalClose(){
  sfxHarp(698,.12);
  setTimeout(()=>sfxHarp(587,.09),120);
}

function sfxBurst(){
  sfxSparkle();
  setTimeout(()=>sfxBell(.12),100);
}

let musicPlaying=false,musicNodes=[],masterGain=null,melLoop=null;

const SCALE=[261.63,293.66,329.63,349.23,392,440,493.88,523.25,587.33,659.25,698.46,783.99];
const MELODY=[0,4,7,4,0,7,9,7,4,0,5,9,7,4,2,0];
const BASS=  [0,0,0,0,7,7,5,5,2,2,0,0];

function startMusic(){
  const ac=getAC();
  masterGain=ac.createGain();
  const rev=ac.createConvolver();
  const revBuf=ac.createBuffer(2,ac.sampleRate*.8,ac.sampleRate);
  for(let ch=0;ch<2;ch++){const d=revBuf.getChannelData(ch);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,2);}
  rev.buffer=revBuf;
  const wet=ac.createGain();wet.gain.value=.18;
  masterGain.connect(ac.destination);
  masterGain.connect(rev);rev.connect(wet);wet.connect(ac.destination);
  masterGain.gain.setValueAtTime(0,ac.currentTime);
  masterGain.gain.linearRampToValueAtTime(.55,ac.currentTime+2);

  [[261.63,329.63,392],[523.25,659.25,783.99]].forEach(chord=>{
    chord.forEach(f=>{
      [1,2,3,4].forEach(h=>{
        const o=ac.createOscillator(),g=ac.createGain();
        o.type=h===1?'sine':'sine';
        o.frequency.value=f*h+(Math.random()-.5)*1.5;
        g.gain.value=.022/h;
        o.connect(g);g.connect(masterGain);
        o.start();musicNodes.push(o);
      });
    });
  });

  let t=ac.currentTime+.5;
  const step=.42;
  function playMel(){
    MELODY.forEach((idx,i)=>{
      const freq=SCALE[idx]*2;
      const o=ac.createOscillator(),g=ac.createGain();
      o.type='sine';
      o.frequency.setValueAtTime(freq,t+i*step);
      o.frequency.setValueAtTime(freq*1.002,t+i*step+.01);
      g.gain.setValueAtTime(0,t+i*step);
      g.gain.linearRampToValueAtTime(.095,t+i*step+.04);
      g.gain.setValueAtTime(.095,t+i*step+step*.55);
      g.gain.exponentialRampToValueAtTime(.001,t+i*step+step*.9);
      o.connect(g);g.connect(masterGain);
      o.start(t+i*step);o.stop(t+i*step+step);
      musicNodes.push(o);

      const o2=ac.createOscillator(),g2=ac.createGain();
      o2.type='sine';o2.frequency.value=freq*.5;
      g2.gain.setValueAtTime(0,t+i*step);
      g2.gain.linearRampToValueAtTime(.038,t+i*step+.04);
      g2.gain.exponentialRampToValueAtTime(.001,t+i*step+step*.7);
      o2.connect(g2);g2.connect(masterGain);
      o2.start(t+i*step);o2.stop(t+i*step+step);
      musicNodes.push(o2);
    });

    BASS.forEach((idx,i)=>{
      const freq=SCALE[idx]*.5;
      const o=ac.createOscillator(),g=ac.createGain();
      o.type='sine';o.frequency.value=freq;
      g.gain.setValueAtTime(0,t+i*step*1.35);
      g.gain.linearRampToValueAtTime(.055,t+i*step*1.35+.05);
      g.gain.exponentialRampToValueAtTime(.001,t+i*step*1.35+step*1.2);
      o.connect(g);g.connect(masterGain);
      o.start(t+i*step*1.35);o.stop(t+i*step*1.35+step*1.3);
      musicNodes.push(o);
    });

    t+=MELODY.length*step+.8;
  }
  playMel();
  melLoop=setInterval(()=>{if(AC&&musicPlaying)playMel();},MELODY.length*step*1000+700);
  musicPlaying=true;
}

function stopMusic(){
  clearInterval(melLoop);melLoop=null;
  if(masterGain){
    try{masterGain.gain.linearRampToValueAtTime(0,AC.currentTime+.6);}catch(_){}
  }
  setTimeout(()=>{
    musicNodes.forEach(n=>{try{n.stop()}catch(_){}});
    musicNodes=[];
  },700);
  musicPlaying=false;
}

function toggleMusic(){
  const btn=document.getElementById('music-btn');
  const label=document.getElementById('music-label');
  const bars=document.getElementById('music-bars');
  if(musicPlaying){
    stopMusic();
    btn.textContent='🎶';
    label.textContent='Musique ♪ Pause';
    bars.style.opacity='.3';
    sfxBell(.08);
  } else {
    startMusic();
    btn.textContent='🎵';
    label.textContent='Musique ♪ En cours';
    bars.style.opacity='1';
    sfxChime([523,659,784],.1);
  }
}

function showModal(msg){
  sfxChime([659,784,1047],.16);
  document.getElementById('modal-msg').textContent=msg;
  document.getElementById('modal').style.display='flex';
}
function closeModal(e){if(e.target===document.getElementById('modal'))closeModalBtn();}
function closeModalBtn(){sfxModalClose();document.getElementById('modal').style.display='none';}

function handleStress(e){
  const rect=document.getElementById('garden').getBoundingClientRect();
  const btn=document.getElementById('stress-btn').getBoundingClientRect();
  sfxBurst();
  burst(btn.left-rect.left+btn.width/2, btn.top-rect.top+btn.height/2);
  const card=document.getElementById('calm-card');
  card.style.display='block';
  sfxBreath();
}
function closeCalmCard(){
  sfxBell(.1);
  document.getElementById('calm-card').style.display='none';
}

function burst(lx,ly){
  const layer=document.getElementById('burst-layer');
  for(let i=0;i<38;i++){
    const p=document.createElement('div');
    const angle=Math.random()*Math.PI*2;
    const dist=Math.random()*280+80;
    const sz=Math.random()*15+7;
    const col=PETAL_COLORS[Math.floor(Math.random()*PETAL_COLORS.length)];
    p.className='burst-petal';
    p.style.cssText=`left:${lx}px;top:${ly}px;width:${sz}px;height:${sz*.7}px;background:${col};--bx:${Math.cos(angle)*dist}px;--by:${Math.sin(angle)*dist}px;animation-delay:${Math.random()*.12}s;animation-duration:${.9+Math.random()*.4}s`;
    layer.appendChild(p);
    setTimeout(()=>p.remove(),1600);
  }
  ['❤️','💕','💖','💗','🌸'].forEach(em=>{
    for(let j=0;j<4;j++){
      const h=document.createElement('div');
      const angle=Math.random()*Math.PI*2,dist=Math.random()*200+60;
      h.className='burst-petal';
      h.style.cssText=`left:${lx}px;top:${ly}px;font-size:${11+Math.random()*9}px;background:none;width:auto;height:auto;--bx:${Math.cos(angle)*dist}px;--by:${Math.sin(angle)*dist}px;animation-delay:${Math.random()*.22}s;animation-duration:${1+Math.random()*.5}s`;
      h.textContent=em;
      layer.appendChild(h);
      setTimeout(()=>h.remove(),1900);
    }
  });
}

function initPetals(){
  const c=document.getElementById('petals');
  for(let i=0;i<28;i++){
    const p=document.createElement('div');
    const sz=Math.random()*13+7;
    p.className='petal';
    p.style.cssText=`left:${Math.random()*100}vw;width:${sz}px;height:${sz*.7}px;background:${PETAL_COLORS[Math.floor(Math.random()*PETAL_COLORS.length)]};animation-duration:${Math.random()*10+9}s;animation-delay:${Math.random()*14}s;animation-timing-function:linear;animation-iteration-count:infinite`;
    c.appendChild(p);
  }
}
function initStars(){
  const c=document.getElementById('stars');
  for(let i=0;i<14;i++){
    const s=document.createElement('div');
    s.className='star';
    s.style.cssText=`left:${5+(i*6.8)%88}%;top:${8+(i*11.3)%82}%;font-size:${.55+(i%3)*.28}rem;animation:twinkle ${1.5+i*.25}s ease-in-out ${i*.18}s infinite;opacity:.55;position:absolute`;
    s.textContent='✨';
    c.appendChild(s);
  }
}
function initRoses(){
  const g=document.getElementById('roses-grid');
  ROSES.forEach((r,i)=>{
    const card=document.createElement('div');
    card.className='rose-card';
    card.style.animationDelay=r.delay+'s';
    const ring=document.createElement('div');ring.className='ring';ring.style.animationDelay=r.delay+'s';
    const em=document.createElement('span');em.className='rose-emoji';em.style.animationDelay=(r.delay*.5)+'s';em.textContent=r.emoji;
    const lbl=document.createElement('span');lbl.className='rose-label';lbl.textContent='Clique-moi 💗';
    card.appendChild(ring);card.appendChild(em);card.appendChild(lbl);
    card.addEventListener('click',()=>{
      sfxHarp(660+i*40,.2);
      setTimeout(()=>sfxHarp(784+i*30,.14),80);
      showModal(r.msg);
    });
    card.addEventListener('mouseenter',()=>sfxHarp(880+i*22,.06));
    g.appendChild(card);
  });
}

initPetals();initStars();initRoses();


let autoStarted=false;
function tryAutoStart(){
  if(autoStarted) return;
  autoStarted=true;
  startMusic();
  document.getElementById('music-btn').textContent='🎵';
  document.getElementById('music-label').textContent='Musique ♪ En cours';
  document.getElementById('music-bars').style.opacity='1';
}
document.addEventListener('click',tryAutoStart,{once:true});
document.addEventListener('touchstart',tryAutoStart,{once:true});

setTimeout(()=>{
  if(!autoStarted){
    try{startMusic();autoStarted=true;
      document.getElementById('music-btn').textContent='🎵';
      document.getElementById('music-label').textContent='Musique ♪ En cours';
    }catch(_){}
  }
},300);