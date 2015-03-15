# Code of war 2015
====

Plateforme relative à l'édition 2015 de Code of War

## Prérequis
Pour installer le serveur il vous faut nodejs et npm
https://nodejs.org/


## Installation

* Installer le serveur

```shell
npm install codeofwar
```

* Lancer le serveur

```shell
cd node_modules/codeofwar/
node js/release/Server.js 
```

* Mettre à jour le serveur

```shell
npm update codeofwar
```

Une fois le serveur démarré, vous pouvez vous rendre sur http://localhost:3000/

## Les regles du jeu

Le but du jeu est de parcourir un labyrinthe pour attraper le premier le poulet.


## Développer sa propre IA

Vous pouvez coder votre IA dans le langage de votre choix dans la mesure où il peut établir une connection socket.

### Documentation
http://www.codeofwar.net/api/modules/Server.html

### Se connecter au serveur
La connection au serveur se fait en socket sur le port 8127.

Les messages sont échangés en JSON sérializé en String et séparés par la chaine #end#

Une fois la connection avec le Serveur établie, il faut lui envoyer un messsage d'Authentification.

```javascript
{
    type:'authenticate'
    name:'monIa'
    avatar:'http://monsite/monavatar.jpg'
}
```

Le serveur répondra avec un message renvoyant l'ID de l'IA ou un message d'erreur.


```javascript
{
    type:'id'
    id:3254898715
}
```