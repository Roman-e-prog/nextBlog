import {act, render, screen, waitFor, waitForElementToBeRemoved} from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import ForumThemes from './ForumThemes';
import userEvent from '@testing-library/user-event';

beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });
describe('test the forumThemes funtionallity', ()=>{
    beforeEach(()=>{
        const {queryByTestId} =
        render(<SessionProvider session={null}>
            <ForumThemes/>
        </SessionProvider>)
    })
    it('test the add', async ()=>{
        await waitForElementToBeRemoved(()=>screen.queryByTestId('spinner'))
        const theme = screen.getByRole('textbox', {
            name:/thema/i
        })
        const content = screen.getByRole('textbox', {
            name:/Foruminhalt/i
        })
        const forumthemesBtn = screen.getByRole('button',{
            name:/Absenden/i
        })
        expect(theme).toBeInTheDocument();
        expect(content).toBeInTheDocument();
        expect(forumthemesBtn).toBeInTheDocument();

        await userEvent.type(theme, 'HTML')
        await userEvent.type(content, 'Ein Testinhalt')
    
        act(()=>{
            userEvent.click(forumthemesBtn);
        })
        const themeEntrys = await waitFor(()=>screen.findAllByTestId('themeEntry'), {timeout:30000})
        const contentEntrys = await waitFor(()=>screen.findAllByTestId('contentEntry'), {timeout:30000})
        await waitFor(()=>{
            expect(themeEntrys).toHaveLength(1)
        })
        await waitFor(()=>{
            expect(contentEntrys).toHaveLength(1)
        })
        expect(themeEntrys[0]).toHaveTextContent('HTML')
        expect(contentEntrys[0]).toHaveTextContent('Ein Testinhalt')
        const editForumThemes = await screen.findByTestId('editForumThemes');
        expect(editForumThemes).toBeInTheDocument();
    }, 60000)
    it('test the update', async()=>{
        const editForumThemes = await screen.findByTestId('editForumThemes');
        expect(editForumThemes).toBeInTheDocument();

        act(()=>{
            userEvent.click(editForumThemes)
        })

        const editForumThemesForm = await screen.findByTestId('editForumThemesForm');
        await waitFor(()=>{
            expect(editForumThemesForm).toBeInTheDocument();
        }, {timeout: 30000})
        const editTheme = screen.getByTestId('editTheme');
        const editContent = screen.getByTestId('editContent');
        const editForumBtn = screen.getByTestId('editForumBtn')
        expect(editTheme).toBeInTheDocument();
        expect(editContent).toBeInTheDocument();
        expect(editForumBtn).toBeInTheDocument();
        expect(editTheme).toHaveValue('HTML')
        expect(editContent).toHaveValue('Ein Testinhalt')

        await waitFor(async ()=>{
            await userEvent.clear(editTheme);
            await userEvent.type(editTheme, ('CSS'));
        })
        await waitFor(async ()=>{
            await userEvent.clear(editContent);
            await userEvent.type(editContent, ('Ein upgedateter Testinhalt'));
        })

        expect(editTheme).toHaveValue('CSS')
        expect(editContent).toHaveValue('Ein upgedateter Testinhalt')
        act(()=>{
            userEvent.click(editForumBtn)
        })

        await waitFor(()=>{
            expect(editForumThemesForm).not.toBeInTheDocument();
        },{timeout:30000})
        await new Promise((r)=> setTimeout(r, 50000))
        const themeEntries = await screen.findAllByTestId('themeEntry')
        const contentEntries = await screen.findAllByTestId('contentEntry')

        await waitFor(()=>{
            expect(themeEntries).toHaveLength(1);
            expect(themeEntries[0]).toHaveTextContent('CSS');
        }, {timeout:50000})
        await waitFor(()=>{
            expect(contentEntries).toHaveLength(1);
            expect(contentEntries[0]).toHaveTextContent('Ein upgedateter Testinhalt');
        }, {timeout:50000})
        
    }, 130000)
    it('test the delete', async ()=>{
        const theme = screen.getByRole('textbox', {
            name:/thema/i
        })
        const content = screen.getByRole('textbox', {
            name:/Foruminhalt/i
        })
        const forumthemesBtn = screen.getByRole('button',{
            name:/Absenden/i
        })
        expect(theme).toBeInTheDocument();
        expect(content).toBeInTheDocument();
        expect(forumthemesBtn).toBeInTheDocument();

        await userEvent.type(theme, 'JavaScript')
        await userEvent.type(content, 'Ein Testinhalt für Js')
    
        act(()=>{
            userEvent.click(forumthemesBtn);
        })
        await new Promise((r)=> setTimeout(r, 5000))
        const themeEntrys = await waitFor(()=>screen.findAllByTestId('themeEntry'), {timeout:90000})
        const contentEntrys = await waitFor(()=>screen.findAllByTestId('contentEntry'), {timeout:90000})
        await waitFor(()=>{
            expect(themeEntrys).toHaveLength(2)
        }, {timeout:30000})
        await waitFor(()=>{
            expect(contentEntrys).toHaveLength(2)
        }, {timeout:30000})
        expect(themeEntrys[1]).toHaveTextContent('JavaScript')
        expect(contentEntrys[1]).toHaveTextContent('Ein Testinhalt für Js')
        const deleteButtons = await screen.findAllByTestId('deleteForumThemes') as unknown as HTMLButtonElement[];

        await waitFor(()=>{
            expect(deleteButtons).toHaveLength(2);
        }, {timeout:30000})
        const firstDelete = deleteButtons[0]
        act(()=>{
            userEvent.click(firstDelete)
        })
        await new Promise((r)=> setTimeout(r, 20000))

        await waitFor(async ()=>{
            expect(await screen.findAllByTestId('themeEntry')).toHaveLength(1)
        },{timeout:30000})
        await waitFor(async ()=>{
            expect( await screen.findAllByTestId('contentEntry')).toHaveLength(1)
        },{timeout:30000})
    }, 250000)
})
