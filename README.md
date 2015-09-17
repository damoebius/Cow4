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

## Interface de combat d'IA

Connectez vous sur http://localhost:3000/

Cette page liste les IA connectées au serveur. Vous pouvez en selectionner deux et lancer un combat.
Une nouvelle page affiche alors la partie entre les deux IA.


## Les regles du jeu

Le but du jeu est de parcourir un labyrinthe pour attraper le premier le poulet.
Les joueurs ont au maximum [200 tours](https://github.com/damoebius/Cow4/blob/master/src/com/tamina/cow4/model/GameConstants.hx) pour l'attraper.

### Tour de jeu

Les tours s'enchainent toujours dans le même ordre : joueur 1, joueur2, puis coq.

Tous les tours, un joueur gagne 1 point de mouvement (PM) qu'il peut conserver jusqu'à un maximum de [5 PM](https://github.com/damoebius/Cow4/blob/master/src/com/tamina/cow4/model/GameConstants.hx). Le coq ne peut pas cumuler ses PM.

Durant son tour, un joueur peut se déplacer vers une case voisine, et/ou ramasser un item, et/ou utiliser un item.
- Il peut se déplacer tant qu'il a un nombre de PM suffisant.
- Il peut utiliser autant d'item qu'il possède.
- Il ne peut pas se déplacer vers une case déjà occupée (sauf par le coq).

### Les items

*La potion d'invisibilité*

Utiliser une potion d'invisibilité va masquer la position du joueur au joueur adverse et au coq pendant [42 tours](https://github.com/damoebius/Cow4/blob/master/src/com/tamina/cow4/model/GameConstants.hx)

*Le piège*

Utiliser un piège va le déposer sur la case courante. Si un joueur ou le coq tombent dedans, ils ne pourront plus bouger pendant [10 tours](https://github.com/damoebius/Cow4/blob/master/src/com/tamina/cow4/model/GameConstants.hx)

*Le parfum de poulette*

Utiliser cet item va offrir au coq un bonus de [10 PM](https://github.com/damoebius/Cow4/blob/master/src/com/tamina/cow4/model/GameConstants.hx)

## Développer sa propre IA

Vous pouvez coder votre IA dans le langage de votre choix dans la mesure où il peut établir une connection socket.

Quelques SDK Open Source sont disponibles ici https://github.com/damoebius/Cow4_SDK

### Documentation
http://www.codeofwar.net/api/modules/Server.html

### Se connecter au serveur
La connection au serveur se fait en socket sur le port 8127.

Les messages sont échangés en JSON sérializé en String et séparés par la chaine #end#

Une fois la connection avec le Serveur établie, il faut lui envoyer un messsage d'Authentification.

```javascript
{
    "type":"authenticate",
    "name":"monIa",
    "avatar":"http://monsite/monavatar.jpg",
    "token":"yourtokenifone",
    "profil":1
    
}
```
Vous pouvez, ou non, précisez le token qui vous a été communiqué lors de votre inscription. Celà serait necessaire uniquement pour la phase de qualification.

Vous devez par contre choisir le [profil](https://github.com/damoebius/Cow4/blob/master/src/com/tamina/cow4/model/Profil.hx) de votre IA, sachant que :

- le MASTER_OF_COINS est immunisé contre les pieges
- le TECH_WIZARD est immunisé contre la potion d'invisibilité
- le HAND_OF_THE_KING immunise le poulet contre le parfum de poulette.

Le serveur répondra avec un message renvoyant l'ID de l'IA ou un message d'erreur.


```javascript
{
    "type":"id",
    "id":3254898715
}
```

### Combat d'IA

Lorsque c'est à son tour de jouer, le server envoit à l'IA un message GetTurnOrder

```javascript
{
    "type":"getTurnOrder",
    "data":{
        // GameMap Object
    }
}
```

Ce message contient toutes les informations relatives à la partie.
L'IA doit répondre en moins d'une seconde, un message de type TurnResult

```javascript
{
    "type":"turnResult",
    "ia":{
        // IAInfo Object, contient les info sur l'auteur du tour
    },
    "actions":[
        {} // TurnAction Object, une action à exécuter
    ]
}
```
Reportez vous à la documentation de l'API pour plus de détails

http://www.codeofwar.net/api/modules/Server.html

### Le labyrinthe


![Alt la map](https://github.com/damoebius/Cow4/raw/master/html/server/images/map.png "La map")

### L'IA du poulet

A son premier tour, le poulet va foncer vers la case tout à gauche.

![Alt premier coup](https://github.com/damoebius/Cow4/raw/master/html/server/images/firstmove.png "Premier coup")

A partir de ce moment, l'ia va commencer pour calculer le chemin le plus rapide pour atteindre ses deux adversaires

![Alt scan ia](https://github.com/damoebius/Cow4/raw/master/html/server/images/findIa.png "recherche ia")

Ensuite elle va chercher la premiere intersection disponible sans emprunter une route vers une IA.

![Alt goto intersection](https://github.com/damoebius/Cow4/raw/master/html/server/images/fondItersection.png "goto intersection")

Et elle y va.
Arrivée là-bas elle analyse à nouveau la situation.
