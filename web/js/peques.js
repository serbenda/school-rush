// School Rush · peques.js
// Opciones de los peques (uniforme, peinado, colores, extras), retos y nombre del cole

// ---------- opciones de los peques y retos ----------
const OPTS={
  style:[{id:'coletas',lbl:'Coletas'},{id:'melena',lbl:'Melena'},{id:'corto',lbl:'Corto'}],
  uni:[{id:'falda',lbl:'Falda de cuadros'},{id:'pantalon',lbl:'Pantalón gris'}],
  hair:[{id:'#4a2a14'},{id:'#e0702a'},{id:'#f2c14e'},{id:'#1e1a2e'},{id:'#3d7be0',lock:'pts3000'}],
  top:[{id:'#23232b',lbl:'Jersey negro'},{id:'#ffd23f'},{id:'#2bb673'},{id:'#ff5d8f'},{id:'#7b6cf6'},{id:'#e0412a'},{id:'gold',lock:'powers3'}],
  bag:[{id:'#2bb673'},{id:'#ff6b4a'},{id:'#3d7be0'},{id:'#ffd23f'},{id:'rainbow',lock:'nohit'}],
  acc:[{id:'none',lbl:'🚫'},{id:'lazo',lbl:'🎀'},{id:'gafas',lbl:'😎',lock:'first'},{id:'gorra',lbl:'🧢',lock:'toast100'},{id:'corona',lbl:'👑',lock:'mult5'},{id:'gato',lbl:'🐱',lock:'stars3'},{id:'capa',lbl:'🦸',lock:'reflex'}],
};
const RETOS=[
  {id:'first',txt:'Llega al cole por primera vez',prize:'Gafas de sol 😎'},
  {id:'stars3',txt:'Llega con 3 estrellas',prize:'Orejas de gato 🐱'},
  {id:'mult5',txt:'Consigue una racha x5',prize:'Corona 👑'},
  {id:'toast100',txt:'Coge 100 tostadas en una carrera',prize:'Gorra 🧢'},
  {id:'reflex',txt:'Semáforo en menos de 0,35 s',prize:'Capa de héroe 🦸'},
  {id:'powers3',txt:'Usa los 3 power-ups en una carrera',prize:'Camiseta dorada ✨'},
  {id:'pts3000',txt:'Haz 3.000 puntos',prize:'Pelo azul 💙'},
  {id:'nohit',txt:'Llega sin ningún golpe',prize:'Mochila arcoíris 🌈'},
];
const DEF_KIDS=[{name:'Sofía',uni:'falda',style:'coletas',hair:'#e0702a',top:'#23232b',bottom:'#7b6cf6',bag:'#2bb673',acc:'none'},
                {name:'Leo',uni:'falda',style:'melena',hair:'#4a2a14',top:'#23232b',bottom:'#3d7be0',bag:'#ff6b4a',acc:'lazo'}];
G.kids=JSON.parse(JSON.stringify(DEF_KIDS));G.done=[];G.school='';
try{G.school=(localStorage.getItem('sr-cole')||'').slice(0,28);}catch(e){}
const schoolSign=()=>G.school?('COLEGIO '+G.school).toUpperCase():'COLEGIO';
const alCole=()=>G.school?' al cole '+esc(G.school):'';
try{
  const k=JSON.parse(localStorage.getItem('sr-kids'));if(Array.isArray(k)&&k.length===2)G.kids=k.map((x,i)=>Object.assign({},DEF_KIDS[i],x));
  else{const n=JSON.parse(localStorage.getItem('sr-names'));if(Array.isArray(n))n.forEach((v,i)=>{if(G.kids[i])G.kids[i].name=v;});}
  const d=JSON.parse(localStorage.getItem('sr-retos'));if(Array.isArray(d))G.done=d;
}catch(e){}
const unlocked=o=>!o.lock||G.done.includes(o.lock);
function saveKids(){try{localStorage.setItem('sr-kids',JSON.stringify(G.kids));localStorage.setItem('sr-retos',JSON.stringify(G.done));}catch(e){}}
