# Task Management UI

Modern, responsive task management application built with React, TypeScript, and Context API.

## 🚀 Features

- ✅ CRUD operations for tasks (Create, Read, Update, Delete)
- ✅ Task filtering by status and search
- ✅ Status management (ToDo, InProgress, Done)
- ✅ Pagination support
- ✅ Form validation
- ✅ Responsive design (mobile & desktop)
- ✅ Real-time error handling

## 📁 Project Structure

```
src/
├── api/              # API configuration & endpoints
├── components/       # React components
│   ├── UI/          # Reusable UI components
│   ├── Task/        # Task-specific components
│   └── Layout/      # Layout components
├── configs/         # App configuration
├── context/         # State management (Context API)
├── enums/           # Enum definitions
├── hooks/           # Custom React hooks
├── models/          # TypeScript interfaces & types
├── pages/           # Page components
│   ├── Main/       # Main page with header
│   └── Task/       # Task management page
├── services/        # API service layer
├── utils/           # Helper functions
└── constants/       # App constants
```

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## ⚙️ Configuration

### Backend API

Configure your backend API endpoint in `vite.config.ts`:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',  // Your backend URL
      changeOrigin: true,
    },
  },
}
```

Or use environment variable:

```env
VITE_API_BASE_URL=/api
```

## 📝 Usage

### Development

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🎯 API Integration

The app expects these backend endpoints:

- `GET /api/tasks` - Get all tasks (with pagination & filters)
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `PUT /api/tasks/{id}/status` - Update task status

### Example API Response:

```json
{
  "data": [...],
  "totalCount": 50,
  "page": 1,
  "pageSize": 10,
  "totalPages": 5
}
```

## 🏗️ Architecture

### Layer Architecture

```
Pages → Context → Services → API → Backend
```

- **Pages**: UI pages (Main, Task)
- **Context**: State management (TaskContext)
- **Services**: Business logic (TaskService)
- **API**: HTTP client configuration
- **Models**: TypeScript types

### Key Files

- `src/api/axios.config.ts` - HTTP client setup
- `src/api/endpoints.ts` - API endpoints
- `src/services/Task.service.ts` - Task API operations
- `src/context/TaskContext.tsx` - Global state
- `src/models/Task.model.ts` - Task types
- `src/enums/TaskStatus.enum.ts` - Status enum

## 🎨 Styling

- CSS Modules for scoped styling
- Responsive design with media queries
- Mobile-first approach

## 🔧 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Axios** - HTTP client
- **Context API** - State management
- **CSS Modules** - Styling

## 📖 Code Examples

### Using TaskContext

```typescript
import { useTaskContext } from '@/context';

const MyComponent = () => {
  const { tasks, fetchTasks, createTask } = useTaskContext();
  
  // Use context methods
};
```

### Adding New Service

```typescript
// src/services/MyEntity.service.ts
import { apiClient } from '@/api';

export class MyEntityService {
  static async getData() {
    return apiClient.get('/my-endpoint');
  }
}
```

### Creating New Page

```
src/pages/MyPage/
├── MyPage.tsx
├── MyPage.module.css
└── MyPage.definitions.ts
```

## 🐛 Troubleshooting

**Port 3000 in use:**
```typescript
// vite.config.ts
server: { port: 3001 }
```

**Backend connection issues:**
- Check backend is running
- Verify proxy configuration
- Check API endpoints

**Build errors:**
```bash
rm -rf node_modules
npm install
```

## 📄 License

MIT License

---

**For detailed documentation, see QUICKSTART.md**
