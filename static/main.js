const map = L.map('map').setView([-22.0, -45.0], 6);

// Basemap
const basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Layer Control
const layerControl = L.control.layers(null, null, { collapsed: false }).addTo(map);

// Fetch layers from the backend
fetch('/get_layers')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Object.keys(data.layers).forEach(layerName => {

                const alias = data.layers[layerName];

                // Toggle das layers
                const wmsLayer = L.tileLayer.wms('https://geoservicos.ibge.gov.br/geoserver/ows', {
                    layers: layerName,
                    workspace: 'CGMAT',
                    format: 'image/png',
                    transparent: true,
                    version: '1.3.0',  
                    srs: 'EPSG:4674',
                    attribution: '© GeoServer',
                    bounds: [[-33.9462928771973, -74.2161712646484],[5.466956615448, -28.6219253540039]]

                });
                layerControl.addOverlay(wmsLayer, alias);

            });
        } else {
            console.error("Failed to fetch layers:", data.error);
        }
    })
    .catch(err => console.error("Error fetching layers:", err));