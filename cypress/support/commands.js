// Connexion via l'UI
Cypress.Commands.add('loginUI', () => {
    cy.fixture('user').then(({ validUser }) => {
        cy.visit('/')

        cy.get('[data-cy="nav-link-login"]').click()

        cy.get('[data-cy="login-input-username"]').clear().type(validUser.username)
        cy.get('[data-cy="login-input-password"]').clear().type(validUser.password)
        cy.get('[data-cy="login-submit"]').click()

        // On NE RESSORT de la commande qu'une fois connecté
        cy.get('[data-cy="nav-link-cart"]').should('be.visible')
    })
})



// Connexion via l'API
Cypress.Commands.add('loginApi', () => {
    const apiUrl = Cypress.env('apiUrl')

    cy.fixture('user').then(({ validUser }) => {
        cy.request('POST', `${apiUrl}/login`, {
            username: validUser.username,
            password: validUser.password,
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('token')

            const token = response.body.token
            cy.wrap(token).as('authToken')
        })
    })
})


