import React from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Send, 
  MoreVertical, 
  Phone, 
  Video, 
  Info,
  User,
  CheckCheck,
  Paperclip,
  Smile
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function Messaging() {
  const [activeChat, setActiveChat] = React.useState('1');

  const chats = [
    { id: '1', name: 'Hope Haven', lastMessage: 'We are 5 mins away for the pickup.', time: '2m ago', unread: 2, role: 'NGO' },
    { id: '2', name: 'Pick n Pay Sandton', lastMessage: 'The food is ready in the cold storage.', time: '1h ago', unread: 0, role: 'RETAILER' },
    { id: '3', name: 'Meals on Wheels', lastMessage: 'Thank you for the donation!', time: 'Yesterday', unread: 0, role: 'NGO' },
  ];

  const messages = [
    { id: '1', text: 'Hello! I am from Hope Haven. We just claimed your fresh produce donation.', sender: 'other', time: '10:30 AM' },
    { id: '2', text: 'Hi! That is great. Please ensure you bring insulated containers as it is perishable.', sender: 'me', time: '10:32 AM' },
    { id: '3', text: 'Yes, we have our cold chain boxes ready. What time is best for pickup?', sender: 'other', time: '10:35 AM' },
    { id: '4', text: 'Anytime before 18:00 is fine. Ask for Sarah at the loading bay.', sender: 'me', time: '10:38 AM' },
    { id: '5', text: 'Perfect. We are 5 mins away for the pickup.', sender: 'other', time: '11:02 AM' },
  ];

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden h-[calc(100vh-12rem)] flex">
      {/* Sidebar */}
      <aside className="w-80 border-r border-gray-50 flex flex-col">
        <div className="p-6 border-b border-gray-50">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500" placeholder="Search chats..." />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              className={cn(
                "w-full p-4 flex items-start space-x-3 hover:bg-gray-50 transition-all text-left",
                activeChat === chat.id ? "bg-green-50/50" : ""
              )}
            >
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center shrink-0 relative">
                <User className="w-6 h-6 text-gray-400" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-sm font-bold text-gray-900 truncate">{chat.name}</p>
                  <span className="text-[10px] text-gray-400 font-medium">{chat.time}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
              </div>
              {chat.unread > 0 && (
                <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                  {chat.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </aside>

      {/* Chat Area */}
      <main className="flex-1 flex flex-col bg-gray-50/30">
        {/* Chat Header */}
        <header className="p-4 bg-white border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Hope Haven</p>
              <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Active Now</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all">
              <Video className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all">
              <Info className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="text-center">
            <span className="px-3 py-1 bg-gray-100 text-gray-400 text-[10px] font-bold rounded-full uppercase tracking-widest">Today</span>
          </div>

          {messages.map((msg) => (
            <div key={msg.id} className={cn(
              "flex items-end space-x-2 max-w-[80%]",
              msg.sender === 'me' ? "ml-auto flex-row-reverse space-x-reverse" : ""
            )}>
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-gray-400" />
              </div>
              <div className="space-y-1">
                <div className={cn(
                  "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                  msg.sender === 'me' ? "bg-green-600 text-white rounded-br-none" : "bg-white text-gray-700 rounded-bl-none border border-gray-100"
                )}>
                  {msg.text}
                </div>
                <div className={cn(
                  "flex items-center space-x-1 text-[10px] text-gray-400",
                  msg.sender === 'me' ? "justify-end" : ""
                )}>
                  <span>{msg.time}</span>
                  {msg.sender === 'me' && <CheckCheck className="w-3 h-3 text-green-500" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <footer className="p-4 bg-white border-t border-gray-50">
          <div className="flex items-center space-x-3 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-2">
            <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
              <Paperclip className="w-5 h-5" />
            </button>
            <input
              type="text"
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 py-2"
              placeholder="Type your message..."
            />
            <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
              <Smile className="w-5 h-5" />
            </button>
            <button className="p-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-200">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}
