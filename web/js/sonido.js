// School Rush · sonido.js
// Efectos y música sintetizados con Web Audio (sin archivos de audio)

// ---------- sonido ----------
let AC,master,musicGain,musicTimer=null;
function audio(){
  if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)();master=AC.createGain();master.gain.value=G.muted?0:1;master.connect(AC.destination);musicGain=AC.createGain();musicGain.gain.value=.05;musicGain.connect(master);}catch(e){}}
  if(AC&&AC.state==='suspended')AC.resume();
  if(!audio.unlocked&&AC){audio.unlocked=true;
    try{const b=AC.createBuffer(1,1,22050),src=AC.createBufferSource();src.buffer=b;src.connect(AC.destination);src.start(0);}catch(e){}
    try{if('speechSynthesis' in window){const u=new SpeechSynthesisUtterance(' ');u.volume=0;speechSynthesis.speak(u);}}catch(e){}}
}
function tone(f1,f2,d,type,vol,when){
  if(!AC)return;const t=(when||AC.currentTime);
  const o=AC.createOscillator(),g=AC.createGain();o.type=type||'triangle';
  o.frequency.setValueAtTime(f1,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);
  g.gain.setValueAtTime(vol||.14,t);g.gain.exponentialRampToValueAtTime(.001,t+d);
  o.connect(g).connect(master);o.start(t);o.stop(t+d+.02);
}
const SFX={
  jump:()=>tone(330,660,.14,'square',.08),
  jump2:()=>tone(520,1040,.16,'square',.08),
  coin:n=>tone(880*Math.pow(1.06,Math.min(n,12)),0,.09,'triangle',.12),
  hit:()=>{tone(220,80,.3,'sawtooth',.13);tone(110,60,.3,'square',.06);},
  power:()=>{tone(523,0,.1);setTimeout(()=>tone(659,0,.1),90);setTimeout(()=>tone(784,1046,.2),180);},
  tap:()=>tone(600,700,.05,'square',.06),
  land:()=>tone(140,90,.06,'triangle',.08),
  win:()=>{[523,659,784,1046].forEach((f,i)=>setTimeout(()=>tone(f,0,.18),i*110));},
  bell:()=>{tone(1320,1300,.8,'sine',.12);setTimeout(()=>tone(1320,1300,.8,'sine',.1),350);},
  bad:()=>tone(200,120,.3,'sawtooth',.1),
};
const sfx=(k,a)=>{try{audio();SFX[k]&&SFX[k](a);}catch(e){}};
// música: una melodía por tramo y acelerón cuando quedan menos de 3 minutos
const NOTE=n=>440*Math.pow(2,(n-69)/12);
const TEMAS={
  casa:{bpm:150,bass:[48,48,55,55,53,53,55,55, 45,45,52,52,53,53,55,55],
        mel:[72,0,76,79,0,76,72,74, 76,0,74,72,69,0,72,0, 72,0,76,79,0,81,79,76, 74,0,76,74,72,0,0,0]},
  sanse:{bpm:168,bass:[45,52,45,52,50,57,50,57, 52,59,52,59,45,52,45,52],   // aire de pasodoble para las fiestas
        mel:[69,0,72,76,0,74,72,71, 72,0,71,69,68,0,69,0, 76,0,74,72,71,72,74,76, 77,76,74,72,71,0,69,0]},
  alco:{bpm:156,bass:[50,50,57,57,55,55,57,57, 47,47,54,54,55,55,57,57],
        mel:[74,0,78,81,0,78,74,76, 78,0,76,74,71,0,74,0, 74,76,78,81,83,81,78,76, 74,0,76,0,74,0,0,0]},
  cole:{bpm:144,bass:[48,55,48,55,53,60,53,60, 55,62,55,62,48,55,48,55],    // marcha hasta la puerta
        mel:[72,72,74,76,0,76,77,79, 79,0,77,76,74,0,72,0, 76,76,77,79,0,81,79,77, 76,74,72,74,72,0,0,0]},
  menu:{bpm:132,bass:[48,48,55,55,53,53,55,55, 45,45,52,52,53,53,55,55],
        mel:[72,0,76,79,0,76,72,74, 76,0,74,72,69,0,72,0, 72,0,76,79,0,81,79,76, 74,0,76,74,72,0,0,0]}
};
let step=0;
function temaActual(){return R&&TEMAS[R.sec]?TEMAS[R.sec]:TEMAS.menu;}
function tempoActual(){
  const T=temaActual();let bpm=T.bpm*(G.modo==='padres'?1.06:G.modo==='peques'?.9:1);
  if(R&&G.state==='play'&&R.clock>=BELL-3)bpm*=1.28;          // ¡que llegamos tarde!
  return 60/bpm/2;
}
function startMusic(){
  audio();if(!AC||musicTimer)return;
  let next=AC.currentTime+.05;
  musicTimer=setInterval(()=>{
    while(next<AC.currentTime+.2){
      const T=temaActual(),spb=tempoActual(),b=T.bass[step%16],m=T.mel[step%32];
      const o=AC.createOscillator(),g=AC.createGain();o.type='square';o.frequency.value=NOTE(b-12);g.gain.setValueAtTime(.5,next);g.gain.exponentialRampToValueAtTime(.01,next+spb*.9);o.connect(g).connect(musicGain);o.start(next);o.stop(next+spb);
      if(m){const o2=AC.createOscillator(),g2=AC.createGain();o2.type=R&&R.sec==='sanse'?'sawtooth':'triangle';o2.frequency.value=NOTE(m);g2.gain.setValueAtTime(R&&R.sec==='sanse'?.35:.7,next);g2.gain.exponentialRampToValueAtTime(.01,next+spb*.95);o2.connect(g2).connect(musicGain);o2.start(next);o2.stop(next+spb);}
      if(step%4===0){const o3=AC.createOscillator(),g3=AC.createGain();o3.type='sine';o3.frequency.setValueAtTime(150,next);o3.frequency.exponentialRampToValueAtTime(40,next+.1);g3.gain.setValueAtTime(.9,next);g3.gain.exponentialRampToValueAtTime(.01,next+.12);o3.connect(g3).connect(musicGain);o3.start(next);o3.stop(next+.13);}
      if(R&&R.sec==='sanse'&&step%8===4){const o4=AC.createOscillator(),g4=AC.createGain();o4.type='triangle';o4.frequency.value=NOTE(93);g4.gain.setValueAtTime(.25,next);g4.gain.exponentialRampToValueAtTime(.01,next+.05);o4.connect(g4).connect(musicGain);o4.start(next);o4.stop(next+.06);}
      next+=spb;step++;
    }
  },50);
}
function stopMusic(){clearInterval(musicTimer);musicTimer=null;}
$('#mute').textContent=G.muted?'🔇':'🔊';
$('#mute').onclick=e=>{e.stopPropagation();G.muted=!G.muted;$('#mute').textContent=G.muted?'🔇':'🔊';if(master)master.gain.value=G.muted?0:1;try{localStorage.setItem('sr-muted',G.muted?'1':'0');}catch(e){}};

// ---------- voz que avisa (para quien aún no lee) ----------
let vozES=null,ultimaVoz=0;
function elegirVoz(){
  try{const vs=speechSynthesis.getVoices();vozES=vs.find(v=>/^es[-_]ES/i.test(v.lang))||vs.find(v=>/^es/i.test(v.lang))||null;}catch(e){}
}
try{if('speechSynthesis' in window){elegirVoz();speechSynthesis.onvoiceschanged=elegirVoz;}}catch(e){}
function hablar(txt,urgente){
  if(!G.voz||G.muted)return;
  try{
    if(!('speechSynthesis' in window))return;
    const now=performance.now();if(!urgente&&now-ultimaVoz<900)return;ultimaVoz=now;
    if(urgente)speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(txt);u.lang='es-ES';if(vozES)u.voice=vozES;u.rate=1.15;u.pitch=1.15;u.volume=1;
    speechSynthesis.speak(u);
  }catch(e){}
}
function callar(){try{speechSynthesis.cancel();}catch(e){}}
