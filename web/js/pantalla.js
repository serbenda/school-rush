// School Rush · pantalla.js
// Dibujo de cada fotograma: escena, HUD y momentos

// =====================================================================
//  RENDER
// =====================================================================
function drawScene(){
  const cam=R?R.dist:G.t*200;
  // fondos por tramos con recorte en las fronteras
  const ranges=[['casa',-1e9,B1],['sanse',B1,BM],['alco',BM,B2],['cole',B2,1e12]];
  ranges.forEach(([k,a,b])=>{const sa=a-cam,sb=b-cam;if(sb<0||sa>W)return;ctx.save();ctx.beginPath();ctx.rect(Math.max(0,sa),0,Math.min(W,sb)-Math.max(0,sa),H);ctx.clip();BG[k](cam);ctx.restore();});
  const d1=B1-cam;if(d1>-200&&d1<W+50)drawFrontDoor(d1-60);
}
function render(){
  ctx.setTransform(SC*DPR,0,0,SC*DPR,0,0);
  if(G.state==='menu'||!R){ // fondo animado del menú
    const cam=G.t*240;bgCalle(cam);
    const ph=G.t*12;
    [[PX-200,24],[PX-110,24],[PX+4,40]].forEach(([x,w])=>{ctx.globalAlpha=.2;ell(x,GY+4,w,7,'#2b1a3a',0);ctx.globalAlpha=1;});
    drawKid(PX-200,GY,{ph:ph+1},G.kids[1]);drawKid(PX-110,GY,{ph:ph+.5},G.kids[0]);
    drawAdult(PX,GY,{hero:G.hero,ph,t:G.t,blink:(G.t%3)<.12});
    return;
  }
  const p=R.p;
  ctx.save();
  if(R.shake>0)ctx.translate(rnd(-8,8)*R.shake*3,rnd(-6,6)*R.shake*3);
  drawScene();
  const cam=R.dist;
  // puerta del cole al final
  const gx=D+PX+60-cam;if(gx<W+300)drawSchoolGate(gx,R.moment&&R.moment.type==='gate'?R.moment.open:(R.dist>=D?1:.6));
  // objetos
  R.items.forEach(it=>{const x=it.x-cam;if(x<-60||x>W+60)return;if(it.kind==='toast')drawToast(x,it.y,G.t);else drawPower(it.type,x,it.y,G.t);});
  const shadow=(x,y,w,a)=>{ctx.globalAlpha=a;ell(x,y,w,Math.max(3,w*.16),'#2b1a3a',0);ctx.globalAlpha=1;};
  R.obs.forEach(o=>{const x=o.x-cam;if(x<-260||x>W+60||o.smash||o.type==='puddle')return;const air=GY-(o.y+o.h);if(OB[o.type].kind==='low'||o.type==='ball')shadow(x+o.w/2,GY+4,o.w*.48*Math.max(.4,1-air/250),.2);});
  R.obs.forEach(o=>{const x=o.x-cam;if(x<-260||x>W+60)return;
    if(o.smash){ctx.save();ctx.translate(x+o.w/2,o.y+o.h/2);ctx.rotate(o.rot||0);ctx.translate(-(x+o.w/2),-(o.y+o.h/2));OB[o.type].draw(o,x);ctx.restore();}
    else OB[o.type].draw(o,x);});
  // niños
  R.kids.forEach((k,i)=>{
    const hy=R.hist[Math.max(0,R.hist.length-1-(i+1)*6)];const y=hy===undefined?GY:hy;
    shadow(PX+k.dx,GY+4,24*Math.max(.4,1-(GY-y)/300),.2);
    const air=y<GY-2,st=R.moment?'idle':(air?'jump':'run');
    drawKid(PX+k.dx,y,{ph:p.ph*1.25+i,state:k.trip>0?'idle':st,rot:k.trip>0?-1.3:0,face:k.trip>0?'ouch':(air?'open':'happy'),stars:k.trip>0,blink:p.blinkT<0},G.kids[i]);
  });
  // jugador
  shadow(PX+4,GY+4,40*Math.max(.35,1-(GY-p.y)/320),.22);
  if(!(p.inv>0&&Math.floor(G.t*16)%2)){
    if(R.power&&R.power.type==='scooter'){rr(PX-40,GY-14,90,10,5,'#ff5d8f',4);circ(PX-30,GY-2,10,'#4a4a5c',4);circ(PX+40,GY-2,10,'#4a4a5c',4);seg(PX+40,GY-14,PX+36,GY-110,OL,7);seg(PX+26,GY-110,PX+48,GY-110,OL,7);
      for(let i=0;i<4;i++)seg(PX-120-i*30,GY-40-i*24,PX-60-i*30,GY-40-i*24,'rgba(255,255,255,.7)',4);}
    const lift=R.power&&R.power.type==='scooter'&&p.onG?-14:0;
    const st=R.moment?'idle':p.ducking?'duck':(p.onG?'run':'jump');
    drawAdult(PX,p.y+lift,{hero:G.hero,ph:p.ph,state:st,sx:p.sx,sy:p.sy,face:p.face,t:G.t,rot:p.spin>0?(1-p.spin)*Math.PI*2:(p.stumble>0?Math.sin(p.stumble*28)*.28*p.stumble/.7:0),blink:p.blinkT<0});
    if(R.power&&R.power.type==='umbrella'){const ux=PX+10,uy=p.y-200;seg(ux,uy,ux,uy+70,OL,5);ctx.beginPath();ctx.arc(ux,uy,62,Math.PI,0);ctx.closePath();shape('#7b6cf6',5);
      for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(ux,uy);ctx.arc(ux,uy,62,Math.PI+i*Math.PI/3,Math.PI+i*Math.PI/3+Math.PI/6);ctx.closePath();shape('#ffd23f',0);}ctx.beginPath();ctx.arc(ux,uy,62,Math.PI,0);ctx.closePath();shape(null,5);}
    if(R.power&&R.power.type==='coffee'&&Math.floor(G.t*20)%2){for(let i=0;i<3;i++)seg(PX-60-i*20,p.y-100+i*30,PX-100-i*20,p.y-100+i*30,'rgba(255,255,255,.8)',4);}
  }
  R.parts.forEach(q=>{ctx.globalAlpha=Math.min(1,q.t*2);circ(q.x,q.y,q.r,q.col,0);ctx.globalAlpha=1;});
  R.texts.forEach(s=>{ctx.globalAlpha=Math.min(1,s.t*2);txt(s.s,s.x,s.y,s.size,s.col);ctx.globalAlpha=1;});
  ctx.restore();
  drawMoment();
  drawHUD();
}
function drawHUD(){
  // reloj
  const late=R.clock>=BELL-3;const pulse=late?1+Math.sin(G.t*10)*.05:1;
  ctx.save();ctx.translate(96,46);ctx.scale(pulse,pulse);
  rr(-82,-32,164,64,18,late?'#e0412a':'#fff',5);
  txt(fmt(R.clock),-10,0,40,late?'#fff':OL,'center',late?OL:'#fff');
  txt('🔔9:00',52,20,14,late?'#fff':'#7b6cf6','center',late?OL:'#fff');
  ctx.restore();
  // progreso
  const px0=300,pw=360,pr=clamp(R.dist/D,0,1);
  rr(px0,30,pw,16,8,'rgba(43,35,64,.55)',0);rr(px0,30,Math.max(16,pw*pr),16,8,'#7cff7c',3);
  [[0,'🏠'],[B1/D,'🎉'],[BM/D,'🚇'],[B2/D,'🏫']].forEach(([f,e])=>{ctx.font='22px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(e,px0+pw*f+(f?0:-4),20);});
  circ(px0+pw*pr,38,13,SKIN,3);circ(px0+pw*pr,32,10,HEROES[G.hero].hair,0);circ(px0+pw*pr,38,10,SKIN,0);circ(px0+pw*pr+4,37,2,OL,0);
  // puntos
  rr(W-226,14,160,56,16,'#fff',5);drawToast(W-196,42,0);txt(String(R.score),W-120,42,30,OL,'center','#fff');
  if(R.mult>1){rr(W-90,58,54,28,12,'#ffd23f',4);txt('x'+R.mult,W-63,72,20,OL,'center','#ffd23f');}
  // power-up activo
  if(R.power){const P=POWERS[R.power.type],f=R.power.t/P.dur;ctx.beginPath();ctx.arc(W-40,120,24,-Math.PI/2,-Math.PI/2+Math.PI*2*f);ctx.lineWidth=8;ctx.strokeStyle=P.col;ctx.stroke();drawPower(R.power.type,W-40,120,0);}
  // banner de tramo
  if(R.banner&&!R.moment){const a=Math.min(1,R.banner.t*2);ctx.globalAlpha=a;txt(R.banner.txt,W/2,170,64,'#ffd23f');ctx.globalAlpha=1;}
  // ayuda al principio
  if(R.tutPrompt){
    const pul=1+Math.sin(G.t*10)*.06;ctx.save();ctx.translate(W/2,200);ctx.scale(pul,pul);
    rr(-250,-60,500,120,30,'rgba(255,255,255,.95)',5);
    if(R.tutPrompt==='jump'){txt('¡SALTA!',0,-18,52,'#ff6b4a');txt(TOUCH?'Pulsa el botón ⬆ SALTAR':'Pulsa ESPACIO o ↑',0,30,24,'#7b6cf6','center','#fff');}
    else{txt('¡AGÁCHATE!',0,-18,52,'#ff6b4a');txt(TOUCH?'Mantén pulsado el botón ⬇ AGACHAR':'Mantén pulsado ↓',0,30,24,'#7b6cf6','center','#fff');}
    ctx.restore();
    const ax=PX+60,ay=R.tutPrompt==='jump'?330:400+Math.sin(G.t*10)*8;
    txt(R.tutPrompt==='jump'?'⬆':'⬇',ax,ay+(R.tutPrompt==='jump'?Math.sin(G.t*10)*8:0),64,'#ffd23f');
  }
  if(R.t<4&&!R.moment&&!R.tut){ctx.globalAlpha=Math.min(1,(4-R.t));
    txt(TOUCH?'⬆ SALTAR  (pulsa 2 veces = doble salto)':'ESPACIO / ↑ : SALTAR  (dos veces = doble salto)',W/2,240,24,'#fff');
    txt(TOUCH?'⬇ AGACHAR  (mantén pulsado)':'↓ : AGACHARSE',W/2,276,24,'#fff');ctx.globalAlpha=1;}
}
function drawMoment(){
  const m=R.moment;if(!m)return;
  ctx.fillStyle='rgba(30,24,56,.35)';ctx.fillRect(0,0,W,H);
  if(m.type==='teeth'){
    rr(W/2-230,90,460,300,30,'#fff',6);txt('¡A LAVARSE LOS DIENTES!',W/2,128,32,'#7b6cf6');
    // boca
    ell(W/2,250,150,70,'#c0392b',5);ctx.save();ctx.beginPath();ctx.ellipse(W/2,250,146,66,0,0,Math.PI*2);ctx.clip();
    for(let i=0;i<7;i++){rr(W/2-140+i*40,190,36,40,8,'#fffdf2',3);rr(W/2-140+i*40,270,36,40,8,'#fffdf2',3);}
    const dirty=1-m.count/m.need;ctx.globalAlpha=dirty;for(let i=0;i<9;i++){circ(W/2-120+hash(i)*240,210+hash(i+9)*80,8,'#7bd389',2);}ctx.globalAlpha=1;
    for(let i=0;i<m.count;i++)circ(W/2-130+hash(i+20)*260,200+hash(i+40)*100,10+hash(i)*8,'#fff',2);
    ctx.restore();
    const bx=W/2+Math.sin(G.t*30)*(m.count?60:20);ctx.save();ctx.translate(bx,300);ctx.rotate(-.3);rr(-10,0,150,22,10,'#3d7be0',4);rr(-34,-16,40,24,6,'#fff',4);ctx.restore();
    rr(W/2-180,350,360,22,11,'#eee',3);rr(W/2-180,350,Math.max(22,360*Math.min(1,m.count/m.need)),22,11,'#7cff7c',3);
    txt(m.res?'':TOUCH?'¡TOCA RÁPIDO!':'¡PULSA ESPACIO RÁPIDO!',W/2,420,30,'#ffd23f');
    if(!m.res){const left=Math.max(0,m.dur-m.t);txt(left.toFixed(1)+'s',W/2+200,128,22,'#ff6b6b');}
  }else if(m.type==='light'){
    const x=W/2+160;rr(x-10,180,20,GY-180,6,'#4a4a5c',4);rr(x-46,60,92,200,20,OL,0);
    circ(x,104,30,m.phase==='red'?'#ff3b3b':'#4a1a1a',4);circ(x,198,30,m.phase==='green'?'#39ff6a':'#123a1a',4);
    if(m.phase==='red'){txt('¡ROJO! ESPERA…',W/2-120,200,40,'#ff6b6b');}
    else txt(TOUCH?'¡VERDE! ¡TOCA!':'¡VERDE! ¡ESPACIO!',W/2-120,200,44,'#7cff7c');
    for(let i=0;i<6;i++)rr(W/2+60+i*34,GY+48,22,46,3,'#fff',0);
  }else if(m.type==='gate'){
    txt('¡QUE CIERRAN LA PUERTA!',W/2,120,42,'#ffd23f');
    txt(TOUCH?'¡TOCA SIN PARAR PARA ENTRAR!':'¡PULSA ESPACIO SIN PARAR!',W/2,170,28,'#fff');
    rr(W/2-180,200,360,24,12,'#eee',3);rr(W/2-180,200,Math.max(24,360*m.open),24,12,m.open>.3?'#7cff7c':'#ff6b6b',3);
  }
}
