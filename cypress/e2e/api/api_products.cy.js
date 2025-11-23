describe('API - Produits', () => {
    const apiUrl = Cypress.env('apiUrl')

    it('GET /products/{id} renvoie la fiche produit attendue', () => {
        const productId = 1

        cy.request('GET', `${apiUrl}/products/${productId}`).then((response) => {
            expect(response.status).to.eq(200)

            // Structure minimale d’un produit à vérifier
            expect(response.body).to.have.property('id', productId)
            expect(response.body).to.have.property('name')
            expect(response.body).to.have.property('description')
            expect(response.body).to.have.property('price')
            expect(response.body).to.have.property('stock')
        })
    })
})
