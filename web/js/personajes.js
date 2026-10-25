// School Rush · personajes.js
// Mamá, papá y los peques: dibujo vectorial animado

// =====================================================================
//  PERSONAJES
// =====================================================================
const SKIN='#ffd2b0';
const HEROES={
  mama:{name:'Mamá',hair:'#6b2f1a',top:'#ff5d8f',dots:'#ffd1e0',belt:'#7b3fa0',leg:SKIN,shoe:'#e0244a',mom:true,
        lines:['¡Vamos, cariño!','¡Que llegamos tarde!','¿Y los zapatos?','¡Corre, corre!','¡La mochila!','¡Mis llaves!']},
  papa:{name:'Papá',hair:'#2d2016',top:'#3d7be0',bottom:'#2f3b66',leg:'#2f3b66',shoe:'#6b4423',tie:'#e0412a',
        lines:['¡Vamos, campeones!','¡Que llegamos tarde!','¿Quién tiene el almuerzo?','¡Corre, corre!','¡Ese abrigo!']},
  conserje:{name:'Conserje',hair:'#b9bfcc',top:'#3a4a6a',bottom:'#2b3352',leg:'#2b3352',shoe:'#222',tie:'#b9bfcc',noBag:true,lines:[]}
};

function legPose(state,ph,side){ // devuelve pie relativo a la cadera
  if(state==='jump')return side>0?{x:16,y:30}:{x:-14,y:34};
  if(state==='idle')return {x:side*7,y:44};
  const a=Math.sin(ph+(side>0?0:Math.PI))*.85;
  const lift=Math.max(0,Math.cos(ph+(side>0?0:Math.PI)))*12;
  return {x:Math.sin(a)*40,y:Math.cos(a)*44-lift};
}
function face(x,y,r,o,mom,kid){
  // ojos
  const ex=[x+r*.28,x+r*.74],ey=y-r*.05,er=r*(kid?.2:.17);
  if(o.face==='dizzy'){ex.forEach(e=>{seg(e-er,ey-er,e+er,ey+er,OL,3.5);seg(e-er,ey+er,e+er,ey-er,OL,3.5);});}
  else if(o.blink){ex.forEach(e=>seg(e-er,ey,e+er,ey,OL,3));}
  else ex.forEach(e=>{ell(e,ey,er,er*1.25,'#fff',2.5);circ(e+er*.35,ey+er*.15,er*.55,OL,0);circ(e+er*.1,ey-er*.35,er*.22,'#fff',0);});
  if(mom&&!o.blink&&o.face!=='dizzy')ex.forEach(e=>{seg(e+er*.5,ey-er*1.2,e+er*1.1,ey-er*1.7,OL,2.5);seg(e+er*.9,ey-er*.8,e+er*1.5,ey-er*1.2,OL,2.5);});
  // mofletes
  ctx.globalAlpha=.45;circ(x+r*.12,y+r*.35,r*.16,'#ff7b9c',0);circ(x+r*.92,y+r*.33,r*.14,'#ff7b9c',0);ctx.globalAlpha=1;
  // boca
  const mx=x+r*.55,my=y+r*.42;
  if(o.face==='ouch'||o.face==='dizzy'){ctx.beginPath();ctx.ellipse(mx,my+2,r*.16,r*.2,0,0,Math.PI*2);shape('#7a1f2b',2.5);}
  else if(o.face==='open'){ctx.beginPath();ctx.moveTo(mx-r*.22,my-2);ctx.quadraticCurveTo(mx,my+r*.42,mx+r*.24,my-2);ctx.closePath();shape('#7a1f2b',2.5);}
  else{ctx.beginPath();ctx.arc(mx,my-r*.08,r*.22,.15*Math.PI,.85*Math.PI);ctx.lineWidth=3;ctx.strokeStyle=OL;ctx.lineCap='round';ctx.stroke();}
  if(mom&&o.face==='happy'){ctx.beginPath();ctx.arc(mx,my-r*.08,r*.22,.25*Math.PI,.75*Math.PI);ctx.lineWidth=2;ctx.strokeStyle='#e0244a';ctx.stroke();}
}
function drawAdult(x,y,o){
  const P=HEROES[o.hero],ph=o.ph||0,st=o.state||'run',t=o.t||0;
  ctx.save();ctx.translate(x,y);ctx.scale(o.sx||1,o.sy||1);
  if(st==='duck'){ctx.scale(1.16,.56);}
  if(o.rot){ctx.translate(0,-60);ctx.rotate(o.rot);ctx.translate(0,60);}
  const bob=st==='run'?-Math.abs(Math.cos(ph))*5:0;ctx.translate(0,bob);
  SHADEG=ctx.createLinearGradient(-50,-170,46,-10);SHADEG.addColorStop(0,'rgba(255,255,255,.32)');SHADEG.addColorStop(.42,'rgba(255,255,255,0)');SHADEG.addColorStop(1,'rgba(60,10,70,.2)');
  const hip={x:0,y:-46};
  const sway=Math.sin(t*9)*5+(st==='jump'?-10:0);
  // pelo largo por detrás (mamá)
  if(P.mom){ctx.beginPath();ctx.moveTo(-14,-140);ctx.quadraticCurveTo(-52,-128+sway,-48+sway*.6,-84);ctx.quadraticCurveTo(-36,-92,-24,-96);ctx.quadraticCurveTo(-30,-112,-10,-112);ctx.closePath();shape(P.hair,4);}
  // mochila (papá)
  if(!P.mom&&!P.noBag)rr(-34,-98,20,40,8,'#e0412a',4);
  // pierna de atrás
  const fb=legPose(st,ph,-1),ff=legPose(st,ph,1);
  limb(hip.x-5,hip.y,hip.x-5+fb.x,hip.y+fb.y,P.mom?'#f0bd98':'#26304f',11);ell(hip.x-5+fb.x+5,hip.y+fb.y,11,6.5,P.shoe,3);
  // brazo de atrás
  const aa=st==='run'?Math.sin(ph)*.9:0;
  const back=st==='jump'?{x:-26,y:-126}:{x:-2+Math.sin(aa)*-28,y:-88+Math.cos(aa)*30};
  limb(-2,-88,back.x,back.y,'#f0bd98',9);
  // cuerpo
  if(P.mom){
    ctx.beginPath();ctx.moveTo(-16,-96);ctx.lineTo(16,-96);ctx.quadraticCurveTo(22,-70,32,-40);ctx.quadraticCurveTo(0,-30,-32,-40);ctx.quadraticCurveTo(-22,-70,-16,-96);ctx.closePath();shape(P.top,4);
    [[-14,-48],[8,-44],[18,-56],[-4,-60],[-20,-58]].forEach(d=>circ(d[0],d[1],2.6,P.dots,0));
    rr(-19,-74,38,7,3,P.belt,3);
  }else{
    rr(-19,-98,38,52,12,P.top,4);
    ctx.beginPath();ctx.moveTo(2,-96);ctx.lineTo(8,-80);ctx.lineTo(2,-62);ctx.lineTo(-4,-80);ctx.closePath();shape(P.tie,2.5);
    rr(-19,-52,38,10,4,P.bottom,4);
  }
  // pierna de delante
  limb(hip.x+5,hip.y,hip.x+5+ff.x,hip.y+ff.y,P.mom?SKIN:P.leg,11);ell(hip.x+5+ff.x+5,hip.y+ff.y,11,6.5,P.shoe,3);
  // bolso (mamá)
  if(P.mom){seg(4,-92,18,-62,OL,3);rr(8,-66,24,20,6,'#8b5cf6',3.5);rr(16,-62,8,4,2,'#ffd23f',0);}
  // brazo de delante
  const front=st==='jump'?{x:26,y:-128}:{x:2+Math.sin(aa)*28,y:-88+Math.cos(aa)*30};
  limb(2,-88,front.x,front.y,SKIN,9);circ(front.x,front.y,6,SKIN,3);
  // cabeza
  const hx=4,hy=-124,r=32;
  circ(hx,hy,r,SKIN,4);
  circ(hx-14,hy+4,7,SKIN,3);
  if(P.mom){
    ctx.beginPath();ctx.arc(hx,hy,r+2,Math.PI*.92,Math.PI*2.04);ctx.quadraticCurveTo(hx+26,hy-6,hx+14,hy-10);ctx.quadraticCurveTo(hx+2,hy-18,hx-8,hy-6);ctx.quadraticCurveTo(hx-18,hy+2,hx-24,hy+12);ctx.closePath();shape(P.hair,4);
    ctx.beginPath();ctx.arc(hx,hy,r+1,Math.PI*1.12,Math.PI*1.72);ctx.lineWidth=10;ctx.strokeStyle=OL;ctx.stroke();ctx.lineWidth=6;ctx.strokeStyle='#e0244a';ctx.stroke();
    circ(hx-14,hy+14,4,'#ffd23f',2);
  }else{
    ctx.beginPath();ctx.arc(hx,hy,r+2,Math.PI*.95,Math.PI*1.98);ctx.lineTo(hx+30,hy-14);ctx.quadraticCurveTo(hx+20,hy-20,hx+10,hy-14);ctx.quadraticCurveTo(hx-6,hy-22,hx-20,hy-6);ctx.closePath();shape(P.hair,4);
    ctx.globalAlpha=.28;ctx.beginPath();ctx.arc(hx,hy,r-2,.05*Math.PI,.75*Math.PI);ctx.closePath();shape(P.hair,0);ctx.globalAlpha=1;
  }
  face(hx-6,hy,r,o,P.mom,false);
  if(!P.mom){seg(hx+2,hy-14,hx+12,hy-16,OL,4);seg(hx+18,hy-16,hx+28,hy-14,OL,4);}
  SHADEG=null;ctx.restore();
}
const kc=c=>c==='gold'?'#f5c542':c;
function drawKid(x,y,o,K){
  ctx.save();ctx.translate(x,y);ctx.scale(.62,.62);
  if(o.rot){ctx.translate(0,-40);ctx.rotate(o.rot);ctx.translate(0,40);}
  const ph=o.ph||0,st=o.state||'run',t=G.t;
  const bob=st==='run'?-Math.abs(Math.cos(ph))*6:0;ctx.translate(0,bob);
  SHADEG=ctx.createLinearGradient(-50,-170,50,-10);SHADEG.addColorStop(0,'rgba(255,255,255,.32)');SHADEG.addColorStop(.42,'rgba(255,255,255,0)');SHADEG.addColorStop(1,'rgba(60,10,70,.2)');
  const fb=legPose(st,ph,-1),ff=legPose(st,ph,1);
  const skirt=K.uni!=='pantalon';const LEG=skirt?'#f0bd98':'#7d8290',LEGF=skirt?SKIN:'#8f95a3',SOCK=skirt?'#2b2340':'#2b2340';
  // capa
  if(K.acc==='capa'){const fl=Math.sin(t*12)*7+(st==='jump'?-12:0);ctx.beginPath();ctx.moveTo(-12,-96);ctx.quadraticCurveTo(-56,-80+fl,-54+fl,-34);ctx.lineTo(-18,-46);ctx.closePath();shape('#e0412a',4);}
  // mochila
  if(K.bag==='rainbow'){ctx.save();ctx.beginPath();ctx.roundRect(-32,-100,26,38,8);ctx.clip();['#e0412a','#ff9f43','#ffd23f','#2bb673','#3d7be0','#7b6cf6'].forEach((c,i)=>{ctx.fillStyle=c;ctx.fillRect(-32,-100+i*6.5,26,6.5);});ctx.restore();rr(-32,-100,26,38,8,null,4);}
  else if(K.bigBag){rr(-44,-112,38,58,12,K.bag,4);rr(-40,-80,30,14,5,'rgba(0,0,0,.18)',2.5);seg(-40,-112,-40,-56,'rgba(255,255,255,.35)',3);}
  else rr(-32,-100,26,38,8,K.bag,4);
  limb(-4,-46,-4+fb.x*.8,-46+fb.y,LEG,12);ell(-4+fb.x*.8+5,-46+fb.y,12,7,SOCK,3);
  const aa=st==='run'?Math.sin(ph)*.9:0;
  const backH=st==='jump'?{x:-24,y:-122}:{x:-2-Math.sin(aa)*26,y:-88+Math.cos(aa)*28};
  limb(-2,-88,backH.x,backH.y,kc(K.top),10);circ(backH.x,backH.y,5.5,'#f0bd98',2.5);
  rr(-20,-98,40,40,14,kc(K.top),4);
  if(K.top==='gold'){const sp=(t*3|0)%3;txt('✦',-8+sp*8,-84+sp*4,14,'#fff');}
  if(skirt){ // falda de cuadros verde del uniforme
    const sk=()=>{ctx.beginPath();ctx.moveTo(-22,-64);ctx.lineTo(22,-64);ctx.lineTo(30,-38);ctx.lineTo(-30,-38);ctx.closePath();};
    sk();ctx.fillStyle='#1f6b45';ctx.fill();
    ctx.save();sk();ctx.clip();
    ctx.globalAlpha=.55;for(let x=-34;x<34;x+=12)fillR(x,-66,6,30,'#0e4a2c');for(let y=-64;y<-36;y+=10)fillR(-34,y,68,5,'#0e4a2c');
    ctx.globalAlpha=.9;for(let x=-31;x<34;x+=12)fillR(x,-66,1.5,30,'#cfe8a8');for(let y=-61;y<-36;y+=10)fillR(-34,y,68,1.5,'#cfe8a8');
    ctx.globalAlpha=.35;for(let x=-28;x<34;x+=12)seg(x,-64,x+(x<0?-3:3),-38,'#0a3a22',2);ctx.globalAlpha=1;
    ctx.restore();sk();shape(null,4);
  }else{ // pantalón gris del uniforme
    rr(-20,-64,40,20,6,'#8f95a3',4);seg(0,-60,0,-46,'#6b7080',2);
  }
  limb(4,-46,4+ff.x*.8,-46+ff.y,LEGF,12);ell(4+ff.x*.8+5,-46+ff.y,12,7,SOCK,3);
  const frontH=st==='jump'?{x:24,y:-124}:{x:2+Math.sin(aa)*26,y:-88+Math.cos(aa)*28};
  limb(2,-88,frontH.x,frontH.y,kc(K.top),10);circ(frontH.x,frontH.y,5.5,SKIN,2.5);
  if(K.top==='#23232b'){ // jersey negro del uniforme: cuello de polo blanco y puños
    ctx.beginPath();ctx.moveTo(-13,-93);ctx.lineTo(-1,-80);ctx.lineTo(-3,-93);ctx.closePath();shape('#fff',2.5);
    ctx.beginPath();ctx.moveTo(13,-93);ctx.lineTo(1,-80);ctx.lineTo(3,-93);ctx.closePath();shape('#fff',2.5);
    seg(0,-80,0,-70,'#4a4a58',2);fillR(-18,-64,36,4,'#3a3a46');}
  const hx=2,hy=-128,r=36;
  if(K.style==='melena'){rr(hx-38,hy-18,64,62,24,K.hair,4);}
  if(K.style==='coletas'){const s2=Math.sin(t*10)*3;circ(hx-36,hy-4+s2,14,K.hair,4);circ(hx+38,hy-8-s2,12,K.hair,4);}
  circ(hx,hy,r,SKIN,4);
  if(K.style==='corto'){ctx.beginPath();ctx.arc(hx,hy,r+2,Math.PI*1.0,Math.PI*1.95);ctx.quadraticCurveTo(hx+22,hy-22,hx+8,hy-20);ctx.quadraticCurveTo(hx-8,hy-28,hx-30,hy-4);ctx.closePath();shape(K.hair,4);}
  else{ctx.beginPath();ctx.arc(hx,hy,r+2,Math.PI*.95,Math.PI*2.02);ctx.quadraticCurveTo(hx+20,hy-14,hx+6,hy-14);ctx.quadraticCurveTo(hx-12,hy-20,hx-26,hy+6);ctx.closePath();shape(K.hair,4);}
  face(hx-8,hy+2,r,o,false,true);
  // accesorios
  const A=K.acc;
  if(A==='lazo'){ctx.beginPath();ctx.moveTo(hx-8,hy-34);ctx.lineTo(hx-24,hy-44);ctx.lineTo(hx-22,hy-26);ctx.closePath();shape('#ff5d8f',3);ctx.beginPath();ctx.moveTo(hx-8,hy-34);ctx.lineTo(hx+6,hy-46);ctx.lineTo(hx+8,hy-28);ctx.closePath();shape('#ff5d8f',3);circ(hx-8,hy-34,5,'#ff5d8f',3);}
  if(A==='gafas'){circ(hx+2,hy+1,10,'#1e1a2e',3);circ(hx+20,hy+1,10,'#1e1a2e',3);seg(hx+11,hy,hx+12,hy,OL,3);seg(hx-8,hy-1,hx-20,hy-4,OL,3);ctx.globalAlpha=.5;circ(hx-1,hy-3,3,'#fff',0);circ(hx+17,hy-3,3,'#fff',0);ctx.globalAlpha=1;}
  if(A==='gorra'){ctx.beginPath();ctx.arc(hx,hy-8,r-2,Math.PI*1.02,Math.PI*1.98);ctx.closePath();shape('#3d7be0',4);rr(hx+10,hy-14,40,9,4,'#3d7be0',4);circ(hx,hy-42,4,'#ffd23f',2);}
  if(A==='corona'){ctx.beginPath();ctx.moveTo(hx-22,hy-30);ctx.lineTo(hx-22,hy-54);ctx.lineTo(hx-10,hy-40);ctx.lineTo(hx,hy-58);ctx.lineTo(hx+10,hy-40);ctx.lineTo(hx+22,hy-54);ctx.lineTo(hx+22,hy-30);ctx.closePath();shape('#ffd23f',4);circ(hx,hy-38,4,'#e0412a',2);}
  SHADEG=null;
  if(A==='navidad'){ctx.beginPath();ctx.moveTo(hx-34,hy-18);ctx.quadraticCurveTo(hx-6,hy-66,hx+36,hy-58);ctx.lineTo(hx+34,hy-20);ctx.closePath();shape('#e0412a',4);rr(hx-38,hy-26,76,14,7,'#fff',3.5);circ(hx+38,hy-58,9,'#fff',3);}
  if(A==='gato'){[[-1,hx-22],[1,hx+18]].forEach(([d,ex])=>{ctx.beginPath();ctx.moveTo(ex-12,hy-26);ctx.lineTo(ex+d*2,hy-56);ctx.lineTo(ex+12,hy-30);ctx.closePath();shape(K.hair==='#1e1a2e'?'#555':'#1e1a2e',4);ctx.beginPath();ctx.moveTo(ex-5,hy-30);ctx.lineTo(ex+d,hy-46);ctx.lineTo(ex+6,hy-31);ctx.closePath();shape('#ff9ec0',0);});}
  ctx.restore();
  if(o.stars){for(let i=0;i<3;i++){const a=G.t*6+i*2.1;txt('★',x+Math.cos(a)*24,y-70+Math.sin(a)*8,18,'#ffd23f');}}
}
