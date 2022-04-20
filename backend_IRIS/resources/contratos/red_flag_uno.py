from flask import Response, request
from bson  import json_util
from bson.json_util import dumps
from database.db import mongo
import json, datetime
from .utils_contratos import generar_match_query_dates
from .utils_contratos import generar_query_match

routes = []

def get_maximo_minimo():
  try:
    data = request.get_json()
    fecha_inicio =  data.get("fecha_inicio")
    fecha_fin =  data.get("fecha_fin")
    match = generar_match_query_dates(fecha_inicio,fecha_fin)
  except:
    match = ""

  if(match==""):
    query =   [{"$group":{"_id":None,
                           "max":{"$max":"$duration"},
                           "min":{"$min":"$duration"}}}
              ]
  else:
    query = [match,{"$group":{"_id":None,
               "max":{"$max":"$duration"},
               "min":{"$min":"$duration"}}}]
  resultado = mongo.db.analytic_contracts_flag_1.aggregate(query)
  response = json_util.dumps(resultado)
  return response

routes.append(dict(
    rule='red_flag_1/get_maximo_minimo/',
    view_func=get_maximo_minimo))


def get_numero_contratos():
  try:
    data = request.get_json()
    numero_contratos =  data.get("numero_contratos")
    fecha_inicio =  data.get("fecha_inicio")
    fecha_fin =  data.get("fecha_fin")
    if numero_contratos=='':
      numero_contratos=100
    else:
      numero_contratos =  int(data.get("numero_contratos"))
    match = generar_query_match(fecha_inicio,fecha_fin,numero_contratos,"duration")
  except:
    numero_contratos=100
    match = ""

  if(match==""):
    query = [{"$match":{"duration":{"$gte":1,
                                      "$lte":numero_contratos},
                                      "status":"Datos completos"}},
              {"$group":{"_id":"$duration","contractId":{"$sum":1}}},
               { "$sort" : { "_id" : 1 } }
            ]
  else:
    query = [match,
             {"$group":{"_id":"$duration","contractId":{"$sum":1}}},
              { "$sort" : { "_id" : 1 } }
            ]
  resultado = mongo.db.analytic_contracts_flag_1.aggregate(query)
  response = json_util.dumps(resultado)

  return response



routes.append(dict(
    rule='red_flag_1/get_numero_contratos/',
    view_func=get_numero_contratos))

def get_integridad_de_datos_flag1():
  resultado = mongo.db.analytic_contracts_flag_1.aggregate(
    [{"$group":{"_id":"$message","contractId":{"$sum":1}}}]
     )
  response = json_util.dumps(resultado)
  return response

routes.append(dict(
    rule='red_flag_1/get_integridad_de_datos_flag1/',
    view_func=get_integridad_de_datos_flag1))

def get_resumen_integridad_de_datos_flag1():
  resultado = mongo.db.analytic_contracts_flag_1.aggregate(
    [{"$group":{"_id":"$status","contractId":{"$sum":1}}}]
     )
  response = json_util.dumps(resultado)
  return response

routes.append(dict(
    rule='red_flag_1/get_resumen_integridad_de_datos_flag1/',
    view_func=get_resumen_integridad_de_datos_flag1))

def get_maximo_minimo_fecha_contratos():
  resultado_fechas = {}
  resultado = mongo.db.analytic_contracts_flag_1.aggregate(
    [{"$match":{"duration":{"$gte":1,"$lte":100}}},
      {"$group":{"_id":None,"min":{"$min":"$_datetime"},"max":{"$max":"$_datetime"}}}]
     )
  for document in resultado:
    fecha_min = document["min"]
    fecha_max = document["max"]
  resultado_fechas["min"] = fecha_min.strftime("%Y-%m-%dT%H:%M:%SZ")
  resultado_fechas["max"] = fecha_max.strftime("%Y-%m-%dT%H:%M:%SZ")
  response = json_util.dumps(resultado_fechas)
  return Response(response,mimetype='application/json')

routes.append(dict(
    rule='red_flag_1/get_maximo_minimo_fecha_contratos/',
    view_func=get_maximo_minimo_fecha_contratos))