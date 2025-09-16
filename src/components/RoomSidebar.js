// Room Sidebar Component
export const RoomSidebar = {
  props: ['buildingData', 'currentEditRoomIndex'],
  emits: ['selectRoom', 'addRoom', 'deleteRoom'],
  computed: {
    roomsByFloor() {
      if (!this.buildingData?.raeume) return {};
      const floors = {
        'Kellergeschoss': [],
        'Erdgeschoss': [],
        'Obergeschoss': [],
        'Dachgeschoss': []
      };
      this.buildingData.raeume.forEach((room, index) => {
        if (floors[room.stockwerk]) {
          floors[room.stockwerk].push({ ...room, index });
        }
      });
      return floors;
    },
    floorCounts() {
      const counts = {};
      Object.keys(this.roomsByFloor).forEach(floor => {
        counts[floor] = this.roomsByFloor[floor].length;
      });
      return counts;
    }
  },
  methods: {
    getFloorId(floor) {
      const mapping = {
        'Kellergeschoss': 'kg',
        'Erdgeschoss': 'eg',
        'Obergeschoss': 'og',
        'Dachgeschoss': 'dg'
      };
      return mapping[floor] || floor.toLowerCase();
    },
    getFloorAbbr(floor) {
      const mapping = {
        'Kellergeschoss': 'KG',
        'Erdgeschoss': 'EG',
        'Obergeschoss': 'OG',
        'Dachgeschoss': 'DG'
      };
      return mapping[floor] || floor;
    }
  },
  template: `
    <div class="sidebar">
      <h4>Stockwerke & Räume</h4>

      <div v-if="!buildingData || !buildingData.raeume || buildingData.raeume.length === 0"
           class="no-data-message">
        <i class="bi bi-door-open" style="font-size: 48px; color: #6c757d;"></i>
        <p class="mt-3">Keine Räume vorhanden</p>
        <p class="small">Laden Sie eine JSON-Datei oder fügen Sie neue Räume hinzu</p>
      </div>

      <div v-else>
        <ul class="nav nav-tabs" role="tablist">
          <li v-for="floor in Object.keys(roomsByFloor)" :key="floor" class="nav-item" role="presentation">
            <button class="nav-link" :class="{ active: floor === 'Kellergeschoss' }"
                    :id="getFloorId(floor) + '-tab'"
                    data-bs-toggle="tab"
                    :data-bs-target="'#' + getFloorId(floor) + '-panel'"
                    type="button" role="tab">
              {{ getFloorAbbr(floor) }}
              <span class="badge bg-secondary ms-1">{{ floorCounts[floor] }}</span>
            </button>
          </li>
        </ul>

        <div class="tab-content mt-3">
          <div v-for="floor in Object.keys(roomsByFloor)" :key="floor"
               class="tab-pane fade" :class="{ 'show active': floor === 'Kellergeschoss' }"
               :id="getFloorId(floor) + '-panel'"
               role="tabpanel">

            <button class="btn btn-sm btn-outline-primary mb-2 w-100"
                    @click="$emit('addRoom', floor)">
              <i class="bi bi-plus"></i> Raum hinzufügen
            </button>

            <div v-for="room in roomsByFloor[floor]" :key="room.index"
                 class="room-item"
                 :class="{ active: room.index === currentEditRoomIndex }"
                 @click="$emit('selectRoom', room.index)">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{{ room.raumbezeichnung }}</strong><br>
                  <small class="text-muted">
                    {{ room.raumnutzung || 'Keine Nutzung' }} • {{ room.raumgroesse_m2 || 0 }} m²
                  </small>
                </div>
                <i class="bi bi-trash text-danger delete-icon"
                   @click.stop="$emit('deleteRoom', room.index)"
                   title="Raum löschen"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
};