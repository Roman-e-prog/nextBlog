describe("Registration works", ()=>{
    it("testing registration", ()=>{
      cy.visit("http://localhost:3000/authUser/register")
      cy.get("form")
      cy.get("#vorname")
      .type("Martin")
      .should('have.value', "Martin")
      cy.get("#nachname")
      .type("Test")
      .should('have.value', "Test")
      cy.get("#username")
      .type("TesterMartin")
      .should('have.value', "TesterMartin")
      cy.intercept('POST', '/api/auth/unique').as('validate');
      cy.wait('@validate');
      cy.get('.errors').should('not.be.visible');
      cy.get("#email")
      .type("testerMartin@test.de")
      .should('have.value', "testerMartin@test.de")
      cy.intercept('POST', '/api/auth/unique').as('validate');
      cy.wait('@validate');
      cy.get('.errors').should('not.be.visible');
      cy.get("#password")
      .type("123456")
      .should('have.value', "123456")
      cy.get("#passwordValidation")
      .type("123456")
      .should('have.value', "123456")
      cy.get("#sendBtn")
      .should('be.visible')
      .and('be.enabled')
      .click()
      cy.url({timeout:10000}).should('include', '/authUser/login')
    })
  })