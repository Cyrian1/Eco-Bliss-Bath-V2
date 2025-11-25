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

    it('GET /orders sans être connecté devrait renvoyer 403', () => {
        cy.request({
            method: 'GET',
            url: `${apiUrl}/orders`,
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(403)
        })
    })

    it('GET /orders après login renvoie soit une commande (200), soit 404 s’il n’y en a pas', () => {
        cy.loginApi()

        cy.get('@authToken').then((token) => {
            cy.request({
                method: 'GET',
                url: `${apiUrl}/orders`,
                failOnStatusCode: false,
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

    it("PUT /orders/add - impossible d'ajouter un produit en rupture de stock", () => {
        const apiUrl = Cypress.env('apiUrl')

        cy.loginApi()

        cy.get('@authToken').then((token) => {
            // 2. Recherche d'un produit en rupture de stock
            cy.request('GET', `${apiUrl}/products`).then((res) => {
                expect(res.status).to.eq(200)

                const productOutOfStock = res.body.find(
                    (product) => product.availableStock <= 0
                )

                // Si aucun produit en rupture, on log et arrête proprement le test
                if (!productOutOfStock) {
                    cy.log(
                        'Aucun produit avec availableStock <= 0, test non applicable dans cet environnement.'
                    )
                    return
                }

                // 3. Tentative d'ajout de ce produit en rupture dans le panier
                cy.request({
                    method: 'PUT',
                    url: `${apiUrl}/orders/add`,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    failOnStatusCode: false, // on veut justement capter une erreur
                    body: {
                        product: productOutOfStock.id,
                        quantity: 1,
                    },
                }).then((addRes) => {
                    // 4. Comportement attendu : ce ne doit PAS être possible → erreur 4xx
                    expect(
                        addRes.status,
                        `ATTENDU une erreur 4xx pour un produit en rupture (id=${productOutOfStock.id}, stock=${productOutOfStock.availableStock}) — OBTENU: ${addRes.status}`
                    ).to.be.within(400, 499)
                })
            })
        })
    })



})
