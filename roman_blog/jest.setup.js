import '@testing-library/jest-dom/'
import { server } from './src/mocks/server'
import {useRouter} from 'next/navigation';
// import { JSDOM } from 'jsdom';
import 'whatwg-fetch';
// Set up jsdom.
// const dom = new JSDOM();
// global.TextEncoder = require('util').TextEncoder;
// global.TextDecoder = require('util').TextDecoder;
// global.document = dom.window.document;
// global.window = dom.window;
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
    useRouter: ()=> jest.fn()
  }));
//   global.FormData = class FormData {
//     constructor() {
//         this.data = {};
//     }
//     append(key, value) {
//         this.data[key] = value;
//     }

//     get(key) {
//         return this.data[key];
//     }
// };

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