'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

export interface ChatMessage {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  timestamp: string;
  isLive?: boolean;
}

interface LiveChatProps {
  messages: ChatMessage[];
  onSendMessage?: (message: string) => Promise<void>;
  isAuthenticated?: boolean;
  currentUser?: { username: string; avatar?: string };
  isLoading?: boolean;
}

export default function LiveChat({
  messages: initialMessages = [],
  onSendMessage,
  isAuthenticated = false,
  currentUser,
  isLoading = false,
}: LiveChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isSending || !isAuthenticated) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      author: currentUser?.username || 'Vous',
      avatar: currentUser?.avatar,
      content: inputValue,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isLive: true,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsSending(true);

    try {
      if (onSendMessage) {
        await onSendMessage(inputValue);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      // Remove the message if failed
      setMessages(prev => prev.filter(m => m.id !== userMessage.id));
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900/50 to-slate-950/50 rounded-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 bg-slate-900/30">
        <h3 className="text-white font-bold text-sm flex items-center gap-2">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          Chat en direct
        </h3>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto space-y-3 p-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
      >
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-white/40 text-sm text-center">
              Aucun message pour le moment<br/>
              Soyez le premier à commenter !
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.isLive ? 'animate-fade-in' : ''}`}
              >
                {msg.avatar ? (
                  <div className="relative w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={msg.avatar}
                      alt={msg.author}
                      fill
                      sizes="28px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary text-xs font-bold">
                      {msg.author.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-xs font-semibold">{msg.author}</span>
                    <span className="text-white/40 text-[10px]">{msg.timestamp}</span>
                  </div>
                  <p className="text-white/80 text-xs mt-1 break-words">{msg.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      {isAuthenticated ? (
        <div className="border-t border-white/10 p-3 bg-slate-900/20">
          <div className="flex items-end gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Votre message..."
              disabled={isSending || isLoading}
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isSending || isLoading}
              className="p-2 rounded-lg bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed text-white transition-colors flex-shrink-0"
              title="Envoyer"
            >
              <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="border-t border-white/10 p-3 bg-slate-900/20">
          <p className="text-white/60 text-xs text-center">
            Connectez-vous pour participer au chat
          </p>
        </div>
      )}
    </div>
  );
}
