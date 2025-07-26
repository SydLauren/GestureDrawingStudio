import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock the /api/health endpoint
  http.get('/api/health', () => {
    // Simulate a 200 response
    return new HttpResponse(null, { status: 200 });
  }),
];
