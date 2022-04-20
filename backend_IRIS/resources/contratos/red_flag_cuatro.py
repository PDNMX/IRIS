from flask import Response, request
from bson  import json_util
from bson.json_util import dumps
from database.db import mongo
import json, datetime
from .utils_contratos import generar_match_query_dates
from .utils_contratos import generar_match_query_percentage


routes = []

def get_maximo_minimo_aumento_porcentual():
  try:
    data = request.get_json()
    fecha_inicio =  data.get("fecha_inicio")
    fecha_fin =  data.get("fecha_fin")
    match = generar_match_query_dates(fecha_inicio,fecha_fin)
  except:
    match = ""

  if(match==""):
    query = [{"$group":{"_id":None,
                  "max":{"$max":"$_percentage"},
                  "min":{"$min":"$_percentage"}}}]
  else:
    query = [match,{"$group":{"_id":None,
                  "max":{"$max":"$_percentage"},
                  "min":{"$min":"$_percentage"}}}]
  resultado = mongo.db.analytic_contracts_flag_4.aggregate(query)
  response = json_util.dumps(resultado)
  return response

routes.append(dict(
    rule='red_flag_4/get_maximo_minimo_aumento_porcentual/',
    view_func=get_maximo_minimo_aumento_porcentual))

def montos_adjudicacion_inicial_contrato_final():
  data = request.get_json()
  percentage_inicial =  data.get("percentage_inicial")
  percentage_final =  data.get("percentage_final")
  fecha_inicio =  data.get("fecha_inicio")
  fecha_fin =  data.get("fecha_fin")
  match = generar_match_query_percentage(fecha_inicio,fecha_fin,percentage_inicial,percentage_final)
  if(match==""):
    query = [
            {"$group":{"_id":{"$year":"$_datetime"},
                       "awardValue":{"$sum":"$awardValue"},
                       "contractValue":{"$sum":"$contractValue"}}},
               { "$sort" : { "_id" : 1 } }
            ]
  else:
    query = [match,
            {"$group":{"_id":{"$year":"$_datetime"},
                       "awardValue":{"$sum":"$awardValue"},
                       "contractValue":{"$sum":"$contractValue"}}},
              { "$sort" : { "_id" : 1 } }
            ]
  resultado = mongo.db.analytic_contracts_flag_4.aggregate(query)
  response = json_util.dumps(resultado)
  return response

routes.append(dict(
    rule='red_flag_4/montos_adjudicacion_inicial_contrato_final/',
    view_func=montos_adjudicacion_inicial_contrato_final))

def get_resumen_integridad_de_datos_adjudicacion():
  resultado = mongo.db.analytic_contracts_flag_4.aggregate(
    [{"$group":{"_id":"$status","contractId":{"$sum":1}}}]
     )
  response = json_util.dumps(resultado)
  return response

routes.append(dict(
    rule='red_flag_4/get_resumen_integridad_de_datos_adjudicacion/',
    view_func=get_resumen_integridad_de_datos_adjudicacion))


def get_integridad_de_datos_adjudicacion():
  resultado = mongo.db.analytic_contracts_flag_4.aggregate(
    [{"$group":{"_id":"$message","contractId":{"$sum":1}}}]
  )
  response = json_util.dumps(resultado)
  return response

routes.append(dict(
    rule='red_flag_4/get_integridad_de_datos_adjudicacion/',
    view_func=get_integridad_de_datos_adjudicacion))

def montos_adjudicacion_contrato():
  data = request.get_json()
  percentage_inicial =  data.get("percentage_inicial")
  percentage_final =  data.get("percentage_final")
  fecha_inicio =  data.get("fecha_inicio")
  fecha_fin =  data.get("fecha_fin")
  match = generar_match_query_percentage(fecha_inicio,fecha_fin,percentage_inicial,percentage_final)
  if(match==""):
    query = [
              {"$group":{"_id":"$procurementMethod",
              "awardValue":{"$sum":"$awardValue"},
              "contractValue":{"$sum":"$contractValue"}}}
            ]
  else:
    query = [match,
              {"$group":{"_id":"$procurementMethod",
              "awardValue":{"$sum":"$awardValue"},
              "contractValue":{"$sum":"$contractValue"}}}
            ]
  resultado = mongo.db.analytic_contracts_flag_4.aggregate(query)
  response = json_util.dumps(resultado)
  return response

routes.append(dict(
    rule='red_flag_4/montos_adjudicacion_contrato/',
    view_func=montos_adjudicacion_contrato))


def distribucion_de_montos_adjudicados():
  data = request.get_json()
  percentage_inicial =  data.get("percentage_inicial")
  percentage_final =  data.get("percentage_final")
  fecha_inicio =  data.get("fecha_inicio")
  fecha_fin =  data.get("fecha_fin")
  match = generar_match_query_percentage(fecha_inicio,fecha_fin,percentage_inicial,percentage_final)
  if(match==""):
    query = [
             {"$group":{"_id":"$procurementMethod",
             "contractValue":{"$sum":"$contractValue"}}}
            ]
  else:
    query = [match,
             {"$group":{"_id":"$procurementMethod",
             "contractValue":{"$sum":"$contractValue"}}}
            ]
  resultado = mongo.db.analytic_contracts_flag_4.aggregate(query)
  response = json_util.dumps(resultado)
  return response

routes.append(dict(
    rule='red_flag_4/distribucion_de_montos_adjudicados/',
    view_func=distribucion_de_montos_adjudicados))


def distribucion_de_montos_contratados():
  data = request.get_json()
  percentage_inicial =  data.get("percentage_inicial")
  percentage_final =  data.get("percentage_final")
  fecha_inicio =  data.get("fecha_inicio")
  fecha_fin =  data.get("fecha_fin")
  match = generar_match_query_percentage(fecha_inicio,fecha_fin,percentage_inicial,percentage_final)
  if(match==""):
    query = [
             {"$group":{"_id":"$procurementMethod",
             "awardValue":{"$sum":"$awardValue"}}}
            ]
  else:
    query = [match,
             {"$group":{"_id":"$procurementMethod",
             "awardValue":{"$sum":"$awardValue"}}}
            ]
  resultado = mongo.db.analytic_contracts_flag_4.aggregate(query)
  response = json_util.dumps(resultado)
  return response

routes.append(dict(
    rule='red_flag_4/distribucion_de_montos_contratados/',
    view_func=distribucion_de_montos_contratados))

def get_procesos_contratacion():
  data = request.get_json()
  percentage_inicial =  data.get("percentage_inicial")
  percentage_final =  data.get("percentage_final")
  fecha_inicio =  data.get("fecha_inicio")
  fecha_fin =  data.get("fecha_fin")
  match = generar_match_query_percentage(fecha_inicio,fecha_fin,percentage_inicial,percentage_final)
  if(match==""):
    query = [
             {"$group":{"_id":"$_percentage","contractId":{"$sum":1}}},
               { "$sort" : { "_id" : 1 } }
            ]
  else:
    query = [match,
            {"$group":{"_id":"$_percentage","contractId":{"$sum":1}}},
              { "$sort" : { "_id" : 1 } }]
  resultado = mongo.db.analytic_contracts_flag_4.aggregate(query)
  response = json_util.dumps(resultado)
  return response

routes.append(dict(
    rule='red_flag_4/get_procesos_contratacion/',
    view_func=get_procesos_contratacion))