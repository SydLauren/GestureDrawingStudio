import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Create the server with the defined handlers
export const server = setupServer(...handlers);
