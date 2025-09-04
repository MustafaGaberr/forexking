import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Card, CardContent } from "./ui/card";
import { BookOpen, Users, TrendingUp } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const VideoTutorial = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <section
      id="video-tutorial"
      className="relative overflow-hidden bg-background"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 right-1/2 w-[500px] sm:w-[700px] translate-x-1/2 translate-y-1/3">
          <div className="aspect-square w-full rounded-full bg-accent/10 dark:bg-accent/20 blur-[80px]" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
          }}
        >
          {/* Section Header */}
          <motion.div variants={fadeIn} className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 md:mb-8 leading-tight">
              Learn How to{" "}
              <span className="text-transparent bg-clip-text bg-primary">
                Open Your Account
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Watch our comprehensive video tutorial and discover how easy it is
              to start your trading journey with King Forex.
            </p>
          </motion.div>

          {/* Video Container */}
          <motion.div
            variants={fadeIn}
            className="relative max-w-4xl mx-auto mb-12 md:mb-16"
          >
            <Card className="overflow-hidden shadow-2xl bg-card border-border">
              <CardContent className="p-0 relative">
                <div className="relative aspect-video bg-background">
                  <video
                    ref={videoRef}
                    src="/Assets/openAcc.MP4"
                    controls
                    className="w-full h-full object-cover"
                    playsInline
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Benefits Grid */}
          <motion.div
            variants={fadeIn}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
          >
            {[
              {
                icon: BookOpen,
                title: "Step-by-Step Guide",
                description:
                  "Clear instructions for account registration and verification process",
              },
              {
                icon: Users,
                title: "Expert Support",
                description:
                  "Get help from our dedicated team throughout the setup process",
              },
              {
                icon: TrendingUp,
                title: "Start Trading",
                description:
                  "Begin your trading journey with confidence and professional guidance",
              },
            ].map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div key={index} variants={fadeIn} className="text-center">
                  <Card className="p-6 h-full bg-card border-border hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-0">
                      <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        {benefit.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoTutorial;
