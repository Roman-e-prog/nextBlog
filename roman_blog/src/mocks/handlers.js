import {rest} from 'msw';
import { log } from 'console';
let uebermichData = [];
let idCounter = uebermichData.length;

let blogpostData = [];
let idBlogpostCounter = blogpostData.length

let bibliothekData = [];
let idBibliothekCounter = bibliothekData.length;

let forumThemesData = [];
let idForumThemesCounter = forumThemesData.length;

let adminMessagesData = [];
let idAdminMessagesCounter = adminMessagesData.length

let forumData = [];
let idForumCounter = forumData.length

let forumCommentsData = [];
let idForumCommentsCounter = forumCommentsData.length

let userMessagesData = [];
let idUserMessagesCounter = userMessagesData.length
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
    rest.post('/api/auth/register', (req,res, ctx)=>{
        return res(ctx.status(201), ctx.json([
            {
                vorname: "Martin",
                nachname: "Test",
                username: "testMartin",
                email: "testMartin@test.de",
                password:"123456",
            }
        ]))
    }),
    rest.post('/api/auth/[...nextauth]', (req,res,ctx)=>{
        return res(
            ctx.status(200),
            ctx.json([
                {
                    username:"MartinTester",
                    email:"martinTester@test.de",
                    password:"123456",
                }
            ])
        )
    }),
      rest.post('/api/ueberMich', async (req, res, ctx) => {
        const data = await req.json()
        data._id = (++idCounter).toString();
        uebermichData.push(data);
        return res(ctx.status(201), ctx.json(uebermichData));
      }),
      rest.get('/api/ueberMich', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(uebermichData));
      }),
      rest.get('/api/ueberMich/:id', async (req, res, ctx)=>{
        const { id } = req.params;
        const singleUebermich = uebermichData.find((item)=>item._id === id);
        return res(ctx.status(200), ctx.json(singleUebermich))
      }),
      rest.put('/api/ueberMich/:id', async (req, res, ctx)=>{
        const {id} = req.params;
        const data = await req.json();
        uebermichData[0] = {myPerson: data.myPerson, _id: Number(id)}
        const updatedItem = {_id:Number(id), myPerson: data.myPerson}
        return res(ctx.status(200), ctx.json(updatedItem))
      }),
      rest.delete('/api/ueberMich/:id', async (req, res, ctx)=>{
        const {id} = req.params;
        uebermichData = uebermichData.filter((item)=>item._id !== Number(id))
        return res(ctx.status(200), ctx.json(uebermichData))
      }),
      rest.post('/api/blogPosts/', async (req, res, ctx) => {
        const data = await req.json()
        data._id = ++idBlogpostCounter
        blogpostData.push(data);
        return res(ctx.status(201), ctx.json(blogpostData));
      }),
      rest.get('/api/blogPosts/', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(blogpostData));
      }),
      rest.get('/api/blogPosts/:id', async (req, res, ctx)=>{
        const { id } = req.params;
        const singleBlogpost = blogpostData.find((item)=>item._id === Number(id));
        log(singleBlogpost)
        return res(ctx.status(200), ctx.json(singleBlogpost))
      }),
      rest.put('/api/blogPosts/:id', async (req, res, ctx)=>{
        const {id} = req.params;
        const data = await req.json();
        blogpostData[0] = { 
        _id: Number(id),
        theme:data.theme,
        author:data.author,
        description:data.description,
        content:data.content,
        images:data.images,
        }
        const updatedItem = { 
            _id: Number(id),
            theme:data.theme,
            author:data.author,
            description:data.description,
            content:data.content,
            images:data.images,
        }
        return res(ctx.status(200), ctx.json(updatedItem))
      }),
      rest.delete('/api/blogPosts/:id', async (req, res, ctx)=>{
        const {id} = req.params;
        blogpostData = blogpostData.filter((item)=>item._id !== Number(id))
        return res(ctx.status(200), ctx.json(blogpostData))
      }),
      rest.post('/api/bibliothek', async (req, res, ctx) => {
        const data = await req.json()
        data._id = (++idBibliothekCounter);
        bibliothekData.push(data);
        return res(ctx.status(201), ctx.json(bibliothekData));
      }),
      rest.get('/api/bibliothek', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(bibliothekData));
      }),
      rest.get('/api/bibliothek/:id', async (req, res, ctx)=>{
        const { id } = req.params;
        const singleBibliothek = bibliothekData.find((item)=>item._id === id);
        return res(ctx.status(200), ctx.json(singleBibliothek))
      }),
      rest.put('/api/bibliothek/:id', async (req, res, ctx)=>{
        const {id} = req.params;
        const data = await req.json();
        bibliothekData[0] = {ressort: data.ressort, file: data.file, content:data.content, _id: Number(id)}
        const updatedItem = {ressort: data.ressort, file: data.file, content:data.content, _id: Number(id)}
        return res(ctx.status(200), ctx.json(updatedItem))
      }),
      rest.delete('/api/bibliothek/:id', async (req, res, ctx)=>{
        const {id} = req.params;
        bibliothekData = bibliothekData.filter((item)=>item._id !== Number(id))
        return res(ctx.status(200), ctx.json(bibliothekData))
      }),
      rest.post('/api/forumThemes', async (req, res, ctx) => {
        const data = await req.json()
        data._id = (++idForumThemesCounter).toString();
        forumThemesData.push(data);
        return res(ctx.status(201), ctx.json(forumThemesData));
      }),
      rest.get('/api/forumThemes', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(forumThemesData));
      }),
      rest.get('/api/forumThemes/:id', async (req, res, ctx)=>{
        const { id } = req.params;
        const singleForumTheme = forumThemesData.find((item)=>item._id === id);
        return res(ctx.status(200), ctx.json(singleForumTheme))
      }),
      rest.put('/api/forumThemes/:id', async (req, res, ctx)=>{
        const {id} = req.params;
        const data = await req.json();
        log(data)
        forumThemesData[0] = {
            _id:Number(id),
            theme:data.theme,
            content:data.content,
        }
        const updatedItem = {
            _id:Number(id),
            theme:data.theme,
            content:data.content,
        }
        return res(ctx.status(200), ctx.json(updatedItem))
      }),
      rest.delete('/api/forumThemes/:id', async (req, res, ctx)=>{
        const {id} = req.params;
        forumThemesData = forumThemesData.filter((item)=>item._id !== Number(id))
        return res(ctx.status(200), ctx.json(forumThemesData))
      }),
      rest.post('/api/adminMessages', async (req, res, ctx) => {
        const data = await req.json()
        data._id = (++idAdminMessagesCounter);
        adminMessagesData.push(data);
        return res(ctx.status(201), ctx.json(uebermichData));
      }),
      rest.get('/api/adminMessages', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(adminMessagesData));
      }),
      rest.get('/api/adminMessages/:id', async (req, res, ctx)=>{
        const { id } = req.params;
        const singleAdminMessage = adminMessagesData.find((item)=>item._id === id);
        return res(ctx.status(200), ctx.json(singleAdminMessage))
      }),
      rest.put('/api/adminMessages/:id', async (req, res, ctx)=>{
        const {id} = req.params;
        const data = await req.json();
        adminMessagesData[0] = {
            _id:Number(id),
            questionId:data.questionId,
            adminId:data.adminId,
            adminname:data.adminName,
            senderId:data.senderId,
            senderName:data.senderName,
            adminMessage:data.adminMessage,
        }
        const updatedItem = {
            _id:Number(id),
            questionId:data.questionId,
            adminId:data.adminId,
            adminname:data.adminName,
            senderId:data.senderId,
            senderName:data.senderName,
            adminMessage:data.adminMessage,
        }
        return res(ctx.status(200), ctx.json(updatedItem))
      }),
      rest.delete('/api/adminMessages/:id', async (req, res, ctx)=>{
        const {id} = req.params;
        adminMessagesData = adminMessagesData.filter((item)=>item._id !== Number(id))
        return res(ctx.status(200), ctx.json(adminMessagesData))
      }),
      rest.post('/api/forum', async (req, res, ctx) => {
        const data = await req.json()
        data._id = (++idForumCounter).toString();
        forumData.push(data);
        return res(ctx.status(201), ctx.json(forumData));
      }),
      rest.get('/api/forum', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(forumData));
      }),
      rest.get('/api/forum/:id', async (req, res, ctx)=>{
        const { id } = req.params;
        const singleForum = forumData.find((item)=>item._id === id);
        return res(ctx.status(200), ctx.json(singleForum))
      }),
      rest.put('/api/forum/:id', async (req, res, ctx)=>{
        const {id} = req.params;
        const data = await req.json();
        forumData[0] = {
            _id:Number(id),
            ressort:data.ressort,
            senderId:data.senderId,
            senderName:data.senderName,
            senderIsAdmin:false,
            senderProfilePicture:data.senderProfilePicture,
            theme:data.theme,
            question:data.question,
        }
        const updatedItem = {
            _id:Number(id),
            ressort:data.ressort,
            senderId:data.senderId,
            senderName:data.senderName,
            senderIsAdmin:false,
            senderProfilePicture:data.senderProfilePicture,
            theme:data.theme,
            question:data.question,
        }
        return res(ctx.status(200), ctx.json(updatedItem))
      }),
      rest.delete('/api/forum/:id', async (req, res, ctx)=>{
        const {id} = req.params;
        forumData = forumData.filter((item)=>item._id !== Number(id))
        return res(ctx.status(200), ctx.json(forumData))
      }),
      rest.post('/api/forumComments', async (req, res, ctx) => {
        const data = await req.json()
        data._id = (++idForumCommentsCounter).toString();
        forumCommentsData.push(data);
        return res(ctx.status(201), ctx.json(forumCommentsData));
      }),
      rest.get('/api/forumComments', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(forumCommentsData));
      }),
      rest.get('/api/forumComments/:id', async (req, res, ctx)=>{
        const { id } = req.params;
        const singleForumComment = forumCommentsData.find((item)=>item._id === id);
        return res(ctx.status(200), ctx.json(singleForumComment))
      }),
      rest.put('/api/forumComments/:id', async (req, res, ctx)=>{
        const {id} = req.params;
        const data = await req.json();
        forumCommentsData[0] = {
            _id:Number(id),
            questionId:data.questionId,
            senderName:data.senderName,
            senderId:data.senderId,
            senderProfilePicture:data.senderProfilePicture,
            answer:data.answer,
            answerId:data.answerId,
            answererName:data.answererName,
        }
        const updatedItem = {
            _id:Number(id),
            questionId:data.questionId,
            senderName:data.senderName,
            senderId:data.senderId,
            senderProfilePicture:data.senderProfilePicture,
            answer:data.answer,
            answerId:data.answerId,
            answererName:data.answererName,
        }
        return res(ctx.status(200), ctx.json(updatedItem))
      }),
      rest.delete('/api/forumComments/:id', async (req, res, ctx)=>{
        const {id} = req.params;
        forumCommentsData = forumCommentsData.filter((item)=>item._id !== Number(id))
        return res(ctx.status(200), ctx.json(forumCommentsData))
      }),
      rest.post('/api/userMessages', async (req, res, ctx) => {
        const data = await req.json()
        data._id = (++idUserMessagesCounter);
        userMessagesData.push(data);
        return res(ctx.status(201), ctx.json(userMessagesData));
      }),
      rest.get('/api/userMessages', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(userMessagesData));
      }),
      rest.get('/api/userMessages/:id', async (req, res, ctx)=>{
        const { id } = req.params;
        const singleUsermessage = userMessagesData.find((item)=>item._id === id);
        return res(ctx.status(200), ctx.json(singleUsermessage))
      }),
      rest.put('/api/userMessages/:id', async (req, res, ctx)=>{
        const {id} = req.params;
        const data = await req.json();
        userMessagesData[0] = {
            _id:Number(id),
            senderId:data.senderId,
            senderName:data.senderName,
            userMessage:data.userMessage,
            isAnswered:false,
        }
        const updatedItem = {
            _id:Number(id),
            senderId:data.senderId,
            senderName:data.senderName,
            userMessage:data.userMessage,
            isAnswered:false,
        }
        return res(ctx.status(200), ctx.json(updatedItem))
      }),
      rest.delete('/api/userMessages/:id', async (req, res, ctx)=>{
        const {id} = req.params;
        userMessagesData = userMessagesData.filter((item)=>item._id !== Number(id))
        return res(ctx.status(200), ctx.json(userMessagesData))
      }),
]