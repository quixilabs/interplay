# The Growth Index

A comprehensive student flourishing analytics platform built with React, TypeScript, and Supabase. This application helps universities measure and improve student well-being using Harvard's validated Flourishing Measure framework.

## 🌟 Overview

The Growth Index provides universities with:
- **Multi-Domain Assessment**: Measure student flourishing across 6 core domains (happiness, health, purpose, relationships, character, and financial stability)
- **Real-Time Analytics**: Interactive dashboards with demographic analysis and actionable insights
- **Evidence-Based Framework**: Built on Harvard's validated Flourishing Measure with proven academic rigor
- **Privacy-First Design**: Anonymous responses with FERPA-compliant data handling
- **Growth Opportunities**: Identify intervention points and track improvement over time

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **State Management**: Zustand + React Context
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router v7

## 📋 Prerequisites

Before running this project, ensure you have:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **Supabase account** and project setup
- **Git** (for cloning the repository)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "interplay 2"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**How to get Supabase credentials:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or select existing one
3. Go to Settings → API
4. Copy the `Project URL` and `anon/public` key

### 4. Database Setup

The project includes a database migration file. To set up your database:

1. In your Supabase dashboard, go to the SQL Editor
2. Copy the contents of `supabase/migrations/20250826152702_black_torch.sql`
3. Run the SQL script to create all necessary tables and policies

This will create:
- University management tables
- Survey session tracking
- Demographics collection
- Flourishing scores storage
- School wellbeing metrics
- Growth modules and interventions
- Text responses and assessments

### 5. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🎯 Usage

### For Universities/Administrators

1. **Access Admin Panel**: Navigate to `/admin/login`
2. **View Dashboard**: After authentication, access comprehensive analytics
3. **Monitor Surveys**: Track completion rates and real-time responses
4. **Analyze Data**: Review demographic breakdowns and flourishing trends

### For Students

1. **Take Survey**: Visit `/survey/[university-slug]` (e.g., `/survey/demo-university`)
2. **Complete Assessment**: Answer questions across multiple domains:
   - Demographics
   - Flourishing measures (6 domains, 12 questions)
   - School-specific wellbeing
   - Growth opportunities
   - Tensions assessment
3. **Receive Insights**: Get personalized growth recommendations

## 📁 Project Structure

```
src/
├── components/
│   ├── Admin/           # Admin authentication
│   ├── Dashboard/       # Analytics dashboards
│   │   ├── ActionableInsights.tsx
│   │   ├── DemographicsAnalysis.tsx
│   │   ├── FlourishingChart.tsx
│   │   ├── InterventionMatrix.tsx
│   │   └── ...
│   ├── Survey/          # Survey flow components
│   │   ├── sections/    # Individual survey sections
│   │   └── SurveyFlow.tsx
│   └── LandingPage.tsx
├── contexts/            # React Context providers
├── data/               # Mock data and constants
├── lib/                # External service configurations
├── services/           # API and business logic
├── stores/             # Zustand state management
├── types/              # TypeScript type definitions
└── utils/              # Helper functions
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🏗️ Key Features

### Survey Components
- **Multi-step flow** with progress tracking
- **Responsive design** for all device types
- **Real-time validation** and data persistence
- **Anonymous session management**

### Analytics Dashboard
- **Flourishing metrics** visualization
- **Demographic analysis** with filtering
- **Intervention recommendations**
- **Trend analysis** over time
- **Risk assessment** indicators

### Data Architecture
- **Session-based tracking** for anonymous responses
- **Relational data model** with proper foreign keys
- **Row-level security** for data protection
- **Real-time updates** via Supabase

## 🔒 Security & Privacy

- **Anonymous Surveys**: No personally identifiable information required
- **Row Level Security**: Database-level access controls
- **FERPA Compliance**: Educational privacy standards
- **Secure Authentication**: Admin access protection
- **Data Encryption**: All data encrypted in transit and at rest

## 🌐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | ✅ |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public key | ✅ |

## 📊 Database Schema

The application uses 8 main tables:
- `universities` - University configuration
- `survey_sessions` - Session tracking
- `demographics` - Student demographics
- `flourishing_scores` - Harvard Flourishing Measure responses
- `school_wellbeing` - Institution-specific metrics
- `growth_modules` - Growth opportunity assessments
- `text_responses` - Open-ended feedback
- `tensions_assessment` - Tension slider responses

## 🔧 Development

### Adding New Survey Sections

1. Create component in `src/components/Survey/sections/`
2. Add to survey flow in `SurveyFlow.tsx`
3. Update types in `src/types/survey.ts`
4. Add database table if needed

### Customizing Analytics

1. Modify dashboard components in `src/components/Dashboard/`
2. Update data fetching in `src/services/analyticsService.ts`
3. Add new chart types using Recharts

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Deploy to Vercel/Netlify

1. Connect your repository
2. Set environment variables
3. Deploy from the `dist` folder

### Deploy to Custom Server

1. Build the project: `npm run build`
2. Serve the `dist` folder with a web server
3. Ensure environment variables are configured

## 🐛 Troubleshooting

### Common Issues

**Supabase Connection Error**
- Verify environment variables are correct
- Check Supabase project is active
- Ensure database migrations are applied

**Build Errors**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run lint`

**Survey Not Loading**
- Verify university slug exists in database
- Check browser console for errors
- Ensure Supabase policies allow anonymous access

## 📄 License

This project is part of The Growth Index platform for measuring student flourishing in educational institutions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For technical support or questions about implementation, please refer to the project documentation or contact the development team.

---

**Built with ❤️ for student well-being and institutional excellence**
