# Real-Time Chat Application

A full-stack real-time chat application built with NestJS for the backend and React for the frontend. The application uses WebSockets for real-time communication between clients, a database for message persistence, and offers features such as user profiles, message editing, and typing indicators.

## Features

- Real-time messaging using WebSockets
- User authentication and persistent sessions
- Customizable user profiles with color selection
- Message editing functionality
- Typing indicators
- Emoji and kaomoji selector
- Message history persistence

## Project Structure

The project is organized into two main parts:

- `back/` - NestJS backend with WebSockets and Prisma ORM
- `front/` - React frontend built with Vite and Mantine UI components

## Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- SQLite (included by default)

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd back
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   The project includes a default `.env` file in the `back/` directory with basic configuration which you can modify as needed. Ensure the `DATABASE_URL` points to your SQLite database file.

   ```ini
   DATABASE_URL="file:./dev.db"
   ```

4. Initialize Prisma (create the database and apply migrations):

   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

5. Start the backend server:

   ```bash
   npm run build
   npm run start:prod
   ```

   The backend will be running on <http://localhost:3000> by default.

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:

   ```bash
   cd front
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the frontend development server:

   ```bash
   npm run build
   npm run preview
   ```

   The frontend will be running on <http://localhost:5173> by default.

## Database Management with Prisma

### Creating New Migrations

If you modify the database schema in `prisma/schema.prisma`, create a new migration:

```bash
cd back
npx prisma migrate dev --name <migration-name>
```

### Viewing Database Content

You can use Prisma Studio to view and edit your database content:

```bash
cd back
npx prisma studio
```

This will open a web interface on <http://localhost:5555>.

## WebSocket Events

The application uses the following WebSocket events for real-time communication:

- `login` - User authentication
- `createChat` - Send a new message
- `updateChat` - Edit an existing message
- `updateUserColor` - Update user color
- `startTyping`, `stopTyping` - Manage typing indicators

## Development Notes

### Adding New Features

When adding new features:

1. Update the Prisma schema if needed
2. Create new migrations using `npx prisma migrate dev`
3. Add corresponding backend handlers in the appropriate gateway/controller
4. Implement the frontend components and connect to backend events

### Production Deployment

For production deployment:

1. Build the frontend:

   ```bash
   cd front
   npm run build
   ```

2. Build the backend:

   ```bash
   cd back
   npm run build
   ```

3. Start the production server:

   ```bash
   cd back
   npm run start:prod
   ```

## Troubleshooting

### Database Issues

If you encounter database issues:

```bash
cd back
npx prisma migrate reset
npx prisma generate
npx prisma migrate deploy
```

### WebSocket Connection Issues

If WebSocket connections fail, ensure:

1. Both the backend and frontend are running
2. CORS settings in the backend allow connections from your frontend URL
3. Check browser console for any errors

## License

This project is licensed under the MIT License - see the LICENSE file for details.
