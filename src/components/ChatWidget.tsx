import { MessageCircle } from 'lucide-react';

const ChatWidget = () => {
  return (
<button
  className="fixed bottom-8 right-8 bg-gradient-to-r from-primary to-primary/80 text-white px-7 py-3 rounded-lg shadow-lg flex items-center space-x-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:from-primary/90 hover:to-primary/70"
>
  <MessageCircle className="h-5 w-5" />
  <span className="font-semibold">Chat</span>
</button>
  );
};

export default ChatWidget;
