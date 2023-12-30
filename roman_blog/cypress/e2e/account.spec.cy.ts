describe("test the account page", ()=>{
    beforeEach(()=>{
        cy.visit('/account/654f31d3556ed568e516d763')
    })
    it("test if all elements are there",()=>{
        cy.getTestid('deleteWrapper')
        .should('be.visible')
        cy.getTestid('fotoWrapper')
        .should('be.visible')
        cy.getTestid('userQuestions')
        .should('be.visible')
        cy.getTestid('userUpdate')
        .should('be.visible')
    })
})
