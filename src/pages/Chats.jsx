import React, { useState } from 'react';
import './Chats.css';

const Chats = () => {
  const [chats, setChats] = useState([
    {
      id: 1,
      name: 'Sarah',
      avatar: 'https://i.pravatar.cc/150?img=1',
      lastMessage: 'See you at the coffee shop!',
      timestamp: '2 min ago',
      unread: 1
    },
    {
      id: 2,
      name: 'Movie Squad',
      avatar: 'https://i.pravatar.cc/150?img=4',
      lastMessage: 'Movie starts at 7 PM',
      timestamp: '1 hour ago',
      unread: 3,
      isGroup: true
    },
    {
      id: 3,
      name: 'Alex',
      avatar: 'https://i.pravatar.cc/150?img=3',
      lastMessage: 'Count me in for the jog!',
      timestamp: '5 hours ago',
      unread: 0
    }
  ]);

  return (
    <div className="chats">
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
          <div key={chat.id} className="chat-item">
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
  );
};

export default Chats;
