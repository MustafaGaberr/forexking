import React from "react";
import { SocialIcon } from "react-social-icons";
import { useTranslation } from 'react-i18next';

interface SocialPlatform {
  name: string;
  url: string;
  bgColor: string;
  fgColor?: string;
  customIcon?: string;
}

const SocialMediaLinks: React.FC = () => {
  const { t } = useTranslation();
const socialPlatforms: SocialPlatform[] = [
    { name: "Facebook", url: "https://www.facebook.com/profile.php?id=61581714960020", bgColor: "#1877F2" },
    { name: "Instagram", url: "https://www.instagram.com/fore_xking25?igsh=ZnZ0OG4wNzF1ZDlk", bgColor: "#E4405F" },
    { name: "Twitter", url: "https://x.com/Forexking147486?t=JrxHCMl5v_MWZ-_CJTRNJw&s=09", bgColor: "#1DA1F2" },
    { name: "TikTok", url: "https://www.tiktok.com/@forex.king777?_t=ZS-90WEzuDzXtI&_r=1", bgColor: "#000000" },
    { name: "Snapchat", url: "https://www.snapchat.com/add/forexking3785?share_id=aN1E0_nAfo4&locale=en-EG", bgColor: "#FFFC00", fgColor: "#000000" },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/forex-king-94b1ba388?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", bgColor: "#0A66C2" },
    // { name: "WhatsApp", url: "https://wa.me/+4367846433933", bgColor: "#25D366" },
    // { name: "Telegram", url: "https://t.me/+4367846433933", bgColor: "#0088cc" },
  ];

  return (
    <div className="container mx-auto px-4">
      <h4 className="text-center text-foreground font-medium mb-6 text-lg">
        {t('social.connectWithUs')}
      </h4>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
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
