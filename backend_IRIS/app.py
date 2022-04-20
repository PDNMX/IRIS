from flask import Flask,request, jsonify, Response
from flask_cors import CORS
from database.db import initialize_db
from resources import mod
import logging

#Ejecutar Flask
app = Flask(__name__)
CORS(app)
app.register_blueprint(mod, url_prefix='/api')
mongo = initialize_db(app)
logging.basicConfig(filename='record.log', level=logging.DEBUG, format=f'%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s')


@app.errorhandler(404)
def not_found(error_None):
    app.logger.info('Request URL: %s', request.url)
    app.logger.info('Request BODY: %s', request.get_data())
    response = jsonify( {
        'message':'Recurso no encontrado ' + request.url,
        'status': 404
    })
    response.status_code = 404
    app.logger.info('Response Http Status: %s', response.status_code)

    return response

if __name__ == "__main__":
    import logging
    logging.basicConfig(filename='record.log', level=logging.DEBUG, format=f'%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s')
    app.run(host='0.0.0.0')