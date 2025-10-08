# UI Functional Test Plan
## Hydraulic Balance Viewer Application

**Test Suite**: UI Functional Tests
**Application**: Hydraulic Balance Viewer
**Version**: 1.0
**Last Updated**: 2025-10-08

---

## Test Environment

**Application URL**: `http://localhost:5173`
**Prerequisites**:
- Development server must be running (`npm run dev`)
- Sample test data file available at: `/Users/malte/code/house-projects/hydraulic-balance-viewer/sample-data.json`

**Test Data Overview**:
- 4 rooms total (2 in EG, 2 in OG)
- Rooms: Wohnzimmer, Küche, Schlafzimmer, Kinderzimmer
- Contains building info, heating system data, windows, radiators

---

## Test Cases

### TC-01: Application Load Test
**Priority**: Critical
**Objective**: Verify application loads successfully without errors

**Steps**:
1. Navigate to `http://localhost:5173`
2. Take snapshot to verify page structure
3. Check console for JavaScript errors

**Expected Results**:
- Page loads successfully
- Page title contains "Hydraulischer Abgleich - Datenübersicht"
- Main UI elements visible:
  - Header with title
  - View toggle buttons (Detailansicht, Tabellenansicht)
  - Action buttons (JSON hochladen, JSON exportieren, Druckvorschau)
  - Empty state message: "Keine Räume vorhanden"
- Export and Print buttons are disabled (no data loaded)
- Only expected warnings in console (missing favicon, Vue dev mode)
- No JavaScript errors

**Assertions**:
```
✓ Page title = "Hydraulischer Abgleich - Datenübersicht"
✓ Element exists: "JSON hochladen" button (enabled)
✓ Element exists: "JSON exportieren" button (disabled)
✓ Element exists: "Druckvorschau" button (disabled)
✓ Console errors = 0 (excluding favicon 404)
```

---

### TC-02: JSON File Upload
**Priority**: Critical
**Objective**: Verify JSON data upload functionality

**Test Data**: `sample-data.json` (4 rooms, building info, heating data)

**Steps**:
1. Ensure application is loaded (empty state)
2. Take snapshot to find "JSON hochladen" button UID
3. Upload `sample-data.json` using the upload button
4. Take snapshot after upload
5. Check console for errors

**Expected Results**:
- File upload succeeds
- Data loads correctly
- Floor tabs appear with room counts:
  - KG: 0 rooms
  - EG: 2 rooms
  - OG: 2 rooms
  - DG: 0 rooms
- Export and Print buttons become enabled
- No JavaScript errors in console

**Assertions**:
```
✓ Element exists: "EG 2" tab
✓ Element exists: "OG 2" tab
✓ Button "JSON exportieren" is enabled
✓ Button "Druckvorschau" is enabled
✓ Console errors = 0
```

---

### TC-03: Floor Navigation
**Priority**: High
**Objective**: Verify floor tab navigation displays correct rooms

**Prerequisites**: Sample data loaded (TC-02 passed)

**Steps**:
1. Take snapshot to verify initial state
2. Click "EG 2" tab
3. Take snapshot to verify EG rooms appear
4. Verify rooms: "Wohnzimmer" and "Küche" are visible
5. Click "OG 2" tab
6. Take snapshot to verify OG rooms appear
7. Verify rooms: "Schlafzimmer" and "Kinderzimmer" are visible

**Expected Results**:
- EG tab shows 2 rooms with correct names and details:
  - Wohnzimmer (Wohnen • 35.5 m²)
  - Küche (Küche • 18.2 m²)
- OG tab shows 2 rooms with correct names and details:
  - Schlafzimmer (Schlafen • 22 m²)
  - Kinderzimmer (Wohnen • 18.5 m²)
- Tab selection visual state updates correctly

**Assertions**:
```
✓ EG tab: Element exists "Wohnzimmer"
✓ EG tab: Element exists "Küche"
✓ OG tab: Element exists "Schlafzimmer"
✓ OG tab: Element exists "Kinderzimmer"
✓ Room cards show usage and size
```

---

### TC-04: Room Selection - Detail View
**Priority**: Critical
**Objective**: Verify clicking a room displays its details

**Prerequisites**: Sample data loaded, EG tab selected

**Steps**:
1. Click "EG 2" tab (if not already selected)
2. Take snapshot to find Wohnzimmer room card
3. Click "Wohnzimmer" room using evaluate_script (cursor-pointer element)
4. Take snapshot after click
5. Verify detail panel updates

**Expected Results**:
- Room detail panel appears on the right
- Header shows: "Wohnzimmer - Erdgeschoss"
- Basic data section displays:
  - Raumbezeichnung: Wohnzimmer
  - Norm-Innentemperatur: 21°C
  - Raumgröße: 35.5 m²
  - Raumhöhe: 2.5 m
- Radiator section shows "Heizkörper 1"
- Windows section shows 2 windows:
  - Fenster 1: Kunststoff, 3-fach Verglasung, 1.4×1.5 m
  - Fenster 2 (Terrassentür): Kunststoff, 3-fach Verglasung, 2.2×2.0 m
- Room card is highlighted/selected in sidebar

**Assertions**:
```
✓ Heading = "Wohnzimmer - Erdgeschoss"
✓ Field "Raumbezeichnung" value = "Wohnzimmer"
✓ Field "Norm-Innentemperatur (°C)" value = "21"
✓ Field "Raumgröße (m²)" value = "35.5"
✓ Field "Raumhöhe (m)" value = "2.5"
✓ Element exists: "Fenster 1"
✓ Element exists: "Fenster 2"
✓ Window 1: Beschreibung = "Fenster Nord"
✓ Window 2: Beschreibung = "Terrassentür"
```

---

### TC-05: Table View Toggle
**Priority**: High
**Objective**: Verify switching to table view displays all rooms correctly

**Prerequisites**: Sample data loaded

**Steps**:
1. Ensure in detail view
2. Take snapshot to find "Tabellenansicht" button
3. Click "Tabellenansicht" button
4. Take snapshot after view change
5. Verify table displays all rooms

**Expected Results**:
- View changes to table layout
- Heading changes to: "Raumübersicht - Tabellenansicht"
- Table displays all 4 rooms with columns:
  - Stockwerk (EG, EG, OG, OG)
  - Raum (Küche, Wohnzimmer, Kinderzimmer, Schlafzimmer)
  - Nutzung (Küche, Wohnen, Wohnen, Schlafen)
  - Fläche (m²) (18.2, 35.5, 18.5, 22)
  - Temp (°C) (20, 21, 21, 18)
  - Aktionen (Edit/Delete buttons for each)
- Data matches expected sample data

**Assertions**:
```
✓ Heading = "Raumübersicht - Tabellenansicht"
✓ Table row exists: EG, Küche, Küche, 18.2, 20
✓ Table row exists: EG, Wohnzimmer, Wohnen, 35.5, 21
✓ Table row exists: OG, Kinderzimmer, Wohnen, 18.5, 21
✓ Table row exists: OG, Schlafzimmer, Schlafen, 22, 18
✓ Each row has Edit and Delete buttons
```

---

### TC-06: Return to Detail View
**Priority**: Medium
**Objective**: Verify switching back to detail view works

**Prerequisites**: Currently in table view (TC-05 passed)

**Steps**:
1. Take snapshot to find "Detailansicht" button
2. Click "Detailansicht" button
3. Take snapshot after view change
4. Verify returned to floor/room selection view

**Expected Results**:
- View changes back to detail view layout
- Floor tabs visible (KG, EG, OG, DG)
- Room list visible (depends on selected floor)
- Detail panel shows either empty state or previously selected room

**Assertions**:
```
✓ Heading = "Stockwerke & Räume"
✓ Element exists: Floor tabs
✓ View matches initial detail view layout
```

---

### TC-07: JSON Export Functionality
**Priority**: Critical
**Objective**: Verify JSON export downloads data correctly

**Prerequisites**: Sample data loaded

**Steps**:
1. Take snapshot to find "JSON exportieren" button
2. Verify button is enabled
3. Click "JSON exportieren" button
4. Take snapshot after click
5. Check for success message

**Expected Results**:
- Export button triggers download
- Success message appears: "JSON-Datei wurde heruntergeladen"
- File downloads to browser's download location
- No errors in console

**Assertions**:
```
✓ Button "JSON exportieren" is enabled
✓ After click: Message appears "JSON-Datei wurde heruntergeladen"
✓ Console errors = 0
```

**Note**: Actual file download verification requires file system check (out of scope for browser testing)

---

### TC-08: Print Preview Generation
**Priority**: High
**Objective**: Verify print preview generates complete documentation

**Prerequisites**: Sample data loaded

**Steps**:
1. Take snapshot to find "Druckvorschau" button
2. Click "Druckvorschau" button
3. Take snapshot of print preview modal
4. Verify preview content structure
5. Close preview

**Expected Results**:
- Print preview modal/overlay appears
- Header shows: "Hydraulischer Abgleich - Technische Dokumentation"
- Building summary section displays:
  - Anzahl Räume: 4
  - Gesamtfläche: 94.2 m²
  - Baujahr: 1985
  - Datum: Current date
- Each floor section (EG, OG) is present
- Each room section contains:
  - Room name and usage type
  - Grunddaten (basic data: temperature, size, height)
  - Heizkörper details
  - Fenster details with dimensions and U-values
- Instructions shown: "Verwenden Sie CMD+P (Mac) oder Strg+P (Windows) zum Drucken"
- Close button (✕) is available

**Assertions**:
```
✓ Heading = "Hydraulischer Abgleich - Technische Dokumentation"
✓ Element exists: "Anzahl Räume: 4"
✓ Element exists: "Gesamtfläche: 94.2 m²"
✓ Section exists: "Erdgeschoss (EG) - 2 Raum/Räume"
✓ Section exists: "Obergeschoss (OG) - 2 Raum/Räume"
✓ Room details present: Wohnzimmer, Küche, Schlafzimmer, Kinderzimmer
✓ Window details present with U-values
✓ Button exists: "Vorschau schließen" (✕)
```

---

### TC-09: Multiple Room Selection
**Priority**: Medium
**Objective**: Verify selecting different rooms updates details correctly

**Prerequisites**: Sample data loaded

**Steps**:
1. Select EG tab
2. Click "Wohnzimmer" room
3. Verify detail view shows Wohnzimmer (21°C, 35.5 m²)
4. Click "Küche" room
5. Verify detail view updates to Küche (20°C, 18.2 m²)
6. Select OG tab
7. Click "Schlafzimmer" room
8. Verify detail view shows Schlafzimmer (18°C, 22 m², Holz-Alu windows)

**Expected Results**:
- Each room selection updates the detail panel
- Correct room data displays for each selection
- Previously selected room is deselected
- New room is highlighted

**Assertions**:
```
✓ Wohnzimmer: Temperature = 21, Size = 35.5
✓ Küche: Temperature = 20, Size = 18.2
✓ Schlafzimmer: Temperature = 18, Size = 22
✓ Schlafzimmer: Window type = "Holz-Alu"
```

---

## Test Execution Notes

### Known Issues (Non-Critical)
- Missing favicon results in 404 error (cosmetic, no functional impact)
- Vue development build warning (expected in dev environment)

### Browser Compatibility
- Primary target: Chrome/Chromium (via Chrome DevTools MCP)
- Application designed for modern browsers with ES6+ support

### Test Data Requirements
- Sample data file must contain valid JSON structure
- Must include: gebaeude, heizungssystem, raeume array
- Rooms must have: id, stockwerk, raumbezeichnung, raumgroesse_m2, norm_innentemperatur_c

### Performance Expectations
- Initial page load: < 2 seconds
- Data upload and parse: < 1 second
- View transitions: < 500ms
- Print preview generation: < 2 seconds

---

## Success Criteria

**Test Suite Passes When**:
- All Critical priority tests pass (TC-01, TC-02, TC-04, TC-07)
- At least 90% of all tests pass
- No critical JavaScript errors in console
- Core user workflows function correctly:
  - Load app → Upload data → View rooms → Export/Print

**Test Suite Fails When**:
- Any Critical priority test fails
- JavaScript errors prevent core functionality
- Data corruption or loss occurs
- UI becomes unresponsive

---

## Automation Notes

This test plan is designed for execution by the `chrome-devtools-tester` agent.

**Agent Execution Command**:
```bash
Task tool with subagent_type: chrome-devtools-tester
Prompt: Execute test plan from tests/ui-functional-tests.md
```

**Expected Agent Behavior**:
1. Read this test plan
2. Execute each test case in order
3. Use snapshots primarily for verification
4. Capture console messages after each test
5. Generate structured JSON test report
6. Report pass/fail status for each test case
