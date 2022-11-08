import requests
import json

url = "https://iris.plataformadigitalnacional.org/api/dataset/analytic_contracts_flag_2/aggregate"

payload = json.dumps([
  {
    "$match": {
      "numberOfTenderers": {
        "$gte": 1,
        "$lte": 40
      },
      "status": "Datos completos"
    }
  },
  {
    "$group": {
      "_id": "$numberOfTenderers",
      "contractId": {
        "$sum": 1
      }
    }
  }
])
headers = {
  'authority': 'iris.plataformadigitalnacional.org',
  'accept': 'application/json',
  'accept-language': 'es-ES,es;q=0.9,en;q=0.8',
  'authorization': 'Bearer undefined',
  'content-type': 'application/json',
  'cookie': '_ga=GA1.2.629968652.1663600155; _gid=GA1.2.1977910366.1667835744; __z_a=3961386846189533321618953',
  'origin': 'https://iris.plataformadigitalnacional.org',
  'referer': 'https://iris.plataformadigitalnacional.org/hubs/1/dashboards/5d795b7857186e024a40e05a',
  'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-origin',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)
