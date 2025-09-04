import { Check, Shield, Zap, Clock, BarChart2 } from "lucide-react";
import Counter from "./Counter";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const AboutUs = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="about" className="relative overflow-hidden bg-background text-foreground">
      {/* Background Accent */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 w-[600px] sm:w-[800px] -translate-x-1/2 -translate-y-1/3">
          <div className="aspect-square w-full rounded-full from-primary/10 to-secondary/10 bg-gradient-to-br blur-[100px]" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-28">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
          }}
          className="mb-12 md:mb-2"
        >
          <div className="text-center mb-12 md:mb-20">
            <motion.h2
              variants={fadeIn}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 md:mb-8 leading-tight"
            >
              Pioneering in the{" "}
              <span className="text-transparent bg-clip-text bg-primary">
                World of Forex Trading
              </span>
            </motion.h2>

            <motion.div
              variants={fadeIn}
              className="max-w-3xl mx-auto space-y-6 md:space-y-8"
            >
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
                Welcome to{" "}
                <span className="font-semibold text-primary">King Forex</span>,
                your first destination for promising and secure investment opportunities
                in the world of foreign exchange trading.
              </p>

              <div className="py-6 sm:py-8 flex flex-col items-center">
                <div className="relative w-full py-2">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full max-w-md border-t border-border" />
                  </div>
                </div>
              </div>

              <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
                We take pride in working as account managers for our clients in collaboration with{" "}
                <span className="font-semibold">Swissquote Bank</span>, licensed by FINMA as well as the FCA. 
                Swissquote provides deposit protection of up to{" "}
                <span className="font-bold underline decoration-primary/30 decoration-2">
                  100,000 CHF
                </span>
                , reflecting our commitment to the highest standards of safety and trust.
              </p>
            </motion.div>
          </div>

          {/* Quote */}
          <motion.div
            className="bg-card p-6 sm:p-10 rounded-2xl sm:rounded-3xl mb-12 md:mb-16 max-w-3xl mx-auto text-center shadow-md border border-border"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <blockquote className="text-lg sm:text-2xl md:text-3xl font-medium italic text-foreground leading-snug">
              "All you need is one pattern to make a living."
            </blockquote>
          </motion.div>

          {/* Body */}
          <motion.div
            className="max-w-3xl mx-auto space-y-6 md:space-y-8 text-left"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
              We’re proud to unveil our new website—a result of our dedication
              to delivering an advanced trading experience. Through our{" "}
              <span className="font-semibold text-primary">
                $100 portfolio management
              </span>{" "}
              offering, you can step into trading with confidence and no risk.
            </p>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
              At <span className="font-semibold text-primary">Forex King</span>,
              we ensure seamless access to your capital, elite technical
              support, and an intuitive platform built around your financial
              ambitions.
            </p>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
              Begin your path toward consistent income and financial
              prosperity—with a dedicated team by your side every step of the
              way.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            ref={ref}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-12 md:my-20"
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.2 },
              },
            }}
          >
            {[
              { value: 6.6, suffix: "T", label: "Daily Volume" },
              { value: 1, suffix: "M+", label: "Profits Generated" },
              { value: 120, suffix: "+", label: "Currency Pairs" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-card p-6 sm:p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all"
                whileHover={{ y: -6 }}
              >
                <Counter
                  target={stat.value}
                  suffix={stat.suffix}
                  className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
                />
                <p className="text-muted-foreground uppercase text-xs tracking-widest mt-3">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;
