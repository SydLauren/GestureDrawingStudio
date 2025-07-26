import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, waitFor, within, expect } from '@storybook/test';

import Neat from '../components/Neat';

const meta = {
  component: Neat,
} satisfies Meta<typeof Neat>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ClickCounter: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Click the Neat counter 3 times', async () => {
      await userEvent.click(canvas.getByTestId('neat-btn'));
      await userEvent.click(canvas.getByTestId('neat-btn'));
      await userEvent.click(canvas.getByTestId('neat-btn'));
    });

    await step('Confirm neat counter went up to 3', async () => {
      await waitFor(
        () => expect(canvas.getByText('Neat counter: 3')).toBeDefined,
      );
    });
  },
};
