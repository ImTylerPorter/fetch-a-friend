# 🐾 Fetch A Friend

A modern web application that helps connect shelter dogs with their forever homes. Built with SvelteKit, TypeScript, and TailwindCSS.

## 🎯 Features

- **Authentication System**

  - Secure login with name and email
  - HTTP-only cookie-based session management
  - Protected routes and automatic redirects
  - Session validation and expiration handling

- **Dog Search & Discovery**

  - Advanced search functionality with multiple filters
  - Breed filtering with auto-complete
  - Age range filtering
  - Location-based search with zip code support
  - Text search for dog names
  - Smart sorting options (breed, name, age)
  - Responsive pagination

- **Favorites System**

  - Save favorite dogs for later viewing
  - Client-side favorites management
  - Server-side favorites synchronization
  - Smart matching algorithm for recommendations

- **Modern UI/UX**
  - Responsive, mobile-first design
  - Beautiful gradient effects and animations
  - Accessible form controls
  - Loading states and error handling
  - SEO optimization with meta tags

## 🛠 Tech Stack

- **Framework**: SvelteKit 2.0 with TypeScript
- **UI**: TailwindCSS with custom theme
- **Authentication**: Custom auth with HTTP-only cookies
- **State Management**: Svelte stores and server-side state
- **API Integration**: RESTful endpoints with type safety

## 📚 API Documentation

### Authentication Endpoints

#### `POST /login`

- Handles user authentication
- Requires `name` and `email` in request body
- Returns HTTP-only cookies for session management
- Redirects to home page on success

#### `POST /logout`

- Handles user logout
- Clears authentication cookies
- Invalidates server-side session
- Redirects to login page

#### `GET /api/auth/check`

- Verifies current authentication status
- Returns 200 if authenticated
- Returns 401 if session is invalid/expired

### Favorites API

#### `GET /api/favorites`

- Retrieves user's favorite dogs
- Requires authentication
- Returns array of favorite dog IDs

#### `PUT /api/favorites`

- Updates user's favorite dogs
- Requires authentication
- Accepts array of dog IDs in request body
- Returns success confirmation

## 🏗 Project Structure

```
src/
├── lib/
│   ├── components/    # Reusable UI components
│   │   ├── DogCard.svelte
│   │   ├── Header.svelte
│   │   ├── Hero.svelte
│   │   ├── SearchFilters.svelte
│   │   └── Pagination.svelte
│   ├── services/     # API and business logic
│   │   ├── auth.ts
│   │   ├── dogs.ts
│   │   └── location.ts
│   ├── stores/       # Svelte stores
│   │   └── favorites.ts
│   ├── types/        # TypeScript interfaces
│   │   ├── auth.ts
│   │   ├── dog.ts
│   │   └── search.ts
│   └── utils/        # Helper functions
│       └── search.ts
├── routes/           # SvelteKit routes
│   ├── +layout.svelte
│   ├── +layout.server.ts
│   ├── +page.svelte
│   ├── +page.server.ts
│   ├── login/
│   │   ├── +page.svelte
│   │   └── +page.server.ts
│   ├── favorites/
│   │   ├── +page.svelte
│   │   └── +page.server.ts
│   ├── logout/
│   │   └── +server.ts
│   └── api/
│       ├── auth/
│       │   └── check/
│       │       └── +server.ts
│       └── favorites/
│           └── +server.ts
└── app.css          # Global styles
```

## 🔒 Authentication Flow

1. User submits login form with name and email
2. Server validates credentials and creates session
3. HTTP-only cookies are set for authentication
4. Client is redirected to home page
5. Auth middleware (`hooks.server.ts`) validates session on each request
6. Protected routes check authentication status
7. Periodic auth checks prevent session staleness

## 🌐 API Integration

The application integrates with the Fetch API service:

- Secure authentication handling
- Dog search and filtering
- Location-based searches
- Breed listings
- Dog matching algorithm
- Favorites management

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/fetch-a-friend.git
cd fetch-a-friend
```

2. Install dependencies:

```bash
npm install
# or with pnpm
pnpm install
```

3. Create a `.env` file in the root directory:

```env
PUBLIC_API_URL=https://frontend-take-home-service.fetch.com
```

4. Start the development server:

```bash
npm run dev
# or with pnpm
pnpm dev
```

5. Open your browser and navigate to `http://localhost:5173`

## 📝 Development Notes

- Uses TypeScript for type safety and better developer experience
- Implements modern SvelteKit features including server-side rendering
- Follows a service-based architecture for API calls
- Implements proper error handling and loading states
- Uses TailwindCSS for responsive and maintainable styling
- Includes comprehensive documentation for all components and APIs

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
