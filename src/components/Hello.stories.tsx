import type { Meta, StoryObj } from "@storybook/react";
import Hello from "./Hello";

const meta: Meta<typeof Hello> = {
  title: "Components/Hello",
  component: Hello,
};
export default meta;

type Story = StoryObj<typeof Hello>;

export const Default: Story = {};

export const WithName: Story = {
  args: { name: "Kurelen" },
};

export const Clickable: Story = {
  args: { onClick: () => alert("clicked") },
};
