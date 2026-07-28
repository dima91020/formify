# 📝 Formify

**Formify** — це сучасний веб-додаток для створення, налаштування та проходження інтерактивних форм і опитувальників. Проєкт побудований на стеку Next.js 16 (App Router), React 19, Redux Toolkit та Prisma ORM.

---

## ✨ Основні можливості

- 🛠 **Інтерактивний Конструктор Форм (Form Builder):**
  - Додавання та налаштування запитань різних типів (текстові відповіді, вибір одного або кількох варіантів).
  - Сортування запитань методом **Drag & Drop** (за допомогою `@dnd-kit`).
  - Налаштування обов'язкових полів, заголовків та варіантів відповідей.
  
- 🔀 **Візуальна карта логіки (Logic Map):**
  - Інтерактивна діаграма розгалужень та переходів між питаннями (за допомогою `@xyflow/react` та `@dagrejs/dagre`).

- 🎯 **Проходження форм (Form Renderer):**
  - Динамічне відображення форми для користувача.
  - Автозбереження прогресу в `localStorage`.
  - Валідація відповідей та надсилання даних через **Server Actions**.

- 📊 **Дашборд користувача:**
  - Управління чернетками та опублікованими формами.
  - Швидке копіювання посилань та зміна статусів публікації.

---

## 🛠 Технологічний стек

- **Фреймворк:** [Next.js 16 (App Router)](https://nextjs.org/) & React 19
- **Стейт-менеджмент:** [Redux Toolkit](https://redux-toolkit.js.org/)
- **База даних & ORM:** PostgreSQL / Neon DB та [Prisma ORM 7](https://www.prisma.io/)
- **Аутентифікація:** [NextAuth.js v5 (Auth.js)](https://authjs.dev/)
- **Стилізація:** Tailwind CSS v4 & React Icons
- **Інтерактивність & Графи:** `@dnd-kit` (Drag-and-Drop), `@xyflow/react` (React Flow), `@dagrejs/dagre`
- **Валідація:** Zod
- **Тестування:** Vitest & React Testing Library (Happy DOM)

---

## 📁 Структура проєкту

```text
src/
├── actions/             # Server Actions для форм та відповідей (form.actions.ts, response.actions.ts)
├── app/                 # Маршрути Next.js App Router (Дашборд, Auth, Екран проходження /f/[id])
├── auth.ts              # Конфігурація NextAuth v5
├── components/          # UI-компоненти, розділені за фічами:
│   ├── builder/         # Конструктор форм (FormBuilder, FormCanvas, QuestionSettings, LogicMap...)
│   ├── dashboard/       # Елементи дашборду (FormCard, CreateDraftFormButton)
│   └── renderer/        # Програвач/Рендерер форми (FormRenderer, __tests__/)
├── hooks/               # Кастомні React хуки (useDebounce)
├── lib/                 # Інтеграції (Prisma Client)
├── schemas/             # Схеми валідації Zod (form.schema.ts, response.schema.ts)
├── store/               # Redux Toolkit (slices, store, __tests__/)
└── utils/               # Допоміжні утиліти (validators, localStorageMiddleware)
```

---

## 🚀 Запуск проєкту локально

### 1. Клонування та встановлення залежностей

```bash
pnpm install
```

### 2. Налаштування середовища (`.env`)

Створіть файл `.env` у корені проєкту та додайте необхідні змінні:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/formify"
AUTH_SECRET="your-secret-key"
```

### 3. Міграції бази даних

```bash
npx prisma db push
```

### 4. Запуск сервера розробки

```bash
pnpm dev
```

Відкрийте [http://localhost:3000](http://localhost:3000) у вашому браузері.

---

## 🧪 Тестування

Для запуску юніт-тестів та компонентних тестів через **Vitest**:

```bash
# Одноразовий запуск тестів
pnpm test

# Запуск у режимі спостереження (watch mode)
npx vitest
```
