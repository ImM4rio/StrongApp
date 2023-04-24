# FASE DE IMPLANTACIÓN

## Manual técnico:

### Información relativa al despliegue: 

* Máquina virtual en servidor nginx
* Ubuntu 22.04 LTS
* En el servidor creado se abre el puerto SSH (18022) a internet.
* Se instala la versión correspondiente de nodejs @16.x con:<br>
```
    cd~
    culr -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh
    nano nodesource_setup.sh
    sudo bash nodesource_setup.sh
    sudo apt-get install -y nodejs gss g++ make
```
* A continuación configuramos npm para que no haga falta usar sudo en la instalación y el usuario actual tenga acceso a la carpeta instalada:<br>
```
    npm config set prefix '~/.local/'
    mkdir -p ~/.local/bin
    echo 'export PATH=~/.local/bin/:$PATH' >> ~/.bashrc
```
* Instalamos la versión deseada de meteor, en este caso la versión compatible es la @2.7.3
```
    npm install -g meteor@2.7.3
    echo 'export PATH=~/.meteor:$PATH' >> ~/.bashrc
    source ~/.bashrc 
```
* Comprimimos la carpeta de la instalación con 7zip y la descomprimimos en el home del usuario creado en el servidor.
* Instalamos mongoDb, service "enable" y "start"
```
    wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee -a /etc/apt/sources.list.d/mongodb-org-6.0.list
```
* Se hace mongoDump y mongoRestore sobre la base de datos para migrar los datos a la nueva base de datos.

* Se configura nginx para que funcione en modo proxy inverso.
```
    sudo nano /etc/nginx/sites-available/strongapp
```

    map $http_upgrade $connection_upgrade {
        default upgrade;
        ''      close;
    }

    server {
        listen 80;
        listen [::]:80;<br>
        server_name strongapp.adrivillab.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Host $server_name;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Upgrade $http_upgrade; #for websockets
        proxy_set_header Connection $connection_upgrade;
        proxy_read_timeout 90;
        proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
```
    sudo ln -s /etc/nginx/sites-available/strongapp /etc/nginx/sites-enabled/strongapp
    sudo systemctl reload nginx
```
* Finalmente se exporta la variable de mongoDb
```
    export MONGO_URL=mongodb://127.0.0.1:27017/StrongApp
```
### Información relativa a la administración del sistema, es decir, tareas que se deben realizar una vez que el sistema esté funcionando:

* La gestión de usuarios se llevará a cabo a través de una de las librerías de Meteor que gestiona el registro y las duplicidades en la base de datos además de la gestión de las contraseñas.
* La gran parte de la seguridad de esta aplicación se basa en el sistema de publicaciones y suscripciones que forman parte del framework usado, no se enviará nada al cliente ni se dejará acceder a ninguno de los datos que no se haya descrito previa e implícitamente en los métodos de la parte del servidor.
* Los errores consecuencia de un acceso denegado, o del tratamiento incorrecto de los datos se pasarán en modo de Meteor.Error() al cliente para exponer el tipo de error y el motivo de este.
* Los errores consecuencia de un uso incorrecto se pasarán en modo de mensaje en la parte superior de la web al usuario.

### Información relativa al matenimiento del sistema: 

* El mantenimiento por el momento se realiza a partir de los errores reportados por los usuarios actuales de la aplicación a través del formulario de contacto o bien por contacto directo.
* Por supuesto se podrían añadir nuevas funcionalidades que por falta de tiempo no se han podido llevar a cabo todavía como por ejemplo una calculadora de porcentajes (que se usa con frecuencia a la hora de practicar halterofilia), mayor posibilidades de interactuación con el Bot de telegram o mejoras en la comunidad....


## Manual de usuario

* No será necesario ninguna clase de formación específica para los usuarios a excepción del bot de Telegram que necesita un argumento en el mensaje para devolver lo deseado.
