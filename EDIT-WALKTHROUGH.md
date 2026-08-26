# How to update the register

The whole loop:

```
open edit.html  →  open the workbook  →  filter  →  select  →  apply  →  save  →  commit  →  push
```

Cloudflare rebuilds the site from the workbook on every push, so what you save is what
gets published.

---

## Worked example: closing out an alignment sheet

Say the crew has finished everything on sheet PHW-009 and the ITP is `ITP-PHW-009-A`.

### 1 · Open the editor

Go to the site and click **Bulk edit →** in the header, or go straight to `/edit.html`.

You'll see the register but a yellow banner says **Read-only**. That's expected — the
page has no file to write to yet.

### 2 · Open the workbook

Click **Open workbook…** and pick `T2W Pipeline Master Asset Register.xlsx`.

The banner disappears, a dark blue edit bar appears, and a checkbox column appears on the
left of the results. You're now editing that actual file.

> On the live site (https) the browser lets the page write straight back to the file you
> picked. Opening `edit.html` off your own disk instead means it can only hand you back a
> saved copy — same result, one extra step. Use the hosted page and it saves in place.

### 3 · Filter to what you're updating

In **Drawing number**, type `PHW-009`. The count drops to 99 records.

Three things worth knowing about the filters:

- **Drawing number** returns every revision of a sheet together. `009`, `PHW-009` and
  `D-DWG-PHW-009.2` all give the same 99 records.
- **Chainage range** defaults to *fully contained* — a trench section running
  4,900–5,200 m will **not** appear in a 5,000–6,000 m search because it starts before
  the window. Tick **Include overlapping** to catch anything straddling your boundary.
  Worth doing before you close out a stretch.
- **Asset type**, **Register** and **Pipeline section** narrow it further, and the text
  box searches descriptions, owners, feature names and comments at once.

Click any column heading to sort. Sorting by **Drawing** sorts by sheet number, not
alphabetically, so sheet 9 comes before sheet 10.

### 4 · Select

Tick the checkbox in the **column header** to select all 99. Or tick rows individually.

The edit bar now reads **99 selected**. Click **review** to see exactly what's in the
selection — a list, plus a summary of which registers, what chainage span and how many
sheets it covers. Worth a glance before changing 99 records.

### 5 · Apply

In the edit bar: **Set** → choose `Test Document No` → type `ITP-PHW-009-A` →
**Apply to selected**. Confirm.

Repeat for the others:

| Set | To |
|---|---|
| `Installed` | `Yes` (offered as a dropdown) |
| `Install Date` | pick the date |
| `Test Status` | `Passed` |
| `Complete` | `Yes` |

Each one is a single action across all 99. The bar keeps a running count —
`297 edits unsaved` after three fields.

**Clear field** does the opposite: blanks that field across the selection. Useful when
something was set in error.

The field list is deliberately shorter than the single-record form. Chainage, register
and identity fields aren't bulk-settable, because setting those across many records at
once is nearly always a mistake.

### 6 · Check before saving

Click **Review changes**. Every change is listed with its record, the old value, the new
value and the exact cell it will write to. Anything wrong, click **undo** on that line.

### 7 · Save

Click **Save 297 changes to Excel**. First time each session it asks your name — that
goes in the Edit Log against every change.

On the hosted site the file is written in place. Opened locally, it downloads a copy —
replace the original with it.

### 8 · Commit and push

Put the updated workbook in your local copy of the repo, then commit and push. Or, via
the GitHub website: open the repo, click the workbook, **Upload files**, drop the new
version in, commit.

Cloudflare rebuilds within a minute or two. Refresh the site and the progress line under
the filters shows the new numbers.

---

## Editing a single record

Click any row → **Edit** in the drawer header. Every editable field, grouped. Change
what you need, close the drawer, save as above.

Locked deliberately: Record Key, Asset ID, Register, Source File, Source Row, and Length.
Length is an Excel formula — writing a value there would destroy it. Change a chainage
instead and Length recalculates when Excel opens the file.

## Adding an asset

**+ Add asset** in the edit bar. Register and Asset Type are linked dropdowns built from
what's already in the data. Enter section and chainage and it works out the Record Key
and the alignment sheet for you, and shows them before you commit.

It warns — but doesn't block — on a chainage outside that section's known range, a
duplicate Asset ID, or an end before a start. New assets are inserted in chainage order.

## Adding a new column

Not from the browser. Add it in Excel, push, and the site picks it up automatically —
the build reads the header row rather than a fixed list. Anything you add becomes
filterable and editable next deploy.

---

## Things worth knowing

**Nothing is written until you press Save.** Changes are held in the page. Closing the
tab with unsaved changes prompts you first.

**Every change is logged.** The Edit Log sheet in the workbook records who, when, the
previous value, the new value and the cell — one row per field per record. 99 records ×
3 fields is 297 log rows. That's the point: a changed depth or install status is
attributable.

**Saving does not damage the workbook.** It rewrites only the cells you changed, inside
the file, leaving formatting, formulas, dropdowns, conditional formatting and the other
eleven sheets byte-for-byte identical. Verified: of roughly 500 internal parts, exactly
three change.

**Dates are stored as real dates**, not text, so they sort and filter properly in Excel.

**Two people editing at once will clash.** Whoever saves and pushes last wins. Fine for
one person updating a stretch at a time; not a multi-user system. If several people need
to update simultaneously, that's the SharePoint List and Power App route.

**The bulk field list is intentionally limited.** Progress, ownership, permits, survey,
clearances and notes. If you need to bulk-set something outside that, tell me and I'll
add it.

## If something looks wrong

| What you see | What it means |
|---|---|
| Banner says read-only | No workbook open. Click **Open workbook…** |
| No checkbox column | Same — the column only appears once a workbook is open |
| Site hasn't changed after pushing | Check the Cloudflare build log. A failed build leaves the previous version live |
| `Nothing matches` | A filter is narrower than you think. **Clear all** and start again |
| A record shows ⚠ | It has a data quality exception. Click the row to read it |
| `DER` beside a drawing | That sheet was inferred from chainage, not stated in the source |
