(function(){
'use strict';

function q(s,r){ return (r||document).querySelector(s); }

function addCss(){
  if(q('#scheduleMenuCss')) return;
  var st=document.createElement('style');
  st.id='scheduleMenuCss';
  st.textContent=`
/* Chainage dropdown */
#chainageMenuRow{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:5px}
#chainageMenuRow>label{margin:0!important;flex:1}
#chainageMenuWrap{position:relative;flex:none}
#chainageMenuTrigger{width:34px;height:30px;display:flex;align-items:center;justify-content:center;gap:2px;border:1px solid #c3ccd7;border-radius:6px;background:#fff;color:var(--navy);cursor:pointer;padding:0}
#chainageMenuTrigger:hover,#chainageMenuTrigger.on{border-color:var(--accent);color:var(--accent);background:var(--accent-w)}
#chainageMenuTrigger svg{width:18px;height:18px;display:block;stroke:currentColor;fill:none;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
#chainageMenuTrigger .chev{font-size:8px;line-height:1;margin-left:-1px}
#chainageMenuDrop{display:none;position:absolute;right:0;top:calc(100% + 5px);min-width:248px;background:#fff;border:1px solid #bac5d2;border-radius:8px;box-shadow:0 10px 28px rgba(18,38,63,.22);padding:5px;z-index:78}
#chainageMenuDrop.on{display:block}
#chainageMenuDrop:before{content:'CHAINAGE';display:block;padding:5px 8px 4px;font-size:9.5px;font-weight:700;letter-spacing:.6px;color:var(--mid)}
#chainageMenuDrop #schedBtn{margin:0!important;width:100%!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:10px!important;background:#fff!important;border:0!important;border-radius:6px!important;padding:10px 10px!important;cursor:pointer!important;font-size:12.5px!important;color:var(--ink)!important;text-align:left!important}
#chainageMenuDrop #schedBtn:hover,#chainageMenuDrop #schedBtn.on{background:var(--accent-w)!important;color:var(--accent)!important}
#chainageMenuDrop #schedBtn b{font-size:12.5px!important;font-weight:600}
#chainageMenuDrop #schedBtn i{font-style:normal!important;font-size:9px!important;color:var(--mid)}

/* The top navigation was intentionally compact in index.html. Restore a normal sized menu. */
nav.tabs{min-height:46px;align-items:stretch;gap:3px;padding:0 12px}
nav.tabs button{display:flex;align-items:center;padding:12px 16px 10px;font-size:13.5px;line-height:1.25}

@media(max-width:760px){
  nav.tabs{min-height:43px;padding:0 7px}
  nav.tabs button{padding:11px 13px 9px;font-size:13px}
  #chainageMenuDrop{left:0;right:auto;min-width:235px}
}
`;
  document.head.appendChild(st);
}

function install(){
  var sched=q('#schedBtn');
  var label=q('label[for="chFrom"]');
  var pop=q('#schedPop');
  if(!sched||!label||!pop) return false;
  if(q('#chainageMenuWrap')) return true;

  addCss();

  var parent=label.parentElement;
  var row=document.createElement('div');
  row.id='chainageMenuRow';
  parent.insertBefore(row,label);
  row.appendChild(label);

  var wrap=document.createElement('div');
  wrap.id='chainageMenuWrap';
  row.appendChild(wrap);

  var trigger=document.createElement('button');
  trigger.type='button';
  trigger.id='chainageMenuTrigger';
  trigger.setAttribute('aria-label','Chainage menu');
  trigger.setAttribute('aria-haspopup','menu');
  trigger.setAttribute('aria-expanded','false');
  trigger.title='Chainage menu';
  trigger.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8.5h16v7H4z"></path><path d="M7 8.5v3M10 8.5v2M13 8.5v3M16 8.5v2"></path></svg><span class="chev">▼</span>';
  wrap.appendChild(trigger);

  var drop=document.createElement('div');
  drop.id='chainageMenuDrop';
  drop.setAttribute('role','menu');
  wrap.appendChild(drop);
  drop.appendChild(sched);

  sched.setAttribute('role','menuitem');
  sched.setAttribute('aria-label','Schedule and March chart');

  function menuOpen(v){
    drop.classList.toggle('on',!!v);
    trigger.classList.toggle('on',!!v);
    trigger.setAttribute('aria-expanded',v?'true':'false');
    q('.chev',trigger).textContent=v?'▲':'▼';
  }
  function scheduleOpen(){ return pop.classList.contains('on'); }

  trigger.addEventListener('click',function(e){
    e.preventDefault();
    e.stopPropagation();
    if(scheduleOpen()){
      sched.click();
      menuOpen(false);
      return;
    }
    menuOpen(!drop.classList.contains('on'));
  });

  sched.addEventListener('click',function(){
    setTimeout(function(){ menuOpen(scheduleOpen()); },0);
  });

  var mo=new MutationObserver(function(){
    if(scheduleOpen()) menuOpen(true);
    else menuOpen(false);
  });
  mo.observe(pop,{attributes:true,attributeFilter:['class']});

  document.addEventListener('click',function(e){
    if(!wrap.contains(e.target) && !pop.contains(e.target) && !scheduleOpen()) menuOpen(false);
  });

  document.addEventListener('keydown',function(e){
    if(e.key==='Escape' && !scheduleOpen()) menuOpen(false);
  });

  return true;
}

function boot(){
  if(install()) return;
  var n=0;
  var t=setInterval(function(){
    n++;
    if(install()||n>80) clearInterval(t);
  },125);
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot);
else boot();
})();
