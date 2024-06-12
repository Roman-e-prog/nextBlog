import React from 'react';
import {useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Register from "@/app/authUser/register/page"
import {
        fireEvent, 
        render, 
        screen, 
        waitFor,
        within, 
        waitForElementToBeRemoved} from "@testing-library/react"
import userEvent from '@testing-library/user-event'
import {expect, jest, it} from '@jest/globals';
import {log} from 'console';
import Login from '@/app/authUser/login/page';
import { SessionProvider } from 'next-auth/react';
import Home from '@/app/page';
import Dashboard from '@/app/dashboard/page';

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});
afterEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});
//mocks
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

jest.mock('next/link', () => {
  return ({ children}:any) => {
    return children;
  };
});

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

const testFile = new Blob();
describe("Register has all its elements",()=>{
    it.skip("Find all inputs in the register", async ()=>{
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
    it.skip("test if the redirection works", async ()=>{
     
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
      expect(button).toBeDisabled();
      });
   })

describe("login has all its elements", () => {
  it.skip("test the inputs", async () => {
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
    await userEvent.type(username, 'MartinTester');
    await userEvent.type(email, 'martinTester@test.de');
    await userEvent.type(password, '123456');
    const button = screen.getByTestId('loginBtn');
    expect(button).toBeInTheDocument();
    userEvent.click(button);
    const form = screen.getByTestId('loginForm');
    await waitFor(()=>fireEvent.submit(form));
    expect(button).toBeDisabled();
  });
});

describe("Home has all its elements", ()=>{
  it.skip("just testing the elements", ()=>{
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

