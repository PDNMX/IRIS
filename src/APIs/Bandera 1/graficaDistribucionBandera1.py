import requests
import json
import pandas as pd

url = "https://iris.plataformadigitalnacional.org/api/dataset/analytic_contracts_flag_1/aggregate"

payload = json.dumps([
  {
    "$match": {
      "duration": {
        "$gte": 1,
        "$lte": 100
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

print(data)

with open("../../Datos/DatosGraficaDistribucionBandera1.js","w",encoding="utf-8") as file:
  file.write("export const data="+str(data))

#print(data)
