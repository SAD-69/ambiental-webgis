from flask import Flask, jsonify, render_template, request
import requests

app = Flask(__name__)

# GeoServer Configuration
GEOSERVER_URL = "https://geoservicos.ibge.gov.br/geoserver"
WORKSPACE = "CGMAT"

@app.route("/")
def home():
    """Render the frontend page."""
    return render_template("index.html")

@app.route("/get_layers", methods=["GET"])
def get_layers():
    """Fetch layers from GeoServer."""
    wms_url = f"{GEOSERVER_URL}/{WORKSPACE}/wms?request=GetCapabilities&service=WMS"
    try:
        response = requests.get(wms_url)
        response.raise_for_status()
        layers = {
            "pbqg22_04_Municipios_cd_mun": "Municípios",  
            "pbqg22_02_Estado_LimUF": "Estados",
            "pbqg22_01_GrandesRegioes_NM_REGIAO": "Regiões"
        }
        return jsonify({"success": True, "layers": layers})
    except requests.exceptions.RequestException as e:
        return jsonify({"success": False, "error": str(e)}), 500


if __name__ == "__main__":
    app.run('0.0.0.0')
