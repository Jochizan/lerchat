import ChatForm from '../../components/ChatForm';
import CardMessage from '../../components/CardMessage/CardMessage';
import { useMessages } from '../../store/message.store';

const ChatPage = () => {
  const [messages, addMessage] = useMessages();

  return (
    <section className='vh-100 d-flex flex-column justify-content-between'>
      <h1 className='text-center m-0 py-3 display-1 fw-normal tx-wlight'>
        Global Chat
      </h1>
      <div className='d-flex h-100 flex-column justify-content-end mx-3'>
        <section className='vh-72 overflow-auto'>
          <h2 className='ps-1 fs-1 tx-wlight'>Welcome to UL Chat</h2>
          <p className='ps-1 pt-3 m-0 fs-6 tx-wlight'>
            The global chat starts here
          </p>
          <hr className='bg-light-chat mt-1 mb-3' />
          {messages.map((el, idx) => (
            <CardMessage key={idx} text={el.message} />
          ))}
        </section>
      </div>
      <ChatForm addMessage={addMessage} />
    </section>
  );
};

export default ChatPage;
