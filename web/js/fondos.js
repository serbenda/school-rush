// School Rush · fondos.js
// Fondos ilustrados por capas: casa, Sanse, Alcobendas y el cole

// =====================================================================
//  FONDOS
// =====================================================================
// =====================================================================
//  FONDOS ILUSTRADOS (pre-renderizados una vez en capas que se repiten)
// =====================================================================
const RS=1.5;              // resolución de las capas
const ART={};
function mkLayer(w,h,fn){
  const c=document.createElement('canvas');c.width=Math.round(w*RS);c.height=Math.round(h*RS);
  const x=c.getContext('2d');x.setTransform(RS,0,0,RS,0,0);
  drawWith(x,()=>{for(const off of [-w,0,w]){ctx.save();ctx.translate(off,0);fn(w,h);ctx.restore();}});
  return {c,w,h};
}
function blit(L,f,cam,y){
  const off=((cam*f)%L.w+L.w)%L.w;
  for(let x=-off;x<W;x+=L.w)ctx.drawImage(L.c,x,y||0,L.w,L.h);
}
function lin(x0,y0,x1,y1,stops){const g=ctx.createLinearGradient(x0,y0,x1,y1);stops.forEach(([o,c])=>g.addColorStop(o,c));return g;}
function rad(x,y,r0,r1,stops){const g=ctx.createRadialGradient(x,y,r0,x,y,r1);stops.forEach(([o,c])=>g.addColorStop(o,c));return g;}
function fillR(x,y,w,h,f){ctx.fillStyle=f;ctx.fillRect(x,y,w,h);}
function seeded(seed){let s=seed;return()=>{s=(s*16807)%2147483647;return (s-1)/2147483646;};}

// ---------------- CASA ----------------
function artCasaWall(w,h){
  fillR(0,0,w,h,lin(0,0,0,h,[[0,'#ffe9c8'],[1,'#ffcf96']]));
  // papel pintado con florecitas
  for(let y=24;y<292;y+=44)for(let x=(y/44%2)*24;x<w;x+=48){
    ctx.globalAlpha=.16;for(let k=0;k<4;k++){const a=k*Math.PI/2;circ(x+Math.cos(a)*5,y+Math.sin(a)*5,4,'#ff8a5c',0);}circ(x,y,2.5,'#ffd23f',0);ctx.globalAlpha=1;}
  // moldura superior
  fillR(0,0,w,16,lin(0,0,0,16,[[0,'#d99a62'],[1,'#f2c48e']]));seg(0,16,w,16,'#b97a44',3);
  // zócalo de madera con paneles
  fillR(0,300,w,h-300,lin(0,300,0,h,[[0,'#f7cfa0'],[1,'#e8b07a']]));
  for(let x=10;x<w;x+=120){rr(x,318,100,96,8,null,0);ctx.lineWidth=3;ctx.strokeStyle='rgba(185,122,68,.55)';ctx.stroke();seg(x+4,322,x+96,322,'rgba(255,255,255,.35)',2);}
  rr(0,292,w,14,4,lin(0,292,0,306,[[0,'#f2c48e'],[1,'#c98a52']]),0);seg(0,306,w,306,'#a46a3e',2);
  // sombra de contacto con el suelo
  fillR(0,h-24,w,24,lin(0,h-24,0,h,[[0,'rgba(120,60,20,0)'],[1,'rgba(120,60,20,.28)']]));
  // ---- ventana grande con luz ----
  const wx=90;
  ctx.save();ctx.globalAlpha=.18;ctx.beginPath();ctx.moveTo(wx+20,240);ctx.lineTo(wx+220,240);ctx.lineTo(wx+420,h);ctx.lineTo(wx+120,h);ctx.closePath();ctx.fillStyle='#fff6c7';ctx.fill();ctx.restore();
  rr(wx-8,52,256,206,12,'#fff',5);
  rr(wx+6,66,228,178,6,lin(0,66,0,244,[[0,'#5cc4ff'],[.7,'#b9e8ff'],[1,'#e6f8ff']]),0);
  circ(wx+180,104,20,'#fff4a8',0);ctx.globalAlpha=.4;circ(wx+180,104,32,'#fff4a8',0);ctx.globalAlpha=1;
  [[wx+40,120],[wx+90,108]].forEach(([x,y])=>{ell(x,y,26,10,'#fff',0);ell(x+18,y-8,18,10,'#fff',0);});
  for(let i=0;i<6;i++)circ(wx+20+i*40,236-hash(i)*24,26+hash(i+3)*10,i%2?'#59b36b':'#6cc47d',0);
  fillR(wx+6,226,228,18,'#8fd18f');
  seg(wx+120,66,wx+120,244,'#fff',9);seg(wx+6,154,wx+234,154,'#fff',9);rr(wx-8,52,256,206,12,null,5);
  ctx.globalAlpha=.35;ctx.beginPath();ctx.moveTo(wx+20,74);ctx.lineTo(wx+60,74);ctx.lineTo(wx+24,140);ctx.closePath();ctx.fillStyle='#fff';ctx.fill();ctx.globalAlpha=1;
  rr(wx-22,256,284,16,6,lin(0,256,0,272,[[0,'#fff'],[1,'#e7d6be']]),4);
  // maceta en el alféizar
  rr(wx+172,226,34,30,6,'#d5643f',4);circ(wx+182,214,14,'#2bb673',4);circ(wx+198,208,12,'#38c983',4);circ(wx+190,198,10,'#4fd492',4);
  // cortinas con pliegues
  [[wx-46,1],[wx+254,-1]].forEach(([cx,d])=>{
    ctx.beginPath();ctx.moveTo(cx,40);ctx.lineTo(cx+44,40);ctx.quadraticCurveTo(cx+22+d*14,170,cx+40,290);ctx.lineTo(cx+4,290);ctx.quadraticCurveTo(cx+18-d*10,170,cx,40);ctx.closePath();
    shape(lin(cx,0,cx+44,0,[[0,'#ff8fb0'],[.5,'#ffb3c9'],[1,'#ff7aa0']]),4);
    for(let k=1;k<3;k++)seg(cx+k*14,48,cx+k*14+d*6,282,'rgba(200,60,100,.35)',2);});
  rr(wx-56,34,372,10,5,'#a46a3e',4);
  // ---- estantería con libros ----
  const bx=760;
  rr(bx,96,250,206,8,lin(bx,0,bx+250,0,[[0,'#b97a44'],[1,'#a0663a']]),5);
  for(let s=0;s<3;s++){
    const sy=96+s*68;rr(bx+10,sy+10,230,56,4,'#7a4a2a',0);
    const r=seeded(17+s);let x=bx+14;
    while(x<bx+226){const bw=10+r()*12,bh=34+r()*20;if(x+bw>bx+234)break;
      if(s===1&&x>bx+150&&x<bx+200){ // osito
        circ(x+20,sy+44,15,'#c8864a',3);circ(x+20,sy+26,11,'#c8864a',3);circ(x+12,sy+17,5,'#c8864a',3);circ(x+28,sy+17,5,'#c8864a',3);circ(x+17,sy+25,1.8,OL,0);circ(x+23,sy+25,1.8,OL,0);x+=44;continue;}
      const col=['#e0412a','#3d7be0','#2bb673','#ffd23f','#7b6cf6','#ff8fb0','#ff9f43'][Math.floor(r()*7)];
      const lean=r()<.12?.12:0;ctx.save();ctx.translate(x,sy+66);ctx.rotate(lean);rr(0,-bh,bw,bh,2,col,2.5);fillR(2,-bh+6,bw-4,3,'rgba(255,255,255,.5)');ctx.restore();x+=bw+1;}
    rr(bx+6,sy+64,238,8,3,'#e2a774',3);
  }
  // globo terráqueo encima
  seg(bx+200,96,bx+200,78,OL,4);circ(bx+200,62,20,'#5cc4ff',4);ctx.beginPath();ctx.ellipse(bx+196,58,8,12,.4,0,Math.PI*2);ctx.fillStyle='#2bb673';ctx.fill();rr(bx+186,92,28,6,3,'#7a4a2a',3);
  // reloj de pared
  const cx=bx+60,cy=50;circ(cx,cy,28,'#fff',5);circ(cx,cy,22,null,2);for(let i=0;i<12;i++){const a=i*Math.PI/6;seg(cx+Math.cos(a)*17,cy+Math.sin(a)*17,cx+Math.cos(a)*20,cy+Math.sin(a)*20,OL,2);}
  seg(cx,cy,cx+10,cy-6,OL,4);seg(cx,cy,cx,cy-16,'#e0412a',3);circ(cx,cy,3,OL,0);
  // ---- dibujos de los niños y perchero ----
  const dx=1330;
  const draws=[[dx,90,-.06,'sun'],[dx+120,70,.05,'house'],[dx+70,170,.03,'family']];
  draws.forEach(([x,y,a,k])=>{ctx.save();ctx.translate(x+48,y+38);ctx.rotate(a);ctx.translate(-48,-38);
    rr(0,0,96,76,3,'#fff',3);circ(48,-2,4,'#e0412a',2);
    if(k==='sun'){circ(48,38,14,'#ffd23f',0);for(let i=0;i<8;i++){const b=i*Math.PI/4;seg(48+Math.cos(b)*18,38+Math.sin(b)*18,48+Math.cos(b)*26,38+Math.sin(b)*26,'#ff9f43',3);}}
    if(k==='house'){rr(26,36,44,30,2,'#ff8fb0',2);ctx.beginPath();ctx.moveTo(20,38);ctx.lineTo(48,14);ctx.lineTo(76,38);ctx.closePath();shape('#e0412a',2);rr(42,48,12,18,2,'#7a4a2a',0);seg(0,68,96,68,'#2bb673',4);}
    if(k==='family'){[[20,'#ff5d8f',1],[40,'#3d7be0',1],[60,'#ffd23f',.7],[76,'#2bb673',.7]].forEach(([fx,c,s])=>{circ(fx,46-20*s,7*s,'#ffd2b0',2);seg(fx,52-20*s+7,fx,64,c,4);seg(fx-6,56-10*s,fx+6,56-10*s,c,3);});}
    ctx.restore();});
  // perchero con chaquetas
  const px=dx+300;rr(px,60,140,12,6,'#a46a3e',4);[px+20,px+70,px+120].forEach(x=>circ(x,76,5,'#ffd23f',2));
  ctx.beginPath();ctx.moveTo(px+6,80);ctx.lineTo(px+36,80);ctx.lineTo(px+44,170);ctx.lineTo(px-2,170);ctx.closePath();shape('#3d7be0',4);seg(px+21,84,px+21,168,'rgba(0,0,0,.25)',2);
  ctx.beginPath();ctx.moveTo(px+56,80);ctx.lineTo(px+86,80);ctx.lineTo(px+92,150);ctx.lineTo(px+50,150);ctx.closePath();shape('#ff6b4a',4);
  ctx.beginPath();ctx.arc(px+120,92,18,Math.PI,0);ctx.closePath();shape('#2bb673',4);rr(px+100,90,40,6,3,'#2bb673',3);
  // interruptor y enchufe
  rr(dx-60,200,22,32,5,'#fff',3);rr(dx-54,208,10,14,3,'#eee',2);
  rr(dx+520,330,26,26,6,'#fff',3);circ(dx+529,343,2.5,OL,0);circ(dx+539,343,2.5,OL,0);
  // lámpara de techo
  seg(1200,0,1200,40,OL,3);ctx.beginPath();ctx.moveTo(1170,72);ctx.lineTo(1230,72);ctx.lineTo(1214,40);ctx.lineTo(1186,40);ctx.closePath();shape(lin(1170,0,1230,0,[[0,'#ffd23f'],[1,'#ffb020']]),4);
  ctx.globalAlpha=.12;ctx.beginPath();ctx.moveTo(1180,72);ctx.lineTo(1220,72);ctx.lineTo(1300,300);ctx.lineTo(1100,300);ctx.closePath();ctx.fillStyle='#fff6a0';ctx.fill();ctx.globalAlpha=1;
}
function artCasaFloor(w,h){
  fillR(0,0,w,h,'#d38f55');
  const r=seeded(5);
  for(let row=0;row<4;row++){
    const y=row*25;let x=-row*70%140;
    while(x<w){const pw=110+r()*90;const tone=r();
      fillR(x,y,pw,25,lin(0,y,0,y+25,[[0,tone<.33?'#e3a56a':tone<.66?'#d99a5e':'#cf8f52'],[1,tone<.33?'#cf8f52':'#c4834a']]));
      for(let g=0;g<3;g++){ctx.beginPath();const gy=y+5+g*7+r()*3;ctx.moveTo(x+6,gy);ctx.bezierCurveTo(x+pw*.3,gy-3,x+pw*.6,gy+3,x+pw-6,gy);ctx.lineWidth=1.2;ctx.strokeStyle='rgba(140,80,30,.3)';ctx.stroke();}
      seg(x,y,x,y+25,'#a8683a',2.5);x+=pw;}
    seg(0,y,w,y,'#a8683a',2.5);fillR(0,y+1,w,2,'rgba(255,230,190,.35)');
  }
  fillR(0,0,w,14,lin(0,0,0,14,[[0,'rgba(90,40,10,.35)'],[1,'rgba(90,40,10,0)']]));
}

// ---------------- CALLE ----------------
function artCalleFar(w,h){
  const r=seeded(9);let x=0;
  while(x<w){const bw=50+r()*70,bh=90+r()*150;
    rr(x,h-bh,bw,bh+10,6,'#b7c6ee',0);
    for(let wy=h-bh+12;wy<h-20;wy+=16)for(let wx=x+8;wx<x+bw-10;wx+=14)fillR(wx,wy,6,8,'rgba(255,255,255,.35)');
    if(r()<.15){seg(x+bw/2,h-bh,x+bw/2,h-bh-40,'#b7c6ee',4);circ(x+bw/2,h-bh-42,4,'#ff6b6b',0);}
    x+=bw+4;}
  // cúpula
  ctx.beginPath();ctx.arc(w*.62,h-170,46,Math.PI,0);ctx.fillStyle='#aebde6';ctx.fill();fillR(w*.62-50,h-170,100,170,'#aebde6');seg(w*.62,h-216,w*.62,h-240,'#aebde6',5);
  fillR(0,h-40,w,40,lin(0,h-40,0,h,[[0,'rgba(214,241,255,0)'],[1,'rgba(214,241,255,.9)']]));
}
const SHOPS=[{t:'PANADERÍA',c:'#c98a52',i:'bread'},{t:'FARMACIA',c:'#2bb673',i:'cross'},{t:'FRUTERÍA',c:'#ff6b4a',i:'fruit'},{t:'KIOSCO',c:'#3d7be0',i:'news'},{t:'CAFÉ',c:'#7a4a2a',i:'cup'},{t:'PAPELERÍA',c:'#7b6cf6',i:'pencil'}];
function artCalleMid(w,h){
  const cols=[['#ffb38a','#ff9a6b'],['#ffd56b','#f5c142'],['#9fd8c8','#7cc4b0'],['#ff9ec0','#ff7aa6'],['#b9a7ff','#9c88f5'],['#ffcfa0','#f2b27a']];
  const BW=400;
  for(let i=0;i<w/BW;i++){
    const x=i*BW,top=70+hash(i+11)*60,[c1,c2]=cols[i%cols.length],shop=SHOPS[i%SHOPS.length];
    const bx=x+20,bw=BW-40;
    // fachada
    rr(bx,top,bw,h-top,6,lin(bx,0,bx+bw,0,[[0,c1],[1,c2]]),5);
    rr(bx-8,top-14,bw+16,18,4,'#fff3e0',4);fillR(bx,top+4,bw,6,'rgba(0,0,0,.08)');
    // pisos con balcones
    const floors=Math.floor((h-130-top)/78);
    for(let f=0;f<floors;f++){
      const fy=top+26+f*78;
      for(let k=0;k<3;k++){
        const wx=bx+24+k*112;
        rr(wx-6,fy-6,72,64,4,'rgba(255,255,255,.55)',0);
        rr(wx,fy,60,52,4,lin(0,fy,0,fy+52,[[0,'#7fc8ff'],[1,'#cfeeff']]),4);
        const per=.25+hash(i*10+f*3+k)*.5;rr(wx,fy,60,52*per,3,'#3e8f5a',3);for(let s=1;s<6;s++){const ly=fy+s*52*per/6;seg(wx+2,ly,wx+58,ly,'rgba(0,0,0,.25)',1.5);}
        seg(wx+30,fy+52*per,wx+30,fy+52,'#fff',3);
        ctx.globalAlpha=.4;ctx.beginPath();ctx.moveTo(wx+36,fy+52*per+2);ctx.lineTo(wx+52,fy+52*per+2);ctx.lineTo(wx+40,fy+50);ctx.closePath();ctx.fillStyle='#fff';ctx.fill();ctx.globalAlpha=1;
        // balcón de hierro
        rr(wx-10,fy+52,80,6,2,'#e8e3da',3);
        for(let b=0;b<9;b++)seg(wx-6+b*9,fy+58,wx-6+b*9,fy+76,'#2b2340',2);seg(wx-10,fy+58,wx+70,fy+58,OL,3);seg(wx-10,fy+76,wx+70,fy+76,OL,3);
        if(hash(i+f*7+k*13)>.45){rr(wx+4,fy+44,16,12,3,'#d5643f',2.5);circ(wx+8,fy+40,6,'#ff5d8f',2);circ(wx+16,fy+38,6,'#ffd23f',2);circ(wx+12,fy+34,6,'#e0412a',2);}
      }
    }
    // planta baja: tienda
    const sy=h-118;fillR(bx,sy,bw,118,'rgba(255,255,255,.18)');
    rr(bx+20,sy+34,bw-150,84,4,lin(0,sy+34,0,h,[[0,'#cfeeff'],[1,'#a8d8f5']]),4);
    // escaparate según tienda
    const ex=bx+30,ey=h-30;
    if(shop.i==='bread'){for(let j=0;j<4;j++){ell(ex+30+j*44,ey-8,18,9,'#e3a56a',3);seg(ex+22+j*44,ey-10,ex+36+j*44,ey-12,'#a0663a',2);}}
    if(shop.i==='cross'){rr(ex+60,sy+44,40,14,3,'#2bb673',3);rr(ex+73,sy+31,14,40,3,'#2bb673',3);}
    if(shop.i==='fruit'){for(let j=0;j<3;j++){rr(ex+10+j*60,ey-16,52,22,3,'#c98a52',3);for(let q=0;q<4;q++)circ(ex+18+j*60+q*12,ey-20,6,['#e0412a','#ff9f43','#ffd23f'][j],2);}}
    if(shop.i==='news'){for(let j=0;j<5;j++){ctx.save();ctx.translate(ex+20+j*36,ey-34);ctx.rotate(-.1+j*.05);rr(0,0,28,36,2,j%2?'#fff':'#ffe9a8',2);fillR(4,6,20,3,OL);fillR(4,14,14,2,'#999');ctx.restore();}}
    if(shop.i==='cup'){rr(ex+40,ey-34,30,30,5,'#fff',3);ctx.beginPath();ctx.arc(ex+72,ey-20,8,-Math.PI/2,Math.PI/2);ctx.lineWidth=3;ctx.strokeStyle=OL;ctx.stroke();rr(ex+100,ey-26,60,22,6,'#ff9ec0',3);}
    if(shop.i==='pencil'){for(let j=0;j<5;j++){ctx.save();ctx.translate(ex+30+j*30,ey-6);ctx.rotate(-.2);rr(0,-44,10,44,2,['#e0412a','#3d7be0','#2bb673','#ffd23f','#7b6cf6'][j],2);ctx.restore();}}
    ctx.globalAlpha=.4;ctx.beginPath();ctx.moveTo(bx+30,sy+40);ctx.lineTo(bx+70,sy+40);ctx.lineTo(bx+40,sy+110);ctx.closePath();ctx.fillStyle='#fff';ctx.fill();ctx.globalAlpha=1;
    // puerta
    rr(bx+bw-110,sy+28,64,90,6,'#7a4a2a',4);rr(bx+bw-100,sy+38,44,40,4,'#a8d8f5',3);circ(bx+bw-56,sy+86,3.5,'#ffd23f',2);
    // toldo a rayas y cartel
    for(let s=0;s<Math.ceil((bw-120)/24);s++){ctx.beginPath();const ax=bx+14+s*24;ctx.moveTo(ax,sy+4);ctx.lineTo(ax+24,sy+4);ctx.lineTo(ax+24,sy+26);ctx.quadraticCurveTo(ax+12,sy+34,ax,sy+26);ctx.closePath();shape(s%2?'#fff':shop.c,0);}
    rr(bx+14,sy+4,Math.ceil((bw-120)/24)*24,24,2,null,4);
    rr(bx+bw/2-96,sy-34,170,30,8,'#fff',4);txt(shop.t,bx+bw/2-11,sy-19,20,shop.c,'center','#fff');
    // farola entre edificios
    const lx=x+BW-10;rr(lx-4,h-200,8,200,3,'#3a3550',3);ctx.beginPath();ctx.moveTo(lx,h-200);ctx.quadraticCurveTo(lx,h-226,lx+22,h-226);ctx.lineWidth=5;ctx.strokeStyle='#3a3550';ctx.stroke();
    rr(lx+12,h-228,22,14,4,'#3a3550',3);ell(lx+23,h-212,8,4,'#fff4a8',2);
    // árbol
    if(i%2===0){const tx=x+BW-60;rr(tx-7,h-150,14,150,4,lin(tx-7,0,tx+7,0,[[0,'#8a5a3b'],[1,'#6b4423']]),4);
      [[0,-190,52,'#2f9e5b'],[-38,-160,38,'#38b36a'],[38,-162,40,'#38b36a'],[-14,-218,36,'#4fc47e'],[20,-200,34,'#4fc47e']].forEach(([ox,oy,rr2,c])=>circ(tx+ox,h+oy,rr2,c,4));
      ctx.globalAlpha=.25;circ(tx-18,h-206,14,'#fff',0);ctx.globalAlpha=1;}
  }
}
function artCalleWalk(w,h){
  fillR(0,0,w,40,'#dcdde8');
  for(let x=0;x<w;x+=40)for(let y=0;y<40;y+=20){rr(x+1,y+1,38,18,3,(x/40+y/20)%2?'#e6e7f0':'#d4d5e2',0);for(let k=0;k<3;k++)circ(x+8+k*12,y+10,2.4,'rgba(150,150,170,.35)',0);}
  fillR(0,0,w,8,lin(0,0,0,8,[[0,'rgba(60,50,80,.25)'],[1,'rgba(60,50,80,0)']]));
  rr(0,38,w,10,3,lin(0,38,0,48,[[0,'#f2f2f8'],[1,'#a9abbd']]),0);seg(0,48,w,48,'#7d7f94',2);
  fillR(0,48,w,h-48,lin(0,48,0,h,[[0,'#4f4f63'],[1,'#3f3f52']]));
  const r=seeded(3);for(let i=0;i<260;i++){fillR(r()*w,50+r()*(h-50),2,2,r()<.5?'rgba(255,255,255,.08)':'rgba(0,0,0,.12)');}
  for(let x=20;x<w;x+=140)rr(x,74,70,8,4,'#f5f5f5',0);
}

// ---------------- COLE ----------------
function artColeMid(w,h){
  const S=960;
  for(let i=0;i<w/S;i++){
    const x=i*S;
    // edificio de ladrillo
    rr(x+20,120,S-40,h-120,8,'#d9644a',5);
    for(let y=128;y<h;y+=12)for(let bx=x+22+((y/12)%2)*14;bx<x+S-24;bx+=28)rr(bx,y,26,10,2,(bx+y)%5?'#e2725a':'#cc5a41',0);
    rr(x+12,104,S-24,20,4,'#fff3e0',4);
    // ventanas decoradas
    for(let r=0;r<2;r++)for(let c=0;c<6;c++){
      if(c===2||c===3){continue;}
      const wx=x+60+c*140,wy=160+r*120;
      rr(wx-6,wy-6,92,84,6,'#fff3e0',4);rr(wx,wy,80,72,4,lin(0,wy,0,wy+72,[[0,'#7fc8ff'],[1,'#d5f0ff']]),3);seg(wx+40,wy,wx+40,wy+72,'#fff3e0',5);
      const k=(r*6+c)%4;
      if(k===0){for(let s=0;s<3;s++)txt('★',wx+14+s*24,wy+20+(s%2)*14,18,['#ffd23f','#ff5d8f','#2bb673'][s]);}
      if(k===1){[['#e0412a',wx+12],['#3d7be0',wx+46]].forEach(([cc,hx])=>{circ(hx+10,wy+36,10,cc,2);for(let f=0;f<4;f++)rr(hx+2+f*5,wy+16,4,14,2,cc,0);});}
      if(k===2){circ(wx+20,wy+22,10,'#ffd23f',2);ctx.beginPath();ctx.arc(wx+52,wy+60,20,Math.PI,0);ctx.lineWidth=5;['#e0412a','#ffd23f','#2bb673'].forEach((cc,j)=>{ctx.beginPath();ctx.arc(wx+52,wy+62,22-j*5,Math.PI,0);ctx.strokeStyle=cc;ctx.stroke();});}
      if(k===3){rr(wx+10,wy+10,26,26,3,'#fff',2);rr(wx+44,wy+30,26,26,3,'#fff',2);txt('A',wx+23,wy+24,14,'#e0412a','center','#fff');txt('B',wx+57,wy+44,14,'#3d7be0','center','#fff');}
      fillR(wx-8,wy+76,96,6,'#fff3e0');
    }
    // entrada central con arco
    const ex=x+S/2;rr(ex-110,h-170,220,170,10,'#c4503a',5);
    ctx.beginPath();ctx.moveTo(ex-80,h);ctx.lineTo(ex-80,h-110);ctx.arc(ex,h-110,80,Math.PI,0);ctx.lineTo(ex+80,h);ctx.closePath();shape('#5a3518',5);
    seg(ex,h-190+0,ex,h,'#3a2418',4);circ(ex-12,h-60,4,'#ffd23f',2);circ(ex+12,h-60,4,'#ffd23f',2);
    rr(ex-150,h-218,300,44,10,'#fff',5);{const name=schoolSign();ctx.font="30px 'Lilita One',system-ui,sans-serif";const mw=ctx.measureText(name).width;txt(name,ex,h-196,Math.min(30,Math.floor(30*270/Math.max(1,mw))),'#e0412a','center','#fff');}
    // torre del reloj
    rr(ex-60,10,120,100,6,'#d9644a',5);ctx.beginPath();ctx.moveTo(ex-72,14);ctx.lineTo(ex,-40);ctx.lineTo(ex+72,14);ctx.closePath();shape('#7a2e22',5);
    circ(ex,60,32,'#fff',5);for(let k=0;k<12;k++){const a=k*Math.PI/6;seg(ex+Math.cos(a)*24,60+Math.sin(a)*24,ex+Math.cos(a)*28,60+Math.sin(a)*28,OL,2);}seg(ex,60,ex,38,OL,4);seg(ex,60,ex+16,64,'#e0412a',4);
    // mástil con bandera
    const fx=x+80;rr(fx-3,0,6,h,3,'#9aa0b5',3);ctx.beginPath();ctx.moveTo(fx+3,8);ctx.quadraticCurveTo(fx+40,0,fx+70,12);ctx.lineTo(fx+70,52);ctx.quadraticCurveTo(fx+40,40,fx+3,48);ctx.closePath();shape('#ffd23f',4);fillR(fx+6,20,60,14,'#e0412a');
    // arbustos
    for(let b=0;b<6;b++){const bx=x+40+b*160;circ(bx,h-10,30,'#2f9e5b',4);circ(bx+30,h-16,26,'#38b36a',4);}
  }
}
function artColeFence(w,h){
  for(let x=0;x<w;x+=32){rr(x+8,8,14,h-8,3,lin(x+8,0,x+22,0,[[0,'#4fc47e'],[1,'#2f9e5b']]),3);ctx.beginPath();ctx.moveTo(x+8,10);ctx.lineTo(x+15,0);ctx.lineTo(x+22,10);ctx.closePath();shape('#4fc47e',3);}
  [[22,'#2f9e5b'],[52,'#2f9e5b']].forEach(([y])=>{rr(0,y,w,8,3,'#38b36a',3);fillR(0,y+1,w,2,'rgba(255,255,255,.35)');});
}
function artColeGround(w,h){
  fillR(0,0,w,h,lin(0,0,0,h,[[0,'#ff9a5e'],[1,'#ff8648']]));
  const r=seeded(21);for(let i=0;i<300;i++)fillR(r()*w,r()*h,2,2,r()<.5?'rgba(255,255,255,.15)':'rgba(150,50,0,.15)');
  ctx.beginPath();ctx.arc(w/2,h+30,90,Math.PI,0);ctx.lineWidth=4;ctx.strokeStyle='#fff';ctx.stroke();seg(0,26,w,26,'#fff',4);
  fillR(0,0,w,10,lin(0,0,0,10,[[0,'rgba(90,40,10,.3)'],[1,'rgba(90,40,10,0)']]));
}

// ---------------- SANSE Y ALCOBENDAS ----------------
function bricks(x,y,w,h,c1,c2,mortar){
  fillR(x,y,w,h,mortar||'#e8c9a8');
  for(let yy=y,r=0;yy<y+h;yy+=9,r++)for(let xx=x-(r%2)*11;xx<x+w;xx+=22){
    const bx=Math.max(x,xx+1),bw=Math.min(x+w,xx+21)-bx;if(bw>0)fillR(bx,yy+1,bw,Math.min(7,y+h-yy-1),hash(xx*3+yy)>.5?c1:c2);}
}
function streetSign(x,y,t1,t2){
  rr(x,y,150,40,6,'#fff',4);rr(x+4,y+4,142,32,4,'#2f5fb3',0);
  txt(t1,x+75,y+(t2?14:20),t2?11:15,'#fff','center','#2f5fb3');if(t2)txt(t2,x+75,y+28,13,'#fff','center','#2f5fb3');
}
function stork(x,y){
  ell(x,y+6,26,10,'#8a6a3e',3);for(let i=0;i<5;i++)seg(x-24+i*12,y+4,x-18+i*12,y+12,'#6b4a26',2);
  ell(x+2,y-10,10,13,'#fff',3);circ(x+10,y-26,6,'#fff',3);seg(x+14,y-26,x+28,y-22,'#ff7a1a',3);seg(x+3,y-20,x+8,y-24,OL,0);
  ctx.beginPath();ctx.moveTo(x-6,y-14);ctx.lineTo(x-14,y-2);ctx.lineTo(x+2,y-2);ctx.closePath();shape(OL,0);
}
function church(x,base,brickA,brickB,roof){
  // nave
  bricks(x,base-170,240,170,brickA,brickB);rr(x,base-170,240,170,4,null,4);
  ctx.beginPath();ctx.moveTo(x-10,base-170);ctx.lineTo(x+120,base-220);ctx.lineTo(x+250,base-170);ctx.closePath();shape(roof,4);
  rr(x+90,base-110,60,110,30,'#5a3518',4);rr(x+86,base-116,68,10,4,'#e8dcc6',3);
  [x+30,x+190].forEach(wx=>{rr(wx,base-140,24,48,12,'#ffd77a',3);seg(wx+12,base-140,wx+12,base-92,OL,2);});
  // torre
  const tx=x+250;bricks(tx,base-330,80,330,brickA,brickB);rr(tx,base-330,80,330,3,null,4);
  for(let s=0;s<3;s++)fillR(tx,base-330+s*110,80,8,'#e8dcc6');
  for(let k=0;k<2;k++){rr(tx+10+k*34,base-310,26,48,13,'#2b2340',3);}
  circ(tx+40,base-200,18,'#fff',4);seg(tx+40,base-200,tx+40,base-212,OL,3);seg(tx+40,base-200,tx+48,base-196,OL,3);
  ctx.beginPath();ctx.moveTo(tx-6,base-330);ctx.lineTo(tx+40,base-390);ctx.lineTo(tx+86,base-330);ctx.closePath();shape('#5b6475',4);
  seg(tx+40,base-390,tx+40,base-418,OL,4);seg(tx+30,base-408,tx+50,base-408,OL,4);
  stork(tx+40,base-430+8);
}
function artSanseMid(w,h){
  const base=h;
  // casas bajas del casco al fondo
  for(let x=0;x<w;x+=170){const hh=150+hash(x)*60;rr(x,base-hh-40,160,hh+40,4,hash(x+1)>.5?'#f4ead6':'#efe0c4',3);ctx.beginPath();ctx.moveTo(x-6,base-hh-40);ctx.lineTo(x+80,base-hh-74);ctx.lineTo(x+166,base-hh-40);ctx.closePath();shape('#c2553a',3);}
  // ---- Ayuntamiento con soportales ----
  const ax=60,aw=560,top=base-300;
  rr(ax,top,aw,300,6,lin(ax,0,ax+aw,0,[[0,'#f6e7c8'],[1,'#ecd7ae']]),5);
  rr(ax-10,top-16,aw+20,20,4,'#fff6e6',4);
  // espadaña con reloj y campana
  ctx.beginPath();ctx.moveTo(ax+aw/2-70,top-16);ctx.lineTo(ax+aw/2-70,top-90);ctx.quadraticCurveTo(ax+aw/2,top-130,ax+aw/2+70,top-90);ctx.lineTo(ax+aw/2+70,top-16);ctx.closePath();shape('#f6e7c8',5);
  circ(ax+aw/2,top-60,24,'#fff',4);seg(ax+aw/2,top-60,ax+aw/2,top-76,OL,3);seg(ax+aw/2,top-60,ax+aw/2+10,top-54,'#e0412a',3);
  rr(ax+aw/2-12,top-118,24,22,10,'#2b2340',3);ctx.beginPath();ctx.arc(ax+aw/2,top-104,8,Math.PI,0);ctx.lineTo(ax+aw/2+9,top-96);ctx.lineTo(ax+aw/2-9,top-96);ctx.closePath();shape('#d4a017',2);
  // planta alta: balcones con banderas
  for(let k=0;k<5;k++){const bx=ax+30+k*106;
    rr(bx,top+30,60,80,4,lin(0,top+30,0,top+110,[[0,'#7fc8ff'],[1,'#cfeeff']]),4);seg(bx+30,top+30,bx+30,top+110,'#fff',4);
    rr(bx-10,top+108,80,6,2,'#d9c9a8',3);for(let b=0;b<9;b++)seg(bx-6+b*9,top+114,bx-6+b*9,top+132,OL,2);seg(bx-10,top+132,bx+70,top+132,OL,3);}
  // banderas en el balcón central
  [['#c60b1e','#ffc400'],['#c60b1e','#c60b1e'],['#fff','#2f5fb3']].forEach(([c1,c2],i)=>{const fx=ax+aw/2-40+i*40;seg(fx,top+120,fx-14,top+60,'#8a8a99',3);
    ctx.save();ctx.translate(fx-14,top+60);ctx.rotate(-.35);rr(0,0,34,24,2,c1,2.5);if(c2!==c1)fillR(1,7,32,10,c2);ctx.restore();});
  rr(ax+aw/2-110,top+150,220,28,6,'#fff',3);txt('AYUNTAMIENTO',ax+aw/2,top+164,17,'#7a4a2a','center','#fff');
  // soportales
  const sy=base-120;fillR(ax,sy,aw,120,'#5a4630');
  for(let k=0;k<7;k++){const cx=ax+k*(aw/7);rr(cx,sy,aw/7,120,0,null,0);
    ctx.beginPath();ctx.moveTo(cx,sy);ctx.lineTo(cx,base);ctx.lineTo(cx+12,base);ctx.lineTo(cx+12,sy+46);ctx.arc(cx+aw/14,sy+46,aw/14-12,Math.PI,0);ctx.lineTo(cx+aw/7-12,base);ctx.lineTo(cx+aw/7,base);ctx.lineTo(cx+aw/7,sy);ctx.closePath();shape('#ecd7ae',3);}
  for(let k=0;k<7;k++){const cx=ax+12+k*(aw/7);rr(cx+10,base-60,aw/7-44,40,4,'rgba(255,220,150,.5)',0);}
  // ---- iglesia (inspirada en las del casco) ----
  church(720,base,'#d9875e','#c97248','#a8432c');
  // ---- calle con tiendas y fiestas ----
  const shops=[{t:'CHURRERÍA',c:'#e0702a'},{t:'PEÑA TAURINA',c:'#c60b1e'},{t:'MERCERÍA',c:'#7b6cf6'},{t:'BAR',c:'#2bb673'}];
  for(let i=0;i<4;i++){
    const x=1120+i*320,tp=base-250-hash(i+40)*40,sh=shops[i];
    rr(x,tp,300,base-tp,5,i%2?'#fff4e2':'#f9e6c4',4);
    for(let f=0;f<2;f++)for(let k=0;k<3;k++){const wx=x+26+k*92,wy=tp+24+f*70;rr(wx,wy,56,48,3,'#cfeeff',3);rr(wx-4,wy-4,64,8,3,'#7a4a2a',3);
      rr(wx-8,wy+48,72,8,2,'#7a4a2a',3);rr(wx+6,wy+40,14,10,3,'#d5643f',2);circ(wx+10,wy+36,6,'#e0412a',2);circ(wx+18,wy+34,6,'#ff5d8f',2);}
    rr(x+20,base-110,170,110,4,'#cfeeff',4);rr(x+210,base-104,64,104,5,'#7a4a2a',4);
    rr(x+30,base-150,240,32,8,'#fff',4);txt(sh.t,x+150,base-134,17,sh.c,'center','#fff');
    if(i===0){for(let j=0;j<5;j++){ctx.beginPath();ctx.arc(x+50+j*28,base-40,10,0,Math.PI*1.6);ctx.lineWidth=7;ctx.strokeStyle='#e8a54a';ctx.stroke();}}
    if(i===1){[x+40,x+110].forEach(px=>{rr(px,base-100,58,76,3,'#fff4c2',3);fillR(px+6,base-94,46,10,'#c60b1e');txt('FIESTAS',px+29,base-62,10,'#c60b1e','center','#fff4c2');txt('ENCIERROS',px+29,base-46,9,OL,'center','#fff4c2');
      ell(px+29,base-80,12,7,OL,0);seg(px+18,base-86,px+12,base-92,OL,3);seg(px+40,base-86,px+46,base-92,OL,3);});}
    if(i===2)streetSign(x+70,tp+170,'CALLE','REAL');
  }
  // banderines de fiestas
  for(let gx=0;gx<w;gx+=200){ctx.beginPath();ctx.moveTo(gx,96);ctx.quadraticCurveTo(gx+100,140,gx+200,96);ctx.lineWidth=2;ctx.strokeStyle=OL;ctx.stroke();
    for(let k=1;k<10;k++){const t=k/10,px=gx+200*t,py=96+4*44*t*(1-t);ctx.beginPath();ctx.moveTo(px-7,py);ctx.lineTo(px+7,py);ctx.lineTo(px,py+16);ctx.closePath();shape(['#e0412a','#ffd23f','#2bb673','#3d7be0','#ff5d8f'][k%5],1.5);}}
}
function artSanseFence(w,h){
  for(let x=0;x<w;x+=120){rr(x+4,0,14,h,3,lin(x,0,x+14,0,[[0,'#c99560'],[1,'#a8743f']]),3);rr(x+64,0,14,h,3,lin(x,0,x+14,0,[[0,'#c99560'],[1,'#a8743f']]),3);}
  [10,30,50].forEach(y=>{rr(0,y,w,12,3,lin(0,y,0,y+12,[[0,'#e2b47e'],[1,'#c08a52']]),3);});
}
function artAlcoMid(w,h){
  const base=h;
  // bloques de ladrillo visto con toldos
  const blocks=[[0,330],[330,300],[1190,340],[1560,320],[1910,300]];
  blocks.forEach(([x,bw],i)=>{
    const tp=60+hash(i+70)*40,floors=Math.floor((base-120-tp)/62);
    bricks(x+10,tp,bw-20,base-tp,'#c8673f','#b75a35','#e2b48f');rr(x+10,tp,bw-20,base-tp,4,null,5);
    rr(x+4,tp-12,bw-8,14,3,'#e8e0d4',4);
    for(let f=0;f<floors;f++)for(let k=0;k<Math.floor((bw-40)/86);k++){
      const wx=x+30+k*86,wy=tp+20+f*62;
      rr(wx,wy,60,40,3,lin(0,wy,0,wy+40,[[0,'#8fd0ff'],[1,'#d8f2ff']]),3);seg(wx+30,wy,wx+30,wy+40,'#c9ccd6',3);
      const awn=hash(i*31+f*7+k)>.45;
      if(awn){const c=['#2bb673','#ff9f43','#3d7be0'][(i+f+k)%3];ctx.beginPath();ctx.moveTo(wx-6,wy-4);ctx.lineTo(wx+66,wy-4);ctx.lineTo(wx+72,wy+18);ctx.lineTo(wx-12,wy+18);ctx.closePath();shape(c,3);for(let s=0;s<5;s++)fillR(wx-8+s*16,wy+2,6,14,'rgba(255,255,255,.45)');}
      rr(wx-6,wy+40,72,6,2,'#e8e0d4',2.5);
      if(hash(i+f*5+k*3)>.8){rr(wx+64,wy+14,20,14,3,'#e8e8f0',2.5);circ(wx+74,wy+21,4,'#9aa0b5',1.5);}
    }
    // planta baja: portal y local
    rr(x+30,base-96,110,96,4,'#cfeeff',4);rr(x+bw-110,base-110,70,110,5,'#7a4a2a',4);circ(x+bw-50,base-56,3,'#ffd23f',2);
    if(i===0)streetSign(x+60,base-160,'C/ MARQUESA','VIUDA DE ALDAMA');
    if(i===2){rr(x+30,base-136,170,30,8,'#fff',4);txt('PANADERÍA',x+115,base-121,17,'#c98a52','center','#fff');}
    if(i===3){rr(x+30,base-136,170,30,8,'#fff',4);txt('FARMACIA',x+115,base-121,17,'#2bb673','center','#fff');rr(x+100,base-180,40,14,3,'#2bb673',3);rr(x+113,base-193,14,40,3,'#2bb673',3);}
    if(i===4){rr(x+30,base-136,170,30,8,'#fff',4);txt('FRUTERÍA',x+115,base-121,17,'#ff6b4a','center','#fff');}
  });
  // iglesia de ladrillo entre bloques
  church(700,base,'#d27a4c','#bf6a3e','#9a3b28');
  // boca de metro línea 10
  const mx=2260;rr(mx,base-60,180,60,4,'#d7d9e4',4);for(let s=0;s<5;s++)seg(mx+20,base-50+s*10,mx+160,base-50+s*10,'#9a9db0',3);
  seg(mx,base-60,mx,base-90,'#9aa0b5',5);seg(mx,base-90,mx+180,base-90,'#9aa0b5',5);seg(mx+180,base-60,mx+180,base-90,'#9aa0b5',5);
  rr(mx+40,base-230,10,170,3,'#3a3550',3);rr(mx-10,base-286,160,62,10,'#fff',4);
  rr(mx-4,base-280,40,50,8,'#2f5fb3',0);txt('M',mx+16,base-255,30,'#fff','center','#2f5fb3');
  txt('METRO',mx+90,base-268,18,'#2f5fb3','center','#fff');txt('Marqués de la',mx+90,base-250,11,OL,'center','#fff');txt('Valdavia · L10',mx+90,base-236,11,OL,'center','#fff');
  // árboles de avenida
  [[640,'#2f9e5b'],[1100,'#38b36a'],[2180,'#2f9e5b']].forEach(([tx,c])=>{rr(tx-7,base-150,14,150,4,'#7a4a2a',4);circ(tx,base-190,48,c,4);circ(tx-34,base-160,32,'#4fc47e',4);circ(tx+34,base-162,34,'#4fc47e',4);});
}

function buildArt(){
  ART.casaWall=mkLayer(1920,GY,artCasaWall);
  ART.casaFloor=mkLayer(560,H-GY,artCasaFloor);
  ART.calleFar=mkLayer(1600,GY,artCalleFar);
  ART.calleMid=mkLayer(2400,GY,artCalleMid);
  ART.calleWalk=mkLayer(560,H-GY,artCalleWalk);
  ART.coleMid=mkLayer(1920,GY,artColeMid);
  ART.sanseMid=mkLayer(2400,GY,artSanseMid);
  ART.sanseFence=mkLayer(480,64,artSanseFence);
  ART.alcoMid=mkLayer(2400,GY,artAlcoMid);
  ART.coleFence=mkLayer(480,64,artColeFence);
  ART.coleGround=mkLayer(480,H-GY,artColeGround);
}

// ---------------- dibujar fondos en juego ----------------
function bgCasa(cam){
  blit(ART.casaWall,.85,cam,0);
  blit(ART.casaFloor,1,cam,GY);seg(0,GY,W,GY,OL,4);
}
function sky(top,bottom){
  fillR(0,0,W,GY,lin(0,0,0,GY,[[0,top],[1,bottom]]));
  fillR(0,0,W,GY,rad(840,80,10,320,[[0,'rgba(255,240,170,.55)'],[1,'rgba(255,240,170,0)']]));
  ctx.save();ctx.translate(840,80);ctx.rotate(G.t*.3);for(let i=0;i<12;i++){ctx.rotate(Math.PI/6);ctx.fillStyle='rgba(255,224,102,.45)';ctx.beginPath();ctx.moveTo(44,-6);ctx.lineTo(80,0);ctx.lineTo(44,6);ctx.closePath();ctx.fill();}ctx.restore();
  circ(840,80,38,rad(830,70,5,40,[[0,'#fff6b0'],[1,'#ffd84a']]),4);
}
function clouds(cam,f,yb){
  const cf=cam*f+G.t*12;
  for(let i=Math.floor(cf/320)-1;i<=Math.floor((cf+W)/320)+1;i++){const x=i*320-cf,y=yb+hash(i+7)*70,s=.7+hash(i+2)*.5;
    ctx.save();ctx.translate(x,y);ctx.scale(s,s);
    ell(50,4,56,20,'#fff',3);ell(80,-14,34,24,'#fff',3);ell(30,-8,28,18,'#fff',3);fillR(-2,0,108,20,'#fff');
    ctx.globalAlpha=.12;ell(56,14,52,7,'#5b7bb5',0);ctx.globalAlpha=1;ctx.restore();}
}
function bgCalle(cam){
  sky('#58bdfd','#d6f1ff');clouds(cam,.08,40);
  blit(ART.calleFar,.2,cam,0);
  blit(ART.calleMid,.55,cam,0);
  blit(ART.calleWalk,1,cam,GY);seg(0,GY,W,GY,OL,4);
}
function bgSanse(cam){
  sky('#58bdfd','#d6f1ff');clouds(cam,.08,40);
  blit(ART.calleFar,.2,cam,0);blit(ART.sanseMid,.5,cam,0);blit(ART.sanseFence,.85,cam,GY-64);
  blit(ART.calleWalk,1,cam,GY);seg(0,GY,W,GY,OL,4);
}
function bgAlco(cam){
  sky('#58bdfd','#d6f1ff');clouds(cam,.08,40);
  blit(ART.calleFar,.2,cam,0);blit(ART.alcoMid,.55,cam,0);
  blit(ART.calleWalk,1,cam,GY);seg(0,GY,W,GY,OL,4);
}
function bgCole(cam){
  sky('#62c4ff','#e0f6ff');clouds(cam,.08,50);
  blit(ART.coleMid,.5,cam,0);
  blit(ART.coleFence,.8,cam,GY-64);
  blit(ART.coleGround,1,cam,GY);seg(0,GY,W,GY,OL,4);
}

const BG={casa:bgCasa,calle:bgCalle,sanse:bgSanse,alco:bgAlco,cole:bgCole};
const secAt=x=>x<B1?'casa':x<BM?'sanse':x<B2?'alco':'cole';

// puerta de salida y entrada al cole (marcas entre tramos)
function drawFrontDoor(sx){
  rr(sx-10,GY-220,120,220,10,'#a46a3e',5);rr(sx+6,GY-204,88,204,6,'#7a4a2a',4);circ(sx+80,GY-100,6,'#ffd23f',3);
  rr(sx+4,GY-260,100,34,8,'#2bb673',4);txt('SALIDA',sx+54,GY-243,22,'#fff');
}
function drawSchoolGate(sx,open){
  rr(sx-20,GY-200,30,200,6,'#7b6cf6',4);rr(sx+170,GY-200,30,200,6,'#7b6cf6',4);
  rr(sx-30,GY-240,240,46,12,'#ffd23f',5);txt('¡BIENVENIDOS!',sx+90,GY-217,24,'#e0412a');
  const w=170*(1-open);for(let x=0;x<w;x+=20)seg(sx+10+x,GY-180,sx+10+x,GY,'#4a4a5c',6);
  if(w>4){seg(sx+10,GY-180,sx+10+w,GY-180,'#4a4a5c',8);seg(sx+10,GY-90,sx+10+w,GY-90,'#4a4a5c',6);}
}
