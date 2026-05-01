import { useEffect, useRef } from "react";
import * as THREE from "three";
import { NEON, neonMat, glowMat, rand } from "./cosmic/cosmicUtils";
import { buildAsteroids, tickAsteroids } from "./cosmic/buildAsteroids";
import { buildComets, tickComets } from "./cosmic/buildComets";
import { buildSacredGeometry, tickSacredGeo } from "./cosmic/buildSacredGeometry";
import { buildUFOs, tickUFOs, buildAngels, tickAngels, buildAkashicPortals, tickAkashic } from "./cosmic/buildMystical";
import { buildInventionBubbles, tickInventions, buildInventorPortraits, tickInventors, buildMathEquations, tickEquations } from "./cosmic/buildInventions";
import { buildWonderObjects, tickWonderObjects } from "./cosmic/buildWonderObjects";
import { buildExtraToroidalDonuts, tickExtraToroidalDonuts, buildExtraStars, tickExtraStars, buildExtraCubes, tickExtraCubes } from "./cosmic/buildMoreGeometry";

// ── Starfield ─────────────────────────────────────────────────────────────────
function addStars(scene) {
  const count = 14000;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i*3]   = (Math.random()-0.5)*3500;
    pos[i*3+1] = (Math.random()-0.5)*3500;
    pos[i*3+2] = (Math.random()-0.5)*3500;
    const c = new THREE.Color().setHSL(Math.random(), 0.3, 0.65+Math.random()*0.35);
    col[i*3]=c.r; col[i*3+1]=c.g; col[i*3+2]=c.b;
  }
  geo.setAttribute("position", new THREE.BufferAttribute(pos,3));
  geo.setAttribute("color",    new THREE.BufferAttribute(col,3));
  const s = new THREE.Points(geo, new THREE.PointsMaterial({ size:0.32, vertexColors:true, sizeAttenuation:true }));
  scene.add(s);
  return s;
}

// ── Milky Way ────────────────────────────────────────────────────────────────
function addMilkyWay(scene) {
  const count = 10000;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count*3);
  const col = new Float32Array(count*3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random()*Math.PI*2;
    const r     = 300 + Math.pow(Math.random(),0.5)*900;
    const arm   = Math.floor(Math.random()*2)*Math.PI;
    const twist = r*0.0022;
    const spread = (Math.random()-0.5)*55*(1-r/1300);
    pos[i*3]   = Math.cos(theta+arm+twist)*r;
    pos[i*3+1] = spread;
    pos[i*3+2] = Math.sin(theta+arm+twist)*r - 700;
    const hue = 0.54+Math.random()*0.28;
    const c = new THREE.Color().setHSL(hue, 0.7, 0.5+Math.random()*0.5);
    col[i*3]=c.r; col[i*3+1]=c.g; col[i*3+2]=c.b;
  }
  geo.setAttribute("position", new THREE.BufferAttribute(pos,3));
  geo.setAttribute("color",    new THREE.BufferAttribute(col,3));
  const mw = new THREE.Points(geo, new THREE.PointsMaterial({ size:0.65, vertexColors:true, sizeAttenuation:true, transparent:true, opacity:0.88 }));
  scene.add(mw);
  return mw;
}

// ── Planets ───────────────────────────────────────────────────────────────────
function addPlanets(scene) {
  const defs = [
    { pos:[-140,40,-230], r:20, color:0xff7722, ring:true,  ringColor:0xffbb66, ri:1.45, ro:2.4 },
    { pos:[170,-55,-340], r:14, color:0x3366ff, ring:false },
    { pos:[-60,70,-170],  r:9,  color:0x66ff44, ring:false },
    { pos:[95,60,-120],   r:7,  color:0xff3388, ring:false },
    { pos:[20,-95,-300],  r:24, color:0xaa44ff, ring:true,  ringColor:0xdd99ff, ri:1.4, ro:2.0 },
    { pos:[-200,10,-380], r:12, color:0x00ffcc, ring:false },
  ];
  const list = [];
  defs.forEach(d => {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.SphereGeometry(d.r,48,48),
      new THREE.MeshStandardMaterial({ color:d.color, roughness:0.35, metalness:0.2, emissive:d.color, emissiveIntensity:0.08 })));
    g.add(new THREE.Mesh(new THREE.SphereGeometry(d.r*1.14,32,32),
      new THREE.MeshStandardMaterial({ color:d.color, transparent:true, opacity:0.09, side:THREE.FrontSide })));
    if (d.r>12) {
      for (let b=0;b<5;b++) {
        const band = new THREE.Mesh(new THREE.TorusGeometry(d.r*1.001, d.r*0.04, 6, 64),
          new THREE.MeshBasicMaterial({ color:new THREE.Color(d.color).multiplyScalar(0.65), transparent:true, opacity:0.28 }));
        band.rotation.x=Math.PI/2; band.position.y=(b-2)*d.r*0.25;
        g.add(band);
      }
    }
    if (d.ring) {
      const rg = new THREE.Mesh(new THREE.RingGeometry(d.r*d.ri, d.r*d.ro, 80),
        new THREE.MeshStandardMaterial({ color:d.ringColor, side:THREE.DoubleSide, transparent:true, opacity:0.5 }));
      rg.rotation.x=Math.PI/3.5; g.add(rg);
    }
    const pl = new THREE.PointLight(d.color,0.7,d.r*10);
    pl.position.copy(g.position);
    g.position.set(...d.pos);
    scene.add(g); scene.add(pl);
    list.push({ g, axis:new THREE.Vector3(0.1,1,0.15).normalize(), speed:0.001+Math.random()*0.002 });
  });
  return list;
}

// ── Black Holes ───────────────────────────────────────────────────────────────
function addBlackHoles(scene) {
  const list = [];
  [[-220,-45,-480],[210,85,-560]].forEach((pos,idx) => {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.SphereGeometry(7,32,32), new THREE.MeshBasicMaterial({color:0x000000})));
    [[9,13,0xff4400,0.75],[14,18,0xff8800,0.5],[19,24,0xffaa22,0.3],[25,30,0xff6600,0.18]].forEach(([i,o,c,op])=>{
      const d = new THREE.Mesh(new THREE.RingGeometry(i,o,80),
        new THREE.MeshBasicMaterial({color:c,side:THREE.DoubleSide,transparent:true,opacity:op}));
      d.rotation.x=Math.PI/2.6+idx*0.15; g.add(d);
    });
    // Photon ring
    const ph = new THREE.Mesh(new THREE.RingGeometry(8,9,80),
      new THREE.MeshBasicMaterial({color:0xffffff,side:THREE.DoubleSide,transparent:true,opacity:0.95}));
    ph.rotation.x=Math.PI/2; g.add(ph);
    // Jets
    [-1,1].forEach(dir=>{
      const jet = new THREE.Mesh(new THREE.ConeGeometry(2.5,50,16,1,true),
        new THREE.MeshBasicMaterial({color:0x88aaff,transparent:true,opacity:0.18,side:THREE.DoubleSide}));
      jet.position.y=dir*30; jet.rotation.x=dir>0?0:Math.PI; g.add(jet);
    });
    g.position.set(...pos); scene.add(g);
    list.push({g, speed:0.004+idx*0.001});
  });
  return list;
}

// ── Toroids ───────────────────────────────────────────────────────────────────
function addToroids(scene) {
  const list = [];
  for (let i=0;i<8;i++) {
    const color = NEON[(i+4)%NEON.length];
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.TorusGeometry(8,1.5,28,100), neonMat(color,2.0)));
    const inner = new THREE.Mesh(new THREE.TorusGeometry(5,0.9,16,60), neonMat(NEON[(i+7)%NEON.length],1.5));
    inner.rotation.x=Math.PI/2; g.add(inner);
    for (let w=0;w<22;w++) {
      const a=(w/22)*Math.PI*2;
      const wring = new THREE.Mesh(new THREE.TorusGeometry(1.6,0.25,8,16),
        new THREE.MeshBasicMaterial({color}));
      wring.position.set(Math.cos(a)*8,Math.sin(a)*8,0);
      wring.lookAt(0,0,0); wring.rotateX(Math.PI/2); g.add(wring);
    }
    const ions=[];
    for (let p=0;p<8;p++) {
      const a=(p/8)*Math.PI*2;
      const ion = new THREE.Mesh(new THREE.SphereGeometry(0.45,8,8),
        new THREE.MeshBasicMaterial({color:NEON[(p+i)%NEON.length]}));
      ion.userData={angle:a,R:8,speed:0.02+p*0.004};
      g.add(ion); ions.push(ion);
    }
    g.add(new THREE.PointLight(color,2,50));
    g.position.set(-140+i*40,-12+Math.sin(i)*22,-95+i*18);
    g.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*0.5);
    scene.add(g);
    list.push({g, ry:0.006+i*0.001, rx:0.003, phase:i, ions});
  }
  return list;
}

// ── Ion Field ─────────────────────────────────────────────────────────────────
function addIonField(scene) {
  const count=600;
  const geo=new THREE.BufferGeometry();
  const pos=new Float32Array(count*3), col=new Float32Array(count*3), vel=new Float32Array(count*3);
  for (let i=0;i<count;i++) {
    pos[i*3]=(Math.random()-0.5)*300; pos[i*3+1]=(Math.random()-0.5)*140; pos[i*3+2]=(Math.random()-0.5)*140;
    vel[i*3]=(Math.random()-0.5)*0.05; vel[i*3+1]=(Math.random()-0.5)*0.05; vel[i*3+2]=(Math.random()-0.5)*0.03;
    const c=new THREE.Color(NEON[Math.floor(Math.random()*NEON.length)]);
    col[i*3]=c.r; col[i*3+1]=c.g; col[i*3+2]=c.b;
  }
  geo.setAttribute("position",new THREE.BufferAttribute(pos,3));
  geo.setAttribute("color",   new THREE.BufferAttribute(col,3));
  const mesh=new THREE.Points(geo,new THREE.PointsMaterial({size:1.3,vertexColors:true,sizeAttenuation:true}));
  scene.add(mesh);
  return {mesh,vel,count};
}

// ── Shooting Stars ────────────────────────────────────────────────────────────
function addShootingStars(scene) {
  const list=[];
  for (let i=0;i<10;i++) {
    const color=Math.random()>0.4 ? NEON[Math.floor(Math.random()*NEON.length)] : 0xffffff;
    const len=50+Math.random()*40;
    const pts=[new THREE.Vector3(0,0,0),new THREE.Vector3(-len,-len*0.18,0)];
    const geo=new THREE.BufferGeometry().setFromPoints(pts);
    const mat=new THREE.LineBasicMaterial({color,transparent:true,opacity:0});
    const line=new THREE.Line(geo,mat);
    line.position.set((Math.random()-0.5)*400,(Math.random()-0.5)*150,-25);
    scene.add(line);
    list.push({line,mat,life:Math.random()*200,maxLife:90+Math.random()*80,vx:2+Math.random()*2.5,vy:-(Math.random()*0.7+0.2)});
  }
  return list;
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function CosmicResearchBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000008);
    scene.fog = new THREE.FogExp2(0x000008, 0.0013);

    const camera = new THREE.PerspectiveCamera(72, mount.clientWidth/mount.clientHeight, 0.1, 5000);
    camera.position.set(0, 0, 95);

    // Lights
    scene.add(new THREE.AmbientLight(0x112244,1.0));
    const sun = new THREE.DirectionalLight(0xffffff,1.2);
    sun.position.set(150,150,80); scene.add(sun);
    [[0x00ffff,80,50],[0xff00ff,-80,-50],[0x00ff88,0,80],[0xff6600,0,-80]].forEach(([c,x,y])=>{
      const pl=new THREE.PointLight(c,0.7,300); pl.position.set(x,y,30); scene.add(pl);
    });

    // Build all scene layers
    const stars      = addStars(scene);
    const mw         = addMilkyWay(scene);
    const planets    = addPlanets(scene);
    const blackHoles = addBlackHoles(scene);
    const toroids    = addToroids(scene);
    const {mesh:ionMesh, vel:ionVel, count:ionCount} = addIonField(scene);
    const shooters   = addShootingStars(scene);

    const asteroids    = buildAsteroids(scene);
    const comets       = buildComets(scene);
    const sacredGeo    = buildSacredGeometry(scene);
    const ufos         = buildUFOs(scene);
    const angels       = buildAngels(scene);
    const portals      = buildAkashicPortals(scene);
    const bubbles      = buildInventionBubbles(scene);
    const inventors    = buildInventorPortraits(scene);
    const equations    = buildMathEquations(scene);
    const wonders      = buildWonderObjects(scene);
    const extraDonuts  = buildExtraToroidalDonuts(scene);
    const extraStars   = buildExtraStars(scene);
    const extraCubes   = buildExtraCubes(scene);

    const onResize = () => {
      camera.aspect = mount.clientWidth/mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Camera drift
      camera.position.x = Math.sin(t*0.032)*20;
      camera.position.y = Math.cos(t*0.021)*12;
      camera.lookAt(0,0,0);

      // Starfield + milky way
      stars.rotation.y += 0.00003;
      mw.rotation.y    += 0.00002;

      // Planets
      planets.forEach(p => p.g.rotateOnAxis(p.axis, p.speed));

      // Black holes
      blackHoles.forEach(bh => { bh.g.rotation.z+=bh.speed; bh.g.rotation.y+=bh.speed*0.2; });

      // Toroids
      toroids.forEach(tor => {
        tor.g.rotation.y += tor.ry;
        tor.g.rotation.x += tor.rx;
        tor.g.position.y += Math.sin(t*0.35+tor.phase)*0.015;
        tor.ions.forEach(ion => {
          ion.userData.angle += ion.userData.speed;
          ion.position.set(
            Math.cos(ion.userData.angle)*ion.userData.R,
            Math.sin(ion.userData.angle)*ion.userData.R, 0
          );
        });
      });

      // Ion field
      const ipos = ionMesh.geometry.attributes.position.array;
      for (let i=0;i<ionCount;i++) {
        ipos[i*3]+=ionVel[i*3]; ipos[i*3+1]+=ionVel[i*3+1]; ipos[i*3+2]+=ionVel[i*3+2];
        if (Math.abs(ipos[i*3])>155)   ionVel[i*3]*=-1;
        if (Math.abs(ipos[i*3+1])>75)  ionVel[i*3+1]*=-1;
        if (Math.abs(ipos[i*3+2])>75)  ionVel[i*3+2]*=-1;
      }
      ionMesh.geometry.attributes.position.needsUpdate=true;

      // Shooting stars
      shooters.forEach(ss=>{
        ss.life++;
        if (ss.life>ss.maxLife) {
          ss.life=0;
          ss.line.position.set((Math.random()-0.5)*450,(Math.random()-0.5)*160,-25);
          ss.line.rotation.z=(Math.random()-0.5)*0.3;
        }
        const p=ss.life/ss.maxLife;
        ss.mat.opacity=(p<0.15?p/0.15:p>0.65?(1-p)/0.35:1.0)*0.95;
        ss.line.position.x+=ss.vx; ss.line.position.y+=ss.vy;
      });

      // Module ticks
      tickAsteroids(asteroids);
      tickComets(comets);
      tickSacredGeo(sacredGeo);
      tickUFOs(ufos, t);
      tickAngels(angels, t);
      tickAkashic(portals, t);
      tickInventions(bubbles, t);
      tickInventors(inventors, t);
      tickEquations(equations, t);
      tickWonderObjects(wonders, t);
      tickExtraToroidalDonuts(extraDonuts, t);
      tickExtraStars(extraStars, t);
      tickExtraCubes(extraCubes, t);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={mountRef} className="fixed inset-0 w-full h-full -z-10" style={{background:"#000008"}} />
  );
}