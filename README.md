# QuickServe 🚀

A sleek and modern service hour tracking application built with Next.js, Firebase, and TypeScript.

## ✨ Features

- **Firebase Authentication** - Secure login with email/password and Google OAuth
- **Real-time Database** - Cloud Firestore for instant data synchronization
- **Time Tracking** - Easy clock in/out functionality with automatic duration calculation
- **Service Hour Logs** - Comprehensive history with filtering and search capabilities
- **Statistics Dashboard** - Track progress with beautiful visual cards
- **Next.js 14** - Latest version with App Router and TypeScript
- **Tailwind CSS** - Modern styling with glass morphism effects
- **Framer Motion** - Smooth animations and transitions
- **Responsive Design** - Mobile-first approach that works on all devices
- **Secure & Private** - User data protected with Firebase security rules

## 🎨 Design Features

- Beautiful gradient backgrounds with animated blobs
- Glass morphism effects for modern UI elements
- Smooth scroll animations with Framer Motion
- Responsive navigation with mobile-friendly design
- Modern typography with Inter font
- Accessible components built with Radix UI

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run the development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── app/                    # Next.js 14 app directory
│   ├── globals.css        # Global styles and Tailwind imports
│   ├── layout.tsx         # Root layout component
│   └── page.tsx          # Home page component
├── components/            # Reusable UI components
│   └── ui/               # UI component library
│       ├── Button.tsx    # Custom button component
│       └── Card.tsx      # Card components with variants
├── public/               # Static assets
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
├── next.config.js       # Next.js configuration
└── package.json         # Project dependencies
```

## 🛠 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎯 Customization

### Colors
Update the color scheme in `tailwind.config.js`:

```javascript
colors: {
  primary: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  // Add your custom colors
}
```

### Animations
Add custom animations in `tailwind.config.js`:

```javascript
animation: {
  'custom-bounce': 'bounce 1s infinite',
  'fade-in': 'fadeIn 0.5s ease-in-out',
}
```

### Components
The template includes reusable components in the `components/ui/` directory:

- **Button**: Multiple variants (primary, secondary, outline, ghost)
- **Card**: Glass morphism and elevated variants
- **Layout**: Responsive navigation and footer

## 📱 Responsive Design

The template is built with a mobile-first approach:

- **Mobile**: Optimized for touch interactions
- **Tablet**: Responsive grid layouts
- **Desktop**: Full-featured experience with hover states

## 🔧 Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Lucide React](https://lucide.dev/) - Icons
- [Radix UI](https://www.radix-ui.com/) - Accessible components

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import your project on [Vercel](https://vercel.com)
3. Deploy with one click

### Other Platforms
- **Netlify**: Build command `npm run build`, publish directory `.next`
- **Railway**: Connect your GitHub repository
- **Digital Ocean**: Use App Platform with Node.js buildpack

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 💡 Tips

- Customize the gradient colors in `app/layout.tsx`
- Add new pages in the `app/` directory
- Modify animations in individual components
- Use the included UI components for consistency
- Leverage Tailwind's utility classes for rapid development

---

Built with ❤️ using modern web technologies. 