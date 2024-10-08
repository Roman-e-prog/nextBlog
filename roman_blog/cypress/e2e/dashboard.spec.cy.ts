
describe("test the crud functions of the dashboard", ()=>{
    beforeEach(()=>{
        cy.visit('/dashboard')
    })
    it("test the uebermich", ()=>{
        cy.request('/api/ueberMich').then((response)=>{
            const myPerson = JSON.parse(response.body)
            expect(myPerson).to.have.length(1)
        })
        cy.wait(10000)
        cy.getTestid("myPerson")
        .type("Das is ein Testlauf für das testen mit Cypress")
        .should('have.value', 'Das is ein Testlauf für das testen mit Cypress')
        cy.getTestid('ueberMichSend')
        .click()
        .should('be.disabled')
        cy.wait(30000)
        cy.request('/api/ueberMich').then((response)=>{
            const myPerson = JSON.parse(response.body)
            expect(myPerson).to.have.length(2)
        })
    })
    it("test the edit in uebermich", ()=>{
        cy.wait(20000)
        cy.getTestid('editUeberMich').eq(1)
          .click()
          .wait(40000)
          cy.getTestid('editUeberMichForm')
          .should('be.visible')
          cy.getTestid('editUeberMichText')
          .should('be.visible')
          .should('have.value', "Das is ein Testlauf für das testen mit Cypress")
          .clear()
          .type("Das ist ein Testlauf für das Testen mit Cypress")
          .should('have.value', "Das ist ein Testlauf für das Testen mit Cypress")
          cy.getTestid('editUeberMichSubmit')
          .should('be.visible')
          .and('be.enabled')
         .click()
         .should('be.disabled')
         cy.getTestid('entrys').eq(1)
         .should('have.text', "Das ist ein Testlauf für das Testen mit Cypress")
    })
    it("Test the deleteFunction", ()=>{
        cy.getTestid('deleteUeberMich').eq(1)
        .click()
        .wait(5000)
        cy.request('/api/ueberMich').then((response)=>{
            const myPerson = JSON.parse(response.body)
            expect(myPerson).to.have.length(1)
        })
    })
    it("Test the blogPosts are there", ()=>{
        cy.request('/api/blogPosts').then((response)=>{
            const blogPosts = JSON.parse(response.body)
            expect(blogPosts).to.have.length(8)
        })
        cy.wait(10000)
        cy.get('input[id="theme"]').eq(0)
        .type("TestThema Cypress", {delay:500})
        .should('have.value', "TestThema Cypress")
        cy.get('input[id="author"]').eq(0)
        .type("TestAutor", {delay:500})
        .should('have.value', "TestAutor")
        cy.get('input[id="description"]').eq(0)
        .type("TestDescription", {delay:500})
        .should('have.value', "TestDescription")
        cy.get('textarea[id="content"]').eq(0)
        .type("Lorem Ipsum ad dolores", {delay:500})
        .should('have.value', "Lorem Ipsum ad dolores")
        cy.get('input[type="file"]').selectFile('cypress/fixtures/placeholder2.jpg');
 
        cy.get('body > div > div.page_container__WJamO > div.blogPost_container__4N_w2 > div.blogPost_formWrapper__2sHu_ > div.blogPost_formWrapper__2sHu_ > form > button')  
        .click({timeout: 40000})
        cy.wait(10000)
        cy.request('/api/blogPosts').then((response)=>{
            const blogPosts = JSON.parse(response.body)
            expect(blogPosts).to.have.length(9)
        })
    })
    it('test the blogPost Update', ()=>{
                cy.wait(10000)
                cy.get('[data-testid = "editBlogpost"]').eq(8)
                .should('be.visible')
                .click({timeout:30000})
                cy.wait(10000)
                cy.get('[data-testid="editBlogpostForm"]')
                .should('be.visible')
                cy.getTestid('blogpostTheme')
                .should('have.value', "TestThema Cypress")
                .clear()
                .type('Testthema mit Cypress')
                .should('have.value', 'Testthema mit Cypress')
                cy.getTestid('blogpostAuthor')
                .should('have.value', "TestAutor")
                cy.getTestid('blogpostDescription')
                .should('have.value', "TestDescription")
                cy.getTestid('blogpostContent')
                .should('have.value', "Lorem Ipsum ad dolores")
                cy.get('input[type="file"]').selectFile('cypress/fixtures/placeholder1.jpg')
                cy.get('[data-testid="editBlogpostBtn"]')
                .should('be.visible')
                .should('be.enabled')
                .click()
                .should('be.disabled')
        })
    it("test the delete", ()=>{
        cy.get('[data-testid="deleteBlogpost"]').eq(8)
        .click({timeout:10000})
        cy.request('/api/blogPosts').then((response)=>{
            const blogPosts = JSON.parse(response.body)
            expect(blogPosts).to.have.length(8)
        })
    })
    it('test forumthemes upload', ()=>{
        cy.request('/api/forumThemes').then((response)=>{
            const forumThemes = JSON.parse(response.body)
            expect(forumThemes).to.have.length(3)
        })
        cy.wait(10000)
        cy.getTestid('theme')
        .type("Testtheme")
        .should('have.value', 'Testtheme')
        cy.getTestid('content').eq(1)
        .type("Testcontent")
        .should('have.value', 'Testcontent')
        cy.getTestid('forumthemesBtn')
        .should('be.enabled')
        .click()
        .should('be.disabled')
        cy.request('/api/forumThemes').then((response)=>{
            const forumThemes = JSON.parse(response.body)
            expect(forumThemes).to.have.length(4)
        })
    })
    it('test the forumThemesUpdate', ()=>{
        cy.wait(10000)
        cy.getTestid('editForumThemes').eq(3)
        .click({timeout:10000})
        cy.wait(10000)
        cy.getTestid('editForumThemesForm')
        .should('be.visible')
        cy.getTestid('editTheme"]')
        .should('have.value',"Testtheme")
        .clear()
        .type("TestThema")
        .should('have.value',"TestThema")
        cy.getTestid('editContent"]')
        .should('have.value',"Testinhalt")
        .clear()
        .type("Testinhalt")
        .should('have.value',"Testinhalt")
        cy.getTestid('editForumBtn')
        .click()
        cy.request('/api/forumThemes').then((response)=>{
            const forumThemes = JSON.parse(response.body)
            expect(forumThemes).to.have.length(4)
        })
        cy.getTestid('forumThemesFieldWrapper').eq(3)
    })
    it('test the delete',()=>{
        cy.getTestid('deleteForumThemes').eq(3)
        .click({timeout:10000})
        cy.request('/api/forumThemes').then((response)=>{
            const forumThemes = JSON.parse(response.body)
            expect(forumThemes).to.have.length(3)
        })
    })
    it.skip("test the upload of bibliothek", ()=>{
        cy.request('/api/bibliothek').then((response)=>{
            const bibliothek = JSON.parse(response.body)
            expect(bibliothek).to.have.length(1)
        })
        cy.wait(90000)
        cy.getTestid('editTheBibliothek').eq(1)
        .click({timeout:100000})
        cy.getTestid('editBibliothekForm')
        .should('be.visible')
        cy.wait(80000)
        cy.getTestid('add')
        .click({timeout:10000})
        cy.getTestid('ressort').eq(18)
        .should('be.visible')
        .type('CSS')
        cy.getTestid('file').eq(18)
        .should('be.visible')
        .type('https://www.youtube.com/watch?v=u31qwQUeGuM')
        cy.getTestid('content').eq(18)
        .should('be.visible')
        .type("Placeholder CSS Test")
        cy.getTestid('submit')
        .click({timeout:80000})
        cy.getTestid('fieldArrayLength')
        .should('have.value', 19)
    })
    it.skip("test the delete", ()=>{
        cy.wait(90000)
        cy.getTestid('editTheBibliothek').eq(1)
        .click({timeout:120000})
        cy.getTestid('editBibliothekForm')
        .should('be.visible')
        cy.wait(80000)
        cy.getTestid("remove").eq(9)
        .click({timeout:80000})
        cy.request('/api/bibliothek').then((response)=>{
            const bibliothek = JSON.parse(response.body)
            cy.wrap(bibliothek)
            .each((bibliothekItem)=>{
                //@ts-ignore
                const length = bibliothekItem.videos
                expect(length).to.have.length(18)
            })
        })
    })
})