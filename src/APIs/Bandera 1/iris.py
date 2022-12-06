from fastapi import FastAPI
import requests
import json

# Creamos la API
app = FastAPI()

@app.get("/Bandera1/GraficaBarraPrincipal")
async def download(limiteInferior: int=1,limiteSuperior:int=100):
    url = "https://iris.plataformadigitalnacional.org/api/dataset/analytic_contracts_flag_1/aggregate"

    payload = json.dumps([
        {
            "$match": {
                "duration": {
                    "$gte": limiteInferior,
                    "$lte": limiteSuperior
                },
                "status": "Datos completos"
            }
        },
        {
            "$group": {
                "_id": "$duration",
                "contractId": {
                    "$sum": 1
                }
            }
        }
    ])
    headers = {
        'content-type': 'application/json',
    }

    response = requests.request("POST", url, headers=headers, data=payload)

    data = response.json()


    def orden(dicts):
        return list(dicts.values())[0]


    data.sort(key=orden)

    with open("../../Datos/DatosGraficaDistribucionBandera1.js", "w", encoding="utf-8") as file:
        file.write("export const data="+str(data))
