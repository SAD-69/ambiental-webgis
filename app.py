from flask import Flask, jsonify, render_template, request, Response
import requests

app = Flask(__name__)

# GeoServer Configuration
GEOSERVER_URL = "http://localhost:8080/geoserver"
WORKSPACE = "basemaps"

@app.route("/")
def home():
    """Render the frontend page."""
    return render_template("index.html")

# Proxy endpoint for GeoServer
@app.route('/geoserver/<path:subpath>', methods=['GET', 'POST'])
def proxy(subpath):
    # GeoServer base URL
    geoserver_url = f"{GEOSERVER_URL}/{subpath}"
    
    # Forward request headers and parameters
    headers = {key: value for key, value in request.headers if key != 'Host'}
    params = request.args.to_dict()

    # Forward the request to GeoServer
    if request.method == 'POST':
        response = requests.post(geoserver_url, headers=headers, data=request.data, params=params)
    else:
        response = requests.get(geoserver_url, headers=headers, params=params)

    # Return the GeoServer response with the correct headers
    excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
    headers = [(name, value) for name, value in response.raw.headers.items() if name.lower() not in excluded_headers]
    response_content = Response(response.content, response.status_code, headers)
    response_content.headers['Access-Control-Allow-Origin'] = '*'
    return response_content

@app.route("/get_layers", methods=["GET"])
def get_layers():
    """Fetch layers from GeoServer."""
    wms_url = f"{GEOSERVER_URL}/{WORKSPACE}/wms?request=GetCapabilities&service=WMS"
    try:
        response = requests.get(wms_url)
        response.raise_for_status()
        layers = {
            "municipios_2022_db": {
                "alias": "Municípios",
                "attributes": ["cd_mun", "nm_mun"]  # Example attributes
            },
            "uc_tipo_uso_db": {
                "alias": "Unidades de Conservação",
                "attributes": ["nome_uc1", "esfera5"]
            }
        }
        return jsonify({"success": True, "layers": layers})
    except requests.exceptions.RequestException as e:
        return jsonify({"success": False, "error": str(e)}), 500



if __name__ == "__main__":
    app.run(debug=True)
