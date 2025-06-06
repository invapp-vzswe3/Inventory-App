import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import App from "./App";
import "@testing-library/jest-dom";

afterEach(() => {
  jest.clearAllMocks();
});

describe("Item Component", () => {
  test("clicking on an item fetches single item details", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            { id: 1, name: "Test Item", image: "test.jpg", price: 10 },
            { id: 2, name: "Another Item", image: "another.jpg", price: 20 },
          ]),
      })
    );

    render(<App />);

    const item = await screen.findByText(/Test Item/i);
    fireEvent.click(item);

    await waitFor(() => {
      expect(screen.getByText(/Description:/i)).toBeInTheDocument();
    })

    screen.debug();
  });

  test("clicking on update item shows the update form", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            { id: 1, name: "Test Item", image: "test.jpg", price: 10 },
            { id: 2, name: "Another Item", image: "another.jpg", price: 20 },
          ]),
      })
    );

    render(<App />);

    const item = await screen.findByText(/Test Item/i);
    fireEvent.click(item);

    const updateButton = await screen.findByText(/Update Item/i);
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Name/i)).toBeInTheDocument();
    })
  })

  test("clicking on delete item removes the item from the list", async () => {
    global.fetch = jest.fn((url, options) => {
      if (options?.method === "DELETE") {
        return Promise.resolve({ json: () => Promise.resolve({}) });
      }
      return Promise.resolve({
        json: () =>
          Promise.resolve([
            { id: 1, name: "Test Item", image: "test.jpg", price: 10 },
            { id: 2, name: "Another Item", image: "another.jpg", price: 20 },
          ]),
      })
    });

    render(<App />);

    const item = await screen.findByText(/Test Item/i);
    fireEvent.click(item);

    const deleteButton = await screen.findByText(/Delete/i);
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText(/Test Item/i)).not.toBeInTheDocument();
    })
  })

  test("clicking on back to items returns to the item list", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            { id: 1, name: "Test Item", image: "test.jpg", price: 10 },
            { id: 2, name: "Another Item", image: "another.jpg", price: 20 },
          ]),
      })
    );

    render(<App />);

    const item = await screen.findByText(/Test Item/i);
    fireEvent.click(item);

    await waitFor(() => {
      expect(screen.getByText(/Description:/i)).toBeInTheDocument();
    })

    const backButton = await screen.findByText(/Back to Items/i);
    fireEvent.click(backButton);

    await waitFor(() => {
      expect(screen.queryByText(/Description:/i)).not.toBeInTheDocument();
    })
  })

  test("clicking on update item and submitting the form updates the item details", async () => {
    global.fetch = jest.fn((url, options) => {
      if(options?.method === "PUT") {
        return Promise.resolve({
          json: () => 
            Promise.resolve({ id: 1, name: "Updated Test Item", image: "test.jpg", price: 10 

            }),
        })
      }
      
      return Promise.resolve({
        json: () =>
          Promise.resolve([
            { id: 1, name: "Test Item", image: "test.jpg", price: 10 },
            { id: 2, name: "Another Item", image: "another.jpg", price: 20 },
          ]),
      })
    });

    render(<App />);

    const item = await screen.findByText(/Test Item/i);
    fireEvent.click(item);

    const updateButton = await screen.findByText(/Update Item/i);
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Name/i)).toBeInTheDocument();
    })

    const nameInput = screen.getByPlaceholderText(/Name/i);
    fireEvent.change(nameInput, { target: { value: "Updated Test Item" } });

    const submitButton = await screen.findByText(/Submit/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Updated Test Item/i)).toBeInTheDocument();
    })
  })
});
