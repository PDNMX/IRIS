from flask_pymongo import PyMongo
import os

mongo = PyMongo()

def initialize_db(app):
  #app.config["MONGO_URI"] = "mongodb://"+os.environ['MONGODB_HOSTNAME']+":27017/knot"
  app.config["MONGO_URI"] = "mongodb://mongodb:27017/iris"
  mongo.init_app(app)
