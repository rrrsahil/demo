import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top of window, document, and body to handle all layout types
    const scrollOptions = { top: 0, left: 0, behavior: "auto" };
    
    window.scrollTo(scrollOptions);
    document.documentElement.scrollTo(scrollOptions);
    document.body.scrollTo(scrollOptions);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
