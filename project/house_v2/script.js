// House Inspection Checklist Application - Belgium Edition

// Checklist data structure
const checklistData = [
    {
        category: 'documents',
        title: 'Documents & Certificates (Belgium)',
        icon: 'fa-file-contract',
        items: [
            { text: 'Request EPC (Energy Performance Certificate) - mandatory for sale', tags: ['documents', 'renovation'] },
            { text: 'Check asbestos certificate (verplicht asbest-attest)', tags: ['documents', 'asbestos', 'renovation'] },
            { text: 'Verify electrical installation certificate (keuring elektrische installatie) - max 25 years old', tags: ['documents', 'electrical'] },
            { text: 'Check soil certificate (bodematttest) if applicable', tags: ['documents'] },
            { text: 'Review conformity certificate for heating/boiler (stookkeuring)', tags: ['documents', 'hvac'] },
            { text: 'Verify building permit for renovations (bouwvergunning)', tags: ['documents', 'renovation'] },
            { text: 'Check urban planning certificate (stedenbouwkundig attest)', tags: ['documents'] },
            { text: 'Request connection certificate for sewage (aansluiting riolering)', tags: ['documents', 'plumbing'] },
            { text: 'Review property cadastral information', tags: ['documents'] },
            { text: 'Check for any registered servitudes or easements', tags: ['documents'] }
        ]
    },
    {
        category: 'asbestos',
        title: 'Asbestos Detection (Asbest)',
        icon: 'fa-exclamation-triangle',
        items: [
            { text: 'Check roof for asbestos (golfplaten/eterniet)', tags: ['asbestos', 'exterior', 'renovation'] },
            { text: 'Inspect ceiling panels for asbestos (especially pre-2001)', tags: ['asbestos', 'structural', 'renovation'] },
            { text: 'Check old floor tiles (vloertegels) for asbestos', tags: ['asbestos', 'renovation'] },
            { text: 'Inspect insulation materials around pipes', tags: ['asbestos', 'plumbing', 'renovation'] },
            { text: 'Check window frames/sills (vensterbanken) for asbestos cement', tags: ['asbestos', 'exterior', 'renovation'] },
            { text: 'Inspect old electrical panels/boxes for asbestos backing', tags: ['asbestos', 'electrical', 'renovation'] },
            { text: 'Check garage/shed roofing materials', tags: ['asbestos', 'exterior'] },
            { text: 'Verify removal plan if asbestos found - requires certified company', tags: ['asbestos', 'renovation'] },
            { text: 'Budget for asbestos removal (can be €20-100/m²)', tags: ['asbestos', 'renovation'] }
        ]
    },
    {
        category: 'exterior',
        title: 'Exterior Inspection',
        icon: 'fa-building',
        items: [
            { text: 'Check flat roof (plat dak) condition - very common in Belgium', tags: ['structural', 'exterior', 'renovation'] },
            { text: 'Inspect EPDM or bitumen roofing membrane condition', tags: ['exterior', 'renovation'] },
            { text: 'Check lichtkoepels (roof domes/skylights) - verify minimum 15cm height above insulation', tags: ['exterior', 'renovation'] },
            { text: 'Verify flat roof drainage (waterafvoer) - no standing water', tags: ['exterior', 'plumbing'] },
            { text: 'Check if doors to flat roof need height adjustment for external insulation', tags: ['exterior', 'renovation'] },
            { text: 'Inspect gevel (facade) for cracks or damage', tags: ['structural', 'exterior'] },
            { text: 'Check voegwerk (mortar joints) condition', tags: ['exterior', 'structural'] },
            { text: 'Inspect goten en regenpijpen (gutters and downspouts)', tags: ['exterior', 'plumbing'] },
            { text: 'Examine buitenmuren for moisture or saltpeter (salpeter)', tags: ['structural', 'exterior'] },
            { text: 'Check windows and doors (PVC, wood, aluminum) for sealing', tags: ['exterior', 'renovation'] },
            { text: 'Verify double or triple glazing (dubbel/driedubbel glas)', tags: ['exterior', 'renovation'] },
            { text: 'Inspect for cavity wall insulation (spouwmuurisolatie)', tags: ['exterior', 'renovation'] },
            { text: 'Check foundation for cracks or water damage', tags: ['structural', 'exterior', 'basement'] },
            { text: 'Inspect bricks (baksteen) for frost damage (vorstschade)', tags: ['exterior', 'structural'] },
            { text: 'Check for adequate drainage around foundation', tags: ['exterior', 'plumbing'] },
            { text: 'Verify terrace/balcony (terras) waterproofing', tags: ['exterior'] },
            { text: 'Inspect chimney (schoorsteen) condition', tags: ['exterior', 'structural'] }
        ]
    },
    {
        category: 'kitchen',
        title: 'Kitchen Inspection (Keuken)',
        icon: 'fa-utensils',
        items: [
            { text: 'Test all appliances (oven, kookplaat, vaatwasser, koelkast)', tags: ['kitchen', 'electrical'] },
            { text: 'Check if gas connection present (gasaansluiting) and certified', tags: ['kitchen', 'hvac'] },
            { text: 'Verify kitchen electrical circuit is separate 20A minimum', tags: ['kitchen', 'electrical'] },
            { text: 'Check keukenblad (countertop) material and condition', tags: ['kitchen'] },
            { text: 'Inspect under sink for leaks or water damage', tags: ['kitchen', 'plumbing'] },
            { text: 'Verify adequate ventilation (afzuigkap/dampkap)', tags: ['kitchen', 'hvac', 'renovation'] },
            { text: 'Check if ventilation exhausts outside (not recirculation)', tags: ['kitchen', 'hvac', 'renovation'] },
            { text: 'Test all electrical outlets - need splashproof near sink', tags: ['kitchen', 'electrical'] },
            { text: 'Check tegels (tiles) condition - floor and wall', tags: ['kitchen'] },
            { text: 'Inspect cabinet (keukenkasten) condition and hardware', tags: ['kitchen'] },
            { text: 'Verify adequate lighting above work surfaces', tags: ['kitchen', 'electrical'] },
            { text: 'Check floor for waterproofing under washing machine location', tags: ['kitchen', 'plumbing', 'renovation'] },
            { text: 'Inspect aanrecht (sink) and kraan (faucet) operation', tags: ['kitchen', 'plumbing'] }
        ]
    },
    {
        category: 'bathroom',
        title: 'Bathroom Inspection (Badkamer)',
        icon: 'fa-bath',
        items: [
            { text: 'Test toilet (WC) flush and check for leaks', tags: ['bathroom', 'plumbing'] },
            { text: 'Check douche (shower) water pressure and temperature', tags: ['bathroom', 'plumbing'] },
            { text: 'Inspect shower drainage - Belgian standard 50mm minimum', tags: ['bathroom', 'plumbing', 'renovation'] },
            { text: 'Verify waterproofing (waterdichte laag) under tiles', tags: ['bathroom', 'renovation'] },
            { text: 'Check for mechanical ventilation (type C/D) - required in new builds', tags: ['bathroom', 'hvac', 'renovation'] },
            { text: 'Inspect tegels (tiles) and voegen (grout) condition', tags: ['bathroom'] },
            { text: 'Test wastafel (sink) and kraan (faucet)', tags: ['bathroom', 'plumbing'] },
            { text: 'Verify electrical outlets are outside wet zones', tags: ['bathroom', 'electrical'] },
            { text: 'Check for adequate lighting (IP44 rating near shower)', tags: ['bathroom', 'electrical'] },
            { text: 'Inspect vloer (floor) for proper slope to drain', tags: ['bathroom', 'renovation'] },
            { text: 'Look for schimmel (mold) or moisture damage', tags: ['bathroom', 'plumbing'] },
            { text: 'Check heated towel rail (handdoekdroger) operation if present', tags: ['bathroom', 'hvac', 'electrical'] },
            { text: 'Verify afvoer (drain) pipes are accessible for maintenance', tags: ['bathroom', 'plumbing', 'renovation'] }
        ]
    },
    {
        category: 'bedroom',
        title: 'Bedroom Inspection (Slaapkamer)',
        icon: 'fa-bed',
        items: [
            { text: 'Check all stopcontacten (electrical outlets)', tags: ['bedroom', 'electrical'] },
            { text: 'Test lichtschakelaars (light switches) and fixtures', tags: ['bedroom', 'electrical'] },
            { text: 'Inspect kast (closet) space and doors', tags: ['bedroom'] },
            { text: 'Check ramen (windows) for operation and sealing', tags: ['bedroom', 'exterior'] },
            { text: 'Examine walls for scheuren (cracks) or damage', tags: ['bedroom', 'structural'] },
            { text: 'Inspect vloer (flooring) condition - parket, laminaat, tapijt', tags: ['bedroom'] },
            { text: 'Check plafond (ceiling) for stains or damage', tags: ['bedroom'] },
            { text: 'Test verwarming (heating) in room - radiator or floor heating', tags: ['bedroom', 'hvac'] },
            { text: 'Verify rookmelder (smoke detector) presence and operation - mandatory', tags: ['bedroom', 'electrical'] },
            { text: 'Check for adequate ventilation (ventilatieroosters)', tags: ['bedroom', 'hvac'] }
        ]
    },
    {
        category: 'livingroom',
        title: 'Living Room / Salon Inspection (Woonkamer)',
        icon: 'fa-couch',
        items: [
            { text: 'Check all stopcontacten (electrical outlets) - minimum 5 required', tags: ['livingroom', 'electrical'] },
            { text: 'Test lichtschakelaars (light switches) and fixtures', tags: ['livingroom', 'electrical'] },
            { text: 'Inspect open haard (fireplace) if present - check keuring certificate', tags: ['livingroom', 'structural', 'hvac'] },
            { text: 'Check ramen (windows) for operation and double glazing', tags: ['livingroom', 'exterior'] },
            { text: 'Examine muren (walls) for scheuren (cracks) or damage', tags: ['livingroom', 'structural'] },
            { text: 'Inspect vloer condition (parket, tegels, laminaat)', tags: ['livingroom'] },
            { text: 'Check plafond height - minimum 2.3m for habitable room', tags: ['livingroom', 'structural'] },
            { text: 'Test verwarming (heating) - radiators or floor heating', tags: ['livingroom', 'hvac'] },
            { text: 'Verify kabel/internet outlets and TV connection', tags: ['livingroom', 'electrical'] },
            { text: 'Check natural light - living room needs adequate daylight', tags: ['livingroom'] }
        ]
    },
    {
        category: 'basement',
        title: 'Basement/Cellar Inspection (Kelder)',
        icon: 'fa-dungeon',
        items: [
            { text: 'Check for vocht (moisture) or water infiltration', tags: ['basement', 'plumbing', 'structural', 'renovation'] },
            { text: 'Inspect for witte uitslag (saltpeter/efflorescence) on walls', tags: ['basement', 'structural'] },
            { text: 'Check kelderlucht (cellar smell) - indicates moisture issues', tags: ['basement'] },
            { text: 'Verify if basement is geschikt voor bewoning (suitable for living)', tags: ['basement', 'renovation'] },
            { text: 'Check ceiling height - minimum 2.3m for habitable room', tags: ['basement', 'renovation'] },
            { text: 'Inspect foundation walls for cracks or bowing', tags: ['basement', 'structural'] },
            { text: 'Check if walls need waterproofing (kelderafdichting)', tags: ['basement', 'renovation'] },
            { text: 'Verify drainage system (drainage/afvoer)', tags: ['basement', 'plumbing', 'renovation'] },
            { text: 'Look for schimmel (mold) or mildew', tags: ['basement'] },
            { text: 'Check insulation if basement is heated', tags: ['basement', 'hvac', 'renovation'] },
            { text: 'Inspect floor - check if concrete needs sealing', tags: ['basement', 'renovation'] },
            { text: 'Verify ventilation requirements for habitable space', tags: ['basement', 'hvac', 'renovation'] },
            { text: 'Check stookplaats (boiler room) accessibility and ventilation', tags: ['basement', 'hvac'] },
            { text: 'Verify electrical installation meets current standards', tags: ['basement', 'electrical'] }
        ]
    },
    {
        category: 'attic',
        title: 'Attic/Roof Space Inspection (Zolder)',
        icon: 'fa-house-damage',
        items: [
            { text: 'Check dakisolatie (roof insulation) - minimum R-value 6.0 (new builds)', tags: ['attic', 'hvac', 'renovation'] },
            { text: 'Verify insulation thickness - typically 20-30cm needed', tags: ['attic', 'renovation'] },
            { text: 'Check if zolder can be converted to living space (dakopbouw potential)', tags: ['attic', 'renovation'] },
            { text: 'Verify floor joists can support living space load', tags: ['attic', 'structural', 'renovation'] },
            { text: 'Inspect for roof leaks or waterinfiltratie', tags: ['attic', 'structural'] },
            { text: 'Check ventilation - need air circulation to prevent condensation', tags: ['attic', 'hvac', 'renovation'] },
            { text: 'Inspect dakstructuur (roof structure/rafters) for sagging', tags: ['attic', 'structural'] },
            { text: 'Look for signs of houtworm (woodworm) or rot', tags: ['attic', 'structural'] },
            { text: 'Check electrical wiring - often old and needs replacement', tags: ['attic', 'electrical', 'renovation'] },
            { text: 'Verify chimney condition from inside', tags: ['attic', 'structural'] },
            { text: 'Check if velux/dakramen (roof windows) can be added', tags: ['attic', 'renovation'] },
            { text: 'Verify headroom (stahoogte) - min 2.1m for 50% of floor for habitable space', tags: ['attic', 'renovation'] }
        ]
    },
    {
        category: 'plumbing',
        title: 'Water & Plumbing Systems (Sanitair)',
        icon: 'fa-tint',
        items: [
            { text: 'Check hoofdkraan (main water shut-off valve) location and operation', tags: ['plumbing'] },
            { text: 'Test waterdruk (water pressure) - should be 2-4 bar', tags: ['plumbing', 'kitchen', 'bathroom'] },
            { text: 'Inspect leidingen (pipes) - lead pipes must be replaced', tags: ['plumbing', 'renovation'] },
            { text: 'Check if copper or PVC piping used', tags: ['plumbing'] },
            { text: 'Verify boiler (water heater) age and capacity - 10-15 year lifespan', tags: ['plumbing', 'basement'] },
            { text: 'Check if condensatieketel (condensing boiler) installed', tags: ['plumbing', 'hvac', 'renovation'] },
            { text: 'Test warm water recovery time and temperature', tags: ['plumbing'] },
            { text: 'Inspect riolering (sewer/drainage) connection and certificate', tags: ['plumbing'] },
            { text: 'Check for gescheiden rioleringsstelsel (separate sewage system)', tags: ['plumbing', 'renovation'] },
            { text: 'Verify regenwater afvoer (rainwater drainage) separate from sewage', tags: ['plumbing', 'exterior'] },
            { text: 'Check for proper drainage slopes in all pipes', tags: ['plumbing', 'renovation'] },
            { text: 'Look for water stains (vochtplekken) on walls and ceilings', tags: ['plumbing', 'structural'] },
            { text: 'Test all kranen (faucets) for leaks and operation', tags: ['plumbing'] },
            { text: 'Check waterkwaliteit (water quality) - especially in older homes', tags: ['plumbing'] },
            { text: 'Verify if regenwatertank (rainwater tank) present and functional', tags: ['plumbing', 'exterior'] }
        ]
    },
    {
        category: 'electrical',
        title: 'Electrical Systems (Elektriciteit)',
        icon: 'fa-bolt',
        items: [
            { text: 'Verify elektrische keuring (electrical inspection) is valid - required every 25 years', tags: ['electrical', 'documents'] },
            { text: 'Inspect verdeelkast (electrical panel/fuse box)', tags: ['electrical', 'basement'] },
            { text: 'Check if zekeringkast meets current standards (min 40A, prefer 63A+)', tags: ['electrical', 'renovation'] },
            { text: 'Verify aardlekschakelaar (earth leakage circuit breaker/differentieelschakelaar) 300mA', tags: ['electrical'] },
            { text: 'Check for 30mA aardlek in wet rooms (bathroom, kitchen)', tags: ['electrical', 'bathroom', 'kitchen'] },
            { text: 'Test all stopcontacten (outlets) - need grounding (geaard)', tags: ['electrical'] },
            { text: 'Verify adequate aantal stopcontacten per room (min. 5 per living room)', tags: ['electrical', 'renovation'] },
            { text: 'Check if old two-prong outlets need replacing', tags: ['electrical', 'renovation'] },
            { text: 'Inspect visible bedrading (wiring) - no cloth-covered old wires', tags: ['electrical', 'renovation'] },
            { text: 'Test all lichtschakelaars (light switches)', tags: ['electrical'] },
            { text: 'Check deurbel (doorbell) operation', tags: ['electrical'] },
            { text: 'Verify rookmelders (smoke detectors) - mandatory in all bedrooms + hallway', tags: ['electrical'] },
            { text: 'Test CO-melder (carbon monoxide detector) if gas present', tags: ['electrical', 'hvac'] },
            { text: 'Check equipotentiaalverbinding (equipotential bonding) in bathroom', tags: ['electrical', 'bathroom'] },
            { text: 'Verify if three-phase connection (driefasenaansluiting) available if needed', tags: ['electrical'] }
        ]
    },
    {
        category: 'structural',
        title: 'Structural Elements (Structuur)',
        icon: 'fa-building',
        items: [
            { text: 'Check muren (walls) for scheuren (cracks) or bowing', tags: ['structural'] },
            { text: 'Inspect for scheurvorming around windows/doors - settlement indicator', tags: ['structural'] },
            { text: 'Verify if walls are dragende muren (load-bearing) - critical for renovations', tags: ['structural', 'renovation'] },
            { text: 'Check if removal of walls requires structural engineer (stabiliteitsingenieur)', tags: ['structural', 'renovation'] },
            { text: 'Inspect vloeren (floors) for levelness and squeaks', tags: ['structural'] },
            { text: 'Verify floor load capacity for planned use', tags: ['structural', 'renovation'] },
            { text: 'Check houten balken (wooden beams) for rot or woodworm', tags: ['structural'] },
            { text: 'Inspect plafonds (ceilings) for cracks or sagging', tags: ['structural'] },
            { text: 'Check if plafond hoogte (ceiling height) meets standards - min 2.3m living space', tags: ['structural', 'renovation'] },
            { text: 'Verify deurkozijnen (door frames) for squareness', tags: ['structural'] },
            { text: 'Inspect trap (stairs) and leuningen (railings) for stability', tags: ['structural'] },
            { text: 'Check staircase dimensions meet Belgian standards (rise max 21cm)', tags: ['structural', 'renovation'] },
            { text: 'Look for signs of verzakking (settlement) - cracks, uneven floors', tags: ['structural', 'basement'] },
            { text: 'Inspect fundering (foundation) type and condition', tags: ['structural', 'basement'] },
            { text: 'Check basement steunbalken (support beams) and palen (posts)', tags: ['structural', 'basement'] },
            { text: 'Verify if funderingsherstel (foundation repair) needed', tags: ['structural', 'renovation'] }
        ]
    },
    {
        category: 'hvac',
        title: 'HVAC & Heating Systems (Verwarming & Ventilatie)',
        icon: 'fa-fan',
        items: [
            { text: 'Check verwarmingsketel (heating boiler) age and condition - 15-20 year lifespan', tags: ['hvac', 'basement'] },
            { text: 'Verify if condensatieketel (condensing boiler) - more efficient', tags: ['hvac', 'renovation'] },
            { text: 'Check mazoutketel (oil boiler) vs gas - conversion costs', tags: ['hvac', 'renovation'] },
            { text: 'Inspect warmtepomp (heat pump) if present - modern alternative', tags: ['hvac', 'renovation'] },
            { text: 'Test verwarmingssysteem (heating system) operation', tags: ['hvac'] },
            { text: 'Check radiatoren (radiators) condition and sizing', tags: ['hvac'] },
            { text: 'Verify if vloerverwarming (underfloor heating) installed', tags: ['hvac', 'renovation'] },
            { text: 'Inspect stookkeuring (boiler inspection) certificate - required every 2-5 years', tags: ['hvac', 'documents'] },
            { text: 'Check ventilatie systeem (ventilation) - type C or D required in new builds', tags: ['hvac', 'renovation'] },
            { text: 'Verify mechanical ventilation (VMC/WTW) present and operational', tags: ['hvac', 'renovation'] },
            { text: 'Inspect ventilatieroosters (ventilation grills) in all rooms', tags: ['hvac'] },
            { text: 'Check airco (air conditioning) if present - not common in Belgium', tags: ['hvac'] },
            { text: 'Verify thermostaat (thermostat) operation and programmability', tags: ['hvac', 'electrical'] },
            { text: 'Check mazout/stookolie tank (oil tank) age and condition if present', tags: ['hvac', 'basement'] },
            { text: 'Verify gas connection certificate if gas heating', tags: ['hvac', 'documents'] },
            { text: 'Ask for onderhoud (service/maintenance) records', tags: ['hvac'] }
        ]
    },
    {
        category: 'renovation',
        title: 'Renovation Potential & Checks (Renovatie)',
        icon: 'fa-tools',
        items: [
            { text: 'Check if bouwvergunning (building permit) required for planned changes', tags: ['renovation', 'documents'] },
            { text: 'Verify plat dak isolatie (flat roof insulation) feasibility - external vs internal', tags: ['renovation', 'exterior'] },
            { text: 'Check if exterior insulation affects door heights - may need deurverhogen', tags: ['renovation', 'exterior'] },
            { text: 'Verify lichtkoepel verhogen needed (15cm minimum above insulation)', tags: ['renovation', 'exterior'] },
            { text: 'Check if dorpel (threshold) height changes affect accessibility', tags: ['renovation'] },
            { text: 'Assess gevelisolatie (facade insulation) potential - external, internal, or cavity', tags: ['renovation', 'exterior'] },
            { text: 'Check if cavity wall is suitable for spouwmuurisolatie', tags: ['renovation', 'exterior'] },
            { text: 'Verify if walls are thick enough for internal insulation without losing space', tags: ['renovation'] },
            { text: 'Check vloerisolatie (floor insulation) feasibility - may affect ceiling height', tags: ['renovation', 'basement'] },
            { text: 'Verify kruipruimte (crawl space) accessibility for insulation', tags: ['renovation', 'basement'] },
            { text: 'Check if ramen vervangen (window replacement) needed for better EPC', tags: ['renovation', 'exterior'] },
            { text: 'Assess potential for zolderverbouwing (attic conversion)', tags: ['renovation', 'attic'] },
            { text: 'Check if dakopbouw (roof extension) is permitted', tags: ['renovation', 'attic', 'documents'] },
            { text: 'Verify if kelderverbouwing (basement conversion) is feasible', tags: ['renovation', 'basement'] },
            { text: 'Check if aanbouw (extension) is possible within plot boundaries', tags: ['renovation', 'exterior', 'documents'] },
            { text: 'Assess badkamerrenovatie (bathroom renovation) complexity', tags: ['renovation', 'bathroom'] },
            { text: 'Check if keukenrenovatie (kitchen renovation) needs plumbing relocation', tags: ['renovation', 'kitchen'] },
            { text: 'Verify if loodgieterwerk (plumbing) replacement needed', tags: ['renovation', 'plumbing'] },
            { text: 'Check if volledige herkabeling (complete rewiring) required', tags: ['renovation', 'electrical'] },
            { text: 'Assess gevelsteen renovatie (brick facade renovation) needs', tags: ['renovation', 'exterior'] },
            { text: 'Check if voegwerk herstellen (repointing) is needed - budget €40-80/m²', tags: ['renovation', 'exterior'] },
            { text: 'Verify if schouwen/chimney can be removed or must be preserved', tags: ['renovation', 'structural'] },
            { text: 'Check potential for zonnepanelen (solar panels) installation', tags: ['renovation', 'exterior', 'electrical'] },
            { text: 'Verify south-facing roof suitability for solar panels', tags: ['renovation', 'exterior'] },
            { text: 'Assess budget for asbestsanering (asbestos removal) if needed', tags: ['renovation', 'asbestos'] }
        ]
    },
    {
        category: 'apartment',
        title: 'Apartment Specific (Appartement)',
        icon: 'fa-building',
        items: [
            { text: 'Request and review syndicus info (building manager information)', tags: ['apartment', 'documents'] },
            { text: 'Check recent algemene vergadering verslagen (general assembly minutes)', tags: ['apartment', 'documents'] },
            { text: 'Review gemeenschappelijke kosten (common charges) amount and inclusions', tags: ['apartment', 'documents'] },
            { text: 'Verify reservefonds (reserve fund) amount - should be healthy', tags: ['apartment', 'documents'] },
            { text: 'Check for planned grote werken (major works) in building', tags: ['apartment', 'renovation'] },
            { text: 'Verify lift (elevator) age and maintenance schedule', tags: ['apartment'] },
            { text: 'Check if lift keuring (elevator inspection) is up to date', tags: ['apartment', 'documents'] },
            { text: 'Inspect gemeenschappelijke delen (common areas) condition', tags: ['apartment'] },
            { text: 'Verify trap (stairwell) cleanliness and maintenance', tags: ['apartment'] },
            { text: 'Check fietsenstalling (bike storage) availability', tags: ['apartment'] },
            { text: 'Verify kelder (storage cellar) assignment and condition', tags: ['apartment'] },
            { text: 'Check parking/garage included or separate cost', tags: ['apartment'] },
            { text: 'Verify if terras/balkon (terrace/balcony) is privaat or gemeenschappelijk', tags: ['apartment', 'exterior'] },
            { text: 'Check soundproofing between apartments - test noise levels', tags: ['apartment'] },
            { text: 'Verify bouwjaar (building year) and any renovations', tags: ['apartment', 'documents'] },
            { text: 'Check if individual meters for water/heating or shared', tags: ['apartment', 'plumbing'] },
            { text: 'Verify internet/TV connection possibilities (coax, fiber)', tags: ['apartment', 'electrical'] }
        ]
    }
];

// Application State
let state = {
    checklist: {}, // OK checkboxes
    renovationNeeded: {}, // Renovation/Issue checkboxes
    documentRequests: {}, // Document request buttons
    notes: {},
    globalNotes: '',
    currentFilter: 'all'
};

// DOM Elements
const checklistContainer = document.getElementById('checklistContainer');
const filterButtons = document.querySelectorAll('.filter-btn');
const generateReportBtn = document.getElementById('generateReportBtn');
const resetBtn = document.getElementById('resetBtn');
const themeToggle = document.getElementById('themeToggle');
const reportModal = document.getElementById('reportModal');
const closeModal = document.getElementById('closeModal');
const reportContent = document.getElementById('reportContent');
const printReport = document.getElementById('printReport');
const copyReport = document.getElementById('copyReport');
const globalNotesTextarea = document.getElementById('globalNotes');
const progressFill = document.getElementById('progressFill');
const checkedCount = document.getElementById('checkedCount');
const totalCount = document.getElementById('totalCount');
const percentComplete = document.getElementById('percentComplete');

// Initialize Application
function init() {
    loadState();
    renderChecklist();
    setupEventListeners();
    updateProgress();
    loadTheme();
}

// Load state from localStorage
function loadState() {
    const savedState = localStorage.getItem('houseInspectionState');
    if (savedState) {
        const parsedState = JSON.parse(savedState);
        // Merge with default state to ensure all properties exist
        state = {
            checklist: parsedState.checklist || {},
            renovationNeeded: parsedState.renovationNeeded || {},
            documentRequests: parsedState.documentRequests || {},
            notes: parsedState.notes || {},
            globalNotes: parsedState.globalNotes || '',
            currentFilter: parsedState.currentFilter || 'all'
        };
    }
    
    // Load global notes
    if (state.globalNotes) {
        globalNotesTextarea.value = state.globalNotes;
    }
}

// Save state to localStorage
function saveState() {
    localStorage.setItem('houseInspectionState', JSON.stringify(state));
}

// Render checklist
function renderChecklist() {
    checklistContainer.innerHTML = '';
    
    checklistData.forEach((category, categoryIndex) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category-group';
        categoryDiv.dataset.category = category.category;
        
        // Check if category should be shown based on filter
        if (!shouldShowCategory(category, state.currentFilter)) {
            categoryDiv.classList.add('hidden');
        }
        
        // Category header
        const headerDiv = document.createElement('div');
        headerDiv.className = 'category-header';
        headerDiv.innerHTML = `
            <h3><i class="fas ${category.icon}"></i> ${category.title}</h3>
            <i class="fas fa-chevron-down toggle-icon"></i>
        `;
        
        // Category content
        const contentDiv = document.createElement('div');
        contentDiv.className = 'category-content';
        
        // Render items
        category.items.forEach((item, itemIndex) => {
            const itemKey = `${categoryIndex}-${itemIndex}`;
            const isOK = state.checklist[itemKey] || false;
            const needsRenovation = state.renovationNeeded[itemKey] || false;
            const docRequested = state.documentRequests[itemKey] || false;
            const itemNote = state.notes[itemKey] || '';
            const isDocument = category.category === 'documents';
            
            const itemDiv = document.createElement('div');
            itemDiv.className = 'checklist-item';
            
            // Determine renovation subcategory based on tags
            let renovationSubcategory = '';
            if (item.tags.includes('renovation')) {
                if (item.tags.some(t => ['attic', 'basement', 'exterior'].includes(t)) && 
                    (item.text.includes('isolatie') || item.text.includes('insulation'))) {
                    renovationSubcategory = 'renovation-insulation';
                } else if (item.text.includes('plat dak') || item.text.includes('lichtkoepel') || item.text.includes('roof')) {
                    renovationSubcategory = 'renovation-roofing';
                } else if (item.tags.includes('plumbing') || item.text.includes('plumbing') || item.text.includes('loodgieter')) {
                    renovationSubcategory = 'renovation-plumbing';
                } else if (item.tags.includes('electrical') || item.text.includes('electrical') || item.text.includes('bedrading') || item.text.includes('herkabeling')) {
                    renovationSubcategory = 'renovation-electrical';
                } else if (item.tags.includes('structural') || item.text.includes('structural') || item.text.includes('muren') || item.text.includes('fundering')) {
                    renovationSubcategory = 'renovation-structural';
                } else if (item.text.includes('verbouwing') || item.text.includes('conversion') || item.text.includes('dakopbouw') || item.text.includes('aanbouw')) {
                    renovationSubcategory = 'renovation-conversion';
                }
            }
            itemDiv.dataset.renovationCategory = renovationSubcategory;
            
            let checkboxHTML = '';
            if (isDocument) {
                checkboxHTML = `
                    <div class="checkbox-wrapper">
                        <input type="checkbox" 
                               id="item-${itemKey}" 
                               ${isOK ? 'checked' : ''}
                               data-key="${itemKey}">
                        <span class="checkbox-label ok-label">✓ Have</span>
                    </div>
                    <button class="request-doc-btn ${docRequested ? 'requested' : ''}" 
                            data-key="${itemKey}">
                        ${docRequested ? '✓ Requested' : 'Request'}
                    </button>
                `;
            } else {
                checkboxHTML = `
                    <div class="checkbox-wrapper">
                        <input type="checkbox" 
                               id="item-${itemKey}" 
                               ${isOK ? 'checked' : ''}
                               data-key="${itemKey}">
                        <span class="checkbox-label ok-label">✓ OK</span>
                    </div>
                    <div class="checkbox-wrapper renovation-check">
                        <input type="checkbox" 
                               id="reno-${itemKey}" 
                               ${needsRenovation ? 'checked' : ''}
                               data-key="${itemKey}"
                               class="renovation-checkbox">
                        <span class="checkbox-label issue-label">⚠ Issue</span>
                    </div>
                `;
            }
            
            itemDiv.innerHTML = `
                <div class="checkbox-container">
                    ${checkboxHTML}
                </div>
                <div class="item-content">
                    <div class="item-text ${isOK ? 'checked' : ''} ${needsRenovation ? 'needs-renovation' : ''}" id="text-${itemKey}">
                        ${item.text}
                    </div>
                    <div class="item-tags">
                        ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="item-notes">
                        <textarea 
                            placeholder="Add notes for this item..."
                            data-key="${itemKey}"
                            class="item-note-textarea"
                        >${itemNote}</textarea>
                    </div>
                </div>
            `;
            
            contentDiv.appendChild(itemDiv);
        });
        
        categoryDiv.appendChild(headerDiv);
        categoryDiv.appendChild(contentDiv);
        checklistContainer.appendChild(categoryDiv);
        
        // Add collapse/expand functionality
        headerDiv.addEventListener('click', () => {
            headerDiv.classList.toggle('collapsed');
            contentDiv.classList.toggle('collapsed');
        });
    });
    
    // Add checkbox event listeners
    document.querySelectorAll('input[type="checkbox"]:not(.renovation-checkbox)').forEach(checkbox => {
        checkbox.addEventListener('change', handleCheckboxChange);
    });
    
    // Add renovation checkbox event listeners
    document.querySelectorAll('.renovation-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', handleRenovationChange);
    });
    
    // Add document request button listeners
    document.querySelectorAll('.request-doc-btn').forEach(btn => {
        btn.addEventListener('click', handleDocumentRequest);
    });
    
    // Add note textarea event listeners
    document.querySelectorAll('.item-note-textarea').forEach(textarea => {
        textarea.addEventListener('input', handleNoteChange);
    });
}

// Check if category should be shown based on filter
function shouldShowCategory(category, filter) {
    if (filter === 'all') {
        return true;
    }
    
    // Handle renovation filters
    if (filter.startsWith('renovation-')) {
        // Check if any items in this category match the renovation subcategory
        return category.items.some(item => {
            return item.tags.includes('renovation');
        });
    }
    
    // Check if any item in the category has the filter tag or matches category
    return category.items.some(item => 
        item.tags.includes(filter) || category.category === filter
    );
}

// Handle checkbox change
function handleCheckboxChange(e) {
    const key = e.target.dataset.key;
    state.checklist[key] = e.target.checked;
    
    // Update text styling
    const textElement = document.getElementById(`text-${key}`);
    if (e.target.checked) {
        textElement.classList.add('checked');
    } else {
        textElement.classList.remove('checked');
    }
    
    saveState();
    updateProgress();
}

// Handle renovation/issue checkbox change
function handleRenovationChange(e) {
    const key = e.target.dataset.key;
    state.renovationNeeded[key] = e.target.checked;
    
    // Update text styling
    const textElement = document.getElementById(`text-${key}`);
    if (e.target.checked) {
        textElement.classList.add('needs-renovation');
    } else {
        textElement.classList.remove('needs-renovation');
    }
    
    saveState();
    updateProgress();
}

// Handle document request button
function handleDocumentRequest(e) {
    const key = e.target.dataset.key;
    state.documentRequests[key] = !state.documentRequests[key];
    
    if (state.documentRequests[key]) {
        e.target.classList.add('requested');
        e.target.textContent = '✓ Requested';
    } else {
        e.target.classList.remove('requested');
        e.target.textContent = 'Request';
    }
    
    saveState();
}

// Handle note change
function handleNoteChange(e) {
    const key = e.target.dataset.key;
    state.notes[key] = e.target.value;
    saveState();
}

// Setup event listeners
function setupEventListeners() {
    // Filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.dataset.category;
            state.currentFilter = category;
            filterChecklist(category);
        });
    });
    
    // Generate report
    generateReportBtn.addEventListener('click', generateReport);
    
    // Reset button
    resetBtn.addEventListener('click', resetChecklist);
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Modal controls
    closeModal.addEventListener('click', () => {
        reportModal.classList.remove('show');
    });
    
    reportModal.addEventListener('click', (e) => {
        if (e.target === reportModal) {
            reportModal.classList.remove('show');
        }
    });
    
    printReport.addEventListener('click', () => {
        window.print();
    });
    
    copyReport.addEventListener('click', copyReportToClipboard);
    
    // Global notes
    globalNotesTextarea.addEventListener('input', (e) => {
        state.globalNotes = e.target.value;
        saveState();
    });
}

// Filter checklist
function filterChecklist(category) {
    const categoryGroups = document.querySelectorAll('.category-group');
    
    categoryGroups.forEach(group => {
        const groupCategory = group.dataset.category;
        const categoryData = checklistData.find(c => c.category === groupCategory);
        
        if (category === 'all') {
            group.classList.remove('hidden');
            // Show all items in the category
            group.querySelectorAll('.checklist-item').forEach(item => {
                item.style.display = 'flex';
            });
        } else if (category.startsWith('renovation-')) {
            // Filter for renovation subcategories
            let hasVisibleItems = false;
            group.querySelectorAll('.checklist-item').forEach(item => {
                const itemRenovationCategory = item.dataset.renovationCategory;
                if (category === 'renovation-all') {
                    // Show all items that have renovation potential
                    if (itemRenovationCategory) {
                        item.style.display = 'flex';
                        hasVisibleItems = true;
                    } else {
                        item.style.display = 'none';
                    }
                } else if (itemRenovationCategory === category) {
                    item.style.display = 'flex';
                    hasVisibleItems = true;
                } else {
                    item.style.display = 'none';
                }
            });
            
            if (hasVisibleItems) {
                group.classList.remove('hidden');
            } else {
                group.classList.add('hidden');
            }
        } else {
            // Regular category filtering
            if (shouldShowCategory(categoryData, category)) {
                group.classList.remove('hidden');
                // Show all items when filtering by regular category
                group.querySelectorAll('.checklist-item').forEach(item => {
                    item.style.display = 'flex';
                });
            } else {
                group.classList.add('hidden');
            }
        }
    });
}

// Update progress
function updateProgress() {
    const totalItems = checklistData.reduce((sum, cat) => sum + cat.items.length, 0);
    const checkedItems = Object.values(state.checklist).filter(v => v).length + 
                         Object.values(state.renovationNeeded).filter(v => v).length;
    const percentage = totalItems > 0 ? Math.round((checkedItems / (totalItems * 2)) * 100) : 0;
    
    progressFill.style.width = `${percentage}%`;
    checkedCount.textContent = checkedItems;
    totalCount.textContent = totalItems;
    percentComplete.textContent = `${percentage}%`;
}

// Generate report
function generateReport() {
    let reportHTML = '<div class="report-container">';
    
    // Header info
    reportHTML += `
        <div class="report-section">
            <h3><i class="fas fa-info-circle"></i> Inspection Summary</h3>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
            <p><strong>Progress:</strong> ${checkedCount.textContent} of ${totalCount.textContent} items checked (${percentComplete.textContent})</p>
        </div>
    `;
    
    // Items OK
    const okItems = [];
    const issueItems = [];
    const uncheckedItems = [];
    const itemsWithNotes = [];
    const documentsRequested = [];
    
    checklistData.forEach((category, categoryIndex) => {
        category.items.forEach((item, itemIndex) => {
            const itemKey = `${categoryIndex}-${itemIndex}`;
            const isOK = state.checklist[itemKey] || false;
            const needsRenovation = state.renovationNeeded[itemKey] || false;
            const docRequested = state.documentRequests[itemKey] || false;
            const note = state.notes[itemKey] || '';
            
            const itemData = {
                category: category.title,
                text: item.text,
                note: note
            };
            
            if (isOK) {
                okItems.push(itemData);
            }
            
            if (needsRenovation) {
                issueItems.push(itemData);
            }
            
            if (!isOK && !needsRenovation) {
                uncheckedItems.push(itemData);
            }
            
            if (note) {
                itemsWithNotes.push(itemData);
            }
            
            if (docRequested) {
                documentsRequested.push(itemData);
            }
        });
    });
    
    // OK items section
    reportHTML += `
        <div class="report-section">
            <h3><i class="fas fa-check-circle"></i> Items Checked OK (${okItems.length})</h3>
            <ul>
                ${okItems.map(item => `
                    <li>
                        <strong>${item.category}:</strong> ${item.text}
                        ${item.note ? `<div class="report-note"><strong>Note:</strong> ${item.note}</div>` : ''}
                    </li>
                `).join('')}
            </ul>
        </div>
    `;
    
    // Issues/Renovation needed section
    if (issueItems.length > 0) {
        reportHTML += `
            <div class="report-section">
                <h3><i class="fas fa-exclamation-triangle"></i> Issues Found / Renovation Needed (${issueItems.length})</h3>
                <ul>
                    ${issueItems.map(item => `
                        <li style="color: #ff9800;">
                            <strong>${item.category}:</strong> ${item.text}
                            ${item.note ? `<div class="report-note"><strong>Note:</strong> ${item.note}</div>` : ''}
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }
    
    // Documents to request
    if (documentsRequested.length > 0) {
        reportHTML += `
            <div class="report-section">
                <h3><i class="fas fa-file-alt"></i> Documents to Request (${documentsRequested.length})</h3>
                <ul>
                    ${documentsRequested.map(item => `
                        <li>
                            <strong>${item.category}:</strong> ${item.text}
                            ${item.note ? `<div class="report-note"><strong>Note:</strong> ${item.note}</div>` : ''}
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }
    
    // Unchecked items section
    reportHTML += `
        <div class="report-section">
            <h3><i class="fas fa-times-circle"></i> Not Yet Checked (${uncheckedItems.length})</h3>
            <ul>
                ${uncheckedItems.map(item => `
                    <li>
                        <strong>${item.category}:</strong> ${item.text}
                        ${item.note ? `<div class="report-note"><strong>Note:</strong> ${item.note}</div>` : ''}
                    </li>
                `).join('')}
            </ul>
        </div>
    `;
    
    // Items with notes
    if (itemsWithNotes.length > 0) {
        reportHTML += `
            <div class="report-section">
                <h3><i class="fas fa-sticky-note"></i> Items with Notes (${itemsWithNotes.length})</h3>
                <ul>
                    ${itemsWithNotes.map(item => `
                        <li>
                            <strong>${item.category}:</strong> ${item.text}
                            <div class="report-note"><strong>Note:</strong> ${item.note}</div>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }
    
    // Global notes
    if (state.globalNotes) {
        reportHTML += `
            <div class="report-section">
                <h3><i class="fas fa-file-alt"></i> General Notes</h3>
                <div class="report-note">${state.globalNotes}</div>
            </div>
        `;
    }
    
    reportHTML += '</div>';
    
    reportContent.innerHTML = reportHTML;
    reportModal.classList.add('show');
}

// Copy report to clipboard
function copyReportToClipboard() {
    const reportText = reportContent.innerText;
    navigator.clipboard.writeText(reportText).then(() => {
        alert('Report copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy report:', err);
    });
}

// Reset checklist
function resetChecklist() {
    if (confirm('Are you sure you want to reset all checkboxes and notes? This cannot be undone.')) {
        state = {
            checklist: {},
            renovationNeeded: {},
            documentRequests: {},
            notes: {},
            globalNotes: '',
            currentFilter: 'all'
        };
        globalNotesTextarea.value = '';
        saveState();
        renderChecklist();
        updateProgress();
        
        // Reset filter
        filterButtons.forEach(b => b.classList.remove('active'));
        document.querySelector('[data-category="all"]').classList.add('active');
    }
}

// Theme functions
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update icon
    const icon = themeToggle.querySelector('i');
    if (newTheme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Update icon
    const icon = themeToggle.querySelector('i');
    if (savedTheme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', init);
