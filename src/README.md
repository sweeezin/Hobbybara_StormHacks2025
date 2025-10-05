# MerriMates - React Social Networking App

MerriMates is a social networking application built with React that helps people find friends who share their passions through hobbies, interests, and personality compatibility.

## Features

- 🔐 **Authentication System**: Login/signup with email verification
- 👤 **Profile Creation**: Nickname, age, pronouns, location setup
- 🎯 **Hobby Selection**: Choose from 160+ categorized hobbies (1-10 selections)
- 📚 **Learning Interests**: Select what you want to learn about
- 🧠 **Personality Matching**: Extrovert/Introvert compatibility
- 🔍 **Advanced Search**: Filter by age, hobby, and personality type
- 👥 **Friend Management**: Add, remove, block/unblock friends
- 💬 **Messaging System**: Chat with your connections
- ⚙️ **Comprehensive Settings**: Security, blocked users, audio controls
- 🎨 **Responsive Design**: Soft, friendly aesthetic with rounded corners

## Tech Stack

- **Framework**: React with modern hooks
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom shadcn/ui components
- **Icons**: Lucide React
- **Font**: Merriweather (Google Fonts)
- **Language**: TypeScript

## Color Palette

- **Background Gradient**: #809671 to #b4c7a7
- **Primary Elements**: #48573e (tabs/buttons)
- **Text**: #faf2e6 (Merriweather font)
- **Design**: Soft, friendly, cutesy aesthetic

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd merrimates
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm start
# or
yarn start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
merrimates/
├── App.tsx              # Main application component
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   └── figma/          # Figma-specific components
├── data/               # Static data (hobbies, cities)
├── types/              # TypeScript type definitions
├── styles/             # Global styles
└── guidelines/         # Project guidelines
```

## Key Components

- **LoginPage/SignupPage**: Authentication flow
- **ProfileSetupPage**: Initial profile creation
- **HobbiesPage**: Hobby selection interface
- **LearningInterestsPage**: Learning preferences
- **PersonalityPage**: Personality type selection
- **MainPage**: Main app interface with sidebar
- **AppSidebar**: Collapsible navigation sidebar
- **SearchResults**: User discovery and filtering

## Data Storage

Currently uses localStorage for data persistence. In production, you would integrate with a backend database and authentication service.

## Performance Optimizations

- React.useMemo for expensive computations
- Optimized mock user generation
- Error handling for localStorage operations
- Loading states for better UX
- Optimized component rendering

## Development

### Adding New Hobbies

Edit `/data/hobbies.ts` to add new hobby categories and items.

### Adding New Cities

Edit `/data/cities.ts` to add new location options.

### Styling Guidelines

- Use the existing color palette
- Maintain rounded corners (rounded-xl, rounded-2xl)
- Follow the soft, friendly aesthetic
- Use Merriweather font family

## Build and Deploy

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Contributing

1. Follow the existing code style
2. Use TypeScript for all new components
3. Maintain the friendly, accessible design
4. Test on both desktop and mobile
5. Follow Next.js best practices

## License

This project is private and proprietary.