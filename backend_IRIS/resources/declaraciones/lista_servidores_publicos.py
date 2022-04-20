from flask import Response, request
from bson  import json_util
from bson.json_util import dumps
from database.db import mongo
import json, datetime

routes = []

def get_analytic_declaraciones_aggregate_lista_servidores_publicos():
  data = request.get_json()
  datos =  data.get("datos")
  institucion =  data.get("institucion")
  estado =  data.get("estado")
  nivel_gobierno =  data.get("nivel_gobierno")
  rfc =  data.get("rfc")
  nombres =  data.get("nombres")
  apellidos =  data.get("apellidos")
  limit = data.get("limit")
  skip = data.get("skip")
  match = generar_match_query(institucion,estado,nivel_gobierno,nombres,rfc,apellidos)
  if(match==""):
    query = {}
  else:
    query = match
  resultado = mongo.db.analytic_declaraciones_brief.find(query).skip(skip).limit(limit)
  response = json_util.dumps(resultado)
  return response

routes.append(dict(
    rule='declaraciones/lista_servidores_publicos/queries',
    view_func=get_analytic_declaraciones_aggregate_lista_servidores_publicos))

def generar_match_query(institucion,estado,gobierno,nombre,rfc, apellidos):
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
  if(nombre!=""):
    diccionario['firstName'] = nombre
  if(apellidos!=""):
    diccionario['lastName'] = apellidos
  if(rfc!=""):
    diccionario['rfc'] = rfc
  return diccionario

