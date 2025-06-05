import React, { useState } from 'react';
import { useMessages } from '../context/MessagesContext.jsx';

export default function ConsultasPage() {
  const [text, setText] = useState('');
  const { addMessage } = useMessages();

  const handleSend = () => {
    if (text.trim()) {
      addMessage({ text, date: new Date().toLocaleString() });
      setText('');
      alert('Mensaje enviado');
    }
  };

  return (
    <div>
      <h2>Enviar consulta</h2>
      <textarea value={text} onChange={e => setText(e.target.value)} />
      <br />
      <button onClick={handleSend}>Enviar</button>
    </div>
  );
}