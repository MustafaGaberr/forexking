import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim"; // Faster loading

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <div className="absolute inset-0 z-[1]"> {/* Changed z-index */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: false, zIndex: 0 }, // Explicit zIndex
          background: { color: "transparent" },
          particles: {
            number: { 
              value: 80, 
              density: { enable: true, area: 800 } 
            },
            color: { 
              value: ["#FFFFFF", "#FFD700"], // White and gold
            },
            shape: { 
              type: ["circle", "star"], 
              options: { star: { sides: 5 } } 
            },
            opacity: { 
              value: { min: 0.3, max: 0.8 }, // More visible
              animation: { enable: true, speed: 1 }
            },
            size: { 
              value: { min: 2, max: 5 }, // Larger particles
              random: true 
            },
            move: {
              enable: true,
              speed: 0.5,
              outModes: "bounce"
            },
            twinkle: {
              particles: { enable: true, frequency: 0.05 }
            }
          },
          interactivity: {
            events: {
              onHover: { 
                enable: true, 
                mode: "bubble",
                parallax: { enable: false } // Fixes slider conflict
              },
              onClick: { enable: false } // Disable to prevent slider issues
            },
            modes: {
              bubble: { distance: 100, size: 6, duration: 2 }
            }
          },
          detectRetina: true
        }}
      />
    </div>
  );
};

export default ParticlesBackground;