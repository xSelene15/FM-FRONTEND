import React from 'react';
import { useMessages } from '../../context/MessagesContext';

export default function InboxPage() {
  const { messages } = useMessages();

  return (
    <div>
      <h2>Mensajes recibidos</h2>
      {messages.length === 0 && <p>No hay mensajes.</p>}
      <ul>
        {messages.map((msg, idx) => (
          <li key={idx}>
            <b>{msg.date}:</b> {msg.text}
          </li>
        ))}
      </ul>
    </div>
  );
}