import { Button, ButtonProps } from '@material-tailwind/react';
import { FC } from 'react';

const ButtonServer: FC<any> = ({
  className,
  children,
  submit,
}: ButtonProps & {
  children: any;
  submit: () => void;
}) => {
  return (
    <Button onClick={submit} className={className}>
      {children}
    </Button>
  );
};

export default ButtonServer;
