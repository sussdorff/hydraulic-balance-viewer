# German Heating System Terminology

## 🏢 Building Structure (Gebäudestruktur)

| German | English | Context |
|--------|---------|---------|
| **Gebäude** | Building | Top-level object |
| **Stockwerk** | Floor/Story | Building level |
| **Kellergeschoss (KG)** | Basement | Below ground floor |
| **Erdgeschoss (EG)** | Ground floor | Street level |
| **Obergeschoss (OG)** | Upper floor | First floor above ground |
| **Dachgeschoss (DG)** | Attic/Top floor | Under the roof |
| **Raum** | Room | Individual space |
| **Räume** | Rooms (plural) | Array of rooms |

## 🚪 Room Properties (Raumeigenschaften)

| German | English | Usage |
|--------|---------|-------|
| **Raumbezeichnung** | Room name | "Gästezimmer", "Küche" |
| **Raumnutzung** | Room usage/purpose | "Schlafzimmer", "Büro" |
| **Raumgröße** | Room size | Floor area in m² |
| **Raumhöhe** | Room height | Height in meters |
| **Raumvolumen** | Room volume | Volume in m³ |
| **Norm-Innentemperatur** | Standard indoor temperature | Target temp in °C |
| **Aufheizleistung berücksichtigen** | Consider heating-up power | Boolean flag |
| **Kombinierte Heizzone mit** | Combined heating zone with | Links rooms |

## 🔥 Heating Equipment (Heizungsausstattung)

| German | English | Description |
|--------|---------|-------------|
| **Heizkörper** | Radiator | Heating element |
| **Fußbodenheizung** | Floor heating | Underfloor heating |
| **Wärmeleistung** | Heat output | Power in watts |
| **Bauhöhe** | Construction height | Height in mm |
| **Baubreite** | Construction width | Width in mm |
| **Bautiefe** | Construction depth | Depth in mm |
| **Vorlauftemperatur** | Flow temperature | Hot water in °C |
| **Rücklauftemperatur** | Return temperature | Cooled water °C |

## 💨 Ventilation (Lüftung)

| German | English | Type |
|--------|---------|------|
| **Lüftung** | Ventilation | System type |
| **Stoßlüftung** | Shock/burst ventilation | Manual window opening |
| **KWL** | Kontrollierte Wohnraumlüftung | Controlled ventilation |
| **KWL_dezentral** | Decentralized ventilation | Room-specific system |
| **Wärmerückgewinnung** | Heat recovery | Efficiency in % |
| **Luftvolumenstrom** | Air volume flow | Rate in m³/h |

## 🪟 Windows & Doors (Fenster & Türen)

| German | English | Context |
|--------|---------|---------|
| **Fenster** | Window | Opening element |
| **Verglasung** | Glazing | Glass type |
| **Wärmeschutzverglasung** | Thermal protection glazing | Insulated glass |
| **Dreifachverglasung** | Triple glazing | Three glass panes |
| **Sprossen** | Muntins/grilles | Decorative bars |
| **Türen** | Doors | Entry/passage |
| **Innentür** | Interior door | Between rooms |
| **Außentür** | Exterior door | To outside |
| **U-Wert** | U-value | Heat transfer coefficient |
| **UW-Wert** | Window U-value | Window heat transfer |

## 🏠 Building Envelope (Gebäudehülle)

| German | English | Component |
|--------|---------|-----------|
| **Außenwand** | Exterior wall | Outside wall |
| **Innenwand** | Interior wall | Between rooms |
| **Boden** | Floor | Bottom surface |
| **Decke** | Ceiling | Top surface |
| **Dach** | Roof | Top of building |
| **Erdreich** | Ground/soil | Below grade |
| **Angrenzende unbeheizte Bereiche** | Adjacent unheated areas | Cold zones |
| **Wärmebrücke** | Thermal bridge | Heat loss point |
| **Wärmebrückenzuschlag** | Thermal bridge supplement | Added factor |

## 📊 Technical Parameters (Technische Parameter)

| German | English | Unit |
|--------|---------|------|
| **Heizlast** | Heat load | kW |
| **Norm-Außentemperatur** | Standard outside temperature | °C |
| **Gebäudedichtheit** | Building airtightness | n50 value |
| **Perimeterdämmung** | Perimeter insulation | External basement insulation |
| **Dämmung** | Insulation | Thermal insulation |
| **Schätzwert** | Estimated value | Approximation |
| **Hinweis** | Note/remark | Additional info |

## 🔧 Additional Equipment (Zusatzausstattung)

| German | English | Purpose |
|--------|---------|---------|
| **Zusätzliche Heizquelle** | Additional heat source | Supplementary heating |
| **Split-Klimaanlage** | Split air conditioner | AC unit |
| **Kaminofen** | Wood stove | Fireplace |
| **Betrieb** | Operation | Usage period |
| **Ganzjährig** | Year-round | All seasons |
| **Funktion** | Function | Purpose/mode |
| **Heizen/Kühlen** | Heating/Cooling | Dual purpose |

## 📐 Measurements (Maßeinheiten)

| German | English | Symbol |
|--------|---------|--------|
| **Quadratmeter** | Square meter | m² |
| **Kubikmeter** | Cubic meter | m³ |
| **Meter** | Meter | m |
| **Millimeter** | Millimeter | mm |
| **Grad Celsius** | Degrees Celsius | °C |
| **Watt** | Watt | W |
| **Kilowatt** | Kilowatt | kW |
| **Prozent** | Percent | % |

## 🏗 Standards & Regulations (Normen)

| German | English | Context |
|--------|---------|---------|
| **DIN EN 12831** | European heating standard | Heat load calculation |
| **Hydraulischer Abgleich** | Hydraulic balancing | System optimization |
| **EnEV** | Energieeinsparverordnung | Energy saving ordinance |
| **Energetischer Zustand** | Energy status | Building efficiency |

## 💡 Common Phrases

| German | English |
|--------|---------|
| **Raum hinzufügen** | Add room |
| **Raum löschen** | Delete room |
| **JSON hochladen** | Upload JSON |
| **JSON exportieren** | Export JSON |
| **Möchten Sie diesen Raum wirklich löschen?** | Do you really want to delete this room? |
| **Datei erfolgreich geladen** | File successfully loaded |
| **Keine Heizkörper vorhanden** | No radiators present |
| **Neuer Raum** | New room |

## 📝 Usage Tips for AI

1. **Always preserve German terms** in the UI - users expect them
2. **Use correct articles** (der/die/das) when generating German text
3. **Compound words** are common - don't split them
4. **Capitalization** - German nouns are capitalized
5. **Technical accuracy** - These terms have specific meanings in heating engineering

## 🔍 Quick Lookup for Code

```javascript
// Common field names in JSON
stockwerk                  // floor level
raumbezeichnung           // room name
raumgroesse_m2           // room size
heizkoerper              // radiators (array)
fenster                  // windows (array)
tueren                   // doors (array)
lueftung                 // ventilation
angrenzende_unbeheizte_bereiche  // adjacent unheated areas
zusaetzliche_heizquelle  // additional heat source
```