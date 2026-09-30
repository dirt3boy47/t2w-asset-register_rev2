(function(root){
'use strict';

var S=root.T2W_SCHEDULE||null;
var ROWS=[
  'Trench','Pipe','Bends','Tees','Reducers','Thrust blocks','Valves','Trench stops','Bulkheads',
  'Major road crossing','Minor road crossing','Road crossing','Rail crossing','Creek crossing',
  'Vegetation clearing','Foreign services','Other assets'
];
var COLORS={
  'Trench':'#df3b2f','Pipe':'#172a79','Bends':'#f97316','Tees':'#f97316','Reducers':'#f97316',
  'Thrust blocks':'#7c3aed','Valves':'#ef4444','Trench stops':'#6d4aff','Bulkheads':'#8b5cf6',
  'Major road crossing':'#ef4444','Minor road crossing':'#f97316','Road crossing':'#d97706',
  'Rail crossing':'#8b5cf6','Creek crossing':'#3b82f6','Vegetation clearing':'#22a447',
  'Foreign services':'#64748b','Other assets':'#94a3b8'
};
var state={section:'ALL',zoom:220,query:'',selected:null,lastCount:-1};

function esc(v){ return String(v==null?'':v).replace(/[&<>\"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c];}); }
function dateMs(a){ if(!a) return 0; if(S&&S.dateOf){var d=S.dateOf(a.start); return d?d.getTime():0;} return 0; }
function niceDate(s){
  if(!s) return '';
  if(S&&S.dateOf){ var d=S.dateOf(s); if(d) return d.toLocaleDateString('en-AU',{timeZone:'UTC',day:'numeric',month:'short',year:'2-digit'}); }
  return s;
}
function sortActivities(items){
  return (items||[]).slice().sort(function(a,b){
    return dateMs(a)-dateMs(b) || String(a.sec).localeCompare(String(b.sec)) || (+a.from)-(+b.from) || String(a.activity).localeCompare(String(b.activity));
  });
}
function allActivities(){
  if(!S||!S.SCHEDULE) return [];
  var items=(S.SCHEDULE.PHW||[]).concat(S.SCHEDULE.PWG||[]);
  if(state.section!=='ALL') items=items.filter(function(a){return a.sec===state.section;});
  return sortActivities(items);
}
function chooseActivity(sec,ch,items){
  items=items||allActivities();
  var hits=items.filter(function(a){return a.sec===sec && ch>=a.from && ch<=a.to;});
  if(!hits.length) return null;
  return sortActivities(hits)[0];
}
function classifyText(text){
  text=String(text||'').toLowerCase();
  if(/trench\s*stop/.test(text)) return 'Trench stops';
  if(/bulkhead/.test(text)) return 'Bulkheads';
  if(/thrust/.test(text)) return 'Thrust blocks';
  if(/\bvalve\b|\bav\b|air valve|scour|washout/.test(text)) return 'Valves';
  if(/\breducer\b|reducer/.test(text)) return 'Reducers';
  if(/\btee\b|tee fitting|branch tee/.test(text)) return 'Tees';
  if(/\bbend\b|elbow/.test(text)) return 'Bends';
  if(/major.*road|highway/.test(text)) return 'Major road crossing';
  if(/minor.*road/.test(text)) return 'Minor road crossing';
  if(/rail/.test(text)) return 'Rail crossing';
  if(/creek|watercourse|river/.test(text)) return 'Creek crossing';
  if(/road.*cross|crossing.*road/.test(text)) return 'Road crossing';
  if(/vegetation|clearing/.test(text)) return 'Vegetation clearing';
  if(/foreign service|utility|services? crossing|power|telstra|nbn|gas main/.test(text)) return 'Foreign services';
  if(/trench/.test(text)) return 'Trench';
  if(/pipe|dicl|pipeline/.test(text)) return 'Pipe';
  return 'Other assets';
}
function getData(){
  try{ if(typeof D!=='undefined' && D && D.rows && D.C) return D; }catch(e){}
  return root.D&&root.D.rows?root.D:null;
}
function val(row,C,name){ var i=C&&C[name]; return i==null?'':row[i]; }
function assetText(row,C){
  return [val(row,C,'register'),val(row,C,'asset_type'),val(row,C,'asset_id'),val(row,C,'feature_name'),
    val(row,C,'utility_description'),val(row,C,'fitting_type'),val(row,C,'valve_type'),val(row,C,'comments')]
    .filter(Boolean).join(' ');
}
function activityKey(a){ return a.sec+'|'+a.activity+'|'+a.from+'|'+a.to+'|'+a.start; }
function blockWidth(a){
  var len=Math.max(1,(+a.to)-(+a.from));
  return Math.max(118,Math.min(760,(len/1000)*state.zoom));
}
function buildModel(){
  var data=getData(), activities=allActivities();
  var blocks=activities.map(function(a){return {a:a,key:activityKey(a),width:blockWidth(a),assets:[]};});
  var byKey={}; blocks.forEach(function(b){byKey[b.key]=b;});
  if(!data) return {data:null,blocks:blocks,unmapped:0,assetCount:0};
  var C=data.C, unmapped=0, assetCount=0;
  data.rows.forEach(function(r,k){
    var sec=String(val(r,C,'pipeline_section')||'').toUpperCase();
    if(sec!=='PHW'&&sec!=='PWG') return;
    if(state.section!=='ALL'&&sec!==state.section) return;
    var f=Number(val(r,C,'chainage_start_m')), t=Number(val(r,C,'chainage_end_m'));
    if(!isFinite(f)) return;
    if(!isFinite(t)) t=f;
    var mid=(f+t)/2;
    var act=chooseActivity(sec,mid,activities);
    if(!act){unmapped++;return;}
    var text=assetText(r,C), cat=classifyText(text);
    var id=val(r,C,'asset_id')||val(r,C,'record_key')||cat+' @ '+f;
    byKey[activityKey(act)].assets.push({k:k,row:r,sec:sec,from:f,to:t,mid:mid,cat:cat,id:String(id),text:text});
    assetCount++;
  });
  return {data:data,blocks:blocks,unmapped:unmapped,assetCount:assetCount};
}
function findAssets(model,q){
  q=String(q||'').trim().toLowerCase(); if(!q) return [];
  var out=[];
  model.blocks.forEach(function(b){ b.assets.forEach(function(x){
    if((x.id+' '+x.text+' '+x.sec+' '+x.from+' '+x.to).toLowerCase().indexOf(q)>=0) out.push({asset:x,block:b});
  });});
  return out.slice(0,40);
}
function shape(cat,x,y,w,title,k){
  var c=COLORS[cat]||'#94a3b8', attrs=' data-k="'+k+'" class="pcAsset" tabindex="0" role="button" aria-label="'+esc(title)+'"';
  if(cat==='Valves') return '<polygon points="'+x+','+(y-6)+' '+(x-5)+','+(y+4)+' '+(x+5)+','+(y+4)+'" fill="'+c+'"'+attrs+'><title>'+esc(title)+'</title></polygon>';
  if(cat==='Bends'||cat==='Tees'||cat==='Reducers') return '<circle cx="'+x+'" cy="'+y+'" r="4" fill="#fff" stroke="'+c+'" stroke-width="2"'+attrs+'><title>'+esc(title)+'</title></circle>';
  if(cat==='Creek crossing') return '<text x="'+x+'" y="'+(y+4)+'" text-anchor="middle" fill="'+c+'" font-size="12"'+attrs+'>~<title>'+esc(title)+'</title></text>';
  if(/crossing/.test(cat)) return '<text x="'+x+'" y="'+(y+4)+'" text-anchor="middle" fill="'+c+'" font-size="12" font-weight="700"'+attrs+'>×<title>'+esc(title)+'</title></text>';
  if(cat==='Vegetation clearing') return '<text x="'+x+'" y="'+(y+4)+'" text-anchor="middle" fill="'+c+'" font-size="10"'+attrs+'>♣<title>'+esc(title)+'</title></text>';
  if(cat==='Foreign services') return '<circle cx="'+x+'" cy="'+y+'" r="4" fill="none" stroke="'+c+'" stroke-width="1.7"'+attrs+'><title>'+esc(title)+'</title></circle>';
  return '<rect x="'+(x-Math.max(2,w/2))+'" y="'+(y-4)+'" width="'+Math.max(4,w)+'" height="8" rx="1" fill="'+c+'"'+attrs+'><title>'+esc(title)+'</title></rect>';
}
function render(){
  var host=document.getElementById('pcHost'); if(!host) return;
  var model=buildModel(), blocks=model.blocks;
  var labelW=128, headerH=78,rowH=22, footerH=18, height=headerH+ROWS.length*rowH+footerH;
  var total=blocks.reduce(function(s,b){return s+b.width;},0), svgW=labelW+total;
  var starts=[], x0=labelW;
  blocks.forEach(function(b){starts.push(x0);b.x=x0;x0+=b.width;});
  var svg=[];
  svg.push('<svg id="pcSvg" width="'+svgW+'" height="'+height+'" viewBox="0 0 '+svgW+' '+height+'" xmlns="http://www.w3.org/2000/svg">');
  svg.push('<rect width="'+svgW+'" height="'+height+'" fill="#fff"/>');
  svg.push('<rect x="0" y="0" width="'+labelW+'" height="'+height+'" fill="#fbfcfe"/>');
  ROWS.forEach(function(r,i){var y=headerH+i*rowH; svg.push('<line x1="0" y1="'+y+'" x2="'+svgW+'" y2="'+y+'" stroke="#e8edf4"/>'); svg.push('<text x="10" y="'+(y+15)+'" fill="#526173" font-size="10">'+esc(r)+'</text>');});
  blocks.forEach(function(b){
    var a=b.a,x=b.x,w=b.width,bg=a.sec==='PWG'?'#eef6ff':'#f5f1ff';
    svg.push('<rect x="'+x+'" y="0" width="'+w+'" height="'+headerH+'" fill="'+bg+'"/>');
    svg.push('<line x1="'+x+'" y1="0" x2="'+x+'" y2="'+height+'" stroke="#d5dce6"/>');
    svg.push('<text x="'+(x+7)+'" y="14" font-size="10.5" font-weight="700" fill="#223247">'+esc(a.sec+' '+a.activity)+' · '+esc(a.work)+'</text>');
    svg.push('<text x="'+(x+7)+'" y="30" font-size="10" fill="#0b6ea8" font-weight="600">'+esc(niceDate(a.start))+' → '+esc(niceDate(a.finish))+'</text>');
    svg.push('<text x="'+(x+7)+'" y="45" font-size="9.5" fill="#66768a">CH '+Math.round(a.from).toLocaleString('en-AU')+' → '+Math.round(a.to).toLocaleString('en-AU')+' m</text>');
    svg.push('<text x="'+(x+7)+'" y="60" font-size="9" fill="#8a96a5">Start '+esc(niceDate(a.start))+'</text>');
    svg.push('<text x="'+(x+w-7)+'" y="60" text-anchor="end" font-size="9" fill="#8a96a5">Finish '+esc(niceDate(a.finish))+'</text>');
    b.assets.forEach(function(as){
      var len=Math.max(1,a.to-a.from), rel=Math.max(0,Math.min(1,(as.mid-a.from)/len));
      var ax=x+Math.max(5,Math.min(w-5,rel*w));
      var rf=Math.max(a.from,Math.min(a.to,as.from)), rt=Math.max(a.from,Math.min(a.to,as.to));
      var aw=Math.max(3,Math.abs(rt-rf)/len*w);
      var yi=ROWS.indexOf(as.cat); if(yi<0) yi=ROWS.length-1;
      var ay=headerH+yi*rowH+rowH/2;
      var title=as.id+' · '+as.sec+' CH '+Math.round(as.from).toLocaleString('en-AU')+(as.to!==as.from?'–'+Math.round(as.to).toLocaleString('en-AU'):'')+' · '+niceDate(a.start)+' to '+niceDate(a.finish);
      svg.push(shape(as.cat,ax,ay,aw,title,as.k));
    });
  });
  svg.push('<line x1="'+svgW+'" y1="0" x2="'+svgW+'" y2="'+height+'" stroke="#d5dce6"/>');
  svg.push('</svg>');
  host.innerHTML=svg.join('');
  var meta=document.getElementById('pcMeta');
  if(meta){
    var first=blocks[0]&&blocks[0].a,last=blocks[blocks.length-1]&&blocks[blocks.length-1].a;
    meta.innerHTML='<b>'+model.assetCount.toLocaleString('en-AU')+'</b> mapped assets · <b>'+blocks.length+'</b> programme activities'+
      (first?' · <b>'+esc(niceDate(first.start))+'</b> to <b>'+esc(niceDate(last.finish))+'</b>':'')+
      (model.unmapped?' · '+model.unmapped+' assets outside a scheduled block':'');
  }
  renderOverview(model,total);
  bindAssets(model);
  state.lastCount=model.data?model.data.rows.length:-1;
}
function renderOverview(model,total){
  var ov=document.getElementById('pcOverview'); if(!ov) return;
  var w=Math.max(700,ov.clientWidth||1000), h=34, x=0;
  var html=['<svg width="100%" height="'+h+'" viewBox="0 0 '+w+' '+h+'" preserveAspectRatio="none">'];
  model.blocks.forEach(function(b){ var bw=total?b.width/total*w:0; html.push('<rect class="pcOvBlock" data-key="'+esc(b.key)+'" x="'+x.toFixed(1)+'" y="7" width="'+Math.max(1,bw).toFixed(1)+'" height="20" fill="'+(b.a.sec==='PWG'?'#8cc4f7':'#bba4f6')+'"><title>'+esc(b.a.sec+' '+b.a.activity+' · '+niceDate(b.a.start))+'</title></rect>'); x+=bw; });
  html.push('</svg>'); ov.innerHTML=html.join('');
  ov.querySelectorAll('.pcOvBlock').forEach(function(r){r.addEventListener('click',function(){var key=r.getAttribute('data-key'),b=model.blocks.find(function(x){return x.key===key;}); if(b) scrollToBlock(b);});});
}
function bindAssets(model){
  var svg=document.getElementById('pcSvg'); if(!svg) return;
  svg.querySelectorAll('.pcAsset').forEach(function(n){
    function go(){ var k=+n.getAttribute('data-k'); var found=null,block=null; model.blocks.some(function(b){return b.assets.some(function(a){if(a.k===k){found=a;block=b;return true;}return false;});}); if(found) selectAsset(found,block); }
    n.addEventListener('click',go); n.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}});
  });
}
function selectAsset(a,b){
  state.selected=a.k;
  var info=document.getElementById('pcHover'); if(info){info.innerHTML='<b>'+esc(a.id)+'</b> · '+esc(a.cat)+' · '+esc(a.sec)+' CH '+Math.round(a.from).toLocaleString('en-AU')+(a.to!==a.from?'–'+Math.round(a.to).toLocaleString('en-AU'):'')+' m · <b>'+esc(niceDate(b.a.start))+' → '+esc(niceDate(b.a.finish))+'</b> · Activity '+esc(b.a.activity);}
  try{ if(typeof openDrawer==='function') openDrawer(a.k); }catch(e){}
}
function scrollToBlock(b){ var wrap=document.getElementById('pcScroll'); if(!wrap||!b)return; wrap.scrollTo({left:Math.max(0,b.x-150),behavior:'smooth'}); }
function doSearch(){
  var model=buildModel(), input=document.getElementById('pcSearch'), q=input?input.value:'';
  state.query=q; var hits=findAssets(model,q), box=document.getElementById('pcResults');
  if(!box) return;
  if(!q){box.innerHTML='';box.classList.remove('on');return;}
  if(!hits.length){box.innerHTML='<div class="pcNo">No matching asset in the scheduled alignment.</div>';box.classList.add('on');return;}
  box.innerHTML=hits.slice(0,12).map(function(h){return '<button type="button" data-k="'+h.asset.k+'"><b>'+esc(h.asset.id)+'</b><span>'+esc(h.asset.sec)+' CH '+Math.round(h.asset.from).toLocaleString('en-AU')+' · '+esc(niceDate(h.block.a.start))+' · Activity '+esc(h.block.a.activity)+'</span></button>';}).join('');
  box.classList.add('on');
  box.querySelectorAll('button').forEach(function(btn){btn.addEventListener('click',function(){var k=+btn.getAttribute('data-k'),hit=hits.find(function(h){return h.asset.k===k;}); if(!hit)return; scrollToBlock(hit.block); selectAsset(hit.asset,hit.block); box.classList.remove('on');});});
}
function addCss(){
  if(document.getElementById('pcCss')) return;
  var st=document.createElement('style'); st.id='pcCss'; st.textContent=`
#schedBtn,#schedPop{display:none!important}
#tab-program-chainage{display:none}
.pcTop{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:12px}
.pcTitle{flex:1;min-width:260px}.pcTitle h2{font-size:18px;color:var(--navy);margin:0}.pcTitle p{margin:3px 0 0;color:var(--mid);font-size:12px}
.pcCtl{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.pcCtl button,.pcCtl select,.pcCtl input{border:1px solid #c3ccd7;background:#fff;border-radius:6px;padding:8px 10px;font-size:12px}.pcCtl button{cursor:pointer}.pcCtl button.on{background:var(--accent);border-color:var(--accent);color:#fff}
.pcSearchWrap{position:relative;min-width:280px}.pcSearchWrap input{width:100%}.pcResults{display:none;position:absolute;left:0;right:0;top:calc(100% + 4px);background:#fff;border:1px solid #c3ccd7;border-radius:7px;box-shadow:0 8px 24px rgba(18,38,63,.18);z-index:75;max-height:320px;overflow:auto}.pcResults.on{display:block}.pcResults button{display:block;width:100%;text-align:left;border:0;border-bottom:1px solid #edf0f4;background:#fff;padding:8px 10px;cursor:pointer}.pcResults button:hover{background:var(--accent-w)}.pcResults button b{display:block;font-family:ui-monospace,Menlo,monospace;font-size:11.5px}.pcResults button span,.pcNo{display:block;color:var(--mid);font-size:10.5px;margin-top:2px}.pcNo{padding:10px}
.pcMeta{font-size:11.5px;color:var(--mid);margin:0 0 8px}.pcMeta b{color:var(--ink)}
.pcHover{min-height:34px;padding:8px 10px;border:1px solid #d9e2ec;border-radius:7px;background:#f8fbfe;font-size:11.5px;color:#516174;margin-bottom:8px}.pcHover b{color:var(--ink)}
.pcPanel{background:#fff;border:1px solid var(--line);border-radius:9px;overflow:hidden}.pcScroll{overflow:auto;max-width:100%;background:#fff}.pcScroll svg{display:block}.pcAsset{cursor:pointer}.pcAsset:hover{filter:brightness(.75);stroke:#111;stroke-width:1.5}
.pcOverviewWrap{border-top:1px solid var(--line);padding:7px 10px;background:#fafbfe}.pcOverviewLabel{font-size:10px;color:var(--mid);margin-bottom:2px}.pcOverview svg{display:block}.pcOvBlock{cursor:pointer}.pcOvBlock:hover{opacity:.7}
.pcLegend{display:flex;gap:10px;flex-wrap:wrap;padding:8px 10px;border-top:1px solid var(--line);font-size:10.5px;color:var(--mid)}.pcLegend i{display:inline-block;width:9px;height:9px;border-radius:2px;margin-right:4px;vertical-align:-1px}
.pcZoom{display:flex;align-items:center;gap:6px;color:var(--mid);font-size:11px}.pcZoom input{width:130px;padding:0;border:0}
@media(max-width:760px){.pcSearchWrap{min-width:100%;width:100%}.pcCtl{width:100%}.pcZoom input{width:95px}}
`;
  document.head.appendChild(st);
}
function install(){
  if(document.getElementById('pcTabBtn')) return true;
  var nav=document.querySelector('nav.tabs'), main=document.querySelector('main'); if(!nav||!main||!S) return false;
  addCss();
  var btn=document.createElement('button'); btn.type='button';btn.id='pcTabBtn';btn.dataset.tab='program-chainage';btn.textContent='Chainage';
  var costs=nav.querySelector('button[data-tab="costs"]'); nav.insertBefore(btn,costs||null);
  var tab=document.createElement('section'); tab.id='tab-program-chainage';
  tab.innerHTML='<div class="pcTop"><div class="pcTitle"><h2>Programme chainage</h2><p>Interactive asset alignment reordered into construction programme sequence. Dates come from the Rev B baseline.</p></div><div class="pcCtl"><button type="button" data-sec="ALL" class="on">All</button><button type="button" data-sec="PHW">PHW</button><button type="button" data-sec="PWG">PWG</button><div class="pcSearchWrap"><input id="pcSearch" type="text" placeholder="Search asset ID, valve, crossing, chainage…" autocomplete="off"><div id="pcResults" class="pcResults"></div></div><div class="pcZoom">Zoom <input id="pcZoom" type="range" min="90" max="420" step="10" value="220"><span id="pcZoomVal">220 px/km</span></div></div></div><div id="pcMeta" class="pcMeta"></div><div id="pcHover" class="pcHover">Click an asset to see its chainage, programme activity and scheduled start/finish dates.</div><div class="pcPanel"><div id="pcScroll" class="pcScroll"><div id="pcHost"></div></div><div class="pcOverviewWrap"><div class="pcOverviewLabel">Programme overview · click a block to jump to that scheduled activity</div><div id="pcOverview" class="pcOverview"></div></div><div id="pcLegend" class="pcLegend"></div></div>';
  main.insertBefore(tab,main.firstChild);
  var legend=document.getElementById('pcLegend'); legend.innerHTML=ROWS.map(function(r){return '<span><i style="background:'+COLORS[r]+'"></i>'+esc(r)+'</span>';}).join('');

  function show(){
    ['search','costs','eod','plr','reports','drawings','quality','about'].forEach(function(t){var e=document.getElementById('tab-'+t);if(e)e.style.display='none';});
    tab.style.display='';
    nav.querySelectorAll('button').forEach(function(b){b.classList.toggle('on',b===btn);});
    render();
  }
  btn.addEventListener('click',show);
  nav.addEventListener('click',function(e){var b=e.target.closest('button');if(b&&b!==btn)tab.style.display='none';},true);
  tab.querySelectorAll('button[data-sec]').forEach(function(b){b.addEventListener('click',function(){state.section=b.dataset.sec;tab.querySelectorAll('button[data-sec]').forEach(function(x){x.classList.toggle('on',x===b);});render();});});
  var search=document.getElementById('pcSearch'); search.addEventListener('input',function(){clearTimeout(root._pcSearch);root._pcSearch=setTimeout(doSearch,120);}); search.addEventListener('keydown',function(e){if(e.key==='Enter')doSearch();});
  var zoom=document.getElementById('pcZoom'); zoom.addEventListener('input',function(){state.zoom=+zoom.value;document.getElementById('pcZoomVal').textContent=state.zoom+' px/km';clearTimeout(root._pcZoom);root._pcZoom=setTimeout(render,80);});
  window.addEventListener('resize',function(){clearTimeout(root._pcResize);root._pcResize=setTimeout(function(){if(tab.style.display!=='none')render();},160);});
  return true;
}
function boot(){
  if(install()) return;
  var n=0,t=setInterval(function(){n++;if(install()||n>80)clearInterval(t);},125);
}

var API={ROWS:ROWS,COLORS:COLORS,sortActivities:sortActivities,chooseActivity:chooseActivity,classifyText:classifyText,buildModel:buildModel,findAssets:findAssets,render:render};
root.T2W_PROGRAM_CHAINAGE=API;
if(typeof document==='undefined') return;
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})(typeof globalThis!=='undefined'?globalThis:this);
