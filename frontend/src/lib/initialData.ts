import { BoardState } from './types'

export const INITIAL_DATA: BoardState = {
  cards: {
    'card-1': { id: 'card-1', title: 'Set up CI/CD pipeline', details: 'Configure GitHub Actions for automated testing and deployment to staging and production environments.' },
    'card-2': { id: 'card-2', title: 'Design database schema', details: 'Define tables and relationships for user, project, and task models. Include indexing strategy.' },
    'card-3': { id: 'card-3', title: 'Write API documentation', details: 'Document all REST endpoints using OpenAPI 3.0 specification with request/response examples.' },
    'card-4': { id: 'card-4', title: 'Implement authentication', details: 'Add JWT-based login and registration. Include refresh token rotation and session invalidation.' },
    'card-5': { id: 'card-5', title: 'Build dashboard layout', details: 'Create the main dashboard with collapsible sidebar, header, and content area using responsive grid.' },
    'card-6': { id: 'card-6', title: 'Add error monitoring', details: 'Integrate Sentry for real-time error tracking. Configure alerts for P0 and P1 severity issues.' },
    'card-7': { id: 'card-7', title: 'Refactor user service', details: 'Extract user business logic into a dedicated service layer. Add unit tests for all public methods.' },
    'card-8': { id: 'card-8', title: 'Fix pagination bug', details: 'Cursor-based pagination returns incorrect results on page 3+. Likely an off-by-one in the cursor encoding.' },
    'card-9': { id: 'card-9', title: 'Code review: auth PR', details: 'Review PR #47 — authentication middleware implementation. Check for token leakage edge cases.' },
    'card-10': { id: 'card-10', title: 'QA: checkout flow', details: 'End-to-end verification of the checkout process on staging. Test with expired cards and declined payments.' },
    'card-11': { id: 'card-11', title: 'Deploy v1.2.0', details: 'Release version 1.2.0 to production. Run smoke tests post-deploy and monitor error rates for 30 min.' },
    'card-12': { id: 'card-12', title: 'Update dependencies', details: 'Bump all packages to latest stable versions. Run full test suite and fix any breaking changes.' },
  },
  columns: [
    { id: 'col-1', name: 'Backlog', cardIds: ['card-1', 'card-2', 'card-3'] },
    { id: 'col-2', name: 'To Do', cardIds: ['card-4', 'card-5', 'card-6'] },
    { id: 'col-3', name: 'In Progress', cardIds: ['card-7', 'card-8'] },
    { id: 'col-4', name: 'Review', cardIds: ['card-9', 'card-10'] },
    { id: 'col-5', name: 'Done', cardIds: ['card-11', 'card-12'] },
  ],
}
