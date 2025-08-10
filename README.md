# Eventrack

A modern, responsive social platform for event discovery and tracking, built with Next.js and Chakra UI.

## 🌟 Features

- **Event Discovery**: Browse and explore upcoming events
- **Social Feed**: Stay updated with event posts and announcements
- **User Profiles**: Personalized user profiles with hobby tracking
- **Community Features**: Connect with other event enthusiasts
- **Real-time Notifications**: Get notified about important event updates
- **Saved Events**: Bookmark events you're interested in
- **Chat Functionality**: Communicate with other users
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Dark Theme**: Modern dark gradient design with smooth animations

## 🚀 Tech Stack

- **Framework**: [Next.js 15.4.6](https://nextjs.org/) with App Router
- **UI Library**: [Chakra UI 2.8.2](https://chakra-ui.com/)
- **Frontend**: React 19.1.0
- **Animations**: [Framer Motion 12.23.12](https://www.framer.com/motion/)
- **Icons**: [React Icons 5.5.0](https://react-icons.github.io/react-icons/)
- **Styling**: Emotion CSS-in-JS

## 📱 Pages & Features

- **Home Feed** (`/`) - Main social feed with event posts
- **Explore** (`/explore`) - Discover new events and communities
- **Communities** (`/communities`) - Connect with event communities
- **Profile** (`/profile`) - User profile management
- **Notifications** (`/notifications`) - Event and social notifications
- **Saved Events** (`/saved`) - Bookmarked events
- **Chat** (`/chat`) - Real-time messaging
- **Authentication** (`/login`, `/signup`) - User authentication
- **Preferences** (`/preferences`) - User settings and preferences

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Jinendra0908/Eventrack.git
   cd Eventrack
   ```

2. **Navigate to the project directory**
   ```bash
   cd eventrack
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000) to see the application

## 📜 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint for code quality

## 🏗️ Project Structure

```
eventrack/
├── app/                    # Next.js App Router pages
│   ├── chat/              # Chat functionality
│   ├── communities/       # Community features
│   ├── explore/           # Event discovery
│   ├── login/             # Authentication
│   ├── notifications/     # Notifications
│   ├── preferences/       # User settings
│   ├── profile/           # User profiles
│   ├── saved/             # Saved events
│   ├── signup/            # User registration
│   ├── layout.js          # Root layout
│   └── page.js            # Home page
├── components/            # Reusable React components
│   ├── Feed.js            # Main feed component
│   ├── PostCard.js        # Event post cards
│   ├── Sidebar.js         # Navigation sidebar
│   ├── RightSidebar.js    # Right sidebar content
│   ├── MobileNavbar.js    # Mobile navigation
│   └── LoadingSpinner.js  # Loading components
├── theme/                 # Chakra UI theme configuration
├── utils/                 # Utility functions
└── public/                # Static assets
```

## 🎨 Design Features

- **Modern Dark Theme**: Gradient backgrounds with teal accents
- **Responsive Layout**: Adaptive design for all screen sizes
- **Smooth Animations**: Powered by Framer Motion
- **Performance Optimized**: Lazy loading and performance monitoring
- **Accessibility**: Built with accessibility best practices

## 🤝 Contributing

This is a team project. To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is part of a team development effort. Please check with the team for licensing information.

## 👥 Team

This project is developed and maintained by our development team.

---

Built with ❤️ using Next.js and Chakra UI
