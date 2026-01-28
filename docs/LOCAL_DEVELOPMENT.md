# Local Development with Supabase

This project is now configured to work with a local Supabase instance for rapid development.

## Prerequisites

- Docker Desktop must be installed and running
- Supabase CLI (already installed via Homebrew)

## Quick Start

1. **Start local Supabase:**
   ```bash
   npm run supabase:start
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

   Or combine both commands:
   ```bash
   npm run dev:local
   ```

## Available Services

When Supabase is running locally, you have access to:

- **API URL:** http://127.0.0.1:54321
- **Supabase Studio:** http://127.0.0.1:54323
- **Database:** postgresql://postgres:postgres@127.0.0.1:54322/postgres
- **Email Testing (Inbucket):** http://127.0.0.1:54324

## Configuration

The app automatically uses local Supabase when `USE_LOCAL_SUPABASE` is set to `true` in `src/config/local.ts`.

To switch back to production Supabase:
1. Set `USE_LOCAL_SUPABASE = false` in `src/config/local.ts`
2. Ensure your production environment variables are set

## Useful Commands

```bash
# Start Supabase services
npm run supabase:start

# Stop Supabase services
npm run supabase:stop

# Restart Supabase services
npm run supabase:restart

# Open Supabase Studio
npm run supabase:studio

# Reset database (removes all data)
npm run supabase:reset

# Use the helper script
./scripts/supabase-local.sh start
./scripts/supabase-local.sh studio
./scripts/supabase-local.sh logs
```

## Database Schema

Your existing migration (`20250826152702_black_torch.sql`) has been automatically applied to the local database. All tables are available:

- `universities`
- `survey_sessions`
- `demographics`
- `flourishing_scores`
- `school_wellbeing`
- `growth_modules`
- `text_responses`
- `tensions_assessment`

A demo university has been automatically created:
- **Name:** Demo University
- **Slug:** demo-university
- **Admin Email:** admin@university.edu

## Development Workflow

1. Start local Supabase: `npm run supabase:start`
2. Make your code changes
3. Test against local database
4. When ready, commit your changes
5. For production, switch `USE_LOCAL_SUPABASE` to `false`

## Troubleshooting

- **Docker not running:** Make sure Docker Desktop is started
- **Port conflicts:** Stop other services using ports 54321-54324
- **Database issues:** Try `npm run supabase:reset` to reset the database
- **Migration issues:** Ensure your SQL files are in `supabase/migrations/`

## Migration Management

To create a new migration:
```bash
supabase migration new your_migration_name
```

To apply migrations:
```bash
supabase db reset
```

All migrations in `supabase/migrations/` are automatically applied when starting Supabase.
