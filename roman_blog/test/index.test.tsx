import React from 'react';
import {useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Register from "@/app/authUser/register/page"
import {cleanup, fireEvent, render, screen, waitFor, waitForElementToBeRemoved} from "@testing-library/react"
import userEvent from '@testing-library/user-event'
import {expect, jest, test, it} from '@jest/globals';
import {log} from 'console';
import { renderHook } from '@testing-library/react';
import Login from '@/app/authUser/login/page';
import { SessionProvider } from 'next-auth/react';
import { mocked } from 'jest-mock';
import {server} from '../src/mocks/server'
import { rest } from 'msw';
import Home from '@/app/page';
import Dashboard from '@/app/dashboard/page';

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});
afterEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
  cleanup()
});
const original = console.error;

jest.mock('next-auth/react', () => ({
  useSession: jest.fn().mockReturnValue({
    data: {
      user: {
        _id:"",
        vorname:"",
        nachname:"",
        username: "",
        email: "",
        password: "",
        profilePicture:"",
        isAdmin:false,
      },
      expires: '2023-12-24T08:14:05.558Z',
    },
    status: 'unauthenticated',
  }),
}));
const mockSession = {
  user: {
    _id:"",
    vorname:"",
    nachname:"",
    username: "",
    email: "",
    password: "",
    profilePicture:"",
    isAdmin:false,
  },
  expires: '2023-12-24T08:14:05.558Z',
};

jest.mock('next/link', () => {
  return ({ children}:any) => {
    return children;
  };
});

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));
describe("Register has all its elements",()=>{
    it("Find all inputs in the register", async ()=>{
      jest.spyOn(require('next/navigation'), "useRouter")
      let useRouter = require('next/navigation').useRouter;
      useRouter.mockImplementation(() => ({
        push: jest.fn(),
      }));
        render(<Register/>)
        const vorname = screen.getByRole("textbox",{
            name:"Vorname"
        })
        const nachname = screen.getByRole("textbox",{
            name:"Nachname"
        })
        const username = screen.getByRole("textbox",{
            name:"Username"
        })
        const email = screen.getByRole("textbox",{
            name:"Email"
        })
        const password = screen.getByLabelText("Passwort")
        const passwordValidation = screen.getByLabelText("Passwort validieren");

        expect(vorname).toBeInTheDocument();
        expect(nachname).toBeInTheDocument();
        expect(username).toBeInTheDocument();
        expect(email).toBeInTheDocument();
        expect(password).toBeInTheDocument();
        expect(passwordValidation).toBeInTheDocument();
    })
    it("test if the redirection works", async ()=>{
     
      jest.spyOn(require('next/navigation'), "useRouter")
      let useRouter = require('next/navigation').useRouter;
      const mockPush = jest.fn();
      useRouter.mockImplementation(() => ({
        push: mockPush,
      }));
        render(<Register/>)
        const form = screen.getByTestId('register-form');
        const vorname = screen.getByRole("textbox",{
          name:"Vorname"
      })
      const nachname = screen.getByRole("textbox",{
          name:"Nachname"
      })
      const username = screen.getByRole("textbox",{
          name:"Username"
      })
      const email = screen.getByRole("textbox",{
          name:"Email"
      })
      const password = screen.getByLabelText("Passwort")
      const passwordValidation = screen.getByLabelText("Passwort validieren");
      const button = screen.getByTestId("registerBtn");
      await userEvent.type(vorname, "Martin")
      await userEvent.type(nachname, "Tester")
      fireEvent.change(username, { target: { value: 'TestMartin' } });
      fireEvent.blur(username);
      expect(username).toHaveValue('TestMartin');
      fireEvent.change(email, { target: { value: 'testMartin@test.de' } });
      fireEvent.blur(email);
      expect(email).toHaveValue('testMartin@test.de');
      await userEvent.type(password, "123456")
      await userEvent.type(passwordValidation, "123456")

      expect(vorname).toHaveValue("Martin")
      expect(nachname).toHaveValue("Tester")
      expect(password).toHaveValue("123456")
      expect(passwordValidation).toHaveValue("123456")
      await userEvent.click(button)
      await waitFor(()=>fireEvent.submit(form)); // Simulate form submission
      
      server.use(
        rest.post('http://localhost:3000/api/auth/register', (req,res,ctx)=>{
          log("I am submitted")
          return res(ctx.status(201),
              ctx.json([
                {
                vorname: "Martin",
                nachname: "Test",
                username: "testMartin",
                email: "testMartin@test.de",
                password:"123456",
              }
            ])
          )
        })
      )
      await waitFor(() => {
        console.log("Waiting for server response");
        expect(button).toBeDisabled();
        // expect(window.location.pathname).toContain("login")
      });
   })
})
describe("login has all its elements", () => {
  it("test the inputs", async () => {
    jest.spyOn(require('next/navigation'), "useRouter")
    const useRouter = require('next/navigation').useRouter;
       useRouter.mockImplementation(() => ({
        push: jest.fn(),
      }));
    render(<SessionProvider session={null}>
      <Login /></SessionProvider>);
    const username = screen.getByRole("textbox", {
      name: "Username",
    });
    const email = screen.getByRole("textbox", {
      name: "Email",
    });
    const password = screen.getByLabelText("Passwort");

    expect(username).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(password).toBeInTheDocument();
  });
});

describe("Home has all its elements", ()=>{
  it("just testing the elements", ()=>{
      render(<Home/>)
      screen.debug();
    const image = screen.getByAltText('Computer mit Code');
    const heading = screen.getByText('Programmieren für Ü 40');
    const blog = screen.getByText('Ein Blog von Roman Armin Rostock');
    expect(image).toBeInTheDocument();
    expect(heading).toBeInTheDocument();
    expect(blog).toBeInTheDocument();
  })
})

describe("dashboard has all its elements", ()=>{
  beforeAll(()=>{
 
  })

  it("teste ueberMich", async ()=>{
    await waitForElementToBeRemoved(() => screen.getAllByTestId('spinner'));
    const myPerson = await waitFor(()=>screen.getByLabelText("Zu meiner Person"))
    const button = await waitFor(()=>screen.getByTestId("ueberMichSend"))
    expect(myPerson).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    await userEvent.type(myPerson, 'Zu meiner Person')
    await userEvent.click(button)
    expect(button).toBeDisabled();
    await waitFor(() => expect(screen.queryByTestId('spinner')).not.toBeInTheDocument());
    const allEntrys = await waitFor(()=>screen.findAllByTestId("entrys"),{timeout:30000});
    await waitFor(()=>expect(allEntrys).toHaveLength(2));
  
  })
  it("test Blogposts", async ()=>{
       render(<SessionProvider session={null}>
      <Dashboard/></SessionProvider>);
    await waitForElementToBeRemoved(() => screen.getAllByTestId('spinner'));
    const field = screen.getByTestId("blogPostField");
    expect(field).toBeInTheDocument();
    const fields = screen.getAllByTestId("blogPostField");
    expect(fields).toHaveLength(1);
    const theme = screen.getByTestId("blogPostTheme");
    const author = screen.getByRole('textbox', {
      name:"Autor"
    });
    const description = screen.getByRole('textbox', {
      name:"Beschreibung"
    });
    const content = screen.getByRole('textbox', {
      name:"Inhalt"
    });
    const images= screen.getByLabelText("Bilder");
    expect(theme).toBeInTheDocument();
    expect(author).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(content).toBeInTheDocument();
    expect(images).toBeInTheDocument();
    await userEvent.type(theme, "Neues Thema");
    await userEvent.type(author, "Roman");
    await userEvent.type(description, "Neue Beschreibung");
    await userEvent.type(content, "Neuer Inhalt");
    fireEvent.change(images, { target: { files: ['/test1.jpg'] } });
    expect(theme).toHaveValue("Neues Thema");
    expect(author).toHaveValue("Roman");
    expect(description).toHaveValue("Neue Beschreibung");
    expect(content).toHaveValue("Neuer Inhalt");
    const button = screen.getByTestId("blogPostSubmit");
    const form = screen.getByTestId("blogPostForm");
    expect(button).toBeInTheDocument();
    await waitFor(()=>userEvent.click(button))
    await waitFor(()=>fireEvent.submit(form)); // Simulate form submission
    await waitFor(() => expect(screen.queryByTestId('spinner')).not.toBeInTheDocument());
    const updatedFields = await waitFor(()=>screen.findAllByTestId("blogPostField"));
    await waitFor(()=>expect(updatedFields).toHaveLength(2))
  }, 70000)

  it.only("test the bibliothek", async ()=>{
    render(<SessionProvider session={null}>
      <Dashboard/></SessionProvider>);
    await waitForElementToBeRemoved(() => screen.getAllByTestId('spinner'));
    const fields = screen.getAllByTestId("bibliothekField");
    expect(fields).toHaveLength(1);
    const ressort = screen.getByTestId("ressort");
    const file = screen.getByTestId("file");
    const content = screen.getByTestId("content");
    const button = screen.getByTestId("bibliothekSendBtn");
    expect(ressort).toBeInTheDocument();
    expect(file).toBeInTheDocument();
    expect(content).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    await waitFor(()=>userEvent.type(ressort, "CSS"));
    await waitFor(()=>userEvent.type(file, "https://youtube/iregendeinVideo/watch=123456"));
    await waitFor(()=>userEvent.type(content, "Test mit Jest"));
    await waitFor(()=>userEvent.click(button));

    await waitFor(() => expect(screen.queryByTestId('spinner')).not.toBeInTheDocument());
    const updatedFields = await waitFor(()=>screen.findAllByTestId('bibliothekField'),{timeout:1000000})
    expect(updatedFields).toHaveLength(2)
  })
})