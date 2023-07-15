# API

Bienvenue sur l'API du projet GoodCollect.

Développée avec NestJS, un framework NodeJS permettant de développer un serveur avec Typescript.

Dans ce document, tu trouveras plusieurs informations :

- [Stack technique](#stack-technique)
- [Pré-requis](#pré-requis)
- [Architecture du projet](#architecture-du-projet)
- [Comment ajouter une nouvelle feature ?](#comment-ajouter-une-nouvelle-feature-)
- [Pour aller plus loin](#pour-aller-plus-loin)

## Stack technique

- [NestJS](https://nestjs.com/) pour le serveur et les routes
- [Prisma](https://www.prisma.io/) pour la base de données
- [Stripe](https://stripe.com/docs?locale=fr-FR) pour les paiements
- [Courier](https://www.courier.com/) pour envoyer des emails
- [Typescript](https://www.typescriptlang.org/)

## Architecture du projet

Le projet est découpé en plusieurs dossiers.

- Chaque dossier à l'intérieur de `src` correspond à un module.
  > Exemple : `src/auth` correspond au module d'authentification.
- Les fichiers `.service.ts` contiennent la logique métier. Toute la logique, que ça soit récupérer les données via l'API ou envoyer un mail se trouve dans ces fichiers.
- Les fichiers `.controller.ts` contiennent les routes. Définies par les verbes HTTP comme **GET** et **POST** , elles déclenchent les fonctions déclarées par les _services_.
- Les fichiers `.dto.ts` contiennent les interfaces. Elles permettent de typer les données. On déclare par exemple un modèle de donnée attendu par l'API. Si ce modèle n'est pas respecté, l'API n'exécute pas la méthode via le _controller_.
  > Example, pour créer un utilisateur :

```ts
/** create-user.dto.ts **/
import { IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsString()
  password: string;

  @IsString()
  firstname: string;

  @IsString()
  lastname: string;
}
```

- Les fichiers `.types.ts` permettent de forcer le type de certaines données. Prisma infère automatiquement les types de nos données provenant de la base. Nous n'allons pas souvent utiliser ces fichiers.
- Les fichiers `.module.ts` permettent de relier les différents fichiers entre eux. Par exemple, tous les services liés aux comptes **utilisateurs** seront liées aux controllers liés aux **utilisateurs**.

### Comment déclarer un nouveau module ?

Chaque module doit être ensuite importé dans le dossier `app.module.ts`. C'est le point d'entrée de l'application. La console de NestJS vous indique des erreurs claires si vous avez mal créé de nouveaux fichiers.

## Pré-requis

### Installe les dépendances

Avant de pouvoir lancer le projet, tu as besoin des dépendances suivantes :

- Installe [Git](https://git-scm.com) pour gérer les versions
- Installe [Node.js](https://nodejs.org) (version 18) pour exécuter Javascript
- Installe [VSCode](https://code.visualstudio.com) pour éditer le code
- Optionnel: Installe [Docker](https://www.docker.com)

Ensuite, tu auras besoin d'ajouter une clé SSH sur ton compte Github. [Gitlab propose un guide pour générer ta clé](https://docs.gitlab.com/ee/user/ssh.html#generate-an-ssh-key-pair)

### Clone le projet

Maintenant, tu peux cloner le projet. Ouvre ton terminal et exécute la commande suivante :

```sh
git clone git@github.com:GoodCollect/api.git
```

Tu vas ouvrir le projet dans VSCode. Lance cette commande dans ton terminal :

```sh
cd api
code .
```

### Prépare le projet

Tu as besoin d'installer toutes les librairies nécessaires pour faire fonctionner le projet.

Installe-les avec **NPM**. Dans ton terminal, lance la commande suivante :

```sh
npm install
```

Avant de lancer l'environnement de développement, tu dois faire une dernière manip.

Fais une copie du fichier `.env.example` et renomme-le en `.env`. Ce fichier contient les variables d'environnement nécessaires au projet.

Il n'est pas versionné pour des raisons de sécurité (il contient tous nos codes d'accès). Tu peux le demander à un membre de l'équipe.

> Tu as besoin de définir ces variables d'environnement pour lancer le projet. Sans les bonnes variables, le projet ne fonctionnera pas.

### Lance le projet

Pour lancer le projet, tu ouvres un terminal et tu exécutes la commande suivante :

```sh
npm run dev
```

Le site est accessible à l'adresse [http://localhost:3000](http://localhost:3000).

Il faut également lancer le projet Strapi pour accéder aux données statiques.

## Comment ajouter une nouvelle feature ?

### Retourne sur la branche `dev`

Généralement, tu vas créer une nouvelle branche pour chaque nouvelle feature. Pour ce faire, tu dois toujours t'assurer d'avoir le projet à jour.

Rend-toi sur la branch `dev` et récupère les dernières modifications :

```sh
git checkout dev
git pull
```

`git checkout dev` permet de se rendre sur la branche `dev`.
`git pull` permet de récupérer les dernières modifications de la branche.

### Crée une nouvelle branche

Maintenant, tu peux créer une nouvelle branche pour ta feature. Pour ce faire, tu peux utiliser la commande suivante :

```sh
git checkout -b feature/nom-de-la-feature
```

### Push ta branche

Après avoir fait tes modifications, tu peux push ta branche sur Github. Pour ce faire, tu peux utiliser la commande suivante :

```sh
git add . # ajoute tous les fichiers modifiés
git commit -m "feature/nom-de-la-feature: description de la feature"
git push origin feature/nom-de-la-feature
```

Ton terminal t'affichera un lien pour créer une pull request. Cela ressemble à ça :

```sh
remote: Resolving deltas: 100% (11/11), completed with 11 local objects.
remote:
remote: Create a pull request for 'dev' on GitHub by visiting:
remote:      https://github.com/GoodCollect/api/pull/new/dev
remote:
```

Clique sur le lien pour créer une pull request. Tu peux ensuite demander à un membre de l'équipe de la valider.

Tu penses avoir terminé la feature sans bug ? N'hésite pas à supprimer ta branche locale après avoir push ta branche.

Retourne sur la branche `dev` et supprime ta branche locale :

```sh
git checkout dev
git branch -D feature/nom-de-la-feature
```

N'oublie pas de récupérer les dernières modifications de la branche `dev` avant de créer une nouvelle branche.

```sh
git pull
```

## Pour aller plus loin

### Ressources

- [Doc NestJS](https://nestjs.com/)
- [Doc Stripe](https://stripe.com/docs/api)
- [Doc Prisma](https://www.prisma.io/docs/)
- [Doc Courier](https://www.courier.com/docs/)
