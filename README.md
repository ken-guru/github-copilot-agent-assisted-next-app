# Activity Timer and Tracker

A comprehensive time management and activity tracking application built with Next.js. This app helps users efficiently manage their time by setting duration goals and tracking activities throughout the day.

## Disclaimer

**This is a hobby project** created for learning and experimentation purposes. It was never intended to be stable, secure, or complete enough for business-related or professional activities. Use at your own risk.

## Development Approach

This application was primarily developed with assistance from various Large Language Models (LLMs) including GitHub Copilot. The code, while functional, represents an exploration of AI-assisted development techniques rather than production-ready software.

## Features

- **Time Management**: Set time durations or deadlines for your work sessions
- **Activity Tracking**: Create and manage multiple activities
- **Visual Timeline**: See a visual representation of how time was spent
- **Progress Tracking**: Monitor ongoing activities with a progress bar
- **Activity Summary**: Get detailed stats about completed activities
- **Color-Coded Activities**: Easily identify different activities with unique color schemes
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Application Flow

1. Set up the timer duration or deadline
2. Create and manage activities
3. Start/stop activities as you work
4. Get a visual timeline of your work session
5. Receive a summary of your completed activities and time usage

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Testing

This application is thoroughly tested with Jest and React Testing Library. Run the tests with:

```bash
npm test
# or
yarn test
```

For continuous testing during development:

```bash
npm run test:watch
# or
yarn test:watch
```

## Project Structure

```
src/
  ├── app/            # Next.js app directory (routes, layout)
  ├── components/     # React components
  │   └── __tests__/  # Component tests
  ├── hooks/          # Custom React hooks
  │   └── __tests__/  # Hook tests
  └── utils/          # Utility functions
      └── __tests__/  # Utility tests
```

## Technologies

- [Next.js](https://nextjs.org/) - React framework
- [React](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Jest](https://jestjs.io/) - Testing framework
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) - Testing utilities

## License

[MIT](https://choosealicense.com/licenses/mit/)
