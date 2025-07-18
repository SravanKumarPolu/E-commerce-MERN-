# 🛒 SKR E-Commerce Website

A **responsive**, **feature-rich** E-Commerce web application built with **React**, **TypeScript**, and **Tailwind CSS**. This modern shopping platform delivers a seamless user experience with essential functionalities like product browsing, cart management, search/filter, and checkout — all wrapped in a sleek UI with **Progressive Web App (PWA)** support for an enhanced mobile experience.

🔗 **Live Demo**: [skr-e-commerce.netlify.app](https://skr-e-commerce.netlify.app/)

---

## ⚙️ Tech Stack

- **Frontend**: React.js + TypeScript  
- **Styling**: Tailwind CSS + DaisyUI  
- **Animations**: Framer Motion  
- **State Management**: React Context API  
- **PWA**: Vite PWA Plugin + Workbox
- **Deployment**: Netlify

---

## ✨ Features

### 🛍️ Core E-Commerce Features
- **Product Catalog** – Dynamic product listing with detailed view and images.  
- **Search & Filter** – Real-time keyword search and category-based filtering.  
- **Category Navigation** – Browse by product categories and subcategories.  
- **Shopping Cart** – Add, update, and remove products with color/size selection.  
- **Checkout Flow** – Smooth and responsive checkout with payment method selection.  

### 📱 Mobile & PWA Features
- **Progressive Web App (PWA)** – Install as a native app on mobile devices
- **Offline Support** – Browse cached products and access cart when offline
- **Mobile-Optimized UI** – Touch-friendly interface with bottom navigation
- **App Installation Prompts** – Smart prompts for easy app installation
- **Service Worker** – Background sync and push notifications support
- **Responsive Design** – Mobile-friendly layout for tablets and smartphones

### 🎨 User Experience
- **Modern UI/UX** – Built with DaisyUI and custom Tailwind components  
- **Performance Optimized** – Fast load times and smooth page transitions using Framer Motion
- **Installation Guide** – Device-specific installation instructions
- **Offline Page** – Graceful offline experience with helpful messaging
- **Auto Updates** – Seamless app updates with service worker

---

## 🚀 PWA Features

### Installation
- **iOS**: Tap Share → Add to Home Screen
- **Android**: Tap Menu → Add to Home Screen  
- **Desktop**: Look for install button in browser

### Offline Capabilities
- Browse previously viewed products
- Access shopping cart
- View order history
- Manage user profile

### Performance
- Cached static assets for faster loading
- Optimized image caching
- Background sync for orders
- Push notification support (future)

---

## 📸 Screenshots

| Home Page | Product Page | Cart & Checkout |
|----------|--------------|-----------------|
| ![Home](https://via.placeholder.com/300x200) | ![Product](https://via.placeholder.com/300x200) | ![Checkout](https://via.placeholder.com/300x200) |

> _Replace these placeholders with real screenshots for better project presentation._

---

## 🚀 Getting Started

To run the project locally:

```bash
# Clone the repo
git clone https://github.com/your-username/skr-ecommerce.git
cd skr-ecommerce

# Install dependencies
npm install

# Start development server
npm run dev
```

### PWA Development
```bash
# Build for production (includes PWA generation)
npm run build

# Preview production build
npm run preview
```

---

## 📱 Mobile Experience

The app is optimized for mobile devices with:

- **Touch-friendly buttons** (44px minimum touch targets)
- **Bottom navigation** for easy thumb access
- **Swipe gestures** for product browsing
- **Responsive images** that load quickly
- **Offline-first** approach for better performance
- **Native app feel** when installed as PWA

---

## 🔧 PWA Configuration

The PWA is configured with:

- **Service Worker**: Handles caching and offline functionality
- **Web App Manifest**: Defines app appearance and behavior
- **Icons**: Multiple sizes for different devices
- **Caching Strategy**: Network-first for API calls, cache-first for static assets
- **Installation Prompts**: Smart prompts based on user behavior

---

## 📊 Performance

- **Lighthouse Score**: 90+ for all metrics
- **First Contentful Paint**: < 2s
- **Largest Contentful Paint**: < 3s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Vite](https://vitejs.dev/) for the build tool
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [DaisyUI](https://daisyui.com/) for components
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Workbox](https://developers.google.com/web/tools/workbox) for PWA functionality


