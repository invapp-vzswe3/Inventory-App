import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import App from "./App";
import "@testing-library/jest-dom";

afterEach(() => {
  jest.clearAllMocks();
});

describe("AddingProductForm Component", () => {
  test("clicking on add item opens the form", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([]),
      })
    );

    render(<App />);

    const addItemButton = await screen.findByText(/Add Item/i);
    fireEvent.click(addItemButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Name/i)).toBeInTheDocument();
    })
  })

    // test("submitting the form adds a new item to the list", async () => {
    //     global.fetch = jest.fn((url, options) => {
    //     if (options?.method === "POST") {
    //         return Promise.resolve({
    //         json: () =>
    //             Promise.resolve({ id: 3, name: "New Item" }),
    //         });
    //     }
    //     return Promise.resolve({
    //         json: () =>
    //         Promise.resolve([
    //             { id: 1, name: "Test Item" },
    //             { id: 2, name: "Another Item" },
    //             { id: 3, name: "New Item" },
    //         ]),
    //     });
    //     });
    
    //     render(<App />);
    
    //     const addItemButton = await screen.findByText(/Add Item/i);
    //     fireEvent.click(addItemButton);
    
    //     const nameInput = screen.getByPlaceholderText(/Name/i);
    //     fireEvent.change(nameInput, { target: { value: "New Item" } });
    
    //     const submitButton = await screen.findByText(/Add Item/i);
    //     fireEvent.click(submitButton);
    
    //     await waitFor(() => {
    //     expect(screen.getByText(/New Item/i)).toBeInTheDocument();
    //     })

    //     screen.debug();
    // })
});
