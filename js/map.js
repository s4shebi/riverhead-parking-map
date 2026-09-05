// Initialize the map and set its view
var map = L.map('map', {
    minZoom: 1,
    maxZoom: 19,
}).setView([40.9185, -72.6620], 15);

// Define the different basemaps
const topoBasemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var satelliteBasemap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>', maxZoom: 19
});

// Add Satellite basemap by default
satelliteBasemap.addTo(map);

// Layer control for switching between basemaps
var baseMaps = {
    "Satellite": satelliteBasemap,
    "Topographic": topoBasemap
};

// Define custom icons
const parkingIcon = L.icon({
    iconUrl: 'icons/parking.svg',
    iconSize: [35, 32],
    iconAnchor: [12, 30],
    popupAnchor: [0, -30]
});

const boatParkingIcon = L.icon({
    iconUrl: 'icons/boat-parking.svg',
    iconSize: [35, 32],
    iconAnchor: [12, 30],
    popupAnchor: [0, -30]
});

const transportationIcon = L.icon({
    iconUrl: 'icons/transportation.svg',
    iconSize: [35, 32],
    iconAnchor: [12, 30],
    popupAnchor: [0, -30]
});

const EVIcon = L.icon({
    iconUrl: 'icons/EV.png',
    iconSize: [25, 32],
    iconAnchor: [12, 30],
    popupAnchor: [0, -30]
});

const sharedIcon = L.icon({
    iconUrl: 'icons/shared-parking.svg',
    iconSize: [35, 32],
    iconAnchor: [12, 30],
    popupAnchor: [0, -30]
});

const mainStreetIcon = L.icon({
    iconUrl: 'icons/main-street-parking.svg',
    iconSize: [35, 32],
    iconAnchor: [12, 30],
    popupAnchor: [0, -30]
});

const underConstructionParkingIcon = L.icon({
    iconUrl: 'icons/under-construction-parking.svg',
    iconSize: [35, 32],
    iconAnchor: [12, 30],
    popupAnchor: [0, -30]
});

// Define marker groups
var markers = {
    parking: L.layerGroup(),
    shared: L.layerGroup(),
    'main-street': L.layerGroup(),
    'under-construction': L.layerGroup(),
    boat: L.layerGroup(),
    ev: L.layerGroup(),
    transportation: L.layerGroup()
};

// Define icon mapping
const iconMapping = {
    'parking': parkingIcon,
    'shared': sharedIcon,
    'main-street': mainStreetIcon,
    'under-construction': underConstructionParkingIcon,
    'boat': boatParkingIcon,
    'ev': EVIcon,
    'transportation': transportationIcon
};

// Define category mapping for popup styling
const categoryMapping = {
    'parking': 'Parking',
    'shared': 'Shared Parking',
    'main-street': 'Main Street Parking',
    'under-construction': 'Under Construction - Limited Parking',
    'boat': 'Boat Parking',
    'ev': 'EV Station',
    'transportation': 'LIRR'
};

function safeField(value) {
    return value !== null && value !== undefined && value !== "" && value !== "null";
}

// Function to generate styled popups
function generatePopupContent(title, description, spaces, accessibleSpaces, managedBy, season, days, hours, policy, cost, contact, link, linkText, lat, lng, category, streetView) {
    const categoryStyles = {
        'Parking': { iconColor: '#196ced' },
        'Shared Parking': { iconColor: '#f3c200' },
        'Main Street Parking': { iconColor: '#bd0000' },
        'Under Construction - Limited Parking': { iconColor: '#e66100' },
        'Boat Parking': { iconColor: '#F1C232' },
        'EV Station': { iconColor: '#6AA84F' },
        'LIRR': { iconColor: '#8e44ad' }
    };

    const styles = categoryStyles[category] || { iconColor: '#000000' };

    return `
    <div class="card" style="width: 20rem; border: none;">
        <div class="card-body" style="background-color: #f0f4f8; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h5 class="card-title" style="font-size: 1.2rem; font-weight: bold; color: ${styles.iconColor}; text-transform: uppercase;">${title}</h5>
            <p class="card-text" style="font-size: 1rem; color: #212529;">
                ${safeField(cost) ? `
    <i class="fas fa-money-bill-wave" style="color: ${styles.iconColor};"></i> 
    Cost: <strong style="color: ${styles.iconColor};">${cost}</strong><br>` : ''}
            ${safeField(spaces) ? `
                <i class="fas fa-parking" style="color: ${styles.iconColor};"></i> 
                Total Spaces: <strong style="color: ${styles.iconColor};">${spaces}</strong><br>` : ''}
            
            ${safeField(accessibleSpaces) ? `
                <i class="fas fa-wheelchair" style="color: ${styles.iconColor};"></i> 
                Accessible Spaces: <strong style="color: ${styles.iconColor};">${accessibleSpaces}</strong><br>` : ''}
            
            ${safeField(managedBy) ? `
                <i class="fas fa-building" style="color: ${styles.iconColor};"></i> 
                Managed By: <strong style="color: ${styles.iconColor};">${managedBy}</strong><br>` : ''}
            
            ${safeField(season) ? `
                <i class="fas fa-calendar" style="color: ${styles.iconColor};"></i> 
                Season: <strong style="color: ${styles.iconColor};">${season}</strong><br>` : ''}
            
            ${safeField(days) ? `
                <i class="fas fa-calendar-day" style="color: ${styles.iconColor};"></i> 
                Days: <strong style="color: ${styles.iconColor};">${days}</strong><br>` : ''}
            
            ${safeField(hours) ? `
                <i class="fas fa-clock" style="color: ${styles.iconColor};"></i> 
                Hours: <strong style="color: ${styles.iconColor};">${hours}</strong><br>` : ''}
            
            ${safeField(policy) ? `
                <i class="fas fa-info-circle" style="color: ${styles.iconColor};"></i> 
                Policy: <strong style="color: ${styles.iconColor};">${policy}</strong><br>` : ''}
            
            ${safeField(contact) ? `
                <i class="fas fa-phone-alt" style="color: ${styles.iconColor};"></i> 
                Text for help: <a href="sms:${contact}" style="color: ${styles.iconColor};">${contact}</a><br>` : ''}
            
            ${safeField(link) ? `
                <a href="${link}" target="_blank" style="color: ${styles.iconColor}; text-decoration: underline;">
                    ${linkText || 'Website'}
                </a><br>` : ''}
            
            ${safeField(streetView) ? `
                <a href="${streetView}" target="_blank" style="color: ${styles.iconColor}; text-decoration: underline;">
                    Street View
                </a>` : ''}

            </p>
            <div class="text-center">
                <button type="button" class="btn btn-warning btn-sm zoom-to-marker" data-lat="${lat}" data-lng="${lng}" style="background-color: ${styles.iconColor}; border: none; padding: 8px 10px; font-size: 12px; border-radius: 8px; min-height: 34px;">Zoom To Here</button>
            </div>
        </div>
    </div>`;
}

// Function to load data from Google Sheets
function loadPointsDataFromGoogleSheets() {
    // Replace with your Google Sheets published CSV URL
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRASpU-odS7cJNT2_CsQAWbM9dMKbEKC9dAgGrJ6Ea3aQ3yEsX-EUx8xYZaQ4QvtYfV5RgJSmf8hguP/pub?gid=0&single=true&output=csv';

    // For now, using a placeholder - you'll need to replace with actual Google Sheets integration
    // This is a simplified approach - you might want to use the Google Sheets API for better reliability

    fetch(sheetUrl)
        .then(response => response.text())
        .then(csvText => {
            const data = parseCSV(csvText);
            processMapData(data);
        })
        .catch(error => {
            console.error('Error loading data from Google Sheets:', error);
            // Fallback to hardcoded data or show error message
            alert('Error loading parking data. Please try again later.');
        });
}

// Function to parse CSV data
function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));

    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const values = [];
        let inQuotes = false;
        let currentValue = '';

        for (let char of line) {
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(currentValue.trim().replace(/"/g, ''));
                currentValue = '';
            } else {
                currentValue += char;
            }
        }
        values.push(currentValue.trim().replace(/"/g, ''));

        const row = {};
        headers.forEach((header, index) => {
            row[header] = values[index] || '';
        });

        data.push(row);
    }

    return data;
}

// Function to process map data and create markers
function processMapData(data) {
    const bounds = L.latLngBounds();

    data.forEach(row => {
        const lat = parseFloat(row.latitude);
        const lng = parseFloat(row.longitude);
        const category = row.category;

        if (!isNaN(lat) && !isNaN(lng)) {
            const icon = iconMapping[category];

            if (icon) {
                const marker = L.marker([lat, lng], { icon: icon });

                marker.bindPopup(generatePopupContent(
                    row.title,
                    row.description,
                    row.spaces,
                    row.accessibleSpaces,
                    row.managedBy,
                    row.season,
                    row.days,
                    row.hours,
                    row.policy,
                    row.cost,
                    row.contact,
                    row.link,
                    row.linkText,
                    lat,
                    lng,
                    categoryMapping[category],
                    row.streetView
                ));

                // Add to appropriate layer group
                const markerGroup = markers[category];
                if (markerGroup) {
                    markerGroup.addLayer(marker);
                }

                bounds.extend([lat, lng]);
            }
        }
    });

    // Add all marker groups to the map initially
    for (var key in markers) {
        if (markers[key].getLayers().length > 0) {
            markers[key].addTo(map);
        }
    }

    // Fit bounds to include all markers with padding
    if (bounds.isValid()) {
        map.fitBounds(bounds.pad(0.1));
    }
}

// Add event listener to all marker popups
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('zoom-to-marker')) {
        const lat = parseFloat(event.target.getAttribute('data-lat'));
        const lng = parseFloat(event.target.getAttribute('data-lng'));
        map.setView([lat, lng], 20);
    }
});

// Load the points data from Google Sheets
loadPointsDataFromGoogleSheets();

// Create the legend control
var legend = L.control({ position: 'topright' });

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'legend rounded p-2 border border-secondary');
    div.style.backgroundColor = "#fff";
    div.style.width = "250px";
    div.style.maxWidth = "calc(100vw - 20px)";
    div.style.maxHeight = "calc(100vh - 80px)";
    div.style.overflowY = "auto";
    div.style.fontSize = "0.9em";
    div.style.padding = "10px";
    div.style.borderRadius = "10px";
    div.style.marginTop = "50px";
    div.className += ' map-legend';
    L.DomEvent.disableClickPropagation(div);
    L.DomEvent.disableScrollPropagation(div);

    div.innerHTML += '<style>' +
        '.custom-checkbox {' +
        'position: relative;' +
        'display: inline-block;' +
        'width: 15px;' +
        'height: 15px;' +
        'margin-right: 7px;' +
        'background-color: #fff;' +
        'border: 1px solid #ccc;' +
        'border-radius: 3px;' +
        'cursor: pointer;' +
        '}' +
        '.custom-checkbox.checked {' +
        'border: 1px solid #000;' +
        'background-color: #eee;' +
        '}' +
        '.custom-checkbox.checked::after {' +
        'content: "";' +
        'position: absolute;' +
        'top: 2px;' +
        'left: 2px;' +
        'width: 8px;' +
        'height: 8px;' +
        'background-color: currentColor;' +
        'border-radius: 2px;' +
        '}' +
        '.category-spacing {' +
        'margin-top: 20px;' +
        'margin-bottom: 3px;' +
        'border-top: 1px solid #ddd;' +
        'padding-top: 10px;' +
        '}' +
        '</style>';

    div.innerHTML += `
        <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 10px; border-bottom: 1px solid #ddd;">
            <img src="icons/logo.png" alt="Logo" style="width: 40px; height: 40px; margin-left: 5px;"/>
            <div style="text-align: center; flex-grow: 1;">
                <h7 style="margin: 0; color: black; font-size: 1.1em; text-align: center;"><strong>PARKING NAVIGATOR</strong></h7>
                <h4 style="margin: 0; color: black; font-size: 1.1em; text-align: center;"><strong>Downtown Riverhead</strong></h4>
            </div>
            <button type="button" id="close-legend" aria-label="Hide legend" title="Hide legend" style="background: transparent; border: none; color: #333; cursor: pointer; font-size: 1.3em; line-height: 1; padding: 4px 0 4px 8px;">&times;</button>
        </div>
    `;

    div.innerHTML += `
    <div style="text-transform: uppercase; color: black; display: flex; justify-content: space-between; align-items: center; margin-top: 10px">
            <strong>Show/Hide</strong>
            <i class="fa-solid fa-eye" id="toggle-all-layers" style="cursor: pointer; font-size: 1em; color: green;"></i>
    </div>`;

    div.innerHTML += '<hr style="margin: 5px 0;">';

    // Add Parking section
    div.innerHTML += '<div style="margin-top: 10px; margin-bottom: 5px; text-transform: uppercase; color: black;"><strong>Parking</strong></div>';
    div.innerHTML += `
    <div style="display: flex; align-items: center; margin-bottom: 5px;">
        <span class="custom-checkbox checked" id="toggle-parking" style="color: #196ced; margin-right: 5px;"></span>
        <label style="margin: 0; color: black;">Free Lot Parking</label>
    </div>
    `;
    div.innerHTML += `
    <div style="display: flex; align-items: center; margin-bottom: 5px;">
        <span class="custom-checkbox checked" id="toggle-shared" style="color: #f3c200; margin-right: 5px;"></span>
        <label style="margin: 0; color: black;">Shared Parking</label>
    </div>
    `;
    div.innerHTML += `
    <div style="display: flex; align-items: center; margin-bottom: 5px;">
        <span class="custom-checkbox checked" id="toggle-main-street" style="color: #bd0000; margin-right: 5px;"></span>
        <label style="margin: 0; color: black;">Main Street Parking</label>
    </div>
    `;
    div.innerHTML += `
    <div style="display: flex; align-items: center; margin-bottom: 5px;">
        <span class="custom-checkbox checked" id="toggle-under-construction" style="color: #e66100; margin-right: 5px;"></span>
        <label style="margin: 0; color: black;">Under Construction - Limited Parking</label>
    </div>
    `;

    // Add Transportation/Mobility section
    div.innerHTML += '<div class="category-spacing" style="text-transform: uppercase; color: black; margin-top: 10px;"><strong>Transportation/Mobility</strong></div>';
    div.innerHTML += `
    <div style="display: flex; align-items: center; margin-bottom: 5px;">
        <span class="custom-checkbox checked" id="toggle-lirr" style="color: #8e44ad; margin-right: 5px;"></span>
        <label style="margin: 0; color: black;">LIRR</label>
    </div>
    `;

    // Add EV/Gas section
    div.innerHTML += '<div class="category-spacing" style="text-transform: uppercase; color: black; margin-top: 10px;"><strong>EV/Gas</strong></div>';
    div.innerHTML += `
    <div style="display: flex; align-items: center; margin-bottom: 5px;">
        <span class="custom-checkbox checked" id="toggle-ev" style="color: #6AA84F; margin-right: 5px;"></span>
        <label style="margin: 0; color: black;">EV Station</label>
    </div>
    `;

    div.innerHTML += '<div class="category-spacing" style="text-transform: uppercase;color: black"><strong>Map modes</strong><br></div>';
    div.innerHTML += `
    <div style="display: flex; align-items: center; gap: 2px; font-size: 10px;">
        <input type="radio" class="btn-check" name="basemap" id="satellite-basemap" autocomplete="off" onclick="switchBasemap('Satellite')" checked>
        <label class="btn btn-outline-success btn-sm" for="satellite-basemap" style="padding: 2px 5px; font-size: 10px;">Satellite</label>
        
        <input type="radio" class="btn-check" name="basemap" id="topographic-basemap" autocomplete="off" onclick="switchBasemap('Topographic')">
        <label class="btn btn-outline-success btn-sm" for="topographic-basemap" style="padding: 2px 5px; font-size: 10px;">Topographic</label>
    </div><br>`;

    div.innerHTML += '<hr style="margin: 5px 0;">';

    var poweredBy = document.createElement('div');
    poweredBy.style.marginTop = '5px';
    poweredBy.innerHTML = `
    <p style="margin: 0;font-weight: bold;font-size: 0.8em;">Powered by:</p>
    <img src="icons/pmc.png" alt="Powered by" style="max-width: 100%; height: auto; margin-top: 3px"/>`;
    div.appendChild(poweredBy);

    // Toggle visibility function
    const toggleVisibility = (id, layer) => {
        const checkbox = div.querySelector(`#${id}`);
        checkbox.addEventListener('click', function() {
            if (this.classList.toggle('checked')) {
                markers[layer].addTo(map);
            } else {
                map.removeLayer(markers[layer]);
            }
        });
    };

    div.querySelector('#close-legend').addEventListener('click', removeLegendFromMap);

    toggleVisibility('toggle-parking', 'parking');
    toggleVisibility('toggle-shared', 'shared');
    toggleVisibility('toggle-main-street', 'main-street');
    toggleVisibility('toggle-under-construction', 'under-construction');
    toggleVisibility('toggle-lirr', 'transportation');
    toggleVisibility('toggle-ev', 'ev');

    // Toggle all layers
    var allLayersVisible = true;
    div.querySelector('#toggle-all-layers').addEventListener('click', function() {
        allLayersVisible = !allLayersVisible;

        const idToLayer = {
            'toggle-parking': 'parking',
            'toggle-shared': 'shared',
            'toggle-main-street': 'main-street',
            'toggle-under-construction': 'under-construction',
            'toggle-ev': 'ev',
            'toggle-lirr': 'transportation'
        };

        ['toggle-parking', 'toggle-shared', 'toggle-main-street', 'toggle-under-construction', 'toggle-ev', 'toggle-lirr'].forEach(function(id) {
            const checkbox = div.querySelector(`#${id}`);
            const layer = idToLayer[id];

            if (!checkbox || !layer) return;

            if (allLayersVisible) {
                checkbox.classList.add('checked');
                if (!map.hasLayer(markers[layer])) {
                    markers[layer].addTo(map);
                }
            } else {
                checkbox.classList.remove('checked');
                if (map.hasLayer(markers[layer])) {
                    map.removeLayer(markers[layer]);
                }
            }
        });

        const icon = this;
        if (allLayersVisible) {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
            icon.style.color = 'green';
        } else {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
            icon.style.color = 'red';
        }
    });

    return div;
};

// Add the legend to the map
legend.addTo(map);

// Function to switch basemaps
function switchBasemap(basemap) {
    if (basemap === 'Satellite') {
        map.removeLayer(topoBasemap);
        satelliteBasemap.addTo(map);
    } else if (basemap === 'Topographic') {
        map.removeLayer(satelliteBasemap);
        topoBasemap.addTo(map);
    }
}

// Legend visibility control
var legendVisible = true;

// Set initial icon for the button
document.getElementById('toggleLegendBtn').innerHTML = '<i class="fa-solid fa-toggle-on" style="color: green; "></i> <strong>Legend</strong>';

var toggleLegendBtn = document.getElementById('toggleLegendBtn');

function addLegendToMap() {
    legend.addTo(map);
    legendVisible = true;
    toggleLegendBtn.innerHTML = '<i class="fa-solid fa-toggle-on" style="color: green;"></i> <strong>Legend</strong>';
}

function removeLegendFromMap() {
    map.removeControl(legend);
    legendVisible = false;
    toggleLegendBtn.innerHTML = '<i class="fa-solid fa-toggle-off" style="color: black;"></i> Legend';
}

toggleLegendBtn.addEventListener('click', function () {
    if (legendVisible) {
        removeLegendFromMap();
    } else {
        addLegendToMap();
    }
});
