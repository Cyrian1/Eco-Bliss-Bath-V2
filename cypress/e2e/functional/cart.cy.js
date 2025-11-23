// cypress/e2e/functional/cart.cy.js

describe('Fonctionnel – Panier', () => {
    const apiUrl = Cypress.env('apiUrl')

    beforeEach(() => {
        cy.loginUI()
    })

    afterEach(() => {
        cy.get('[data-cy="nav-link-cart"]').click()

        cy.wait(500)

        cy.get('[data-cy="cart-line-delete"]').then(($btns) => {
            if ($btns.length > 0) {
                cy.wrap($btns).click({ multiple: true })
            }
        })
    })


    it("Ajout d'un produit en stock au panier et décrémentation du stock sur la fiche produit", () => {
        cy.request('GET', `${apiUrl}/products`).then((res) => {
            expect(res.status).to.eq(200)

            const product = res.body.find((p) => p.availableStock > 1)
            expect(product, 'produit avec stock > 1').to.exist

            const productId = product.id
            const productName = product.name

            // 1. Aller sur la fiche produit
            cy.visit(`/#/products/${productId}`)

            // 2. Laisser un peu de temps à Angular pour afficher le stock
            cy.wait(500)

            // 3. Lire le stock initial (texte du type "23 en stock")
            cy.get('[data-cy="detail-product-stock"]')
                .invoke('text')
                .then((stockText) => {
                    cy.log('Stock initial:', stockText)
                    const stockInitial = parseInt(stockText, 10)

                    expect(stockInitial).to.be.greaterThan(1)

                    // 4. Ajouter 1 au panier
                    cy.get('[data-cy="detail-product-quantity"]').clear().type('1')
                    cy.get('[data-cy="detail-product-add"]').click()

                    // 5. Vérifier dans le panier que le produit est présent
                    cy.get('[data-cy="nav-link-cart"]').click()
                    cy.contains(productName).should('exist')

                    // 6. Revenir sur la fiche produit
                    cy.visit(`/#/products/${productId}`)
                    cy.wait(500)

                    // 7. Lire le stock final et vérifier la décrémentation
                    cy.get('[data-cy="detail-product-stock"]')
                        .invoke('text')
                        .then((newStockText) => {
                            cy.log('Stock final:', newStockText)
                            const stockFinal = parseInt(newStockText, 10)
                            expect(stockFinal).to.eq(stockInitial - 1)
                        })
                })
        })
    })

    it('Gestion des limites de quantité : valeurs négatives et supérieures à 20', () => {
        cy.request('GET', `${apiUrl}/products`).then((res) => {
            expect(res.status).to.eq(200)

            const product = res.body.find((p) => p.availableStock > 0)
            expect(product, 'produit avec stock > 0').to.exist

            const productId = product.id

            cy.visit(`/#/products/${productId}`)
            cy.wait(500)

            // Quantité négative
            cy.get('[data-cy="detail-product-quantity"]').clear().type('-1')
            cy.get('[data-cy="detail-product-add"]').click()

            // Quantité > 20
            cy.get('[data-cy="detail-product-quantity"]').clear().type('999')
            cy.get('[data-cy="detail-product-add"]').click()
        })
    })
})
