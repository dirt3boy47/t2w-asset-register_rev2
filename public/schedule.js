(function(root){
'use strict';

var PRINTED='2026-09-30';
var RANGE={PHW:19157,PWG:27012};
var RAW={
PHW:`1300|Special Crossing|19120|19157|23-Feb-27|23-Feb-27|07-Feb-27|13-Sep-26|10-May-26
1130|Special Crossing|11509|11750|24-Feb-27|08-Mar-27|07-Feb-27|13-Sep-26|10-May-26
1450|Special Crossing|6477|6480|09-Mar-27|11-Mar-27|07-Feb-27|13-Sep-26|10-May-26
1450|Special Crossing|6365|6393|09-Mar-27|11-Mar-27|07-Feb-27|13-Sep-26|10-May-26
1082|Special Crossing|6120|6160|12-Mar-27|15-Mar-27|07-Feb-27|13-Sep-26|10-May-26
1081|Special Crossing|5490|6120|16-Mar-27|19-Apr-27|07-Feb-27|13-Sep-26|10-May-26
1274|Open Cut|18075|19120|06-Apr-27|26-Apr-27|07-Mar-27|11-Oct-26|07-Jun-26
1080|Special Crossing|4880|5490|20-Apr-27|18-May-27|07-Mar-27|11-Oct-26|07-Jun-26
1273|Open Cut|16956|18075|27-Apr-27|27-May-27|07-Apr-27|11-Nov-26|08-Jul-26
1061|Special Crossing|1735|1788|20-May-27|01-Jun-27|07-Apr-27|11-Nov-26|08-Jul-26
1272|Open Cut|15784|16956|28-May-27|18-Jun-27|07-May-27|11-Dec-26|07-Aug-26
1060|Special Crossing|1256|1735|02-Jun-27|22-Jun-27|07-May-27|11-Dec-26|07-Aug-26
1271|Open Cut|15762|15784|21-Jun-27|21-Jun-27|07-Jun-27|11-Jan-27|07-Sep-26
1270|Open Cut|14840|15762|22-Jun-27|05-Jul-27|07-Jun-27|11-Jan-27|07-Sep-26
1360|Trenchless|14806|14840|22-Jun-27|24-Jun-27|07-Jun-27|11-Jan-27|07-Sep-26
1050|Special Crossing|405|1233|23-Jun-27|27-Jul-27|07-Jun-27|11-Jan-27|07-Sep-26
1410|Trenchless|13275|13346|26-Jun-27|02-Jul-27|07-Jun-27|11-Jan-27|07-Sep-26
1400|Trenchless|11427|11509|03-Jul-27|10-Jul-27|07-Jun-27|11-Jan-27|07-Sep-26
1111|Open Cut|14120|14806|06-Jul-27|16-Jul-27|07-Jun-27|11-Jan-27|07-Sep-26
1390|Trenchless|10582|10645|11-Jul-27|25-Jul-27|07-Jun-27|11-Jan-27|07-Sep-26
1110|Open Cut|13346|14120|19-Jul-27|30-Jul-27|07-Jun-27|11-Jan-27|07-Sep-26
1380|Trenchless|6980|7035|26-Jul-27|31-Jul-27|07-Jul-27|10-Feb-27|07-Oct-26
1030|Special Crossing|0|333|28-Jul-27|12-Aug-27|07-Jul-27|10-Feb-27|07-Oct-26
1460|Trenchless|4417|4455|01-Aug-27|05-Aug-27|07-Jul-27|10-Feb-27|07-Oct-26
1101|Open Cut|12441|13275|02-Aug-27|16-Aug-27|07-Jul-27|10-Feb-27|07-Oct-26
1370|Trenchless|2039|2110|06-Aug-27|19-Aug-27|07-Jul-27|10-Feb-27|07-Oct-26
1100|Open Cut|11750|12441|17-Aug-27|25-Aug-27|07-Jul-27|10-Feb-27|07-Oct-26
1440|Trenchless|1233|1256|21-Aug-27|22-Aug-27|07-Aug-27|13-Mar-27|07-Nov-26
1420|Trenchless|333|405|23-Aug-27|29-Aug-27|07-Aug-27|13-Mar-27|07-Nov-26
1091|Open Cut|11168|11427|26-Aug-27|31-Aug-27|07-Aug-27|13-Mar-27|07-Nov-26
1090|Open Cut|10645|11168|01-Sep-27|10-Sep-27|07-Aug-27|13-Mar-27|07-Nov-26
1073|Open Cut|10349|10582|13-Sep-27|17-Sep-27|07-Aug-27|13-Mar-27|07-Nov-26
1072|Open Cut|9802|10349|20-Sep-27|28-Sep-27|07-Aug-27|13-Mar-27|07-Nov-26
1071|Open Cut|7832|9802|29-Sep-27|12-Nov-27|07-Sep-27|13-Apr-27|08-Dec-26
1070|Open Cut|7035|7832|15-Nov-27|24-Nov-27|07-Oct-27|13-May-27|07-Jan-27
1040|Open Cut|6480|6980|25-Nov-27|06-Dec-27|07-Nov-27|13-Jun-27|07-Feb-27
1020|Open Cut|6393|6477|07-Dec-27|07-Dec-27|07-Nov-27|13-Jun-27|07-Feb-27
1250|Open Cut|6160|6365|09-Dec-27|13-Dec-27|07-Nov-27|13-Jun-27|07-Feb-27
1010|Open Cut|4455|4880|15-Dec-27|04-Jan-28|07-Nov-27|13-Jun-27|07-Feb-27
1223|Open Cut|4120|4417|05-Jan-28|13-Jan-28|07-Dec-27|13-Jul-27|09-Mar-27
1222|Open Cut|3453|4120|14-Jan-28|25-Jan-28|07-Dec-27|13-Jul-27|09-Mar-27
1221|Open Cut|2846|3453|27-Jan-28|03-Feb-28|07-Jan-28|13-Aug-27|09-Apr-27
1220|Open Cut|2110|2846|04-Feb-28|18-Feb-28|07-Jan-28|13-Aug-27|09-Apr-27
1000|Open Cut|1788|2039|21-Feb-28|25-Feb-28|07-Feb-28|13-Sep-27|10-May-27`,
PWG:`1240|Open Cut|26283|27012|22-Feb-27|11-Mar-27|07-Feb-27|13-Sep-26|10-May-26
1106|Open Cut|26094|26252|12-Mar-27|12-Mar-27|07-Feb-27|13-Sep-26|10-May-26
1105|Open Cut|26010|26094|15-Mar-27|16-Mar-27|07-Feb-27|13-Sep-26|10-May-26
1104|Open Cut|25757|26010|18-Mar-27|22-Mar-27|07-Feb-27|13-Sep-26|10-May-26
1103|Open Cut|25376|25757|23-Mar-27|26-Mar-27|07-Mar-27|11-Oct-26|07-Jun-26
1291|Special Crossing|18025|18151|26-Mar-27|02-Apr-27|07-Mar-27|11-Oct-26|07-Jun-26
1102|Open Cut|24044|25376|30-Mar-27|14-May-27|07-Mar-27|11-Oct-26|07-Jun-26
1232|Special Crossing|14254|14525|05-Apr-27|15-Apr-27|07-Mar-27|11-Oct-26|07-Jun-26
1231|Special Crossing|14076|14254|16-Apr-27|22-Apr-27|07-Mar-27|11-Oct-26|07-Jun-26
1141|Special Crossing|8542|8706|23-Apr-27|28-Apr-27|07-Apr-27|11-Nov-26|08-Jul-26
1500|Trenchless|26252|26283|26-Apr-27|28-Apr-27|07-Apr-27|11-Nov-26|08-Jul-26
1490|Trenchless|18151|18167|29-Apr-27|01-May-27|07-Apr-27|11-Nov-26|08-Jul-26
1131|Special Crossing|8401|8487|29-Apr-27|30-Apr-27|07-Apr-27|11-Nov-26|08-Jul-26
1480|Trenchless|14525|14572|02-May-27|07-May-27|07-Apr-27|11-Nov-26|08-Jul-26
1121|Special Crossing|8315|8336|03-May-27|03-May-27|07-Apr-27|11-Nov-26|08-Jul-26
1083|Special Crossing|7941|8294|04-May-27|14-May-27|07-Apr-27|11-Nov-26|08-Jul-26
1540|Trenchless|13218|13247|08-May-27|10-May-27|07-Apr-27|11-Nov-26|08-Jul-26
1530|Trenchless|12702|12735|11-May-27|14-May-27|07-Apr-27|11-Nov-26|08-Jul-26
1470|Trenchless|8487|8542|15-May-27|27-May-27|07-Apr-27|11-Nov-26|08-Jul-26
1101|Open Cut|21324|24044|17-May-27|17-Jun-27|07-Apr-27|11-Nov-26|08-Jul-26
1082|Special Crossing|7641|7941|17-May-27|25-May-27|07-Apr-27|11-Nov-26|08-Jul-26
1081|Special Crossing|7582|7641|26-May-27|27-May-27|07-May-27|11-Dec-26|07-Aug-26
1440|Trenchless|8336|8401|28-May-27|03-Jun-27|07-May-27|11-Dec-26|07-Aug-26
1351|Special Crossing|5448|5475|28-May-27|28-May-27|07-May-27|11-Dec-26|07-Aug-26
1347|Special Crossing|2797|2865|31-May-27|02-Jun-27|07-May-27|11-Dec-26|07-Aug-26
1346|Special Crossing|2773|2797|03-Jun-27|03-Jun-27|07-May-27|11-Dec-26|07-Aug-26
1430|Trenchless|8294|8315|04-Jun-27|05-Jun-27|07-May-27|11-Dec-26|07-Aug-26
1345|Special Crossing|2632|2773|04-Jun-27|14-Jun-27|07-May-27|11-Dec-26|07-Aug-26
1420|Trenchless|7548|7582|06-Jun-27|10-Jun-27|07-May-27|11-Dec-26|07-Aug-26
1400|Trenchless|2865|2909|11-Jun-27|21-Jun-27|07-May-27|11-Dec-26|07-Aug-26
1344|Special Crossing|2511|2632|15-Jun-27|22-Jun-27|07-May-27|11-Dec-26|07-Aug-26
1100|Open Cut|18167|21324|18-Jun-27|20-Jul-27|07-May-27|11-Dec-26|07-Aug-26
1343|Special Crossing|2049|2511|23-Jun-27|21-Jul-27|07-Jun-27|11-Jan-27|07-Sep-26
1092|Open Cut|16975|18025|21-Jul-27|30-Jul-27|07-Jul-27|10-Feb-27|07-Oct-26
1342|Special Crossing|1885|2049|22-Jul-27|30-Jul-27|07-Jul-27|10-Feb-27|07-Oct-26
1091|Open Cut|16404|16975|02-Aug-27|06-Aug-27|07-Jul-27|10-Feb-27|07-Oct-26
1341|Special Crossing|1833|1885|02-Aug-27|03-Aug-27|07-Jul-27|10-Feb-27|07-Oct-26
1041|Special Crossing|0|31|04-Aug-27|05-Aug-27|07-Jul-27|10-Feb-27|07-Oct-26
1090|Open Cut|14572|16404|09-Aug-27|01-Sep-27|07-Jul-27|10-Feb-27|07-Oct-26
1030|Open Cut|13247|14076|02-Sep-27|13-Sep-27|07-Aug-27|13-Mar-27|07-Nov-26
1381|Open Cut|3992|5448|14-Sep-27|24-Sep-27|07-Aug-27|13-Mar-27|07-Nov-26
1380|Open Cut|2909|3992|27-Sep-27|11-Oct-27|07-Sep-27|13-Apr-27|08-Dec-26
1391|Open Cut|6532|7548|12-Oct-27|01-Nov-27|07-Sep-27|13-Apr-27|08-Dec-26
1390|Open Cut|5475|6532|02-Nov-27|12-Nov-27|07-Oct-27|13-May-27|07-Jan-27
1003|Open Cut|12315|12702|15-Nov-27|22-Nov-27|07-Oct-27|13-May-27|07-Jan-27
1002|Open Cut|12301|12315|23-Nov-27|23-Nov-27|07-Nov-27|13-Jun-27|07-Feb-27
1001|Open Cut|10852|12301|24-Nov-27|10-Dec-27|07-Nov-27|13-Jun-27|07-Feb-27
1000|Open Cut|8706|10852|13-Dec-27|24-Jan-28|07-Nov-27|13-Jun-27|07-Feb-27
1020|Open Cut|12735|13218|25-Jan-28|28-Jan-28|07-Jan-28|13-Aug-27|09-Apr-27
1371|Open Cut|1471|1833|31-Jan-28|02-Feb-28|07-Jan-28|13-Aug-27|09-Apr-27
1370|Open Cut|31|1471|03-Feb-28|25-Feb-28|07-Jan-28|13-Aug-27|09-Apr-27`
};
var HYDRO={
  PHW:[{name:'Hydrotest TS1',start:'28-Feb-28',finish:'07-Mar-28'},{name:'Hydrotest TS2',start:'08-Mar-28',finish:'14-Mar-28'}],
  PWG:[{name:'Hydrotest',start:'15-Mar-28',finish:'21-Mar-28'}]
};
var MON={Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};
function dateOf(s){
  var p=String(s||'').split('-'); if(p.length!==3) return null;
  var y=2000+Number(p[2]), m=MON[p[1]], d=Number(p[0]);
  if(m==null||!d) return null; return new Date(Date.UTC(y,m,d));
}
function iso(s){ var d=dateOf(s); return d?d.toISOString().slice(0,10):''; }
function au(s){ var d=dateOf(s); return d?d.toLocaleDateString('en-AU',{timeZone:'UTC',day:'2-digit',month:'short',year:'numeric'}):s; }
function parse(raw,sec){
  return raw.trim().split(/\n/).map(function(line){
    var p=line.split('|');
    return {sec:sec,activity:p[0],code:sec+'-DICL-'+p[0],work:p[1],from:+p[2],to:+p[3],
      start:p[4],finish:p[5],drop:p[6],order21:p[7],order39:p[8],
      startISO:iso(p[4]),finishISO:iso(p[5])};
  });
}
var SCHEDULE={PHW:parse(RAW.PHW,'PHW'),PWG:parse(RAW.PWG,'PWG')};
function normRange(a,b){
  a=Number(a); b=(b==null||b==='')?a:Number(b);
  if(!isFinite(a)||!isFinite(b)) return null;
  return a<=b?[a,b]:[b,a];
}
function overlaps(a0,a1,b0,b1){ return a0<=b1+1e-9 && a1+1e-9>=b0; }
function scheduleHits(sec,from,to){
  sec=String(sec||'').toUpperCase(); var rg=normRange(from,to); if(!rg||!SCHEDULE[sec]) return [];
  return SCHEDULE[sec].filter(function(x){ return overlaps(x.from,x.to,rg[0],rg[1]); })
    .slice().sort(function(a,b){ return a.startISO.localeCompare(b.startISO)||a.from-b.from; });
}
function col(C,n){ return C&&C[n]!=null?C[n]:null; }
function assetLabel(r,C){
  var aid=col(C,'asset_id'), key=col(C,'record_key'), feat=col(C,'feature_name'), typ=col(C,'asset_type');
  return String((aid!=null&&r[aid])||(key!=null&&r[key])||(feat!=null&&r[feat])||(typ!=null&&r[typ])||'Asset');
}
function assetText(r,C){
  var names=['asset_id','record_key','feature_name','asset_type','register','utility_description','fitting_type','valve_type','comments'];
  return names.map(function(n){ var i=col(C,n); return i==null?'':String(r[i]||''); }).join(' ').toLowerCase();
}
function assetRecord(r,C){
  var s=col(C,'chainage_start_m'), e=col(C,'chainage_end_m'), sec=col(C,'pipeline_section'), typ=col(C,'asset_type'), reg=col(C,'register'), key=col(C,'record_key'), aid=col(C,'asset_id'), feat=col(C,'feature_name');
  return {row:r,label:assetLabel(r,C),id:String((aid!=null&&r[aid])||(key!=null&&r[key])||''),
    key:String(key!=null?(r[key]||''):''),sec:String(sec!=null?(r[sec]||''):''),
    from:s!=null&&typeof r[s]==='number'?r[s]:Number(r[s]),
    to:e!=null&&r[e]!=null&&r[e]!==''?Number(r[e]):null,
    type:String(typ!=null?(r[typ]||''):''),reg:String(reg!=null?(r[reg]||''):''),feature:String(feat!=null?(r[feat]||''):'')};
}
function findAssets(query,D,limit){
  query=String(query||'').trim().toLowerCase(); limit=limit||8;
  if(!query||!D||!D.C||!Array.isArray(D.rows)) return [];
  var C=D.C, exact=[], starts=[], rest=[];
  D.rows.forEach(function(r){
    var a=assetRecord(r,C); if(!isFinite(a.from)||(a.sec!=='PHW'&&a.sec!=='PWG')) return;
    var lbl=a.label.toLowerCase(), id=a.id.toLowerCase(), key=a.key.toLowerCase(), text=assetText(r,C);
    if(id===query||key===query||lbl===query) exact.push(a);
    else if(id.indexOf(query)===0||key.indexOf(query)===0||lbl.indexOf(query)===0) starts.push(a);
    else if(text.indexOf(query)>=0) rest.push(a);
  });
  return exact.concat(starts,rest).slice(0,limit);
}
function duePast(s){ var d=iso(s); return !!d && d<PRINTED; }
function esc(x){ return String(x==null?'':x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function m(v){ return Number(v).toLocaleString('en-AU',{maximumFractionDigits:3}); }

var API={PRINTED:PRINTED,RANGE:RANGE,SCHEDULE:SCHEDULE,HYDRO:HYDRO,dateOf:dateOf,iso:iso,au:au,
  scheduleHits:scheduleHits,findAssets:findAssets,assetRecord:assetRecord};
root.T2W_SCHEDULE=API;

if(typeof document==='undefined') return;

var state={open:false,selected:null,matches:[]};
var q=function(s){ return document.querySelector(s); };
function css(){
  if(q('#schedCss')) return;
  var st=document.createElement('style'); st.id='schedCss'; st.textContent=`
#schedBtn{margin-top:7px;width:100%;display:flex;align-items:center;justify-content:space-between;gap:8px;background:#fff;border:1px solid #c3ccd7;border-radius:6px;padding:7px 10px;cursor:pointer;font-size:12px;color:var(--navy)}
#schedBtn:hover,#schedBtn.on{border-color:var(--accent);color:var(--accent);background:var(--accent-w)}
#schedBtn b{font-size:12px} #schedBtn i{font-style:normal;font-size:10px}
#schedPop{display:none;position:fixed;z-index:76;width:min(960px,calc(100vw - 24px));max-height:min(760px,calc(100vh - 90px));overflow:auto;background:var(--card);border:1px solid #bac5d2;border-radius:10px;box-shadow:0 14px 42px rgba(18,38,63,.28);color:var(--ink)}
#schedPop.on{display:block}.schedHd{background:var(--navy);color:#fff;padding:11px 13px;display:flex;align-items:flex-start;gap:12px;position:sticky;top:0;z-index:2}.schedHd h3{font-size:14px}.schedHd p{margin:2px 0 0;font-size:11px;color:#b9cadd}.schedHd button{margin-left:auto;background:rgba(255,255,255,.15);border:0;color:#fff;border-radius:5px;width:28px;height:28px;cursor:pointer;font-size:17px}.schedBody{padding:13px}.schedGrid{display:grid;grid-template-columns:130px 130px 130px minmax(220px,1fr);gap:9px;align-items:end}.schedF label{display:block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.45px;color:var(--mid);margin-bottom:4px}.schedF input,.schedF select{width:100%;padding:8px 9px;border:1px solid #c3ccd7;border-radius:6px;background:#fff}.schedAct{display:flex;gap:7px;flex-wrap:wrap;margin-top:9px}.schedAct button{padding:7px 10px;border:1px solid #c3ccd7;border-radius:6px;background:#fff;cursor:pointer;font-size:12px}.schedAct button.pri{background:var(--accent);border-color:var(--accent);color:#fff}.schedMeta{margin-top:11px;padding:9px 11px;background:#f4f7fa;border:1px solid var(--line);border-radius:7px;font-size:11.5px;color:var(--mid)}.schedMeta b{color:var(--ink)}
.schedMatches{margin-top:8px;border:1px solid var(--line);border-radius:7px;overflow:hidden;display:none}.schedMatches.on{display:block}.schedMatch{width:100%;border:0;border-bottom:1px solid #edf0f4;background:#fff;text-align:left;padding:8px 10px;cursor:pointer;font-size:12px;display:grid;grid-template-columns:minmax(150px,1fr) 110px 140px;gap:8px}.schedMatch:last-child{border-bottom:0}.schedMatch:hover{background:var(--accent-w)}.schedMatch b{font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.schedMatch span{color:var(--mid)}
.schedSel{margin-top:11px;display:none;padding:10px 11px;border-left:3px solid var(--accent);background:var(--accent-w);font-size:12px}.schedSel.on{display:block}.schedSel b{font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.schedCards{display:grid;grid-template-columns:repeat(auto-fit,minmax(185px,1fr));gap:8px;margin-top:11px}.schedCard{border:1px solid var(--line);border-radius:7px;padding:9px 10px;background:#fff;font-size:11.5px}.schedCard .a{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-weight:700;color:var(--navy);font-size:12px}.schedCard .w{color:var(--mid);margin-top:2px}.schedCard .d{margin-top:6px;line-height:1.55}.schedPast{color:#a3282d;font-weight:700}.schedOk{color:#1f6b43;font-weight:700}
.schedChart{margin-top:12px;border:1px solid var(--line);border-radius:8px;overflow:auto;background:#fff}.schedChart svg{display:block;min-width:820px;width:100%;height:420px}.schedLegend{display:flex;gap:12px;flex-wrap:wrap;padding:8px 10px;border-top:1px solid var(--line);font-size:11px;color:var(--mid)}.schedLegend i{display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:4px;vertical-align:-1px}.schedFoot{font-size:11px;color:var(--mid);margin-top:8px;line-height:1.45}
@media(max-width:720px){#schedPop{left:8px!important;right:8px!important;width:auto}.schedGrid{grid-template-columns:1fr 1fr}.schedF.asset{grid-column:1/-1}.schedMatch{grid-template-columns:1fr}.schedChart svg{min-width:720px}}
`;
  document.head.appendChild(st);
}
function build(){
  if(q('#schedBtn')||!q('#chHint')) return !!q('#schedBtn');
  css();
  var btn=document.createElement('button'); btn.type='button'; btn.id='schedBtn'; btn.innerHTML='<b>Schedule / March chart</b><i>▼</i>'; q('#chHint').insertAdjacentElement('afterend',btn);
  var pop=document.createElement('div'); pop.id='schedPop'; pop.innerHTML=`<div class="schedHd"><div><h3>Time × chainage schedule</h3><p>Gantt Rev B baseline · hard coded from the 30 Sep 2026 March chart</p></div><button type="button" id="schedClose">×</button></div><div class="schedBody"><div class="schedGrid"><div class="schedF"><label>Section</label><select id="schedSec"><option>PHW</option><option>PWG</option></select></div><div class="schedF"><label>Chainage from (m)</label><input id="schedFrom" type="number" step="any" min="0"></div><div class="schedF"><label>To (optional)</label><input id="schedTo" type="number" step="any" min="0"></div><div class="schedF asset"><label>Find a specific asset</label><input id="schedAsset" type="text" placeholder="e.g. PHW-TS-0142, AV-011, creek, road" autocomplete="off"></div></div><div class="schedAct"><button class="pri" type="button" id="schedGo">Show schedule</button><button type="button" id="schedUse">Use current Search range</button><button type="button" id="schedFind">Find asset</button><button type="button" id="schedApply" style="display:none">Apply asset to Search</button></div><div id="schedMatches" class="schedMatches"></div><div id="schedSelected" class="schedSel"></div><div id="schedMeta" class="schedMeta"></div><div id="schedCards" class="schedCards"></div><div id="schedChart" class="schedChart"></div><div class="schedFoot">Programme activities are fixed to the Rev B baseline shown on the March chart. The asset itself is read live from the register, so you can search any current asset and see which scheduled activity or activities cover its chainage.</div></div>`;
  document.body.appendChild(pop);
  btn.addEventListener('click',function(e){ e.stopPropagation(); toggle(); });
  q('#schedClose').addEventListener('click',close);
  q('#schedGo').addEventListener('click',render);
  q('#schedUse').addEventListener('click',useSearch);
  q('#schedFind').addEventListener('click',find);
  q('#schedApply').addEventListener('click',applySelected);
  q('#schedSec').addEventListener('change',render);
  q('#schedAsset').addEventListener('keydown',function(e){ if(e.key==='Enter'){ e.preventDefault(); find(); }});
  q('#schedFrom').addEventListener('keydown',function(e){ if(e.key==='Enter') render(); });
  q('#schedTo').addEventListener('keydown',function(e){ if(e.key==='Enter') render(); });
  document.addEventListener('click',function(e){ if(state.open&&!pop.contains(e.target)&&e.target!==btn) close(); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&state.open) close(); });
  window.addEventListener('resize',place); window.addEventListener('scroll',place,true);
  render(); return true;
}
function place(){
  if(!state.open) return; var b=q('#schedBtn'), p=q('#schedPop'); if(!b||!p) return;
  var r=b.getBoundingClientRect(), gap=6, w=Math.min(960,window.innerWidth-24), left=Math.max(12,Math.min(r.left,window.innerWidth-w-12));
  var below=window.innerHeight-r.bottom, h=Math.min(760,window.innerHeight-90), top;
  if(below>320) top=Math.min(r.bottom+gap,window.innerHeight-h-8); else top=Math.max(8,r.top-h-gap);
  p.style.left=left+'px'; p.style.top=Math.max(8,top)+'px';
}
function toggle(){ state.open?close():open(); }
function open(){ state.open=true; q('#schedPop').classList.add('on'); q('#schedBtn').classList.add('on'); q('#schedBtn i').textContent='▲'; syncSection(); place(); render(); }
function close(){ state.open=false; if(q('#schedPop'))q('#schedPop').classList.remove('on'); if(q('#schedBtn')){q('#schedBtn').classList.remove('on');q('#schedBtn i').textContent='▼';} }
function syncSection(){ var s=q('#secIn'); if(s&&/^(PHW|PWG)$/.test(s.value)) q('#schedSec').value=s.value; }
function useSearch(){
  syncSection(); var f=q('#chFrom'),t=q('#chTo'); q('#schedFrom').value=f&&f.value!==''?f.value:''; q('#schedTo').value=t&&t.value!==''?t.value:''; state.selected=null; q('#schedApply').style.display='none'; q('#schedSelected').classList.remove('on'); render();
}
function find(){
  var D=root.D, inp=q('#schedAsset'), list=findAssets(inp.value,D,10), box=q('#schedMatches'); state.matches=list; box.innerHTML='';
  if(!list.length){ box.classList.add('on'); box.innerHTML='<div style="padding:9px 10px;font-size:12px;color:var(--mid)">No current register asset matches that search.</div>'; return; }
  if(list.length===1 || list[0].label.toLowerCase()===inp.value.trim().toLowerCase() || list[0].id.toLowerCase()===inp.value.trim().toLowerCase()){ choose(list[0]); return; }
  list.forEach(function(a,i){ var b=document.createElement('button'); b.type='button'; b.className='schedMatch'; b.innerHTML='<b>'+esc(a.label)+'</b><span>'+esc(a.sec)+' · '+esc(a.type||a.reg)+'</span><span>ch '+m(a.from)+(a.to!=null?' – '+m(a.to):'')+' m</span>'; b.addEventListener('click',function(){ choose(list[i]); }); box.appendChild(b); }); box.classList.add('on');
}
function choose(a){
  state.selected=a; q('#schedMatches').classList.remove('on'); q('#schedAsset').value=a.label; q('#schedSec').value=a.sec; q('#schedFrom').value=a.from; q('#schedTo').value=a.to==null?'':a.to;
  var s=q('#schedSelected'); s.innerHTML='<b>'+esc(a.label)+'</b> · '+esc(a.type||a.reg)+' · '+esc(a.sec)+' · ch '+m(a.from)+(a.to!=null?' – '+m(a.to):'')+' m'+(a.feature?' · '+esc(a.feature):''); s.classList.add('on'); q('#schedApply').style.display=''; render();
}
function applySelected(){
  var a=state.selected; if(!a) return;
  var sec=q('#secIn'), aid=q('#aidIn'), from=q('#chFrom'), to=q('#chTo');
  if(sec){sec.value=a.sec;sec.dispatchEvent(new Event('change',{bubbles:true}));}
  if(aid){aid.value=a.id||a.label;aid.dispatchEvent(new Event('input',{bubbles:true}));}
  if(from){from.value=a.from;from.dispatchEvent(new Event('input',{bubbles:true}));}
  if(to){to.value=a.to==null?a.from:a.to;to.dispatchEvent(new Event('input',{bubbles:true}));}
  if(typeof root.apply==='function') root.apply();
  close();
}
function selectedRange(){
  var sec=q('#schedSec').value, f=parseFloat(q('#schedFrom').value), tv=q('#schedTo').value, t=tv===''?f:parseFloat(tv);
  if(!isFinite(f)) return {sec:sec,from:null,to:null};
  var rg=normRange(f,t); return {sec:sec,from:rg[0],to:rg[1]};
}
function render(){
  if(!q('#schedChart')) return; var r=selectedRange(), hits=r.from==null?[]:scheduleHits(r.sec,r.from,r.to), ext=RANGE[r.sec];
  q('#schedMeta').innerHTML=r.from==null?'<b>'+r.sec+'</b> · Full schedule · KP0 – '+m(ext)+' m':('<b>'+r.sec+'</b> · Chainage '+m(r.from)+(r.to!==r.from?' – '+m(r.to):'')+' m · <b>'+hits.length+'</b> programme activit'+(hits.length===1?'y':'ies')+' intersect this location');
  q('#schedCards').innerHTML=hits.length?hits.map(cardHTML).join(''):(r.from==null?'':'<div class="schedCard"><div class="a">No activity at this chainage</div><div class="d">The hard coded Rev B schedule has no activity envelope intersecting this exact range.</div></div>');
  q('#schedChart').innerHTML=chart(r.sec,r.from,r.to,hits)+'<div class="schedLegend"><span><i style="background:#0b6ea8"></i>Open Cut</span><span><i style="background:#c2731a"></i>Special Crossing</span><span><i style="background:#8a5cb8"></i>Trenchless</span><span><i style="background:#1a8f9c"></i>Hydrotest</span><span><i style="background:#a3282d"></i>selected chainage</span></div>';
}
function cardHTML(x){
  function due(label,s){ return '<div>'+label+': <b>'+au(s)+'</b>'+(duePast(s)?' <span class="schedPast">PAST at 30 Sep 26</span>':'')+'</div>'; }
  return '<div class="schedCard"><div class="a">'+esc(x.code)+'</div><div class="w">'+esc(x.work)+' · KP '+(x.from/1000).toFixed(3)+'–'+(x.to/1000).toFixed(3)+'</div><div class="d"><div>Crew: <b>'+au(x.start)+' – '+au(x.finish)+'</b></div><div>Delivery drop: <b>'+au(x.drop)+'</b></div>'+due('Order by 21 wk',x.order21)+due('Order by 39 wk',x.order39)+'</div></div>';
}
function chart(sec,selFrom,selTo,hits){
  var list=SCHEDULE[sec], ext=RANGE[sec], W=920,H=420,L=64,R=18,T=22,B=35, y0=new Date(Date.UTC(2027,1,1)), y1=new Date(Date.UTC(2028,2,31)), ph=H-T-B, pw=W-L-R;
  function X(v){return L+(v/ext)*pw;} function Y(d){return T+((dateOf(d)-y0)/(y1-y0))*ph;}
  function line(x1,y1,x2,y2,stroke,w,dash){ return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+stroke+'" stroke-width="'+(w||1)+'"'+(dash?' stroke-dasharray="'+dash+'"':'')+'/>'; }
  var s='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+sec+' time chainage schedule"><rect width="'+W+'" height="'+H+'" fill="#fff"/>';
  var months=[]; for(var yy=2027,mm=1; yy<2028||mm<=2;){ months.push(new Date(Date.UTC(yy,mm,1))); mm++; if(mm>11){yy++;mm=0;} }
  months.forEach(function(d){ var y=T+((d-y0)/(y1-y0))*ph; s+=line(L,y,W-R,y,'#e3e7ec',1); s+='<text x="'+(L-7)+'" y="'+(y+4)+'" text-anchor="end" font-size="10" fill="#66717d">'+d.toLocaleDateString('en-AU',{timeZone:'UTC',month:'short',year:'2-digit'})+'</text>'; });
  var step=ext>22000?3000:2000; for(var ch=0;ch<=ext;ch+=step){ var xx=X(ch); s+=line(xx,T,xx,H-B,'#edf0f4',1); s+='<text x="'+xx+'" y="'+(H-12)+'" text-anchor="middle" font-size="10" fill="#66717d">'+(ch/1000).toFixed(0)+' km</text>'; }
  var palette={'Open Cut':'#0b6ea8','Special Crossing':'#c2731a','Trenchless':'#8a5cb8'};
  list.forEach(function(a){ var x=Math.min(X(a.from),X(a.to)), w=Math.max(2,Math.abs(X(a.to)-X(a.from))), y=Y(a.start), y2=Y(a.finish), h=Math.max(3,y2-y+3), hi=hits.indexOf(a)>=0; s+='<rect x="'+x.toFixed(1)+'" y="'+y.toFixed(1)+'" width="'+w.toFixed(1)+'" height="'+h.toFixed(1)+'" rx="2" fill="'+(palette[a.work]||'#5b6875')+'" opacity="'+(hi?'0.96':'0.34')+'"'+(hi?' stroke="#12263f" stroke-width="1.5"':'')+'><title>'+esc(a.code)+' · '+esc(a.work)+' · '+a.start+' to '+a.finish+'</title></rect>'; });
  (HYDRO[sec]||[]).forEach(function(hy){ var y=Y(hy.start), y2=Y(hy.finish); s+='<rect x="'+L+'" y="'+y+'" width="'+pw+'" height="'+Math.max(4,y2-y+3)+'" fill="#1a8f9c" opacity=".17"><title>'+esc(hy.name)+' · '+hy.start+' to '+hy.finish+'</title></rect>'; });
  if(selFrom!=null){ var a=X(selFrom), b=X(selTo==null?selFrom:selTo); s+=line(a,T,a,H-B,'#a3282d',2,'5 3'); if(Math.abs(b-a)>1){s+=line(b,T,b,H-B,'#a3282d',2,'5 3'); s+='<rect x="'+Math.min(a,b)+'" y="'+T+'" width="'+Math.abs(b-a)+'" height="'+ph+'" fill="#a3282d" opacity=".04"/>'; } }
  s+='<text x="'+(L+pw/2)+'" y="'+(H-1)+'" text-anchor="middle" font-size="11" fill="#46515d">Chainage · '+sec+' · 0 to '+m(ext)+' m</text></svg>'; return s;
}

function boot(){
  if(build()) return;
  var n=0,t=setInterval(function(){ n++; if(build()||n>80) clearInterval(t); },125);
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();

})(typeof globalThis!=='undefined'?globalThis:this);
