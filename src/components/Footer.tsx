import React from "react";
import { Link } from "react-router-dom";
import SocialMediaLinks from "./SocialMedia";
import { ArrowRight } from "lucide-react";

const Footer = () => {
  return (
   <footer className="w-full mt-auto bg-background text-foreground">
  {/* Top Section with Steps */}
  {/* <div className="bg-secondary text-foreground py-12">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        {["Apply", "Fund", "Trade"].map((step, i) => (
          <div className="text-center" key={i}>
            <div className="flex justify-center items-center mb-2">
              <span className="bg-primary rounded-full w-10 h-10 flex items-center justify-center text-primary-foreground font-bold text-xl">
                {i + 1}
              </span>
              {i < 2 && (
                <div className="hidden md:block h-[2px] w-16 bg-muted mx-2"></div>
              )}
            </div>
            <h3 className="font-bold text-lg mb-1">{step}</h3>
            <p className="text-sm">
              {i === 0 && "for a trading account"}
              {i === 1 && "easily and securely"}
              {i === 2 && "our full range of markets"}
            </p>
          </div>
        ))}

        <div className="flex flex-col sm:flex-row gap-4">
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-2 rounded-md flex items-center justify-center">
            START TRADING <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </div> */}

  {/* Social Media Section */}
  <div className="bg-background py-8">
    <div className="container mx-auto px-4">
      <SocialMediaLinks />

      {/* Help Section */}
      <div className="mt-8 flex flex-col items-center gap-2">
        <h4 className="text-xl font-semibold">Need help?</h4>
        <Link to="#" className="text-primary font-medium hover:text-accent">
          Contact Support
        </Link>
      </div>
    </div>
  </div>

  {/* Legal Notice Section */}
  <div className="bg-card py-6 border-t border-border">
    <div className="container mx-auto px-4 text-sm text-muted-foreground max-w-5xl text-center">
      <p className="mb-4">
        Please note that foreign exchange and other leveraged trading involves significant risk of loss. It is not
        suitable for all investors and you should make sure you understand the risks involved, seeking independent
        advice if necessary.
      </p>
      <p className="mb-4">
        The products and services available to you at ForexKing.com will depend on your location and on which of its
        regulated entities holds your account.
      </p>

      {/* Logo & Copyright */}
      <div className="flex flex-col items-center justify-center gap-3 mb-4">
        <img 
          src="/Assets/SymbolColored.svg" 
          alt="Forex King Logo" 
          className="h-16 w-auto"
        />
        <p>© ForexKing.COM {new Date().getFullYear()}</p>
      </div>

    </div>
  </div>
</footer>

  );
};

export default Footer;
