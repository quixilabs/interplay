# 🏛️ University Setup Guide

## 🎯 Problem Found
Your Supabase database connection is working perfectly, but **your universities table is empty**. This is why you're getting "university not found" errors.

## 🔧 Solution Options

### Option 1: Using Supabase Studio (Recommended - Simple)

1. **Open Supabase Studio:**
   ```bash
   # Open your Supabase project dashboard
   open https://supabase.com/dashboard/project/nrtyizrmttatsekgnkhz
   ```

2. **Navigate to Table Editor:**
   - Click on "Table Editor" in the left sidebar
   - Select the "universities" table

3. **Add Demo Universities:**
   Click "Insert" and add these two universities:

   **University 1:**
   ```
   name: Demo University
   slug: demo-university
   admin_email: admin@university.edu
   survey_active: true
   ```

   **University 2:**
   ```
   name: Saint Louis University
   slug: saint-louis-university
   admin_email: admin@slu.edu
   survey_active: true
   ```

### Option 2: Using Service Role Key (Advanced)

1. **Get your Service Role Key:**
   - Go to your Supabase project dashboard
   - Go to Settings → API
   - Copy the "service_role" key (not the anon key)

2. **Add to your .env file:**
   ```bash
   echo "VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here" >> .env
   ```

3. **Run the automated setup:**
   ```bash
   npm run setup:universities:admin
   ```

### Option 3: SQL Command (Quick)

Run this SQL in your Supabase SQL Editor:

```sql
INSERT INTO universities (name, slug, admin_email, survey_active) VALUES
('Demo University', 'demo-university', 'admin@university.edu', true),
('Saint Louis University', 'saint-louis-university', 'admin@slu.edu', true);
```

## ✅ Verification

After adding universities, test with:
```bash
npm run debug:db
```

You should see:
```
✅ [TERMINAL DEBUG] Found 2 universities:
   1. Demo University
      - Slug: "demo-university"
      - Survey Active: ✅ Yes
   
   2. Saint Louis University  
      - Slug: "saint-louis-university"
      - Survey Active: ✅ Yes
```

## 🚀 Test Your Survey URLs

Once universities are added, these URLs will work:
- http://localhost:5173/survey/demo-university
- http://localhost:5173/survey/saint-louis-university

## 🎉 That's It!

Your "university not found" error will be resolved once you have universities in your database.
