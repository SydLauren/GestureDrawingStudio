import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { flexStyles, FlexVariants } from './flex.styles';

interface FlexProps extends FlexVariants {
  children: ReactNode;
  className?: string;
}

const Flex = (props: FlexProps) => {
  const { children, className, ...variants } = props;

  return (
    <div className={twMerge(flexStyles(variants), className)}>{children}</div>
  );
};

export default Flex;
