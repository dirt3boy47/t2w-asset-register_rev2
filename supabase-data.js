/* ==========================================================================
   Supabase data layer for the T2W Pipeline Asset Register.

   The page was built to read a data.json file sitting next to it and to write
   edits back into the .xlsx workbook. This file repoints both ends at Supabase
   without touching the rest of the page:

     LOAD  overrides window.LOAD_DATA, pages the whole table out of PostgREST
           and reshapes it into the {cols, rows} structure setData() expects.

     EDIT  the page decides whether editing is allowed with canEdit(), which
           asks whether workbook bytes are loaded. That is replaced here, up
           front, so the table renders in editable form from the first paint.

     SAVE  adds a "Save to Supabase" button beside the existing Excel one and
           writes pending edits back — PATCH for changed records, POST for
           assets added through "+ Add asset".

   The workbook path is left intact: open a workbook and the Excel save still
   works exactly as before.

   Load order matters: this file must come after the page's own scripts.
   ========================================================================== */
(function () {
  'use strict';

  var CFG = window.SUPABASE_CONFIG;
  if (!CFG) { console.error('supabase-config.js did not load'); return; }

  var REST = String(CFG.url).replace(/\/+$/, '') + '/rest/v1/';
  var TABLE = encodeURIComponent(CFG.table);
  var PAGE = CFG.pageSize || 1000;
  var LIVE = false;   // true once rows are in and writes are safe to attempt

  function headers(extra) {
    var h = { apikey: CFG.key, Authorization: 'Bearer ' + CFG.key };
    if (extra) for (var k in extra) h[k] = extra[k];
    return h;
  }

  /* ---------- take over the edit gate immediately ----------
     canEdit() is consulted while the results table is being built — it decides
     whether the row-select checkbox column exists and whether the detail drawer
     renders inputs or plain text. setData() renders the table, and that happens
     before the fetch resolves, so this cannot wait until the data arrives or
     the first paint comes out read-only. */
  if (CFG.allowWrites !== false && typeof window.canEdit === 'function') {
    window.WB = window.WB || {};
    window.WB.name = 'Supabase · ' + CFG.table;
    window.canEdit = function () { return LIVE || !!(window.WB && window.WB.bytes); };
  }

  /* ---------- column-name normalisation ----------
     Supabase columns may be titled "Record Key" or "Chainage Start (m)" while
     the page addresses them as record_key / chainage_start_m. Reuse the page's
     own snakeHeader() when it exists so both sides agree exactly. */
  function norm(name) {
    if (typeof window.snakeHeader === 'function') return window.snakeHeader(String(name));
    return String(name).toLowerCase()
      .replace(/&/g, 'and').replace(/\(m\)/g, 'm').replace(/\(mm\)/g, 'mm')
      .replace(/\?/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  }

  var COLMAP = {};   // normalised name -> real Supabase column name
  var REALCOLS = []; // real column names, in table order

  /* ---------- Excel-serial <-> ISO date ----------
     The page holds dates as Excel serial numbers because that is what the
     workbook uses. Supabase holds them as ISO text/date. Convert on the way in
     and on the way out so the date pickers keep working. */
  var EPOCH_MS = Date.UTC(1899, 11, 30);
  function isoToSerialLocal(v) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(v || '').trim());
    if (!m) return null;
    return Math.round((Date.UTC(+m[1], +m[2] - 1, +m[3]) - EPOCH_MS) / 86400000);
  }
  function serialToIsoLocal(n) {
    if (typeof n !== 'number' || !isFinite(n)) return null;
    var d = new Date(EPOCH_MS + n * 86400000);
    return d.getUTCFullYear() + '-' +
           String(d.getUTCMonth() + 1).padStart(2, '0') + '-' +
           String(d.getUTCDate()).padStart(2, '0');
  }

  /* ---------- HTTP ---------- */
  function req(path, opts) {
    return fetch(REST + path, opts || {}).then(function (res) {
      if (res.ok) return res;
      return res.text().then(function (body) {
        var msg = 'Supabase returned HTTP ' + res.status;
        try { var j = JSON.parse(body); if (j.message) msg += ' — ' + j.message; }
        catch (e) { if (body) msg += ' — ' + body.slice(0, 300); }
        if (res.status === 401) msg += '\nThe key in supabase-config.js was rejected.';
        if (res.status === 404) msg += '\nNo table called "' + CFG.table + '".';
        throw new Error(msg);
      });
    });
  }

  /* Read one row purely to learn the column names. */
  function discoverColumns() {
    return req(TABLE + '?select=*&limit=1', { headers: headers() })
      .then(function (r) { return r.json(); })
      .then(function (rows) {
        if (!rows.length) {
          throw new Error(
            'The table returned zero rows.\n\n' +
            'Most often this is Row Level Security: the table has RLS on but no ' +
            'SELECT policy, so Supabase returns an empty list rather than an error. ' +
            'Run supabase-setup.sql in the Supabase SQL Editor to add a read policy.');
        }
        REALCOLS = Object.keys(rows[0]);
        COLMAP = {};
        REALCOLS.forEach(function (c) { COLMAP[norm(c)] = c; });

        if (!COLMAP[norm(CFG.keyColumn)]) {
          console.warn('No column matching keyColumn "' + CFG.keyColumn +
            '" — saving is disabled. Columns found: ' + REALCOLS.join(', '));
        }
        return REALCOLS;
      });
  }

  /* Page the whole table out. Ordered so paging is stable. */
  function fetchAllRows() {
    var orderCol = COLMAP[norm(CFG.keyColumn)] || REALCOLS[0];
    var out = [];
    function page(from) {
      var url = TABLE + '?select=*&order=' + encodeURIComponent(orderCol) + '.asc';
      return req(url, {
        headers: headers({ Range: from + '-' + (from + PAGE - 1), 'Range-Unit': 'items' })
      })
        .then(function (r) { return r.json(); })
        .then(function (batch) {
          out = out.concat(batch);
          if (batch.length < PAGE) return out;
          return page(from + PAGE);
        });
    }
    return page(0);
  }

  /* ---------- reshape objects into the page's {cols, rows} ---------- */
  function toDataset(objects) {
    var NUMERIC = window.NUMERIC || {};
    var DATEISH = window.DATEISH || {};
    var cols = REALCOLS.map(norm);

    var rows = objects.map(function (o) {
      return REALCOLS.map(function (real, i) {
        var v = o[real], c = cols[i];
        if (v === null || v === undefined || v === '') return null;
        if (DATEISH[c]) {
          if (typeof v === 'number') return v;
          var s = isoToSerialLocal(v);
          return s === null ? v : s;
        }
        if (NUMERIC[c]) {
          var n = Number(String(v).replace(/,/g, '').trim());
          return isFinite(n) ? n : null;
        }
        return v;
      });
    });

    return { cols: cols, rows: rows, drawings: [], dq: [],
             meta: { generated: new Date().toISOString(),
                     source: 'Supabase · ' + CFG.table } };
  }

  /* ---------- finish wiring edit mode once rows are in ----------
     stageEdit() asks for a spreadsheet cell reference for each change. There is
     no spreadsheet here, so a stand-in WB is supplied whose header list is the
     real Supabase column names. The reference it produces is only ever shown in
     the review dialog — nothing writes to a cell. */
  function enableSupabaseEditing() {
    if (CFG.allowWrites === false) return;

    window.WB = window.WB || {};
    window.WB.name = 'Supabase · ' + CFG.table;
    window.WB.hdr = REALCOLS.slice();
    window.WB.keyRow = {};

    var kc = window.D.C[norm(CFG.keyColumn)];
    if (kc != null) {
      window.D.rows.forEach(function (r, i) {
        if (r[kc] != null) window.WB.keyRow[String(r[kc])] = i + 2;
      });
    }

    // normalised field -> real Supabase column, used by stageEdit via cellRef
    window.HDR_OF = {};
    REALCOLS.forEach(function (c) { window.HDR_OF[norm(c)] = c; });

    LIVE = true;
    swapSaveButton();

    // the first render happened while LIVE was false; redraw so the checkbox
    // column and the drawer's inputs appear
    if (typeof window.apply === 'function') window.apply();
    if (typeof window.refreshEditUI === 'function') window.refreshEditUI();
  }

  function swapSaveButton() {
    var bar = document.getElementById('editBar');
    var excelBtn = document.getElementById('btnSave');
    if (!bar || !excelBtn || document.getElementById('btnSaveSupabase')) return;

    var btn = document.createElement('button');
    btn.id = 'btnSaveSupabase';
    btn.className = excelBtn.className;
    btn.textContent = 'Save to Supabase';
    btn.addEventListener('click', saveToSupabase);
    bar.insertBefore(btn, excelBtn);

    // the Excel button only means anything once a real workbook is open
    excelBtn.style.display = 'none';

    var origRefresh = window.refreshEditUI;
    window.refreshEditUI = function () {
      if (typeof origRefresh === 'function') origRefresh();
      var n = Object.keys(window.PENDING || {}).length +
              (window.NEW_ASSETS ? window.NEW_ASSETS.length : 0);
      btn.disabled = !n;
      btn.textContent = n ? ('Save ' + n + ' change' + (n > 1 ? 's' : '') + ' to Supabase')
                          : 'Save to Supabase';
      excelBtn.style.display = (window.WB && window.WB.bytes) ? '' : 'none';
      var st = document.getElementById('editState');
      if (st && !(window.WB && window.WB.bytes)) {
        st.textContent = st.textContent.replace(/^undefined/, 'Supabase · ' + CFG.table);
      }
    };
  }

  /* ---------- write pending edits back ---------- */
  function outValue(field, v) {
    var DATEISH = window.DATEISH || {};
    if (DATEISH[field] && typeof v === 'number') return serialToIsoLocal(v);
    return (v === '' ? null : v);
  }

  function saveToSupabase() {
    var PENDING = window.PENDING || {};
    var adds = (window.NEW_ASSETS || []).slice();
    var ids = Object.keys(PENDING);
    if (!ids.length && !adds.length) return;

    var keyCol = COLMAP[norm(CFG.keyColumn)];
    if (!keyCol) {
      toastSafe('No "' + CFG.keyColumn + '" column in Supabase — cannot match records');
      return;
    }

    // group edits by record so each record is one request
    var byKey = {}, skipped = [];
    ids.forEach(function (id) {
      var p = PENDING[id];
      var real = COLMAP[p.field];
      if (!real) { skipped.push(p.field); return; }
      (byKey[p.key] = byKey[p.key] || {})[real] = outValue(p.field, p.value);
    });
    if (skipped.length) {
      console.warn('These fields have no matching Supabase column and were skipped:',
                   skipped.join(', '));
    }

    var keys = Object.keys(byKey);
    var btn = document.getElementById('btnSaveSupabase');
    if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }

    var okEdits = 0, okAdds = 0, failed = [];

    function patchNext(i) {
      if (i >= keys.length) return insertAdds();
      var key = keys[i];
      return req(TABLE + '?' + encodeURIComponent(keyCol) + '=eq.' + encodeURIComponent(key), {
        method: 'PATCH',
        headers: headers({ 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
        body: JSON.stringify(byKey[key])
      })
        .then(function () { okEdits++; })
        .catch(function (e) { failed.push(key + ': ' + e.message); })
        .then(function () { return patchNext(i + 1); });
    }

    function insertAdds() {
      if (!adds.length) return finish();
      var payload = adds.map(function (a) {
        var o = {};
        Object.keys(a.values).forEach(function (f) {
          var real = COLMAP[f];
          if (real) o[real] = outValue(f, a.values[f]);
        });
        o[keyCol] = a.key;
        return o;
      });
      return req(TABLE, {
        method: 'POST',
        headers: headers({ 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
        body: JSON.stringify(payload)
      })
        .then(function () { okAdds = adds.length; })
        .catch(function (e) { failed.push('new assets: ' + e.message); })
        .then(finish);
    }

    function finish() {
      if (failed.length) {
        console.error('Supabase save failures:\n' + failed.join('\n'));
        toastSafe('Saved ' + (okEdits + okAdds) + ' of ' + (keys.length + adds.length) +
                  ' — ' + failed.length + ' failed (see console)');
      } else {
        // only clear the queues when everything landed
        Object.keys(window.PENDING).forEach(function (k) { delete window.PENDING[k]; });
        if (window.NEW_ASSETS) window.NEW_ASSETS.length = 0;
        var n = okEdits + okAdds;
        toastSafe('Saved ' + n + ' record' + (n > 1 ? 's' : '') + ' to Supabase');
      }
      if (typeof window.refreshEditUI === 'function') window.refreshEditUI();
    }

    patchNext(0);
  }

  function toastSafe(msg) {
    if (typeof window.toast === 'function') window.toast(msg);
    else console.log(msg);
  }

  /* ---------- the override the page actually calls ---------- */
  window.LOAD_DATA = function () {
    discoverColumns()
      .then(fetchAllRows)
      .then(function (objects) {
        var ds = toDataset(objects);
        window.setData(ds);

        // key -> row index, normally built while indexing the workbook
        window.D.keyIndex = {};
        var kc = window.D.C[norm(CFG.keyColumn)];
        if (kc != null) {
          window.D.rows.forEach(function (r, i) {
            if (r[kc] != null) window.D.keyIndex[String(r[kc])] = i;
          });
        }

        if (typeof window.setDataAsAt === 'function') window.setDataAsAt(ds.meta.generated);
        enableSupabaseEditing();
        if (typeof window.ready === 'function') window.ready();
        console.log('Loaded ' + ds.rows.length + ' records from Supabase table "' +
                    CFG.table + '" — editing ' +
                    (CFG.allowWrites === false ? 'disabled by config' : 'enabled'));
      })
      .catch(function (e) {
        console.error('Supabase load failed:', e);
        if (typeof window.dataError === 'function') window.dataError(e.message);
      });
  };
})();
