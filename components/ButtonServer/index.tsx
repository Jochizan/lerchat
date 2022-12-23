import { ButtonProps } from '@material-tailwind/react';
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
    <button onClick={submit} className={className}>
      {children}
    </button>
  );
};

export default ButtonServer;
