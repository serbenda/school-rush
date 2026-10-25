// School Rush · partida.js
// Lógica de la carrera: generación, física, golpes, momentos y final

// =====================================================================
//  PARTIDA
// =====================================================================
let R=null;
const inp={jumpBuf:0,duckHeld:false};
function newRun(){
  R={dist:0,speed:330,clock:START,score:0,streak:0,mult:1,hits:0,toasts:0,t:0,shake:0,
     p:{y:GY,vy:0,onG:true,jumps:0,sx:1,sy:1,ph:0,inv:0,face:'happy',faceT:0,rot:0,spin:0,blinkT:2},
     kids:[{dx:-110,trip:0},{dx:-200,trip:0}],hist:[],
     obs:[],items:[],parts:[],texts:[],power:null,moment:null,gen:900,nextPow:3500,lineT:3,
     moments:[{at:6200,type:'teeth',done:false},{at:16500,type:'light',done:false},{at:D,type:'gate',done:false}],
     banner:{txt:'¡CASA!',t:1.6},sec:'casa',end:false,freeze:0,st:{maxMult:1,powers:[],reflex:9}};
  let tut=true;try{tut=localStorage.getItem('sr-tut')!=='1';}catch(e){}
  R.tut=tut;
  if(tut){
    const a={type:'lego',x:1000,w:OB.lego.w,h:OB.lego.h,t:0,vx:0,tut:'jump'};OB.lego.init(a);
    const b={type:'clothes',x:1900,w:OB.clothes.w,h:OB.clothes.h,t:0,vx:0,tut:'duck'};OB.clothes.init(b);
    R.obs.push(a,b);R.gen=2700;
  }
}
const speedAt=x=>330+Math.min(170,x/140);
function spawn(){
  while(R.gen<R.dist+W+700){
    const x=R.gen;
    const blocked=R.moments.some(m=>x>m.at-1100&&x<m.at+250)||[B1,BM,B2].some(b=>x>b-450&&x<b+350)||x>D-1200;
    if(blocked){R.gen+=120;continue;}
    const sec=secAt(x);
    if(x>R.nextPow){R.items.push({kind:'power',type:pick(Object.keys(POWERS)),x:x,y:GY-170});R.nextPow=x+rnd(3800,5200);R.gen+=420;continue;}
    if(Math.random()<.16){for(let i=0;i<6;i++)R.items.push({kind:'toast',x:x+i*52,y:GY-60});R.gen+=420;continue;}
    const type=pick(POOL[sec]),def=OB[type];
    const o={type,x,w:def.w,h:def.h,t:0,vx:def.vx||0,y:GY-def.h};def.init&&def.init(o);R.obs.push(o);
    if(def.kind==='low'&&Math.random()<.65){const cx=x+def.w/2;for(let i=-2;i<=2;i++)R.items.push({kind:'toast',x:cx+i*46+(def.vx||0)*-.5,y:GY-80-(1-(i/2.4)**2)*95});}
    if(def.kind==='high'&&Math.random()<.6){for(let i=0;i<4;i++)R.items.push({kind:'toast',x:x+20+i*50,y:GY-36});}
    const gapS=Math.max(.8,1.25-x/50000);
    R.gen=x+def.w+speedAt(x)*gapS*rnd(1,1.7)+(def.vx?-def.vx*1.2:0);
  }
}
function say(s,x,y,col,size){R.texts.push({s,x,y,col:col||'#fff',t:1.1,size:size||26});}
function puff(x,y,col,n,sp){for(let i=0;i<(n||10);i++)R.parts.push({x,y,vx:rnd(-1,1)*(sp||160),vy:rnd(-1,.2)*(sp||160),t:rnd(.3,.7),r:rnd(3,7),col:col||'#fff'});}
function hit(o){
  const p=R.p;
  if(p.inv>0)return;
  if(R.power&&R.power.type==='scooter'){o.smash=1;o.vy=-500;sfx('tap');puff(PX,GY-60,'#ffd23f',14);R.score+=20;say('¡CRASH!',PX+40,GY-170,'#ffd23f');return;}
  R.clock+=1;R.hits++;R.streak=0;R.mult=1;p.inv=1.4;p.face='dizzy';p.faceT=1.1;R.shake=.4;R.freeze=.13;p.stumble=.7;R.speed*=.45;
  sfx('hit');try{navigator.vibrate&&navigator.vibrate(70);}catch(e){}puff(PX+10,p.y-60,'#fff',14,220);
  say('+1 MIN',PX,p.y-190,'#ff6b6b',32);
  const ki=[1,0].find(i=>R.kids[i].trip<=0);if(ki!==undefined){const k=R.kids[ki];k.trip=1.4;k.dx-=10;setTimeout(()=>{if(R&&G.state==='play')say('¡ESPERA, '+(G.hero==='mama'?'MAMÁ':'PAPÁ')+'!',Math.max(150,PX+k.dx),GY-150,'#ffd23f',22);},250);}
  const MSG={fence:'¡Contra la talanquera!',bull:'¡Que viene el toro! 🐂',lego:'¡AY! ¡Un Lego!',ball:'¡Pelotazo!',cat:'¡Fsss! ¡El gato!',clothes:'¡Calzoncillo en la cara!',basket:'¡Cesto de ropa!',puddle:'¡Plaf! ¡Charco!',dog:'¡El perro quiere jugar!',trash:'¡Contra el cubo!',pigeon:'¡Palomas!',plank:'¡Coscorrón!',stroller:'¡Perdón, perdón!',schoolball:'¡Balonazo!'};
  say(MSG[o.type]||'¡Ay!',PX+60,p.y-230,'#fff',24);
}
function startMoment(m){
  m.done=true;
  const base={type:m.type,t:0,count:0,res:null,resT:0};
  if(m.type==='teeth')Object.assign(base,{need:12,dur:4.2});
  if(m.type==='light')Object.assign(base,{phase:'red',redT:rnd(1.2,2.6),greenT:0});
  if(m.type==='gate')Object.assign(base,{need:16,dur:4,open:.6});
  R.moment=base;R.p.vy=0;R.p.y=GY;R.p.onG=true;R.p.inv=0;R.p.spin=0;R.banner=null;R.kids.forEach(k=>{k.trip=0;});
}
function momentPress(){
  const m=R.moment;if(!m||m.res)return;
  if(m.type==='teeth'){m.count++;sfx('coin',m.count);puff(W/2+rnd(-60,60),250+rnd(-20,20),'#fff',4,90);if(m.count>=m.need){m.res='ok';R.score+=150;say('¡SONRISA BRILLANTE! +150',W/2,170,'#7cff7c',30);sfx('win');}}
  else if(m.type==='light'){
    if(m.phase==='red'){if(m.t<(m.lock||0))return;m.lock=m.t+1;m.fouls=(m.fouls||0)+1;if(m.fouls<=2){R.clock+=1;R.hits++;say('¡EN ROJO NO SE CRUZA! +1 MIN',W/2,150,'#ff6b6b',28);}else say('¡ESPERA AL VERDE!',W/2,150,'#ffd23f',28);sfx('bad');R.shake=.25;m.redT=Math.max(m.redT,m.t+rnd(.8,1.5));}
    else{const rt=m.t-m.greenT,b=Math.max(0,Math.round(200-rt*250));R.st.reflex=Math.min(R.st.reflex,rt);m.res='ok';R.score+=b;say((rt<.35?'¡REFLEJOS DE GATO! ':'¡VAMOS! ')+rt.toFixed(2)+'s  +'+b,W/2,150,'#7cff7c',28);sfx('power');}
  }
  else if(m.type==='gate'){m.count++;m.open=Math.min(1,m.open+.07);sfx('tap');if(m.count>=m.need){m.res='ok';R.score+=200;say('¡DENTRO! +200',W/2,150,'#7cff7c',34);sfx('bell');}}
}
function updateMoment(dt){
  const m=R.moment;m.t+=dt;
  if(m.res){m.resT+=dt;if(m.resT>1.1){const typ=m.type;R.moment=null;if(typ==='gate')finish();}return;}
  if(m.type==='teeth'&&m.t>m.dur){m.res='fail';R.clock+=1;say('Dientes a medias… +1 MIN',W/2,170,'#ff6b6b',28);sfx('bad');}
  if(m.type==='light'){if(m.phase==='red'&&m.t>m.redT){m.phase='green';m.greenT=m.t;sfx('tap');}if(m.phase==='green'&&m.t-m.greenT>2.5){m.res='ok';}}
  if(m.type==='gate'){m.open=Math.max(0,m.open-dt*.32);if(m.t>m.dur||m.open<=0){m.res='fail';R.clock+=2;say('Te toca firmar en conserjería ✍️ +2 MIN',W/2,150,'#ff6b6b',26);sfx('bad');}}
}
function update(dt){
  G.t+=dt;
  if(G.state!=='play')return;
  if(R.freeze>0){R.freeze-=dt;return;}
  R.tutPrompt=null;
  if(R.tut&&!R.moment){
    const o=R.obs.find(o=>o.tut&&!o.passed);
    if(o){const d=o.x-(R.dist+PX);if(d<(o.tut==='jump'?150:230)&&d>-o.w+10&&!o.hitDone){const ok=o.tut==='jump'?!R.p.onG:inp.duckHeld;if(!ok){R.tutPrompt=o.tut;dt*=.18;}}}
    else{R.tut=false;try{localStorage.setItem('sr-tut','1');}catch(e){}say('¡MUY BIEN!',W/2,200,'#7cff7c',44);sfx('win');}
  }
  R.t+=dt;R.clock+=dt/SEC_PER_MIN;
  R.shake=Math.max(0,R.shake-dt);
  R.texts.forEach(s=>{s.t-=dt;s.y-=40*dt;});R.texts=R.texts.filter(s=>s.t>0);
  R.parts.forEach(q=>{q.t-=dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy+=500*dt;});R.parts=R.parts.filter(q=>q.t>0);
  if(R.banner){R.banner.t-=dt;if(R.banner.t<=0)R.banner=null;}
  const p=R.p;
  p.blinkT-=dt;if(p.blinkT<-.12)p.blinkT=rnd(2,4);
  if(R.moment){updateMoment(dt);p.ph+=dt*2;return;}
  // velocidad
  let target=speedAt(R.dist);if(R.kids.some(k=>k.trip>0))target*=.55;if(R.power){if(R.power.type==='scooter')target*=1.4;if(R.power.type==='coffee')target*=1.28;}
  R.speed+=(target-R.speed)*Math.min(1,dt*3);
  const dd=R.speed*dt;R.dist+=dd;
  // tramo
  const sec=secAt(R.dist+PX);if(sec!==R.sec){R.sec=sec;R.banner={txt:{sanse:'¡SANSE!',alco:'¡ALCOBENDAS!',cole:G.school?'¡'+G.school.toUpperCase()+'!':'¡EL COLE!'}[sec]||'',t:1.8};sfx('power');}
  // momentos
  const m=R.moments.find(m=>!m.done&&R.dist>=m.at);if(m){startMoment(m);return;}
  // power-up
  if(R.power){R.power.t-=dt;if(R.power.t<=0)R.power=null;}
  // salto y gravedad
  inp.jumpBuf-=dt;
  if(inp.jumpBuf>0){
    if(p.onG){p.vy=-930;p.onG=false;p.jumps=1;p.sx=.78;p.sy=1.25;inp.jumpBuf=0;sfx('jump');puff(PX,GY,'#c9a27a',6,90);}
    else if(p.jumps<2){p.vy=-820;p.jumps=2;p.spin=1;inp.jumpBuf=0;sfx('jump2');puff(PX,p.y-40,'#fff',8,120);}
  }
  const ducking=inp.duckHeld&&p.onG;p.ducking=ducking;
  if(inp.duckHeld&&!p.onG&&p.vy<700)p.vy=Math.max(p.vy,700);
  let g=2600;if(R.power&&R.power.type==='umbrella'&&p.vy>0)g=600;
  p.vy+=g*dt;if(R.power&&R.power.type==='umbrella')p.vy=Math.min(p.vy,170);
  p.y+=p.vy*dt;
  if(p.y>=GY){if(!p.onG){p.sx=1.28;p.sy=.76;sfx('land');puff(PX,GY,'#c9a27a',6,80);}p.y=GY;p.vy=0;p.onG=true;p.jumps=0;}
  p.sx+=(1-p.sx)*Math.min(1,dt*12);p.sy+=(1-p.sy)*Math.min(1,dt*12);
  if(p.spin>0){p.spin=Math.max(0,p.spin-dt*2.8);}
  p.ph+=dd*.03;p.inv=Math.max(0,p.inv-dt);p.stumble=Math.max(0,(p.stumble||0)-dt);
  if(p.faceT>0){p.faceT-=dt;if(p.faceT<=0)p.face='happy';}
  if(!p.onG&&p.face!=='ouch')p.face='open';else if(p.onG&&p.face==='open')p.face='happy';
  // historia para los niños
  R.hist.push(p.y);if(R.hist.length>40)R.hist.shift();
  R.kids.forEach((k,i)=>{const slot=-110*(i+1);if(k.trip>0){k.trip-=dt;k.dx-=dd*.85;}else k.dx+=(slot-k.dx)*Math.min(1,dt*2.2);k.dx=Math.max(-PX-60,k.dx);});
  // frases
  R.lineT-=dt;if(R.lineT<=0){R.lineT=rnd(6,9);say(pick(HEROES[G.hero].lines),PX+20,p.y-200,'#ffd23f',22);}
  // generar y mover
  spawn();
  const top=p.y-(ducking?64:124),me={x:R.dist+PX-22,y:top,w:44,h:(ducking?64:124)-6};
  R.obs.forEach(o=>{
    o.t+=dt;const def=OB[o.type];
    if(o.smash){o.x+=200*dt;o.y+=o.vy*dt;o.vy+=1600*dt;o.rot=(o.rot||0)+dt*8;return;}
    if(o.vx)o.x+=o.vx*dt;if(def.update)def.update(o,dt);
    const hb=def.hb?def.hb(o):{x:o.x+8,y:o.y+8,w:o.w-16,h:o.h-8};
    if(!o.hitDone&&me.x<hb.x+hb.w&&me.x+me.w>hb.x&&me.y<hb.y+hb.h&&me.y+me.h>hb.y){o.hitDone=true;hit(o);}
    if(!o.passed&&o.x+o.w<R.dist+PX-30){o.passed=true;if(!o.hitDone&&!o.smash){R.score+=5*R.mult;}}
  });
  R.obs=R.obs.filter(o=>o.x+o.w>R.dist-150&&o.y<H+200);
  R.items.forEach(it=>{
    if(it.taken)return;
    const dx=(it.x)-(R.dist+PX),dy=it.y-(top+ (ducking?32:62));
    const rad=it.kind==='power'?54:44;
    if(Math.abs(dx)<rad&&Math.abs(dy)<(ducking?44:80)){
      it.taken=true;
      if(it.kind==='toast'){R.toasts++;R.streak++;R.mult=Math.min(5,1+Math.floor(R.streak/8));R.st.maxMult=Math.max(R.st.maxMult,R.mult);R.score+=10*R.mult;sfx('coin',R.streak%12);puff(PX+dx,it.y,'#ffd23f',5,100);
        if(R.streak%8===0&&R.mult>1)say('¡RACHA x'+R.mult+'!',PX+40,it.y-50,'#ffd23f',32);}
      else{R.power={type:it.type,t:POWERS[it.type].dur};if(!R.st.powers.includes(it.type))R.st.powers.push(it.type);sfx('power');say(POWERS[it.type].name,PX+40,GY-250,'#fff',36);puff(PX,p.y-60,POWERS[it.type].col,20,240);}
    }
  });
  R.items=R.items.filter(it=>!it.taken&&it.x>R.dist-100);
}
function finish(){
  G.state='end';stopMusic();document.body.classList.remove('playing');
  const arr=Math.floor(R.clock),diff=BELL-arr;
  let stars,title,msg;
  if(diff>=2){stars=3;title='¡FAMILIA PUNTUAL!';msg=`Llegáis${alCole()} a las <b>${fmt(arr)}</b>. Hasta el conserje aplaude 👏`;}
  else if(diff>=0){stars=2;title='¡POR LOS PELOS!';msg=`Entráis${alCole()} a las <b>${fmt(arr)}</b>, con la campana sonando 🔔`;}
  else{stars=1;title='¡LLEGAMOS TARDE!';msg=`Son las <b>${fmt(arr)}</b>… ${-diff} min tarde. ¡Mañana lo bordáis!`;}
  const got=[];const chk=(id,c)=>{if(c&&!G.done.includes(id)){G.done.push(id);got.push(id);}};
  chk('first',true);chk('stars3',stars===3);chk('mult5',R.st.maxMult>=5);chk('toast100',R.toasts>=100);
  chk('reflex',R.st.reflex<.35);chk('powers3',R.st.powers.length>=3);chk('pts3000',R.score>=3000);chk('nohit',R.hits===0);
  saveKids();
  const prizes=got.map(id=>RETOS.find(r=>r.id===id).prize);
  let best=0,rec=false;try{best=parseInt(localStorage.getItem('sr-best'))||0;if(R.score>best){localStorage.setItem('sr-best',R.score);rec=best>0;best=R.score;}}catch(e){}
  const e=$('#end');
  e.innerHTML=`<div class="card"><h1>${title}</h1><div class="stars">${'⭐'.repeat(stars)}${'☆'.repeat(3-stars)}</div><p>${msg}</p>
    <div class="res"><span>🏆 ${R.score} puntos</span><span>🍞 ${R.toasts} ${R.toasts===1?'tostada':'tostadas'}</span><span>💥 ${R.hits} ${R.hits===1?'golpe':'golpes'}</span></div>
    ${rec?'<p class="best">¡NUEVO RÉCORD!</p>':`<p class="best">Récord: ${best}</p>`}
    ${prizes.length?`<div class="prize">🎁 ¡Desbloqueado!<br>${prizes.join(' · ')}</div>`:`<p class="small">Retos: ${G.done.length}/${RETOS.length}</p>`}
    <button class="btn" id="again">OTRA MAÑANA</button>${prizes.length?'<button class="btn alt" id="dress">👕 VESTIR PEQUES</button>':'<button class="btn alt" id="tomenu">MENÚ</button>'}</div>`;
  e.classList.remove('hidden');
  $('#again').onclick=play;if($('#tomenu'))$('#tomenu').onclick=menu;if($('#dress'))$('#dress').onclick=()=>{menu();custom();};
  if(prizes.length)setTimeout(()=>{sfx('power');burst();},500);
  if(stars>=2)sfx('win');else sfx('bad');
}
