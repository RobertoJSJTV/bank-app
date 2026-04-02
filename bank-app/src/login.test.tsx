import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./pages/login";

test("renderiza botão", () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  );
  expect(screen.getByText("Entrar")).toBeInTheDocument();
});