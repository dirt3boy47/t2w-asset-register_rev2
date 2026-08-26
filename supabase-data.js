/* ==========================================================================
   Supabase data layer for the T2W Pipeline Asset Register.

   The page was built to read a data.json file sitting next to it and to write
   edits back into the .xlsx workbook. This file repoints both ends at Supabase
   without touching the rest of the page:

     LOAD  overrides window.LOAD_DATA, pages the whole table out of PostgREST
           and reshapes it into the {cols, rows} structure setData() expects.

     SAVE  adds a "Save to Supabase" button beside the existing Excel one and
           PATCHes the pending edits back, matched on record_key.

   The workbook path is left completely intact — open a workbook and the Excel
   save still works exactly as before.

   Load order matters: this file must come after the page's own scripts.
   ========================================================================== */
(function () {
  'use strict';

  var CFG = window.SUPABASE_CONFIG;
  if (!CFG) { console.error('supabase-config.js did not load'); return; }

  var REST = String(CFG.url).replace(/\/+$/, '') + '/rest/v1/';
  var TABLE = encodeURIComponent(CFG.table);
  var PAGE = CFG.pageSize || 1000;

  function headers(extra) {
    var h = { apikey: CFG.key, Authorization: 'Bearer ' + CFG.key };
    if (extra) for (var k in extra) h[k] = extra[k];
    return h;
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
     workbook uses. Supabase holds them as ISO text/date. Convert on the way
     in and on the way out so the date pickers keep working. */
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
    opts = opts || {};
    return fetch(REST + path, opts).then(function (res) {
      if (res.ok) return res;
      return res.text().then(function (body) {
        var msg = 'Supabase returned HTTP ' + res.status;
        try { var j = JSON.parse(body); if (j.message) msg += ' — ' + j.message; }
        catch (e) { if (body) msg += ' — ' + body.slice(0, 300); }
        if (res.status === 401 || res.status === 404) {
          msg += '\n\nCheck the table name and key in supabase-config.js.';
        }
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
        var v = o[real];
        var c = cols[i];
        if (v === null || v === undefined || v === '') return null;

        if (DATEISH[c]) {
          if (typeof v === 'number') return v;          // already a serial
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
             meta: { generated: new Date().toISOString(), source: 'Supabase · ' + CFG.table } };
  }

  /* ---------- put the page into "connected to Supabase" edit mode ----------
     stageEdit() asks for a spreadsheet cell reference for each change. There
     is no spreadsheet here, so a stand-in WB is supplied whose header list is
     the real Supabase column names. The reference it produces is only ever
     shown in the review dialog — nothing writes to a cell. */
  function enableSupabaseEditing() {
    if (!CFG.allowWrites) return;

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

    // the page gates editing on having workbook bytes; Supabase replaces that
    window.canEdit = function () { return true; };

    swapSaveButton();
    if (typeof window.refreshEditUI === 'function') window.refreshEditUI();
  }

  function swapSaveButton() {
    var bar = document.getElementById('editBar');
    var excelBtn = document.getElementById('btnSave');
    if (!bar || !excelBtn) return;

    var btn = document.createElement('button');
    btn.id = 'btnSaveSupabase';
    btn.className = excelBtn.className;
    btn.textContent = 'Save to Supabase';
    btn.addEventListener('click', saveToSupabase);
    bar.insertBefore(btn, excelBtn);

    // The Excel button only means anything once a workbook is actually open.
    excelBtn.style.display = 'none';

    // Keep the Supabase button's label and enabled state in step with PENDING.
    var origRefresh = window.refreshEditUI;
    window.refreshEditUI = function () {
      if (typeof origRefresh === 'function') origRefresh();
      var n = Object.keys(window.PENDING || {}).length;
      btn.disabled = !n;
      btn.textContent = n ? ('Save ' + n + ' change' + (n > 1 ? 's' : '') + ' to Supabase')
                          : 'Save to Supabase';
      // restore the Excel button only if a real workbook got opened later
      excelBtn.style.display = (window.WB && window.WB.bytes) ? '' : 'none';
    };
  }

  /* ---------- write pending edits back ---------- */
  function saveToSupabase() {
    var PENDING = window.PENDING || {};
    var ids = Object.keys(PENDING);
    if (!ids.length) return;

    var DATEISH = window.DATEISH || {};
    var keyCol = COLMAP[norm(CFG.keyColumn)] || CFG.keyColumn;

    // group the changes by record so each record is one request
    var byKey = {};
    ids.forEach(function (id) {
      var p = PENDING[id];
      var real = COLMAP[p.field];
      if (!real) { console.warn('no Supabase column for field', p.field); return; }
      var val = p.value;
      if (DATEISH[p.field] && typeof val === 'number') val = serialToIsoLocal(val);
      (byKey[p.key] = byKey[p.key] || {})[real] = val;
    });

    var keys = Object.keys(byKey);
    var btn = document.getElementById('btnSaveSupabase');
    if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }

    var done = 0, failed = [];

    function next(i) {
      if (i >= keys.length) return finish();
      var key = keys[i];
      return req(TABLE + '?' + encodeURIComponent(keyCol) + '=eq.' + encodeURIComponent(key), {
        method: 'PATCH',
        headers: headers({ 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
        body: JSON.stringify(byKey[key])
      })
        .then(function () { done++; })
        .catch(function (e) { failed.push(key + ': ' + e.message); })
        .then(function () { return next(i + 1); });
    }

    function finish() {
      if (failed.length) {
        console.error('Supabase save failures:', failed);
        toastSafe('Saved ' + done + ' of ' + keys.length + ' records — ' +
                  failed.length + ' failed (see console)');
      } else {
        // only clear the queue when everything landed
        Object.keys(window.PENDING).forEach(function (k) { delete window.PENDING[k]; });
        toastSafe('Saved ' + done + ' record' + (done > 1 ? 's' : '') + ' to Supabase');
      }
      if (typeof window.refreshEditUI === 'function') window.refreshEditUI();
    }

    next(0);
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

        if (typeof window.setDataAsAt === 'function') {
          window.setDataAsAt(ds.meta.generated);
        }
        enableSupabaseEditing();
        if (typeof window.ready === 'function') window.ready();
        console.log('Loaded ' + ds.rows.length + ' records from Supabase table "' +
                    CFG.table + '"');
      })
      .catch(function (e) {
        console.error('Supabase load failed:', e);
        if (typeof window.dataError === 'function') window.dataError(e.message);
      });
  };
})();
