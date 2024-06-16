describe("Registration works", ()=>{
    it("testing registration", ()=>{
      const uniqueSuffix = Date.now(); // get the current timestamp
      const username = `TesterMartina${uniqueSuffix}`;
      const email = `testerMartina${uniqueSuffix}@test.de`
      cy.visit("http://localhost:3000/authUser/register")
      cy.get("form")
      cy.get("#vorname")
      .wait(3000) // wait for 1 second
      .focus()
      .type("Martina")
      .should('have.value', "Martina")
      cy.get("#nachname")
      .type("Tester")
      .should('have.value', "Tester")
      cy.get("#username")
      .type(username)
      .should('have.value', username)
      cy.intercept('POST', '/api/auth/unique').as('validate');
      cy.wait(3000)
      cy.wait('@validate');
      cy.get('.errors').should('not.be.visible');
      cy.get('#email')
      .type(email)
      .should('have.value', email)
      cy.intercept('POST', '/api/auth/unique').as('validate');
      cy.wait(6000)
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