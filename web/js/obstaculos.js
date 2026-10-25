// School Rush · obstaculos.js
// Obstáculos, tostadas y power-ups

// =====================================================================
//  OBSTÁCULOS
// =====================================================================
const OB={
  lego:{w:76,h:40,kind:'low',init:o=>{o.y=GY-40;},draw(o,x){
    rr(x,GY-22,44,22,4,'#e0412a',4);rr(x+30,GY-22,44,22,4,'#3d7be0',4);rr(x+14,GY-42,44,22,4,'#ffd23f',4);
    [[x+8,GY-26],[x+26,GY-26],[x+48,GY-26],[x+64,GY-26],[x+22,GY-46],[x+42,GY-46]].forEach(p=>rr(p[0],p[1],10,6,2,'#fff8',2));}},
  ball:{w:52,h:52,kind:'low',init:o=>{o.y=GY-52;o.ph=Math.random()*3;},update(o,dt){o.t+=dt;o.y=GY-52-Math.abs(Math.sin(o.t*3.4+o.ph))*(R&&R.mode&&R.mode.ayuda?30:120);},draw(o,x){
    const cx=x+26,cy=o.y+26;circ(cx,cy,26,'#fff',4);ctx.save();ctx.beginPath();ctx.arc(cx,cy,24,0,Math.PI*2);ctx.clip();
    const r=o.t*-6;for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,30,r+i*2.1,r+i*2.1+1);ctx.closePath();ctx.fillStyle=['#e0412a','#3d7be0','#ffd23f'][i];ctx.fill();}ctx.restore();circ(cx,cy,26,null,4);circ(cx-8,cy-10,5,'#fff',0);
    ctx.globalAlpha=.2;ell(cx,GY-2,22-(GY-52-o.y)/12,5,'#000',0);ctx.globalAlpha=1;}},
  cat:{w:78,h:50,kind:'low',init:o=>{o.y=GY-50;},draw(o,x){
    const t=o.t,sw=Math.sin(t*6)*8;
    ctx.beginPath();ctx.moveTo(x+70,GY-24);ctx.quadraticCurveTo(x+96,GY-50+sw,x+82,GY-74+sw);ctx.lineWidth=12;ctx.strokeStyle=OL;ctx.lineCap='round';ctx.stroke();ctx.lineWidth=7;ctx.strokeStyle='#ff9f43';ctx.stroke();
    ell(x+44,GY-22,30,20,'#ff9f43',4);[x+24,x+60].forEach(lx=>rr(lx,GY-12,10,12,4,'#ff9f43',3));
    circ(x+18,GY-42,20,'#ff9f43',4);
    ctx.beginPath();ctx.moveTo(x+2,GY-52);ctx.lineTo(x+4,GY-74);ctx.lineTo(x+16,GY-60);ctx.closePath();shape('#ff9f43',3);
    ctx.beginPath();ctx.moveTo(x+22,GY-62);ctx.lineTo(x+32,GY-76);ctx.lineTo(x+36,GY-56);ctx.closePath();shape('#ff9f43',3);
    ell(x+10,GY-44,5,6,'#fff',2);ell(x+24,GY-44,5,6,'#fff',2);circ(x+9,GY-43,2.5,OL,0);circ(x+23,GY-43,2.5,OL,0);
    seg(x+16,GY-34,x+8,GY-30,OL,2);seg(x+16,GY-34,x+24,GY-30,OL,2);
    if(Math.sin(t*2)>.6)txt('¡FFF!',x+14,GY-94,20,'#fff');}},
  clothes:{w:200,h:70,kind:'high',init:o=>{o.y=GY-160;},hb:o=>({x:o.x+24,y:GY-150,w:152,h:62}),draw(o,x){
    rr(x,GY-200,10,200,4,'#a46a3e',3);rr(x+190,GY-200,10,200,4,'#a46a3e',3);
    ctx.beginPath();ctx.moveTo(x+5,GY-186);ctx.quadraticCurveTo(x+100,GY-170,x+195,GY-186);ctx.lineWidth=3;ctx.strokeStyle=OL;ctx.stroke();
    const sw=Math.sin(o.t*5)*.12;
    const items=[[x+30,'shirt','#3d7be0'],[x+76,'sock','#ff5d8f'],[x+104,'pants','#ffd23f'],[x+144,'shirt','#2bb673']];
    items.forEach(([ix,k,c],i)=>{ctx.save();ctx.translate(ix+14,GY-180);ctx.rotate(sw*(i%2?1:-1));
      if(k==='shirt'){ctx.beginPath();ctx.moveTo(-18,0);ctx.lineTo(18,0);ctx.lineTo(28,14);ctx.lineTo(20,20);ctx.lineTo(16,14);ctx.lineTo(16,50);ctx.lineTo(-16,50);ctx.lineTo(-16,14);ctx.lineTo(-20,20);ctx.lineTo(-28,14);ctx.closePath();shape(c,3.5);}
      else if(k==='sock'){ctx.beginPath();ctx.moveTo(-6,0);ctx.lineTo(6,0);ctx.lineTo(6,30);ctx.lineTo(16,38);ctx.lineTo(10,48);ctx.lineTo(-6,40);ctx.closePath();shape(c,3.5);}
      else{ctx.beginPath();ctx.moveTo(-16,0);ctx.lineTo(16,0);ctx.lineTo(14,26);ctx.lineTo(2,20);ctx.lineTo(-2,20);ctx.lineTo(-14,26);ctx.closePath();shape(c,3.5);circ(-6,10,3,'#ff5d8f',0);circ(6,6,3,'#ff5d8f',0);}
      rr(-4,-6,8,10,2,'#c98a52',2);ctx.restore();});}},
  basket:{w:68,h:54,kind:'low',init:o=>{o.y=GY-54;},draw(o,x){
    ctx.beginPath();ctx.moveTo(x,GY-50);ctx.lineTo(x+68,GY-50);ctx.lineTo(x+60,GY);ctx.lineTo(x+8,GY);ctx.closePath();shape('#e8c27a',4);
    for(let i=1;i<4;i++)seg(x+4+i*2,GY-50+i*12,x+64-i*2,GY-50+i*12,'#b88a3e',3);
    ctx.beginPath();ctx.moveTo(x+40,GY-50);ctx.lineTo(x+46,GY-78);ctx.lineTo(x+58,GY-74);ctx.lineTo(x+52,GY-50);ctx.closePath();shape('#ff5d8f',3);
    ell(x+20,GY-54,14,8,'#7bd3ff',3);}},
  puddle:{w:120,h:16,kind:'low',init:o=>{o.y=GY-12;},hb:o=>({x:o.x+20,y:GY-14,w:80,h:14}),draw(o,x){
    ell(x+60,GY+4,62,12,'#4aa8e8',4);ell(x+50,GY+1,30,5,'#a8dcff',0);}},
  dog:{w:86,h:62,kind:'low',vx:-130,init:o=>{o.y=GY-62;},draw(o,x){
    const t=o.t*14,l=Math.sin(t)*10;
    [x+16,x+60].forEach((lx,i)=>limb(lx,GY-22,lx+(i?l:-l),GY-2,'#c8864a',9));
    ell(x+46,GY-30,34,18,'#c8864a',4);
    ctx.beginPath();ctx.moveTo(x+78,GY-36);ctx.quadraticCurveTo(x+98,GY-58+l,x+92,GY-66);ctx.lineWidth=10;ctx.strokeStyle=OL;ctx.lineCap='round';ctx.stroke();ctx.lineWidth=5;ctx.strokeStyle='#c8864a';ctx.stroke();
    circ(x+14,GY-50,20,'#c8864a',4);ell(x+28,GY-58,9,16,'#7a4f28',3,.5+Math.sin(t)*.2);
    ell(x-4,GY-44,9,7,'#e8b07a',3);circ(x-10,GY-46,4,OL,0);circ(x+10,GY-56,3,OL,0);
    ell(x-2,GY-34,4,7,'#ff7b9c',2);}},
  trash:{w:56,h:78,kind:'low',init:o=>{o.y=GY-78;},draw(o,x){
    rr(x+4,GY-66,48,66,6,'#2bb673',4);rr(x,GY-78,56,14,5,'#1f8a55',4);rr(x+20,GY-86,16,8,3,'#1f8a55',3);
    [14,28,42].forEach(dx=>seg(x+dx,GY-56,x+dx,GY-10,'#1f8a55',3));
    const f=o.t*7;circ(x+28+Math.cos(f)*22,GY-96+Math.sin(f*1.3)*10,3,OL,0);}},
  pigeon:{w:58,h:36,kind:'high',vx:-90,init:o=>{o.y=GY-128;o.base=o.y;},update(o,dt){o.t+=dt;o.y=o.base+Math.sin(o.t*4)*8;},draw(o,x){
    const fl=Math.sin(o.t*18);
    ell(x+32,o.y+20,24,14,'#9aa0b5',4);circ(x+10,o.y+12,11,'#9aa0b5',4);ctx.beginPath();ctx.moveTo(x,o.y+12);ctx.lineTo(x-10,o.y+15);ctx.lineTo(x,o.y+17);ctx.closePath();shape('#ffb020',2);
    circ(x+7,o.y+9,3,OL,0);ell(x+14,o.y+24,6,4,'#7bd3a0',0);
    ctx.beginPath();ctx.moveTo(x+28,o.y+14);ctx.lineTo(x+46,o.y+14-fl*22);ctx.lineTo(x+56,o.y+16-fl*10);ctx.closePath();shape('#7f859c',3.5);}},
  plank:{w:220,h:60,kind:'high',init:o=>{o.y=GY-160;},hb:o=>({x:o.x+10,y:GY-150,w:200,h:56}),draw(o,x){
    rr(x,GY-230,12,230,3,'#9aa0b5',3);rr(x+208,GY-230,12,230,3,'#9aa0b5',3);
    rr(x-6,GY-156,232,22,4,'#c98a52',4);
    for(let i=0;i<10;i++){ctx.beginPath();ctx.moveTo(x+i*22,GY-134);ctx.lineTo(x+i*22+11,GY-134);ctx.lineTo(x+i*22+5,GY-112);ctx.lineTo(x+i*22-6,GY-112);ctx.closePath();shape(i%2?'#ffd23f':OL,0);}
    rr(x+86,GY-136,48,24,4,'#ffd23f',3);txt('OBRAS',x+110,GY-124,13,OL,'center','#ffd23f');
    rr(x+150,GY-182,30,26,5,'#3d7be0',3);}},
  stroller:{w:84,h:84,kind:'low',vx:-45,init:o=>{o.y=GY-84;},draw(o,x){
    const r=o.t*-8;
    [x+18,x+66].forEach(wx=>{circ(wx,GY-12,12,'#4a4a5c',4);seg(wx,GY-12,wx+Math.cos(r)*9,GY-12+Math.sin(r)*9,'#fff',3);});
    rr(x+4,GY-56,76,36,14,'#7b6cf6',4);
    ctx.beginPath();ctx.moveTo(x+10,GY-54);ctx.quadraticCurveTo(x+10,GY-92,x+50,GY-90);ctx.lineTo(x+50,GY-54);ctx.closePath();shape('#5b4bd6',4);
    circ(x+62,GY-62,13,SKIN,3);circ(x+58,GY-64,2,OL,0);circ(x+66,GY-58,4,'#ff9ec0',0);
    seg(x+80,GY-50,x+100,GY-84,OL,5);}},
  fence:{w:46,h:66,kind:'low',init:o=>{o.y=GY-66;},draw(o,x){
    rr(x+2,GY-66,12,66,3,'#b07c48',3);rr(x+32,GY-66,12,66,3,'#b07c48',3);
    [GY-58,GY-38,GY-18].forEach(y=>rr(x-6,y,58,11,3,'#e2b47e',3));}},
  bull:{w:108,h:76,kind:'low',vx:-175,init:o=>{o.y=GY-76;},draw(o,x){
    const t=o.t*16,l=Math.sin(t)*12;
    [x+24,x+44,x+74,x+92].forEach((lx,i)=>limb(lx,GY-30,lx+(i%2?l:-l),GY-3,'#2b2340',9));
    ell(x+62,GY-40,44,24,'#3a3043',4);ell(x+70,GY-46,26,10,'rgba(255,255,255,.12)',0);
    ctx.beginPath();ctx.moveTo(x+104,GY-48);ctx.quadraticCurveTo(x+122,GY-58+l*.4,x+118,GY-30);ctx.lineWidth=5;ctx.strokeStyle=OL;ctx.stroke();
    ell(x+14,GY-50,22,18,'#3a3043',4);ell(x-2,GY-44,10,8,'#c98a8a',3);circ(x-5,GY-45,1.8,OL,0);circ(x+1,GY-45,1.8,OL,0);
    [[x+6,-1],[x+24,1]].forEach(([hx,d])=>{ctx.beginPath();ctx.moveTo(hx,GY-64);ctx.quadraticCurveTo(hx+d*4-10,GY-86,hx-12+d*20,GY-92);ctx.lineWidth=7;ctx.strokeStyle=OL;ctx.stroke();ctx.lineWidth=4;ctx.strokeStyle='#f5ecd6';ctx.stroke();});
    ell(x+8,GY-56,5,6,'#fff',2);circ(x+7,GY-55,2.5,OL,0);
    ctx.beginPath();ctx.moveTo(x+30,GY-40);ctx.lineTo(x+52,GY-40);ctx.lineTo(x+44,GY-28);ctx.closePath();shape('#e0412a',2.5);
    if((o.t*3|0)%2){ctx.globalAlpha=.5;for(let i=0;i<3;i++)circ(x+112+i*14,GY-6-i*3,6-i,'#c9a27a',0);ctx.globalAlpha=1;}}},
  schoolball:{w:46,h:46,kind:'low',vx:-210,init:o=>{o.y=GY-46;},draw(o,x){
    const cx=x+23,cy=GY-23;circ(cx,cy,23,'#fff',4);ctx.save();ctx.translate(cx,cy);ctx.rotate(-o.t*10);
    ctx.beginPath();for(let i=0;i<5;i++){const a=i*Math.PI*2/5;ctx.lineTo(Math.cos(a)*8,Math.sin(a)*8);}ctx.closePath();shape(OL,0);
    for(let i=0;i<5;i++){const a=i*Math.PI*2/5;seg(Math.cos(a)*8,Math.sin(a)*8,Math.cos(a)*20,Math.sin(a)*20,OL,3);}ctx.restore();}},
};
// obstáculos especiales: muñeco de nieve (Navidad) y perro que viene por detrás (sorpresa)
OB.snowman={w:64,h:96,kind:'low',init:o=>{o.y=GY-96;},draw(o,x){
  circ(x+32,GY-28,30,'#fff',4);circ(x+32,GY-70,22,'#fff',4);
  ctx.globalAlpha=.12;circ(x+40,GY-24,22,'#7b9cc8',0);circ(x+38,GY-66,15,'#7b9cc8',0);ctx.globalAlpha=1;
  rr(x+14,GY-104,36,8,3,OL,0);rr(x+20,GY-122,24,20,3,OL,0);rr(x+20,GY-108,24,4,0,'#e0412a',0);
  circ(x+25,GY-74,2.6,OL,0);circ(x+37,GY-74,2.6,OL,0);
  ctx.beginPath();ctx.moveTo(x+30,GY-68);ctx.lineTo(x+12,GY-64);ctx.lineTo(x+30,GY-63);ctx.closePath();shape('#ff8a2a',2);
  rr(x+12,GY-52,42,8,4,'#e0412a',3);rr(x+42,GY-52,8,22,3,'#e0412a',3);
  [GY-36,GY-24].forEach(y=>circ(x+32,y,3,OL,0));
  seg(x+6,GY-46,x-10,GY-62,'#7a4a2a',4);seg(x+58,GY-46,x+74,GY-60,'#7a4a2a',4);}};
OB.dogchase={w:86,h:62,kind:'low',chase:true,init:o=>{o.y=GY-62;},draw(o,x){
  ctx.save();ctx.translate(2*x+o.w,0);ctx.scale(-1,1);OB.dog.draw(o,x);ctx.restore();
  if(!o.passed&&Math.sin(o.t*14)>0)txt('¡GUAU!',x+40,GY-92,22,'#ffd23f');}};
const POOL={casa:['lego','ball','cat','clothes','basket','lego'],sanse:['fence','bull','puddle','dog','pigeon','stroller','fence'],alco:['puddle','dog','trash','pigeon','plank','stroller'],cole:['schoolball','puddle','pigeon','stroller','schoolball']};

// ---------- objetos ----------
function drawToast(x,y,t){
  const s=Math.cos(t*3+x*.01);ctx.save();ctx.translate(x,y);ctx.scale(.75+.25*Math.abs(s),1);
  rr(-17,-16,34,32,10,'#a85d23',4);rr(-12,-10,24,22,6,'#f6c77a',0);rr(-6,-4,12,8,3,'#fff3a0',2.5);ctx.restore();
}
function drawSandwich(x,y,t){
  const s=Math.cos(t*3+x*.01);ctx.save();ctx.translate(x,y);ctx.scale(.75+.25*Math.abs(s),1);
  ell(0,0,22,13,'#e3a56a',4);rr(-20,-2,40,5,2,'#7bd389',0);rr(-18,3,36,4,2,'#ff8fb0',0);seg(-12,-8,-4,-10,'#fff3c4',2.5);ctx.restore();
}
function drawLunch(x,y,t){
  const b=Math.sin(t*5)*6;y+=b;
  ctx.globalAlpha=.35;circ(x,y,36,'#ffd23f',0);ctx.globalAlpha=1;
  rr(x-24,y-14,48,32,8,'#3d7be0',4);rr(x-24,y-14,48,10,6,'#2f5fb3',4);rr(x-8,y-24,16,10,4,null,4);
  rr(x-14,y,28,12,4,'#fff',2.5);txt('🍎',x,y+6,12);
}
function drawPower(type,x,y,t){
  const b=Math.sin(t*4)*5;y+=b;
  ctx.globalAlpha=.35;circ(x,y,32,'#fff',0);ctx.globalAlpha=1;circ(x,y,28,null,3);
  if(type==='scooter'){rr(x-20,y+6,40,7,3,'#ff5d8f',3);seg(x+14,y+6,x+12,y-20,OL,5);seg(x+6,y-20,x+20,y-20,OL,5);circ(x-14,y+16,6,'#4a4a5c',3);circ(x+16,y+16,6,'#4a4a5c',3);}
  else if(type==='umbrella'){ctx.beginPath();ctx.arc(x,y-2,22,Math.PI,0);ctx.closePath();shape('#7b6cf6',3);ctx.beginPath();ctx.arc(x,y-2,22,Math.PI,Math.PI*1.33);ctx.lineTo(x,y-2);ctx.closePath();shape('#ffd23f',0);seg(x,y-2,x,y+18,OL,4);ctx.beginPath();ctx.arc(x+5,y+18,5,Math.PI,0,true);ctx.lineWidth=4;ctx.stroke();}
  else{rr(x-14,y-10,24,26,6,'#fff',3.5);ctx.beginPath();ctx.arc(x+12,y+3,7,-Math.PI/2,Math.PI/2);ctx.lineWidth=4;ctx.strokeStyle=OL;ctx.stroke();rr(x-12,y-8,20,6,3,'#7a3b1a',0);
    for(let i=0;i<2;i++){ctx.beginPath();ctx.moveTo(x-6+i*8,y-14);ctx.quadraticCurveTo(x-10+i*8,y-22-Math.sin(t*6+i)*3,x-4+i*8,y-30);ctx.lineWidth=3;ctx.strokeStyle='#fff';ctx.stroke();}}
}
const POWERS={scooter:{name:'¡PATINETE!',dur:5,col:'#ff5d8f'},umbrella:{name:'¡PARAGUAS!',dur:8,col:'#7b6cf6'},coffee:{name:'¡CAFÉ TURBO!',dur:6,col:'#a85d23'}};
