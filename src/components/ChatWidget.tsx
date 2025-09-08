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

  // Auto responses - can be modified as needed
  const autoResponses: AutoResponse[] = [
    {
      id: '1',
      question: 'How do I open an account?',
      answer: 'You can open an account by clicking the "Open Account" button on the homepage and filling out the required form.'
    },
    {
      id: '2',
      question: 'What is the minimum deposit?',
      answer: 'The minimum deposit is $100 USD.'
    },
    {
      id: '3',
      question: 'How can I withdraw funds?',
      answer: 'You can withdraw funds by going to the dashboard, then clicking "Withdraw" and following the instructions.'
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
        setMessages(prev => [...prev, {text: 'Thank you for contacting us. You will receive a response shortly from one of our customer service representatives.', isUser: false}]);
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
            className="fixed bottom-24 right-8 w-80 sm:w-96 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50"
          >
            {/* Chat window header */}
            <div className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
              <h3 className="font-semibold">Forex King Assistant</h3>
              <button onClick={() => setIsOpen(false)} className="text-primary-foreground hover:text-white/80 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Chat content */}
            <div className="h-80 overflow-y-auto p-4 flex flex-col space-y-3">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-4">
                  <p>Welcome! How can I help you today?</p>
                  <div className="mt-4 space-y-2">
                    {autoResponses.map(response => (
                      <button
                        key={response.id}
                        onClick={() => handleQuickResponse(response.question)}
                        className="block w-full text-left bg-muted hover:bg-muted/80 text-foreground p-2 rounded-md text-sm transition-colors"
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
                    <span>Back to options</span>
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
            <div className="border-t border-border p-3 flex items-center space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message here..."
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
        className="fixed bottom-8 right-8 bg-gradient-to-r from-primary to-primary/80 text-white px-7 py-3 rounded-lg shadow-lg flex items-center space-x-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:from-primary/90 hover:to-primary/70 z-50"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="font-semibold">Chat</span>
      </button>
    </>
  );
};

export default ChatWidget;
