import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Hello from "./Hello";

it("renders greeting", () => {
  render(<Hello name="Kurelen" />);
  expect(screen.getByRole("button", { name: "Hello, Kurelen!" })).toBeInTheDocument();
});

it("fires onClick", async () => {
  const user = userEvent.setup();
  const fn = vi.fn();
  render(<Hello onClick={fn} />);
  await user.click(screen.getByRole("button"));
  expect(fn).toHaveBeenCalledTimes(1);
});
