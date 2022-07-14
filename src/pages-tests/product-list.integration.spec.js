import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ProductList from '../pages';
import { makeServer } from '../miragejs/server';
import { Response } from 'miragejs';
import userEvent from '@testing-library/user-event';

const renderProductList = () => {
  render(<ProductList />);
};

describe('ProductList', () => {
  let server;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should render ProductList', () => {
    renderProductList();

    const productList = screen.getByTestId('product-list');

    expect(productList).toBeInTheDocument();
  });

  it('should render the ProductCard component 10 times', async () => {
    server.createList('product', 10);

    renderProductList();


    await waitFor(() => {
      const productCards = screen.getAllByTestId('product-card');

      expect(productCards).toHaveLength(10);
    });
  });

  it('should render the "no products message"', async () => {
    renderProductList();

    await waitFor(() => {
      const noProductsMessage = screen.getByTestId('no-products');

      expect(noProductsMessage).toBeInTheDocument();
    });
  });

  it('should display error message when promise rejects', async () => {
    server.get('products', () => {
      return new Response(500, {}, '');
    });

    renderProductList();

    await waitFor(() => {
      const errorMessage = screen.getByTestId('server-error');
      const noProductsMessage = screen.queryByTestId('no-products');
      const productCards = screen.queryAllByTestId('product-card');

      expect(errorMessage).toBeInTheDocument();
      expect(noProductsMessage).toBeNull();
      expect(productCards).toHaveLength(0);
    });
  });

  it('should filter the product list when a search is performed', async () => {
    const searchTerm = 'Relógio Bonito';

    server.createList('product', 2);
    server.create('product', {
      title: searchTerm,
    })

    renderProductList();

    await waitFor(() => {
      const productCards = screen.getAllByTestId('product-card');
      expect(productCards).toHaveLength(3);
    });

    const form = screen.getByRole('form');
    const input = screen.getByRole('searchbox');

    await userEvent.type(input, searchTerm);
    await fireEvent.submit(form);

    await waitFor(() => {
      const productCardsFiltered = screen.getAllByTestId('product-card');
      expect(productCardsFiltered).toHaveLength(1);
    });
  });

  it('should display the total quantity of products', async () => {
    server.createList('product', 10);

    renderProductList();

    await waitFor(() => {
      const quantity = screen.getByText(/10 Products/i);

      expect(quantity).toBeInTheDocument();
    });
  });

  it('should display product (singular) when there is only 1 product', async () => {
    server.create('product');

    renderProductList();

    await waitFor(() => {
      const quantity = screen.getByText(/1 Product$/i);

      expect(quantity).toBeInTheDocument();
    });
  });

  it('should display proper quantity when list is filtered', async () => {
    const searchTerm = 'Relógio Bonito';

    server.createList('product', 2);

    server.create('product', {
      title: searchTerm
    });

    renderProductList();

    await waitFor(() => {
      const productCards = screen.getByText(/3 Products/i);

      expect(productCards).toBeInTheDocument();
    });

    const form = screen.getByRole('form');
    const input = screen.getByRole('searchbox');

    await userEvent.type(input, searchTerm);
    await fireEvent.submit(form);

    await waitFor(() => {
      const productCardsFiltered = screen.getByText(/1 Product$/i);
      expect(productCardsFiltered).toBeInTheDocument();
    });
  });
});
