// components/Counter.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Counter = ({ 
  target, 
  duration = 2000, 
  suffix = "",
  className = "",
  decimalPlaces = 1,
  toArabicNumerals = (num: string) => num
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseFloat(target);

    if (start === end) return;

    const incrementTime = 50;
    const totalIncrements = Math.ceil(duration / incrementTime);
    const increment = (end - start) / totalIncrements;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setCount(start);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [target, duration]);

  const formatCount = () => {
    let result = "";
    if (suffix === "T") {
      result = count.toFixed(decimalPlaces) + "T";
    } else if (suffix.includes("M+")) {
      result = `$${Math.floor(count)}M+`;
    } else if (suffix === "+" || suffix.includes("+")) {
      result = Math.floor(count) + "+";
    } else {
      result = Math.floor(count).toString();
    }
    return toArabicNumerals(result);
  };

  return (
    <motion.span 
      className={`font-bold ${className}`}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {formatCount()}
    </motion.span>
  );
};

export default Counter;