# Expense Tracker

An intuitive and user-friendly application for tracking your expenses. Built using modern web technologies like React 18, TypeScript, Vite.

## Table of Contents

1. [Introduction](#introduction)
2. [Technologies Used](#technologies-used)
3. [Getting Started](#getting-started)
4. [Features](#features)
5. [Architecture](#architecture)
6. [Development Practices](#development-practices)
7. [Deployment](#deployment)
8. [Future Enhancements](#future-enhancements)
9. [Notes](#notes)

---

## Introduction

The Expense Tracker application helps users manage their expenses efficiently by categorizing, summarizing, budgeting and viewing detailed expense records. Designed for mobile and desktop usage with a focus on performance and usability.

---

## Technologies Used

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Backend**: N/A
- **State Management**: Redux Toolkit
- **Routing**: React Router v6.23.0
- **Testing**: Vitest, React Testing Library
- **Styling**: Vanilla CSS

---

## Getting Started

### System Requirements

- **Node.js**: v20.12.2 or higher
- **Package Manager**: npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/troy213/expense-tracker-v2.git
   cd expense-tracker-v2
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

Start the development server:

```bash
npm run dev
```

### Running Unit Test

Start vitest:

```bash
npm run test
```

### Building for Production

Build the application:

```bash
npm run build
```

---

## Features

Overview of key features:

- Add, edit, and delete expenses.
- Categorize expenses.
- View expense summaries by category/date.
- PWA support

---

## Design and Assets

The design for the Expense Tracker application is available in Figma. You can access it using the link below:

- [Figma Design Link](https://www.figma.com/design/pQfqxeYBS9PXfzVRcfJNWH/Expense-Tracker-V2?node-id=0-1&t=3ncKlu1V36dtrC93-1)

All the necessary assets (such as images, icons, etc.) are also stored in the `assets/` directory of this project.

---

## Architecture

### Folder Structure:

```bash
src/
  assets/         # Static assets (images, fonts, etc.)
  components/     # Reusable UI components
  constants/      # Declared constants
  hooks/          # Custom React hooks
  locales/        # Custom React translation
  pages/          # Page-level components
  styles/         # Config/global level style
  utils/          # Utility/Helper functions
  types/          # Typescript type definitions
```

### State Management:

The application uses Redux Toolkit to manage global state efficiently.

### Routing:

Routes are managed using **react-router-dom v6.23.0** with a nested structure for better scalability.

---

## Development Practices

### Code Formatting

- Prettier: Code formatting.
- ESLint: Linting for maintaining code quality.
- Husky: Pre-commit hooks for enforcing standards.

### Testing

- Vitest: For unit testing.
- React Testing Library: For testing React components.

### Version Control

- Git: Branch naming convention: feature/, bugfix/, release/.
- Versioning: Semantic Versioning (Semver) e.g: v1.0.0-alpha

---

<!-- ## Key Components

### Reusable Components
- **TransactionDetail**: Displays detailed expense transactions.
- **Form.Input**: Custom input field component.
- **Form.Select**: Custom dropdown component.

### Utilities
- **currencyFormatter**: Formats numbers into currency.
- **formatTransactionDate**: Formats dates into user-friendly strings.

--- -->

## Deployment

### Hosting

The application can be deployed to platforms like **Vercel** or **Netlify**.

1. Build the application:

```bash
npm run build
```

2. Deploy the dist/ folder to your preferred hosting platform.

---

## Future Enhancements

- Import expenses from **xlsx**, **csv** or **pdf**.
- Export expenses to **xlsx**, **csv** or **pdf**.
- Add different foreign currencies.

---

Feel free to contribute by opening issues or submitting pull requests!
