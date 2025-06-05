# HostWP Marketing Website

A modern, responsive marketing website for HostWP built with React, Vite, and Tailwind CSS. This website showcases HostWP's hosting services, products, and company information with smooth animations and a professional design.

## 🚀 Features

- **Modern React Architecture**: Built with React 19 and modern hooks
- **Fast Development**: Powered by Vite for lightning-fast development and builds
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Smooth Animations**: Enhanced user experience with Framer Motion and GSAP
- **SEO Optimized**: Structured for search engine optimization
- **Component-Based**: Reusable UI components for maintainability
- **Content Management**: JSON-based content management system
- **Analytics Integration**: Built-in analytics tracking utilities

## 🛠️ Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 3
- **Animations**: Framer Motion & GSAP
- **Routing**: React Router DOM 7
- **Icons**: Lucide React
- **Linting**: ESLint 9

## 📁 Project Structure

```
├── hostwp-website/          # Main application directory
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── animations/  # Animation components
│   │   │   ├── layout/      # Layout components (Header, Footer, etc.)
│   │   │   └── ui/          # UI components (Button, Card, etc.)
│   │   ├── data/           # JSON data files
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   │   └── legal/      # Legal pages (Terms, Privacy, etc.)
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── package.json        # Dependencies and scripts
└── README.md              # This file
```

## 🚦 Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Hostwpv2
   ```

2. **Navigate to the project directory**
   ```bash
   cd hostwp-website
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to view the website

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📄 Pages

The website includes the following pages:

- **Home** - Landing page with hero section and key features
- **Products** - Hosting products and services
- **Domains** - Domain registration services
- **Our Story** - Company information and history
- **White Glove Support** - Premium support services
- **Contact** - Contact information and forms
- **Legal Pages**:
  - Terms of Service
  - Privacy Policy
  - FAQ
  - Acceptable Use Policy (AUP)

## 🎨 Customization

### Content Management

Content is managed through JSON files located in [`src/data/`](hostwp-website/src/data/):
- [`content.json`](hostwp-website/src/data/content.json) - Main content data
- [`navigation.json`](hostwp-website/src/data/navigation.json) - Navigation structure

### Styling

The project uses Tailwind CSS for styling. Configuration can be found in:
- [`tailwind.config.js`](hostwp-website/tailwind.config.js) - Tailwind configuration
- [`postcss.config.js`](hostwp-website/postcss.config.js) - PostCSS configuration

### Components

Reusable components are organized in [`src/components/`](hostwp-website/src/components/):
- **UI Components**: Basic building blocks like buttons, cards, etc.
- **Layout Components**: Header, footer, and layout wrappers
- **Animation Components**: Scroll animations and transitions

## 🔧 Development

### Code Structure

- **Components**: Follow a modular approach with reusable components
- **Hooks**: Custom hooks for shared logic (e.g., [`useContent.js`](hostwp-website/src/hooks/useContent.js))
- **Utils**: Utility functions for analytics and external integrations
- **Data**: JSON-based content management for easy updates

### Best Practices

- Use functional components with hooks
- Follow ESLint configuration for code quality
- Implement responsive design patterns
- Optimize for performance and SEO

## 📱 Responsive Design

The website is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🚀 Deployment

1. **Build the project**
   ```bash
   cd hostwp-website
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting provider

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary and confidential. All rights reserved.

## 📞 Support

For support and questions, please contact the HostWP development team.

---

Built with ❤️ by the HostWP team