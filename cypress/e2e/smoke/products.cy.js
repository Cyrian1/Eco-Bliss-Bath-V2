describe('Smoke - Affichage des produits (page produits)', () => {
    beforeEach(() => {
        cy.loginUI()
    })

    it('Vérifie le chargement de la page produits et l’affichage des infos de chaque produit', () => {
        // 1. Depuis la home, aller sur la page "Produits"
        cy.visit('/')
        cy.get('[data-cy="nav-link-products"]').click()

        // 2. Vérifier que la page s’est bien chargée
        cy.url().should('include', '#/products')

        // 3. Vérifier qu’au moins un produit est présent
        cy.get('[data-cy="product"]').should('have.length.at.least', 1)

        // 4. Vérifier l’affichage de CHAQUE produit
        cy.get('[data-cy="product"]').each(($product) => {
            // Image
            cy.wrap($product)
                .find('[data-cy="product-picture"]')
                .should('be.visible')

            // Nom
            cy.wrap($product)
                .find('[data-cy="product-name"]')
                .should('not.be.empty')

            // Ingrédients / description
            cy.wrap($product)
                .find('[data-cy="product-ingredients"]')
                .should('not.be.empty')

            // Prix
            cy.wrap($product)
                .find('[data-cy="product-price"]')
                .should('not.be.empty')

            // Bouton "Consulter"
            cy.wrap($product)
                .find('[data-cy="product-link"]')
                .should('be.visible')
        })
    })
})
