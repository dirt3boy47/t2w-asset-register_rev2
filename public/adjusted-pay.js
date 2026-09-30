(function(root){
'use strict';

/*
  Difficulty adjusted linear pay for T2W.
  Source: "Toowoomba to Warwick Crew Schedule(1).xlsx", Pipe Lay Plan.
  Baseline is the arithmetic mean of valid numeric values in column P:
  Avg. Production Rate (m/day) 2026.

  The field workflow continues to record physical metres.
  Only revenue is adjusted. Cost rates and point assets are not difficulty adjusted.
*/
var VERSION='2026-09-29.1';
var AVG_PRODUCTION=77.2062597303637;
var BANDS=[["PHW",0.0,40.0,14.0,544,544],["PHW",40.0,332.558,36.0,546,548],["PHW",332.558,405.0,10.0,549,549],["PHW",405.0,1092.0,36.0,550,563],["PHW",1092.0,1232.924,24.0,564,573],["PHW",1232.924,1255.696,10.0,574,574],["PHW",1255.696,1734.667,36.0,575,580],["PHW",1734.667,1787.846,6.0,581,583],["PHW",1787.846,2038.507,60.0,584,585],["PHW",2038.507,2110.24,10.0,586,586],["PHW",2110.24,2510.0,78.0,587,592],["PHW",2510.0,2560.0,60.0,594,594],["PHW",2560.0,2718.567,120.0,596,598],["PHW",2718.567,2846.0,60.0,599,604],["PHW",2846.0,2881.0,54.0,605,605],["PHW",2881.0,3453.245,120.0,607,607],["PHW",3453.245,3549.0,60.0,608,609],["PHW",3549.0,3760.0,120.0,610,610],["PHW",3760.0,3787.858,60.0,612,612],["PHW",3787.858,3828.657,54.0,613,614],["PHW",3828.657,3853.439,78.0,615,615],["PHW",3853.439,4084.761,120.0,616,616],["PHW",4084.761,4120.0,54.0,617,618],["PHW",4120.0,4300.0,60.0,620,622],["PHW",4300.0,4416.743,48.0,624,625],["PHW",4416.743,4455.043,12.0,627,631],["PHW",4455.043,4629.445,78.0,632,633],["PHW",4629.445,4663.0,36.0,634,634],["PHW",4663.0,4695.0,54.0,635,635],["PHW",4695.0,4880.0,120.0,636,639],["PHW",4880.0,6160.0,30.0,640,653],["PHW",6160.0,6364.586,78.0,654,658],["PHW",6364.586,6393.328,25.0,659,659],["PHW",6393.328,6477.0,120.0,660,660],["PHW",6477.0,6480.0,10.0,661,661],["PHW",6480.0,6772.0,78.0,663,667],["PHW",6772.0,6792.0,60.0,668,669],["PHW",6792.0,6980.0,78.0,670,675],["PHW",6980.0,7035.325,10.0,676,676],["PHW",7035.325,7046.0,78.0,677,677],["PHW",7046.0,7810.0,120.0,678,678],["PHW",7810.0,7860.0,48.0,679,680],["PHW",7860.0,7900.0,36.0,682,686],["PHW",7900.0,9759.989,78.0,688,701],["PHW",9759.989,9802.16,60.0,702,702],["PHW",9802.16,10348.6,78.0,703,706],["PHW",10348.6,10531.0,60.0,707,708],["PHW",10531.0,10582.353,36.0,709,709],["PHW",10582.353,10645.383,10.0,710,710],["PHW",10645.383,10684.0,36.0,711,711],["PHW",10684.0,10700.0,78.0,712,712],["PHW",10700.0,10796.496,60.0,714,716],["PHW",10796.496,11168.256,78.0,717,720],["PHW",11168.256,11193.746,60.0,721,721],["PHW",11193.746,11427.143,78.0,722,723],["PHW",11427.143,11509.111,10.0,724,724],["PHW",11509.111,11750.0,30.0,725,728],["PHW",11750.0,11790.0,48.0,729,729],["PHW",11790.0,12441.0,120.0,730,732],["PHW",12441.0,12457.0,12.0,733,733],["PHW",12457.0,12525.0,60.0,734,735],["PHW",12525.0,12970.0,120.0,737,737],["PHW",12970.0,13148.226,78.0,739,740],["PHW",13148.226,13255.318,60.0,741,743],["PHW",13255.318,13274.77,78.0,744,745],["PHW",13274.77,13346.374,10.0,746,746],["PHW",13346.374,14806.133,78.0,747,776],["PHW",14806.133,14839.513,10.0,777,777],["PHW",14839.513,14935.477,120.0,778,778],["PHW",14935.477,15100.0,60.0,779,784],["PHW",15100.0,15761.78,108.0,786,786],["PHW",15761.78,15784.2,60.0,787,787],["PHW",15784.2,16149.266,120.0,788,788],["PHW",16149.266,16219.906,48.0,789,789],["PHW",16219.906,17026.861,78.0,790,794],["PHW",17026.861,17937.0,60.0,795,799],["PHW",17937.0,17984.0,18.0,800,800],["PHW",17984.0,18075.0,48.0,801,801],["PHW",18075.0,18080.0,24.0,802,802],["PHW",18080.0,19120.0,78.0,803,817],["PHW",19120.0,19157.0,36.0,818,821],["PPH",0.0,1008.794,36.0,1109,1126],["PWG",0.0,31.0,18.0,823,826],["PWG",31.0,836.0,120.0,827,827],["PWG",836.0,903.0,48.0,828,829],["PWG",903.0,1181.0,120.0,830,831],["PWG",1181.0,1207.592,48.0,832,836],["PWG",1207.592,1425.0,120.0,837,837],["PWG",1425.0,1471.118,48.0,839,840],["PWG",1471.118,1491.67,120.0,841,841],["PWG",1491.67,1508.152,48.0,842,842],["PWG",1508.152,1608.82,120.0,843,843],["PWG",1608.82,1614.19,48.0,844,844],["PWG",1614.19,1833.0,120.0,845,845],["PWG",1833.0,2865.366,24.0,846,880],["PWG",2865.366,2908.821,10.0,881,881],["PWG",2908.821,3071.0,138.0,882,882],["PWG",3071.0,3151.0,24.0,883,883],["PWG",3151.0,3991.759,174.0,884,884],["PWG",3991.759,4016.067,24.0,885,885],["PWG",4016.067,5447.827,174.0,886,886],["PWG",5447.827,5475.0,30.0,888,890],["PWG",5475.0,5600.0,120.0,891,891],["PWG",5600.0,6531.589,174.0,892,892],["PWG",6531.589,6666.781,48.0,893,893],["PWG",6666.781,7093.062,78.0,894,896],["PWG",7093.062,7123.371,48.0,897,897],["PWG",7123.371,7147.072,78.0,898,898],["PWG",7147.072,7175.073,24.0,899,899],["PWG",7175.073,7541.734,150.0,900,900],["PWG",7541.734,7547.89,24.0,901,901],["PWG",7547.89,7581.998,10.0,902,903],["PWG",7581.998,8293.647,48.0,904,927],["PWG",8293.647,8315.201,10.0,928,928],["PWG",8315.201,8335.614,48.0,929,930],["PWG",8335.614,8400.622,10.0,931,931],["PWG",8400.622,8487.151,48.0,932,937],["PWG",8487.151,8542.069,10.0,938,938],["PWG",8542.069,8706.0,48.0,939,949],["PWG",8706.0,9151.11,138.0,950,954],["PWG",9151.11,9433.695,120.0,955,957],["PWG",9433.695,9675.45,138.0,958,959],["PWG",9675.45,9682.87,60.0,960,960],["PWG",9682.87,10223.331,138.0,961,961],["PWG",10223.331,10420.0,60.0,962,963],["PWG",10420.0,10851.915,138.0,965,965],["PWG",10851.915,10942.241,60.0,966,967],["PWG",10942.241,11500.0,138.0,968,969],["PWG",11500.0,11517.41,60.0,970,971],["PWG",11517.41,11725.759,138.0,972,973],["PWG",11725.759,11765.009,60.0,974,976],["PWG",11765.009,11776.629,120.0,978,978],["PWG",11776.629,11780.829,12.0,979,979],["PWG",11780.829,12103.115,120.0,980,987],["PWG",12103.115,12301.173,138.0,988,988],["PWG",12301.173,12414.443,30.0,989,990],["PWG",12414.443,12702.22,120.0,991,994],["PWG",12702.22,12734.864,10.0,995,995],["PWG",12734.864,13218.214,174.0,996,996],["PWG",13218.214,13247.005,10.0,997,997],["PWG",13247.005,14076.0,120.0,998,1003],["PWG",14076.0,14525.498,36.0,1004,1017],["PWG",14525.498,14572.298,10.0,1018,1018],["PWG",14572.298,14849.835,120.0,1019,1019],["PWG",14849.835,14870.0,60.0,1020,1021],["PWG",14870.0,15370.0,78.0,1023,1023],["PWG",15370.0,15814.716,150.0,1025,1025],["PWG",15814.716,15849.681,120.0,1026,1026],["PWG",15849.681,16324.84,150.0,1027,1027],["PWG",16324.84,16329.25,78.0,1028,1028],["PWG",16329.25,16403.61,60.0,1029,1029],["PWG",16403.61,16423.822,36.0,1030,1030],["PWG",16423.822,16713.652,150.0,1031,1031],["PWG",16713.652,16975.0,120.0,1032,1033],["PWG",16975.0,17027.7,48.0,1035,1035],["PWG",17027.7,17030.75,60.0,1036,1036],["PWG",17030.75,18011.897,138.0,1037,1037],["PWG",18011.897,18017.337,60.0,1038,1038],["PWG",18017.337,18025.0,138.0,1039,1039],["PWG",18025.0,18151.238,24.0,1041,1043],["PWG",18151.238,18166.781,5.0,1044,1044],["PWG",18166.781,18220.0,60.0,1045,1046],["PWG",18220.0,19631.584,138.0,1047,1047],["PWG",19631.584,19648.964,78.0,1048,1049],["PWG",19648.964,19654.034,138.0,1050,1050],["PWG",19654.034,19765.0,60.0,1051,1051],["PWG",19765.0,20149.121,150.0,1053,1053],["PWG",20149.121,20154.061,78.0,1054,1054],["PWG",20154.061,21203.914,174.0,1055,1055],["PWG",21203.914,21323.953,120.0,1056,1060],["PWG",21323.953,22319.0,174.0,1061,1061],["PWG",22319.0,22453.175,24.0,1062,1064],["PWG",22453.175,24044.201,174.0,1065,1065],["PWG",24044.201,24954.0,36.0,1066,1068],["PWG",24954.0,25018.0,24.0,1069,1069],["PWG",25018.0,25160.0,138.0,1070,1071],["PWG",25160.0,25941.9,78.0,1073,1088],["PWG",25941.9,26019.66,48.0,1089,1091],["PWG",26019.66,26029.35,78.0,1092,1093],["PWG",26029.35,26093.87,48.0,1094,1095],["PWG",26093.87,26200.0,78.0,1096,1099],["PWG",26200.0,26252.108,48.0,1101,1101],["PWG",26252.108,26283.028,10.0,1102,1102],["PWG",26283.028,27012.0,60.0,1103,1107]];
var EPS=1e-7;
var bySection={};

BANDS.forEach(function(b){
  (bySection[b[0]]||(bySection[b[0]]=[])).push(b);
});
Object.keys(bySection).forEach(function(sec){
  bySection[sec].sort(function(a,b){ return a[1]-b[1] || a[2]-b[2]; });
});

function n(v){ v=Number(v); return isFinite(v)?v:null; }
function factorFromRate(rate){
  rate=n(rate);
  return rate && rate>0 ? AVG_PRODUCTION/rate : 1;
}
function segment(sec,from,to){
  from=n(from); to=n(to);
  if(from==null || to==null) return {physical:0,equivalent:0,factor:null,missing:0,segments:[]};
  var lo=Math.min(from,to), hi=Math.max(from,to);
  if(hi-lo<=EPS) return {physical:0,equivalent:0,factor:null,missing:0,segments:[]};

  var list=bySection[String(sec||'').trim()]||[];
  var out=[], eq=0, missing=0, cursor=lo;

  list.forEach(function(b){
    var bs=b[1], be=b[2];
    if(be<=lo+EPS || bs>=hi-EPS) return;
    var a=Math.max(lo,bs), z=Math.min(hi,be);
    if(z<=a+EPS) return;
    if(a>cursor+EPS){
      var gap=a-cursor;
      out.push({from:cursor,to:a,metres:gap,production:null,factor:1,missing:true});
      eq+=gap; missing+=gap;
    }
    var metres=z-a, f=factorFromRate(b[3]);
    out.push({from:a,to:z,metres:metres,production:b[3],factor:f,sourceRow:b[4],sourceRowEnd:b[5],missing:false});
    eq+=metres*f;
    cursor=Math.max(cursor,z);
  });
  if(cursor<hi-EPS){
    var tail=hi-cursor;
    out.push({from:cursor,to:hi,metres:tail,production:null,factor:1,missing:true});
    eq+=tail; missing+=tail;
  }
  var physical=hi-lo;
  return {
    physical:physical,
    equivalent:eq,
    factor:physical>EPS?eq/physical:null,
    missing:missing,
    segments:out
  };
}
function priced(sec,from,to,baseRate){
  var s=segment(sec,from,to), r=n(baseRate);
  s.baseRate=r;
  s.baseValue=r==null?0:s.physical*r;
  s.adjustedValue=r==null?0:s.equivalent*r;
  s.adjustment=s.adjustedValue-s.baseValue;
  return s;
}
function addTotals(a,b){
  a.physical+=b.physical||0;
  a.equivalent+=b.equivalent||0;
  a.baseValue+=b.baseValue||0;
  a.adjustedValue+=b.adjustedValue||0;
  a.missing+=b.missing||0;
  return a;
}
function emptyTotals(){ return {physical:0,equivalent:0,baseValue:0,adjustedValue:0,missing:0}; }

function pipeLinear(sec,from,to){
  var rate=null;
  try{
    var pk=sec+'|'+root.ST.pipeType[sec];
    rate=root.ST.pRate[pk];
  }catch(e){}
  return priced(sec,from,to,rate);
}
function trenchLinear(sec,from,to){
  var lo=Math.min(from,to), hi=Math.max(from,to);
  var total=emptyTotals();
  if(!(hi-lo>EPS)) return total;
  (root.T||[]).forEach(function(x){
    if(x.sec!==sec) return;
    var a=Math.max(lo,x.s), z=Math.min(hi,x.e);
    if(!(z-a>EPS)) return;
    var rate=null;
    try{ rate=root.ST.tRate[sec+'|'+x.tt]; }catch(e){}
    addTotals(total,priced(sec,a,z,rate));
  });
  /* Equivalent metres describe physical work even if a design zone has no commercial rate. */
  var whole=segment(sec,lo,hi);
  total.physical=whole.physical;
  total.equivalent=whole.equivalent;
  total.missing=whole.missing;
  return total;
}
function pointEarn(row){
  var v=0;
  (row.picked||[]).forEach(function(a){
    try{
      var r=root.rateOf(a);
      if(r!=null) v+=r*root.qtyOf(a);
    }catch(e){}
  });
  return v;
}
function adjustRow(row){
  var sec=row.sec0;
  var trench=emptyTotals(), pipe=emptyTotals();
  if(sec && row.kind!=='section'){
    if(row.tOn!==false || row.kind==='ahead') trench=trenchLinear(sec,row.from,row.to);
    if(row.pOn!==false || row.kind==='ahead') pipe=pipeLinear(sec,row.pfrom,row.pto);
  }
  var points=pointEarn(row);
  var baseEarn=trench.baseValue+pipe.baseValue+points;
  var adjustedEarn=trench.adjustedValue+pipe.adjustedValue+points;
  return {
    trench:trench, pipe:pipe, pointEarn:points,
    baseEarn:baseEarn, adjustedEarn:adjustedEarn,
    adjustment:adjustedEarn-baseEarn
  };
}
function fmtFactor(v){ return v==null?'n/a':v.toFixed(2)+'x'; }

var API={
  version:VERSION,
  averageProduction:AVG_PRODUCTION,
  bands:BANDS,
  factorFromRate:factorFromRate,
  segment:segment,
  priced:priced,
  adjustRow:adjustRow,
  installed:false
};
root.ADJUSTED_PAY=API;

function install(){
  if(API.installed) return true;
  if(typeof root.eodDraft!=='function' || !root.ST || !root.T) return false;

  var originalDraft=root.eodDraft;
  var originalTally=root.eodTally;
  var originalEntry=root.eodEntryFromForm;
  var originalTPValue=root.eodTPStagedValue;

  root.__ADJUSTED_PAY_ORIGINALS={
    eodDraft:originalDraft,
    eodTally:originalTally,
    eodEntryFromForm:originalEntry,
    eodTPStagedValue:originalTPValue
  };

  root.eodDraft=function(){
    var d=originalDraft.apply(this,arguments);
    if(!d || !d.rows) return d;

    var totalEarn=0, eqT=0, eqP=0, physicalT=0, physicalP=0;
    var baseEarn=0, missing=0, adjustment=0;

    d.rows.forEach(function(row){
      var a=adjustRow(row);
      row.baseEarn=a.baseEarn;
      row.earn=a.adjustedEarn;
      row.adjustment=a.adjustment;
      row.eqT=a.trench.equivalent;
      row.eqP=a.pipe.equivalent;
      row.factorT=a.trench.physical>EPS ? a.trench.equivalent/a.trench.physical : null;
      row.factorP=a.pipe.physical>EPS ? a.pipe.equivalent/a.pipe.physical : null;
      row.productionMissing=(a.trench.missing||0)+(a.pipe.missing||0);

      totalEarn+=a.adjustedEarn;
      baseEarn+=a.baseEarn;
      adjustment+=a.adjustment;
      eqT+=a.trench.equivalent;
      eqP+=a.pipe.equivalent;
      physicalT+=a.trench.physical;
      physicalP+=a.pipe.physical;
      missing+=row.productionMissing;
    });

    d.baseEarn=baseEarn;
    d.earn=totalEarn;
    d.adjustment=adjustment;
    d.eqT=eqT;
    d.eqP=eqP;
    d.factorT=physicalT>EPS?eqT/physicalT:null;
    d.factorP=physicalP>EPS?eqP/physicalP:null;
    d.productionMissing=missing;
    d.profit=d.earn-d.cost;
    d.margin=d.earn>0?d.profit/d.earn:null;
    return d;
  };

  root.eodTally=function(){
    originalTally.apply(this,arguments);
    var host=document.querySelector('#eodTally');
    if(!host) return;
    var old=host.querySelector('.adjusted-pay-summary');
    if(old) old.remove();

    var d=root.eodDraft();
    var card=document.createElement('div');
    card.className='adjusted-pay-summary';
    var adjust=(d.adjustment||0);
    card.innerHTML=
      '<div class="k">Difficulty adjusted production</div>'+ 
      '<div class="v">'+
        (d.eqT||0).toFixed(1)+' eq m trench · '+(d.eqP||0).toFixed(1)+' eq m pipe'+
      '</div>'+ 
      '<div class="s">baseline '+AVG_PRODUCTION.toFixed(2)+' m/day · '+
        'trench '+fmtFactor(d.factorT)+' · pipe '+fmtFactor(d.factorP)+
        ' · pay adjustment '+(adjust>=0?'+':'')+(typeof root.money==='function'?root.money(adjust):adjust.toFixed(2))+
        (d.productionMissing>EPS?' · '+d.productionMissing.toFixed(1)+' m has no production band and is held at 1.00x':'')+
      '</div>';
    host.appendChild(card);
  };

  root.eodEntryFromForm=function(d){
    var entry=originalEntry.apply(this,arguments);
    if(!entry) return entry;
    entry.adjustedPay={
      version:VERSION,
      averageProduction:AVG_PRODUCTION,
      physicalTrench:d.mT||0,
      physicalPipe:d.mP||0,
      equivalentTrench:d.eqT||0,
      equivalentPipe:d.eqP||0,
      trenchFactor:d.factorT,
      pipeFactor:d.factorP,
      baseEarn:d.baseEarn||0,
      adjustedEarn:d.earn||0,
      adjustment:d.adjustment||0,
      productionMissing:d.productionMissing||0
    };
    (entry.rows||[]).forEach(function(er,i){
      var r=d.rows[i]||{};
      er.eqT=r.eqT||0;
      er.eqP=r.eqP||0;
      er.factorT=r.factorT;
      er.factorP=r.factorP;
      er.baseEarn=r.baseEarn==null?er.earn:r.baseEarn;
      er.adjustment=r.adjustment||0;
      er.productionMissing=r.productionMissing||0;
    });
    return entry;
  };

  if(typeof originalTPValue==='function'){
    root.eodTPStagedValue=function(sec){
      var v=0;
      try{
        (root.eodTPZonesAll(sec)||[]).forEach(function(t){
          var g=root.EODTPV[t.key]; if(!g) return;
          var curT=root.tDone(t), curP=root.pDone(t);
          var wantT=(g.t!=null && g.t>curT)?Math.min(g.t,t.len):null;
          var wantP=(g.p!=null && g.p>curP)?Math.min(g.p,t.len):null;
          if(wantT!=null){
            var tr=root.ST.tRate[sec+'|'+t.tt];
            v+=priced(sec,t.s+curT,t.s+wantT,tr).adjustedValue;
          }
          if(wantP!=null){
            var pr=root.ST.pRate[sec+'|'+root.ST.pipeType[sec]];
            v+=priced(sec,t.s+curP,t.s+wantP,pr).adjustedValue;
          }
        });
      }catch(e){ return originalTPValue.apply(this,arguments); }
      return v;
    };
  }

  API.installed=true;
  try{ if(typeof root.eodTally==='function') root.eodTally(); }catch(e){}
  return true;
}

API.install=install;

/* The main page defines the EOD functions later in the document. Retry briefly
   so this file is safe whether injected before or after those definitions. */
if(!install()){
  var tries=0, timer=setInterval(function(){
    tries++;
    if(install() || tries>100) clearInterval(timer);
  },50);
}

})(typeof window!=='undefined'?window:globalThis);
