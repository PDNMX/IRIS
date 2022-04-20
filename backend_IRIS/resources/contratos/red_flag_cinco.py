from flask import Response, request
from bson  import json_util
from bson.json_util import dumps
from database.db import mongo
import json, datetime
from .utils_contratos import generar_match_query_dates
from .utils_contratos import generar_query_match

routes = []

def get_maximo_minimo_enmiendas():
  try:
    data = request.get_json()
    fecha_inicio =  data.get("fecha_inicio")
    fecha_fin =  data.get("fecha_fin")
    match = generar_match_query_dates(fecha_inicio,fecha_fin)
  except:
    match = ""

  if(match==""):
    query = [{"$group":{"_id":None,
                  "max":{"$max":"$amendments"},
                  "min":{"$min":"$amendments"}}}]
  else:
    query = [match,{"$group":{"_id":None,
               "max":{"$max":"$amendments"},
               "min":{"$min":"$amendments"}}}]
  resultado = mongo.db.analytic_contracts_flag_5.aggregate(query)
  response = json_util.dumps(resultado)
  return response

routes.append(dict(
    rule='red_flag_5/get_maximo_minimo_enmiendas/',
    view_func=get_maximo_minimo_enmiendas))

def get_maximo_minimo_enmiendas_fechas():
  resultado_fechas = {}
  resultado = mongo.db.analytic_contracts_flag_5.aggregate(
      [
      {"$match":
        {"amendments":{"$gte":1,"$lte":30}}},
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
    rule='red_flag_5/get_maximo_minimo_enmiendas_fechas/',
    view_func=get_maximo_minimo_enmiendas_fechas))

def get_contratos_enmiendas():
  try:
    data = request.get_json()
    numero_enmiendas =  data.get("numero_enmiendas")
    fecha_inicio =  data.get("fecha_inicio")
    fecha_fin =  data.get("fecha_fin")
    if numero_enmiendas=='':
      numero_enmiendas=30
    else:
      numero_enmiendas =  int(data.get("numero_enmiendas"))
  except:
    match = ""
    numero_enmiendas=30

  match = generar_query_match(fecha_inicio,fecha_fin,numero_enmiendas,"amendments")

  if(match==""):
    query = [
              {"$group":{"_id":"$amendments","contractId":{"$sum":1}}},
              { "$sort" : { "_id" : 1 } }
            ]
  else:
    query = [match,
              {"$group":{"_id":"$amendments","contractId":{"$sum":1}}},
              { "$sort" : { "_id" : 1 } }
            ]
  resultado = mongo.db.analytic_contracts_flag_5.aggregate(query)
  response = json_util.dumps(resultado)
  return response

routes.append(dict(
    rule='red_flag_5/get_contratos_enmiendas/',
    view_func=get_contratos_enmiendas))

def get_integridad_de_datos_enmiendas():
  resultado = mongo.db.analytic_contracts_flag_5.aggregate(
    [{"$group":{"_id":"$message","contractId":{"$sum":1}}}]
     )
  response = json_util.dumps(resultado)
  return response

routes.append(dict(
    rule='red_flag_5/get_integridad_de_datos_enmiendas/',
    view_func=get_integridad_de_datos_enmiendas))

def get_resumen_integridad_de_datos_enmiendas():
  resultado = mongo.db.analytic_contracts_flag_5.aggregate(
    [{"$group":{"_id":"$status","contractId":{"$sum":1}}}]
     )
  response = json_util.dumps(resultado)
  return response

routes.append(dict(
    rule='red_flag_5/get_resumen_integridad_de_datos_enmiendas/',
    view_func=get_resumen_integridad_de_datos_enmiendas))