import React, { useEffect } from "react";
import Footer from "./common/Footer/Footer";
import Header from "./common/Header/Header";
import Home from "./pages/Home";

function App() {
  useEffect(() => {
    const disableBackNavigation = () => {
      window.history.pushState(null, null, window.location.href);
      window.onpopstate = function () {
        window.history.go(1);
      };
    };

    disableBackNavigation();

    return () => {
      window.onpopstate = null;
    };
  }, []);

  return (
    <>
      <Header />
      <div className="global__container">
        <Home />
        <Footer />
      </div>
    </>
  );
}

export default App;
