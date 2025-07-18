import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PWAInstallGuide = () => {
  const [showGuide, setShowGuide] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Detect device type
    const userAgent = navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
    setIsAndroid(/android/.test(userAgent));
    setIsDesktop(!isIOS && !isAndroid);

    // Show guide after 5 seconds if not installed
    const timer = setTimeout(() => {
      if (!window.matchMedia('(display-mode: standalone)').matches) {
        setShowGuide(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShowGuide(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-guide-dismissed', 'true');
  };

  const handleInstall = () => {
    // Trigger install prompt if available
    const event = new Event('beforeinstallprompt');
    window.dispatchEvent(event);
    setShowGuide(false);
  };

  if (showGuide && !sessionStorage.getItem('pwa-guide-dismissed')) {
    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">📱</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Install SKR Store
              </h3>
              <p className="text-gray-600 text-sm">
                Get the best shopping experience with our mobile app!
              </p>
            </div>

            {/* Installation Instructions */}
            <div className="space-y-4 mb-6">
              {isIOS && (
                <div className="bg-blue-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-blue-900 mb-2">📱 iOS Instructions:</h4>
                  <ol className="text-sm text-blue-800 space-y-1">
                    <li>1. Tap the <strong>Share</strong> button in Safari</li>
                    <li>2. Scroll down and tap <strong>"Add to Home Screen"</strong></li>
                    <li>3. Tap <strong>"Add"</strong> to install</li>
                  </ol>
                </div>
              )}

              {isAndroid && (
                <div className="bg-green-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-green-900 mb-2">🤖 Android Instructions:</h4>
                  <ol className="text-sm text-green-800 space-y-1">
                    <li>1. Tap the <strong>Menu</strong> button (⋮)</li>
                    <li>2. Tap <strong>"Add to Home screen"</strong></li>
                    <li>3. Tap <strong>"Add"</strong> to install</li>
                  </ol>
                </div>
              )}

              {isDesktop && (
                <div className="bg-purple-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-purple-900 mb-2">💻 Desktop Instructions:</h4>
                  <ol className="text-sm text-purple-800 space-y-1">
                    <li>1. Look for the <strong>Install</strong> button in your browser</li>
                    <li>2. Or press <strong>Ctrl+Shift+I</strong> (Chrome) and look for install option</li>
                    <li>3. Click <strong>"Install"</strong> to add to desktop</li>
                  </ol>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-3 text-gray-600 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Maybe Later
              </button>
              {!isIOS && (
                <button
                  onClick={handleInstall}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  Install Now
                </button>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return null;
};

export default PWAInstallGuide; 