import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const MarketSentimentCard: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => setProgress(75), 500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Card className="p-6 rounded-xl shadow-md transition-colors 
                     bg-background text-foreground 
                     dark:bg-secondary dark:text-light">
      <h2 className="text-2xl font-bold mb-4">Market Sentiment</h2>

      {/* Gradient Sentiment Bar */}
      <div className="relative h-40 flex items-center justify-center">
        <div
          className="absolute w-full h-4 rounded-full"
          style={{
            background: `linear-gradient(to right, 
              #dc2626 0%,     /* Red bearish */
              #e7ef45 50%,    /* Lime neutral */
              #8bc53f 100%    /* Green bullish */
            )`,
          }}
        />
        {/* Marker */}
        <div
          className="absolute h-6 w-2 bg-accent transform -translate-x-1/2 -translate-y-1/2 left-[75%] rounded-full shadow-lg"
        />
      </div>

      {/* Labels */}
      <div className="mt-4 flex justify-between text-sm text-muted-foreground dark:text-light/70">
        <span>Bearish</span>
        <span>Neutral</span>
        <span>Bullish</span>
      </div>

      {/* Progress bar + status */}
      <div className="mt-4">
        <Progress
          value={progress}
          className="w-full h-2 bg-muted [&>div]:bg-primary transition-all duration-700"
        />
        <p className="mt-2 text-center font-medium">
          Strong Bullish Signal •{" "}
          <span className="font-bold text-primary">{progress}% Confidence</span>
        </p>
      </div>
    </Card>
  );
};

export default MarketSentimentCard;
