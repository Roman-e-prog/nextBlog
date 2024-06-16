describe("blogpost should be rendered and redirect to the correct id", ()=>{
    it("blogpost should have the correct length",()=>{
        cy.request('/api/blogPosts').then((response)=>{
            const blogPosts = JSON.parse(response.body);
            expect(blogPosts).to.have.length(8)
            cy.visit('http://localhost:3000/blog')
            cy.wrap(blogPosts)
            .each((blogPost)=>{
                //@ts-ignore
                cy.get(`a[data-testid = ${blogPost._id} ]`)
                .click({multiple:true})
                //@ts-ignore
                cy.url({timeout:80000}).should('contain', blogPost._id)
                cy.go('back') 
            })
        })
    })
})