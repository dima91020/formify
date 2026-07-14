# Formify

A modern SaaS platform for creating dynamic forms and surveys. The key feature of this project is the visual logic builder (Logic Map), which allows users to configure complex branching scenarios based on user responses.

## Core Features

* Visual Logic Editor: Build conditional routing between questions using an interactive node-based graph (powered by Directed Acyclic Graphs).
* State Management: Scalable real-time form data handling.
* Authentication: Secure OAuth login (Google, GitHub) with automatic account linking.
* Responsive UI: Fully optimized for seamless use across all devices.

## Tech Stack

* Framework: Next.js (App Router)
* UI Library: React
* State Management: Redux Toolkit
* Graph Visualization: @xyflow/react, @dagrejs/dagre
* Styling: Tailwind CSS
* Database: PostgreSQL (Neon)
* ORM: Prisma
* Authentication: Auth.js (NextAuth v5)
* Deployment: Vercel

## Local Development

1. Clone the repository:
```bash
git clone [https://github.com/your-username/formify.git](https://github.com/your-username/formify.git)
cd formify

```

2. Install dependencies:

```bash
npm install

```

3. Set up environment variables. Create a `.env` file in the root directory and add the following keys:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/dbname?sslmode=require"

# Authentication (generate via: openssl rand -base64 32)
AUTH_SECRET="your-generated-secret"
NEXTAUTH_URL="http://localhost:3000"

# Providers
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"

```

4. Run database migrations:

```bash
npx prisma migrate dev

```

5. Start the development server:

```bash
npm run dev

```

Open `http://localhost:3000` in your browser to see the result.

## Deployment on Vercel

To ensure the project works correctly in a production environment:

1. Import the repository into Vercel.
2. Navigate to Settings -> Environment Variables.
3. Add all variables from your local `.env` file (ensure values are entered without quotes).
4. Update `NEXTAUTH_URL` to match your actual Vercel domain (e.g., `https://formify-maker.vercel.app`).
5. Configure the build script. If using Prisma, ensure the client is generated before the build. In `package.json`:

```json
"scripts": {
  "build": "prisma generate && next build"
}

```

6. Trigger a Redeploy without using the cache (uncheck "Use existing build cache").

## License

This project is licensed under the MIT License.
