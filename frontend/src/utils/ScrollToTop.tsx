// src/utils/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // SSR safety check
    if (typeof window !== "undefined") {
      // Only scroll to top if no hash is present
      if (!hash) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
