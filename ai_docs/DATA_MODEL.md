# Data Model Documentation

## 📋 Core JSON Structure
```json
{
  "gebaeude": { /* Building metadata */ },
  "raeume": [ /* Array of room objects */ ]
}
```

## 🏢 Building Object (gebaeude)
```javascript
{
  "adresse": "Musterstraße 123, 12345 Musterstadt",
  "baujahr": "1985",
  "stockwerke": ["Kellergeschoss", "Erdgeschoss", "Obergeschoss", "Dachgeschoss"],
  "rahmenbedingungen_heizlast": {
    "norm_aussentemperatur_c": -10,     // Outside temp for calculations
    "gebaeudedichtheit_n50": 3,         // Building tightness value
    "waermebrueckenzuschlag_uwb": 0.05, // Thermal bridge supplement
    "hinweis": "DIN EN 12831 Standard..."
  }
}
```

## 🚪 Room Object (raum)

### Basic Properties
```javascript
{
  "stockwerk": "Kellergeschoss",        // Floor: KG/EG/OG/DG
  "raumbezeichnung": "Gästezimmer",     // Room name
  "raumnutzung": "Schlafzimmer",        // Room usage/type
  "norm_innentemperatur_c": 20,         // Target temperature
  "aufheizleistung_beruecksichtigen": false, // Consider heating power
  "kombinierte_heizzone_mit": "Küche (EG)",  // Combined heating zone
  "raumgroesse_m2": 20.6,                // Floor area
  "raumhoehe_m": 2.2,                    // Room height
  "raumvolumen_m3": 45.32                // Volume (auto-calc: area × height)
}
```

### 🔥 Radiators Array (heizkoerper)
```javascript
"heizkoerper": [{
  "Art": "Fussbodenheizung",           // Type: floor heating, radiator
  "Modell": "Kermi FTV22",             // Model name (optional)
  "bauhoehe_mm": 600,                  // Height in mm
  "baubreite_mm": 1200,                // Width in mm
  "bautiefe_mm": 100,                  // Depth in mm
  "waermeleistung_55_45_20_watt": 1250, // Heat output in watts
  "hinweis": "Optional note"           // Optional note
}]
```

### 💨 Ventilation Object (lueftung)
```javascript
"lueftung": {
  "typ": "KWL_dezentral",              // Type: KWL/Stosslueftung
  "modell": "Beispiel Lüftungsgerät",   // Model (optional)
  "waermerueckgewinnung_prozent": 88,  // Heat recovery %
  "luftvolumenstrom_m3h": 60           // Air flow rate m³/h
}
```

### 🪟 Windows Array (fenster)
```javascript
"fenster": [{
  "typ": "Holz",                       // Material: Holz/Kunststoff
  "verglasung": "Wärmeschutzverglasung", // Glazing type
  "uw_wert": 1.53,                     // U-value (heat transfer)
  "hoehe_m": 1.2,                      // Height in meters
  "breite_m": 0.79,                    // Width in meters
  "flaeche_m2": 0.95,                  // Area (auto-calc: h × w)
  "sprossen": "Ohne",                  // Muntins/grilles
  "beschreibung": "Element 002"        // Description/ID
}]
```

### 🚪 Doors Array (tueren)
```javascript
"tueren": [{
  "typ": "Innentür",                   // Type: inner/outer door
  "uw_wert": 2.0,                      // U-value (optional)
  "hoehe_m": 2.0,                      // Height in meters
  "breite_m": 0.8,                     // Width in meters
  "flaeche_m2": 1.6,                   // Area (auto-calc: h × w)
  "hinweis": "Zum Flur"                // Note (optional)
}]
```

### 🏠 Adjacent Unheated Areas (angrenzende_unbeheizte_bereiche)
```javascript
"angrenzende_unbeheizte_bereiche": [    // Array of unheated areas
  {
    "typ": "Außenwand",                 // Type: Außenwand/Innenwand/Boden/Decke
    "u_wert": 1.6,                      // U-value in W/(m²·K)
    "flaeche_m2": 20.24,                // Area in m²
    "art": "Außenluft",                 // Adjacent area type
    "hinweis": "45cm Ziegel..."         // Optional notes
  },
  {
    "typ": "Innenwand",                 // Interior wall
    "u_wert": 1.5,                      // U-value
    "flaeche_m2": 7.76,                 // Wall area
    "art": "Keller EG",                 // Adjacent unheated room
    "hinweis": ""                       // Optional notes
  },
  {
    "typ": "Boden",                     // Floor
    "u_wert": 1.8,                      // U-value
    "flaeche_m2": 20.6,                 // Area (auto-filled from room area)
    "art": "Erdreich",                  // Ground contact
    "hinweis": "12cm Betonsohle..."    // Construction details
  },
  {
    "typ": "Decke",                     // Ceiling
    "u_wert": 0.9,                      // U-value
    "flaeche_m2": 20.6,                 // Area (auto-filled from room area)
    "art": "Dachgeschoss",              // Attic/upper floor
    "hinweis": "20cm Schutt..."        // Construction notes
  }
]
```

#### Type Options (typ)
- `"Außenwand"` - Exterior walls
- `"Innenwand"` - Interior walls to unheated spaces
- `"Boden"` - Floor (ground or unheated basement)
- `"Decke"` - Ceiling (to unheated attic or upper floor)

#### Adjacent Area Types (art) - Common Examples
- `"Außenluft"` - Outside air
- `"Erdreich"` - Ground/earth contact
- `"Keller"` - Unheated basement
- `"Dachgeschoss"` - Unheated attic
- `"Treppenhaus"` - Unheated stairwell
- `"Halle"` - Unheated hallway
- `"Garage"` - Garage
- `"Balkon"` - Balcony

#### Auto-calculation Behavior
- When `typ` is set to `"Boden"` or `"Decke"`, the `flaeche_m2` is automatically set to match the room's `raumgroesse_m2`
- For `"Außenwand"` and `"Innenwand"`, area must be manually entered

### 🔥 Additional Heat Source (zusaetzliche_heizquelle)
```javascript
"zusaetzliche_heizquelle": {
  "typ": "Split-Klimaanlage",          // Type of heating
  "modell_innen": "Daikin FTXM25R",    // Indoor unit model
  "modell_aussen": "Daikin RXM25R",    // Outdoor unit model
  "funktion": "Heizen/Kühlen",         // Function
  "betrieb": "Ganzjährig",              // Operation period
  "hinweis": "Primäre Heizung..."      // Notes
}
```

## 🔄 Auto-Calculated Fields

### Volume Calculation
```javascript
raumvolumen_m3 = raumgroesse_m2 × raumhoehe_m
// Example: 20.6 m² × 2.2 m = 45.32 m³
```

### Window/Door Area
```javascript
flaeche_m2 = hoehe_m × breite_m
// Example: 1.2 m × 0.79 m = 0.95 m²
```

## 📊 Data Constraints & Defaults

### Default New Room
```javascript
{
  "stockwerk": "[Selected floor]",
  "raumbezeichnung": "Neuer Raum",
  "raumnutzung": "",
  "norm_innentemperatur_c": 20,
  "aufheizleistung_beruecksichtigen": false,
  "raumgroesse_m2": 0,
  "raumhoehe_m": 2.5,
  "raumvolumen_m3": 0,
  "heizkoerper": [],
  "lueftung": { "typ": "Stosslueftung" },
  "fenster": [],
  "tueren": [],
  "angrenzende_unbeheizte_bereiche": {}
}
```

### Field Types
- **Strings**: raumbezeichnung, raumnutzung, typ, modell, etc.
- **Numbers**: All measurements (m², m, mm, watt, °C, %)
- **Booleans**: aufheizleistung_beruecksichtigen
- **Arrays**: heizkoerper, fenster, tueren, waende
- **Objects**: lueftung, angrenzende_unbeheizte_bereiche

## 🎯 Important Data Rules

1. **Floor Values**: Must be one of: Kellergeschoss, Erdgeschoss, Obergeschoss, Dachgeschoss
2. **Temperature Range**: Typically 16-24°C
3. **U-Values**: Lower is better (typical 0.2-3.0)
4. **Auto-calc Priority**: Manual entry overrides auto-calculation
5. **Optional Fields**: Many fields are optional and may not exist
6. **Array Management**: Empty arrays are valid states

## 📁 Sample Data Location
Full example: `/Users/malte/Documents/Haus/2025 - Wärmepumpe/Angabe Energetischer Zustand/hydraulischer-abgleich-daten.json`
- 18 rooms across 4 floors
- Complete with all field types
- Real-world heating system data