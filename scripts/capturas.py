#!/usr/bin/env python3
"""Robot que juega a School Rush y saca las imágenes del README en docs/img/.

Uso:  python3 scripts/capturas.py
Necesita: pip install playwright && playwright install chromium, y ffmpeg para el GIF.
"""
import http.server, os, shutil, socketserver, subprocess, tempfile, threading, time
from pathlib import Path
from playwright.sync_api import sync_playwright

RAIZ = Path(__file__).resolve().parent.parent
WEB = RAIZ / "web"
IMG = RAIZ / "docs" / "img"
IMG.mkdir(parents=True, exist_ok=True)

# --- servidor local (las fuentes no cargan desde file://) ---
class Silencioso(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
def servidor():
    h = lambda *a, **k: Silencioso(*a, directory=str(WEB), **k)
    s = socketserver.TCPServer(("127.0.0.1", 0), h)
    threading.Thread(target=s.serve_forever, daemon=True).start()
    return s, f"http://127.0.0.1:{s.server_address[1]}/index.html"

# Bot sencillo: salta los obstáculos bajos y se agacha con los altos
BOT = """()=>{window.__bot=setInterval(()=>{if(G.state!=='play')return;
  if(R.moment){if(R.moment.type!=='light'||R.moment.phase==='green')press();return;}
  const me=R.dist+PX;const o=R.obs.filter(o=>!o.passed&&o.x+o.w>me-20).sort((a,b)=>a.x-b.x)[0];
  if(!o){inp.duckHeld=false;return;}const d=o.x-me;
  if(OB[o.type].kind==='high'){inp.duckHeld=d<R.speed*.35&&d>-o.w;}
  else{inp.duckHeld=false;if(d<R.speed*.22&&d>0&&R.p.onG)press();}},30)}"""

def preparar(pg, url, retos=None, tutorial=False):
    pg.goto(url)
    pg.evaluate(f"""()=>{{localStorage.clear();{'' if tutorial else "localStorage.setItem('sr-tut','1');"}
      {"localStorage.setItem('sr-retos',JSON.stringify(%s));" % retos if retos else ''}}}""")
    pg.goto(url)
    pg.evaluate("()=>document.fonts.ready")
    pg.wait_for_timeout(900)

def ir_a(pg, dist, espera=1600):
    pg.evaluate(f"""()=>{{R.dist={dist};R.gen={dist}+520;R.obs=[];R.items=[];R.p.inv=0;R.texts=[];R.banner=null;
      R.moments.forEach(m=>{{if(m.at<{dist}+900)m.done=true}})}}""")
    pg.wait_for_timeout(espera)

def main():
    srv, url = servidor()
    with sync_playwright() as p:
        b = p.chromium.launch()

        # ---------- escritorio / tablet ----------
        pg = b.new_page(viewport={"width": 1280, "height": 720})
        preparar(pg, url)

        # banner: la familia corriendo por la calle con el título
        pg.evaluate("""()=>{document.querySelector('#menu').classList.add('hidden');document.querySelector('#mute').style.display='none';
          const d=document.createElement('div');d.id='bn';d.style.cssText='position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding-top:60px;pointer-events:none';
          d.innerHTML='<h1 style="font-size:96px;margin:0">SCHOOL RUSH</h1><div style="font-family:Lilita One;font-size:40px;color:#fff;text-shadow:0 3px 0 #2b2340,0 0 6px #2b2340">¡Que llegamos tarde! 🔔</div>';
          document.querySelector('#game').appendChild(d);}""")
        pg.wait_for_timeout(700)
        g = pg.query_selector("#game").bounding_box()
        pg.screenshot(path=str(IMG / "banner.png"), clip={"x": g["x"], "y": g["y"] + g["height"] * .02, "width": g["width"], "height": g["height"] * .96})

        preparar(pg, url)
        pg.screenshot(path=str(IMG / "menu.png"))

        # tutorial
        preparar(pg, url, tutorial=True)
        pg.click("#play")
        for _ in range(80):
            pg.wait_for_timeout(100)
            if pg.evaluate("()=>R.tutPrompt"): break
        pg.wait_for_timeout(250)
        pg.screenshot(path=str(IMG / "tutorial.png"))

        # los tres tramos
        preparar(pg, url)
        pg.click("#play"); pg.wait_for_timeout(800)
        pg.evaluate("()=>{R.score=420;R.toasts=31;R.mult=2}")
        ir_a(pg, 2600); pg.screenshot(path=str(IMG / "casa.png"))
        ir_a(pg, 10400)
        pg.evaluate("()=>{R.power={type:'scooter',t:5};R.st.powers.push('scooter')}")
        pg.wait_for_timeout(700); pg.screenshot(path=str(IMG / "sanse.png"))
        ir_a(pg, 14300)
        pg.evaluate("()=>{const o={type:'bull',x:R.dist+PX+560,w:108,h:76,t:0,vx:-175};OB.bull.init(o);R.obs.push(o)}")
        pg.wait_for_timeout(500); pg.screenshot(path=str(IMG / "toro.png"))
        ir_a(pg, 19300); pg.screenshot(path=str(IMG / "alcobendas.png"))
        ir_a(pg, 25200); pg.screenshot(path=str(IMG / "cole.png"))

        # golpe
        ir_a(pg, 12000, 400)
        pg.evaluate("()=>{const o={type:'trash',x:R.dist+PX+20,w:56,h:78,t:0,vx:0};OB.trash.init(o);R.obs.push(o)}")
        pg.wait_for_timeout(330); pg.screenshot(path=str(IMG / "golpe.png"))

        # momentos
        pg.evaluate("()=>{R.moments[0].done=false;R.dist=6170;R.obs=[];R.items=[];R.p.inv=0}")
        pg.wait_for_timeout(400)
        for _ in range(6): pg.keyboard.press("Space"); pg.wait_for_timeout(60)
        pg.screenshot(path=str(IMG / "momento-dientes.png"))
        pg.evaluate("()=>{R.moment=null;R.moments[1].done=false;R.dist=16470;R.obs=[];R.items=[]}")
        for _ in range(60):
            pg.wait_for_timeout(100)
            if pg.evaluate("()=>R.moment&&R.moment.phase==='green'"): break
        pg.wait_for_timeout(120); pg.screenshot(path=str(IMG / "momento-semaforo.png"))
        pg.keyboard.press("Space"); pg.wait_for_timeout(1300)
        pg.evaluate("()=>{R.moment=null;R.dist=29960;R.obs=[];R.items=[];R.moments.forEach(m=>{if(m.type!=='gate')m.done=true})}")
        pg.wait_for_timeout(500)
        for _ in range(5): pg.keyboard.press("Space"); pg.wait_for_timeout(70)
        pg.screenshot(path=str(IMG / "momento-puerta.png"))
        for _ in range(16): pg.keyboard.press("Space"); pg.wait_for_timeout(70)
        pg.wait_for_timeout(2200); pg.screenshot(path=str(IMG / "final.png"))

        # editor de los peques con algunos retos conseguidos
        preparar(pg, url, retos='["first","stars3","mult5","reflex"]')
        pg.evaluate("""()=>{G.kids[0]=Object.assign(G.kids[0],{acc:'gafas'});G.kids[1]=Object.assign(G.kids[1],{acc:'corona',style:'coletas',hair:'#f2c14e',top:'#7b6cf6'});saveKids();menu();}""")
        pg.click("#tokids"); pg.wait_for_timeout(300)
        pg.evaluate("()=>document.querySelector('.retos').open=true"); pg.wait_for_timeout(200)
        pg.screenshot(path=str(IMG / "peques.png"))

        # ---------- GIF de una partida ----------
        preparar(pg, url)
        pg.set_viewport_size({"width": 960, "height": 540})
        pg.click("#play"); pg.evaluate(BOT)
        pg.evaluate("()=>{R.dist=8300;R.gen=8800;R.obs=[];R.items=[];R.moments[0].done=true}")
        tmp = Path(tempfile.mkdtemp())
        for i in range(60):
            pg.screenshot(path=str(tmp / f"f{i:03d}.png"))
            pg.wait_for_timeout(55)
        if shutil.which("ffmpeg"):
            pal = tmp / "pal.png"
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", "12", "-i", str(tmp / "f%03d.png"),
                            "-vf", "scale=480:-1:flags=lanczos,palettegen=max_colors=96:stats_mode=diff", str(pal)], check=True)
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", "12", "-i", str(tmp / "f%03d.png"), "-i", str(pal),
                            "-lavfi", "scale=480:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle",
                            str(IMG / "partida.gif")], check=True)
        shutil.rmtree(tmp)

        # ---------- móvil en horizontal ----------
        c = b.new_context(viewport={"width": 844, "height": 390}, has_touch=True, is_mobile=True, device_scale_factor=2)
        m = c.new_page()
        preparar(m, url)
        m.screenshot(path=str(IMG / "movil-menu.png"))
        m.tap("#play"); m.wait_for_timeout(600)
        ir_a(m, 14500); m.screenshot(path=str(IMG / "movil-juego.png"))
        preparar(m, url, retos='["first","stars3"]')
        m.tap("#tokids"); m.wait_for_timeout(300)
        m.screenshot(path=str(IMG / "movil-peques.png"))
        # móvil en vertical
        v = b.new_context(viewport={"width": 390, "height": 844}, has_touch=True, is_mobile=True, device_scale_factor=2).new_page()
        preparar(v, url)
        v.tap("#play"); v.wait_for_timeout(600)
        ir_a(v, 11800); v.screenshot(path=str(IMG / "movil-vertical.png"))
        b.close()
    srv.shutdown()
    print("Capturas en", IMG)

if __name__ == "__main__":
    main()
