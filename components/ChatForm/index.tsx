import { Button, Typography } from '@material-tailwind/react';
import { KeyboardEvent } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { ContextMenu, ContextMenuTrigger } from 'react-contextmenu';
import { showMenu } from 'react-contextmenu/modules/actions';

const ChatForm = ({
  createMessage
}: {
  createMessage: (content: string) => void;
}) => {
  const {
    reset,
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors }
  } = useForm<{ content: string }>();
  const onSubmit: SubmitHandler<{ content: string }> = (data) => {
    createMessage(data.content);
    reset();
  };

  const onKeyPress = {
    onKeyPress: (e: KeyboardEvent) => {
      e.key === 'Enter' && handleSubmit(onSubmit);
    }
  };

  const onClick = (emojiData: EmojiClickData, event: MouseEvent) => {
    const content = getValues('content');
    setValue('content', content + emojiData.emoji);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
        <section className='w-full'>
          <div className='flex'>
            <div className='relative w-full'>
              <input
                type='text'
                placeholder='Envia un mensaje'
                className='py-2 w-full pl-2.5 font-medium bg-white-03 br-white-01 tx-wdark rounded-xl br-white-03 focus:outline-none focus:border-none focus:ring-'
                {...onKeyPress}
                {...register('content', { required: true })}
              />
              <div className='flex items-center justify-end absolute right-0 -top-0 space-x-2 pr-8 m-0'>
                <ContextMenuTrigger id={'ChatForm'}>
                  <i
                    className='material-icons text-gray-800 hover:text-blue-gray-700 cursor-pointer w-9 text-4xl'
                    onClick={() => showMenu()}
                  >
                    mood
                  </i>
                  <i
                    className='material-icons text-gray-800 hover:text-blue-gray-700 cursor-pointer w-9 text-4xl'
                    onClick={() => showMenu()}
                  >
                    gif_box
                  </i>
                </ContextMenuTrigger>
              </div>
            </div>
            <Button
              className='mx-2 mr-8 text-center flex justify-center bg-primary'
              variant='filled'
              type='submit'
            >
              <span>Enviar</span>
            </Button>
          </div>

          <div className='ml-4 mt-1'>
            <Typography className='tx-nlight'>
              {!errors.content
                ? 'Nunca envies información sensible.'
                : 'Se require un mensaje para continuar.'}
            </Typography>
          </div>
        </section>
      </form>
      <ContextMenu id={'ChatForm'}>
        <EmojiPicker onEmojiClick={onClick} autoFocusSearch={false} />
      </ContextMenu>
    </>
  );
};

export default ChatForm;
