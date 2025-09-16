// Heat Load Calculations according to DIN EN 12831
// For use in German funding applications (BEG)

// Constants from DIN EN 12831
const DIN_CONSTANTS = {
  // Air properties at 20°C
  AIR_DENSITY: 1.2, // kg/m³
  AIR_SPECIFIC_HEAT: 0.34, // Wh/(m³·K)

  // Default air exchange rates (1/h) by room type
  AIR_EXCHANGE_RATES: {
    'Wohnzimmer': 0.5,
    'Schlafzimmer': 0.5,
    'Kinderzimmer': 0.5,
    'Büro': 0.5,
    'Küche': 1.5,
    'Bad': 1.5,
    'WC': 1.5,
    'Flur': 0.5,
    'Keller': 0.5,
    'Abstellraum': 0.3,
    'default': 0.5
  },

  // Temperature reduction factors (fT,i) for adjacent unheated spaces
  TEMP_REDUCTION_FACTORS: {
    'Erdreich': 0.6, // Ground
    'Keller unbeheizt': 0.5, // Unheated basement
    'Dachboden unbeheizt': 0.9, // Unheated attic
    'Garage': 0.8, // Garage
    'Treppenhaus unbeheizt': 0.5, // Unheated stairwell
    'default': 0.5
  }
};

/**
 * Calculate transmission heat loss coefficient HT according to DIN EN 12831
 * @param {Object} room - Room object with building envelope data
 * @param {Number} uwb - Thermal bridge supplement (Wärmebrückenzuschlag)
 * @returns {Object} Transmission heat loss data
 */
export function calculateTransmissionHeatLoss(room, uwb = 0.05) {
  let HT_direct = 0; // Direct to outside
  let HT_indirect = 0; // Through unheated spaces
  const details = [];

  if (!room.angrenzende_unbeheizte_bereiche || !Array.isArray(room.angrenzende_unbeheizte_bereiche)) {
    return { coefficient: 0, details, HT_direct, HT_indirect };
  }

  const bereiche = room.angrenzende_unbeheizte_bereiche;

  // Process each unheated area
  bereiche.forEach((bereich, idx) => {
    const area = bereich.flaeche_m2 || 0;
    const u_value = parseFloat(bereich.u_wert) || 0;
    const art = bereich.art || '';

    if (bereich.typ === 'Außenwand' || art === 'Außenluft' || art === 'Dach/Außenluft') {
      // Direct heat loss to outside
      let netArea = area;

      // For exterior walls, subtract windows and doors if not already accounted for
      if (bereich.typ === 'Außenwand' && area > 0) {
        let windowArea = 0;
        let doorArea = 0;

        if (room.fenster) {
          windowArea = room.fenster.reduce((sum, f) =>
            sum + (f.flaeche_m2 || (f.hoehe_m * f.breite_m) || 0), 0);
        }

        if (room.tueren) {
          room.tueren.forEach(t => {
            if (t.typ && t.typ.toLowerCase().includes('außen')) {
              doorArea += (t.flaeche_m2 || (t.hoehe_m * t.breite_m) || 0);
            }
          });
        }

        netArea = Math.max(0, area - windowArea - doorArea);
      }

      const HT = netArea * u_value * (1 + uwb);
      HT_direct += HT;

      details.push({
        element: `${bereich.typ}${art ? ' (' + art + ')' : ''}`,
        area: netArea,
        u_value: u_value,
        uwb_factor: 1 + uwb,
        HT: HT
      });
    } else {
      // Indirect heat loss through unheated spaces
      const fT = DIN_CONSTANTS.TEMP_REDUCTION_FACTORS[art] ||
                 DIN_CONSTANTS.TEMP_REDUCTION_FACTORS.default;
      const HT = area * u_value * fT;
      HT_indirect += HT;

      details.push({
        element: `${bereich.typ} (${art})`,
        area: area,
        u_value: u_value,
        temp_factor: fT,
        HT: HT
      });
    }
  });

  // Windows - direct heat loss
  if (room.fenster && room.fenster.length > 0) {
    room.fenster.forEach((fenster, idx) => {
      const area = fenster.flaeche_m2 || (fenster.hoehe_m * fenster.breite_m) || 0;
      const u_value = parseFloat(fenster.uw_wert) || 2.0;
      const HT_window = area * u_value * (1 + uwb);
      HT_direct += HT_window;

      details.push({
        element: `Fenster ${idx + 1}`,
        area: area,
        u_value: u_value,
        uwb_factor: 1 + uwb,
        HT: HT_window
      });
    });
  }

  // Exterior doors - direct heat loss
  if (room.tueren && room.tueren.length > 0) {
    room.tueren.forEach((tuer, idx) => {
      if (tuer.typ && tuer.typ.toLowerCase().includes('außen')) {
        const area = tuer.flaeche_m2 || (tuer.hoehe_m * tuer.breite_m) || 0;
        const u_value = parseFloat(tuer.uw_wert || tuer.u_wert) || 2.5;
        const HT_door = area * u_value * (1 + uwb);
        HT_direct += HT_door;

        details.push({
          element: `Außentür ${idx + 1}`,
          area: area,
          u_value: u_value,
          uwb_factor: 1 + uwb,
          HT: HT_door
        });
      }
    });
  }

  const totalHT = HT_direct + HT_indirect;

  return {
    coefficient: totalHT, // W/K
    HT_direct,
    HT_indirect,
    details
  };
}

/**
 * Calculate ventilation heat loss coefficient HV according to DIN EN 12831
 * @param {Object} room - Room object with ventilation data
 * @param {Number} n50 - Building airtightness (air changes at 50 Pa)
 * @returns {Object} Ventilation heat loss data
 */
export function calculateVentilationHeatLoss(room, n50 = 3) {
  const volume = room.raumvolumen_m3 ||
                 (room.raumgroesse_m2 * (room.raumhoehe_m || 2.5)) || 0;

  // Get base air exchange rate based on room usage
  const roomUsage = room.raumnutzung || 'default';
  let airExchangeRate = DIN_CONSTANTS.AIR_EXCHANGE_RATES[roomUsage] ||
                        DIN_CONSTANTS.AIR_EXCHANGE_RATES.default;

  // Check for mechanical ventilation
  let heatRecovery = 0;
  if (room.lueftung) {
    if (room.lueftung.typ && room.lueftung.typ.includes('KWL')) {
      // Controlled ventilation with possible heat recovery
      heatRecovery = (room.lueftung.waermerueckgewinnung_prozent || 0) / 100;

      // If specific air flow is given, calculate air exchange rate
      if (room.lueftung.luftvolumenstrom_m3h && volume > 0) {
        airExchangeRate = room.lueftung.luftvolumenstrom_m3h / volume;
      }
    }
  }

  // Calculate infiltration based on n50 value
  const infiltration = n50 * 0.05; // Simplified: n_inf ≈ n50 / 20

  // Total air exchange (max of required ventilation and infiltration)
  const totalAirExchange = Math.max(airExchangeRate, infiltration);

  // Ventilation heat loss coefficient HV = V̇ * ρ * cp
  // V̇ = n * V (air flow rate = air changes * volume)
  const airFlowRate = totalAirExchange * volume; // m³/h

  // Apply heat recovery if present
  const effectiveAirFlow = airFlowRate * (1 - heatRecovery);

  // HV in W/K (convert from Wh/(m³·K) to W/K)
  const HV = effectiveAirFlow * DIN_CONSTANTS.AIR_DENSITY * DIN_CONSTANTS.AIR_SPECIFIC_HEAT;

  return {
    coefficient: HV, // W/K
    volume,
    airExchangeRate: totalAirExchange,
    infiltration,
    heatRecovery: heatRecovery * 100,
    airFlowRate,
    effectiveAirFlow,
    details: {
      roomUsage,
      ventilationType: room.lueftung?.typ || 'Stoßlüftung',
      n50Value: n50
    }
  };
}

/**
 * Calculate total room heat load according to DIN EN 12831
 * @param {Object} room - Room object
 * @param {Object} buildingParams - Building parameters
 * @returns {Object} Complete heat load calculation
 */
export function calculateRoomHeatLoad(room, buildingParams = {}) {
  const normOutsideTemp = buildingParams.norm_aussentemperatur_c || -10;
  const n50 = buildingParams.gebaeudedichtheit_n50 || 3;
  const uwb = buildingParams.waermebrueckenzuschlag_uwb || 0.05;

  const insideTemp = room.norm_innentemperatur_c || 20;
  const deltaT = insideTemp - normOutsideTemp;

  // Calculate transmission losses
  const transmission = calculateTransmissionHeatLoss(room, uwb);
  const transmissionLoss = transmission.coefficient * deltaT;

  // Calculate ventilation losses
  const ventilation = calculateVentilationHeatLoss(room, n50);
  const ventilationLoss = ventilation.coefficient * deltaT;

  // Total heat load
  const totalHeatLoad = transmissionLoss + ventilationLoss;

  // Specific heat load (W/m²)
  const specificHeatLoad = room.raumgroesse_m2 > 0 ?
    totalHeatLoad / room.raumgroesse_m2 : 0;

  // Check existing heating capacity - use appropriate wattage based on heater type
  let existingCapacity = 0;
  if (room.heizkoerper && room.heizkoerper.length > 0) {
    existingCapacity = room.heizkoerper.reduce((sum, hk) => {
      const isFloorHeating = hk.Art && hk.Art.toLowerCase().includes('fussbodenheizung');
      const wattage = isFloorHeating
        ? (hk.waermeleistung_40_33_20_watt || 0)
        : (hk.waermeleistung_55_45_20_watt || hk.leistung_w || 0);
      return sum + wattage;
    }, 0);
  }

  const capacityCoverage = existingCapacity > 0 ?
    (existingCapacity / totalHeatLoad * 100) : 0;

  return {
    // Input parameters
    temperatures: {
      inside: insideTemp,
      outside: normOutsideTemp,
      deltaT
    },

    // Transmission losses
    transmission: {
      coefficient: transmission.coefficient,
      loss: transmissionLoss,
      details: transmission.details,
      HT_direct: transmission.HT_direct,
      HT_indirect: transmission.HT_indirect
    },

    // Ventilation losses
    ventilation: {
      coefficient: ventilation.coefficient,
      loss: ventilationLoss,
      ...ventilation
    },

    // Total heat load
    total: {
      heatLoad: totalHeatLoad, // W
      specificHeatLoad, // W/m²
      existingCapacity, // W
      capacityCoverage, // %
      capacityDeficit: Math.max(0, totalHeatLoad - existingCapacity) // W
    },

    // DIN EN 12831 reference
    standard: 'DIN EN 12831:2017-09',
    calculationMethod: 'Raumweise Heizlastberechnung'
  };
}

/**
 * Calculate building total heat load
 * @param {Array} rooms - Array of room objects
 * @param {Object} buildingParams - Building parameters
 * @returns {Object} Building-wide heat load summary
 */
export function calculateBuildingHeatLoad(rooms, buildingParams) {
  const roomCalculations = rooms.map(room => ({
    room: room.raumbezeichnung,
    floor: room.stockwerk,
    calculation: calculateRoomHeatLoad(room, buildingParams)
  }));

  const totalHeatLoad = roomCalculations.reduce((sum, r) =>
    sum + r.calculation.total.heatLoad, 0);

  const totalArea = rooms.reduce((sum, r) =>
    sum + (r.raumgroesse_m2 || 0), 0);

  const totalVolume = rooms.reduce((sum, r) =>
    sum + (r.raumvolumen_m3 || 0), 0);

  const totalExistingCapacity = roomCalculations.reduce((sum, r) =>
    sum + r.calculation.total.existingCapacity, 0);

  return {
    rooms: roomCalculations,
    summary: {
      totalHeatLoad, // W
      totalArea, // m²
      totalVolume, // m³
      averageSpecificHeatLoad: totalArea > 0 ? totalHeatLoad / totalArea : 0, // W/m²
      totalExistingCapacity, // W
      overallCapacityCoverage: totalExistingCapacity > 0 ?
        (totalExistingCapacity / totalHeatLoad * 100) : 0, // %
      heatPumpSizing: {
        recommended: Math.ceil(totalHeatLoad / 1000), // kW
        withSafetyMargin: Math.ceil(totalHeatLoad * 1.1 / 1000) // kW with 10% margin
      }
    },
    parameters: buildingParams,
    standard: 'DIN EN 12831:2017-09'
  };
}

/**
 * Get insulation quality classification based on U-value
 * @param {Number} uValue - U-value in W/(m²·K)
 * @returns {Object} Quality classification
 */
export function getInsulationQuality(uValue) {
  if (uValue <= 0.15) return { class: 'excellent', color: 'success', label: 'Passivhaus' };
  if (uValue <= 0.24) return { class: 'very-good', color: 'success', label: 'KfW 40' };
  if (uValue <= 0.28) return { class: 'good', color: 'info', label: 'KfW 55' };
  if (uValue <= 0.35) return { class: 'moderate', color: 'warning', label: 'EnEV 2014' };
  if (uValue <= 0.5) return { class: 'poor', color: 'warning', label: 'Altbau saniert' };
  return { class: 'very-poor', color: 'danger', label: 'Unsaniert' };
}