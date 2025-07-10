# TasteGraph.ai Supabase Setup Guide

## Step 1: Connect to Supabase

1. **Click the "Connect to Supabase" button** in the top right corner of the Bolt interface
2. **Sign in to your Supabase account** or create a new one if needed
3. **Create a new project** or select an existing one
4. **Copy your project URL and anon key** from the Supabase dashboard

## Step 2: Run Database Migrations

1. **Go to your Supabase Dashboard** → SQL Editor
2. **Copy the entire content** from `supabase/migrations/create_schema.sql`
3. **Paste it into the SQL Editor** and click "Run"
4. **Verify the tables were created** by checking the Table Editor

### Expected Tables:
- `user_profiles` - User profile information
- `projects` - User projects and descriptions
- `insights` - Generated AI insights and personas

## Step 3: Set Up Environment Variables

1. **Go to Supabase Dashboard** → Settings → Edge Functions
2. **Add the following environment variables:**

```bash
# Required for Qloo integration
QLOO_API_KEY=your_qloo_api_key_here

# Required for OpenAI integration  
OPENAI_API_KEY=your_openai_api_key_here

# These are automatically available in Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Getting API Keys:

**Qloo API Key:**
1. Visit [Qloo's website](https://www.qloo.com/) and sign up for an account
2. Follow their documentation at [https://docs.qloo.com/docs/faqs](https://docs.qloo.com/docs/faqs)
3. Generate your API key from their dashboard

**OpenAI API Key:**
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Go to API Keys section and create a new key
4. Make sure you have credits/billing set up

## Step 4: Deploy Edge Functions

1. **Go to Supabase Dashboard** → Edge Functions
2. **Create a new function** called `generate-insights`
3. **Copy the content** from `supabase/functions/generate-insights/index.ts`
4. **Paste it into the function editor** and deploy

### Alternative: Using Supabase CLI

If you prefer using the CLI:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Deploy the function
supabase functions deploy generate-insights
```

## Step 5: Test the Setup

1. **Start your development server** (`npm run dev`)
2. **Sign up for a new account** in the app
3. **Create a test project** with some sample data
4. **Click "Generate Insights"** to test the AI integration
5. **Check the Supabase logs** for any errors

## Step 6: Configure Authentication (Optional)

### Email Settings:
1. **Go to Authentication** → Settings → Auth
2. **Configure email templates** for signup/login
3. **Set up custom SMTP** if needed (optional)

### Security Settings:
1. **Review RLS policies** in the Table Editor
2. **Check user permissions** are properly configured
3. **Test that users can only access their own data**

## Troubleshooting

### Common Issues:

**1. "Missing environment variables" error:**
- Make sure you've added QLOO_API_KEY and OPENAI_API_KEY to Edge Functions settings
- Redeploy the function after adding variables

**2. "Project not found" error:**
- Check that RLS policies are properly configured
- Verify the user is authenticated and owns the project

**3. "Failed to generate insights" error:**
- Check the Edge Function logs in Supabase Dashboard
- Verify API keys are valid and have sufficient credits
- Test with mock data first (API keys not required for mock mode)

**4. Database connection issues:**
- Ensure the migration script ran successfully
- Check that all tables exist in the Table Editor
- Verify RLS is enabled on all tables

### Testing Without API Keys:

The application includes mock data generators, so you can test the full functionality without Qloo or OpenAI API keys. The Edge Function will automatically fall back to mock data if API keys are not available.

### Production Considerations:

1. **Rate Limiting**: Implement rate limiting for API calls
2. **Error Handling**: Monitor Edge Function logs for errors
3. **Cost Management**: Set up billing alerts for API usage
4. **Security**: Regularly rotate API keys
5. **Backup**: Set up database backups in Supabase

## Next Steps

Once setup is complete:
1. **Test all features** thoroughly
2. **Customize the mock data** if needed
3. **Add your actual API keys** when ready for production
4. **Deploy to production** using your preferred hosting service

## Support

- **Supabase Documentation**: [https://supabase.com/docs](https://supabase.com/docs)
- **Qloo API Documentation**: [https://docs.qloo.com/docs/faqs](https://docs.qloo.com/docs/faqs)
- **OpenAI API Documentation**: [https://platform.openai.com/docs](https://platform.openai.com/docs)

The application is now ready for development and testing!