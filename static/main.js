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
            Object.entries(data.layers).forEach(([layerName, layerInfo]) => {
                const { alias, attributes } = layerInfo;

                // Create WMS Layer
                const wmsLayer = L.tileLayer.wms('https://geoservicos.ibge.gov.br/geoserver/ows', {
                    layers: layerName,
                    format: 'image/png',
                    transparent: true,
                    version: '1.3.0',
                    attribution: '© GeoServer'
                });

                // Add layer to the layer control
                layerControl.addOverlay(wmsLayer, alias);

                // Create filter UI for the layer
                const filterDiv = document.createElement('div');
                filterDiv.style.margin = '10px';

                // Label
                const filterLabel = document.createElement('label');
                filterLabel.innerText = `Filtro para camada de ${alias}:`;
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
                        const cqlFilter = `${column} ${operator} ${value}`;
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
            });
        } else {
            console.error("Failed to fetch layers:", data.error);
        }
    })
    .catch(err => console.error("Error fetching layers:", err));
