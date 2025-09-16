// Main application entry point
import './style.css';

// Import components
import { RoomSidebar } from './components/RoomSidebar.js';
import { RoomEditor } from './components/RoomEditor.js';
import { RoomModal } from './components/RoomModal.js';
import { RoomModalEnhanced } from './components/RoomModalEnhanced.js';

// Import heat load calculations
import {
  calculateRoomHeatLoad,
  calculateBuildingHeatLoad,
  getInsulationQuality
} from './utils/heatLoadCalculations.js';

// Import utilities
const utils = {
  getFloorAbbreviation(floor) {
    const mapping = {
      'Kellergeschoss': 'KG',
      'Erdgeschoss': 'EG',
      'Obergeschoss': 'OG',
      'Dachgeschoss': 'DG'
    };
    return mapping[floor] || floor;
  },

  calculateFensterArea(fenster) {
    if (fenster.hoehe_m && fenster.breite_m) {
      return Math.round(fenster.hoehe_m * fenster.breite_m * 100) / 100;
    }
    return fenster.flaeche_m2 || 0;
  },

  calculateTuerArea(tuer) {
    if (tuer.hoehe_m && tuer.breite_m) {
      return Math.round(tuer.hoehe_m * tuer.breite_m * 100) / 100;
    }
    return tuer.flaeche_m2 || 0;
  },

  createDefaultRoom(stockwerk) {
    return {
      stockwerk: stockwerk,
      raumbezeichnung: 'Neuer Raum',
      raumnutzung: '',
      norm_innentemperatur_c: 20,
      aufheizleistung_beruecksichtigen: false,
      raumgroesse_m2: 0,
      raumhoehe_m: 2.5,
      raumvolumen_m3: 0,
      heizkoerper: [],
      lueftung: { typ: 'Stosslueftung' },
      fenster: [],
      tueren: [],
      angrenzende_unbeheizte_bereiche: []
    };
  },

  exportJSON(data, filename = 'hydraulischer-abgleich-daten-bearbeitet.json') {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

// Create Vue app with inline components
const { createApp, ref, computed, onMounted } = Vue;

const app = createApp({
  setup() {
    // Reactive state
    const buildingData = ref(null);
    const currentView = ref('detail'); // DEFAULT TO DETAIL VIEW
    const selectedRoom = ref(null);
    const selectedRoomIndex = ref(null);
    const showModal = ref(false);
    const currentEditRoomIndex = ref(null);
    const sortColumn = ref('stockwerk');
    const sortDirection = ref('asc');
    const isDragging = ref(false);

    // Computed properties
    const sortedRooms = computed(() => {
      if (!buildingData.value?.raeume) return [];
      const rooms = [...buildingData.value.raeume];
      return rooms.sort((a, b) => {
        let aVal = a[sortColumn.value];
        let bVal = b[sortColumn.value];
        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = bVal ? bVal.toLowerCase() : '';
        }
        return sortDirection.value === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
      });
    });

    const roomsByFloor = computed(() => {
      if (!buildingData.value?.raeume) return {};
      const floors = {
        'Kellergeschoss': [],
        'Erdgeschoss': [],
        'Obergeschoss': [],
        'Dachgeschoss': []
      };
      buildingData.value.raeume.forEach((room, index) => {
        if (floors[room.stockwerk]) {
          floors[room.stockwerk].push({ ...room, index });
        }
      });
      return floors;
    });

    // Methods
    const loadJSON = async (file) => {
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        buildingData.value = data;
        showNotification('Datei erfolgreich geladen', 'success');
      } catch (error) {
        showNotification('Fehler beim Lesen der JSON-Datei', 'danger');
        console.error('Error loading JSON:', error);
      }
    };

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file && (file.type === 'application/json' || file.name.endsWith('.json'))) {
        loadJSON(file);
      } else if (file) {
        showNotification('Bitte wählen Sie eine gültige JSON-Datei', 'warning');
      }
    };

    const handleDrop = (event) => {
      event.preventDefault();
      isDragging.value = false;
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        if (file.type === 'application/json' || file.name.endsWith('.json')) {
          loadJSON(file);
        } else {
          showNotification('Bitte wählen Sie eine gültige JSON-Datei', 'warning');
        }
      }
    };

    const handleDragOver = (event) => {
      event.preventDefault();
      isDragging.value = true;
    };

    const handleDragLeave = (event) => {
      event.preventDefault();
      isDragging.value = false;
    };

    const showRoomDetails = (room, index) => {
      selectedRoom.value = room;
      selectedRoomIndex.value = index;
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
      selectedRoom.value = null;
      selectedRoomIndex.value = null;
    };

    const switchView = (view) => {
      currentView.value = view;
    };

    const sortTable = (column) => {
      if (sortColumn.value === column) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
      } else {
        sortColumn.value = column;
        sortDirection.value = 'asc';
      }
    };

    const editRoom = (index) => {
      currentEditRoomIndex.value = index;
      currentView.value = 'detail';
    };

    const deleteRoom = (index) => {
      if (confirm('Möchten Sie diesen Raum wirklich löschen?')) {
        buildingData.value.raeume.splice(index, 1);
        showNotification('Raum gelöscht', 'info');
      }
    };

    const selectRoomForEdit = (index) => {
      currentEditRoomIndex.value = index;
    };

    const addRoom = (stockwerk) => {
      if (!buildingData.value) {
        buildingData.value = { raeume: [] };
      }
      const newRoom = utils.createDefaultRoom(stockwerk);
      buildingData.value.raeume.push(newRoom);
      currentEditRoomIndex.value = buildingData.value.raeume.length - 1;
      showNotification('Neuer Raum hinzugefügt', 'success');
    };

    const updateRoom = (index, updatedRoom) => {
      if (buildingData.value?.raeume?.[index]) {
        buildingData.value.raeume[index] = updatedRoom;
      }
    };

    const exportJSON = () => {
      if (!buildingData.value) {
        showNotification('Keine Daten zum Exportieren vorhanden', 'warning');
        return;
      }
      utils.exportJSON(buildingData.value);
      showNotification('JSON-Datei wurde heruntergeladen', 'success');
    };

    const generatePrintReport = () => {
      if (!buildingData.value) {
        showNotification('Keine Daten zum Drucken vorhanden', 'warning');
        return;
      }

      // Create print report container if it doesn't exist
      let printContainer = document.querySelector('.print-report');
      if (!printContainer) {
        printContainer = document.createElement('div');
        printContainer.className = 'print-report';
        document.querySelector('#app').appendChild(printContainer);
      }

      // Make print preview visible
      printContainer.style.display = 'block';

      // Generate current date/time
      const now = new Date();
      const dateStr = now.toLocaleDateString('de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const timeStr = now.toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit'
      });

      // Get building parameters for calculations
      const buildingParams = buildingData.value.gebaeude?.rahmenbedingungen_heizlast || {};

      // Calculate building-wide heat load
      const buildingHeatLoad = calculateBuildingHeatLoad(
        buildingData.value.raeume || [],
        buildingParams
      );

      // Calculate summary statistics
      const totalRooms = buildingData.value.raeume?.length || 0;
      const totalArea = buildingHeatLoad.summary.totalArea.toFixed(1);
      const totalVolume = buildingHeatLoad.summary.totalVolume.toFixed(1);

      // Count heating types
      const heatingTypes = {};
      buildingData.value.raeume?.forEach(room => {
        room.heizkoerper?.forEach(hk => {
          const type = hk.Art || 'Unbekannt';
          heatingTypes[type] = (heatingTypes[type] || 0) + 1;
        });
      });

      // Generate HTML content with close button for preview
      let html = `
        <button class="btn btn-close print-close-btn d-print-none" onclick="document.querySelector('.print-report').style.display='none'"
                title="Vorschau schließen" style="position: fixed; top: 20px; right: 20px; z-index: 1000; background: white; border: 2px solid #333; padding: 8px 12px; border-radius: 4px; font-size: 18px; cursor: pointer;">
          ✕
        </button>
        <div class="print-info-banner d-print-none" style="background: #17a2b8; color: white; padding: 10px; text-align: center; margin-bottom: 20px;">
          <strong>Druckvorschau</strong> - Verwenden Sie CMD+P (Mac) oder Strg+P (Windows) zum Drucken
        </div>
        <div class="print-header">
          <h1>Hydraulischer Abgleich - Technische Dokumentation</h1>
          <div class="info">
            <div>
              <strong>Gebäude:</strong> ${buildingData.value.gebaeude?.adresse || 'Nicht angegeben'}<br>
              <strong>Baujahr:</strong> ${buildingData.value.gebaeude?.baujahr || 'Nicht angegeben'}
            </div>
            <div style="text-align: right;">
              <strong>Erstellt am:</strong> ${dateStr}<br>
              <strong>Uhrzeit:</strong> ${timeStr}<br>
              <strong>Berechnungsnorm:</strong> DIN EN 12831
            </div>
          </div>
        </div>

        <div class="print-summary">
          <h2>Gebäudezusammenfassung</h2>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
            <div>
              <strong>Anzahl Räume:</strong> ${totalRooms}
            </div>
            <div>
              <strong>Gesamtfläche:</strong> ${totalArea} m²
            </div>
            <div>
              <strong>Gesamtvolumen:</strong> ${totalVolume} m³
            </div>
          </div>
          ${Object.keys(heatingTypes).length > 0 ? `
          <div style="margin-top: 10px;">
            <strong>Heizungstypen:</strong>
            ${Object.entries(heatingTypes).map(([type, count]) =>
              `${type} (${count})`).join(', ')}
          </div>` : ''}
        </div>
      `;

      // Group rooms by floor
      const floors = ['Kellergeschoss', 'Erdgeschoss', 'Obergeschoss', 'Dachgeschoss'];

      floors.forEach(floor => {
        const floorRooms = buildingData.value.raeume?.filter(room => room.stockwerk === floor);

        if (floorRooms && floorRooms.length > 0) {
          html += `<div class="print-floor-section page-break-before">`;
          html += `<h2>${floor} (${utils.getFloorAbbreviation(floor)}) - ${floorRooms.length} Raum/Räume</h2>`;

          floorRooms.forEach(room => {

            html += `
              <div class="print-room">
                <h3>${room.raumnutzung || 'Raum'}</h3>

                <!-- Basic Room Data -->
                <div class="print-section">
                  <h4>Grunddaten</h4>
                  <table class="print-table">
                    <tr>
                      <td><strong>Raumbezeichnung:</strong></td>
                      <td>${room.raumbezeichnung || '-'}</td>
                      <td><strong>Norm-Innentemperatur:</strong></td>
                      <td>${room.norm_innentemperatur_c || 20}°C</td>
                    </tr>
                    <tr>
                      <td><strong>Fläche:</strong></td>
                      <td>${room.raumgroesse_m2 || 0} m²</td>
                      <td><strong>Höhe:</strong></td>
                      <td>${room.raumhoehe_m || 2.5} m</td>
                    </tr>
                    <tr>
                      <td><strong>Volumen:</strong></td>
                      <td>${room.raumvolumen_m3 || 0} m³</td>
                      <td><strong>Aufheizleistung:</strong></td>
                      <td>${room.aufheizleistung_beruecksichtigen ? 'Ja' : 'Nein'}</td>
                    </tr>
                    ${room.kombinierte_heizzone_mit ? `
                    <tr>
                      <td><strong>Kombinierte Heizzone:</strong></td>
                      <td colspan="3">${room.kombinierte_heizzone_mit}</td>
                    </tr>` : ''}
                  </table>
                </div>

            `;

            // Heating systems
            if (room.heizkoerper && room.heizkoerper.length > 0) {
              html += `
                <div class="print-section">
                  <h4>Heizkörper/Heizflächen</h4>
                  <table class="print-table">
                    <thead>
                      <tr>
                        <th>Art</th>
                        <th>Modell</th>
                        <th>Abmessungen</th>
                        <th>Leistung</th>
                      </tr>
                    </thead>
                    <tbody>`;
              room.heizkoerper.forEach(hk => {
                let dimensions = '-';
                const isFloorHeating = hk.Art && hk.Art.toLowerCase().includes('fussbodenheizung');

                if (isFloorHeating) {
                  if (hk.beheizte_flaeche_m2) {
                    dimensions = `${hk.beheizte_flaeche_m2} m²`;
                  }
                  if (hk.rohrabstand_mm) dimensions += ` (Rohrabstand: ${hk.rohrabstand_mm}mm)`;
                } else if (hk.bauhoehe_mm && hk.baubreite_mm) {
                  dimensions = `${hk.bauhoehe_mm}×${hk.baubreite_mm}`;
                  if (hk.bautiefe_mm) dimensions += `×${hk.bautiefe_mm}`;
                  dimensions += ' mm';
                }

                const wattage = isFloorHeating
                  ? (hk.waermeleistung_40_33_20_watt || '-')
                  : (hk.waermeleistung_55_45_20_watt || hk.leistung_w || '-');

                html += `
                      <tr>
                        <td>${hk.Art || 'Heizkörper'}</td>
                        <td>${hk.Modell || hk.modell || '-'}</td>
                        <td>${dimensions}</td>
                        <td>${wattage} W</td>
                      </tr>`;
              });
              html += `
                    </tbody>
                  </table>
                </div>`;
            }

            // Building envelope - Unheated areas
            if (room.angrenzende_unbeheizte_bereiche && Array.isArray(room.angrenzende_unbeheizte_bereiche) && room.angrenzende_unbeheizte_bereiche.length > 0) {
              const ub = room.angrenzende_unbeheizte_bereiche;

              html += `
                <div class="print-section">
                  <h4>Gebäudehülle und angrenzende unbeheizte Bereiche</h4>
                  <table class="print-table">
                    <thead>
                      <tr>
                        <th>Bauteil</th>
                        <th>Bereich</th>
                        <th>Fläche</th>
                        <th>U-Wert</th>
                      </tr>
                    </thead>
                    <tbody>`;

              ub.forEach((bereich) => {
                // Check if this area has a hinweis
                const hasHinweis = bereich.hinweis && bereich.hinweis.trim() !== '';

                if (hasHinweis) {
                  // Two-row structure with rowspan for Bauteil
                  html += `
                        <tr>
                          <td rowspan="2" style="vertical-align: top;"><strong>${bereich.typ || 'Bereich'}</strong></td>
                          <td>${bereich.art || 'Unbeheizt'}</td>
                          <td>${bereich.flaeche_m2 || '-'} m²</td>
                          <td>${bereich.u_wert || '-'} W/(m²·K)</td>
                        </tr>
                        <tr>
                          <td colspan="3" style="padding-left: 15px; font-size: 0.85em; font-style: italic; color: #555;">
                            ${bereich.hinweis}
                          </td>
                        </tr>`;
                } else {
                  // Single row without hinweis
                  html += `
                        <tr>
                          <td><strong>${bereich.typ || 'Bereich'}</strong></td>
                          <td>${bereich.art || 'Unbeheizt'}</td>
                          <td>${bereich.flaeche_m2 || '-'} m²</td>
                          <td>${bereich.u_wert || '-'} W/(m²·K)</td>
                        </tr>`;
                }
              });

              html += `
                    </tbody>
                  </table>
                </div>`;
            }

            // Windows
            if (room.fenster && room.fenster.length > 0) {
              html += `
                <div class="print-section">
                  <h4>Fenster</h4>
                  <table class="print-table">
                    <thead>
                      <tr>
                        <th>Beschreibung</th>
                        <th>Typ/Verglasung</th>
                        <th>Abmessungen</th>
                        <th>Fläche</th>
                        <th>Uw-Wert</th>
                      </tr>
                    </thead>
                    <tbody>`;
              room.fenster.forEach((fenster, idx) => {
                const area = utils.calculateFensterArea(fenster);
                html += `
                      <tr>
                        <td>${fenster.beschreibung || `Fenster ${idx + 1}`}</td>
                        <td>${fenster.verglasung || fenster.typ || 'Standard'}</td>
                        <td>${fenster.hoehe_m}×${fenster.breite_m} m</td>
                        <td>${area} m²</td>
                        <td>${fenster.uw_wert || '-'} W/(m²·K)</td>
                      </tr>`;
              });
              html += `
                    </tbody>
                  </table>
                </div>`;
            }

            // Doors
            if (room.tueren && room.tueren.length > 0) {
              html += `
                <div class="print-section">
                  <h4>Türen</h4>
                  <table class="print-table">
                    <thead>
                      <tr>
                        <th>Typ</th>
                        <th>Abmessungen</th>
                        <th>Fläche</th>
                        <th>U-Wert</th>
                        <th>Hinweis</th>
                      </tr>
                    </thead>
                    <tbody>`;
              room.tueren.forEach(tuer => {
                const area = utils.calculateTuerArea(tuer);
                html += `
                      <tr>
                        <td>${tuer.typ || 'Standard'}</td>
                        <td>${tuer.hoehe_m}×${tuer.breite_m} m</td>
                        <td>${area} m²</td>
                        <td>${tuer.u_wert || tuer.uw_wert || '-'} W/(m²·K)</td>
                        <td>${tuer.hinweis || '-'}</td>
                      </tr>`;
              });
              html += `
                    </tbody>
                  </table>
                </div>`;
            }

            // Ventilation
            if (room.lueftung) {
              html += `
                <div class="print-section">
                  <h4>Lüftung</h4>
                  <table class="print-table">
                    <tr>
                      <td><strong>Typ:</strong></td>
                      <td>${room.lueftung.typ || 'Standard'}</td>
                      <td><strong>Modell:</strong></td>
                      <td>${room.lueftung.modell || '-'}</td>
                    </tr>
                    ${room.lueftung.waermerueckgewinnung_prozent ? `
                    <tr>
                      <td><strong>Wärmerückgewinnung:</strong></td>
                      <td>${room.lueftung.waermerueckgewinnung_prozent}%</td>
                      <td><strong>Luftvolumenstrom:</strong></td>
                      <td>${room.lueftung.luftvolumenstrom_m3h || '-'} m³/h</td>
                    </tr>` : ''}
                  </table>
                </div>`;
            }

            // Additional heat source
            if (room.zusaetzliche_heizquelle) {
              const zh = room.zusaetzliche_heizquelle;
              html += `
                <div class="print-section">
                  <h4>Zusätzliche Heizquelle</h4>
                  <table class="print-table">
                    <tr>
                      <td><strong>Typ:</strong></td>
                      <td>${zh.typ}</td>
                      <td><strong>Funktion:</strong></td>
                      <td>${zh.funktion || '-'}</td>
                    </tr>
                    ${zh.modell_innen || zh.modell_aussen ? `
                    <tr>
                      <td><strong>Modell innen:</strong></td>
                      <td>${zh.modell_innen || '-'}</td>
                      <td><strong>Modell außen:</strong></td>
                      <td>${zh.modell_aussen || '-'}</td>
                    </tr>` : ''}
                    ${zh.betrieb ? `
                    <tr>
                      <td><strong>Betrieb:</strong></td>
                      <td colspan="3">${zh.betrieb}</td>
                    </tr>` : ''}
                  </table>
                </div>`;
            }

            html += `
              </div>
            `;
          });

          html += `</div>`;
        }
      });

      // Add footer with calculation reference
      html += `
        <div class="print-footer">
          <p><small><strong>Hinweis zu U-Werten:</strong> Alle angegebenen U-Werte für Wände, Böden und Decken sind Schätzwerte basierend auf den vorliegenden Informationen und sollten durch fachgerechte Berechnung verifiziert werden. Ausgenommen sind Fenster (herstellerspezifische Angaben) und Dachflächen (U-Werte gemäß EnEV-Nachweis).</small></p>
          <p><small>Diese Dokumentation dient als Referenz für die Eingabe in professionelle Berechnungssoftware</small></p>
        </div>
      `;

      // Set the HTML content
      printContainer.innerHTML = html;

      // Scroll to top of print preview
      printContainer.scrollIntoView({ behavior: 'smooth' });

      // Show notification about print preview
      showNotification('Druckvorschau erstellt - Verwenden Sie CMD+P (Mac) oder Strg+P (Windows) zum Drucken', 'info');
    };

    const showNotification = (message, type) => {
      const alertDiv = document.createElement('div');
      alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
      alertDiv.style.zIndex = '9999';
      alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      `;
      document.body.appendChild(alertDiv);
      setTimeout(() => {
        alertDiv.remove();
      }, 3000);
    };

    // Initialize Bootstrap tooltips on mount
    onMounted(() => {
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
      });
    });

    return {
      // State
      buildingData,
      currentView,
      selectedRoom,
      selectedRoomIndex,
      showModal,
      currentEditRoomIndex,
      sortColumn,
      sortDirection,
      isDragging,
      // Computed
      sortedRooms,
      roomsByFloor,
      // Methods
      loadJSON,
      handleFileUpload,
      handleDrop,
      handleDragOver,
      handleDragLeave,
      showRoomDetails,
      closeModal,
      updateRoom,
      switchView,
      sortTable,
      editRoom,
      deleteRoom,
      selectRoomForEdit,
      addRoom,
      updateRoom,
      exportJSON,
      generatePrintReport,
      showNotification,
      // Utils
      utils
    };
  },
  components: {
    RoomSidebar,
    RoomEditor,
    RoomModal,
    RoomModalEnhanced
  }
});

// Mount the app
app.mount('#app');