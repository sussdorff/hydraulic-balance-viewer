# Common Development Tasks

## 📝 Adding a New Field to Rooms

### Task: Add "Raumtemperatur_Ist" (actual temperature) field

#### 1. Update Data Model
```javascript
// In src/main.js, createDefaultRoom():
return {
  // ... existing fields
  raumtemperatur_ist: 18,  // Add new field with default
}
```

#### 2. Add to RoomEditor Component
```javascript
// In src/components/RoomEditor.js template:
<div class="col-md-4 mb-3">
  <label class="form-label">Ist-Temperatur (°C)</label>
  <input type="number" class="form-control"
         :value="localRoom.raumtemperatur_ist"
         @input="updateField('raumtemperatur_ist', parseFloat($event.target.value))">
</div>
```

#### 3. Display in RoomModal
```javascript
// In src/components/RoomModal.js template:
<div class="info-row">
  <span class="info-label">Ist-Temperatur:</span>
  <span class="info-value">{{ room.raumtemperatur_ist || '-' }}°C</span>
</div>
```

#### 4. Add to Table View (Optional)
```javascript
// In index.html table headers:
<th @click="sortTable('raumtemperatur_ist')">Ist-Temp (°C)</th>

// In table body:
<td>{{ room.raumtemperatur_ist || '-' }}</td>
```

---

## 🧮 Adding a New Calculation

### Task: Calculate heating requirement (Watt/m²)

#### 1. Add Computed Property
```javascript
// In src/components/RoomEditor.js:
computed: {
  heatingPerSquareMeter() {
    if (!this.localRoom?.heizkoerper || !this.localRoom?.raumgroesse_m2) {
      return 0;
    }
    const totalWatts = this.localRoom.heizkoerper.reduce(
      (sum, hk) => sum + (hk.waermeleistung_55_45_20_watt || 0), 0
    );
    return Math.round(totalWatts / this.localRoom.raumgroesse_m2);
  }
}
```

#### 2. Display Calculation
```javascript
// In template:
<div class="alert alert-info">
  Heizleistung: {{ heatingPerSquareMeter }} W/m²
</div>
```

---

## ✅ Adding Validation Rules

### Task: Validate temperature range (16-26°C)

#### 1. Add Validation Method
```javascript
// In src/components/RoomEditor.js:
methods: {
  validateTemperature(value) {
    if (value < 16 || value > 26) {
      this.showNotification('Temperatur sollte zwischen 16-26°C liegen', 'warning');
      return false;
    }
    return true;
  },

  updateField(field, value) {
    if (field === 'norm_innentemperatur_c') {
      if (!this.validateTemperature(value)) return;
    }
    // ... existing update logic
  }
}
```

#### 2. Add Visual Feedback
```javascript
// Add class binding to input:
<input type="number"
       :class="['form-control', { 'is-invalid': localRoom.norm_innentemperatur_c < 16 || localRoom.norm_innentemperatur_c > 26 }]"
       :value="localRoom.norm_innentemperatur_c">
<div class="invalid-feedback">
  Temperatur außerhalb des empfohlenen Bereichs
</div>
```

---

## 🎨 Modifying the UI Layout

### Task: Add a statistics panel

#### 1. Create Statistics Component
```javascript
// New file: src/components/RoomStatistics.js
export const RoomStatistics = {
  props: ['buildingData'],
  computed: {
    totalRooms() {
      return this.buildingData?.raeume?.length || 0;
    },
    totalArea() {
      return this.buildingData?.raeume?.reduce(
        (sum, r) => sum + (r.raumgroesse_m2 || 0), 0
      ).toFixed(1);
    },
    totalHeatingPower() {
      // Calculate total watts across all rooms
    }
  },
  template: `
    <div class="stats-panel">
      <h5>Gebäudestatistik</h5>
      <div>Räume: {{ totalRooms }}</div>
      <div>Gesamtfläche: {{ totalArea }} m²</div>
      <div>Heizleistung: {{ totalHeatingPower }} W</div>
    </div>
  `
}
```

#### 2. Import and Register
```javascript
// In src/main.js:
import { RoomStatistics } from './components/RoomStatistics.js';

// In components:
components: {
  RoomSidebar,
  RoomEditor,
  RoomModal,
  RoomStatistics  // Add here
}
```

#### 3. Use in Template
```html
<!-- In index.html: -->
<room-statistics :building-data="buildingData"></room-statistics>
```

---

## 📤 Changing Export Format

### Task: Add CSV export option

#### 1. Add CSV Generation Method
```javascript
// In src/main.js:
const exportCSV = () => {
  if (!buildingData.value) return;

  // Create CSV header
  let csv = 'Stockwerk,Raum,Nutzung,Fläche,Temperatur\n';

  // Add rows
  buildingData.value.raeume.forEach(room => {
    csv += `${room.stockwerk},${room.raumbezeichnung},${room.raumnutzung},${room.raumgroesse_m2},${room.norm_innentemperatur_c}\n`;
  });

  // Download
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'raumdaten.csv';
  link.click();
}
```

#### 2. Add Export Button
```html
<button class="btn btn-info" @click="exportCSV">
  <i class="bi bi-file-earmark-spreadsheet"></i> CSV Export
</button>
```

---

## 🏢 Adding a New Floor Type

### Task: Add "Zwischengeschoss" (Mezzanine)

#### 1. Update Floor Mappings
```javascript
// In src/components/RoomSidebar.js:
getFloorId(floor) {
  const mapping = {
    'Kellergeschoss': 'kg',
    'Erdgeschoss': 'eg',
    'Zwischengeschoss': 'zg',  // Add new
    'Obergeschoss': 'og',
    'Dachgeschoss': 'dg'
  };
  return mapping[floor] || floor.toLowerCase();
}
```

#### 2. Update Room Creation
```javascript
// In RoomSidebar template:
roomsByFloor() {
  const floors = {
    'Kellergeschoss': [],
    'Erdgeschoss': [],
    'Zwischengeschoss': [],  // Add new
    'Obergeschoss': [],
    'Dachgeschoss': []
  };
  // ... rest of method
}
```

---

## 🔍 Adding Search/Filter

### Task: Filter rooms by name

#### 1. Add Search State
```javascript
// In src/main.js:
const searchQuery = ref('');
```

#### 2. Add Filtered Computed
```javascript
const filteredRooms = computed(() => {
  if (!searchQuery.value) return buildingData.value?.raeume || [];

  return buildingData.value?.raeume.filter(room =>
    room.raumbezeichnung.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
```

#### 3. Add Search Input
```html
<input type="text"
       class="form-control"
       v-model="searchQuery"
       placeholder="Raum suchen...">
```

---

## 🖨 Adding Print Functionality

### Task: Generate print-friendly report

#### 1. Create Print Method
```javascript
// In src/main.js:
const generatePrintReport = () => {
  // Open new window with print-optimized layout
  const printWindow = window.open('', '_blank');

  // Build HTML content
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Hydraulischer Abgleich - Bericht</title>
      <style>
        @media print {
          .no-print { display: none; }
        }
        body { font-family: Arial; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ccc; padding: 8px; }
      </style>
    </head>
    <body>
      <h1>Hydraulischer Abgleich</h1>
      <table>
        <!-- Generate table from buildingData -->
      </table>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.print();
}
```

#### 2. Add Print Button
```html
<button class="btn btn-secondary" @click="generatePrintReport">
  <i class="bi bi-printer"></i> Drucken
</button>
```

---

## 🐛 Common Debugging Tasks

### Console Logging State
```javascript
// In browser console:
app = document.querySelector('#app').__vue_app__
app.config.globalProperties.buildingData.value.raeume[0]
```

### Adding Debug Info
```javascript
// In any component:
mounted() {
  console.log('Component mounted with:', this.$props);
}
```

### Watching for Changes
```javascript
watch: {
  room: {
    deep: true,
    handler(newVal, oldVal) {
      console.log('Room changed from', oldVal, 'to', newVal);
    }
  }
}
```

---

## 💾 Data Migration Tasks

### Converting Old Format
```javascript
// If data structure changes:
const migrateData = (oldData) => {
  return {
    ...oldData,
    raeume: oldData.raeume.map(room => ({
      ...room,
      // Add new required fields
      new_field: room.old_field || 'default',
      // Remove old fields
      old_field: undefined
    }))
  };
}
```

### Migrating Unheated Areas to New Array Format
```javascript
// Convert old object structure to new array format
const migrateUnheatedAreas = (room) => {
  const oldBereiche = room.angrenzende_unbeheizte_bereiche;
  const newBereiche = [];

  // Convert Außenwand
  if (oldBereiche.aussenwand) {
    newBereiche.push({
      typ: 'Außenwand',
      u_wert: oldBereiche.aussenwand.u_wert,
      flaeche_m2: oldBereiche.aussenwand.aussenwand_laenge_m * room.raumhoehe_m,
      art: 'Außenluft',
      hinweis: oldBereiche.aussenwand.hinweis || ''
    });
  }

  // Convert Boden
  if (oldBereiche.boden && !oldBereiche.boden.bereich?.includes('beheizt')) {
    newBereiche.push({
      typ: 'Boden',
      u_wert: oldBereiche.boden.u_wert,
      flaeche_m2: room.raumgroesse_m2,
      art: oldBereiche.boden.bereich || 'Erdreich',
      hinweis: oldBereiche.boden.hinweis || ''
    });
  }

  // Convert Decke
  if (oldBereiche.decke && !oldBereiche.decke.bereich?.includes('beheizt')) {
    newBereiche.push({
      typ: 'Decke',
      u_wert: oldBereiche.decke.u_wert,
      flaeche_m2: room.raumgroesse_m2,
      art: oldBereiche.decke.bereich || '',
      hinweis: oldBereiche.decke.hinweis || ''
    });
  }

  // Convert Wände array
  if (oldBereiche.waende) {
    oldBereiche.waende.forEach(wand => {
      if (!wand.bereich?.includes('beheizt')) {
        newBereiche.push({
          typ: 'Innenwand',
          u_wert: wand.u_wert,
          flaeche_m2: wand.flaeche_m2,
          art: wand.bereich || '',
          hinweis: wand.hinweis || ''
        });
      }
    });
  }

  return newBereiche;
}
```

---

## 📚 Quick Reference

### File Locations
- **Components**: `src/components/*.js`
- **Styles**: `src/style.css`
- **Main Logic**: `src/main.js`
- **HTML**: `index.html`

### Common Patterns
- **Update field**: `updateField(field, value)`
- **Add to array**: `this.localRoom.array.push(newItem)`
- **Remove from array**: `array.splice(index, 1)`
- **Emit changes**: `this.$emit('updateRoom', index, room)`

### Testing Changes
1. Make change
2. Run `npm run dev`
3. Test in browser
4. Check console for errors
5. Test export/import cycle