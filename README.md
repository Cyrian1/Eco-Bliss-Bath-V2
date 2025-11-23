<div align="center">
Eco Bliss Bath – Suite de tests automatisés (Cypress)

Projet OpenClassrooms – Parcours QA Engineer

</div> <p align="center"> <img src="https://img.shields.io/badge/MariaDB-v11.7.2-blue"> <img src="https://img.shields.io/badge/Symfony-v6.2-blue"> <img src="https://img.shields.io/badge/Angular-v13.3.0-blue"> <img src="https://img.shields.io/badge/docker--build-passing-brightgreen"> </p>

1. Présentation du projet

Eco Bliss Bath est une application e-commerce de vente de produits de beauté écoresponsables.
Dans ce projet, le but est de mettre en place une suite de tests automatisés pour sécuriser les fonctionnalités critiques du tunnel d’achat.

Les tests ont été réalisés avec Cypress (JavaScript) et couvrent :

- les tests d’API,
- les smoke tests (UI),
- un test de faille XSS,
- les tests fonctionnels Connexion et Panier.

2. Prérequis

Pour démarrer cet applicatif web vous devez avoir les outils suivants:

- Docker
- NodeJs
- npm

3. Installation et démarrage

Clonez le projet pour le récupérer

```
git clone https://github.com/Cyrian1/Eco-Bliss-Bath-V2
cd Eco-Bliss-Bath-V2
```

Pour démarrer l'API avec sa base de données.

```
docker compose up -d
```

L’API est ensuite disponible sur :

```
http://localhost:8081
```

La documentation Swagger est disponible à :

```
http://localhost:8081/api/doc
```

5. Démarrer le frontend

Rendez-vous dans le dossier frontend

```
cd ./frontend
```

Installez les dépendances du projet

```
npm i
ou
npm install (si vous préférez)
```

L'application Angular sera accessible sur :

```
http://localhost:4200
```

6. Installation de Cypress

Depuis la racine du projet :

```
npm install
```

Puis lancer Cypress en mode interface :

```
npx cypress open
```

Choissisez E2E Testing, puis Chrome ou Electron

7. Structure des tests Cypress

```
cypress/
  e2e/
    api/
      api_auth_and_orders.cy.js
      api_products.cy.js
    smoke/
      smoke_ui.cy.js
      products.cy.js
    functional/
      login.cy.js
      cart.cy.js
    security/
      xss_reviews.cy.js
  fixtures/
    user.json
  support/
    commands.js
    e2e.js
cypress.config.js
```

8. Tests automatisés implémentés
Tests API

GET /orders sans authentification → refus d’accès

GET /orders authentifié → panier courant

GET /products/{id} → fiche produit

PUT /orders/add → ajout d’un produit en stock

PUT /orders/add → tentative d’ajout d’un produit en rupture

Smoke tests UI

Présence des champs / boutons dans le formulaire de connexion

Présence du bouton “Ajouter au panier”

Présence du champ “Stock / disponibilité”

Vérification complète de la page Produits (image, nom, description, prix, bouton consulter)

Test XSS

Injection <script>alert('XSS')</script> dans le formulaire d’avis

Vérification qu’aucun script n’est exécuté

Tests fonctionnels
Connexion :

Connexion d’un utilisateur valide

Vérification de la présence du bouton “Mon panier” après login

Panier :

Ajout d’un produit en stock

Vérification que le produit apparaît dans le panier

Vérification que le stock décrémente après ajout

Test limites : quantité négative, quantité > 20

9. Pourquoi ces deux tests fonctionnels (Connexion + Panier) ?

Le choix s’appuie sur les besoins métier :

La connexion est indispensable pour accéder au panier et permettre la commande.

Le panier est le cœur du modèle économique. Tout dysfonctionnement dessus a un impact direct sur les ventes.

Le troisième scénario (“affichage des produits”) a une importance UX, mais un impact commercial moindre.
En situation de ressources limitées, les scénarios Connexion et Panier sont donc prioritaires.

10. Exécuter tous les tests

Une fois Cypress ouvert via :

```
npx cypress open
```

11. Auteur

Projet réalisé par Cyrian Khaldi
