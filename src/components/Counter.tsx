// components/Counter.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Counter = ({ 
  target, 
  duration = 2000, 
  suffix = "",
  className = "",
  decimalPlaces = 1
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
    if (suffix === "T") {
      return count.toFixed(decimalPlaces) + "T";
    }
    if (suffix === "M+") {
      return `$${Math.floor(count)}M+`;
    }
    if (suffix === "+") {
      return Math.floor(count) + "+";
    }
    return Math.floor(count);
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