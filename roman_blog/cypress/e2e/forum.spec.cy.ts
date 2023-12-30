describe('test the functionallity of forum', ()=>{
    beforeEach(()=>{
        cy.visit('http://localhost:3000/forum')
    })
    it('buttons should exactly redirect', ()=>{
        cy.get('body > div > div.page_container__FyR_C > div.page_linklistWrapper__x5JFQ > ul > li:nth-child(1)')
        .click()
        cy.url({timeout:10000}).should('contain', 'HTML')
        cy.go('back')
        cy.get('body > div > div.page_container__FyR_C > div.page_linklistWrapper__x5JFQ > ul > li:nth-child(2)')
        .click()
        cy.url({timeout:10000}).should('contain', 'CSS')
        cy.go('back')
        cy.get('body > div > div.page_container__FyR_C > div.page_linklistWrapper__x5JFQ > ul > li:nth-child(3)')
        .click()
        cy.url({timeout:10000}).should('contain', 'JavaScript')
        cy.get("a[href*='JavaScript']")
        .should('have.length.greaterThan', 0)
        cy.get("a[href*='Html']")
        .should('have.length.lessThan', 1)
        cy.get("a[href*='Css']")
        .should('have.length.lessThan', 1)
        cy.request('http://localhost:3000/api/forum').then((response)=>{
            const forumentrys = JSON.parse(response.body)
            expect(forumentrys).to.have.length(5)
            cy.wrap(forumentrys)
            .each((forumentry)=>{
                cy.get('body').then(($body) => {
                    //@ts-ignore
                    if ($body.find(`a[data-testid = ${forumentry._id}]`).length > 0) {   //only proceed if the element is found
                        //@ts-ignore
                        cy.get(`a[data-testid = ${forumentry._id}]`)
                        .click({multiple:true})
                        //@ts-ignore
                        cy.url({timeout:10000}).should('contain', forumentry._id)
                        cy.go('back')
                    }
                })
            })  
        })
    })
})