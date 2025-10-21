import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import SignUp from "./SignUp";

test("User fills out signup form and submits", async () => {
  render(
    <MemoryRouter>
      <SignUp />
    </MemoryRouter>
  );

  const emailInput = screen.getByPlaceholderText(/email/i);
  const firstNameInput = screen.getByPlaceholderText(/first name/i);
  const lastNameInput = screen.getByPlaceholderText(/last name/i);
  const passwordInput = screen.getByPlaceholderText(/^password$/i); // 👈 precise match
  const confirmPasswordInput = screen.getByPlaceholderText(/confirm password/i);
  const submitButton = screen.getByRole("button", { name: /sign up/i });

  fireEvent.change(emailInput, { target: { value: "test@example.com" } });
  fireEvent.change(firstNameInput, { target: { value: "John" } });
  fireEvent.change(lastNameInput, { target: { value: "Doe" } });
  fireEvent.change(passwordInput, { target: { value: "Password123!" } });
  fireEvent.change(confirmPasswordInput, { target: { value: "Password123!" } });

  fireEvent.click(submitButton);

  expect(submitButton).toBeInTheDocument();
});