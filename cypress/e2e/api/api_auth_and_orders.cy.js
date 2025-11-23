describe('API - Auth & Orders', () => {
    const apiUrl = Cypress.env('apiUrl')

    //
    // 1. Tests LOGIN
    //

    it('POST /login - utilisateur valide retourne 200 et un token', () => {
        cy.fixture('user').then(({ validUser }) => {
            cy.request('POST', `${apiUrl}/login`, {
                username: validUser.username,
                password: validUser.password,
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.have.property('token')
            })
        })
    })

    it('POST /login - credentials invalides renvoient 401', () => {
        cy.fixture('user').then(({ invalidUser }) => {
            cy.request({
                method: 'POST',
                url: `${apiUrl}/login`,
                body: {
                    username: invalidUser.username,
                    password: invalidUser.password,
                },
                failOnStatusCode: false, // pour pouvoir vérifier le 401
            }).then((response) => {
                expect(response.status).to.eq(401)
            })
        })
    })

    //
    // 3. Tests GET /orders
    //

    it('GET /orders sans être connecté devrait renvoyer 403 (mais renvoie 401 en réalité)', () => {
        cy.request({
            method: 'GET',
            url: `${apiUrl}/orders`,
            failOnStatusCode: false, // on s’attend à un 4xx
        }).then((response) => {
            // COMPORTEMENT MÉTIER ATTENDU : 403 (forbidden)
            // COMPORTEMENT OBSERVÉ : 401 (unauthorized)
            // -> le test sera rouge, et tu le décris comme anomalie dans le bilan.
            expect(response.status).to.eq(403)
        })
    })

    it('GET /orders après login renvoie soit une commande (200), soit 404 s’il n’y en a pas', () => {
        cy.loginApi()

        cy.get('@authToken').then((token) => {
            cy.request({
                method: 'GET',
                url: `${apiUrl}/orders`,
                failOnStatusCode: false, // 200 ou 404
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((response) => {
                expect([200, 404]).to.include(response.status)

                if (response.status === 200) {
                    // Vérification de la structure de la commande
                    expect(response.body).to.have.property('id')
                    expect(response.body).to.have.property('firstname')
                    expect(response.body).to.have.property('lastname')
                    expect(response.body).to.have.property('orderLines')
                    expect(response.body.orderLines).to.be.an('array')
                }
            })
        })
    })

    //
    // 3. Tests PUT /orders/add
    //

    it('PUT /orders/add - ajouter un produit disponible au panier', () => {
        const apiUrl = Cypress.env('apiUrl')

        cy.loginApi()

        cy.get('@authToken').then((token) => {
            // 1) On récupère la liste des produits
            cy.request('GET', `${apiUrl}/products`).then((productsResponse) => {
                expect(productsResponse.status).to.eq(200)

                const productInStock = productsResponse.body.find(
                    (p) => p.availableStock > 0
                )

                expect(productInStock, 'produit avec stock disponible').to.exist

                // 2) On ajoute ce produit au panier
                cy.request({
                    method: 'PUT',
                    url: `${apiUrl}/orders/add`,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: {
                        product: productInStock.id,
                        quantity: 1,
                    },
                }).then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body).to.have.property('orderLines')
                })
            })
        })
    })


    it('PUT /orders/add - produit en rupture de stock devrait renvoyer une erreur 4xx', () => {
        const apiUrl = Cypress.env('apiUrl')

        cy.loginApi()

        cy.get('@authToken').then((token) => {
            cy.request('GET', `${apiUrl}/products`).then((productsResponse) => {
                expect(productsResponse.status).to.eq(200)

                const productOutOfStock = productsResponse.body.find(
                    (p) => p.availableStock === 0
                )

                expect(productOutOfStock, 'produit en rupture de stock').to.exist

                cy.request({
                    method: 'PUT',
                    url: `${apiUrl}/orders/add`,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: {
                        product: productOutOfStock.id,
                        quantity: 1,
                    },
                    failOnStatusCode: false,
                }).then((response) => {
                    // Attendu métier : 4xx
                    expect(response.status).to.be.within(400, 499)
                })
            })
        })
    })
})
