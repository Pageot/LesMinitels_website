import React from "react";
import { Link } from "react-router";

export function Navbar() {
  return (
    <div className="w-full flex items-start">
      <Link to="/" className="block h-12 w-12 md:h-16 md:w-16 lg:h-[81px] lg:w-[79px] shrink-0 transition-transform hover:scale-105" aria-label="Retour à l'accueil">
        <img 
          src="https://raw.githubusercontent.com/Pageot/WebsiteLesMinitels-assets/312f6b5dbe50f5492d92c2653abdca6385bde886/Logo_LesMinitels.svg" 
          alt="Logo Les Minitels" 
          className="block w-full h-full"
        />
      </Link>
    </div>
  );
}
