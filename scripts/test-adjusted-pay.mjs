#!/usr/bin/env node
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const code = fs.readFileSync(new URL('../public/adjusted-pay.js', import.meta.url), 'utf8');

const ctx = {
  console,
  setInterval: () => 0,
  clearInterval: () => {},
  document: { querySelector: () => null },
  T: [{sec:'PHW', s:4300, e:4389, tt:'1A', len:89, key:'z1'}],
  ST: {
    tRate: {'PHW|1A':100},
    pRate: {'PHW|PIPE':50},
    pipeType: {PHW:'PIPE'},
    paRate: {}
  },
  rateOf: () => null,
  qtyOf: () => 1,
  eodDraft: () => ({
    rows: [{
      sec:'PHW · Test', sec0:'PHW', crew0:'mainline', comboKey:'PHW|mainline',
      from:4300, to:4348, pfrom:4300, pto:4348,
      dt:48, dp:48, picked:[], earn:7200, cost:1000,
      kind:'crew', tOn:true, pOn:true
    }],
    mT:48, mP:48, items:0, earn:7200, dcost:1000, plant:0, cost:1000,
    profit:6200, margin:6200/7200, bad:false
  }),
  eodTally: () => {},
  eodEntryFromForm: d => ({rows:d.rows.map(r => ({earn:r.earn})), money:{earn:d.earn}}),
  eodTPStagedValue: () => 0,
  money: v => '$'+Number(v).toFixed(2)
};
ctx.window = ctx;
ctx.globalThis = ctx;

vm.createContext(ctx);
vm.runInContext(code, ctx, {filename:'adjusted-pay.js'});

const api = ctx.ADJUSTED_PAY;
assert.ok(api);
assert.equal(api.version, '2026-09-29.1');
assert.ok(Math.abs(api.averageProduction - 77.2062597303637) < 1e-10);

const band = api.segment('PHW',4300,4348);
const expectedFactor = api.averageProduction / 48;
assert.ok(Math.abs(band.physical - 48) < 1e-9);
assert.ok(Math.abs(band.factor - expectedFactor) < 1e-9);
assert.equal(band.missing, 0);

const boundary = api.segment('PHW',0,100);
const expectedEq = 40*(api.averageProduction/14) + 60*(api.averageProduction/36);
assert.ok(Math.abs(boundary.equivalent - expectedEq) < 1e-7);
assert.equal(boundary.missing, 0);

const draft = ctx.eodDraft();
assert.ok(Math.abs(draft.eqT - api.averageProduction) < 1e-7);
assert.ok(Math.abs(draft.eqP - api.averageProduction) < 1e-7);
assert.ok(Math.abs(draft.earn - api.averageProduction*150) < 1e-7);
assert.ok(draft.earn > draft.baseEarn);

const entry = ctx.eodEntryFromForm(draft);
assert.equal(entry.adjustedPay.version, api.version);
assert.ok(Math.abs(entry.rows[0].factorT - expectedFactor) < 1e-9);
assert.ok(Math.abs(entry.rows[0].factorP - expectedFactor) < 1e-9);

console.log('adjusted pay tests passed');
