# Component Reference Guide

## 📦 RoomSidebar Component
**File**: `src/components/RoomSidebar.js`
**Purpose**: Floor-based room navigation with tabs

### Props
```javascript
{
  buildingData: Object,        // Main data object with raeume array
  currentEditRoomIndex: Number // Currently selected room index
}
```

### Events Emitted
```javascript
@selectRoom(index)    // User clicks a room
@addRoom(floor)       // User clicks "Raum hinzufügen"
@deleteRoom(index)    // User clicks trash icon
```

### Computed Properties
- `roomsByFloor` - Groups rooms by stockwerk
- `floorCounts` - Count of rooms per floor

### Template Structure
```html
<!-- Floor tabs (KG/EG/OG/DG) -->
<ul class="nav nav-tabs">
  <button>KG <span class="badge">4</span></button>
</ul>

<!-- Room list per floor -->
<div class="room-item" :class="{ active: isSelected }">
  <strong>Room Name</strong>
  <small>Usage • Size m²</small>
  <i class="bi-trash" @click.stop="deleteRoom"></i>
</div>
```

### Usage Example
```javascript
<room-sidebar
  :building-data="buildingData"
  :current-edit-room-index="currentEditRoomIndex"
  @select-room="selectRoomForEdit"
  @add-room="addRoom"
  @delete-room="deleteRoom">
</room-sidebar>
```

---

## 📝 RoomEditor Component
**File**: `src/components/RoomEditor.js`
**Purpose**: Complete room editing interface

### Props
```javascript
{
  room: Object,      // Room object to edit
  roomIndex: Number  // Index in raeume array
}
```

### Events Emitted
```javascript
@updateRoom(index, updatedRoom)  // Any field change
```

### Local State
```javascript
{
  localRoom: Object  // Deep copy of room for editing
}
```

### Key Methods
```javascript
updateField(field, value)           // Update simple field
updateNestedField(parent, field, value) // Update nested object
updateArrayItem(array, index, field, value) // Update array item
addHeizkoerper()                    // Add radiator
addFenster()                        // Add window
addTuer()                          // Add door
calculateVolume()                   // Auto-calc volume
calculateFensterArea(index)        // Auto-calc window area
calculateTuerArea(index)           // Auto-calc door area
```

### Form Sections
1. **Grunddaten** - Basic room properties
2. **Heizkörper** - Radiators (array)
3. **Lüftung** - Ventilation settings
4. **Fenster** - Windows (array)
5. **Türen** - Doors (array)
6. **Angrenzende unbeheizte Bereiche** - Adjacent areas
7. **Zusätzliche Heizquelle** - Additional heating

### Usage Example
```javascript
<room-editor
  v-if="currentEditRoomIndex !== null"
  :room="buildingData.raeume[currentEditRoomIndex]"
  :room-index="currentEditRoomIndex"
  @update-room="updateRoom">
</room-editor>
```

---

## 👁 RoomModal Component
**File**: `src/components/RoomModal.js`
**Purpose**: Read-only detailed room view

### Props
```javascript
{
  room: Object,   // Room to display
  show: Boolean   // Modal visibility
}
```

### Events Emitted
```javascript
@close  // User closes modal
```

### Computed Properties
```javascript
totalHeizleistung     // Sum of all radiator watts
totalFensterFlaeche   // Sum of all window areas
totalTuerenFlaeche    // Sum of all door areas
```

### Methods
```javascript
getTemperatureClass(temp)  // Returns color class for temp
formatNumber(value, decimals, unit) // Format display values
```

### Display Sections
- **Grunddaten** with temperature badge
- **Heizkörper** with total power
- **Lüftung** with all parameters
- **Fenster** with total area
- **Türen** with total area
- **Angrenzende unbeheizte Bereiche** (all sub-objects)
- **Zusätzliche Heizquelle** if present

### Usage Example
```javascript
<div class="modal" :class="{ show: showModal }">
  <room-modal
    :room="selectedRoom"
    :show="showModal"
    @close="closeModal">
  </room-modal>
</div>
```

---

## 🎛 Main App Component
**File**: `src/main.js`
**Purpose**: Application root with state management

### State (Reactive Refs)
```javascript
buildingData           // Main data object
currentView            // 'detail' | 'table'
selectedRoom          // For modal display
selectedRoomIndex     // For modal
showModal             // Modal visibility
currentEditRoomIndex  // Currently editing room
sortColumn           // Table sort column
sortDirection        // 'asc' | 'desc'
isDragging           // Drag-drop state
```

### Key Methods
```javascript
// File handling
loadJSON(file)
handleFileUpload(event)
handleDrop(event)

// Room management
addRoom(stockwerk)
deleteRoom(index)
updateRoom(index, updatedRoom)
selectRoomForEdit(index)

// UI control
switchView(view)
showRoomDetails(room, index)
closeModal()
sortTable(column)

// Data export
exportJSON()

// Notifications
showNotification(message, type)
```

### Component Registration
```javascript
components: {
  RoomSidebar,
  RoomEditor,
  RoomModal
}
```

---

## 🔗 Component Communication Patterns

### Parent → Child (Props)
```
App → RoomSidebar: buildingData, currentEditRoomIndex
App → RoomEditor: room, roomIndex
App → RoomModal: room, show
```

### Child → Parent (Events)
```
RoomSidebar → App: @selectRoom, @addRoom, @deleteRoom
RoomEditor → App: @updateRoom
RoomModal → App: @close
```

### State Updates Flow
```
1. User action in component
2. Component emits event with data
3. Parent (App) updates central state
4. Props flow down to all components
5. Components re-render with new data
```

---

## 💡 Component Best Practices

### Always Deep Copy Before Editing
```javascript
this.localRoom = JSON.parse(JSON.stringify(newRoom));
```

### Emit Full Objects, Not Patches
```javascript
// Good
this.$emit('updateRoom', index, fullRoomObject);

// Bad
this.$emit('updateField', field, value);
```

### Use v-if for Conditional Rendering
```javascript
// Prevents errors with null data
<room-editor v-if="room" :room="room">
```

### Defensive Coding for Optional Fields
```javascript
// Check existence before access
v-if="room.zusaetzliche_heizquelle?.modell_innen"
```