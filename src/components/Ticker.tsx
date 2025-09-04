import { useEffect, useState } from "react";

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
  const [currencies, setCurrencies] = useState<CurrencyData[]>(currencyPairs);

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
    <div className="bg-secondary text-secondary-foreground py-2 overflow-hidden">
      <div className="animate-ticker whitespace-nowrap inline-block">
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
