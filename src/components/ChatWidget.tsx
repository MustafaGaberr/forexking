import { useState } from 'react';
import { MessageCircle, X, Send, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

type AutoResponse = {
  id: string;
  question: string;
  answer: string;
};

const ChatWidget = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{text: string; isUser: boolean}[]>([]);
  const [inputValue, setInputValue] = useState('');

  // Auto responses - dynamically translated
  const autoResponses: AutoResponse[] = [
    {
      id: '1',
      question: t('chat.question1'),
      answer: t('chat.answer1')
    },
    {
      id: '2',
      question: t('chat.question2'),
      answer: t('chat.answer2')
    },
    {
      id: '3',
      question: t('chat.question3'),
      answer: t('chat.answer3')
    },
    {
      id: '4',
      question: t('chat.question4'),
      answer: t('chat.answer4')
    },
    {
      id: '5',
      question: t('chat.question5'),
      answer: t('chat.answer5')
    },
    {
      id: '6',
      question: t('chat.question6'),
      answer: t('chat.answer6')
    },
    {
      id: '7',
      question: t('chat.question7'),
      answer: t('chat.answer7')
    },
    {
      id: '8',
      question: t('chat.question8'),
      answer: t('chat.answer8')
    },
    {
      id: '9',
      question: t('chat.question9'),
      answer: t('chat.answer9')
    },
    {
      id: '10',
      question: t('chat.question10'),
      answer: t('chat.answer10')
    },
  ];

  const handleSend = () => {
    if (inputValue.trim() === '') return;
    
    // Add user message
    setMessages([...messages, {text: inputValue, isUser: true}]);
    
    // Search for matching auto response
    const matchingResponse = autoResponses.find(response => 
      response.question.toLowerCase().includes(inputValue.toLowerCase())
    );
    
    // Add auto response or default response
    setTimeout(() => {
      if (matchingResponse) {
        setMessages(prev => [...prev, {text: matchingResponse.answer, isUser: false}]);
      } else {
        setMessages(prev => [...prev, {text: t('chat.defaultResponse'), isUser: false}]);
      }
    }, 500);
    
    setInputValue('');
  };

  const handleQuickResponse = (question: string) => {
    // Add question as user message
    setMessages([...messages, {text: question, isUser: true}]);
    
    // Search for appropriate response
    const matchingResponse = autoResponses.find(response => 
      response.question === question
    );
    
    // Add auto response
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
            className={`fixed bottom-24 w-80 sm:w-96 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50 ${
              i18n.language === 'ar' ? 'left-8' : 'right-8'
            }`}
          >
            {/* Chat window header */}
            <div className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
              <h3 className="font-semibold">{t('chat.header')}</h3>
              <button onClick={() => setIsOpen(false)} className="text-primary-foreground hover:text-white/80 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Chat content */}
            <div className={`h-80 overflow-y-auto p-4 flex flex-col space-y-3 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`} style={{ direction: i18n.language === 'ar' ? 'rtl' : 'ltr' }}>
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-4">
                  <p>{t('chat.welcome')}</p>
                  <div className="mt-4 space-y-2">
                    {autoResponses.map(response => (
                      <button
                        key={response.id}
                        onClick={() => handleQuickResponse(response.question)}
                        className={`block w-full ${i18n.language === 'ar' ? 'text-right' : 'text-left'} bg-muted hover:bg-muted/80 text-foreground p-2 rounded-md text-sm transition-colors`}
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
                    <span>{t('chat.backToOptions')}</span>
                  </button>
                  {messages.map((message, index) => (
                    <div 
                      key={index} 
                      className={`max-w-[80%] p-3 rounded-lg ${message.isUser ? 'bg-primary text-primary-foreground self-end' : 'bg-muted text-foreground self-start'}`}
                    >
                      {message.text}
                    </div>
                  ))}
                </>
              )}
            </div>
            
            {/* Message input */}
            <div className={`border-t border-border p-3 flex items-center gap-2 ${
              i18n.language === 'ar' ? 'flex-row-reverse' : 'flex-row'
            }`} style={{ direction: i18n.language === 'ar' ? 'rtl' : 'ltr' }}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t('chat.placeholder')}
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
      
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-8 bg-gradient-to-r from-primary to-primary/80 text-white px-7 py-3 rounded-lg shadow-lg flex items-center transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:from-primary/90 hover:to-primary/70 z-50 ${
          i18n.language === 'ar' ? 'left-8 space-x-reverse space-x-2' : 'right-8 space-x-2'
        }`}
      >
        <MessageCircle className="h-5 w-5" />
        <span className="font-semibold">{i18n.language === 'ar' ? 'الدعم' : 'Chat'}</span>
      </button>
    </>
  );
};

export default ChatWidget;
