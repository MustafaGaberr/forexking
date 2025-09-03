import React from "react";
import { SocialIcon } from "react-social-icons";

interface SocialPlatform {
  name: string;
  url: string;
  bgColor: string;
  fgColor?: string;
  customIcon?: string;
}

const SocialMediaLinks: React.FC = () => {
const socialPlatforms: SocialPlatform[] = [
    { name: "Facebook", url: "https://facebook.com/forexking", bgColor: "#1877F2" },
    { name: "Instagram", url: "https://instagram.com/forexking", bgColor: "#E4405F" },
    { name: "Twitter", url: "https://twitter.com/forexking", bgColor: "#1DA1F2" },
    { name: "TikTok", url: "https://tiktok.com/@forexking", bgColor: "#000000" },
    { name: "Snapchat", url: "https://snapchat.com/add/forexking", bgColor: "#FFFC00", fgColor: "#000000" },
    { name: "WhatsApp", url: "https://wa.me/+1234567890", bgColor: "#25D366" },
    { name: "VK", url: "https://vk.com/forexking", bgColor: "#0077FF" },
    { name: "WeChat", url: "https://wechat.com/forexking", bgColor: "#07C160" },
    { name: "Weibo", url: "https://weibo.com/forexking", bgColor: "#DF2029", customIcon: "/Assets/weibo-icon.svg" },
    { name: "LINE", url: "https://line.me/ti/p/forexking", bgColor: "#00C300" },
  ];

  return (
    <div className="container mx-auto px-4">
      <h4 className="text-center text-foreground font-medium mb-6 text-lg">
        Connect With Us
      </h4>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
  {socialPlatforms.map((platform) => (
    <a
      href={platform.url}
      key={platform.name}
      title={platform.name}
      aria-label={`Visit us on ${platform.name}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg transition-all duration-300 hover:bg-secondary group"
    >
      <div className="rounded-full transform transition-transform duration-300 group-hover:scale-110">
        {platform.customIcon ? (
          <img
            src={platform.customIcon}
            alt={platform.name}
            className="w-10 h-10 rounded-full"
            style={{
              backgroundColor: platform.bgColor,
              padding: "5px",
            }}
          />
        ) : (
          <SocialIcon
            url={platform.url}
            bgColor={platform.bgColor}
            fgColor={platform.fgColor || "#FFFFFF"}
            style={{ width: 40, height: 40 }}
            target="_blank"
            rel="noopener noreferrer"
            as="div" 
          />
        )}
      </div>
      <span className="text-sm text-foreground text-center">
        {platform.name}
      </span>
    </a>
  ))}
</div>
    </div>
  );
};

export default SocialMediaLinks;
