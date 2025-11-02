import React from "react"
import { useTranslation } from 'react-i18next'

type SecondPopupProps = {
  onClose: () => void
}

const SecondPopup = ({ onClose }: SecondPopupProps) => {
  const { i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-8 md:p-10 rounded-2xl shadow-2xl max-w-2xl w-full">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-primary mb-4 text-center">
            {isArabic ? 'معلومات مهمة' : 'Important Information'}
          </h3>
          
          <div className={`space-y-4 text-foreground leading-relaxed ${isArabic ? 'text-right' : 'text-left'}`}>
            <p className="text-lg">
              {isArabic 
                ? 'بعد اتمام التسجيل، يرجي التواصل مع خدمة عملاء Forex King لإرسال اوراق توثيق الحساب و الحساب الاسلامى و الرافعة المالية'
                : 'After completing registration, please contact Forex King customer service to send account verification documents, Islamic account and leverage forms'}
            </p>

            <div className="bg-primary/10 rounded-lg p-4 space-y-2">
              <p className="font-semibold text-primary">
                {isArabic ? 'عبر الواتساب او تيليجرام:' : 'Via WhatsApp or Telegram:'}
              </p>
              <div className="flex flex-wrap gap-3">
                <a 
                  href="https://wa.me/+17742739477" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  +17742739477
                </a>
                <a 
                  href="https://t.me/+17742739477" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 2L11 13" />
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                  </svg>
                  +17742739477
                </a>
              </div>
            </div>

            <p className="text-base">
              {isArabic 
                ? 'وبعد التوقيع عليها يتم أرسالها علي الايميل'
                : 'After signing them, send them to the email'}
            </p>

            <div className="text-center">
              <a 
                href="mailto:o.a.f.forexking@gmail.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg font-semibold"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                o.a.f.forexking@gmail.com
              </a>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded">
              <p className="text-base">
                {isArabic 
                  ? 'بعد اتمام ارسال الاوراق، سيتواصل معك احد ممثلينا خلال ساعتين لانهاء عقد ادارة المحافظ و هذا العقد يوضح تفاصيل التعاون و ادارة الحساب بينك و بين فريق Forex King'
                  : 'After completing the document submission, one of our representatives will contact you within two hours to finalize the portfolio management contract, which details the cooperation and account management between you and the Forex King team'}
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {isArabic ? 'فهمت' : 'Got it'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SecondPopup

