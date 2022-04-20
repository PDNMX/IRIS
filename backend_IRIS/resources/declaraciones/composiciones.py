from flask import Response, request
from bson  import json_util
from bson.json_util import dumps
from database.db import mongo
import json, datetime

routes = []

def get_analytic_declaraciones_aggregate_composiciones():
  data = request.get_json()
  datos =  data.get("datos")
  institucion =  data.get("institucion")
  estado =  data.get("estado")
  nivel_gobierno =  data.get("nivel_gobierno")
  match = generar_match_query(institucion,estado,nivel_gobierno)
  if(datos=="evolucion_ingresos"):
    if(match==""):
      query = [{"$group":{"_id":{"$year":"$_datetime"},"sueldos_salarios_otros_empleos":{"$sum":"$sueldos_salarios_otros_empleos"},"sueldos_salarios_publicos":{"$sum":"$sueldos_salarios_publicos"},"actividad_economica_menor":{"$sum":"$actividad_economica_menor"},"actividad_empresarial":{"$sum":"$actividad_empresarial"},"actividad_profesional":{"$sum":"$actividad_profesional"},"arrendamiento":{"$sum":"$arrendamiento"},"intereses":{"$sum":"$intereses"},"premios":{"$sum":"$premios"},"enajenacion_bienes":{"$sum":"$enajenacion_bienes"},"otros_ingresos":{"$sum":"$otros_ingresos"}}},
      { "$sort" : { "_id" : 1 } }]
    else:
      query = [match,{"$group":{"_id":{"$year":"$_datetime"},"sueldos_salarios_otros_empleos":{"$sum":"$sueldos_salarios_otros_empleos"},"sueldos_salarios_publicos":{"$sum":"$sueldos_salarios_publicos"},"actividad_economica_menor":{"$sum":"$actividad_economica_menor"},"actividad_empresarial":{"$sum":"$actividad_empresarial"},"actividad_profesional":{"$sum":"$actividad_profesional"},"arrendamiento":{"$sum":"$arrendamiento"},"intereses":{"$sum":"$intereses"},"premios":{"$sum":"$premios"},"enajenacion_bienes":{"$sum":"$enajenacion_bienes"},"otros_ingresos":{"$sum":"$otros_ingresos"}}},
      { "$sort" : { "_id" : 1 } }]
  if(datos=="evolucion_activos"):
    if(match==""):
      query = [{"$group":{"_id":{"$year":"$_datetime"},"bienes_inmuebles":{"$sum":"$bienes_inmuebles"},"bienes_muebles_no_registrables":{"$sum":"$bienes_muebles_no_registrables"},"bienes_muebles_registrables":{"$sum":"$bienes_muebles_registrables"},"bienes_intangibles":{"$sum":"$bienes_intangibles"},"inversiones_cuentas_valores":{"$sum":"$inversiones_cuentas_valores"},"efectivo_metales":{"$sum":"$efectivo_metales"},"fideicomisos":{"$sum":"$fideicomisos"},"cuentas_por_cobrar":{"$sum":"$cuentas_por_cobrar"},"uso_especie_propiedad_tercero":{"$sum":"$uso_especie_propiedad_tercero"}}},
      { "$sort" : { "_id" : 1 } }]
    else:
      query = [match,{"$group":{"_id":{"$year":"$_datetime"},"bienes_inmuebles":{"$sum":"$bienes_inmuebles"},"bienes_muebles_no_registrables":{"$sum":"$bienes_muebles_no_registrables"},"bienes_muebles_registrables":{"$sum":"$bienes_muebles_registrables"},"bienes_intangibles":{"$sum":"$bienes_intangibles"},"inversiones_cuentas_valores":{"$sum":"$inversiones_cuentas_valores"},"efectivo_metales":{"$sum":"$efectivo_metales"},"fideicomisos":{"$sum":"$fideicomisos"},"cuentas_por_cobrar":{"$sum":"$cuentas_por_cobrar"},"uso_especie_propiedad_tercero":{"$sum":"$uso_especie_propiedad_tercero"}}},
      { "$sort" : { "_id" : 1 } }]
  if(datos=="evolucion_pasivos"):
    if(match==""):
      query = [{"$group":{"_id":{"$year":"$_datetime"},"deudas":{"$sum":"$deudas"},"otras_obligaciones":{"$sum":"$otras_obligaciones"}}},
      { "$sort" : { "_id" : 1 } }]
    else:
      query = [match,{"$group":{"_id":{"$year":"$_datetime"},"deudas":{"$sum":"$deudas"},"otras_obligaciones":{"$sum":"$otras_obligaciones"}}},
      { "$sort" : { "_id" : 1 } }]
  resultado = mongo.db.analytic_declaraciones_brief.aggregate(query)
  response = json_util.dumps(resultado)
  return response

routes.append(dict(
    rule='declaraciones/composiciones/queries',
    view_func=get_analytic_declaraciones_aggregate_composiciones))

def get_analytic_declaraciones_distinct_composiciones():
  resultado = mongo.db.analytic_contracts_flag_1.aggregate(
     [{"$group":{"_id":None,"max":{"$max":"$duration"},"min":{"$min":"$duration"}}},
      { "$sort" : { "_id" : 1 } }]
     )
  response = json_util.dumps(resultado)
  return response

routes.append(dict(
    rule='declaraciones/composiciones/distinct',
    view_func=get_analytic_declaraciones_distinct_composiciones))

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