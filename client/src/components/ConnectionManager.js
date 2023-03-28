import React from 'react';
import { socket } from '../socket';
import { useState } from 'react';
import './ConnectionManager.css'
import '../App.css';

export function ConnectionManager() {
  const [value, setValue] = useState('');

  function connect() {
    socket.connect();
    socket.emit('join', value);
  }

  function disconnect() {
    socket.disconnect();
  }

  return (
    <>
      <div className="loginInterface">
        <input maxLength={8} onChange={ e => setValue(e.target.value) } />
        <div onClick={ connect} className='pixel' as="a" variant="primary">
          <p>Connect</p>
        </div>
      </div>
    </>
  );
}