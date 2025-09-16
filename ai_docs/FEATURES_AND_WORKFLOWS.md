# Features and User Workflows

## 🎯 Core Features

### 1. File Management
- **Drag & Drop Upload**: Drop JSON anywhere on page
- **File Picker**: Click "JSON hochladen" button
- **Export Modified Data**: "JSON exportieren" → downloads as `hydraulischer-abgleich-daten-bearbeitet.json`
- **Success Notifications**: Visual feedback for all operations

### 2. View Modes
- **Detail View** (default): Sidebar + Editor for full editing
- **Table View**: Overview of all rooms with sorting
- **Modal View**: Read-only detailed view from table

### 3. Room Navigation
- **Floor Tabs**: KG, EG, OG, DG with room counts
- **Room List**: Clickable rooms per floor
- **Active Highlighting**: Selected room highlighted blue
- **Quick Info**: Shows usage and size in sidebar

### 4. Room Editing
- **All Fields Editable**: Every JSON field has input
- **Auto-Calculations**: Volume, window/door areas
- **Array Management**: Add/delete items dynamically
- **Real-time Updates**: Changes reflected immediately

### 5. Data Operations
- **Add Rooms**: Per floor with defaults
- **Delete Rooms**: With confirmation dialog
- **Sort Table**: Click column headers
- **Search**: Via browser Ctrl+F

---

## 🔄 Main User Workflows

### Workflow 1: Load and View Data
```
1. Open application (shows Detail view)
2. Drag JSON file onto page OR click "JSON hochladen"
3. File loads → Rooms appear in sidebar
4. First room auto-selected in KG tab
5. Room details shown in editor
```

### Workflow 2: Edit Room Properties
```
1. Click room in sidebar
2. Room loads in editor
3. Modify fields:
   - Change room name → Updates in sidebar
   - Change size → Volume auto-calculates
   - Add window → Click + icon → Fill details
4. Changes saved automatically
5. Switch rooms → Changes persist
```

### Workflow 3: Add New Room
```
1. Navigate to desired floor tab
2. Click "Raum hinzufügen" button
3. New room created with defaults:
   - Name: "Neuer Raum"
   - Temperature: 20°C
   - Height: 2.5m
4. Room auto-selected for editing
5. Modify all properties as needed
```

### Workflow 4: Delete Room
```
1. Hover over room in sidebar
2. Trash icon appears
3. Click trash icon
4. Confirmation: "Möchten Sie diesen Raum wirklich löschen?"
5. Confirm → Room removed
6. Floor count updates
```

### Workflow 5: Manage Heating Equipment
```
Add Radiator:
1. In Heizkörper section, click + icon
2. New empty radiator added
3. Fill: Art, Modell, dimensions, power

Add Window:
1. In Fenster section, click + icon
2. Enter height and width
3. Area auto-calculates
4. Add type, glazing, U-value

Remove Item:
1. Click X icon on item
2. Item removed immediately
```

### Workflow 6: Export Modified Data
```
1. Make all desired changes
2. Click "JSON exportieren" button
3. File downloads to browser
4. Filename: hydraulischer-abgleich-daten-bearbeitet.json
5. Contains all modifications
```

### Workflow 7: Table View Operations
```
1. Click table icon in header
2. All rooms shown in sortable table
3. Click column header to sort
4. Click room row → Opens modal
5. Click edit icon → Switches to Detail view
6. Click delete icon → Removes room
```

---

## ⚡ Quick Actions

### Keyboard Shortcuts
- `Tab` - Navigate between fields
- `Enter` - Submit forms (where applicable)
- `Esc` - Close modal (in table view)

### Mouse Actions
- **Click** - Select room, sort table
- **Hover** - Show delete icon, highlight rooms
- **Drag** - Drag files to upload

### Visual Feedback
- **Blue highlight** - Active room
- **Gray hover** - Hoverable items
- **Green badge** - Success states
- **Red icons** - Delete actions
- **Spinner** - Loading states

---

## 📊 Data Flow Examples

### Example: Changing Room Temperature
```
1. User changes temperature input
2. RoomEditor.updateField('norm_innentemperatur_c', 22)
3. Emits updateRoom event
4. main.js updates buildingData.raeume[index]
5. All components re-render
6. Sidebar shows room with new data
```

### Example: Auto-calculation
```
1. User changes room width from 4m to 5m
2. calculateFensterArea() triggered
3. Area updates from 4m² to 5m²
4. Full room object emitted
5. Data model updated
6. Export will include new area
```

---

## 🎨 UI/UX Features

### Visual Hierarchy
1. **Primary Actions**: Blue buttons (Add, Export)
2. **Destructive Actions**: Red icons (Delete)
3. **Active States**: Blue backgrounds
4. **Disabled States**: Gray buttons

### Form Organization
- **Sections**: Bordered groups with headers
- **Related Fields**: Grouped in rows
- **Array Items**: Indented with borders
- **Nested Objects**: Gray backgrounds

### Responsive Design
- **Sidebar**: Fixed width, scrollable
- **Editor**: Flexible width, scrollable
- **Table**: Horizontal scroll on small screens
- **Modal**: Centered overlay

---

## 🔐 Data Safety Features

### Confirmation Dialogs
- Room deletion requires confirmation
- Prevents accidental data loss

### Data Validation
- Number inputs restricted to numbers
- Required fields marked
- Auto-calculations prevent errors

### Export Safety
- Original file never modified
- New filename for exports
- Complete data in export

---

## 📱 Browser Compatibility

### Supported Features
- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Modern mobile browsers

### Required APIs
- FileReader API (for uploads)
- Blob API (for downloads)
- ES6+ JavaScript features
- CSS Grid/Flexbox

---

## 🚀 Performance Features

### Optimizations
- Virtual DOM (Vue 3)
- Component-level updates only
- No unnecessary re-renders
- Efficient array operations

### Limits Tested
- ✅ 18+ rooms (current data)
- ✅ 50+ rooms performant
- ✅ Large file uploads (< 10MB)
- ✅ Multiple windows/doors per room