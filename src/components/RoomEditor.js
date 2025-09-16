// Room Editor Component
export const RoomEditor = {
  props: ['room', 'roomIndex', 'allRooms'],
  data() {
    return {
      localRoom: null,
      raumnutzungsOptionen: [
        'Wohnzimmer',
        'Schlafzimmer',
        'Kinderzimmer',
        'Büro',
        'Essküche',
        'Badezimmer',
        'WC',
        'Flur',
        'Abstellraum',
        'Hauswirtschaftsraum',
        'Gästezimmer',
        'Hobbyraum',
        'Arbeitszimmer',
        'Ankleidezimmer',
        'Studio',
        'AirBnB Apartment',
        'Werkstatt',
        '2. Wohnzimmer (selten genutzt)',
        'Wohnzimmer (Hauptnutzung abends)',
        'Wohnraum'
      ],
      bereichOptionen: [
        'Außenluft',
        'Erdreich',
        'Keller unbeheizt',
        'Dachboden unbeheizt',
        'Garage',
        'Treppenhaus unbeheizt',
        'Halle',
        'Keller EG',
        'Keller OG',
        'Treppenhaus (KG)',
        'Treppenhaus (EG)',
        'Treppenhaus (OG)',
        'Halle (EG)',
        'Halle (OG)',
        'Dach/Außenluft',
        'Unbeheizt',
        'Unbeheizter Raum'
      ]
    };
  },
  mounted() {
    this.localRoom = JSON.parse(JSON.stringify(this.room));
  },
  watch: {
    room: {
      handler(newVal) {
        this.localRoom = JSON.parse(JSON.stringify(newVal));
      },
      deep: true
    }
  },
  methods: {
    updateField(field, value) {
      this.localRoom[field] = value;
      if (field === 'raumgroesse_m2' && this.localRoom.raumhoehe_m) {
        this.localRoom.raumvolumen_m3 = Math.round(this.localRoom.raumgroesse_m2 * this.localRoom.raumhoehe_m * 100) / 100;
        this.$emit('updateRoom', this.roomIndex, this.localRoom);
      }
    },
    addUnbeheizterBereich() {
      if (!this.localRoom.angrenzende_unbeheizte_bereiche) {
        this.localRoom.angrenzende_unbeheizte_bereiche = [];
      }
      this.localRoom.angrenzende_unbeheizte_bereiche.push({
        typ: 'Innenwand',
        u_wert: 0,
        flaeche_m2: 0,
        art: '',
        hinweis: ''
      });
      this.$emit('updateRoom', this.roomIndex, this.localRoom);
    },
    deleteUnbeheizterBereich(index) {
      this.localRoom.angrenzende_unbeheizte_bereiche.splice(index, 1);
      if (this.localRoom.angrenzende_unbeheizte_bereiche.length === 0) {
        delete this.localRoom.angrenzende_unbeheizte_bereiche;
      }
      this.$emit('updateRoom', this.roomIndex, this.localRoom);
    },
    updateUnbeheizterBereich(index, field, value) {
      if (this.localRoom.angrenzende_unbeheizte_bereiche?.[index]) {
        this.localRoom.angrenzende_unbeheizte_bereiche[index][field] = value;

        // Auto-calculate area for floor/ceiling based on room area
        if (field === 'typ') {
          if (value === 'Boden' || value === 'Decke') {
            this.localRoom.angrenzende_unbeheizte_bereiche[index].flaeche_m2 =
              this.localRoom.raumgroesse_m2 || 0;
          }
        }

        this.$emit('updateRoom', this.roomIndex, this.localRoom);
      }
    },
    addHeizkoerper() {
      if (!this.localRoom.heizkoerper) {
        this.localRoom.heizkoerper = [];
      }
      this.localRoom.heizkoerper.push({
        Art: '',
        waermeleistung_55_45_20_watt: 0,
        waermeleistung_40_33_20_watt: 0,
        baubreite_mm: 0,
        bauhoehe_mm: 0,
        bautiefe_mm: 0,
        hinweis: ''
      });
      this.$emit('updateRoom', this.roomIndex, this.localRoom);
    },
    deleteHeizkoerper(index) {
      this.localRoom.heizkoerper.splice(index, 1);
      this.$emit('updateRoom', this.roomIndex, this.localRoom);
    },
    updateHeizkoerper(index, field, value) {
      if (this.localRoom.heizkoerper?.[index]) {
        this.localRoom.heizkoerper[index][field] = value;
        this.$emit('updateRoom', this.roomIndex, this.localRoom);
      }
    },
    addFenster() {
      if (!this.localRoom.fenster) {
        this.localRoom.fenster = [];
      }
      this.localRoom.fenster.push({
        typ: '',
        verglasung: '',
        uw_wert: 0,
        hoehe_m: 0,
        breite_m: 0,
        flaeche_m2: 0,
        beschreibung: ''
      });
      this.$emit('updateRoom', this.roomIndex, this.localRoom);
    },
    deleteFenster(index) {
      this.localRoom.fenster.splice(index, 1);
      this.$emit('updateRoom', this.roomIndex, this.localRoom);
    },
    updateFenster(index, field, value) {
      if (this.localRoom.fenster?.[index]) {
        this.localRoom.fenster[index][field] = value;
        // Auto-calculate area
        if (field === 'hoehe_m' || field === 'breite_m') {
          const fenster = this.localRoom.fenster[index];
          fenster.flaeche_m2 = Math.round(fenster.hoehe_m * fenster.breite_m * 100) / 100;
        }
        this.$emit('updateRoom', this.roomIndex, this.localRoom);
      }
    },
    addTuer() {
      if (!this.localRoom.tueren) {
        this.localRoom.tueren = [];
      }
      this.localRoom.tueren.push({
        typ: '',
        hoehe_m: 0,
        breite_m: 0,
        flaeche_m2: 0,
        uw_wert: 0,
        hinweis: ''
      });
      this.$emit('updateRoom', this.roomIndex, this.localRoom);
    },
    deleteTuer(index) {
      this.localRoom.tueren.splice(index, 1);
      this.$emit('updateRoom', this.roomIndex, this.localRoom);
    },
    updateTuer(index, field, value) {
      if (this.localRoom.tueren?.[index]) {
        this.localRoom.tueren[index][field] = value;
        // Auto-calculate area
        if (field === 'hoehe_m' || field === 'breite_m') {
          const tuer = this.localRoom.tueren[index];
          tuer.flaeche_m2 = Math.round(tuer.hoehe_m * tuer.breite_m * 100) / 100;
        }
        this.$emit('updateRoom', this.roomIndex, this.localRoom);
      }
    }
  },
  template: `
    <div v-if="localRoom" class="room-editor">
      <h4>{{ localRoom.raumbezeichnung }} - {{ localRoom.stockwerk }}</h4>
      <hr>

      <!-- Grunddaten -->
      <div class="form-section">
        <h5>Grunddaten</h5>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">Raumbezeichnung</label>
            <input type="text" class="form-control"
                   :value="localRoom.raumbezeichnung"
                   @input="updateField('raumbezeichnung', $event.target.value)">
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Raumnutzung</label>
            <select class="form-control"
                    :value="localRoom.raumnutzung"
                    @change="updateField('raumnutzung', $event.target.value)">
              <option value="">-- Auswählen --</option>
              <option v-for="option in raumnutzungsOptionen" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </div>
          <div class="col-md-4 mb-3">
            <label class="form-label">Norm-Innentemperatur (°C)</label>
            <input type="number" class="form-control"
                   :value="localRoom.norm_innentemperatur_c"
                   @input="updateField('norm_innentemperatur_c', parseFloat($event.target.value))">
          </div>
          <div class="col-md-4 mb-3">
            <label class="form-label">Raumgröße (m²)</label>
            <input type="number" step="0.1" class="form-control"
                   :value="localRoom.raumgroesse_m2"
                   @input="updateField('raumgroesse_m2', parseFloat($event.target.value))">
          </div>
          <div class="col-md-4 mb-3">
            <label class="form-label">Raumhöhe (m)</label>
            <input type="number" step="0.1" class="form-control"
                   :value="localRoom.raumhoehe_m"
                   @input="updateField('raumhoehe_m', parseFloat($event.target.value))">
          </div>
          <div class="col-md-4 mb-3">
            <label class="form-label">Raumvolumen (m³)</label>
            <input type="number" step="0.01" class="form-control"
                   :value="localRoom.raumvolumen_m3"
                   disabled>
          </div>
          <div class="col-md-4 mb-3">
            <label class="form-label">
              Aufheizleistung berücksichtigen
              <i class="bi bi-info-circle text-muted" title="Räume die regelmäßig schnell aufgeheizt werden müssen"></i>
            </label>
            <div class="form-check">
              <input type="checkbox" class="form-check-input"
                     :checked="localRoom.aufheizleistung_beruecksichtigen"
                     @change="updateField('aufheizleistung_beruecksichtigen', $event.target.checked)">
            </div>
          </div>
          <div class="col-md-4 mb-3">
            <label class="form-label">Kombinierte Heizzone mit</label>
            <select class="form-control"
                    :value="localRoom.kombinierte_heizzone_mit"
                    @change="updateField('kombinierte_heizzone_mit', $event.target.value)">
              <option value="">-- Keine --</option>
              <option v-for="r in allRooms.filter(r => r.raumbezeichnung !== localRoom.raumbezeichnung)"
                      :key="r.raumbezeichnung"
                      :value="r.raumbezeichnung + ' (' + r.stockwerk.substring(0,2) + ')'">
                {{ r.raumbezeichnung }} ({{ r.stockwerk }})
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Heizkörper -->
      <div class="form-section">
        <h5>Heizkörper
          <button class="btn btn-sm btn-outline-primary ms-2" @click="addHeizkoerper">
            <i class="bi bi-plus"></i> Hinzufügen
          </button>
        </h5>
        <div v-if="localRoom.heizkoerper && localRoom.heizkoerper.length > 0">
          <div v-for="(hk, index) in localRoom.heizkoerper" :key="index" class="nested-object">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h6>Heizkörper {{ index + 1 }}</h6>
              <button class="btn btn-sm btn-outline-danger" @click="deleteHeizkoerper(index)">
                <i class="bi bi-trash"></i>
              </button>
            </div>
            <div class="row">
              <div class="col-md-4 mb-2">
                <label class="form-label">Art</label>
                <select class="form-control form-control-sm"
                        :value="hk.Art"
                        @change="updateHeizkoerper(index, 'Art', $event.target.value)">
                  <option value="">-- Auswählen --</option>
                  <option value="Plattenheizkörper">Plattenheizkörper</option>
                  <option value="Röhrenheizkörper">Röhrenheizkörper</option>
                  <option value="Badheizkörper">Badheizkörper</option>
                  <option value="Fussbodenheizung">Fußbodenheizung</option>
                  <option value="Konvektor">Konvektor</option>
                </select>
              </div>
              <div class="col-md-4 mb-2">
                <label class="form-label">Modell</label>
                <input type="text" class="form-control form-control-sm"
                       :value="hk.Modell || hk.modell"
                       @input="updateHeizkoerper(index, 'Modell', $event.target.value)">
              </div>

              <!-- Conditional fields for floor heating -->
              <template v-if="hk.Art && hk.Art.toLowerCase().includes('fussbodenheizung')">
                <div class="col-md-4 mb-2">
                  <label class="form-label">Wärmeleistung <small class="text-muted">40/33/20°C</small> (W)</label>
                  <input type="number" class="form-control form-control-sm"
                         :value="hk.waermeleistung_40_33_20_watt"
                         @input="updateHeizkoerper(index, 'waermeleistung_40_33_20_watt', parseFloat($event.target.value))">
                </div>
                <div class="col-md-4 mb-2">
                  <label class="form-label">Beheizte Fläche (m²)</label>
                  <input type="number" step="0.1" class="form-control form-control-sm"
                         :value="hk.beheizte_flaeche_m2"
                         @input="updateHeizkoerper(index, 'beheizte_flaeche_m2', parseFloat($event.target.value))">
                </div>
                <div class="col-md-4 mb-2">
                  <label class="form-label">Rohrabstand (mm)</label>
                  <input type="number" class="form-control form-control-sm"
                         :value="hk.rohrabstand_mm"
                         @input="updateHeizkoerper(index, 'rohrabstand_mm', parseFloat($event.target.value))">
                </div>
              </template>

              <!-- Regular heater fields -->
              <template v-else>
                <div class="col-md-4 mb-2">
                  <label class="form-label">Wärmeleistung <small class="text-muted">55/45/20°C</small> (W)</label>
                  <input type="number" class="form-control form-control-sm"
                         :value="hk.waermeleistung_55_45_20_watt || hk.leistung_w"
                         @input="updateHeizkoerper(index, 'waermeleistung_55_45_20_watt', parseFloat($event.target.value))">
                </div>
                <div class="col-md-4 mb-2">
                  <label class="form-label">Bauhöhe (mm)</label>
                  <input type="number" class="form-control form-control-sm"
                         :value="hk.bauhoehe_mm"
                         @input="updateHeizkoerper(index, 'bauhoehe_mm', parseFloat($event.target.value))">
                </div>
                <div class="col-md-4 mb-2">
                  <label class="form-label">Baubreite (mm)</label>
                  <input type="number" class="form-control form-control-sm"
                         :value="hk.baubreite_mm"
                         @input="updateHeizkoerper(index, 'baubreite_mm', parseFloat($event.target.value))">
                </div>
                <div class="col-md-4 mb-2">
                  <label class="form-label">Bautiefe (mm)</label>
                  <input type="number" class="form-control form-control-sm"
                         :value="hk.bautiefe_mm"
                         @input="updateHeizkoerper(index, 'bautiefe_mm', parseFloat($event.target.value))">
                </div>
              </template>

              <div class="col-md-8 mb-2">
                <label class="form-label">Hinweis</label>
                <input type="text" class="form-control form-control-sm"
                       :value="hk.hinweis"
                       @input="updateHeizkoerper(index, 'hinweis', $event.target.value)">
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-muted">Keine Heizkörper vorhanden</div>
      </div>

      <!-- Fenster -->
      <div class="form-section">
        <h5>Fenster
          <button class="btn btn-sm btn-outline-primary ms-2" @click="addFenster">
            <i class="bi bi-plus"></i> Hinzufügen
          </button>
        </h5>
        <div v-if="localRoom.fenster && localRoom.fenster.length > 0">
          <div v-for="(fenster, index) in localRoom.fenster" :key="index" class="nested-object">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h6>Fenster {{ index + 1 }}</h6>
              <button class="btn btn-sm btn-outline-danger" @click="deleteFenster(index)">
                <i class="bi bi-trash"></i>
              </button>
            </div>
            <div class="row">
              <div class="col-md-4 mb-2">
                <label class="form-label">Typ</label>
                <input type="text" class="form-control form-control-sm"
                       :value="fenster.typ"
                       @input="updateFenster(index, 'typ', $event.target.value)">
              </div>
              <div class="col-md-4 mb-2">
                <label class="form-label">Verglasung</label>
                <input type="text" class="form-control form-control-sm"
                       :value="fenster.verglasung"
                       @input="updateFenster(index, 'verglasung', $event.target.value)">
              </div>
              <div class="col-md-4 mb-2">
                <label class="form-label">Uw-Wert (W/m²K)</label>
                <input type="number" step="0.01" class="form-control form-control-sm"
                       :value="fenster.uw_wert"
                       @input="updateFenster(index, 'uw_wert', parseFloat($event.target.value))">
              </div>
              <div class="col-md-3 mb-2">
                <label class="form-label">Höhe (m)</label>
                <input type="number" step="0.01" class="form-control form-control-sm"
                       :value="fenster.hoehe_m"
                       @input="updateFenster(index, 'hoehe_m', parseFloat($event.target.value))">
              </div>
              <div class="col-md-3 mb-2">
                <label class="form-label">Breite (m)</label>
                <input type="number" step="0.01" class="form-control form-control-sm"
                       :value="fenster.breite_m"
                       @input="updateFenster(index, 'breite_m', parseFloat($event.target.value))">
              </div>
              <div class="col-md-3 mb-2">
                <label class="form-label">Fläche (m²)</label>
                <input type="number" step="0.01" class="form-control form-control-sm"
                       :value="fenster.flaeche_m2"
                       disabled>
              </div>
              <div class="col-md-3 mb-2">
                <label class="form-label">Beschreibung</label>
                <input type="text" class="form-control form-control-sm"
                       :value="fenster.beschreibung"
                       @input="updateFenster(index, 'beschreibung', $event.target.value)">
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-muted">Keine Fenster vorhanden</div>
      </div>

      <!-- Türen -->
      <div class="form-section">
        <h5>Türen
          <button class="btn btn-sm btn-outline-primary ms-2" @click="addTuer">
            <i class="bi bi-plus"></i> Hinzufügen
          </button>
        </h5>
        <div v-if="localRoom.tueren && localRoom.tueren.length > 0">
          <div v-for="(tuer, index) in localRoom.tueren" :key="index" class="nested-object">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h6>Tür {{ index + 1 }}</h6>
              <button class="btn btn-sm btn-outline-danger" @click="deleteTuer(index)">
                <i class="bi bi-trash"></i>
              </button>
            </div>
            <div class="row">
              <div class="col-md-4 mb-2">
                <label class="form-label">Typ</label>
                <select class="form-control form-control-sm"
                        :value="tuer.typ"
                        @change="updateTuer(index, 'typ', $event.target.value)">
                  <option value="">-- Auswählen --</option>
                  <option value="Innentür">Innentür</option>
                  <option value="Innentür (Bad)">Innentür (Bad)</option>
                  <option value="Außentür">Außentür</option>
                  <option value="Aussentür">Außentür</option>
                  <option value="Balkontür">Balkontür</option>
                  <option value="Terrassentür">Terrassentür</option>
                </select>
              </div>
              <div class="col-md-2 mb-2">
                <label class="form-label">Höhe (m)</label>
                <input type="number" step="0.01" class="form-control form-control-sm"
                       :value="tuer.hoehe_m"
                       @input="updateTuer(index, 'hoehe_m', parseFloat($event.target.value))">
              </div>
              <div class="col-md-2 mb-2">
                <label class="form-label">Breite (m)</label>
                <input type="number" step="0.01" class="form-control form-control-sm"
                       :value="tuer.breite_m"
                       @input="updateTuer(index, 'breite_m', parseFloat($event.target.value))">
              </div>
              <div class="col-md-2 mb-2">
                <label class="form-label">Fläche (m²)</label>
                <input type="number" step="0.01" class="form-control form-control-sm"
                       :value="tuer.flaeche_m2"
                       disabled>
              </div>
              <div class="col-md-2 mb-2">
                <label class="form-label">U-Wert</label>
                <input type="number" step="0.01" class="form-control form-control-sm"
                       :value="tuer.uw_wert || tuer.u_wert"
                       @input="updateTuer(index, 'uw_wert', parseFloat($event.target.value))">
              </div>
              <div class="col-md-12 mb-2">
                <label class="form-label">Hinweis</label>
                <input type="text" class="form-control form-control-sm"
                       :value="tuer.hinweis"
                       @input="updateTuer(index, 'hinweis', $event.target.value)">
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-muted">Keine Türen vorhanden</div>
      </div>

      <!-- Angrenzende unbeheizte Bereiche -->
      <div class="form-section">
        <h5>Angrenzende unbeheizte Bereiche
          <button class="btn btn-sm btn-outline-primary ms-2" @click="addUnbeheizterBereich">
            <i class="bi bi-plus"></i> Hinzufügen
          </button>
        </h5>
        <div v-if="localRoom.angrenzende_unbeheizte_bereiche && localRoom.angrenzende_unbeheizte_bereiche.length > 0">
          <div v-for="(bereich, index) in localRoom.angrenzende_unbeheizte_bereiche" :key="index" class="nested-object">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h6>{{ bereich.typ || 'Bereich' }} {{ index + 1 }}</h6>
              <button class="btn btn-sm btn-outline-danger" @click="deleteUnbeheizterBereich(index)">
                <i class="bi bi-trash"></i>
              </button>
            </div>
            <div class="row">
              <div class="col-md-3 mb-2">
                <label class="form-label">Typ</label>
                <select class="form-control form-control-sm"
                        :value="bereich.typ"
                        @change="updateUnbeheizterBereich(index, 'typ', $event.target.value)">
                  <option value="">-- Auswählen --</option>
                  <option value="Außenwand">Außenwand</option>
                  <option value="Innenwand">Innenwand</option>
                  <option value="Boden">Boden</option>
                  <option value="Decke">Decke</option>
                </select>
              </div>
              <div class="col-md-3 mb-2">
                <label class="form-label">U-Wert (W/m²K)</label>
                <input type="number" step="0.01" class="form-control form-control-sm"
                       :value="bereich.u_wert"
                       @input="updateUnbeheizterBereich(index, 'u_wert', parseFloat($event.target.value))">
              </div>
              <div class="col-md-3 mb-2">
                <label class="form-label">Fläche (m²)</label>
                <input type="number" step="0.01" class="form-control form-control-sm"
                       :value="bereich.flaeche_m2"
                       @input="updateUnbeheizterBereich(index, 'flaeche_m2', parseFloat($event.target.value))"
                       :disabled="bereich.typ === 'Boden' || bereich.typ === 'Decke'">
                <small v-if="bereich.typ === 'Boden' || bereich.typ === 'Decke'" class="text-muted">
                  Auto: Raumgröße
                </small>
              </div>
              <div class="col-md-3 mb-2">
                <label class="form-label">Art/Bereich</label>
                <select class="form-control form-control-sm"
                        :value="bereich.art"
                        @change="updateUnbeheizterBereich(index, 'art', $event.target.value)">
                  <option value="">-- Auswählen --</option>
                  <option v-for="option in bereichOptionen" :key="option" :value="option">
                    {{ option }}
                  </option>
                </select>
              </div>
              <div class="col-md-12 mb-2">
                <label class="form-label">Hinweis</label>
                <input type="text" class="form-control form-control-sm"
                       :value="bereich.hinweis"
                       @input="updateUnbeheizterBereich(index, 'hinweis', $event.target.value)">
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-muted">Keine angrenzenden unbeheizten Bereiche vorhanden</div>
      </div>
    </div>
  `
};