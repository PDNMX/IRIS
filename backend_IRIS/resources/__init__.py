from flask import Blueprint

mod = Blueprint('resources', __name__)

@mod.route('/')
def home():
    return 'home'

#Ruteos de contratos
from .contratos.red_flag_uno    import routes as contratos_red_flag_uno_routes
from .contratos.red_flag_dos    import routes as contratos_red_flag_dos_routes
from .contratos.red_flag_tres   import routes as contratos_red_flag_tres_routes
from .contratos.red_flag_cuatro import routes as contratos_red_flag_cuatro_routes
from .contratos.red_flag_cinco  import routes as contratos_red_flag_cinco_routes



#Ruteos de declaraciones
from .declaraciones.composiciones import routes as declaraciones_composiciones_routes
from .declaraciones.lista_servidores_publicos import routes as declaraciones_lista_servidores_publicos_routes
from .declaraciones.servidor_publico import routes as declaraciones_servidor_publico_routes
from .declaraciones.general import routes as declaraciones_general_routes
from .declaraciones.catalogos import routes as declaraciones_catalogos_routes



routes = (
    contratos_red_flag_uno_routes +
    contratos_red_flag_dos_routes +
    contratos_red_flag_tres_routes +
    contratos_red_flag_cuatro_routes +
    contratos_red_flag_cinco_routes  +
    declaraciones_composiciones_routes +
    declaraciones_lista_servidores_publicos_routes +
    declaraciones_servidor_publico_routes +
    declaraciones_general_routes +
    declaraciones_catalogos_routes
    )

for r in routes:
    mod.add_url_rule(
        r['rule'],
        endpoint=r.get('endpoint', None),
        view_func=r['view_func'],
        methods=['POST'])