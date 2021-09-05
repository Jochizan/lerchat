import { useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5500');

const ChatPage = () => {
  useEffect(() => {
    socket.on('receive-message', (message) => {
      console.log(message);
    });
  }, []);

  const sendMessage = (newMessage: string) => {
    socket.emit('send-message', newMessage);
  };

  return (
    <section className='bg-dark-chat vh-100'>
      <div className='container'>
        <div className='row'>
          <h1 className='text-center p-5 display-1 tx-wlight'>Chat Global</h1>
          <hr className='bg-light-chat' />
          <p className='tx-wlight'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati
            odio sapiente hic provident voluptatem, fugit recusandae quo cumque,
            sed architecto earum iure quia. Voluptates quo cumque, fuga ipsa
            excepturi odio!
          </p>
          <button onClick={() => sendMessage('Hello')}>sendMessage</button>
        </div>
      </div>
    </section>
  );
};

export default ChatPage;
