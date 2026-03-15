# Inboxable

AI-powered inbox management app built with Vite + React + Tailwind CSS and an Express.js backend proxying the Anthropic API.

## Folder Structure

```
/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ChatInput.jsx
│   │   ├── ChatMessage.jsx
│   │   ├── InboxItem.jsx
│   │   ├── InboxList.jsx
│   │   ├── MessageThread.jsx
│   │   └── Sidebar.jsx
│   ├── hooks/
│   │   └── useChat.js
│   ├── utils/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── server/
│   └── index.js
├── api/
│   └── chat.js          # Vercel serverless function
├── .env
├── .gitignore
├── vercel.json
├── package.json
└── vite.config.js
```

## Components

- **Sidebar** – Left panel showing the inbox list and navigation
- **InboxList** – Renders a scrollable list of InboxItem components
- **InboxItem** – Single inbox entry (sender, subject, preview)
- **MessageThread** – Right panel showing the selected conversation thread
- **ChatMessage** – Single message bubble in the thread
- **ChatInput** – Text input + send button for composing messages

## Hooks

- **useChat** – Manages chat state and API calls to `/api/chat`

## Utils

- **api.js** – Fetch wrapper for backend API calls

## Commands

- `npm run dev` – Start Vite dev server on localhost:5173
- `npm run server` – Start Express backend on localhost:3001
- `npm run build` – Production build
- `npm run preview` – Preview production build
