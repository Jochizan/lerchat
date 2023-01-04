import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogProps
} from '@material-tailwind/react';
import { FC, useState } from 'react';
import { SubmitHandler, UseFormHandleSubmit } from 'react-hook-form';

const ModalForm: FC<any> = ({
  open,
  handler,
  title,
  button,
  children,
  description,
  handleSubmit
}: DialogProps & {
  title: string;
  button: string;
  description: string;
  handleSubmit: () => Promise<any>;
}) => {
  return (
    <Dialog open={open} handler={handler} className='bg-dark-03'>
      <form onSubmit={handleSubmit}>
        <DialogHeader className='tx-wlight flex justify-between p-2 ml-4'>
          {title}
          <Button
            variant='filled'
            color='red'
            onClick={handler}
            className='p-2.5 px-4 m-2 right-0'
          >
            <span className='text-sm'>x</span>
          </Button>
        </DialogHeader>
        <DialogBody>
          <div className='tx-wlight flex flex-col m-4'>
            <p>{description}</p>
            <hr className='bg-light-chat mt-3 mb-4' />
            {children}
          </div>
        </DialogBody>
        <DialogFooter className='flex justify-center'>
          <Button
            variant='filled'
            color='green'
            className='bg-primary'
            type='submit'
            onClick={handler}
          >
            <span>{button}</span>
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};

export default ModalForm;

// <input
//   required
//   placeholder='Nombre del servidor'
//   {...register('name')}
//   className='mr-4 py-1.5 w-full px-2.5 font-medium bg-white-03 br-white-01 tx-wdark rounded-3xl br-white-03 focus:outline-none focus:border-none focus:ring-1'
// />
