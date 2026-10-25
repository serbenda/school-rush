// School Rush · menus.js
// Menú, editor de los peques, inicio de partida y bucle principal

// =====================================================================
//  MENÚ
// =====================================================================
function menu(){
  G.state='menu';R=null;stopMusic();document.body.classList.remove('playing');$('#end').classList.add('hidden');$('#custom').classList.add('hidden');
  let best=0;try{best=parseInt(localStorage.getItem('sr-best'))||0;}catch(e){}
  const m=$('#menu');
  m.innerHTML=`<div class="card"><h1>SCHOOL RUSH</h1><div class="sub">¡Que llegamos tarde! 🔔</div>
    <p>Son las <b>8:40</b> y el cole cierra a las <b>9:00</b>. ¡Corre con los peques de casa al cole!</p>
    <div class="heroes">${Object.keys(HEROES).map(h=>`<button class="hero ${G.hero===h?'sel':''}" data-h="${h}"><canvas width="220" height="240"></canvas>${HEROES[h].name}</button>`).join('')}
      <button class="hero kids" id="tokids"><canvas width="220" height="240"></canvas>👕 Peques</button></div>
    <div class="how">${TOUCH?'<span>⬆ Saltar (doble)</span><span>⬇ Agacharse</span>':'<span>Espacio/↑: saltar (doble)</span><span>↓: agacharse</span>'}</div>
    <p class="best">${best?`🏆 Récord: ${best} · `:''}🎁 Retos: ${G.done.length}/${RETOS.length}</p>
    <button class="btn" id="play">¡A CORRER!</button></div>`;
  m.classList.remove('hidden');
  m.querySelectorAll('.hero[data-h]').forEach(b=>{
    const x=b.querySelector('canvas').getContext('2d');
    b.onclick=()=>{G.hero=b.dataset.h;m.querySelectorAll('.hero[data-h]').forEach(z=>z.classList.toggle('sel',z===b));sfx('tap');};
    x.setTransform(1.4,0,0,1.4,0,0);
    drawWith(x,()=>drawAdult(76,168,{hero:b.dataset.h,state:'idle',t:0,face:'happy'}));
  });
  const kx=$('#tokids canvas').getContext('2d');kx.setTransform(1.4,0,0,1.4,0,0);
  drawWith(kx,()=>{drawKid(52,168,{state:'idle',face:'happy'},G.kids[1]);drawKid(108,168,{state:'idle',face:'happy'},G.kids[0]);});
  $('#tokids').onclick=()=>{sfx('tap');custom();};
  $('#play').onclick=play;
}
let editK=0;
function custom(){
  const c=$('#custom');const K=G.kids[editK];
  const lockTxt=id=>{const r=RETOS.find(r=>r.id===id);return r?r.txt:'';};
  const row=(key,title,isColor)=>`<div class="row"><span class="rl">${title}</span><div class="opts">${OPTS[key].map(o=>{
      const sel=K[key]===o.id,lk=!unlocked(o);
      const bg=o.id==='rainbow'?'linear-gradient(135deg,#e0412a,#ffd23f,#2bb673,#3d7be0,#7b6cf6)':o.id==='gold'?'linear-gradient(135deg,#f5c542,#fff3a0,#d4a017)':o.id;
      return isColor?`<button class="sw ${sel?'sel':''} ${lk?'locked':''}" data-k="${key}" data-v="${o.id}" data-lock="${lk?esc(lockTxt(o.lock)):''}" style="background:${bg}" aria-label="${key}"></button>`
                    :`<button class="tb ${sel?'sel':''} ${lk?'locked':''}" data-k="${key}" data-v="${o.id}" data-lock="${lk?esc(lockTxt(o.lock)):''}">${o.lbl}${lk?'<i>🔒</i>':''}</button>`;}).join('')}</div></div>`;
  c.innerHTML=`<div class="card wide"><h1>LOS PEQUES</h1>
    <div class="school"><label for="cole">🏫 Nombre del cole</label><input id="cole" maxlength="28" placeholder="Ej.: San Pedro" value="${esc(G.school)}"></div>
    <div class="tabs">${G.kids.map((k,i)=>`<button class="tab ${i===editK?'sel':''}" data-i="${i}">${esc(k.name)}</button>`).join('')}</div>
    <div class="editor"><div class="pv"><canvas id="pv" width="240" height="250"></canvas><input id="kname" maxlength="12" value="${esc(K.name)}" aria-label="Nombre"></div>
      <div class="rows">${row('uni','Uniforme')}${row('style','Peinado')}${row('hair','Pelo',1)}${row('top','Jersey',1)}${row('bag','Mochila',1)}${row('acc','Extra')}</div></div>
    <div id="hint" class="hint">Toca un 🔒 para ver cómo se consigue</div>
    <details class="retos"><summary>🎁 Retos ${G.done.length}/${RETOS.length}</summary>${RETOS.map(r=>`<div class="reto ${G.done.includes(r.id)?'ok':''}">${G.done.includes(r.id)?'✅':'⬜'} ${r.txt} → <b>${r.prize}</b></div>`).join('')}</details>
    <button class="btn" id="kdone">¡LISTO!</button></div>`;
  c.classList.remove('hidden');
  const pv=$('#pv').getContext('2d');
  const draw=()=>{pv.setTransform(1,0,0,1,0,0);pv.clearRect(0,0,240,250);pv.setTransform(1.9,0,0,1.9,0,0);drawWith(pv,()=>drawKid(62,126,{state:'idle',face:'happy'},G.kids[editK]));};
  draw();
  c.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{editK=+b.dataset.i;sfx('tap');custom();});
  c.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{
    if(b.classList.contains('locked')){$('#hint').innerHTML='🔒 Se desbloquea: <b>'+b.dataset.lock+'</b>';sfx('bad');return;}
    G.kids[editK][b.dataset.k]=b.dataset.v;saveKids();sfx('tap');custom();});
  let colT;$('#cole').oninput=e=>{G.school=e.target.value.trim();try{localStorage.setItem('sr-cole',G.school);}catch(err){}clearTimeout(colT);colT=setTimeout(()=>{try{ART.coleMid=mkLayer(1920,GY,artColeMid);}catch(err){}},400);};
  $('#kname').oninput=e=>{G.kids[editK].name=e.target.value.trim()||('Peque '+(editK+1));saveKids();c.querySelector('.tab.sel').textContent=G.kids[editK].name;};
  $('#kdone').onclick=()=>{sfx('tap');c.classList.add('hidden');menu();};
}
function drawWith(c,fn){const old=ctx;ctx=c;try{fn();}finally{ctx=old;}}
function play(){
  try{localStorage.setItem('sr-hero',G.hero);}catch(e){}saveKids();
  $('#menu').classList.add('hidden');$('#custom').classList.add('hidden');$('#end').classList.add('hidden');
  newRun();G.state='play';audio();startMusic();sfx('power');document.body.classList.add('playing');setTimeout(fit,50);
  if(TOUCH){try{const el=document.documentElement;if(!document.fullscreenElement&&el.requestFullscreen)el.requestFullscreen({navigationUI:'hide'}).then(()=>{if(screen.orientation&&screen.orientation.lock)screen.orientation.lock('landscape').catch(()=>{});}).catch(()=>{});}catch(e){}}
}

function burst(){const g=$('#game');for(let i=0;i<40;i++){const d=document.createElement('div');d.className='conf';d.textContent=pick(['🎉','⭐','✨','🎈','🍞']);d.style.left=rnd(2,96)+'%';d.style.animationDuration=rnd(1,2)+'s';g.appendChild(d);setTimeout(()=>d.remove(),2100);}}
// ---------- bucle ----------
let last=0;
function loop(t){
  const dt=Math.min(.033,(t-last)/1000||0);last=t;
  update(dt);render();
  requestAnimationFrame(loop);
}
buildArt();if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{try{buildArt();}catch(e){}});
menu();requestAnimationFrame(loop);
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
