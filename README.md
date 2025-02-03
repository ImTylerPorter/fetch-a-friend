# 🐾 Fetch A Friend

A modern web application that helps connect shelter dogs with their forever homes. Built with SvelteKit, TypeScript, and TailwindCSS.

## 🎯 Features

- User authentication
- Dog search functionality with filters
- Breed filtering
- Pagination support
- Sorting options (by breed, name, age)
- Favorite dogs selection
- Smart matching algorithm
- Modern, responsive UI

## 🛠 Tech Stack

- **Framework**: SvelteKit
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Authentication**: Custom auth with HTTP-only cookies
- **API Integration**: Fetch API with credentials

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

## 🏗 Project Structure

```
src/
├── lib/
│   ├── components/    # Reusable UI components
│   ├── services/      # API and business logic
│   └── types/         # TypeScript interfaces
├── routes/            # SvelteKit routes
└── app.css           # Global styles
```

## 🔒 Authentication

The application uses a secure authentication system with HTTP-only cookies. The auth flow includes:

- Login with name and email
- Secure cookie management
- Protected routes
- Automatic redirect handling

## 🌐 API Integration

The application integrates with the Fetch API service, providing:

- Dog search and filtering
- Location-based searches
- Breed listings
- Dog matching algorithm

## 📝 Development Notes

- Uses TypeScript for type safety
- Implements modern SvelteKit features and best practices
- Follows a service-based architecture for API calls
- Implements proper error handling and loading states

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
