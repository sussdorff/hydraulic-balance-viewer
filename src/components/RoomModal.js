// Enhanced Room Modal Component (READ-ONLY with all fields)
export const RoomModal = {
  props: ['room', 'show'],
  emits: ['close'],
  computed: {
    totalHeizleistung() {
      if (!this.room?.heizkoerper) return 0;
      return this.room.heizkoerper.reduce((sum, hk) => sum + (hk.waermeleistung_55_45_20_watt || 0), 0);
    },
    totalFensterFlaeche() {
      if (!this.room?.fenster) return 0;
      return this.room.fenster.reduce((sum, f) => sum + (f.flaeche_m2 || 0), 0).toFixed(2);
    },
    totalTuerenFlaeche() {
      if (!this.room?.tueren) return 0;
      return this.room.tueren.reduce((sum, t) => sum + (t.flaeche_m2 || 0), 0).toFixed(2);
    }
  },
  methods: {
    getTemperatureClass(temp) {
      if (temp >= 24) return 'bg-danger';
      if (temp >= 20) return 'bg-warning';
      if (temp >= 18) return 'bg-info';
      return 'bg-secondary';
    },
    formatNumber(value, decimals = 1, unit = '') {
      if (value === null || value === undefined) return '-';
      return value.toFixed(decimals) + (unit ? ' ' + unit : '');
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
                  <div class="col-6" v-if="hk.bauhoehe_mm">
                    <span class="text-muted">Höhe:</span> {{ hk.bauhoehe_mm }} mm
                  </div>
                  <div class="col-6" v-if="hk.baubreite_mm">
                    <span class="text-muted">Breite:</span> {{ hk.baubreite_mm }} mm
                  </div>
                  <div class="col-6" v-if="hk.bautiefe_mm">
                    <span class="text-muted">Tiefe:</span> {{ hk.bautiefe_mm }} mm
                  </div>
                  <div class="col-12" v-if="hk.waermeleistung_55_45_20_watt">
                    <span class="text-muted">Wärmeleistung:</span>
                    <span class="badge bg-warning text-dark">{{ hk.waermeleistung_55_45_20_watt }} W</span>
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
              <h6><i class="bi bi-wind me-2"></i>Lüftung</h6>
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
                    <span class="text-muted">U-Wert:</span> {{ f.uw_wert }}
                  </div>
                  <div class="col-6">
                    <span class="text-muted">Größe:</span> {{ f.hoehe_m }}m × {{ f.breite_m }}m
                  </div>
                  <div class="col-6">
                    <span class="text-muted">Fläche:</span> {{ f.flaeche_m2 }} m²
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
                  <div class="col-6" v-if="t.uw_wert">
                    <span class="text-muted">U-Wert:</span> {{ t.uw_wert }}
                  </div>
                  <div class="col-6">
                    <span class="text-muted">Größe:</span> {{ t.hoehe_m }}m × {{ t.breite_m }}m
                  </div>
                  <div class="col-6">
                    <span class="text-muted">Fläche:</span> {{ t.flaeche_m2 }} m²
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
            <div class="info-group" v-if="room.angrenzende_unbeheizte_bereiche">
              <h6><i class="bi bi-box me-2"></i>Angrenzende unbeheizte Bereiche</h6>

              <!-- Außenwand -->
              <div v-if="room.angrenzende_unbeheizte_bereiche.aussenwand" class="mb-3">
                <div class="fw-bold text-muted">Außenwand</div>
                <div class="row small">
                  <div class="col-6">
                    <span class="text-muted">U-Wert:</span> {{ room.angrenzende_unbeheizte_bereiche.aussenwand.u_wert }}
                  </div>
                  <div class="col-6">
                    <span class="text-muted">Länge:</span> {{ room.angrenzende_unbeheizte_bereiche.aussenwand.aussenwand_laenge_m }} m
                  </div>
                  <div class="col-12" v-if="room.angrenzende_unbeheizte_bereiche.aussenwand.hinweis">
                    <span class="text-muted">Hinweis:</span> {{ room.angrenzende_unbeheizte_bereiche.aussenwand.hinweis }}
                  </div>
                </div>
              </div>

              <!-- Boden -->
              <div v-if="room.angrenzende_unbeheizte_bereiche.boden" class="mb-3">
                <div class="fw-bold text-muted">Boden</div>
                <div class="row small">
                  <div class="col-6">
                    <span class="text-muted">Bereich:</span> {{ room.angrenzende_unbeheizte_bereiche.boden.bereich }}
                  </div>
                  <div class="col-6">
                    <span class="text-muted">U-Wert:</span> {{ room.angrenzende_unbeheizte_bereiche.boden.u_wert }}
                  </div>
                  <div class="col-6" v-if="room.angrenzende_unbeheizte_bereiche.boden.flaeche_m2">
                    <span class="text-muted">Fläche:</span> {{ room.angrenzende_unbeheizte_bereiche.boden.flaeche_m2 }} m²
                  </div>
                  <div class="col-12" v-if="room.angrenzende_unbeheizte_bereiche.boden.hinweis">
                    <span class="text-muted">Hinweis:</span> {{ room.angrenzende_unbeheizte_bereiche.boden.hinweis }}
                  </div>
                </div>
              </div>

              <!-- Decke -->
              <div v-if="room.angrenzende_unbeheizte_bereiche.decke" class="mb-3">
                <div class="fw-bold text-muted">Decke</div>
                <div class="row small">
                  <div class="col-6">
                    <span class="text-muted">Bereich:</span> {{ room.angrenzende_unbeheizte_bereiche.decke.bereich }}
                  </div>
                  <div class="col-6">
                    <span class="text-muted">U-Wert:</span> {{ room.angrenzende_unbeheizte_bereiche.decke.u_wert }}
                  </div>
                  <div class="col-12" v-if="room.angrenzende_unbeheizte_bereiche.decke.hinweis">
                    <span class="text-muted">Hinweis:</span> {{ room.angrenzende_unbeheizte_bereiche.decke.hinweis }}
                  </div>
                </div>
              </div>

              <!-- Wände -->
              <div v-if="room.angrenzende_unbeheizte_bereiche.waende && room.angrenzende_unbeheizte_bereiche.waende.length > 0" class="mb-3">
                <div class="fw-bold text-muted">Wände</div>
                <div v-for="(wand, index) in room.angrenzende_unbeheizte_bereiche.waende" :key="index" class="ms-3 mb-2">
                  <div class="row small">
                    <div class="col-4">
                      <span class="text-muted">Bereich:</span> {{ wand.bereich }}
                    </div>
                    <div class="col-4">
                      <span class="text-muted">Fläche:</span> {{ wand.flaeche_m2 }} m²
                    </div>
                    <div class="col-4">
                      <span class="text-muted">U-Wert:</span> {{ wand.u_wert }}
                    </div>
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