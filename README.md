# IRIS

IRIS ayuda a visualizar información de las declaraciones y contrataciones públicas de la [Plataforma Digital Nacional].

Es una herramienta para:
  - Analizar y visualizar tableros de los datos de declaraciones patrimoniales y contrataciones publicas bajo las especificaciones de la [Plataforma Digital Nacional].

## Requerimientos

* [Node.js] 
* [ReactJS]
* [MongoDB] (Base de datos externa)
* [Docker] + [Docker Compose]

## Configuración inicial

1. Configurar archivo .env para el frontend ```client/.env```

```
REACT_APP_HOST=<IP_HOST>:<PORT>
```
2. Configurar archivo .env para el backend ```.env```

```
MONGO_URL=<mongodb conection string>
MONGO_DB_NAME=<mongodb name string>
SECRET_KEY=<Secret key app string>
```
## Ejecutar proyecto

El presente manual utiliza ```yarn``` como administrador de modulos de node, pero en caso de requerirse se puede utilizar ```npm```.

La instalación de dependencias de [Node.js] puede tomar algunos minutos.

* [Ejecución utilizando docker-compose](#run_with_docker)
* [Ejecución sin docker-compose (node.js)](#run_without_docker)
* [Ejecución en modo desarrollador (node.js)](#run_node)

### <a name="run_with_docker"></a>Ejecución utilizando docker-compose

Instalar y compilar dependecias

```sh
$ ./docker/install_build_app.sh
```

Iniciar el contenedor [Docker] 
```sh
$ docker-compose up
```

Re-compilar e iniciar el contenedor [Docker]
```sh
 $ docker-compose up --build
```

_Para correr el contenedor en segundo plano utilizar el parametro ```-d```_

### <a name="run_without_docker"></a>Ejecución sin docker-compose (node.js)
1. Instalar y compilar dependecias

```sh
$ ./docker/install_build_app.sh
```

2. Ejecutar proyecto
```sh
$ yarn start-server-lib
```

### <a name="run_node"></a>Ejecución en modo desarrollador (node.js)
1. Instalar y compilar dependecias

```sh
$ ./docker/install_build_app.sh
```

2. Ejecutar servidor en modo desarrollo
```sh
$ yarn start-server-dev
```
El cliente se ejecutará en ```localhost:3006```

3. Ejecutar cliente
```sh
$ cd client
$ yarn start
```
El cliente se ejecutará en ```localhost:3006```

## Tableros

* Tablero de contrataciones: 
```http
http://<IP_HOST>:<PORT>/hubs/1/dashboards/5d795b7857186e024a40e05a
```

* Tablero de declaraciones: 
```http
http://<IP_HOST>:<PORT>/hubs/1/dashboards/5d7913d057186e024a40e059
```

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen.)


   [git-repo-url]: <https://github.com/>
   [ReactJS]: <https://reactjs.org/>
   [MongoDB]: <https://www.mongodb.com>
   [Node.js]: <http://nodejs.org>
   [Plataforma Digital Nacional]: <https://www.plataformadigitalnacional.org/>
   [Docker]: <https://www.docker.com/>
   [Docker Compose]: <https://docs.docker.com/compose/>