import React from 'react';
import {
        render, 
        screen, 
        waitFor,
        act,
    } from "@testing-library/react"
import userEvent from '@testing-library/user-event'
import {expect, jest, it} from '@jest/globals';
import {log} from 'console';
import { SessionProvider } from 'next-auth/react';
import UeberMich from './UeberMich';

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});
afterEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});
describe("teste uebermich", ()=>{
    beforeEach(()=>{
        render(<SessionProvider session={null}>
            <UeberMich/></SessionProvider>);
    })
    it("teste ueberMich add", async ()=>{
      const myPerson = await waitFor(()=>screen.getByTestId("myPerson"))
      const button = await waitFor(()=>screen.getByTestId("ueberMichSend"))
      expect(myPerson).toBeInTheDocument();
      expect(button).toBeInTheDocument();
      await userEvent.type(myPerson, 'Zweiter Test')
      await waitFor(()=>{
        userEvent.click(button)
      })
      await waitFor(() => expect(screen.queryByTestId('spinner')).not.toBeInTheDocument());
      const allEntrys = await waitFor(()=>screen.findAllByTestId("entrys"),{timeout:90000});
      await waitFor(() =>
        expect(allEntrys).toHaveLength(1),
        { timeout: 30000 }
      );
      
      const addedText = await waitFor(()=>screen.findByText('Zweiter Test'), {timeout:30000})
      await waitFor(()=>expect(addedText).toBeInTheDocument());
      const editUeberMich = await screen.findByTestId('editUeberMich');
      expect(editUeberMich).toBeInTheDocument();
    }, 130000)
    it('test the update', async ()=>{
        const editUeberMich = await screen.findByTestId('editUeberMich');
        expect(editUeberMich).toBeInTheDocument();
        act(()=>{
            userEvent.click(editUeberMich)
        })
        screen.debug();
        const editUeberMichForm = await screen.findByTestId('editUeberMichForm')
        await waitFor(async ()=>{
            expect(editUeberMichForm).toBeInTheDocument(), {timeout:30000}; 
        })
        const editUeberMichText = await screen.findByTestId('editUeberMichText')
        expect(editUeberMichText).toBeInTheDocument();
        expect(editUeberMichText).toHaveValue('Zweiter Test');
        await waitFor(async ()=>{
            await userEvent.clear(editUeberMichText);
            await userEvent.type(editUeberMichText, 'Update Test')
        })
        expect(editUeberMichText).toHaveValue('Update Test')
        const editUeberMichSubmit = screen.getByTestId('editUeberMichSubmit');
        expect(editUeberMichSubmit).toBeInTheDocument();
        act(()=>{
            userEvent.click(editUeberMichSubmit)
        })
      
        await waitFor(()=>{
            expect(editUeberMichForm).not.toBeInTheDocument();
        })
        
        const allEntrys = await waitFor(()=>screen.findAllByTestId("entrys"),{timeout:90000});
      await waitFor(() =>
        expect(allEntrys).toHaveLength(1),
        { timeout: 30000 }
      );
      expect(allEntrys[0]).toHaveTextContent('Update Test')
    },90000)
    it('test the delete', async ()=>{
      const myPerson = await waitFor(()=>screen.getByTestId("myPerson"))
      const button = await waitFor(()=>screen.getByTestId("ueberMichSend"))
      expect(myPerson).toBeInTheDocument();
      expect(button).toBeInTheDocument();
      await userEvent.type(myPerson, 'Dritter Test')
      await waitFor(async ()=>{
        userEvent.click(button)
        await new Promise((r)=> setTimeout(r, 30000))
      },{timeout:50000})
      await waitFor(() => expect(screen.queryByTestId('spinner')).not.toBeInTheDocument());
      const allEntrys = await waitFor(()=>screen.findAllByTestId("entrys"),{timeout:90000});
     
      await waitFor(() =>
        expect(allEntrys).toHaveLength(2),
        { timeout: 30000 }
      );
        const deleteUeberMichs = await screen.findAllByTestId('deleteUeberMich') as unknown as HTMLButtonElement[] ;
        expect(deleteUeberMichs).toHaveLength(2);
      const firstDelete = deleteUeberMichs[0]
        act(()=>{
            userEvent.click(firstDelete)
        })

        await new Promise((r)=> setTimeout(r, 30000))
        await waitFor(async ()=>{
           expect(await screen.findAllByTestId('entrys')).toHaveLength(1)
        },{timeout:30000});
    }, 120000)
  })