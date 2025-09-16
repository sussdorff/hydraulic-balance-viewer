# Hydraulic Balance Viewer - Project Overview

## 🎯 What This Is
A **web application for viewing and editing hydraulic balance data** for German residential heating systems. Users can load JSON files containing room-by-room heating specifications, edit all parameters, and export the modified data.

## 👤 Target Users
- **Homeowners** managing their heating system documentation
- **Heating engineers** performing hydraulic balance calculations
- **Energy consultants** documenting building heating requirements

## 🔑 Core Value Proposition
Transform complex heating system JSON data into an **intuitive, editable interface** with proper German terminology, auto-calculations, and comprehensive data management.

## 🛠 Technology Stack
```javascript
{
  "framework": "Vue.js 3.x (via CDN)",
  "ui": "Bootstrap 5.3",
  "build": "Vite 7.1",
  "language": "JavaScript (ES6+)",
  "styling": "CSS3 with Bootstrap components",
  "deployment": "Single HTML file (via vite-plugin-singlefile)"
}
```

## 📁 Key Files Overview
```
index.html              # Main HTML, Vue mount, component templates
src/main.js            # Vue app initialization, state, business logic
src/components/        # Reusable Vue components
  - RoomSidebar.js     # Navigation by floor (KG/EG/OG/DG)
  - RoomEditor.js      # Full CRUD for room properties
  - RoomModal.js       # Read-only detailed view
src/style.css          # Custom styles on top of Bootstrap
sample-data.json       # Example data structure (18 rooms)
```

## 🌟 Key Features
1. **File Management**: Drag-drop JSON upload, modified export
2. **Room Navigation**: Floor-based tabs with room counts
3. **Full Editing**: All heating parameters editable
4. **Auto-Calculations**: Volume (area×height), window/door areas
5. **Dynamic Arrays**: Add/remove radiators, windows, doors
6. **Two Views**: Detail (editing) and Table (overview)

## 🇩🇪 Domain Context
This is a **German heating system** application. All terminology follows DIN standards:
- Rooms are organized by German floor names (Kellergeschoss, Erdgeschoss, etc.)
- Heating parameters use German terms (Heizkörper, Wärmeleistung, etc.)
- Temperature standards follow German norms (20°C standard room temp)

## 📊 Data Flow
```
JSON File → Upload → Vue State (buildingData) → Components → User Edits → Export JSON
                           ↓
                    RoomSidebar ← → RoomEditor
                           ↓
                      RoomModal (read-only view)
```

## 🚀 Quick Context for AI
- **Start here**: This file → QUICK_START.md → ARCHITECTURE.md
- **Making changes**: See COMMON_TASKS.md for 80% of work
- **German terms**: Check GERMAN_TERMINOLOGY.md for translations
- **Data structure**: DATA_MODEL.md has full schema
- **Testing**: TESTING_GUIDE.md for verification

## 📝 Project Status
- ✅ **Production Ready**: All core features implemented and tested
- 📦 **Data Source**: `/Users/malte/Documents/Haus/2025 - Wärmepumpe/Angabe Energetischer Zustand/`
- 🧪 **Test Coverage**: Comprehensive browser testing completed
- 📈 **Performance**: Handles 18+ rooms smoothly

## ⚡ Most Important Files for New AI
1. `src/main.js` - Core application logic
2. `src/components/RoomEditor.js` - Most complex component
3. `sample-data.json` - Understand data structure
4. `GERMAN_TERMINOLOGY.md` - Domain vocabulary