import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogProps
} from '@material-tailwind/react';
import { FC } from 'react';

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
    <Dialog
      open={open}
      handler={handler}
      className='bg-dark-03'
      size='xs'
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.8, y: +50 }
      }}
    >
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
        <DialogBody divider className='flex justify-center'>
          <div className='tx-wlight flex flex-col m-4'>
            <p>{description}</p>
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
