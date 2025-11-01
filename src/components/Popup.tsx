import React from "react"
import { useTranslation } from 'react-i18next'

type PopupProps = {
  message: string
  onClose: () => void
}

const Popup = ({ message, onClose }: PopupProps) => {
  const { i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  // Parse the message to extract phone numbers for creating WhatsApp and Telegram links
  const phoneNumbers = ['+17742739477', '+17742739477']

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50 p-4">
      <div className="bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-850 dark:to-gray-800 p-8 md:p-10 rounded-2xl shadow-2xl max-w-3xl w-full border border-primary/20">
        {/* Header with icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Message */}
        <div className={`mb-8 ${isArabic ? 'text-right' : 'text-left'}`}>
          <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4 text-center">
            {isArabic ? 'مرحباً بك!' : 'Welcome!'}
          </h3>
          <div className="space-y-4">
            <p className="text-base md:text-lg text-foreground leading-relaxed text-center">
              {isArabic 
                ? 'للتحقق من حسابك بسرعة، يُرجى التواصل معنا عبر واتساب أو تيليجرام:'
                : 'To verify your account quickly, please contact us via WhatsApp or Telegram:'}
            </p>
            
            {/* WhatsApp and Telegram Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              {/* WhatsApp Buttons */}
              {phoneNumbers.map((phone) => (
                <a
                  key={`wa-${phone}`}
                  href={`https://wa.me/${phone.replace(/\+/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative overflow-hidden bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group px-4 py-5"
                >
                  {/* Background Icon Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-15 transition-opacity">
                    <svg className="w-24 h-24 transform rotate-12" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center justify-center gap-1.5">
                    <span className="text-xs font-bold tracking-wide">WhatsApp</span>
                    <span className="text-sm font-semibold leading-tight text-center">{phone}</span>
                  </div>
                </a>
              ))}
              
              {/* Telegram Buttons */}
              {phoneNumbers.map((phone) => (
                <a
                  key={`tg-${phone}`}
                  href={`https://t.me/${phone.replace(/\+/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group px-4 py-5"
                >
                  {/* Background Icon Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-15 transition-opacity">
                    <svg className="w-24 h-24 transform -rotate-12" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-.962 3.767-1.36 5.003-.168.523-.5.697-.818.715-.694.064-1.222-.459-1.894-.899-1.051-.688-1.645-1.117-2.666-1.789-1.18-.776-.415-1.204.257-1.901.176-.183 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.248-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.121.099.154.232.17.326.016.094.036.308.02.475z"/>
                    </svg>
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center justify-center gap-1.5">
                    <span className="text-xs font-bold tracking-wide">Telegram</span>
                    <span className="text-sm font-semibold leading-tight text-center">{phone}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          {isArabic ? 'حسناً' : 'OK'}
        </button>
      </div>
    </div>
  )
}

export default Popup
