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
            className='ml-8 mr-4 py-1.5 w-full px-2.5 font-medium bg-white-03 br-white-01 tx-wdark rounded-3xl br-white-03 focus:outline-none focus:border-none focus:ring-'
            {...onKeyPress}
            {...register('message', { required: true })}
          />
          <Button
            className='mx-2 text-sm bg-primary'
            variant='filled'
            type='submit'
          >
            Send
          </Button>
        </div>

        <div className='ml-10 mt-1'>
          <Typography className='tx-nlight'>
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
