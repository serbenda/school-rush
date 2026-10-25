// School Rush · dibujo.js
// Primitivas de dibujo con contorno de dibujo animado

// =====================================================================
//  DIBUJO: utilidades
// =====================================================================
let SHADEG=null;
function shape(fill,lw){if(fill){ctx.fillStyle=fill;ctx.fill();if(SHADEG&&lw!==0){ctx.fillStyle=SHADEG;ctx.fill();}}if(lw!==0){ctx.lineWidth=lw||4;ctx.strokeStyle=OL;ctx.lineJoin='round';ctx.stroke();}}
function circ(x,y,r,fill,lw){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);shape(fill,lw);}
function ell(x,y,rx,ry,fill,lw,rot){ctx.beginPath();ctx.ellipse(x,y,rx,ry,rot||0,0,Math.PI*2);shape(fill,lw);}
function rr(x,y,w,h,r,fill,lw){ctx.beginPath();ctx.roundRect(x,y,w,h,r);shape(fill,lw);}
function seg(x1,y1,x2,y2,col,lw){ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.lineCap='round';ctx.stroke();}
function limb(x1,y1,x2,y2,col,lw){seg(x1,y1,x2,y2,OL,lw+7);seg(x1,y1,x2,y2,col,lw);}
function txt(s,x,y,size,fill,align,stroke){
  ctx.font=`${size}px 'Lilita One',system-ui,sans-serif`;ctx.textAlign=align||'center';ctx.textBaseline='middle';
  ctx.lineJoin='round';ctx.lineWidth=Math.max(4,size/5);ctx.strokeStyle=stroke||OL;ctx.strokeText(s,x,y);ctx.fillStyle=fill||'#fff';ctx.fillText(s,x,y);
}
