import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";

test("User fills out login form and submits", async () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  // find elements by their placeholder text
  const emailInput = screen.getByPlaceholderText(/enter username or email/i);
  const passwordInput = screen.getByPlaceholderText(/enter your password/i);
  const loginButton = screen.getByRole("button", { name: /log in/i });

  // simulate typing
  fireEvent.change(emailInput, { target: { value: "user@example.com" } });
  fireEvent.change(passwordInput, { target: { value: "Password123!" } });

  // simulate submit
  fireEvent.click(loginButton);

  // verify button exists (no backend yet)
  expect(loginButton).toBeInTheDocument();
});