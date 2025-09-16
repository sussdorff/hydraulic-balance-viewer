# Testing Guide

## 🧪 Test Environment Setup

### Local Testing
```bash
# Development server (with hot reload)
npm run dev
# Open: http://localhost:5173

# Production build test
npm run build
npm run preview
# Open: http://localhost:4173
```

### Test Data Files
```bash
# Sample data (18 rooms)
sample-data.json

# Real production data
/Users/malte/Documents/Haus/2025 - Wärmepumpe/Angabe Energetischer Zustand/hydraulischer-abgleich-daten.json
```

---

## ✅ Manual Testing Checklist

### 1. File Operations
- [ ] **Upload via button**: Click "JSON hochladen", select file
- [ ] **Upload via drag-drop**: Drag JSON onto page
- [ ] **Invalid file rejection**: Try uploading non-JSON file
- [ ] **Export functionality**: Click "JSON exportieren", verify download
- [ ] **Print functionality**: Click "Drucken", verify print preview

### 2. Room Navigation
- [ ] **Floor tabs**: Click each floor tab (KG/EG/OG/DG)
- [ ] **Room selection**: Click different rooms in sidebar
- [ ] **Active highlighting**: Selected room shows blue background
- [ ] **Room counts**: Verify badge numbers match actual rooms

### 3. Room Editing
- [ ] **Edit basic fields**: Change name, temperature, size
- [ ] **Auto-calculations**: Change size/height, verify volume updates
- [ ] **Add radiator**: Click +, fill fields, verify save
- [ ] **Delete radiator**: Click X, verify removal
- [ ] **Add window**: Click +, enter dimensions, verify area calc
- [ ] **Add door**: Similar to window test

### 4. View Switching
- [ ] **Detail → Table**: Click table icon, verify data shows
- [ ] **Table → Detail**: Click detail icon, return to editor
- [ ] **Table sorting**: Click column headers, verify sort
- [ ] **Modal from table**: Click row, verify modal opens

### 5. Data Integrity
- [ ] **Persistence**: Edit room, switch to another, return - data saved
- [ ] **Export completeness**: Export, reimport, verify all data
- [ ] **Complex fields**: Edit nested objects (angrenzende_unbeheizte_bereiche)

---

## 🤖 Automated Browser Testing

### Using Browser Test Runner Agent
```bash
# Invoke the test agent
@agent-browser-test-runner

# Provide test instructions:
Test the application at http://localhost:4173 with:
- File: /path/to/test-data.json
- Test all CRUD operations
- Verify calculations
- Check print functionality
```

### Key Test Scenarios

#### Scenario 1: Complete Room Edit
```
1. Upload sample-data.json
2. Select "Gästezimmer"
3. Change:
   - Name to "Test Gästezimmer"
   - Size from 20.6 to 25 m²
   - Add new window (1.5m × 1.2m)
4. Verify:
   - Volume updates to 55 m³
   - Window area shows 1.8 m²
   - Sidebar shows new name
5. Export and verify changes in JSON
```

#### Scenario 2: Floor Management
```
1. Navigate to each floor
2. Add new room to KG
3. Verify count increases
4. Delete room
5. Verify count decreases
```

#### Scenario 3: Print Report
```
1. Load data
2. Click "Drucken" button
3. Verify print preview shows:
   - Header with building info
   - Summary statistics
   - All rooms grouped by floor
   - Proper formatting
4. Cancel print dialog
```

---

## 🔍 Browser Console Testing

### Check Application State
```javascript
// Get Vue app instance
app = document.querySelector('#app').__vue_app__

// Inspect building data
app.config.globalProperties.buildingData

// Check current room
app.config.globalProperties.currentEditRoomIndex

// Trigger methods
app.config.globalProperties.exportJSON()
```

### Debug Component State
```javascript
// Get specific component
editor = document.querySelector('.room-editor').__vueParentComponent

// Check props
editor.proxy.$props

// Check local state
editor.proxy.localRoom
```

### Performance Monitoring
```javascript
// Measure render time
console.time('render')
app.config.globalProperties.buildingData = newData
console.timeEnd('render')

// Check memory usage
console.log(performance.memory)
```

---

## 🐛 Common Issues & Solutions

### Issue: Changes Not Persisting
**Test**: Edit field, switch rooms, return
**Expected**: Changes remain
**Debug**:
```javascript
// Check if updateRoom is called
console.log('Updating room', index, room)
```

### Issue: Calculations Not Updating
**Test**: Change room dimensions
**Expected**: Volume auto-updates
**Debug**:
```javascript
// In RoomEditor.js
calculateVolume() {
  console.log('Calculating:', this.localRoom.raumgroesse_m2, '×', this.localRoom.raumhoehe_m)
  // ...
}
```

### Issue: Modal Not Opening
**Test**: Click table row
**Expected**: Modal appears
**Debug**:
```javascript
// Check event binding
@click="showRoomDetails(room, index)"
// Verify showModal state
console.log(app.config.globalProperties.showModal)
```

---

## 📊 Test Data Variations

### Minimal Test Case
```json
{
  "gebaeude": {},
  "raeume": [{
    "stockwerk": "Erdgeschoss",
    "raumbezeichnung": "Test",
    "raumgroesse_m2": 10
  }]
}
```

### Edge Cases to Test
```json
{
  "raeume": [{
    // Room with all arrays empty
    "heizkoerper": [],
    "fenster": [],
    "tueren": [],

    // Room with special characters
    "raumbezeichnung": "Büro/Gäste-WC",

    // Room with extreme values
    "norm_innentemperatur_c": 30,
    "raumgroesse_m2": 0.5,

    // Room with missing optional fields
    // (no zusaetzliche_heizquelle)
  }]
}
```

### Stress Test Data
- 50+ rooms
- 10+ windows per room
- Long room names
- Deep nesting in angrenzende_unbeheizte_bereiche

---

## ✔️ Regression Testing

### After Code Changes
1. **Build test**: `npm run build` - no errors
2. **Upload/Export cycle**: Data round-trips correctly
3. **All calculations**: Volume, areas compute correctly
4. **UI responsiveness**: No lag with 18+ rooms
5. **Print output**: Formatted correctly

### Browser Compatibility
Test in:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (macOS)
- [ ] Mobile Chrome (responsive mode)

---

## 📈 Performance Benchmarks

### Acceptable Limits
- File upload: < 1 second for 1MB JSON
- Room switch: < 100ms response
- Export generation: < 500ms
- Print preview: < 2 seconds

### How to Measure
```javascript
// In browser console
performance.mark('start')
// Perform action
performance.mark('end')
performance.measure('action', 'start', 'end')
console.log(performance.getEntriesByType('measure'))
```

---

## 🔧 Testing Tools

### Browser DevTools
- **Network tab**: Check no failed requests
- **Console**: No errors (Vue dev warning ok)
- **Performance tab**: Check for jank
- **Memory tab**: No leaks over time

### Vue DevTools Extension
- Install from browser store
- Inspect component tree
- Watch state changes
- Track events

### Accessibility Testing
- **Keyboard navigation**: Tab through all inputs
- **Screen reader**: Test with NVDA/JAWS
- **Color contrast**: Use Chrome DevTools

---

## 📝 Test Report Template

```markdown
## Test Report - [Date]

### Environment
- Browser: Chrome 120
- OS: macOS 14
- Test Data: sample-data.json

### Test Results
✅ File Operations: PASS
✅ Room CRUD: PASS
✅ Calculations: PASS
✅ Print Function: PASS
❌ Issue Found: [Description]

### Performance
- Load time: 0.8s
- Export time: 0.3s
- Memory usage: 45MB

### Notes
[Any observations or recommendations]
```