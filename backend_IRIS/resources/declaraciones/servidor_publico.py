from flask import Response, request
from bson  import json_util
from bson.json_util import dumps
from database.db import mongo
import json, datetime

routes = []

def get_analytic_declaraciones_aggregate_servidor_publico():
  data = request.get_json()
  datos =  data.get("datos")
  rfc =  data.get("rfc")
  nombres =  data.get("nombres")
  apellidos =  data.get("apellidos")
  match = generar_match_query(nombres,apellidos,rfc)
  if(datos=="ingresos_servidor_publico"):
    if(match==""):
      query = [{"$group":{"_id":{"$year":"$_datetime"},"totalIncome":{"$sum":"$totalIncome"}}},
      { "$sort" : { "_id" : 1 } }]
    else:
      query = [match,{"$group":{"_id":{"$year":"$_datetime"},"totalIncome":{"$sum":"$totalIncome"}}},
      { "$sort" : { "_id" : 1 } }]
  if(datos=="activos_servidor_publico"):
    if(match==""):
      query = [{"$group":{"_id":{"$year":"$_datetime"},"totalActives":{"$sum":"$totalActives"}}},
      { "$sort" : { "_id" : 1 } }]
    else:
      query = [match,{"$group":{"_id":{"$year":"$_datetime"},"totalActives":{"$sum":"$totalActives"}}},
      { "$sort" : { "_id" : 1 } }]
  if(datos=="pasivos_servidor_publico"):
    if(match==""):
      query = [{"$group":{"_id":{"$year":"$_datetime"},"totalPassives":{"$sum":"$totalPassives"}}},
      { "$sort" : { "_id" : 1 } }]
    else:
      query = [match,{"$group":{"_id":{"$year":"$_datetime"},"totalPassives":{"$sum":"$totalPassives"}}},
      { "$sort" : { "_id" : 1 } }]
  if(datos=="ingresos_activos_entre_pasivos"):
    if(match==""):
      query = [{"$group":{"_id":{"$year":"$_datetime"},"totalIncome":{"$sum":"$totalIncome"},"totalPassives":{"$sum":"$totalPassives"},"totalActives":{"$sum":"$totalActives"}}},
      { "$sort" : { "_id" : 1 } }]
    else:
      query = [match,{"$group":{"_id":{"$year":"$_datetime"},"totalIncome":{"$sum":"$totalIncome"},"totalPassives":{"$sum":"$totalPassives"},"totalActives":{"$sum":"$totalActives"}}},
      { "$sort" : { "_id" : 1 } }]
  if(datos=="sueldos_entre_ingresos"):
    if(match==""):
      query = [{"$group":{"_id":{"$year":"$_datetime"},"totalIncome":{"$sum":"$totalIncome"},"sueldos_salarios_publicos":{"$sum":"$sueldos_salarios_publicos"}}},
      { "$sort" : { "_id" : 1 } }]
    else:
      query = [match,{"$group":{"_id":{"$year":"$_datetime"},"totalIncome":{"$sum":"$totalIncome"},"sueldos_salarios_publicos":{"$sum":"$sueldos_salarios_publicos"}}},
      { "$sort" : { "_id" : 1 } }]
  if(datos=="ingresos_activos_pasivos"):
    if(match==""):
      query = [{"$group":{"_id":{"$year":"$_datetime"},"totalIncome":{"$sum":"$totalIncome"},"totalActives":{"$sum":"$totalActives"},"totalPassives":{"$sum":"$totalPassives"}}},
      { "$sort" : { "_id" : 1 } }]
    else:
      query = [match,{"$group":{"_id":{"$year":"$_datetime"},"totalIncome":{"$sum":"$totalIncome"},"totalActives":{"$sum":"$totalActives"},"totalPassives":{"$sum":"$totalPassives"}}},
      { "$sort" : { "_id" : 1 } }]
  if(datos=="ingresos_entre_pasivos"):
    if(match==""):
      query = [{"$group":{"_id":{"$year":"$_datetime"},"totalIncome":{"$sum":"$totalIncome"},"totalPassives":{"$sum":"$totalPassives"}}},
      { "$sort" : { "_id" : 1 } }]
    else:
      query = [match,{"$group":{"_id":{"$year":"$_datetime"},"totalIncome":{"$sum":"$totalIncome"},"totalPassives":{"$sum":"$totalPassives"}}},
      { "$sort" : { "_id" : 1 } }]

  resultado = mongo.db.analytic_declaraciones_brief.aggregate(query)
  response = json_util.dumps(resultado)
  return response

routes.append(dict(
    rule='declaraciones/servidor_publico/queries',
    view_func=get_analytic_declaraciones_aggregate_servidor_publico))

def generar_match_query(nombre,apellidos,rfc):
  diccionario = {}
  math_dict = {}
  retorno=""
  if(nombre=="" and apellidos=="" and rfc == ""):
    return ""
  if(nombre!=""):
    diccionario['firstName'] = nombre
  if(apellidos!=""):
    diccionario['lastName'] = apellidos
  if(rfc!=""):
    diccionario['rfc'] = rfc
  math_dict['$match'] = diccionario
  return math_dict