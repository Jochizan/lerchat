import { Button, Typography } from '@material-tailwind/react';
import { KeyboardEvent } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

const ChatForm = ({
  createMessage,
  scrollToLastIndex
}: {
  createMessage: (content: string) => void;
  scrollToLastIndex: () => void;
}) => {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<{ content: string }>();

  const onSubmit: SubmitHandler<{ content: string }> = (data) => {
    createMessage(data.content);
    scrollToLastIndex();
    reset();
  };

  const onKeyPress = {
    onKeyPress: (e: KeyboardEvent) => {
      e.key === 'Enter' && handleSubmit(onSubmit);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
      <section className='w-full'>
        <div className='flex'>
          <input
            type='text'
            placeholder='Send Message'
            className='ml-8 mr-4 py-1.5 w-full px-2.5 font-medium bg-white-03 br-white-01 tx-wdark rounded-3xl br-white-03 focus:outline-none focus:border-none focus:ring-'
            {...onKeyPress}
            {...register('content', { required: true })}
          />
          <Button
            className='mx-2 mr-8 text-center flex justify-center bg-primary'
            variant='filled'
            type='submit'
          >
            <span>Send</span>
          </Button>
        </div>

        <div className='ml-10 mt-1'>
          <Typography className='tx-nlight'>
            {!errors.content
              ? 'Never send sensitive data.'
              : 'The message is required to continue.'}
          </Typography>
        </div>
      </section>
    </form>
  );
};

export default ChatForm;
