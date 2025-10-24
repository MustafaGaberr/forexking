import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

interface CurrencyData {
  pair: string;
  price: string;
  change: number;
}

const currencyPairs: CurrencyData[] = [
  { pair: "EUR/USD", price: "1.0842", change: 0.15 },
  { pair: "GBP/USD", price: "1.2687", change: -0.08 },
  { pair: "USD/JPY", price: "153.38", change: 0.22 },
  { pair: "USD/CHF", price: "0.8975", change: -0.12 },
  { pair: "AUD/USD", price: "0.6602", change: 0.1 },
  { pair: "USD/CAD", price: "1.3603", change: -0.05 },
];

const Ticker = () => {
  const { theme } = useTheme();
  const [currencies, setCurrencies] = useState<CurrencyData[]>(currencyPairs);
  const [currentTheme, setCurrentTheme] = useState<string | undefined>(theme);

  // Monitor theme changes
  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrencies((prevCurrencies) =>
        prevCurrencies.map((currency) => ({
          ...currency,
          price: (
            parseFloat(currency.price) +
            (Math.random() * 0.001 - 0.0005)
          ).toFixed(4),
          change: parseFloat(
            (currency.change + (Math.random() * 0.02 - 0.01)).toFixed(2)
          ),
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-secondary text-secondary-foreground py-2 overflow-hidden relative">
      {/* Bank Logo - Fixed position on the left, positioned after sidebar */}
      <div className="absolute top-0 h-full z-10 flex items-center bg-secondary px-4 ticker-logo">
        {/* Day Logo - Hidden in dark mode */}
        {/* <img 
          src="/Assets/swissquote day logo.svg" 
          alt="Swissquote Bank" 
          className={`h-8 w-auto object-contain ${currentTheme === 'dark' ? 'hidden' : 'block'}`}
        /> */}
        {/* Dark Logo - Hidden in light mode */}
        {/* <img 
          src="/Assets/swissquote dark logo.svg" 
          alt="Swissquote Bank" 
          className={`h-8 w-auto object-contain ${currentTheme === 'dark' ? 'block' : 'hidden'}`}
        /> */}
      </div>
      
      {/* Ticker content - moves behind the logo */}
      <div className="animate-ticker whitespace-nowrap inline-block ticker-content">
        <div className="inline-flex items-center space-x-6">
          {currencies.map((currency, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="font-medium">{currency.pair}</span>
              <span>{currency.price}</span>
              <span
                className={`text-xs ${
                  currency.change >= 0 ? "text-primary" : "text-destructive"
                }`}
              >
                {currency.change >= 0 ? "+" : ""}
                {currency.change}%
              </span>
              {index < currencies.length - 1 && (
                <span className="text-muted-foreground">|</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Ticker;
