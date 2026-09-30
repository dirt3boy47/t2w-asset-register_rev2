import assert from 'node:assert/strict';
await import('../public/schedule.js');
const S=globalThis.T2W_SCHEDULE;
assert.ok(S,'schedule API exposed');
assert.equal(S.RANGE.PHW,19157);
assert.equal(S.RANGE.PWG,27012);
assert.equal(S.SCHEDULE.PHW.length,44);
assert.equal(S.SCHEDULE.PWG.length,51);
for(const sec of ['PHW','PWG']){
  for(const a of S.SCHEDULE[sec]){
    assert.ok(a.from>=0 && a.to>a.from && a.to<=S.RANGE[sec],`${sec} ${a.activity} range`);
    assert.ok(S.dateOf(a.start) && S.dateOf(a.finish),`${sec} ${a.activity} dates`);
    assert.ok(S.dateOf(a.start)<=S.dateOf(a.finish),`${sec} ${a.activity} date order`);
  }
}
assert.ok(S.scheduleHits('PHW',6000,6000).some(x=>x.activity==='1081'),'PHW 6000 maps to 1081');
assert.ok(S.scheduleHits('PWG',26050,26050).some(x=>x.activity==='1105'),'PWG 26050 maps to 1105');
assert.ok(S.scheduleHits('PWG',10000,10000).some(x=>x.activity==='1000'),'PWG 10000 maps to 1000');
const D={C:{record_key:0,chainage_start_m:1,chainage_end_m:2,pipeline_section:3,register:4,asset_type:5,asset_id:6,feature_name:7},rows:[
  ['PHW-TS-0142',6000,null,'PHW','Trench Stop & Bulkhead','TRENCH STOP','PHW-TS-0142',''],
  ['PWG-AV-001',26050,null,'PWG','Valves','AV','PWG-AV-001','Air valve'],
  ['PHW-RR-001',18000,18100,'PHW','Road / Rail','MAJOR ROAD CROSSING','PHW-RR-001','Warrego Highway']
]};
assert.equal(S.findAssets('PHW-TS-0142',D,8)[0].from,6000);
assert.equal(S.findAssets('air valve',D,8)[0].id,'PWG-AV-001');
assert.equal(S.findAssets('warrego',D,8)[0].to,18100);
console.log('schedule tests passed:',S.SCHEDULE.PHW.length+S.SCHEDULE.PWG.length,'activities');
