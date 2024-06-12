import {screen, render, waitFor, waitForElementToBeRemoved, act} from '@testing-library/react';
import BlogPost from './BlogPost';
import { SessionProvider } from 'next-auth/react';
import userEvent from '@testing-library/user-event';

beforeEach(()=>{
    jest.resetModules();
    jest.clearAllMocks();
})
// mock formdata not working in next as mock service worker issues say
// global.FormData = class FormData {
//     data: Record<string, any> = {};
  
//     append(key: string, value: any) {
//       this.data[key] = value;
//     }
  
//     get(key: string) {
//       return this.data[key];
//     }
//   } as any;
  // other mock approach

describe('test the blogpost functionallity', ()=>{
    beforeEach(()=>{
        render(
            <SessionProvider session={null}>
              <BlogPost/>
        </SessionProvider>
        )
    })
    it('test the add', async ()=>{
        await waitForElementToBeRemoved(screen.queryByTestId('spinner'))
        const theme = screen.getByRole('textbox', {
            name:/Thema/i
        })
        const author = screen.getByRole('textbox', {
            name:/Autor/i
        })
        const description = screen.getByRole('textbox', {
            name:/Beschreibung/i
        })
        const content = screen.getByRole('textbox', {
            name:/Inhalt/i
        })
        // const images = screen.getByTestId('images') as HTMLInputElement;
        const sendButton = screen.getByRole('button', {
            name:/Absenden/i
        })
        expect(theme).toBeInTheDocument();
        expect(author).toBeInTheDocument();
        expect(description).toBeInTheDocument();
        expect(content).toBeInTheDocument();
        // expect(images).toBeInTheDocument();
        expect(sendButton).toBeInTheDocument();

        await waitFor(()=>userEvent.type(theme, 'Ein Testthema'))
        await waitFor(()=>userEvent.type(author, 'Roman'))
        await waitFor(()=>userEvent.type(description, 'Eine Testbeschreibung'))
        await waitFor(()=>userEvent.type(content, 'Ein Testinhalt'));
        // const file = new File( ['test'], 'test.png', {type: 'image.png'})
        // await waitFor(()=>userEvent.upload(images, file));

        expect(theme).toHaveValue('Ein Testthema')
        expect(author).toHaveValue('Roman')
        expect(description).toHaveValue('Eine Testbeschreibung')
        expect(content).toHaveValue('Ein Testinhalt')
        // expect(images.files).toHaveLength(1)
        // expect(images.files![0]).toStrictEqual(file);
        // expect(images.files?.item(0)).toStrictEqual(file);

        act(()=>{
            userEvent.click(sendButton)
        })
        await waitFor(()=>{
            expect(sendButton).toBeDisabled();
        })
        await new Promise((r)=> setTimeout(r, 40000))
       //until here the test passes, so the inputs have value
        const blogTheme = await screen.findByTestId('blogTheme')
        const blogAuthor = await screen.findByTestId('blogAuthor')
        const blogDescription = await screen.findByTestId('blogDescription')
        const blogContent = await screen.findByTestId('blogContent')
        // const blogImages = await screen.findByTestId('blogImages') as HTMLImageElement;

        await waitFor(()=>{
            expect(blogTheme).toHaveTextContent('Ein Testthema')
            expect(blogAuthor).toHaveTextContent('Roman')
            expect(blogDescription).toHaveTextContent('Eine Testbeschreibung')
            expect(blogContent).toHaveTextContent('Ein Testinhalt')
            // expect(blogImages.src).toContain('test.png')
        })
        const editBlogpost = await screen.findAllByTestId('editBlogpost');
            expect(editBlogpost).toHaveLength(1);
    }, 50000)
    it('test the update', async ()=>{
        const editBlogpost = await screen.findByTestId('editBlogpost');
        expect(editBlogpost).toBeInTheDocument();
        act(()=>{
            userEvent.click(editBlogpost)
        })
        const editBlogpostForm = await screen.findByTestId('editBlogpostForm')
        await waitFor(async ()=>{
            expect(editBlogpostForm).toBeInTheDocument();
        }, {timeout:30000})
        const blogpostTheme = await screen.findByTestId('blogpostTheme')
        const blogpostAuthor = await screen.findByTestId('blogpostAuthor')
        const blogpostDescription = await screen.findByTestId('blogpostDescription')
        const blogpostContent = await screen.findByTestId('blogpostContent')
        const editBlogpostBtn = await screen.findByTestId('editBlogpostBtn')

        expect(blogpostTheme).toBeInTheDocument();
        expect(blogpostAuthor).toBeInTheDocument();
        expect(blogpostDescription).toBeInTheDocument();
        expect(blogpostContent).toBeInTheDocument();
        expect(editBlogpostBtn).toBeInTheDocument();
        expect(blogpostTheme).toHaveValue('Ein Testthema')
        expect(blogpostAuthor).toHaveValue('Roman')
        expect(blogpostDescription).toHaveValue('Eine Testbeschreibung')
        expect(blogpostContent).toHaveValue('Ein Testinhalt')

        await waitFor(async ()=>{
            await userEvent.clear(blogpostTheme)
            await userEvent.type(blogpostTheme, 'Ein Testthema Update')
        })
        expect(blogpostTheme).toHaveValue('Ein Testthema Update')
        await waitFor(async ()=>{
            await userEvent.clear(blogpostDescription)
            await userEvent.type(blogpostDescription, 'Eine Testbeschreibung Update')
        })
        expect(blogpostDescription).toHaveValue('Eine Testbeschreibung Update')
        await waitFor(async ()=>{
            await userEvent.clear(blogpostContent)
            await userEvent.type(blogpostContent, 'Ein Testinhalt Update')
        })
        expect(blogpostContent).toHaveValue('Ein Testinhalt Update')
        act(()=>{
            userEvent.click(editBlogpostBtn)
        })
        await new Promise((r)=> setTimeout(r, 20000))
        await waitFor(()=>{
            expect(editBlogpostForm).not.toBeInTheDocument()
        },{timeout:30000})

        const blogTheme = await screen.findByTestId('blogTheme')
        const blogAuthor = await screen.findByTestId('blogAuthor')
        const blogDescription = await screen.findByTestId('blogDescription')
        const blogContent = await screen.findByTestId('blogContent')
    }, 240000)
})