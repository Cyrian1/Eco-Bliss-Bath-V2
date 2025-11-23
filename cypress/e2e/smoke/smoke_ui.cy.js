describe('Smoke UI', () => {
    it('Présence des champs et du bouton de connexion', () => {
        cy.visit('/')

        cy.get('[data-cy="nav-link-login"]').click()

        cy.get('[data-cy="login-input-username"]').should('be.visible')
        cy.get('[data-cy="login-input-password"]').should('be.visible')
        cy.get('[data-cy="login-submit"]').should('be.visible')
    })

    it('Présence du bouton ajouter au panier et du stock sur une fiche produit', () => {
        cy.loginUI()

        // On part de la home
        cy.visit('/')

        // On prend un produit de la home et on clique sur "Consulter"
        cy.get('[data-cy="product-home"]').first().within(() => {
            cy.get('[data-cy="product-home-link"]').click()
        })

        // Sur la fiche produit : présence du stock + bouton ajouter
        cy.get('[data-cy="detail-product-stock"]').should('be.visible')
        cy.get('[data-cy="detail-product-add"]').should('be.visible')
    })
})
