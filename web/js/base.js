// School Rush · base.js
// Utilidades, constantes del mundo, estado global y ajuste del lienzo a la pantalla

const $=s=>document.querySelector(s);
const rnd=(a,b)=>a+Math.random()*(b-a);
const pick=a=>a[Math.floor(Math.random()*a.length)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=m=>{m=Math.floor(m);return Math.floor(m/60)+':'+String(m%60).padStart(2,'0');};
const hash=i=>{const s=Math.sin(i*127.1+311.7)*43758.5453;return s-Math.floor(s);};

const W=960,H=540,GY=440;
const START=8*60+40,BELL=9*60,SEC_PER_MIN=5.5;
const D=30000,B1=9000,BM=17100,B2=24000;           // longitud y fronteras casa|calle|cole
const PX=250;                              // posición de la mamá en pantalla
const OL='#2b2340';

const cvs=$('#c');let ctx=cvs.getContext('2d');
if(!CanvasRenderingContext2D.prototype.roundRect){CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){r=Math.min(r,w/2,h/2);this.moveTo(x+r,y);this.arcTo(x+w,y,x+w,y+h,r);this.arcTo(x+w,y+h,x,y+h,r);this.arcTo(x,y+h,x,y,r);this.arcTo(x,y,x+w,y,r);this.closePath();};}

const G={state:'menu',hero:'mama',muted:false,t:0};
try{const h=localStorage.getItem('sr-hero');if(h==='mama'||h==='papa')G.hero=h;G.muted=localStorage.getItem('sr-muted')==='1';}catch(e){}

// ---------- tamaño ----------
const TOUCH=matchMedia('(pointer:coarse)').matches||('ontouchstart' in window&&innerWidth<1100);
if(TOUCH)document.body.classList.add('touch');
let SC=1,DPR=1;
function fit(){
  const vw=innerWidth,vh=innerHeight,portrait=TOUCH&&vh>vw;
  document.body.classList.toggle('portrait',portrait);
  const s=portrait?vw/W:Math.min(vw/W,vh/H)*(TOUCH?1:.985);SC=s;DPR=Math.min(2,devicePixelRatio||1);
  const g=$('#game');g.style.width=Math.round(W*s)+'px';g.style.height=Math.round(H*s)+'px';
  cvs.width=Math.round(W*s*DPR);cvs.height=Math.round(H*s*DPR);
  g.style.setProperty('--ms',Math.round(Math.max(26,Math.min(44,H*s*.075)))+'px');
}
addEventListener('resize',fit);addEventListener('orientationchange',()=>setTimeout(fit,250));fit();
