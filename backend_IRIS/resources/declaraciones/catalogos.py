from flask import Response, request
from bson  import json_util
from bson.json_util import dumps
from database.db import mongo
import json, datetime
import logging


logger = logging.getLogger(__name__)
routes = []

def get_niveles_de_gobierno():
  logger.info('Request URL: %s', request.url)
  resultado = mongo.db.analytic_declaraciones_brief.distinct("governmentLevel")
  logger.info('resultadoRequest DATA: %s', resultado)

  response = json_util.dumps(resultado)
  logger.info('Response HTTP_STATUS: %s', 200)
  logger.info('Response DATA: %s', response)
  return response

routes.append(dict(
    rule='declaraciones/catalogos/niveles_de_gobierno',
    view_func=get_niveles_de_gobierno))

def get_entidades_federativas():
  logger.info('Request URL: %s', request.url)
  resultado = mongo.db.analytic_declaraciones_brief.distinct("state")
  logger.info('resultadoRequest DATA: %s', resultado)

  response = json_util.dumps(resultado)
  logger.info('Response HTTP_STATUS: %s', 200)
  logger.info('Response DATA: %s', response)
  return response

routes.append(dict(
    rule='declaraciones/catalogos/entidades_federativas',
    view_func=get_entidades_federativas))

def get_first_name_funcionario():
  logger.info('Request URL: %s', request.url)
  data = request.get_json()
  rfc =  data.get("rfc")
  resultado = mongo.db.analytic_declaraciones_brief.distinct(
	"firstName",{"rfc":""+str(rfc)+""})
  logger.info('resultadoRequest DATA: %s', resultado)

  response = json_util.dumps(resultado)
  logger.info('Response HTTP_STATUS: %s', 200)
  logger.info('Response DATA: %s', response)
  return response

routes.append(dict(
    rule='declaraciones/catalogos/get_first_name_funcionario',
    view_func=get_first_name_funcionario))

def get_last_name_funcionario():
  logger.info('Request URL: %s', request.url)
  data = request.get_json()
  rfc =  data.get("rfc")
  resultado = mongo.db.analytic_declaraciones_brief.distinct(
	"lastName",{"rfc":""+str(rfc)+""})
  logger.info('resultadoRequest DATA: %s', resultado)

  response = json_util.dumps(resultado)
  logger.info('Response HTTP_STATUS: %s', 200)
  logger.info('Response DATA: %s', response)
  return response

routes.append(dict(
    rule='declaraciones/catalogos/get_last_name_funcionario',
    view_func=get_last_name_funcionario))

def get_institucion():
  logger.info('Request URL: %s', request.url)
  try:
    data = request.get_json()
    governmentLevel =  data.get("governmentLevel")
    state =  data.get("state")
    expresion =  data.get("expresion")
    match = generar_match_query_institucion(governmentLevel,state,expresion)
  except:
    match = ""
  print(match)
  resultado = mongo.db.analytic_declaraciones_brief.distinct(
	"institution",match)
  logger.info('resultadoRequest DATA: %s', resultado)

  response = json_util.dumps(resultado)
  logger.info('Response HTTP_STATUS: %s', 200)
  logger.info('Response DATA: %s', response)
  return response

routes.append(dict(
    rule='declaraciones/catalogos/get_institucion',
    view_func=get_institucion))

def get_autocompletar():
  logger.info('Request URL: %s', request.url)
  try:
    data = request.get_json()
    criterio =  data.get("criterio")
    expresion =  data.get("expresion")
    match = generar_match_query_autocomplete(criterio,expresion)
  except:
    match = ""
  print(match)
  resultado = mongo.db.analytic_declaraciones_brief.distinct(
	criterio,match)
  logger.info('resultadoRequest DATA: %s', resultado)

  response = json_util.dumps(resultado)
  logger.info('Response HTTP_STATUS: %s', 200)
  logger.info('Response DATA: %s', response)
  return response

routes.append(dict(
    rule='declaraciones/catalogos/get_autocompletar',
    view_func=get_autocompletar))


def generar_match_query_institucion(governmentLevel,state,expresion):
  diccionario = {}
  expresion_dict = {}
  if(governmentLevel!=""):
    diccionario['governmentLevel'] = governmentLevel
  if(state!=""):
    diccionario['state'] = state

  expresion_dict["$regex"] = expresion
  expresion_dict["$options"] = "i"

  diccionario['institution'] = expresion_dict

  return diccionario

def generar_match_query_autocomplete(criterio,expresion):
  diccionario = {}
  expresion_dict = {}
  expresion_dict["$regex"] = expresion
  expresion_dict["$options"] = "i"

  diccionario[criterio] = expresion_dict

  return diccionario
