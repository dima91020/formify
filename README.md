# Formify

A modern SaaS platform for creating dynamic forms and surveys. The key feature of this project is the visual logic builder (Logic Map), which allows users to configure complex branching scenarios based on user responses.

## Core Features

* **Visual Logic Editor:** Build conditional routing between questions using an interactive node-based graph (powered by `@xyflow/react` & `@dagrejs/dagre`).
* **Drag & Drop Question Builder:** Reorder and organize form questions effortlessly with `@dnd-kit`.
* **State Management:** Scalable form data handling powered by Redux Toolkit.
* **Authentication:** Secure OAuth login (Google, GitHub) with Auth.js (NextAuth v5).
* **Automated Testing:** Component & unit tests coverage using Vitest and React Testing Library.
* **Responsive UI:** Fully optimized for seamless use across all devices.

## Tech Stack

* **Framework:** Next.js 16 (App Router)
* **UI Library:** React 19
* **State Management:** Redux Toolkit
* **Graph Visualization:** `@xyflow/react`, `@dagrejs/dagre`
* **Drag & Drop:** `@dnd-kit/core`, `@dnd-kit/sortable`
* **Styling:** Tailwind CSS v4, React Icons
* **Database:** PostgreSQL (Neon)
* **ORM:** Prisma
* **Validation:** Zod
* **Authentication:** Auth.js (NextAuth v5)
* **Testing:** Vitest, React Testing Library, Happy DOM
* **Deployment:** Vercel

---

## Project Structure

```text
src/
├── actions/             # Server Actions (form.actions.ts, response.actions.ts)
├── app/                 # Next.js App Router (Dashboard, Auth, /f/[id] survey runner)
├── auth.ts              # NextAuth v5 configuration
├── components/          # UI Components grouped by feature:
│   ├── builder/         # Form Builder & Logic Map (FormBuilder, FormCanvas, QuestionSettings, LogicMap...)
│   ├── dashboard/       # Dashboard elements (FormCard, CreateDraftFormButton)
│   └── renderer/        # Form Renderer / Survey Runner (FormRenderer, __tests__/)
├── hooks/               # Custom React hooks (useDebounce)
├── lib/                 # Integrations (Prisma client)
├── schemas/             # Zod validation schemas (form.schema.ts, response.schema.ts)
├── store/               # Redux Toolkit (slices, store, __tests__/)
└── utils/               # Helper utilities (validators, localStorageMiddleware)
```

---

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/dima91020/formify.git
cd formify
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables. Create a `.env` file in the root directory and add the following keys:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/dbname?sslmode=require"

# Authentication (generate secret via: openssl rand -base64 32)
AUTH_SECRET="your-generated-secret"
NEXTAUTH_URL="http://localhost:3000"

# Providers
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"
```

4. Run database migrations / push schema:

```bash
npx prisma db push
```

5. Start the development server:

```bash
pnpm dev
```

Open `http://localhost:3000` in your browser to see the result.

---

## Testing

Run unit & component tests with **Vitest**:

```bash
# Run tests once
pnpm test

# Run tests in watch mode
npx vitest
```

---

## Deployment on Vercel

To ensure the project works correctly in a production environment:

1. Import the repository into Vercel.
2. Navigate to **Settings** -> **Environment Variables**.
3. Add all variables from your local `.env` file (ensure values are entered without quotes).
4. Update `NEXTAUTH_URL` to match your actual Vercel domain (e.g., `https://formify-maker.vercel.app`).
5. Configure the build script in `package.json`:

```json
"scripts": {
  "postinstall": "prisma generate",
  "build": "next build"
}
```

6. Trigger a redeployment without using cache if schema changes occur.

---

## License

This project is licensed under the MIT License.
