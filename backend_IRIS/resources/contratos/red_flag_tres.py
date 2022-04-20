from flask import Response, request
from bson  import json_util
from bson.json_util import dumps
from database.db import mongo
import json, datetime
from .utils_contratos import generar_match_query_dates
from .utils_contratos import generar_match_query_initial_date
from .utils_contratos import generar_query_match

routes = []


def contratos_anuales_por_adjudicacion():
  resultado = mongo.db.analytic_contracts_flag_4.aggregate(
    [{"$group":{"_id":{"_datetime":{"$year":"$_datetime"},
      "procurementMethod":"$procurementMethod"},"contractId":{"$sum":1}}},
      { "$sort" : { "_id" : 1 } }]
     )
  response = json_util.dumps(resultado)
  return response

routes.append(dict(
    rule='red_flag_3/contratos_anuales_por_adjudicacion/',
    view_func=contratos_anuales_por_adjudicacion))

def distribucion_contratos_anuales():
  try:
    data = request.get_json()
    fecha_inicio =  data.get("fecha_inicio")
    fecha_fin =  data.get("fecha_fin")
    match = generar_match_query_initial_date(fecha_inicio,fecha_fin)
  except:
    match = ""

  if(match==""):
    query = [{"$group":{"_id":"$procurementMethod","contractId":{"$sum":1}}}]
  else:
    query = [match,{"$group":{"_id":"$procurementMethod","contractId":{"$sum":1}}}]
  resultado = mongo.db.analytic_contracts_summary.aggregate(query)
  response = json_util.dumps(resultado)
  return response

routes.append(dict(
    rule='red_flag_3/distribucion_contratos_anuales/',
    view_func=distribucion_contratos_anuales))

def distribucion_contratos_anuales_por_adjudicacion():
  data = request.get_json()
  fecha_inicio =  data.get("fecha_inicio")
  fecha_fin =  data.get("fecha_fin")
  match = generar_match_query_initial_date(fecha_inicio,fecha_fin)
  if(match==""):
    query = [{"$group":{"_id":"$procurementMethod",
                       "totalAmount":{"$sum":"$totalAmount"},
                      "contractId":{"$sum":1}}}]
  else:
    query = [match,{"$group":{"_id":"$procurementMethod",
                    "totalAmount":{"$sum":"$totalAmount"},
                    "contractId":{"$sum":1}}}]
  resultado = mongo.db.analytic_contracts_summary.aggregate(query)
  response = json_util.dumps(resultado)
  return response

routes.append(dict(
    rule='red_flag_3/distribucion_contratos_anuales_por_adjudicacion/',
    view_func=distribucion_contratos_anuales_por_adjudicacion))

def total_contratos():
  try:
    data = request.get_json()
    fecha_inicio =  data.get("fecha_inicio")
    fecha_fin =  data.get("fecha_fin")
  except:
    match = ""
  match = generar_match_query_initial_date(fecha_inicio,fecha_fin)
  if(match==""):
    query = [{"$group":{"_id":"$contractId"}},
             {"$group":{"_id":1,"contractId":{"$sum":1}}}]
  else:
    query = [match,{"$group":{"_id":"$contractId"}},
                   {"$group":{"_id":1,"contractId":{"$sum":1}}}]
  resultado = mongo.db.analytic_contracts_summary.aggregate(query)
  response = json_util.dumps(resultado)
  return response

routes.append(dict(
    rule='red_flag_3/total_contratos/',
    view_func=total_contratos))

def monto_total():
  try:
    data = request.get_json()
    fecha_inicio =  data.get("fecha_inicio")
    fecha_fin =  data.get("fecha_fin")
    match = generar_match_query_initial_date(fecha_inicio,fecha_fin)
  except:
    match = ""

  if(match==""):
    query = [{"$group":{"_id":None,"totalAmount":{"$sum":"$totalAmount"}}}]
  else:
    query = [match,{"$group":{"_id":None,"totalAmount":{"$sum":"$totalAmount"}}}]
  resultado = mongo.db.analytic_contracts_summary.aggregate(query)
  response = json_util.dumps(resultado)
  return response

routes.append(dict(
    rule='red_flag_3/monto_total/',
    view_func=monto_total))