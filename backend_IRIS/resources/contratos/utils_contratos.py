from flask import Response, request
from bson  import json_util
from bson.json_util import dumps
from database.db import mongo
import json, datetime

def generar_match_query_dates(fecha_inicio,fecha_fin):
  diccionario = {}
  date_time_dict = {}
  match_dict = {}
  if(fecha_inicio=="" or fecha_fin==""):
    return ""

  if(fecha_inicio!=""):
    diccionario['$gte'] = fecha_inicio
  if(fecha_fin!=""):
    diccionario['$lte'] = fecha_fin
  date_time_dict['datetime'] = diccionario
  match_dict['$match'] = date_time_dict

  return match_dict

def generar_query_match(fecha_inicio,fecha_fin,maximo,valor):
  diccionario = {}
  diccionario_limites = {}
  date_time_dict = {}
  match_dict = {}
  if(fecha_inicio=="" or fecha_fin==""):
    return ""

  if(fecha_inicio!=""):
    diccionario['$gte'] = fecha_inicio
  if(fecha_fin!=""):
    diccionario['$lte'] = fecha_fin
  date_time_dict['datetime'] = diccionario

  diccionario_limites["$gte"]=1
  diccionario_limites["$lte"]=maximo
  date_time_dict[valor] = diccionario_limites

  date_time_dict["status"] = "Datos completos"
  match_dict['$match'] = date_time_dict
  return match_dict

def generar_match_query_initial_date(fecha_inicio,fecha_fin):
  diccionario = {}
  date_time_dict = {}
  match_dict = {}
  if(fecha_inicio=="" or fecha_fin==""):
    return ""

  if(fecha_inicio!=""):
    diccionario['$gte'] = fecha_inicio
  if(fecha_fin!=""):
    diccionario['$lte'] = fecha_fin
  date_time_dict['initialDate'] = diccionario
  match_dict['$match'] = date_time_dict

  return match_dict

def generar_match_query_percentage(fecha_inicio,fecha_fin,porcentaje_inicial,porcentaje_final):
  diccionario = {}
  date_time_dict = {}
  porcentaje_dict = {}
  match_dict = {}
  if(fecha_inicio=="" or fecha_fin==""):
    return ""

  if(fecha_inicio!=""):
    diccionario['$gte'] = fecha_inicio
  if(fecha_fin!=""):
    diccionario['$lte'] = fecha_fin

  porcentaje_dict['$gte'] = int(porcentaje_inicial)
  porcentaje_dict['$lte'] = int(porcentaje_final)

  date_time_dict["percentage"] =porcentaje_dict
  date_time_dict['datetime'] = diccionario

  match_dict['$match'] = date_time_dict

  return match_dict