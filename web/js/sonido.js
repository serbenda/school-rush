// School Rush · sonido.js
// Efectos y música sintetizados con Web Audio (sin archivos de audio)

// ---------- sonido ----------
let AC,master,musicGain,musicTimer=null;
function audio(){
  if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)();master=AC.createGain();master.gain.value=G.muted?0:1;master.connect(AC.destination);musicGain=AC.createGain();musicGain.gain.value=.05;musicGain.connect(master);}catch(e){}}
  if(AC&&AC.state==='suspended')AC.resume();
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
// música: bucle alegre de 2 compases
const NOTE=n=>440*Math.pow(2,(n-69)/12);
const BASS=[48,48,55,55,53,53,55,55, 45,45,52,52,53,53,55,55];
const MEL =[72,0,76,79,0,76,72,74, 76,0,74,72,69,0,72,0, 72,0,76,79,0,81,79,76, 74,0,76,74,72,0,0,0];
let step=0;
function startMusic(){
  audio();if(!AC||musicTimer)return;
  const spb=60/150/2;let next=AC.currentTime+.05;
  musicTimer=setInterval(()=>{
    while(next<AC.currentTime+.2){
      const b=BASS[step%16],m=MEL[step%32];
      const o=AC.createOscillator(),g=AC.createGain();o.type='square';o.frequency.value=NOTE(b-12);g.gain.setValueAtTime(.5,next);g.gain.exponentialRampToValueAtTime(.01,next+spb*.9);o.connect(g).connect(musicGain);o.start(next);o.stop(next+spb);
      if(m){const o2=AC.createOscillator(),g2=AC.createGain();o2.type='triangle';o2.frequency.value=NOTE(m);g2.gain.setValueAtTime(.7,next);g2.gain.exponentialRampToValueAtTime(.01,next+spb*.95);o2.connect(g2).connect(musicGain);o2.start(next);o2.stop(next+spb);}
      if(step%4===0){const o3=AC.createOscillator(),g3=AC.createGain();o3.type='sine';o3.frequency.setValueAtTime(150,next);o3.frequency.exponentialRampToValueAtTime(40,next+.1);g3.gain.setValueAtTime(.9,next);g3.gain.exponentialRampToValueAtTime(.01,next+.12);o3.connect(g3).connect(musicGain);o3.start(next);o3.stop(next+.13);}
      next+=spb;step++;
    }
  },50);
}
function stopMusic(){clearInterval(musicTimer);musicTimer=null;}
$('#mute').textContent=G.muted?'🔇':'🔊';
$('#mute').onclick=e=>{e.stopPropagation();G.muted=!G.muted;$('#mute').textContent=G.muted?'🔇':'🔊';if(master)master.gain.value=G.muted?0:1;try{localStorage.setItem('sr-muted',G.muted?'1':'0');}catch(e){}};
