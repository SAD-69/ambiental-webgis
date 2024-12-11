const map = L.map('map').setView([-22.0, -45.0], 6);

// Basemap
const basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Layer Control
const layerControl = L.control.layers(null, null, { collapsed: false }).addTo(map);
let activeLayerName = null; // Track the currently active layer
const layerMap = {}; // Map to associate layer names with their WMS layers and attributes

// Fetch layers from the backend
fetch('/get_layers')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Object.entries(data.layers).forEach(([layerName, layerInfo]) => {
                const { alias, attributes } = layerInfo;

                // Create WMS Layer
                const wmsLayer = L.tileLayer.wms("http://localhost:5000/geoserver/ows", {
                    layers: layerName,
                    workspace: 'basemaps',
                    format: 'image/png',
                    transparent: true,
                    version: '1.3.0',
                    srs: 'EPSG:4674',
                    attribution: '© GeoServer',
                    bounds: [[-33.9462928771973, -74.2161712646484], [5.466956615448, -28.6219253540039]]
                });

                // Add layer to the control
                layerControl.addOverlay(wmsLayer, alias);

                // Store layer and attributes in the map
                layerMap[layerName] = { wmsLayer, attributes, alias };

                // Listen for layeradd and layerremove events
                map.on('overlayadd', function (event) {
                    if (event.layer === wmsLayer) {
                        activeLayerName = layerName;
                        updateFilterUI(layerName); // Update the filter UI for the active layer
                    }
                });

                map.on('overlayremove', function (event) {
                    if (event.layer === wmsLayer) {
                        activeLayerName = null;
                        clearFilterUI(); // Clear the filter UI when the layer is removed
                    }
                });
            });
        } else {
            console.error("Failed to fetch layers:", data.error);
        }
    })
    .catch(err => console.error("Error fetching layers:", err));

// Function to update the filter UI dynamically
function updateFilterUI(layerName) {
    const { attributes, alias, wmsLayer } = layerMap[layerName];

    // Clear existing filter UI
    clearFilterUI();

    // Create filter UI
    const filterDiv = document.createElement('div');
    filterDiv.style.margin = '10px';

    // Label
    const filterLabel = document.createElement('label');
    filterLabel.innerText = `Filtro para ${alias}:`;
    filterLabel.style.display = 'block';

    // Column Dropdown
    const columnSelect = document.createElement('select');
    columnSelect.style.marginRight = '5px';
    attributes.forEach(attr => {
        const option = document.createElement('option');
        option.value = attr;
        option.text = attr;
        columnSelect.appendChild(option);
    });

    // Operator Dropdown
    const operatorSelect = document.createElement('select');
    operatorSelect.style.marginRight = '5px';
    ['=', '>', '<', '>=', '<=', 'LIKE'].forEach(op => {
        const option = document.createElement('option');
        option.value = op;
        option.text = op;
        operatorSelect.appendChild(option);
    });

    // Value Input
    const valueInput = document.createElement('input');
    valueInput.type = 'text';
    valueInput.placeholder = 'Enter value';
    valueInput.style.marginRight = '5px';

    // Apply Filter Button
    const applyFilterButton = document.createElement('button');
    applyFilterButton.innerText = 'Apply Filter';
    applyFilterButton.addEventListener('click', () => {
        const column = columnSelect.value;
        const operator = operatorSelect.value;
        const value = valueInput.value;

        if (value) {
            const cqlFilter = `${column} ${operator} '${value}'`;
            wmsLayer.setParams({ CQL_FILTER: cqlFilter });
        } else {
            alert('Please enter a value to apply the filter.');
        }
    });

    // Append all elements
    filterDiv.appendChild(filterLabel);
    filterDiv.appendChild(columnSelect);
    filterDiv.appendChild(operatorSelect);
    filterDiv.appendChild(valueInput);
    filterDiv.appendChild(applyFilterButton);

    // Append to control panel
    const layerControlDiv = document.querySelector('.leaflet-control-layers-overlays');
    layerControlDiv.appendChild(filterDiv);
}

// Function to clear the filter UI
function clearFilterUI() {
    const layerControlDiv = document.querySelector('.leaflet-control-layers-overlays');
    const existingFilterDiv = layerControlDiv.querySelector('div');
    if (existingFilterDiv) {
        layerControlDiv.removeChild(existingFilterDiv);
    }
}