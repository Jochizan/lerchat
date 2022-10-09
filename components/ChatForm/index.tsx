import { Button, Typography } from '@material-tailwind/react';
import { KeyboardEvent } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

interface Message {
  message: string;
}

const ChatForm = ({
  addMessage
}: {
  addMessage: (message: string) => void;
}) => {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Message>();

  const onSubmit: SubmitHandler<Message> = (data) => {
    addMessage(data.message);
    reset();
  };

  const onKeyPress = {
    onKeyPress: (e: KeyboardEvent) => {
      e.key === 'Enter' && handleSubmit(onSubmit);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
      <section className='container fluid'>
        <div className='flex'>
          <input
            type='text'
            placeholder='Send Message'
            {...onKeyPress}
            {...register('message', { required: true })}
          />
          <Button
            className='ms-3 fw-bold primary__btn'
            variant='filled'
            type='submit'
          >
            Send
          </Button>
        </div>

        <div>
          <Typography className='tx-nlight my-sm-1'>
            {!errors.message
              ? 'Never send sensitive data.'
              : 'The message is required to continue.'}
          </Typography>
        </div>
      </section>
    </form>
  );
};

export default ChatForm;
