import '@testing-library/jest-dom/extend-expect'
import { server } from './src/mocks/server'
import {useRouter} from 'next/navigation';
import 'whatwg-fetch';
jest.mock('next/navigation', () => ({
    useRouter: jest.fn()
  }));
 
beforeAll(() => {
  // Enable API mocking before all the tests.
  server.listen()
})

afterEach(() => {
  // Reset the request handlers between each test.
  // This way the handlers we add on a per-test basis
  // do not leak to other, irrelevant tests.
  server.resetHandlers()
})

afterAll(() => {
  // Finally, disable API mocking after the tests are done.
  server.close()
})