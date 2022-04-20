from flask import Response, request
from bson  import json_util
from bson.json_util import dumps
from database.db import mongo
import json, datetime
from .utils_contratos import generar_match_query_dates
from .utils_contratos import generar_query_match
routes = []

def get_maximo_minimo_oferentes():
  try:
    data = request.get_json()
    fecha_inicio =  data.get("fecha_inicio")
    fecha_fin =  data.get("fecha_fin")
    match = generar_match_query_dates(fecha_inicio,fecha_fin)
  except:
    match = ""
  if(match==""):
    query = [{"$group":{"_id":None,
                  "max":{"$max":"$numberOfTenderers"},
                  "min":{"$min":"$numberOfTenderers"}}}]
  else:
    query = [match,{"$group":{"_id":None,
               "max":{"$max":"$numberOfTenderers"},
               "min":{"$min":"$numberOfTenderers"}}}]
  resultado = mongo.db.analytic_contracts_flag_2.aggregate(query)
  response = json_util.dumps(resultado)
  return response

routes.append(dict(
    rule='red_flag_2/get_maximo_minimo_oferentes/',
    view_func=get_maximo_minimo_oferentes))

def get_maximo_minimo_oferentes_fechas():
  resultado_fechas = {}
  resultado = mongo.db.analytic_contracts_flag_2.aggregate(
      [
      {"$match":
        {"numberOfTenderers":{"$gte":1,"$lte":40}}},
      {"$group":{"_id":None,"min":{"$min":"$_datetime"},
                            "max":{"$max":"$_datetime"}}}
      ]
     )
  for document in resultado:
    fecha_min = document["min"]
    fecha_max = document["max"]
  resultado_fechas["min"] = fecha_min.strftime("%Y-%m-%dT%H:%M:%SZ")
  resultado_fechas["max"] = fecha_max.strftime("%Y-%m-%dT%H:%M:%SZ")
  response = json_util.dumps(resultado_fechas)
  return Response(response,mimetype='application/json')

routes.append(dict(
    rule='red_flag_2/get_maximo_minimo_oferentes_fechas/',
    view_func=get_maximo_minimo_oferentes_fechas))

def get_procesos_contratacion_oferentes():
  try:
    data = request.get_json()
    numero_oferentes =  data.get("numero_oferentes")
    fecha_inicio =  data.get("fecha_inicio")
    fecha_fin =  data.get("fecha_fin")
    if numero_oferentes=='':
      numero_oferentes=40
    else:
      numero_oferentes =  int(data.get("numero_oferentes"))
  except:
    match = ""
    numero_oferentes=40

  match = generar_query_match(fecha_inicio,fecha_fin,numero_oferentes,"numberOfTenderers")
  if(match==""):
    query = [
              {"$group":{"_id":"$numberOfTenderers","contractId":{"$sum":1}}},
              { "$sort" : { "_id" : 1 } }
            ]
  else:
    query = [match,
              {"$group":{"_id":"$numberOfTenderers","contractId":{"$sum":1}}},
              { "$sort" : { "_id" : 1 } }
            ]
  resultado = mongo.db.analytic_contracts_flag_2.aggregate(query)
  response = json_util.dumps(resultado)
  return response

routes.append(dict(
    rule='red_flag_2/get_procesos_contratacion_oferentes/',
    view_func=get_procesos_contratacion_oferentes))

def get_integridad_de_datos_flag2():
  resultado = mongo.db.analytic_contracts_flag_2.aggregate(
    [{"$group":{"_id":"$message","contractId":{"$sum":1}}}]
     )
  response = json_util.dumps(resultado)
  return response

routes.append(dict(
    rule='red_flag_2/get_integridad_de_datos_flag2/',
    view_func=get_integridad_de_datos_flag2))

def get_resumen_integridad_de_datos_flag2():
  resultado = mongo.db.analytic_contracts_flag_2.aggregate(
    [{"$group":{"_id":"$status","contractId":{"$sum":1}}}]
     )
  response = json_util.dumps(resultado)
  return response

routes.append(dict(
    rule='red_flag_2/get_resumen_integridad_de_datos_flag2/',
    view_func=get_resumen_integridad_de_datos_flag2))
