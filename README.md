# IRIS

IRIS ayuda a visualizar información de las declaraciones y contrataciones públicas de la [Plataforma Digital Nacional].

Es una herramienta para:
  - Analizar y visualizar tableros de los datos de declaraciones patrimoniales y contrataciones publicas bajo las especificaciones de la [Plataforma Digital Nacional].


### Tech

* [Node.js] 
* [ReactJS]
* [MongoDB]

### Install

- Iris requiere [Node.js](https://nodejs.org/) v4+
- Requiere docker + docker-compose
- Requiere de una base de datos MongoDB externa.
- Requiere un archivo .env con los valores de las variables de entorno correctamente seteadas.
    
   **.env**
    
```
    MONGO_URL=<mongodb conection string>
    MONGO_DB_NAME=<mongodb name string>
    SECRET_KEY=<Secret key app string>
```



#### Instalar las dependencias y compilar el proyecto

```sh
$ ./docker/install_build_app.sh
```

### Docker
Iris es muy simple de instalar y desplegar en un contenedor de Docker.

Scripts:

Iniciar el contenedor
```sh
$ docker-compose up
```
Re-compilar e iniciar el contenedor
```sh
 $ docker-compose up -d --build
```

* Tablero de declaraciones: http://localhost:3000/hubs/1/dashboards/5d7913d057186e024a40e059
* Tablero de contrataciones: http://localhost:3000/hubs/1/dashboards/5d795b7857186e024a40e05a

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen.)


   [git-repo-url]: <https://github.com/>
   [ReactJS]: <https://reactjs.org/>
   [MongoDB]: <https://www.mongodb.com>
   [Node.js]: <http://nodejs.org>
   [Plataforma Digital Nacional]: <https://www.plataformadigitalnacional.org/>