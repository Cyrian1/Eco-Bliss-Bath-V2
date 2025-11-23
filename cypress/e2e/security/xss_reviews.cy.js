describe('Sécurité - XSS sur la page Avis', () => {
    it('Un avis contenant du script ne doit pas exécuter de code', () => {
        cy.loginUI()

        // Depuis la page d’accueil, on va sur la page "Avis"
        cy.get('[data-cy="nav-link-reviews"]').click()

        const payload = `<script>alert('XSS')</script>`

        // On stub window.alert pour vérifier qu’il n’est jamais appelé
        cy.window().then((win) => {
            cy.stub(win, 'alert').as('alert')
        })

        // On met une note : clic sur la première étoile
        cy.get('[data-cy="review-input-rating-images"] img')
            .first()
            .click()

        // On remplit le titre et le commentaire avec une payload XSS dans le commentaire
        cy.get('[data-cy="review-input-title"]').clear().type('Test XSS')
        cy.get('[data-cy="review-input-comment"]').clear().type(payload)

        // On soumet le formulaire
        cy.get('[data-cy="review-submit"]').click()

        // On recharge la page pour simuler un affichage ultérieur de l’avis
        cy.reload()

        // Vérifier qu’aucun alert n’a été déclenché (faille XSS non active)
        cy.get('@alert').should('not.have.been.called')
    })
})
