import { useState } from 'react';
import { MessageCircle, X, Send, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type AutoResponse = {
  id: string;
  question: string;
  answer: string;
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{text: string; isUser: boolean}[]>([]);
  const [inputValue, setInputValue] = useState('');

  // الردود الآلية - يمكن تعديلها حسب الحاجة
  const autoResponses: AutoResponse[] = [
    {
      id: '1',
      question: 'كيف أفتح حساب؟',
      answer: 'يمكنك فتح حساب من خلال النقر على زر "فتح حساب" في الصفحة الرئيسية وملء النموذج المطلوب.'
    },
    {
      id: '2',
      question: 'ما هي الحد الأدنى للإيداع؟',
      answer: 'الحد الأدنى للإيداع هو 100 دولار أمريكي.'
    },
    {
      id: '3',
      question: 'كيف يمكنني سحب الأموال؟',
      answer: 'يمكنك سحب الأموال من خلال الذهاب إلى لوحة التحكم، ثم النقر على "سحب" واتباع التعليمات.'
    },
  ];

  const handleSend = () => {
    if (inputValue.trim() === '') return;
    
    // إضافة رسالة المستخدم
    setMessages([...messages, {text: inputValue, isUser: true}]);
    
    // البحث عن رد آلي مطابق
    const matchingResponse = autoResponses.find(response => 
      response.question.toLowerCase().includes(inputValue.toLowerCase())
    );
    
    // إضافة الرد الآلي أو رد افتراضي
    setTimeout(() => {
      if (matchingResponse) {
        setMessages(prev => [...prev, {text: matchingResponse.answer, isUser: false}]);
      } else {
        setMessages(prev => [...prev, {text: 'شكراً لتواصلك معنا. سيتم الرد عليك قريباً من قبل أحد ممثلي خدمة العملاء.', isUser: false}]);
      }
    }, 500);
    
    setInputValue('');
  };

  const handleQuickResponse = (question: string) => {
    // إضافة السؤال كرسالة من المستخدم
    setMessages([...messages, {text: question, isUser: true}]);
    
    // البحث عن الرد المناسب
    const matchingResponse = autoResponses.find(response => 
      response.question === question
    );
    
    // إضافة الرد الآلي
    setTimeout(() => {
      if (matchingResponse) {
        setMessages(prev => [...prev, {text: matchingResponse.answer, isUser: false}]);
      }
    }, 500);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-8 w-80 sm:w-96 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50"
          >
            {/* رأس نافذة المحادثة */}
            <div className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
              <h3 className="font-semibold">مساعد Forex King</h3>
              <button onClick={() => setIsOpen(false)} className="text-primary-foreground hover:text-white/80 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* محتوى المحادثة */}
            <div className="h-80 overflow-y-auto p-4 flex flex-col space-y-3" style={{ direction: 'rtl' }}>
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-4">
                  <p>مرحباً بك! كيف يمكنني مساعدتك اليوم؟</p>
                  <div className="mt-4 space-y-2">
                    {autoResponses.map(response => (
                      <button
                        key={response.id}
                        onClick={() => handleQuickResponse(response.question)}
                        className="block w-full text-right bg-muted hover:bg-muted/80 text-foreground p-2 rounded-md text-sm transition-colors"
                      >
                        {response.question}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => setMessages([])} 
                    className="self-start mb-3 flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>الرجوع للخيارات</span>
                  </button>
                  {messages.map((message, index) => (
                    <div 
                      key={index} 
                      className={`max-w-[80%] p-3 rounded-lg ${message.isUser ? 'bg-primary text-primary-foreground self-start' : 'bg-muted text-foreground self-end'}`}
                    >
                      {message.text}
                    </div>
                  ))}
                </>
              )}
            </div>
            
            {/* مدخل الرسائل */}
            <div className="border-t border-border p-3 flex items-center space-x-2" style={{ direction: 'rtl' }}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="اكتب رسالتك هنا..."
                className="flex-1 bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button 
                onClick={handleSend}
                className="bg-primary text-primary-foreground p-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* زر المحادثة */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-primary to-primary/80 text-white px-7 py-3 rounded-lg shadow-lg flex items-center space-x-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:from-primary/90 hover:to-primary/70 z-50"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="font-semibold">Chat</span>
      </button>
    </>
  );
};

export default ChatWidget;
