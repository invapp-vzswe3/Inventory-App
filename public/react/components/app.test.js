import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import App from "./App";
import Item from "./Item";
import "@testing-library/jest-dom";

afterEach(() => {
  jest.clearAllMocks();
});

describe("App Component", () => {
  test("fetches the correct items", async () => {
    // Mock the fetch request
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            { id: 1, name: "Test Item" },
            { id: 2, name: "Another Item" },
          ]),
      })
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Test Item/i)).toBeInTheDocument();
    });
  });

  test("fetches different results based on search query", async () => {
    global.fetch = jest.fn((url) => {
      if (url.includes("?name=Test")) {
        return Promise.resolve({
          json: () =>
            Promise.resolve([
              // Return only the item with the query "Test"
              { id: 1, name: "Test Item" },
            ]),
        });
      }

      return Promise.resolve({
        json: () =>
          Promise.resolve([
            // Return all items by default
            { id: 1, name: "Test Item" },
            { id: 2, name: "Another Item" },
          ]),
      });
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Test Item/i)).toBeInTheDocument();
      expect(screen.queryByText(/Another Item/i)).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/Search by Name.../i);
    fireEvent.change(input, { target: { value: "Test" } });

    await waitFor(() => {
      expect(screen.getByText(/Test Item/i)).toBeInTheDocument();
      expect(screen.queryByText(/Another Item/i)).not.toBeInTheDocument();
    });
  });

  test("adds item to cart", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            { id: 1, name: "Test Item" },
            { id: 2, name: "Another Item" },
          ]),
      })
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Test Item/i)).toBeInTheDocument();
    });

    const addButton = screen.getAllByText(/Add To Cart/i)[0];
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(/Your Cart/i)).toBeInTheDocument();
      expect(screen.getByText(/Test Item x 1/i)).toBeInTheDocument();
    });
  });

  test("removes item from cart", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            { id: 1, name: "Test Item" },
            { id: 2, name: "Another Item" },
          ]),
      })
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Test Item/i)).toBeInTheDocument();
    });

    const addButton = screen.getAllByText(/Add To Cart/i)[0];
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(/Your Cart/i)).toBeInTheDocument();
      expect(screen.getByText(/Test Item x 1/i)).toBeInTheDocument();
    });

    const removeButton = screen.getByText(/Remove/i);
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(screen.queryByText(/Test Item x 1/i)).not.toBeInTheDocument();
      expect(screen.getByText(/Cart is empty/i)).toBeInTheDocument();
    });
  });

  test("checks out items in cart", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            { id: 1, name: "Test Item" },
            { id: 2, name: "Another Item" },
          ]),
      })
    );

    window.alert = jest.fn();

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Test Item/i)).toBeInTheDocument();
    });

    const addButton = screen.getAllByText(/Add To Cart/i)[0];
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(/Your Cart/i)).toBeInTheDocument();
      expect(screen.getByText(/Test Item x 1/i)).toBeInTheDocument();
    });

    const checkoutButton = screen.getByText(/Checkout/i);
    fireEvent.click(checkoutButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Checkout complete!");
    });
  });
});
