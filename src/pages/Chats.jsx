import React, { useState } from 'react';
import './Chats.css';

const Chats = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');

  const [chats, setChats] = useState([
    {
      id: 1,
      name: 'Sarah',
      avatar: 'https://i.pravatar.cc/150?img=1',
      lastMessage: 'See you at the coffee shop!',
      timestamp: '2 min ago',
      unread: 1,
      messages: [
        { id: 1, sender: 'Sarah', text: 'Hey! How are you?', time: '10:30 AM' },
        { id: 2, sender: 'You', text: 'I\'m doing great! How about you?', time: '10:32 AM' },
        { id: 3, sender: 'Sarah', text: 'All good! See you at the coffee shop!', time: '10:35 AM' }
      ]
    },
    {
      id: 2,
      name: 'Movie Squad',
      avatar: 'https://i.pravatar.cc/150?img=4',
      lastMessage: 'Movie starts at 7 PM',
      timestamp: '1 hour ago',
      unread: 3,
      isGroup: true,
      messages: [
        { id: 1, sender: 'Alex', text: 'Who\'s coming to the movie?', time: '12:00 PM' },
        { id: 2, sender: 'Sarah', text: 'Count me in!', time: '12:05 PM' },
        { id: 3, sender: 'Group', text: 'Movie starts at 7 PM', time: '12:30 PM' }
      ]
    },
    {
      id: 3,
      name: 'Alex',
      avatar: 'https://i.pravatar.cc/150?img=3',
      lastMessage: 'Count me in for the jog!',
      timestamp: '5 hours ago',
      unread: 0,
      messages: [
        { id: 1, sender: 'You', text: 'Morning jog tomorrow?', time: '8:00 AM' },
        { id: 2, sender: 'Alex', text: 'Yes! What time?', time: '8:15 AM' },
        { id: 3, sender: 'You', text: '6 AM at the park', time: '8:20 AM' },
        { id: 4, sender: 'Alex', text: 'Count me in for the jog!', time: '8:25 AM' }
      ]
    }
  ]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat) return;

    const updatedChats = chats.map(chat => {
      if (chat.id === selectedChat.id) {
        return {
          ...chat,
          messages: [
            ...chat.messages,
            {
              id: chat.messages.length + 1,
              sender: 'You',
              text: messageInput,
              time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            }
          ]
        };
      }
      return chat;
    });

    setChats(updatedChats);
    setSelectedChat(updatedChats.find(c => c.id === selectedChat.id));
    setMessageInput('');
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    const updatedChats = chats.map(c => {
      if (c.id === chat.id) {
        return { ...c, unread: 0 };
      }
      return c;
    });
    setChats(updatedChats);
  };

  return (
    <div className="chats">
      <div className="chats-container">
        {/* Left Sidebar - Chat List */}
        <div className="chats-sidebar">
          <div className="chats-header">
            <h1>Messages</h1>
            <button className="new-chat-btn">✉️</button>
          </div>

          <div className="chats-search">
            <input
              type="text"
              placeholder="Search conversations..."
              className="search-input"
            />
          </div>

          <div className="chats-list">
            {chats.map(chat => (
              <div
                key={chat.id}
                className={`chat-item ${selectedChat?.id === chat.id ? 'active' : ''}`}
                onClick={() => handleChatSelect(chat)}
              >
                <div className="chat-avatar">
                  <img src={chat.avatar} alt={chat.name} />
                  {chat.unread > 0 && (
                    <span className="unread-badge">{chat.unread}</span>
                  )}
                </div>

                <div className="chat-content">
                  <div className="chat-header">
                    <h3>{chat.name}</h3>
                    <span className="timestamp">{chat.timestamp}</span>
                  </div>
                  <p className="last-message">{chat.lastMessage}</p>
                </div>

                <div className="chat-actions">
                  <button className="action-btn">···</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Chat Messages */}
        <div className="chat-panel">
          {selectedChat ? (
            <>
              <div className="chat-panel-header">
                <img src={selectedChat.avatar} alt={selectedChat.name} className="chat-panel-avatar" />
                <div className="chat-panel-info">
                  <h2>{selectedChat.name}</h2>
                  <p>{selectedChat.isGroup ? 'Group' : 'Active now'}</p>
                </div>
              </div>

              <div className="messages-area">
                {selectedChat.messages.map(msg => (
                  <div key={msg.id} className={`message ${msg.sender === 'You' ? 'sent' : 'received'}`}>
                    <div className="message-content">
                      <p className="message-text">{msg.text}</p>
                      <span className="message-time">{msg.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="message-input-area">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="message-input"
                />
                <button onClick={handleSendMessage} className="send-btn">
                  📤
                </button>
              </div>
            </>
          ) : (
            <div className="no-chat-selected">
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chats;
