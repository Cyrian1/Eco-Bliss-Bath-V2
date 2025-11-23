describe('Fonctionnel - Connexion', () => {
    it('Un utilisateur valide peut se connecter et voir le bouton panier', () => {
        cy.loginUI()
        cy.get('[data-cy="nav-link-cart"]').should('be.visible')
    })
})
    