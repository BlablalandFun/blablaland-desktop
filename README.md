[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)

![Nombre de téléchargements](https://img.shields.io/github/downloads/BlablalandFun/blablaland-desktop/total)

# Blablaland Desktop

C'est un "launcher" permettant de jouer à Blablaland à travers un logiciel qui contient le runtime **Flash Player**.

Launcher basé sur celui de [Panfu Desktop](https://github.com/teampanfu/panfu-desktop) mais fortement modifié pour intégrer la page de connexion.


## Jouer en solo / Tester le jeu

Un autre développeur [@Feavy](https://github.com/Feavy) a modifié ce launcher pour y intégrer un serveur solo : [@Feavy/blablaland-singleplayer](https://github.com/feavy/blablaland-singleplayer)


## Lancer le launcher sur une autre URL

```
[executable] --target={URL}
```

Exemple (Windows): ``Blablaland-Desktop-1.1.2.exe --target=http://127.0.0.1/``


## Installation 

Installation du projet via **npm**

```bash 
  git clone https://github.com/Yovach/blablaland-desktop.git
  npm install
```

Build le launcher

```bash 
  npm run pack
```

    
## Technologies utilisées

**Launcher:** Electron.js\
**CI/CD:** Github Actions

  
## FAQ

#### Est-ce un virus ?

**Non**.\
Blablaland.fun a toujours été un serveur où nous avons fait notre maximum pour respecter votre vie privée et en vous protégeant un maximum des problématiques de sécurité. 

Voici les raisons de pourquoi votre anti-virus peut les détecter comme "indésirables" :
- les applications ne sont pas signées donc votre anti-virus peut les détecter comme "indésirables" (à priori)
La licence Apple (pour signer) coûte $100 par an et celle de Microsoft coûte $179 (a priori).
- l'autre raison est que le logiciel n'a pas été téléchargé beaucoup de fois !

En espérant que vous comprendrez pourquoi elles ne sont pas signées :)

#### Puis-je utiliser ce launcher pour mon rétro ?

Faites en ce que vous voulez.


  
## Support

Si vous rencontrez un quelconque problème, merci d'envoyer un message sur notre serveur [Discord](https://discord.gg/DARMqsW).
