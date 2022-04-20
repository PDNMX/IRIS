from flask import Response, request
from bson  import json_util
from bson.json_util import dumps
from database.db import mongo
import json, datetime
import logging

logger = logging.getLogger(__name__)
routes = []

def get_analytic_declaraciones_aggregate_general():
  logger.info('Request URL: %s', request.url)
  try:
    logger.info('Request DATA: %s', request.get_json())
    data = request.get_json()
    datos =  data.get("datos")
    institucion =  data.get("institucion")
    estado =  data.get("estado")
    nivel_gobierno =  data.get("nivel_gobierno")
    match = generar_match_query(institucion,estado,nivel_gobierno)
  except:
    match=""
  if(datos=="total_ingresos_avg_ingresos"):
    if(match==""):
      query = [{"$group":{"_id":{"$year":"$_datetime"},"totalIncome":{"$sum":"$totalIncome"},"totalIncome_avg":{"$avg":"$totalIncome"}}},
      { "$sort" : { "_id" : 1 } }]
    else:
      query = [match,{"$group":{"_id":{"$year":"$_datetime"},"totalIncome":{"$sum":"$totalIncome"},"totalIncome_avg":{"$avg":"$totalIncome"}}},
      { "$sort" : { "_id" : 1 } }]
  if(datos=="sueldos_salarios"):
    if(match==""):
      query = [{"$group":{"_id":{"$year":"$_datetime"},"totalIncome":{"$sum":"$totalIncome"},"sueldos_salarios_publicos":{"$sum":"$sueldos_salarios_publicos"}}},
      { "$sort" : { "_id" : 1 } }]
    else:
      query = [match,{"$group":{"_id":{"$year":"$_datetime"},"totalIncome":{"$sum":"$totalIncome"},"sueldos_salarios_publicos":{"$sum":"$sueldos_salarios_publicos"}}},
      { "$sort" : { "_id" : 1 } }]
  if(datos=="total_activos_avg_activos"):
    if(match==""):
      query = [{"$group":{"_id":{"$year":"$_datetime"},"totalActives":{"$sum":"$totalActives"},"totalActives_avg":{"$avg":"$totalActives"}}},
      { "$sort" : { "_id" : 1 } }]
    else:
      query = [match,{"$group":{"_id":{"$year":"$_datetime"},"totalActives":{"$sum":"$totalActives"},"totalActives_avg":{"$avg":"$totalActives"}}},
      { "$sort" : { "_id" : 1 } }]
  if(datos=="total_pasivos_avg_pasivos"):
    if(match==""):
      query = [{"$group":{"_id":{"$year":"$_datetime"},"totalPassives":{"$sum":"$totalPassives"},"totalPassives_avg":{"$avg":"$totalPassives"}}},
      { "$sort" : { "_id" : 1 } }]
    else:
      query = [match,{"$group":{"_id":{"$year":"$_datetime"},"totalPassives":{"$sum":"$totalPassives"},"totalPassives_avg":{"$avg":"$totalPassives"}}},
      { "$sort" : { "_id" : 1 } }]
  if(datos=="pasivos_sueldos_salarios"):
    if(match==""):
      query = [{"$group":{"_id":{"$year":"$_datetime"},"totalPassives":{"$sum":"$totalPassives"},"sueldos_salarios_publicos":{"$sum":"$sueldos_salarios_publicos"}}},
      { "$sort" : { "_id" : 1 } }]
    else:
      query = [match,{"$group":{"_id":{"$year":"$_datetime"},"totalPassives":{"$sum":"$totalPassives"},"sueldos_salarios_publicos":{"$sum":"$sueldos_salarios_publicos"}}},
      { "$sort" : { "_id" : 1 } }]
  if(datos=="activos_sueldos_salarios"):
    if(match==""):
      query = [{"$group":{"_id":{"$year":"$_datetime"},"totalActives":{"$sum":"$totalActives"},"sueldos_salarios_publicos":{"$sum":"$sueldos_salarios_publicos"}}},
      { "$sort" : { "_id" : 1 } }]
    else:
      query = [match,{"$group":{"_id":{"$year":"$_datetime"},"totalActives":{"$sum":"$totalActives"},"sueldos_salarios_publicos":{"$sum":"$sueldos_salarios_publicos"}}},
      { "$sort" : { "_id" : 1 } }]
  if(datos=="ingresos_sueldos_salarios"):
    if(match==""):
      query = [{"$group":{"_id":{"$year":"$_datetime"},"totalIncome":{"$sum":"$totalIncome"},"sueldos_salarios_publicos":{"$sum":"$sueldos_salarios_publicos"}}},
      { "$sort" : { "_id" : 1 } }]
    else:
      query = [match,{"$group":{"_id":{"$year":"$_datetime"},"totalIncome":{"$sum":"$totalIncome"},"sueldos_salarios_publicos":{"$sum":"$sueldos_salarios_publicos"}}},
      { "$sort" : { "_id" : 1 } }]

  resultado = mongo.db.analytic_declaraciones_brief.aggregate(query)
  response = json_util.dumps(resultado)
  logger.info('Response HTTP_STATUS: %s', 200)
  logger.info('Response DATA: %s', response)
  return response

routes.append(dict(
    rule='declaraciones/general/aggregate',
    view_func=get_analytic_declaraciones_aggregate_general))

def get_analytic_declaraciones_distinct_general():
  resultado = mongo.db.analytic_contracts_flag_1.aggregate(
     [{"$group":{"_id":None,"max":{"$max":"$duration"},"min":{"$min":"$duration"}}},
      { "$sort" : { "_id" : 1 } }]
     )
  response = json_util.dumps(resultado)
  return response

routes.append(dict(
    rule='declaraciones/general/distinct',
    view_func=get_analytic_declaraciones_distinct_general))


def generar_match_query(institucion,estado,gobierno):
  diccionario = {}
  math_dict = {}
  retorno=""
  if(institucion=="" and estado=="" and gobierno == ""):
    return ""
  if(gobierno!=""):
    diccionario['governmentLevel'] = gobierno
  if(institucion!=""):
    diccionario['institution'] = institucion
  if(estado!=""):
    diccionario['state'] = estado
  math_dict['$match'] = diccionario
  return math_dict

