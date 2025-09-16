# Code Patterns and Conventions

## 🎯 Core Principles
1. **German UI, English Code**: UI text in German, variables/comments in English
2. **Deep Copy Before Edit**: Always clone objects before modification
3. **Emit Full Objects**: Send complete data, not patches
4. **Defensive Coding**: Check for null/undefined before access

---

## 📦 Component Patterns

### Component Structure
```javascript
export const ComponentName = {
  // 1. Props definition
  props: ['propA', 'propB'],

  // 2. Events emitted
  emits: ['eventName'],

  // 3. Local state
  data() {
    return {
      localState: null
    };
  },

  // 4. Computed properties
  computed: {
    derivedValue() {
      return this.localState?.field || 'default';
    }
  },

  // 5. Watchers
  watch: {
    propA: {
      immediate: true,
      deep: true,
      handler(newVal) {
        // React to prop changes
      }
    }
  },

  // 6. Methods
  methods: {
    handleAction() {
      // Method implementation
    }
  },

  // 7. Template
  template: `<div>...</div>`
};
```

### Two-Way Data Binding Pattern
```javascript
// ❌ BAD - Direct v-model on prop
<input v-model="room.field">

// ✅ GOOD - Local copy with emit
data() {
  return {
    localRoom: null
  };
},
watch: {
  room: {
    immediate: true,
    deep: true,
    handler(newRoom) {
      this.localRoom = JSON.parse(JSON.stringify(newRoom));
    }
  }
},
methods: {
  updateField(field, value) {
    this.localRoom[field] = value;
    this.$emit('updateRoom', this.roomIndex, this.localRoom);
  }
}
```

---

## 🔄 State Management Patterns

### Reactive State in main.js
```javascript
// Use ref for primitives and objects
const buildingData = ref(null);
const currentView = ref('detail');

// Use computed for derived state
const sortedRooms = computed(() => {
  if (!buildingData.value?.raeume) return [];
  return [...buildingData.value.raeume].sort(/* ... */);
});
```

### State Update Pattern
```javascript
// ❌ BAD - Mutating nested properties directly
buildingData.value.raeume[0].field = value;

// ✅ GOOD - Replace entire object
const updateRoom = (index, updatedRoom) => {
  if (buildingData.value?.raeume?.[index]) {
    buildingData.value.raeume[index] = updatedRoom;
  }
};
```

---

## 🎨 UI Patterns

### Conditional Rendering
```javascript
// ❌ BAD - May cause errors with null
<div v-show="room.field">

// ✅ GOOD - Safe navigation
<div v-if="room?.field">

// ✅ BETTER - With fallback
<div>{{ room?.field || 'Keine Angabe' }}</div>
```

### Dynamic Classes
```javascript
// Single condition
:class="{ active: isActive }"

// Multiple conditions
:class="[
  'base-class',
  { 'active': isActive },
  { 'disabled': !isEnabled }
]"

// Computed class
:class="computedClasses"
computed: {
  computedClasses() {
    return {
      'active': this.isActive,
      'text-danger': this.hasError
    };
  }
}
```

### Form Input Patterns
```javascript
// Number input with parsing
<input type="number"
       :value="localRoom.field"
       @input="updateField('field', parseFloat($event.target.value))">

// Text input
<input type="text"
       :value="localRoom.field"
       @input="updateField('field', $event.target.value)">

// Select with boolean
<select :value="localRoom.field"
        @change="updateField('field', $event.target.value === 'true')">
  <option :value="true">Ja</option>
  <option :value="false">Nein</option>
</select>
```

---

## 📊 Array Management Patterns

### Adding to Array
```javascript
addItem() {
  if (!this.localRoom.array) {
    this.localRoom.array = [];
  }
  this.localRoom.array.push({
    field1: '',
    field2: 0,
    field3: null
  });
  this.$emit('updateRoom', this.roomIndex, this.localRoom);
}
```

### Removing from Array
```javascript
deleteItem(index) {
  this.localRoom.array.splice(index, 1);
  this.$emit('updateRoom', this.roomIndex, this.localRoom);
}
```

### Updating Array Item
```javascript
updateArrayItem(arrayName, index, field, value) {
  if (this.localRoom[arrayName]?.[index]) {
    this.localRoom[arrayName][index][field] = value;
    this.$emit('updateRoom', this.roomIndex, this.localRoom);
  }
}
```

---

## 🧮 Calculation Patterns

### Auto-Calculation with Side Effects
```javascript
calculateVolume() {
  if (this.localRoom.raumgroesse_m2 && this.localRoom.raumhoehe_m) {
    // Round to 2 decimal places
    this.localRoom.raumvolumen_m3 = Math.round(
      this.localRoom.raumgroesse_m2 * this.localRoom.raumhoehe_m * 100
    ) / 100;
    this.$emit('updateRoom', this.roomIndex, this.localRoom);
  }
}

// Trigger on dimension change
@input="updateField('raumgroesse_m2', parseFloat($event.target.value)); calculateVolume()"
```

### Aggregation Pattern
```javascript
computed: {
  totalValue() {
    if (!this.items?.length) return 0;
    return this.items.reduce((sum, item) => {
      return sum + (item.value || 0);
    }, 0);
  }
}
```

---

## 🔍 Defensive Coding Patterns

### Safe Property Access
```javascript
// ❌ BAD
room.angrenzende_unbeheizte_bereiche.aussenwand.u_wert

// ✅ GOOD - Optional chaining
room?.angrenzende_unbeheizte_bereiche?.aussenwand?.u_wert

// ✅ BETTER - With default
room?.angrenzende_unbeheizte_bereiche?.aussenwand?.u_wert || 0
```

### Existence Checks
```javascript
// Check before render
v-if="room.zusaetzliche_heizquelle"

// Check in method
if (!this.localRoom.heizkoerper) {
  this.localRoom.heizkoerper = [];
}
```

### Type Conversion Safety
```javascript
// Parse with fallback
parseFloat(value) || 0
parseInt(value) || 0

// Boolean conversion
value === 'true' || value === true
```

---

## 📝 Event Handling Patterns

### Event with Stop Propagation
```javascript
// Prevent parent click handler
@click.stop="deleteItem(index)"

// Prevent form submission
@submit.prevent="handleSubmit"
```

### Debounced Input
```javascript
// For expensive operations
data() {
  return {
    debounceTimer: null
  };
},
methods: {
  debouncedUpdate(field, value) {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.updateField(field, value);
    }, 300);
  }
}
```

---

## 🎨 CSS Patterns

### Component-Specific Styles
```css
/* Scope to component class */
.room-editor h4 { }
.room-sidebar .nav-tabs { }

/* State modifiers */
.room-item.active { }
.room-item:hover { }

/* Responsive utilities */
@media (max-width: 768px) {
  .sidebar { display: none; }
}
```

### Print-Specific Styles
```css
@media print {
  .no-print { display: none !important; }
  .print-only { display: block !important; }
}
```

---

## 📦 Import/Export Patterns

### Module Exports
```javascript
// Component export
export const ComponentName = { /* ... */ };

// Multiple exports
export { ComponentA, ComponentB };

// Default export (avoid)
export default ComponentName; // ❌ Prefer named exports
```

### Import Pattern
```javascript
// Import components
import { RoomSidebar } from './components/RoomSidebar.js';

// Import utilities
import { utils } from './utils.js';

// Destructured imports
const { createApp, ref, computed } = Vue;
```

---

## 🔐 Error Handling Patterns

### Try-Catch for File Operations
```javascript
try {
  const data = JSON.parse(fileContent);
  loadData(data);
  showNotification('Erfolg', 'success');
} catch (error) {
  console.error('Parse error:', error);
  showNotification('Fehler beim Lesen', 'danger');
}
```

### Validation Pattern
```javascript
validateField(value, rules) {
  if (rules.required && !value) {
    return 'Pflichtfeld';
  }
  if (rules.min && value < rules.min) {
    return `Mindestens ${rules.min}`;
  }
  return null; // Valid
}
```

---

## 💡 Best Practices Summary

1. **Always use optional chaining** for nested property access
2. **Clone before edit** to avoid unwanted mutations
3. **Emit complete objects** not individual field updates
4. **Use computed for derived values** instead of methods
5. **Validate user input** before processing
6. **Handle edge cases** (null, undefined, empty arrays)
7. **Keep German in UI only** - code in English
8. **Round decimal calculations** to avoid floating point issues
9. **Use semantic HTML** and Bootstrap classes
10. **Test with sample-data.json** before real data