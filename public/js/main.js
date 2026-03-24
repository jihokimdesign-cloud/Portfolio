/* ======================================
   CURSOR BUBBLE
   ====================================== */
(function(){
  var bubble=document.getElementById('cursorBubble');
  var cards=document.querySelectorAll('.project-card');
  var bx=0,by=0,tx=0,ty=0,raf=null;
  var colors={
    'proxiplay-case-study.html':'#ea580c',
    'tap3d-case-study.html':'#2563eb',
    'myjournal-case-study.html':'#7c3aed',
    'sidewalk-case-study.html':'#16a34a'
  };

  function lerp(a,b,t){return a+(b-a)*t}
  function animate(){
    bx=lerp(bx,tx,.15);by=lerp(by,ty,.15);
    bubble.style.left=bx+'px';bubble.style.top=by+'px';
    raf=requestAnimationFrame(animate);
  }

  window.addEventListener('scroll',function(){
    bubble.classList.remove('visible');
    if(raf){cancelAnimationFrame(raf);raf=null}
  },{passive:true});

  cards.forEach(function(card){
    card.addEventListener('mouseenter',function(e){
      var href=card.getAttribute('href')||'';
      var c=colors[href]||'#111';
      bubble.style.background=c;
      bubble.textContent='View Project \uD83D\uDC40';
      bx=tx=e.clientX+16;by=ty=e.clientY-40;
      bubble.style.left=bx+'px';bubble.style.top=by+'px';
      bubble.classList.add('visible');
      if(!raf)raf=requestAnimationFrame(animate);
    });
    card.addEventListener('mouseleave',function(){
      bubble.classList.remove('visible');
      if(raf){cancelAnimationFrame(raf);raf=null}
    });
    card.addEventListener('mousemove',function(e){
      tx=e.clientX+16;ty=e.clientY-40;
    });
  });

  var arCards=document.querySelectorAll('.ar-card');
  var arBubbles=[
    {text:'View Project \uD83D\uDC40',color:'#d97706'},
    {text:'Link to Medium Post \u270D\uD83C\uDFFB',color:'#059669'}
  ];
  arCards.forEach(function(card,i){
    var info=arBubbles[i];if(!info)return;
    card.addEventListener('mouseenter',function(e){
      bubble.style.background=info.color;
      bubble.textContent=info.text;
      bx=tx=e.clientX+16;by=ty=e.clientY-40;
      bubble.style.left=bx+'px';bubble.style.top=by+'px';
      bubble.classList.add('visible');
      if(!raf)raf=requestAnimationFrame(animate);
    });
    card.addEventListener('mouseleave',function(){
      bubble.classList.remove('visible');
      if(raf){cancelAnimationFrame(raf);raf=null}
    });
    card.addEventListener('mousemove',function(e){
      tx=e.clientX+16;ty=e.clientY-40;
    });
  });
})();

/* ======================================
   GSAP
   ====================================== */
gsap.registerPlugin(ScrollTrigger);

/* -- Respect reduced-motion preference -- */
var mm = gsap.matchMedia();

mm.add({
  normal: '(prefers-reduced-motion: no-preference)',
  reduced: '(prefers-reduced-motion: reduce)'
}, function(context) {
  var reduced = context.conditions.reduced;

  /* -- Hero intro entrance -- */
  var introTl = gsap.timeline({ delay: 0.15 });
  introTl
    .to('.intro-label', { opacity: 1, y: 0, duration: reduced ? 0 : 0.5, ease: 'power3.out' })
    .to('.intro-text', { opacity: 1, y: 0, duration: reduced ? 0 : 0.7, ease: 'power3.out' }, '-=0.2')
    .to('.intro-scribble', { opacity: 1, y: 0, duration: reduced ? 0 : 0.5, ease: 'power3.out' }, '-=0.35')
    .to('.intro-btns', { opacity: 1, y: 0, duration: reduced ? 0 : 0.5, ease: 'power3.out' }, '-=0.25')
    .to('.intro-link', { opacity: 1, y: 0, duration: reduced ? 0 : 0.4, ease: 'power3.out' }, '-=0.2');

  /* -- "Selected Work" label -- */
  gsap.to('.hero-annotation.sr', {
    opacity: 1, y: 0,
    duration: reduced ? 0 : 0.7,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.hero-annotation.sr', start: 'top 90%', once: true }
  });

  /* -- Project cards stagger -- */
  gsap.to('.project-card.sr', {
    opacity: 1, y: 0,
    duration: reduced ? 0 : 0.8,
    ease: 'power3.out',
    stagger: 0.12,
    scrollTrigger: { trigger: '.project-grid', start: 'top 85%', once: true }
  });

  /* -- Blank CTA card -- */
  gsap.to('.blank-card.sr', {
    opacity: 1, y: 0,
    duration: reduced ? 0 : 0.8,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.blank-card', start: 'top 90%', once: true }
  });

  /* -- Bridge text -- */
  gsap.to('.bridge-text.sr', {
    opacity: 1, y: 0,
    duration: reduced ? 0 : 0.9,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.bridge', start: 'top 80%', once: true }
  });

  /* -- AR section header stagger -- */
  gsap.to('.ar-section .sr:not(.ar-card)', {
    opacity: 1, y: 0,
    duration: reduced ? 0 : 0.7,
    ease: 'power3.out',
    stagger: 0.1,
    scrollTrigger: { trigger: '.ar-header', start: 'top 85%', once: true }
  });

  /* -- AR cards stagger -- */
  gsap.to('.ar-card.sr', {
    opacity: 1, y: 0,
    duration: reduced ? 0 : 0.8,
    ease: 'power3.out',
    stagger: 0.15,
    scrollTrigger: { trigger: '.ar-grid', start: 'top 85%', once: true }
  });

  /* -- AI Lab section -- */
  var aiLabEls = gsap.utils.toArray('.ai-section .sr');
  gsap.to(aiLabEls, {
    opacity: 1, y: 0,
    duration: reduced ? 0 : 0.7,
    ease: 'power3.out',
    stagger: 0.1,
    scrollTrigger: { trigger: '.ai-section', start: 'top 80%', once: true }
  });

  /* -- Demo cards stagger -- */
  gsap.to('.demo-card.sr', {
    opacity: 1, y: 0,
    duration: reduced ? 0 : 0.8,
    ease: 'power3.out',
    stagger: 0.12,
    scrollTrigger: { trigger: '.demo-grid', start: 'top 85%', once: true }
  });

  /* -- Footer blocks stagger -- */
  gsap.to('.site-footer .sr', {
    opacity: 1, y: 0,
    duration: reduced ? 0 : 0.6,
    ease: 'power2.out',
    stagger: 0.08,
    scrollTrigger: { trigger: '.site-footer', start: 'top 85%', once: true }
  });
});

/* -- Nav dark-mode toggle (always active) -- */
ScrollTrigger.create({
  trigger:'.ai-section',start:'top 60px',endTrigger:'.site-footer',end:'bottom 60px',
  onEnter:function(){document.getElementById('mainNav').classList.add('dark-mode')},
  onLeave:function(){document.getElementById('mainNav').classList.remove('dark-mode')},
  onEnterBack:function(){document.getElementById('mainNav').classList.add('dark-mode')},
  onLeaveBack:function(){document.getElementById('mainNav').classList.remove('dark-mode')}
});

/* ======================================
   EXPERIENCE SWAP (vanilla JS — matches React ExpSwap)
   ====================================== */
(function(){
  var EXP=[
    {
      id:'stealth',
      role:'Product Designer & Founder',
      company:'Stealth AI Startup',
      period:'Nov 2024 — Present',
      desc:'Designed a multimodal video player interface that intelligently segments YouTube content into interactive steps, integrating voice and gesture controls for hands-free navigation.\n\nEmbedded a context-aware AI assistant within the playback flow, enabling users to query video content in real-time. Cut engineering handoff cycles by 50% through Cursor AI prototyping.',
      icon:'layers',
      photo:'url(landingimgs/startup_exp.png) center/cover'
    },
    {
      id:'lepal',
      role:'Product Designer',
      company:'Lepal.ai',
      period:'Sep — Nov 2024',
      desc:'Designed native iOS/Android features for an AI wellness app, increasing user satisfaction by 60% via data-driven micro-interactions.\n\nOptimized subscription funnels and premium upgrade flows. Conducted A/B testing on generative chat flows, achieving a 15% lift in Day-7 retention.',
      icon:'heart',
      photo:'url(landingimgs/lepal_exp.png) center/cover'
    },
    {
      id:'tap3d',
      role:'Product Designer',
      company:'TAP3D (XR Training)',
      period:'Mar — Aug 2024',
      desc:'Delivered an AR-based onboarding experience for industrial engineers, reducing average training time by 30%.\n\nLed interaction design and prototyping using Unity and ShapesXR. Conducted user testing with 8+ field engineers, iterating on spatial interactions to support cognitive load and tool discoverability.',
      icon:'cube',
      photo:'url(landingimgs/tap_exp.png) center/cover'
    },
    {
      id:'sidewalk',
      role:'Product Designer',
      company:'Project Sidewalk',
      period:'Sep 2023 — Aug 2024',
      desc:'Redesigned the map-based navigation interface for a civic accessibility platform, improving pathfinding logic for 11,000+ users.\n\nArchitected a production-ready design system complying with WCAG 2.2 AA standards, adopted across 3 cross-functional teams to eliminate accessibility debt.',
      icon:'grid',
      photo:'url(landingimgs/sidewalk_exp.png) center/cover'
    }
  ];

  var ICONS={
    layers:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
    heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"/></svg>',
    cube:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>',
    grid:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>'
  };

  var activeId=EXP[0].id;
  var swapping=false;
  var root=document.getElementById('exp-root');

  /* Build the initial DOM structure once */
  function buildDOM(){
    var active=EXP.find(function(e){return e.id===activeId});
    var inactive=EXP.filter(function(e){return e.id!==activeId});

    root.innerHTML=
      '<p class="hero-annotation sr" style="opacity:1;transform:none">'+
        'Recent Experience '+
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;opacity:.5"><rect x="2" y="2" width="12" height="12" rx="3"/><path d="M6 6h4M6 8.5h2.5"/></svg>'+
      '</p>'+
      '<div class="exp-swap-grid">'+
        '<div>'+
          '<div class="exp-featured" style="background:'+active.photo+'">'+
            '<div class="exp-featured-content" id="expFeaturedContent">'+
              '<div class="exp-featured-role" id="expRole">'+active.role+'</div>'+
              '<div class="exp-featured-company" id="expCompany">@ '+active.company+'</div>'+
              '<span class="exp-featured-period" id="expPeriod">'+active.period+'</span>'+
            '</div>'+
          '</div>'+
          '<div class="exp-inactive-grid" id="expInactiveGrid">'+
            inactive.map(function(w){
              return '<div class="exp-inactive-card" data-id="'+w.id+'">'+
                '<div>'+
                  '<div class="exp-inactive-role">'+w.role+'</div>'+
                  '<div class="exp-inactive-company">@ '+w.company+'</div>'+
                '</div>'+
              '</div>';
            }).join('')+
          '</div>'+
        '</div>'+
        '<div class="exp-detail">'+
          '<div class="exp-detail-inner" id="expDetailInner">'+
            '<p class="exp-detail-desc" id="expDesc">'+active.desc+'</p>'+
          '</div>'+
        '</div>'+
      '</div>';

    bindClicks();
  }

  /* Update content in-place with crossfade animations */
  function swapTo(newId){
    if(swapping||newId===activeId)return;
    swapping=true;

    var featured=document.getElementById('expFeaturedContent');
    var detail=document.getElementById('expDetailInner');
    var inactiveCards=document.querySelectorAll('.exp-inactive-card');

    // Phase 1: Fade out featured, detail, and inactive cards
    featured.classList.add('fading');
    detail.classList.add('fading');
    inactiveCards.forEach(function(c){c.classList.add('refreshing')});

    // Phase 2: After fade-out, update content and fade back in
    setTimeout(function(){
      activeId=newId;
      var active=EXP.find(function(e){return e.id===activeId});
      var inactive=EXP.filter(function(e){return e.id!==activeId});

      // Update featured card content
      document.getElementById('expRole').textContent=active.role;
      document.getElementById('expCompany').textContent='@ '+active.company;
      document.getElementById('expPeriod').textContent=active.period;

      // Update description
      document.getElementById('expDesc').textContent=active.desc;

      // Update featured background
      document.querySelector('.exp-featured').style.background=active.photo;

      // Update inactive cards
      var grid=document.getElementById('expInactiveGrid');
      grid.innerHTML=inactive.map(function(w){
        return '<div class="exp-inactive-card refreshing" data-id="'+w.id+'">'+
          '<div>'+
            '<div class="exp-inactive-role">'+w.role+'</div>'+
            '<div class="exp-inactive-company">@ '+w.company+'</div>'+
          '</div>'+
        '</div>';
      }).join('');

      // Phase 3: Remove fading classes to trigger fade-in
      requestAnimationFrame(function(){
        featured.classList.remove('fading');
        detail.classList.remove('fading');

        // Stagger inactive cards fade-in
        var newCards=grid.querySelectorAll('.exp-inactive-card');
        newCards.forEach(function(c,i){
          setTimeout(function(){c.classList.remove('refreshing')},i*50);
        });

        bindClicks();
        swapping=false;
      });
    },300);
  }

  function bindClicks(){
    document.querySelectorAll('.exp-inactive-card').forEach(function(card){
      card.addEventListener('click',function(){swapTo(card.dataset.id)});
    });
  }

  buildDOM();
})();

/* ======================================
   AI LAB
   ====================================== */
(function(){
  var CDN='https://cdn.jsdelivr.net/npm/';
  var video=document.getElementById('webcam');
  var canvas=document.getElementById('outputCanvas');
  var ctx=canvas.getContext('2d');
  var modal=document.getElementById('demoModal');

  var activeMode=null;
  var cameraReady=false;
  var detecting=false;
  var rafId=null;
  var models={};
  var loadedScripts={};

  var INFO={
    hands:{title:'Bloom Garden',desc:'Open your hand to grow flowers',prompt:'Show your hand to the camera'},
    face:{title:'Finger Spell',desc:'Spell out sentences with hand signs',prompt:'Show your hand to the camera'},
    sketch:{title:'Kaleidoscope',desc:'Draw once, mirror eight times'}
  };

  function loadScript(src){
    if(loadedScripts[src])return loadedScripts[src];
    loadedScripts[src]=new Promise(function(res,rej){
      var s=document.createElement('script');
      s.src=src;s.crossOrigin='anonymous';
      s.onload=res;s.onerror=function(){rej(new Error('Failed: '+src))};
      document.head.appendChild(s);
    });
    return loadedScripts[src];
  }

  async function startCamera(){
    var stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:640},height:{ideal:480}}});
    video.srcObject=stream;
    await video.play();
    canvas.width=video.videoWidth;canvas.height=video.videoHeight;
    cameraReady=true;
  }

  function stopDetection(){detecting=false;if(rafId)cancelAnimationFrame(rafId);rafId=null}
  function startDetection(){
    if(!cameraReady)return;
    detecting=true;
    (async function loop(){
      if(!detecting)return;
      try{if(models[activeMode])await models[activeMode].send({image:video})}catch(e){}
      rafId=requestAnimationFrame(loop);
    })();
  }

  async function loadModel(mode){
    if(models[mode])return;
    var ml=document.getElementById('modelLoading');
    var lt=document.getElementById('loadingText');
    ml.classList.add('show');
    try{
      if(mode==='hands'){
        lt.textContent='Loading hand detection...';
        await loadScript(CDN+'@mediapipe/hands/hands.js');
        var h=new Hands({locateFile:function(f){return CDN+'@mediapipe/hands/'+f}});
        h.setOptions({maxNumHands:1,modelComplexity:1,minDetectionConfidence:.6,minTrackingConfidence:.5});
        h.onResults(onHandsResults);
        await h.initialize();
        models.hands=h;
      }else if(mode==='face'){
        lt.textContent='Loading hand detection...';
        if(!models.hands){
          await loadScript(CDN+'@mediapipe/hands/hands.js');
          var h2=new Hands({locateFile:function(f){return CDN+'@mediapipe/hands/'+f}});
          h2.setOptions({maxNumHands:1,modelComplexity:1,minDetectionConfidence:.6,minTrackingConfidence:.5});
          h2.onResults(onHandsResults);
          await h2.initialize();
          models.hands=h2;
        }
        models.face=models.hands;
      }
    }finally{ml.classList.remove('show')}
  }

  function showResult(mode){
    ['resultHands','resultFace','resultSketch'].forEach(function(id){document.getElementById(id).style.display='none'});
    var map={hands:'resultHands',face:'resultFace',sketch:'resultSketch'};
    if(map[mode])document.getElementById(map[mode]).style.display='block';
  }

  function openModal(mode){
    activeMode=mode;
    var info=INFO[mode];
    document.getElementById('modalTitle').textContent=info.title;
    document.getElementById('modalDesc').textContent=info.desc;

    var cameraWrap=document.getElementById('cameraWrap');
    var sketchWrap=document.getElementById('sketchWrap');
    var sketchTools=document.getElementById('sketchTools');

    if(mode==='sketch'){
      cameraWrap.style.display='none';
      sketchWrap.style.display='block';
      sketchTools.style.display='flex';
      kaleidGroups=[];
      sCtx.fillStyle='#111';sCtx.fillRect(0,0,sketchCanvas.width,sketchCanvas.height);
      document.getElementById('sketchLabel').textContent='Draw to create a mandala';
    }else{
      cameraWrap.style.display='block';
      sketchWrap.style.display='none';
      sketchTools.style.display='none';
      document.getElementById('promptText').textContent=info.prompt;
      if(cameraReady){
        document.getElementById('cameraPrompt').classList.add('hidden');
      }else{
        document.getElementById('cameraPrompt').classList.remove('hidden');
        document.getElementById('startBtn').disabled=false;
      }
    }

    if(mode==='hands'){bloomStamps=[];bloomPollen=[];extractBloomFrames()}
    if(mode==='face'){phraseIdx=0;charIdx=0;letterHold=0;buildPhrase()}

    showResult(mode);
    document.getElementById('errorMsg').style.display='none';
    modal.classList.add('open');
    document.body.style.overflow='hidden';

    if(mode!=='sketch'&&cameraReady){
      (async function(){await loadModel(mode);startDetection()})();
    }
  }

  function closeModal(){
    stopDetection();
    ctx.clearRect(0,0,canvas.width,canvas.height);
    modal.classList.remove('open');
    document.body.style.overflow='';
    activeMode=null;
  }

  document.querySelectorAll('.demo-card').forEach(function(card){
    card.addEventListener('click',function(){openModal(card.dataset.mode)});
  });

  document.getElementById('modalClose').addEventListener('click',closeModal);
  modal.addEventListener('click',function(e){if(e.target===modal)closeModal()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&modal.classList.contains('open'))closeModal()});

  document.getElementById('startBtn').addEventListener('click',async function(){
    this.disabled=true;
    document.getElementById('errorMsg').style.display='none';
    try{
      await startCamera();
      document.getElementById('cameraPrompt').classList.add('hidden');
      showResult(activeMode);
      await loadModel(activeMode);
      startDetection();
    }catch(err){
      var msg='Failed to start: '+err.message;
      if(err.name==='NotAllowedError')msg='Camera access denied. Please allow and retry.';
      if(err.name==='NotFoundError')msg='No camera found on this device.';
      document.getElementById('errorMsg').textContent=msg;
      document.getElementById('errorMsg').style.display='block';
      this.disabled=false;
    }
  });

  /* ════════════════════════════════
     BLOOM GARDEN (Hands) — Video-based
     ════════════════════════════════ */
  var BLOOM_TOTAL_FRAMES=30;    // extract 30 frames for smooth scrubbing
  var bloomFrames=[];
  var bloomFramesReady=false;
  var bloomPollen=[];
  var bloomThrottle=0;
  var bloomSmooth=0;            // smoothed value 0-5, lerps toward target

  // Preload bloom video and extract frames
  var bloomVid=document.createElement('video');
  bloomVid.muted=true;
  bloomVid.playsInline=true;
  bloomVid.preload='auto';

  function extractBloomFrames(){
    if(bloomFramesReady)return Promise.resolve();
    return new Promise(function(resolve){
      bloomVid.onerror=function(){console.warn('Bloom video failed to load');resolve()};

      function onReady(){
        var dur=bloomVid.duration;
        if(!dur||isNaN(dur)){resolve();return}
        var times=[];
        for(var i=0;i<BLOOM_TOTAL_FRAMES;i++)times.push(Math.min(i/(BLOOM_TOTAL_FRAMES-1)*dur,dur-0.01));
        var idx=0;
        function grabNext(){
          if(idx>=times.length){bloomFramesReady=true;resolve();return}
          bloomVid.currentTime=times[idx];
          function onSeeked(){
            bloomVid.removeEventListener('seeked',onSeeked);
            var c=document.createElement('canvas');
            c.width=bloomVid.videoWidth||320;
            c.height=bloomVid.videoHeight||320;
            c.getContext('2d').drawImage(bloomVid,0,0,c.width,c.height);
            bloomFrames[idx]=c;
            idx++;
            grabNext();
          }
          bloomVid.addEventListener('seeked',onSeeked);
        }
        grabNext();
      }

      bloomVid.addEventListener('loadeddata',function(){onReady()},{once:true});
      bloomVid.addEventListener('canplaythrough',function(){
        if(!bloomFramesReady&&bloomFrames.length===0)onReady();
      },{once:true});
      bloomVid.src='Sub_proj/flower_bloom.mp4';
      bloomVid.load();
    });
  }

  // Start preloading immediately
  extractBloomFrames();

  document.getElementById('clearGardenBtn').addEventListener('click',function(){
    bloomPollen=[];
  });

  function countFingers(lm){
    var th=(function(){var d1=Math.hypot(lm[4].x-lm[5].x,lm[4].y-lm[5].y),d2=Math.hypot(lm[3].x-lm[5].x,lm[3].y-lm[5].y);return d1>d2*1.15?1:0})();
    var fi=[th,lm[8].y<lm[6].y?1:0,lm[12].y<lm[10].y?1:0,lm[16].y<lm[14].y?1:0,lm[20].y<lm[18].y?1:0];
    var count=0;for(var i=0;i<5;i++)count+=fi[i];
    return count;
  }

  function roundRect(ctx,x,y,w,h,r){
    ctx.beginPath();
    ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);
    ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
    ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);
    ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();
  }

  // Helper: draw a bloom frame cover-fitted to canvas, counter-flipped
  function drawBloomFrame(ctx,frame,w,h){
    ctx.save();
    ctx.translate(w,0);ctx.scale(-1,1);
    var fAR=frame.width/frame.height,cAR=w/h;
    var sw,sh,sx,sy;
    if(fAR>cAR){sh=frame.height;sw=sh*cAR;sx=(frame.width-sw)/2;sy=0}
    else{sw=frame.width;sh=sw/cAR;sx=0;sy=(frame.height-sh)/2}
    ctx.drawImage(frame,sx,sy,sw,sh,0,0,w,h);
    ctx.restore();
  }

  function onHandsResults(r){
    if(activeMode==='face')return onSignResults(r);
    if(activeMode!=='hands')return;
    var w=canvas.width,h=canvas.height;

    // Determine target finger count
    var fingers=0;
    var hasHand=r.multiHandLandmarks&&r.multiHandLandmarks.length>0;
    var lm=hasHand?r.multiHandLandmarks[0]:null;
    if(lm)fingers=countFingers(lm);

    // Smooth toward target (lerp for fluid motion)
    var target=hasHand?fingers:bloomSmooth;
    bloomSmooth+=(target-bloomSmooth)*0.12;

    // Map smoothed value (0-5) to frame index (0-29) with crossfade
    if(bloomFramesReady&&bloomFrames.length>0){
      var t=bloomSmooth/5*(bloomFrames.length-1);
      var lo=Math.floor(t),hi=Math.min(lo+1,bloomFrames.length-1);
      var blend=t-lo;

      // Draw lower frame
      if(bloomFrames[lo]){
        drawBloomFrame(ctx,bloomFrames[lo],w,h);
      }
      // Crossfade upper frame on top
      if(blend>0.01&&bloomFrames[hi]&&hi!==lo){
        ctx.globalAlpha=blend;
        drawBloomFrame(ctx,bloomFrames[hi],w,h);
        ctx.globalAlpha=1;
      }
    }else{
      ctx.fillStyle='#0a0a0a';ctx.fillRect(0,0,w,h);
    }

    // === Pollen overlay ===
    for(var i=bloomPollen.length-1;i>=0;i--){
      var p=bloomPollen[i];
      p.x+=p.vx;p.y+=p.vy;p.life--;
      if(p.life<=0){bloomPollen.splice(i,1);continue}
      ctx.globalAlpha=p.life/p.maxLife*0.5;
      ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
      ctx.fillStyle=p.color;ctx.fill();
    }
    ctx.globalAlpha=1;

    // === PiP: Webcam in bottom-right corner ===
    var pipW=Math.round(w*0.28),pipH=Math.round(h*0.28);
    var pipX=w-pipW-10,pipY=h-pipH-10;
    ctx.save();
    roundRect(ctx,pipX,pipY,pipW,pipH,8);
    ctx.clip();
    ctx.drawImage(video,pipX,pipY,pipW,pipH);
    ctx.restore();
    ctx.strokeStyle='rgba(255,255,255,.25)';ctx.lineWidth=1.5;
    roundRect(ctx,pipX,pipY,pipW,pipH,8);ctx.stroke();

    if(!hasHand){
      document.getElementById('bloomLabel').textContent='Show your hand to plant...';
      return;
    }

    // === Hand skeleton on PiP ===
    var conns=[[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[0,9],[9,10],[10,11],[11,12],[0,13],[13,14],[14,15],[15,16],[0,17],[17,18],[18,19],[19,20],[5,9],[9,13],[13,17]];
    ctx.strokeStyle='rgba(255,255,255,.4)';ctx.lineWidth=1;ctx.lineCap='round';
    conns.forEach(function(c){
      ctx.beginPath();
      ctx.moveTo(pipX+lm[c[0]].x*pipW,pipY+lm[c[0]].y*pipH);
      ctx.lineTo(pipX+lm[c[1]].x*pipW,pipY+lm[c[1]].y*pipH);
      ctx.stroke();
    });
    lm.forEach(function(pt){ctx.beginPath();ctx.arc(pipX+pt.x*pipW,pipY+pt.y*pipH,1.5,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,.6)';ctx.fill()});

    // === Pollen emission ===
    bloomThrottle++;
    if(bloomThrottle%4===0&&fingers>=3){
      var POLLEN_COLORS=['#F472B6','#FB923C','#A78BFA','#38BDF8','#4ADE80'];
      for(var pi=0;pi<2;pi++){
        bloomPollen.push({
          x:w/2+(Math.random()-0.5)*w*0.4,
          y:h/2+(Math.random()-0.5)*h*0.3,
          vx:(Math.random()-0.5)*2,
          vy:-Math.random()*2-0.5,
          life:35+Math.random()*25,maxLife:60,
          size:1.5+Math.random()*2.5,
          color:POLLEN_COLORS[Math.floor(Math.random()*POLLEN_COLORS.length)]
        });
      }
      if(bloomPollen.length>200)bloomPollen.splice(0,bloomPollen.length-200);
    }

    var labels=['Seed planted...','Sprouting...','Budding...','Budding...','Blooming!','Full bloom!'];
    document.getElementById('bloomLabel').textContent=labels[fingers]||'Full bloom!';
  }

  /* ════════════════════════════════
     FINGER SPELL (Sentence Mode)
     ════════════════════════════════ */
  var SIGN_ALPHA={
    'S':{f:[0,0,0,0,0],hint:'Fist'},
    'A':{f:[1,0,0,0,0],hint:'Thumb up'},
    'I':{f:[0,1,0,0,0],hint:'Index finger'},
    'L':{f:[1,1,0,0,0],hint:'L shape'},
    'N':{f:[0,1,1,0,0],hint:'Two fingers'},
    'E':{f:[1,1,1,0,0],hint:'Three + thumb'},
    'M':{f:[0,1,1,1,0],hint:'Three fingers'},
    'B':{f:[0,1,1,1,1],hint:'Four fingers'},
    'H':{f:[1,1,1,1,0],hint:'Four + thumb'},
    'O':{f:[1,1,1,1,1],hint:'Open hand'},
    'Y':{f:[1,0,0,0,1],hint:'Shaka'},
    'R':{f:[0,1,0,0,1],hint:'Rock on'},
    'T':{f:[0,0,0,0,1],hint:'Pinky up'}
  };
  var PHRASES=['HELLO','HI MY NAME IS','BORN TO SHINE','LISTEN','HARMONY','THIS IS ME'];
  var phraseIdx=0;
  var charIdx=0;
  var letterHold=0;

  function getFingerState(lm){
    var d1=Math.hypot(lm[4].x-lm[5].x,lm[4].y-lm[5].y);
    var d2=Math.hypot(lm[3].x-lm[5].x,lm[3].y-lm[5].y);
    var th=d1>d2*1.15?1:0;
    return[th,lm[8].y<lm[6].y?1:0,lm[12].y<lm[10].y?1:0,lm[16].y<lm[14].y?1:0,lm[20].y<lm[18].y?1:0];
  }

  function findMatchingLetter(fi){
    var keys=Object.keys(SIGN_ALPHA);
    for(var i=0;i<keys.length;i++){
      var s=SIGN_ALPHA[keys[i]],match=true;
      for(var j=0;j<5;j++){if(s.f[j]!==fi[j]){match=false;break}}
      if(match)return keys[i];
    }
    return null;
  }

  function buildPhrase(){
    var phrase=PHRASES[phraseIdx];
    var html='';
    for(var i=0;i<phrase.length;i++){
      if(phrase[i]===' '){
        html+='<span class="spell-char space" data-idx="'+i+'"></span>';
      }else{
        html+='<span class="spell-char" data-idx="'+i+'">'+phrase[i]+'</span>';
      }
    }
    document.getElementById('spellPhrase').innerHTML=html;
    charIdx=0;letterHold=0;
    updateSpellTarget();
  }

  function updateSpellTarget(){
    var phrase=PHRASES[phraseIdx];
    // Auto-skip spaces
    while(charIdx<phrase.length&&phrase[charIdx]===' ')charIdx++;

    if(charIdx>=phrase.length){
      // Phrase complete
      document.getElementById('spellGuide').innerHTML='<div style="font-size:24px;margin-bottom:4px">\u2728</div>';
      document.getElementById('spellStatus').textContent='Phrase complete!';
      document.getElementById('spellStatus').classList.add('matched');
      document.getElementById('signNextBtn').classList.add('visible');
      return;
    }

    var letter=phrase[charIdx];
    var sign=SIGN_ALPHA[letter];
    // Highlight current char
    var chars=document.querySelectorAll('.spell-char');
    chars.forEach(function(ch){
      var idx=parseInt(ch.dataset.idx);
      ch.classList.remove('active');
      if(idx===charIdx)ch.classList.add('active');
    });
    // Show finger guide
    var dots='';
    for(var i=0;i<5;i++){
      dots+='<div class="finger-dot'+(sign.f[i]?' up':'')+'"></div>';
    }
    document.getElementById('spellGuide').innerHTML=
      '<div class="spell-target">'+letter+'</div>'+
      '<div class="finger-dots">'+dots+'</div>'+
      '<div class="spell-hint-text">'+sign.hint+'</div>';

    document.getElementById('spellStatus').textContent='Waiting...';
    document.getElementById('spellStatus').classList.remove('matched');
    document.getElementById('signNextBtn').classList.remove('visible');
    letterHold=0;
  }

  document.getElementById('signNextBtn').addEventListener('click',function(){
    phraseIdx=(phraseIdx+1)%PHRASES.length;
    buildPhrase();
  });

  function onSignResults(r){
    var w=canvas.width,h=canvas.height;
    ctx.clearRect(0,0,w,h);
    ctx.drawImage(video,0,0,w,h);

    var hasHand=r.multiHandLandmarks&&r.multiHandLandmarks.length>0;
    var lm=hasHand?r.multiHandLandmarks[0]:null;

    if(!hasHand){
      document.getElementById('spellStatus').textContent='Show your hand...';
      letterHold=0;
      return;
    }

    // Draw hand skeleton
    var conns=[[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[0,9],[9,10],[10,11],[11,12],[0,13],[13,14],[14,15],[15,16],[0,17],[17,18],[18,19],[19,20],[5,9],[9,13],[13,17]];
    ctx.strokeStyle='rgba(78,205,128,.6)';ctx.lineWidth=2;ctx.lineCap='round';
    conns.forEach(function(c){
      ctx.beginPath();
      ctx.moveTo(lm[c[0]].x*w,lm[c[0]].y*h);
      ctx.lineTo(lm[c[1]].x*w,lm[c[1]].y*h);
      ctx.stroke();
    });
    lm.forEach(function(pt){
      ctx.beginPath();ctx.arc(pt.x*w,pt.y*h,3,0,Math.PI*2);
      ctx.fillStyle='rgba(78,205,128,.9)';ctx.fill();
    });

    var phrase=PHRASES[phraseIdx];
    if(charIdx>=phrase.length)return;

    var letter=phrase[charIdx];
    var target=SIGN_ALPHA[letter];
    var fi=getFingerState(lm);

    // Check match
    var match=true;
    for(var j=0;j<5;j++){if(target.f[j]!==fi[j]){match=false;break}}

    if(match){
      letterHold++;
      document.getElementById('spellStatus').textContent='Hold it...';
      if(letterHold>=12){
        // Mark letter done
        var chars=document.querySelectorAll('.spell-char');
        chars.forEach(function(ch){if(parseInt(ch.dataset.idx)===charIdx)ch.classList.add('done')});
        charIdx++;
        updateSpellTarget();
      }
    }else{
      letterHold=0;
      var detected=findMatchingLetter(fi);
      if(detected){
        document.getElementById('spellStatus').textContent='That\u2019s "'+detected+'" \u2014 try "'+letter+'"';
      }else{
        document.getElementById('spellStatus').textContent='Waiting...';
      }
    }
  }

  /* ════════════════════════════════
     KALEIDOSCOPE DRAW
     ════════════════════════════════ */
  var sketchCanvas=document.getElementById('sketchCanvas');
  var sCtx=sketchCanvas.getContext('2d');
  var kaleidGroups=[];  // each group = array of points for one user stroke
  var kaleidCurrent=null;
  var kaleidDrawing=false;
  var kaleidColor='#F472B6';
  var kaleidRainbow=false;

  sCtx.fillStyle='#111';
  sCtx.fillRect(0,0,sketchCanvas.width,sketchCanvas.height);

  // Color palette
  document.querySelectorAll('.kaleid-color').forEach(function(btn){
    btn.addEventListener('click',function(){
      document.querySelectorAll('.kaleid-color').forEach(function(b){b.classList.remove('active')});
      btn.classList.add('active');
      if(btn.dataset.color==='rainbow'){kaleidRainbow=true}
      else{kaleidRainbow=false;kaleidColor=btn.dataset.color}
    });
  });

  function getCanvasPos(e){
    var rect=sketchCanvas.getBoundingClientRect();
    var sx=sketchCanvas.width/rect.width,sy=sketchCanvas.height/rect.height;
    var cx,cy;
    if(e.touches){cx=e.touches[0].clientX;cy=e.touches[0].clientY}else{cx=e.clientX;cy=e.clientY}
    return{x:(cx-rect.left)*sx,y:(cy-rect.top)*sy};
  }

  function drawKaleidSegment(x1,y1,x2,y2,color){
    var cw=sketchCanvas.width,ch=sketchCanvas.height;
    var centerX=cw/2,centerY=ch/2;
    // Translate to center-relative coords
    var ax=x1-centerX,ay=y1-centerY;
    var bx=x2-centerX,by=y2-centerY;

    sCtx.strokeStyle=color;
    sCtx.lineWidth=2.5;
    sCtx.lineCap='round';
    sCtx.lineJoin='round';

    for(var i=0;i<8;i++){
      var angle=i*Math.PI/4;
      sCtx.save();
      sCtx.translate(centerX,centerY);
      sCtx.rotate(angle);
      // Draw original
      sCtx.beginPath();
      sCtx.moveTo(ax,ay);
      sCtx.lineTo(bx,by);
      sCtx.stroke();
      // Draw mirror
      sCtx.beginPath();
      sCtx.moveTo(-ax,ay);
      sCtx.lineTo(-bx,by);
      sCtx.stroke();
      sCtx.restore();
    }
  }

  function getKaleidColor(x,y){
    if(!kaleidRainbow)return kaleidColor;
    var cw=sketchCanvas.width,ch=sketchCanvas.height;
    var dx=x-cw/2,dy=y-ch/2;
    var dist=Math.sqrt(dx*dx+dy*dy);
    var hue=(dist*1.5)%360;
    return 'hsl('+hue+',85%,65%)';
  }

  function redrawKaleid(){
    sCtx.fillStyle='#111';
    sCtx.fillRect(0,0,sketchCanvas.width,sketchCanvas.height);
    kaleidGroups.forEach(function(group){
      for(var i=1;i<group.points.length;i++){
        var p1=group.points[i-1],p2=group.points[i];
        drawKaleidSegment(p1.x,p1.y,p2.x,p2.y,group.colors[i]||group.colors[0]);
      }
    });
  }

  function onKaleidStart(e){
    e.preventDefault();kaleidDrawing=true;
    var p=getCanvasPos(e);
    kaleidCurrent={points:[p],colors:[getKaleidColor(p.x,p.y)]};
  }

  function onKaleidMove(e){
    if(!kaleidDrawing)return;e.preventDefault();
    var p=getCanvasPos(e);
    var color=getKaleidColor(p.x,p.y);
    kaleidCurrent.points.push(p);
    kaleidCurrent.colors.push(color);
    var pts=kaleidCurrent.points;
    if(pts.length>=2){
      var prev=pts[pts.length-2],cur=pts[pts.length-1];
      drawKaleidSegment(prev.x,prev.y,cur.x,cur.y,color);
    }
  }

  function onKaleidEnd(){
    if(!kaleidDrawing)return;kaleidDrawing=false;
    if(kaleidCurrent&&kaleidCurrent.points.length>1)kaleidGroups.push(kaleidCurrent);
    kaleidCurrent=null;
  }

  sketchCanvas.addEventListener('mousedown',onKaleidStart);
  sketchCanvas.addEventListener('mousemove',onKaleidMove);
  sketchCanvas.addEventListener('mouseup',onKaleidEnd);
  sketchCanvas.addEventListener('mouseleave',onKaleidEnd);
  sketchCanvas.addEventListener('touchstart',onKaleidStart,{passive:false});
  sketchCanvas.addEventListener('touchmove',onKaleidMove,{passive:false});
  sketchCanvas.addEventListener('touchend',onKaleidEnd);

  document.getElementById('clearBtn').addEventListener('click',function(){
    kaleidGroups=[];
    sCtx.fillStyle='#111';sCtx.fillRect(0,0,sketchCanvas.width,sketchCanvas.height);
    document.getElementById('sketchLabel').textContent='Draw to create a mandala';
  });
  document.getElementById('undoBtn').addEventListener('click',function(){
    if(!kaleidGroups.length)return;kaleidGroups.pop();redrawKaleid();
  });

})();

/* ======================================
   MAGNETIC STICKERS
   ====================================== */
(function(){
  var stickers=document.querySelectorAll('.sticker');
  stickers.forEach(function(s){
    var strength=0.35;
    s.addEventListener('mousemove',function(e){
      var rect=s.getBoundingClientRect();
      var cx=rect.left+rect.width/2;
      var cy=rect.top+rect.height/2;
      var dx=(e.clientX-cx)*strength;
      var dy=(e.clientY-cy)*strength;
      s.style.transition='transform .15s ease';
      s.style.transform='translate('+dx+'px,'+dy+'px) '+s.dataset.rot;
    });
    s.addEventListener('mouseleave',function(){
      s.style.transition='transform .4s cubic-bezier(.19,1,.22,1)';
      s.style.transform='translate(0,0) '+s.dataset.rot;
    });
  });
})();

/* ======================================
   AUTO-OPEN DEMO FROM URL HASH
   ====================================== */
(function(){
  var hash=window.location.hash;
  if(hash==='#demo-hands'||hash==='#demo-face'){
    var mode=hash==='#demo-hands'?'hands':'face';
    var card=document.querySelector('.demo-card[data-mode="'+mode+'"]');
    if(card) setTimeout(function(){card.click()},600);
  }
})();
