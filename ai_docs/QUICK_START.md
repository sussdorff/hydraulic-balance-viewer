# Quick Start Guide - Get Running in 5 Minutes

## 🚀 Prerequisites
```bash
# Check you have Node.js installed
node --version  # Should be v14+
npm --version   # Should be v6+
```

## 📦 Setup (30 seconds)
```bash
# Clone or navigate to project
cd /Users/malte/code/house-projects/hydraulic-balance-viewer

# Install dependencies
npm install

# Start development server
npm run dev
```
Open: http://localhost:5173

## 🎯 Quick Test (2 minutes)
```bash
# Use the sample data
open sample-data.json

# Or use the real data
open "/Users/malte/Documents/Haus/2025 - Wärmepumpe/Angabe Energetischer Zustand/hydraulischer-abgleich-daten.json"

# In browser:
1. Drag the JSON file onto the page
2. Click any room in the sidebar
3. Edit a field (e.g., change temperature)
4. Click "JSON exportieren" to save changes
```

## 🛠 Development Commands
```bash
npm run dev      # Start dev server (hot reload)
npm run build    # Build for production
npm run preview  # Test production build locally
```

## 📁 Key Files to Know
```
index.html                        # Main HTML - start here
src/main.js                      # Vue app & business logic
src/components/RoomEditor.js    # Complex editing component
src/components/RoomSidebar.js   # Navigation component
sample-data.json                # Test with this first
```

## ⚡ Make Your First Change (1 minute)

### Change Default Temperature
```javascript
// In src/main.js, find line ~35:
norm_innentemperatur_c: 20,  // Change to 22

// Test:
1. npm run dev
2. Add new room
3. Check temperature is 22°C
```

### Add Console Log
```javascript
// In src/components/RoomEditor.js, find updateField method:
updateField(field, value) {
  console.log(`Updating ${field} to ${value}`);  // Add this
  if (this.localRoom) {
    // ... rest of method
```

## 🔍 Understanding the App Flow
```
1. index.html loads Vue from CDN
2. main.js creates Vue app with state
3. Components render based on state
4. User actions emit events
5. main.js updates state
6. Components re-render
```

## 🧪 Quick Verification
```javascript
// In browser console:
app = document.querySelector('#app').__vue_app__
app.config.globalProperties.buildingData  // See all data
app.config.globalProperties.currentEditRoomIndex  // Current room
```

## 🎨 UI Structure
```
Header
├── Title
├── View Toggle (Detail/Table)
└── Action Buttons (Upload/Export)

Detail View (default)
├── Sidebar (left)
│   ├── Floor Tabs (KG/EG/OG/DG)
│   └── Room List
└── Editor (right)
    └── Form Sections

Table View
└── Sortable Table
    └── Room Modal (on click)
```

## 📊 Sample Data Structure
```json
{
  "gebaeude": {
    "adresse": "...",
    "stockwerke": ["Kellergeschoss", "Erdgeschoss", ...]
  },
  "raeume": [{
    "stockwerk": "Kellergeschoss",
    "raumbezeichnung": "Gästezimmer",
    "raumgroesse_m2": 20.6,
    "heizkoerper": [...],
    "fenster": [...],
    "tueren": [...]
  }]
}
```

## 🐛 Common Issues & Solutions

### Nothing happens when uploading file
```javascript
// Check browser console for errors
// Ensure file is valid JSON
// Try with sample-data.json first
```

### Changes not saving
```javascript
// Changes are in memory until export
// Click "JSON exportieren" to save
// Check downloads folder
```

### Component not updating
```javascript
// Ensure emitting full object:
this.$emit('updateRoom', index, this.localRoom);
// Not just the field
```

## 🔗 Quick Links
- **Test Data**: `/Users/malte/Documents/Haus/2025 - Wärmepumpe/Angabe Energetischer Zustand/`
- **Vue Docs**: https://vuejs.org/guide/
- **Bootstrap Docs**: https://getbootstrap.com/docs/5.3/

## 💡 Next Steps
1. Read `COMMON_TASKS.md` for typical modifications
2. Check `CODE_PATTERNS.md` for conventions
3. See `GERMAN_TERMINOLOGY.md` for domain terms
4. Review `DATA_MODEL.md` for JSON structure

## 🎯 Pro Tips
- Use Vue DevTools browser extension for debugging
- Keep browser console open during development
- Test with sample-data.json before real data
- Make small changes and test incrementally
- Use the preview server to test production builds

---

**Ready to code!** Start with `npm run dev` and make a small change to see it work.