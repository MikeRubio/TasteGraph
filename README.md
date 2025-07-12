# Libitum - AI-Powered Audience Discovery Platform

Libitum is a comprehensive audience discovery and content prediction engine that combines Qloo's Taste AI™ with OpenAI's GPT to deliver personalized audience insights, predictive cultural trendspotting, and creative content suggestions.

## 🚀 Features

### Core Functionality
- **AI-Powered Audience Insights**: Discover hidden audience segments using Qloo's Taste AI™
- **Cultural Trend Prediction**: Identify emerging trends before they become mainstream
- **Content Generation**: AI-generated content strategies tailored to your audience
- **Persona Development**: Detailed audience personas with behavioral insights
- **Developer-Friendly API**: RESTful API for seamless integration

### Technical Features
- **Real-time Insights**: Generate insights on-demand with live API integration
- **Secure Authentication**: Supabase Auth with email/password login
- **Responsive Design**: Modern UI that works on all devices
- **Data Export**: Export insights in structured JSON format
- **Project Management**: Organize insights by project with full CRUD operations

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **React Query** for state management and caching
- **React Router** for navigation

### Backend
- **Supabase** for authentication, database, and serverless functions
- **PostgreSQL** with Row Level Security (RLS)
- **Edge Functions** for secure API integrations

### Third-Party Integrations
- **Qloo's Taste AI™** for cultural intelligence
- **OpenAI GPT** for content generation
- **Date-fns** for date handling

## 🏁 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Qloo API key (optional for demo)
- OpenAI API key (optional for demo)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tastegraph-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Set up Supabase database**
   
   Run the migration file in your Supabase SQL editor:
   ```sql
   -- Copy and paste the content from supabase/migrations/create_tables.sql
   ```

5. **Deploy Edge Functions**
   
   Deploy the insights generation function to Supabase:
   ```bash
   # Copy the function code from supabase/functions/generate-insights/index.ts
   # to your Supabase project's Edge Functions
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

## 📊 Database Schema

### Tables

#### `user_profiles`
- `id` (uuid, primary key, references auth.users)
- `email` (text, unique)
- `job_role` (text)
- `industry` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### `projects`
- `id` (uuid, primary key)
- `title` (text)
- `description` (text)
- `cultural_domains` (text array)
- `geographical_targets` (text array)
- `industry` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)
- `user_id` (uuid, references auth.users)

#### `insights`
- `id` (uuid, primary key)
- `project_id` (uuid, references projects)
- `audience_personas` (jsonb)
- `cultural_trends` (jsonb)
- `content_suggestions` (jsonb)
- `qloo_data` (jsonb)
- `created_at` (timestamp)

## 🔑 API Integration

### Qloo's Taste AI™ Integration

The application integrates with Qloo's Taste AI™ to provide:
- Cultural intelligence and taste analysis
- Audience preference mapping
- Cross-domain recommendation insights

**Setup:**
1. Get your API key from [Qloo](https://www.qloo.com/)
2. Add to Supabase Edge Function environment variables
3. Update the `simulateQlooAPI` function with actual API calls

### OpenAI GPT Integration

OpenAI is used for:
- Generating narrative audience personas
- Creating content suggestions
- Enhancing cultural trend insights

**Setup:**
1. Get your API key from [OpenAI](https://platform.openai.com/)
2. Add to Supabase Edge Function environment variables
3. Update the `generateInsightsWithOpenAI` function with actual API calls

## 🚀 API Usage

### Authentication
All API requests require authentication via Supabase Auth:
```javascript
const { data: { session } } = await supabase.auth.getSession();
const token = session.access_token;
```

### Generate Insights
```javascript
const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-insights`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    project_id: 'your-project-id'
  })
});
```

### Response Format
```json
{
  "success": true,
  "data": {
    "audience_personas": [...],
    "cultural_trends": [...],
    "content_suggestions": [...],
    "qloo_data": {...}
  }
}
```

## 🎨 UI/UX Features

### Design System
- **Modern Dark Theme**: Professional gradient design with blue and purple accents
- **Responsive Layout**: Mobile-first design with Tailwind CSS
- **Interactive Components**: Hover states, transitions, and micro-interactions
- **Loading States**: Skeleton components and progress indicators
- **Error Handling**: Toast notifications and user feedback

### Navigation
- **Sidebar Navigation**: Collapsible sidebar with active state indicators
- **Dashboard**: Overview of projects and quick actions
- **Project Management**: Create, view, and manage projects
- **Insights Display**: Tabbed interface for personas, trends, and content
- **Profile Management**: User settings and preferences
- **API Documentation**: Built-in API reference and examples

## 🔒 Security Features

### Authentication
- Email/password authentication via Supabase Auth
- JWT token-based API authentication
- Secure session management

### Data Protection
- Row Level Security (RLS) on all database tables
- User data isolation
- Secure API key management in Edge Functions

### Best Practices
- Environment variable management
- CORS configuration for Edge Functions
- Input validation and sanitization
- Error handling and logging

## 📱 Responsive Design

The application is fully responsive with breakpoints for:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Features
- Touch-friendly interface
- Collapsible navigation
- Optimized content layout
- Gesture support

## 🧪 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Project Structure
```
src/
├── components/           # Reusable UI components
├── contexts/            # React contexts (Auth, etc.)
├── lib/                 # Utilities and API functions
├── pages/              # Page components
├── hooks/              # Custom hooks
└── App.tsx             # Main application component

supabase/
├── migrations/         # Database migrations
└── functions/          # Edge Functions
```

## 🚀 Deployment

### Frontend Deployment
The frontend can be deployed to any static hosting service:
- Netlify
- Vercel
- AWS S3 + CloudFront
- GitHub Pages

### Backend Deployment
The backend is fully managed by Supabase:
- Database hosting
- Authentication service
- Edge Functions runtime
- Real-time subscriptions

## 📈 Analytics and Monitoring

### Built-in Analytics
- Project creation tracking
- Insight generation metrics
- User engagement analytics
- API usage statistics

### Error Monitoring
- Error boundary implementation
- Toast notification system
- Console logging for debugging
- Supabase error tracking

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the API documentation in the app
- Review the Supabase documentation
- Consult the Qloo and OpenAI API documentation

## 🙏 Acknowledgments

- **Qloo** for their Taste AI™ technology
- **OpenAI** for GPT API capabilities
- **Supabase** for the backend infrastructure
- **shadcn/ui** for the beautiful UI components
- **Tailwind CSS** for the styling system

---

Built with ❤️ for the modern marketer and developer.