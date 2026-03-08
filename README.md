# Docket - AI-Powered Food Ordering Application

Docket is a modern food ordering application that combines a traditional menu browsing experience with an AI-powered chat interface. Users can browse food items, manage their cart, and interact with an AI assistant to search, compare, and order food.

## Tech Stack

- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **AI Integration**: Vercel AI SDK with Anthropic Claude
- **Icons**: Lucide React
- **Validation**: Zod
- **Language**: TypeScript

## Project Architecture

```
src/app/
├── _components/           # Main app UI components
│   ├── body/              # Menu browsing components
│   │   ├── Body.tsx       # Main content area
│   │   ├── Menu.tsx       # Food items grid
│   │   └── SearchBar.tsx  # Search functionality
│   ├── cart/              # Shopping cart components
│   │   ├── Cart.tsx       # Cart display
│   │   └── CheckoutPopup.tsx
│   ├── SideBar.tsx        # Category navigation
│   └── ChatInputStatic.tsx # Static chat entry point
│
├── chat-gen-ui/           # AI Chat interface (Generative UI)
│   ├── page.tsx           # Chat page with AI integration
│   └── _components/
│       ├── ChatInput.tsx
│       ├── ChatHeader.tsx
│       ├── ChatMessages.tsx
│       └── ChatMessagesComponents/
│           ├── ChatContent.tsx
│           ├── WelcomeMessge.tsx
│           └── StreamIndicator.tsx
│
├── api/                   # API routes
│   ├── chat/              # AI chat endpoint
│   │   ├── route.ts       # Streaming chat API
│   │   └── tools/
│   │       └── agent-tools.tsx  # AI agent tools
│   └── get-food/
│       ├── route.ts       # Food data API
│       └── Foods.json     # Food database
│
├── lib/                   # Shared utilities
│   ├── common-ui/         # Reusable UI components
│   │   ├── FoodCard.tsx   # Food item display card
│   │   ├── ComparisonChart.tsx
│   │   └── YesNoPrompt.tsx
│   └── utils/
│       └── filterFoodsByQuery.ts
│
├── store/
│   └── store.ts           # Zustand global state
│
├── page.tsx               # Home page (menu browsing)
├── layout.tsx             # Root layout
└── globals.css            # Global styles
```

## Key Features

### 1. Menu Browsing Interface
- **Category Navigation**: Sidebar with food categories (North Indian, South Indian, Mughlai, Street Food, etc.)
- **Food Cards**: Rich display cards showing dish images, nutrition info, ingredients, and pricing
- **Search**: Filter food items by name, description, or ingredients
- **Cart Management**: Add/remove items with quantity controls

### 2. AI Chat Interface (Generative UI)
The chat interface uses Vercel AI SDK's streaming capabilities with tool calling to provide an interactive experience.

**Available AI Tools:**
| Tool | Description |
|------|-------------|
| `getSearchResults` | Search food items by query |
| `renderFoodCards` | Display food cards in chat |
| `askForComparison` | Prompt user to compare dishes |
| `compareDishes` | Show nutritional comparison chart |
| `addToCart` | Add items to cart via chat |
| `removeFromCart` | Remove single item from cart |
| `removeAllFromCart` | Remove all of a specific item |
| `clearCart` | Empty the entire cart |
| `proceedToCheckout` | Initiate checkout flow |

### 3. State Management
Zustand stores manage:
- **Food Store**: Food data, selected category, search query
- **Cart Store**: Cart items with add/remove/clear operations
- **User Store**: User information (name, phone, address)
- **Chat Store**: Persisted chat messages
- **Checkout Store**: Checkout popup visibility

## Data Flow

```
┌─────────────────┐     ┌─────────────────┐
│   Menu Browse   │     │   AI Chat UI    │
│   (page.tsx)    │     │ (chat-gen-ui/)  │
└────────┬────────┘     └────────┬────────┘
         │                       │
         │                       ▼
         │              ┌─────────────────┐
         │              │  /api/chat      │
         │              │  (Claude AI)    │
         │              └────────┬────────┘
         │                       │
         ▼                       ▼
┌─────────────────────────────────────────┐
│           Zustand Global State          │
│  (Food, Cart, User, Chat, Checkout)     │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│              Foods.json                 │
│           (Food Database)               │
└─────────────────────────────────────────┘
```

## Getting Started

### Prerequisites
- Node.js 18+
- Anthropic API key

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
# Create a .env.local file with:
ANTHROPIC_API_KEY=your_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the menu interface, or navigate to `/chat-gen-ui` for the AI chat experience.

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | API key for Claude AI integration |

## License

Private
