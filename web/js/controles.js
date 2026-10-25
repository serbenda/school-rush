// School Rush · controles.js
// Teclado, pantalla táctil y botones del móvil

// =====================================================================
//  ENTRADA
// =====================================================================
function press(){if(G.state!=='play')return;if(R.moment){momentPress();return;}inp.jumpBuf=.14;}
addEventListener('keydown',e=>{
  if(e.target.tagName==='INPUT')return;
  if([' ','ArrowUp','ArrowDown','w','s'].includes(e.key))e.preventDefault();
  if(e.repeat)return;
  if(e.key===' '||e.key==='ArrowUp'||e.key==='w'||e.key==='W')press();
  if(e.key==='ArrowDown'||e.key==='s'||e.key==='S')inp.duckHeld=true;
  if((e.key==='Escape'||e.key==='p'||e.key==='P')&&(G.state==='play'||G.state==='outro'))pause();
  else if((e.key==='Escape'||e.key==='p'||e.key==='P'||e.key===' ')&&G.state==='pause')resume();
});
addEventListener('keyup',e=>{if(e.key==='ArrowDown'||e.key==='s'||e.key==='S')inp.duckHeld=false;});
const bJ=$('#bJump'),bD=$('#bDuck');
const btnOn=(b,on)=>b.classList.toggle('on',on);
bJ.addEventListener('pointerdown',e=>{e.preventDefault();audio();btnOn(bJ,true);press();});
bD.addEventListener('pointerdown',e=>{e.preventDefault();audio();btnOn(bD,true);if(R&&R.moment)press();else inp.duckHeld=true;});
['pointerup','pointercancel','pointerleave'].forEach(ev=>{bJ.addEventListener(ev,()=>btnOn(bJ,false));bD.addEventListener(ev,()=>{btnOn(bD,false);inp.duckHeld=false;});});
addEventListener('contextmenu',e=>e.preventDefault());
const pointers=new Map();
cvs.addEventListener('pointerdown',e=>{
  e.preventDefault();audio();
  const r=cvs.getBoundingClientRect(),x=(e.clientX-r.left)/r.width;
  if(e.pointerType!=='mouse'&&x<.4&&G.state==='play'&&!(R&&R.moment)){pointers.set(e.pointerId,'duck');inp.duckHeld=true;}
  else{pointers.set(e.pointerId,'jump');press();}
});
const up=e=>{if(pointers.get(e.pointerId)==='duck'){pointers.delete(e.pointerId);inp.duckHeld=[...pointers.values()].includes('duck');}else pointers.delete(e.pointerId);};
['pointerup','pointercancel','pointerleave'].forEach(ev=>cvs.addEventListener(ev,up));
document.addEventListener('visibilitychange',()=>{if(document.hidden){if(G.state==='play'||G.state==='outro')pause();if(AC)AC.suspend();}else if(AC&&G.state==='play')AC.resume();});
window.addEventListener('pagehide',()=>{if(G.state==='play')pause();});
$('#pausebtn').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();if(G.state==='pause')resume();else pause();});
