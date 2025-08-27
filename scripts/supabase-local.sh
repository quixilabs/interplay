#!/bin/bash

# Supabase Local Development Helper Script

case "$1" in
  start)
    echo "Starting local Supabase..."
    supabase start
    echo ""
    echo "🎉 Supabase is running!"
    echo "📊 Studio: http://127.0.0.1:54323"
    echo "🔗 API URL: http://127.0.0.1:54321"
    echo "📧 Inbucket (Email): http://127.0.0.1:54324"
    ;;
  stop)
    echo "Stopping local Supabase..."
    supabase stop
    ;;
  restart)
    echo "Restarting local Supabase..."
    supabase stop
    supabase start
    ;;
  status)
    echo "Checking Supabase status..."
    supabase status
    ;;
  studio)
    echo "Opening Supabase Studio..."
    open http://127.0.0.1:54323
    ;;
  logs)
    echo "Showing Supabase logs..."
    supabase logs
    ;;
  reset)
    echo "⚠️  This will reset the local database and remove all data!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      supabase db reset
    else
      echo "Reset cancelled."
    fi
    ;;
  migrate)
    echo "Applying migrations..."
    supabase db reset
    ;;
  *)
    echo "Supabase Local Development Helper"
    echo ""
    echo "Usage: $0 {start|stop|restart|status|studio|logs|reset|migrate}"
    echo ""
    echo "Commands:"
    echo "  start    - Start local Supabase services"
    echo "  stop     - Stop local Supabase services"
    echo "  restart  - Restart local Supabase services"
    echo "  status   - Show status of local services"
    echo "  studio   - Open Supabase Studio in browser"
    echo "  logs     - Show service logs"
    echo "  reset    - Reset database (removes all data)"
    echo "  migrate  - Apply migrations to local database"
    ;;
esac
