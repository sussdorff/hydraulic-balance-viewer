// Enhanced Room Modal Component with Heat Load Calculations
import { calculateRoomHeatLoad, getInsulationQuality } from '../utils/heatLoadCalculations.js';

export const RoomModalEnhanced = {
  props: ['room', 'show', 'buildingParams'],
  emits: ['close'],
  computed: {
    heatLoadCalculation() {
      if (!this.room) return null;
      return calculateRoomHeatLoad(this.room, this.buildingParams || {});
    },

    totalHeizleistung() {
      if (!this.room?.heizkoerper) return 0;
      return this.room.heizkoerper.reduce((sum, hk) => {
        // Use appropriate wattage based on heater type
        const isFloorHeating = hk.Art && hk.Art.toLowerCase().includes('fussbodenheizung');
        const wattage = isFloorHeating
          ? (hk.waermeleistung_40_33_20_watt || 0)
          : (hk.waermeleistung_55_45_20_watt || hk.leistung_w || 0);
        return sum + wattage;
      }, 0);
    },

    totalFensterFlaeche() {
      if (!this.room?.fenster) return 0;
      return this.room.fenster.reduce((sum, f) =>
        sum + (f.flaeche_m2 || (f.hoehe_m * f.breite_m) || 0), 0).toFixed(2);
    },

    totalTuerenFlaeche() {
      if (!this.room?.tueren) return 0;
      return this.room.tueren.reduce((sum, t) =>
        sum + (t.flaeche_m2 || (t.hoehe_m * t.breite_m) || 0), 0).toFixed(2);
    },

    capacityStatus() {
      if (!this.heatLoadCalculation) return null;
      const coverage = this.heatLoadCalculation.total.capacityCoverage;
      if (coverage >= 100) return { class: 'success', text: 'Ausreichend', icon: 'check-circle' };
      if (coverage >= 80) return { class: 'warning', text: 'Knapp', icon: 'exclamation-triangle' };
      return { class: 'danger', text: 'Unzureichend', icon: 'x-circle' };
    }
  },
  methods: {
    getHeaterWattage(hk) {
      const isFloorHeating = hk.Art && hk.Art.toLowerCase().includes('fussbodenheizung');
      if (isFloorHeating) {
        return hk.waermeleistung_40_33_20_watt || 0;
      }
      return hk.waermeleistung_55_45_20_watt || hk.leistung_w || 0;
    },


    getTemperatureClass(temp) {
      if (temp >= 24) return 'bg-danger';
      if (temp >= 20) return 'bg-warning';
      if (temp >= 18) return 'bg-info';
      return 'bg-secondary';
    },

    formatNumber(value, decimals = 1, unit = '') {
      if (value === null || value === undefined) return '-';
      return value.toFixed(decimals) + (unit ? ' ' + unit : '');
    },

    getInsulationBadge(uValue) {
      const quality = getInsulationQuality(uValue);
      return quality;
    }
  },
  template: `
    <div class="modal fade" :class="{ show: show, 'd-block': show }" tabindex="-1" @click.self="$emit('close')">
      <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content" v-if="room">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-door-open me-2"></i>
              {{ room.raumbezeichnung }} - {{ room.stockwerk }}
            </h5>
            <button type="button" class="btn-close" @click="$emit('close')"></button>
          </div>
          <div class="modal-body">
            <!-- Heat Load Analysis Summary (NEW) -->
            <div class="alert" :class="'alert-' + (capacityStatus?.class || 'info')" v-if="heatLoadCalculation">
              <h5 class="alert-heading">
                <i :class="'bi bi-' + (capacityStatus?.icon || 'info-circle')" class="me-2"></i>
                Heizlastanalyse nach DIN EN 12831
              </h5>
              <div class="row">
                <div class="col-md-6">
                  <dl class="row mb-0">
                    <dt class="col-sm-6">Norm-Heizlast:</dt>
                    <dd class="col-sm-6"><strong>{{ formatNumber(heatLoadCalculation.total.heatLoad, 0, 'W') }}</strong></dd>
                    <dt class="col-sm-6">Transmissionsverluste:</dt>
                    <dd class="col-sm-6">{{ formatNumber(heatLoadCalculation.transmission.loss, 0, 'W') }}</dd>
                    <dt class="col-sm-6">Lüftungsverluste:</dt>
                    <dd class="col-sm-6">{{ formatNumber(heatLoadCalculation.ventilation.loss, 0, 'W') }}</dd>
                  </dl>
                </div>
                <div class="col-md-6">
                  <dl class="row mb-0">
                    <dt class="col-sm-6">Spezifische Heizlast:</dt>
                    <dd class="col-sm-6">{{ formatNumber(heatLoadCalculation.total.specificHeatLoad, 1, 'W/m²') }}</dd>
                    <dt class="col-sm-6">Vorhandene Leistung:</dt>
                    <dd class="col-sm-6">{{ formatNumber(heatLoadCalculation.total.existingCapacity, 0, 'W') }}</dd>
                    <dt class="col-sm-6">Deckungsgrad:</dt>
                    <dd class="col-sm-6">
                      <div class="progress" style="height: 20px;">
                        <div class="progress-bar"
                             :class="'bg-' + (capacityStatus?.class || 'info')"
                             :style="{ width: Math.min(100, heatLoadCalculation.total.capacityCoverage) + '%' }">
                          {{ formatNumber(heatLoadCalculation.total.capacityCoverage, 0, '%') }}
                        </div>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
              <div v-if="heatLoadCalculation.total.capacityDeficit > 0" class="mt-2">
                <small class="text-danger">
                  <i class="bi bi-exclamation-triangle me-1"></i>
                  Fehlende Heizleistung: {{ formatNumber(heatLoadCalculation.total.capacityDeficit, 0, 'W') }}
                </small>
              </div>
            </div>

            <!-- Transmission Heat Loss Details (NEW) -->
            <div class="info-group" v-if="heatLoadCalculation && heatLoadCalculation.transmission.details.length > 0">
              <h6><i class="bi bi-arrows-expand me-2"></i>Transmissionswärmeverluste (HT)</h6>
              <div class="table-responsive">
                <table class="table table-sm">
                  <thead>
                    <tr>
                      <th>Bauteil</th>
                      <th>Fläche</th>
                      <th>U-Wert</th>
                      <th>Faktor</th>
                      <th>HT [W/K]</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="detail in heatLoadCalculation.transmission.details" :key="detail.element">
                      <td>{{ detail.element }}</td>
                      <td>{{ formatNumber(detail.area, 1, 'm²') }}</td>
                      <td>
                        {{ formatNumber(detail.u_value, 2) }}
                        <span v-if="detail.u_value > 0" class="badge ms-1"
                              :class="'bg-' + getInsulationBadge(detail.u_value).color">
                          {{ getInsulationBadge(detail.u_value).label }}
                        </span>
                      </td>
                      <td>{{ detail.uwb_factor || detail.temp_factor || '-' }}</td>
                      <td><strong>{{ formatNumber(detail.HT, 1) }}</strong></td>
                    </tr>
                    <tr class="table-active">
                      <td colspan="4"><strong>Gesamt HT:</strong></td>
                      <td><strong>{{ formatNumber(heatLoadCalculation.transmission.coefficient, 1, 'W/K') }}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Grunddaten -->
            <div class="info-group">
              <h6><i class="bi bi-info-circle me-2"></i>Grunddaten</h6>
              <div class="row">
                <div class="col-md-6">
                  <div class="info-row">
                    <span class="info-label">Raumnutzung:</span>
                    <span class="info-value">{{ room.raumnutzung || '-' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Fläche:</span>
                    <span class="info-value">{{ formatNumber(room.raumgroesse_m2, 1, 'm²') }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Höhe:</span>
                    <span class="info-value">{{ formatNumber(room.raumhoehe_m, 1, 'm') }}</span>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="info-row">
                    <span class="info-label">Volumen:</span>
                    <span class="info-value">{{ formatNumber(room.raumvolumen_m3, 1, 'm³') }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Norm-Innentemperatur:</span>
                    <span class="info-value">
                      <span class="badge" :class="getTemperatureClass(room.norm_innentemperatur_c)">
                        {{ room.norm_innentemperatur_c }}°C
                      </span>
                    </span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Aufheizleistung:</span>
                    <span class="info-value">
                      <span v-if="room.aufheizleistung_beruecksichtigen" class="badge bg-success">Ja</span>
                      <span v-else class="badge bg-secondary">Nein</span>
                    </span>
                  </div>
                </div>
              </div>
              <div v-if="room.kombinierte_heizzone_mit" class="info-row">
                <span class="info-label">Kombinierte Heizzone mit:</span>
                <span class="info-value">{{ room.kombinierte_heizzone_mit }}</span>
              </div>
            </div>

            <!-- Heizkörper -->
            <div class="info-group" v-if="room.heizkoerper && room.heizkoerper.length > 0">
              <h6><i class="bi bi-thermometer-half me-2"></i>Heizkörper ({{ room.heizkoerper.length }})</h6>
              <div v-for="(hk, index) in room.heizkoerper" :key="index" class="mb-3 border-start ps-3">
                <div class="fw-bold">{{ hk.Art || 'Heizkörper' }} {{ index + 1 }}</div>
                <div class="row small">
                  <div class="col-6" v-if="hk.Modell || hk.modell">
                    <span class="text-muted">Modell:</span> {{ hk.Modell || hk.modell }}
                  </div>
                  <!-- Floor heating dimensions -->
                  <template v-if="hk.Art && hk.Art.toLowerCase().includes('fussbodenheizung')">
                    <div class="col-6" v-if="hk.beheizte_flaeche_m2">
                      <span class="text-muted">Beheizte Fläche:</span> {{ hk.beheizte_flaeche_m2 }} m²
                    </div>
                    <div class="col-6" v-if="hk.rohrabstand_mm">
                      <span class="text-muted">Rohrabstand:</span> {{ hk.rohrabstand_mm }} mm
                    </div>
                  </template>
                  <!-- Radiator dimensions -->
                  <template v-else>
                    <div class="col-6" v-if="hk.bauhoehe_mm">
                      <span class="text-muted">Höhe:</span> {{ hk.bauhoehe_mm }} mm
                    </div>
                    <div class="col-6" v-if="hk.baubreite_mm">
                      <span class="text-muted">Breite:</span> {{ hk.baubreite_mm }} mm
                    </div>
                    <div class="col-6" v-if="hk.bautiefe_mm">
                      <span class="text-muted">Tiefe:</span> {{ hk.bautiefe_mm }} mm
                    </div>
                  </template>
                  <div class="col-12" v-if="getHeaterWattage(hk) > 0">
                    <span class="text-muted">Wärmeleistung:</span>
                    <span class="badge bg-warning text-dark">{{ getHeaterWattage(hk) }} W</span>
                  </div>
                  <div class="col-12" v-if="hk.hinweis">
                    <span class="text-muted">Hinweis:</span> {{ hk.hinweis }}
                  </div>
                </div>
              </div>
              <div class="mt-2 pt-2 border-top">
                <strong>Gesamtleistung:</strong>
                <span class="badge bg-primary">{{ totalHeizleistung }} W</span>
              </div>
            </div>

            <!-- Lüftung -->
            <div class="info-group" v-if="room.lueftung && room.lueftung.typ">
              <h6>
                <i class="bi bi-wind me-2"></i>Lüftung
                <span v-if="heatLoadCalculation" class="badge bg-info ms-2">
                  HV: {{ formatNumber(heatLoadCalculation.ventilation.coefficient, 1, 'W/K') }}
                </span>
              </h6>
              <div class="row">
                <div class="col-md-6">
                  <div class="info-row">
                    <span class="info-label">Typ:</span>
                    <span class="info-value">{{ room.lueftung.typ }}</span>
                  </div>
                  <div class="info-row" v-if="room.lueftung.modell">
                    <span class="info-label">Modell:</span>
                    <span class="info-value">{{ room.lueftung.modell }}</span>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="info-row" v-if="room.lueftung.waermerueckgewinnung_prozent">
                    <span class="info-label">Wärmerückgewinnung:</span>
                    <span class="info-value">{{ room.lueftung.waermerueckgewinnung_prozent }}%</span>
                  </div>
                  <div class="info-row" v-if="room.lueftung.luftvolumenstrom_m3h">
                    <span class="info-label">Luftvolumenstrom:</span>
                    <span class="info-value">{{ room.lueftung.luftvolumenstrom_m3h }} m³/h</span>
                  </div>
                </div>
              </div>
              <div v-if="heatLoadCalculation" class="mt-2 small text-muted">
                Luftwechselrate: {{ formatNumber(heatLoadCalculation.ventilation.airExchangeRate, 2, 'h⁻¹') }}
              </div>
            </div>

            <!-- Fenster -->
            <div class="info-group" v-if="room.fenster && room.fenster.length > 0">
              <h6><i class="bi bi-square me-2"></i>Fenster ({{ room.fenster.length }})</h6>
              <div v-for="(f, index) in room.fenster" :key="index" class="mb-3 border-start ps-3">
                <div class="fw-bold">Fenster {{ index + 1 }}: {{ f.beschreibung || f.typ || 'Standard' }}</div>
                <div class="row small">
                  <div class="col-6" v-if="f.verglasung">
                    <span class="text-muted">Verglasung:</span> {{ f.verglasung }}
                  </div>
                  <div class="col-6" v-if="f.uw_wert">
                    <span class="text-muted">U-Wert:</span>
                    {{ f.uw_wert }}
                    <span class="badge ms-1" :class="'bg-' + getInsulationBadge(f.uw_wert).color">
                      {{ getInsulationBadge(f.uw_wert).label }}
                    </span>
                  </div>
                  <div class="col-6">
                    <span class="text-muted">Größe:</span> {{ f.hoehe_m }}m × {{ f.breite_m }}m
                  </div>
                  <div class="col-6">
                    <span class="text-muted">Fläche:</span> {{ f.flaeche_m2 || (f.hoehe_m * f.breite_m).toFixed(2) }} m²
                  </div>
                  <div class="col-12" v-if="f.sprossen">
                    <span class="text-muted">Sprossen:</span> {{ f.sprossen }}
                  </div>
                </div>
              </div>
              <div class="mt-2 pt-2 border-top">
                <strong>Gesamtfläche:</strong> {{ totalFensterFlaeche }} m²
              </div>
            </div>

            <!-- Türen -->
            <div class="info-group" v-if="room.tueren && room.tueren.length > 0">
              <h6><i class="bi bi-door-closed me-2"></i>Türen ({{ room.tueren.length }})</h6>
              <div v-for="(t, index) in room.tueren" :key="index" class="mb-3 border-start ps-3">
                <div class="fw-bold">{{ t.typ || 'Tür' }} {{ index + 1 }}</div>
                <div class="row small">
                  <div class="col-6" v-if="t.uw_wert || t.u_wert">
                    <span class="text-muted">U-Wert:</span>
                    {{ t.uw_wert || t.u_wert }}
                    <span class="badge ms-1" :class="'bg-' + getInsulationBadge(t.uw_wert || t.u_wert).color">
                      {{ getInsulationBadge(t.uw_wert || t.u_wert).label }}
                    </span>
                  </div>
                  <div class="col-6">
                    <span class="text-muted">Größe:</span> {{ t.hoehe_m }}m × {{ t.breite_m }}m
                  </div>
                  <div class="col-6">
                    <span class="text-muted">Fläche:</span> {{ t.flaeche_m2 || (t.hoehe_m * t.breite_m).toFixed(2) }} m²
                  </div>
                  <div class="col-12" v-if="t.hinweis">
                    <span class="text-muted">Hinweis:</span> {{ t.hinweis }}
                  </div>
                </div>
              </div>
              <div class="mt-2 pt-2 border-top">
                <strong>Gesamtfläche:</strong> {{ totalTuerenFlaeche }} m²
              </div>
            </div>

            <!-- Angrenzende unbeheizte Bereiche -->
            <div class="info-group" v-if="room.angrenzende_unbeheizte_bereiche && room.angrenzende_unbeheizte_bereiche.length > 0">
              <h6><i class="bi bi-box me-2"></i>Angrenzende unbeheizte Bereiche</h6>
              <div v-for="(bereich, index) in room.angrenzende_unbeheizte_bereiche" :key="index" class="mb-3">
                <div class="fw-bold text-muted">{{ bereich.typ }}</div>
                <div class="row small">
                  <div class="col-4">
                    <span class="text-muted">Art:</span> {{ bereich.art || '-' }}
                  </div>
                  <div class="col-4">
                    <span class="text-muted">Fläche:</span> {{ bereich.flaeche_m2 || '-' }} m²
                  </div>
                  <div class="col-4">
                    <span class="text-muted">U-Wert:</span>
                    {{ bereich.u_wert }}
                    <span class="badge ms-1" :class="'bg-' + getInsulationBadge(bereich.u_wert).color">
                      {{ getInsulationBadge(bereich.u_wert).label }}
                    </span>
                  </div>
                  <div class="col-12" v-if="bereich.hinweis">
                    <span class="text-muted">Hinweis:</span> {{ bereich.hinweis }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Zusätzliche Heizquelle -->
            <div class="info-group" v-if="room.zusaetzliche_heizquelle">
              <h6><i class="bi bi-fire me-2"></i>Zusätzliche Heizquelle</h6>
              <div class="row">
                <div class="col-md-6">
                  <div class="info-row">
                    <span class="info-label">Typ:</span>
                    <span class="info-value">{{ room.zusaetzliche_heizquelle.typ }}</span>
                  </div>
                  <div class="info-row" v-if="room.zusaetzliche_heizquelle.modell_innen">
                    <span class="info-label">Modell (innen):</span>
                    <span class="info-value">{{ room.zusaetzliche_heizquelle.modell_innen }}</span>
                  </div>
                  <div class="info-row" v-if="room.zusaetzliche_heizquelle.modell_aussen">
                    <span class="info-label">Modell (außen):</span>
                    <span class="info-value">{{ room.zusaetzliche_heizquelle.modell_aussen }}</span>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="info-row" v-if="room.zusaetzliche_heizquelle.funktion">
                    <span class="info-label">Funktion:</span>
                    <span class="info-value">{{ room.zusaetzliche_heizquelle.funktion }}</span>
                  </div>
                  <div class="info-row" v-if="room.zusaetzliche_heizquelle.betrieb">
                    <span class="info-label">Betrieb:</span>
                    <span class="info-value">{{ room.zusaetzliche_heizquelle.betrieb }}</span>
                  </div>
                </div>
                <div class="col-12" v-if="room.zusaetzliche_heizquelle.hinweis">
                  <div class="info-row">
                    <span class="info-label">Hinweis:</span>
                    <span class="info-value">{{ room.zusaetzliche_heizquelle.hinweis }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
};