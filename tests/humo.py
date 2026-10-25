#!/usr/bin/env python3
"""Tests de humo de School Rush: abre el juego en Chromium y comprueba que se puede jugar.

Uso:  python3 tests/humo.py
Necesita: pip install playwright && playwright install chromium
"""
import http.server, socketserver, sys, threading, time
from pathlib import Path
from playwright.sync_api import sync_playwright

WEB = Path(__file__).resolve().parent.parent / "web"
fallos = []

def ok(cond, msg):
    print(("✅ " if cond else "❌ ") + msg)
    if not cond:
        fallos.append(msg)

class Silencioso(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass

def servidor():
    h = lambda *a, **k: Silencioso(*a, directory=str(WEB), **k)
    s = socketserver.TCPServer(("127.0.0.1", 0), h)
    threading.Thread(target=s.serve_forever, daemon=True).start()
    return s, f"http://127.0.0.1:{s.server_address[1]}/index.html"

# Bot: salta lo bajo, se agacha con lo alto y resuelve los momentos
BOT = """()=>{setInterval(()=>{if(G.state!=='play')return;
  if(R.moment){if(R.moment.type!=='light'||R.moment.phase==='green')press();return;}
  const me=R.dist+PX;const o=R.obs.filter(o=>!o.passed&&o.x+o.w>me-20).sort((a,b)=>a.x-b.x)[0];
  if(!o){inp.duckHeld=false;return;}const d=o.x-me;
  if(OB[o.type].kind==='high'){inp.duckHeld=d<R.speed*.35&&d>-o.w;}
  else{inp.duckHeld=false;if(d<R.speed*.22&&d>0&&R.p.onG)press();}},30)}"""

def main():
    srv, url = servidor()
    with sync_playwright() as p:
        b = p.chromium.launch()

        # --- escritorio: partida completa ---
        pg = b.new_page(viewport={"width": 1280, "height": 720})
        errores = []
        pg.on("pageerror", lambda e: errores.append(str(e)))
        pg.on("console", lambda m: m.type == "error" and errores.append(m.text))
        pg.goto(url); pg.evaluate("()=>{localStorage.clear();localStorage.setItem('sr-tut','1')}"); pg.goto(url)
        pg.wait_for_timeout(800)
        ok(pg.is_visible("#play"), "El menú se muestra con el botón ¡A CORRER!")
        ok(pg.evaluate("()=>G.kids.every(k=>k.uni==='falda'&&k.top==='#23232b')"), "Los peques llevan el uniforme por defecto (falda de cuadros y jersey negro)")
        pg.click("#play"); pg.evaluate(BOT)
        t0 = time.time()
        while time.time() - t0 < 150 and pg.evaluate("()=>G.state") != "end":
            pg.wait_for_timeout(1000)
        estado = pg.evaluate("()=>({state:G.state,clock:fmt(R.clock),hits:R.hits,toasts:R.toasts,done:G.done})")
        ok(estado["state"] == "end", f"La carrera llega al final ({estado['clock']}, {estado['hits']} golpes, {estado['toasts']} tostadas)")
        ok(estado["toasts"] > 20, "Se recogen tostadas por el camino")
        ok("first" in estado["done"], "Se consigue el reto de llegar al cole por primera vez")
        ok(pg.evaluate("()=>JSON.parse(localStorage.getItem('sr-retos')).includes('first')"), "Los retos se guardan en el móvil")

        # --- editor de los peques ---
        pg.evaluate("()=>{G.done=[];saveKids();menu()}"); pg.click("#tokids"); pg.wait_for_timeout(200)
        pg.click('.tb[data-v="pantalon"]'); pg.wait_for_timeout(100)
        ok(pg.evaluate("()=>G.kids[0].uni") == "pantalon", "El editor cambia el uniforme a pantalón gris")
        pg.click('.tb[data-v="corona"]'); pg.wait_for_timeout(100)
        ok(pg.evaluate("()=>G.kids[0].acc") != "corona", "Los extras bloqueados no se pueden poner")
        pg.fill("#cole", "Mi cole"); pg.wait_for_timeout(100)
        ok(pg.evaluate("()=>localStorage.getItem('sr-cole')") == "Mi cole", "El nombre del cole se guarda solo en el móvil")
        ok(not errores, "Sin errores en la consola" + (f": {errores[:3]}" if errores else ""))

        # --- modo peques: sin tocar nada, la ayuda salta y se agacha sola ---
        pg.goto(url); pg.evaluate("()=>{localStorage.clear();localStorage.setItem('sr-tut','1');localStorage.setItem('sr-modo','peques')}"); pg.goto(url)
        pg.wait_for_timeout(600); pg.click("#play")
        pg.evaluate("()=>{setInterval(()=>{if(G.state==='play'&&R.moment&&(R.moment.type!=='light'||R.moment.phase==='green'))press();},60)}")
        t0 = time.time()
        while time.time() - t0 < 170 and pg.evaluate("()=>G.state") != "end":
            pg.wait_for_timeout(1000)
        pq = pg.evaluate("()=>({state:G.state,clock:R.clock,hits:R.hits,events:R.events.every(e=>e.done)})")
        ok(pq["state"] == "end" and pq["clock"] < 9*60, f"Modo peques sin tocar nada: llega a tiempo con {pq['hits']} golpe(s)")
        ok(pq["hits"] <= 3, "Modo peques: la ayuda evita casi todos los golpes")
        ok(pq["events"], "Las sorpresas (almuerzo y perro) aparecen en la carrera")
        rec = pg.evaluate("()=>leerRecords()")
        ok(any("peques" in v for v in rec.values()), "El récord se guarda por jugador y por modo")

        # --- mañanas distintas y modo padres ---
        for man in ("lluvia", "excursion", "navidad"):
            pg.goto(url); pg.evaluate(f"()=>{{localStorage.clear();localStorage.setItem('sr-tut','1');localStorage.setItem('sr-manana','{man}');localStorage.setItem('sr-modo','padres')}}"); pg.goto(url)
            pg.wait_for_timeout(500); pg.click("#play"); pg.wait_for_timeout(300)
            pg.evaluate("()=>{R.dist=12000;R.gen=12400;R.obs=[];R.items=[];R.moments.forEach(m=>{if(m.at<13000)m.done=true})}")
            pg.wait_for_timeout(1500)
            ok(pg.evaluate("()=>G.state==='play'&&R.mode.vel>1"), f"Mañana '{man}' en modo padres: se juega sin errores")

        # --- pausa y ajustes ---
        pg.goto(url); pg.evaluate("()=>{localStorage.clear();localStorage.setItem('sr-tut','1')}"); pg.goto(url)
        pg.wait_for_timeout(500); pg.click("#calm"); pg.click("#big"); pg.wait_for_timeout(100)
        ok(pg.evaluate("()=>G.calm&&G.big&&localStorage.getItem('sr-calm')==='1'"), "Ajustes 'Menos movimiento' y 'Letras grandes' se activan y se guardan")
        pg.click("#play"); pg.wait_for_timeout(1500)
        pg.click("#pausebtn"); pg.wait_for_timeout(200)
        d0 = pg.evaluate("()=>[R.dist,R.clock]"); pg.wait_for_timeout(1200); d1 = pg.evaluate("()=>[R.dist,R.clock]")
        ok(pg.evaluate("()=>G.state")=="pause" and d0 == d1 and pg.is_visible("#resume"), "La pausa para la carrera y el reloj")
        pg.click("#resume"); pg.wait_for_timeout(600)
        ok(pg.evaluate("()=>G.state")=="play" and pg.evaluate("()=>R.dist") > d1[0], "Al seguir, la carrera continúa")
        pg.evaluate("()=>document.dispatchEvent(new Event('visibilitychange'))") 
        pg.keyboard.press("p"); pg.wait_for_timeout(150)
        ok(pg.evaluate("()=>G.state")=="pause", "La tecla P pausa")
        pg.keyboard.press("p"); pg.wait_for_timeout(150)
        ok(pg.evaluate("()=>G.state")=="play", "La tecla P reanuda")

        # --- móvil en vertical y horizontal ---
        for nombre, vp in (("vertical", {"width": 390, "height": 844}), ("horizontal", {"width": 844, "height": 390})):
            m = b.new_context(viewport=vp, has_touch=True, is_mobile=True).new_page()
            err = []
            m.on("pageerror", lambda e: err.append(str(e)))
            m.goto(url); m.evaluate("()=>{localStorage.clear();localStorage.setItem('sr-tut','1')}"); m.goto(url)
            m.wait_for_timeout(600)
            m.tap("#play"); m.wait_for_timeout(400)
            ok(m.is_visible("#bJump") and m.is_visible("#bDuck"), f"Móvil en {nombre}: se ven los botones SALTAR y AGACHAR")
            m.tap("#bJump"); m.wait_for_timeout(120)
            ok(m.evaluate("()=>!R.p.onG"), f"Móvil en {nombre}: el botón SALTAR salta")
            ok(not err, f"Móvil en {nombre}: sin errores")
        b.close()
    srv.shutdown()
    print()
    if fallos:
        print(f"❌ {len(fallos)} fallo(s)"); sys.exit(1)
    print("✅ Todo bien")

if __name__ == "__main__":
    main()
