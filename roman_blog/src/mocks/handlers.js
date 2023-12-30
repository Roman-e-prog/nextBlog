import {rest} from 'msw';
import { log } from 'console';
 let data = [{ myPerson: "Roman", _id:"1"}];
 let blogPostData = [{
    _id:"1",
    theme:"Irgendwas",
    author:"Irgendwer",
    description:"Beschreibung",
    content:"Inhalt",
    images:["/test.jpg"],
}];
// log(blogPostData);
let bibliothekData = [
    {
        _id:"1",
        videos:[{
            _id:"1",
            ressort:"Ein Ressort",
            file:"Eine Url",
            content:"Eine Beschreibung",
        }]
    }
];
export const handlers = [
    rest.post('/api/auth/unique', (req,res,ctx)=>{
        return res(
            ctx.status(200),
            ctx.json([
                {
                  username: "testMartin",
                  email: "testMartin@test.de",
                }
            ])
        )
    }),
    rest.get('/api/ueberMich', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(data));
      }),
      rest.post('/api/ueberMich', (req, res, ctx) => {
        data.push({ myPerson: "Zu meiner Person" });
        return res(ctx.status(201), ctx.json([{ myPerson: "Zu meiner Person", _id:"2"}]));
      }),
    rest.get('/api/blogPosts', (req, res,ctx)=>{
        return res(
            ctx.status(200),
            ctx.json(blogPostData)
        )
    }),
    rest.post('/api/blogPosts/', async (req, res,ctx)=>{
        log("I get data and triggered");
        const newPost = await req.formData();
        log("newPost", newPost)
        blogPostData.push(newPost);
        return res(
            ctx.status(201),
            ctx.json(newPost)
        )
    }),
    rest.get('/api/bibliothek', (req, res,ctx)=>{
        console.log("Hello again")
        return res(
            ctx.status(200),
            ctx.json(bibliothekData)
        )
    }),
    rest.post('/api/bibliothek', async (req, res,ctx)=>{
        console.log("bibliothek here")
        const data = await req.json();
        console.log(data, "bibliothekData")
        bibliothekData.push(data)
        console.log("updated",bibliothekData)
        return res(
            ctx.status(200),
            ctx.json(data)
        )
    }),
    rest.get('/api/forumThemes', (req, res,ctx)=>{
        return res(
            ctx.status(200),
            ctx.json([
                {
                    _id:"1",
                    theme:"Thema",
                    content:"Inhalt",
                }
            ])
        )
    }),
    rest.get('/api/adminMessages', (req, res,ctx)=>{
        return res(
            ctx.status(200),
            ctx.json([
                {
                    _id:"1",
                    questionId:"1",
                    adminId:"1",
                    adminname:"Roman",
                    senderId:"1",
                    senderName:"Irgendwer",
                    adminMessage:"Meine Nachricht",
                }
            ])
        )
    }),
    rest.get('/api/forum', (req, res,ctx)=>{
        return res(
            ctx.status(200),
            ctx.json([
                {
                    _id:"1",
                    ressort:"Ressort",
                    senderId:"1",
                    senderName:"Irgendwer",
                    senderIsAdmin:false,
                    senderProfilePicture:"",
                    theme:"thema",
                    question:"Frage",
                }
            ])
        )
    }),
    rest.get('/api/forumComments', (req, res,ctx)=>{
        return res(
            ctx.status(200),
            ctx.json([
                {
                    _id:"1",
                    questionId:"1",
                    senderName:"Irgendwer",
                    senderId:"1",
                    senderProfilePicture:"",
                    answer:"Antwort",
                    answerId:"1",
                    answererName:"Antworter",
                }
            ])
        )
    }),
    rest.get('/api/userMessages', (req, res,ctx)=>{
        return res(
            ctx.status(200),
            ctx.json([
                {
                    _id:"1",
                    senderId:"1",
                    senderName:"Irgendwer",
                    userMessage:"Nachricht",
                    isAnswered:false,
                }
            ])
        )
    }),

]