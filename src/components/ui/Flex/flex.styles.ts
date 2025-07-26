import { cva, VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const flexVariants = cva('flex', {
  variants: {
    justify: {
      center: 'justify-center',
      start: 'justify-start' /** DEfAULT */,
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    },
    align: {
      center: 'items-center',
      start: 'items-start',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline',
    },
    direction: {
      row: 'flex-row',
      'row-reverse': 'flex-row-reverse',
      column: 'flex-col',
      'column-reverse': 'flex-col-reverse',
    },
    wrap: {
      nowrap: 'flex-nowrap',
      wrap: 'flex-wrap',
      'wrap-reverse': 'flex-wrap-reverse',
    },
    gap: {
      none: 'gap-[0px]',
      1: 'gap-1',
      2: 'gap-2',
      3: 'gap-3',
      4: 'gap-4',
    },
  },
  defaultVariants: {
    justify: 'start',
    align: 'center',
    direction: 'row',
  },
});

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface FlexVariants extends VariantProps<typeof flexVariants> {}

export const flexStyles = (variants: FlexVariants) =>
  twMerge(flexVariants(variants));
