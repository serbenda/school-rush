// School Rush · modos.js
// Modos de dificultad, mañanas distintas, jugadores y récords por jugador

// ---------- modos ----------
const MODOS={
  peques:{nombre:'Peques',icono:'👶',desc:'Más despacio y con ayuda: salta y se agacha sola si no llegas',
          vel:.72,hueco:1.4,minGolpe:0,seg:7.5,ayuda:true,dientes:8,puerta:.18,semaforo:0,voz:true},
  normal:{nombre:'Normal',icono:'🙂',desc:'La carrera de siempre',
          vel:1,hueco:1,minGolpe:1,seg:5.5,ayuda:false,dientes:12,puerta:.32,semaforo:1,voz:false},
  padres:{nombre:'Padres',icono:'🔥',desc:'Más rápido, más obstáculos y menos tiempo',
          vel:1.18,hueco:.78,minGolpe:1,seg:5,ayuda:false,dientes:15,puerta:.42,semaforo:1,voz:false}
};
// ---------- mañanas ----------
const MANANAS={
  lunes:{nombre:'Lunes',icono:'☀️',banner:'¡LUNES!'},
  lluvia:{nombre:'Viernes con lluvia',icono:'🌧️',banner:'¡VIERNES CON LLUVIA!'},
  excursion:{nombre:'Día de excursión',icono:'🎒',banner:'¡DÍA DE EXCURSIÓN!'},
  navidad:{nombre:'Navidad',icono:'🎄',banner:'¡ÚLTIMO DÍA ANTES DE NAVIDAD!'}
};
G.modo='normal';G.manana='lunes';G.voz=true;G.player='';
try{
  const m=localStorage.getItem('sr-modo');if(MODOS[m])G.modo=m;
  const d=localStorage.getItem('sr-manana');if(MANANAS[d])G.manana=d;
  G.voz=localStorage.getItem('sr-voz')!=='0';
  G.player=localStorage.getItem('sr-player')||'';
}catch(e){}
const MODO=()=>MODOS[G.modo]||MODOS.normal;
function saveOpts(){try{localStorage.setItem('sr-modo',G.modo);localStorage.setItem('sr-manana',G.manana);localStorage.setItem('sr-voz',G.voz?'1':'0');localStorage.setItem('sr-player',G.player);}catch(e){}}

// ---------- jugadores y récords ----------
function jugadores(){
  const n=[...G.kids.map(k=>k.name),'Mamá','Papá'];
  return n.filter((x,i)=>x&&n.indexOf(x)===i);
}
function jugadorActual(){const js=jugadores();return js.includes(G.player)?G.player:js[0];}
function leerRecords(){try{return JSON.parse(localStorage.getItem('sr-recs'))||{};}catch(e){return {};}}
function guardarRecord(nombre,modo,score,clock){
  const r=leerRecords();r[nombre]=r[nombre]||{};const prev=r[nombre][modo];
  const nuevo=!prev||score>prev.score;
  if(nuevo)r[nombre][modo]={score,clock:Math.floor(clock)};
  try{localStorage.setItem('sr-recs',JSON.stringify(r));}catch(e){}
  return {nuevo,prev:prev?prev.score:0};
}
function podio(modo){
  const r=leerRecords();
  return Object.keys(r).filter(n=>r[n][modo]).map(n=>({n,score:r[n][modo].score,clock:r[n][modo].clock})).sort((a,b)=>b.score-a.score).slice(0,3);
}
