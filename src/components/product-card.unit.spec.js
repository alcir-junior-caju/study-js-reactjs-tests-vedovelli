import { fireEvent, render, screen } from  "@testing-library/react";
import ProductCard from './product-card';

const product = {
  title: 'Relógio Bonito',
  price: '22.00',
  image: 'https://images.unsplash.com/photo-1495856458515-0637185db551?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
}

const addToCart = jest.fn();

const renderProductCard = () => {
  render(<ProductCard product={product} addToCart={addToCart} />);
};

describe('ProductCard', () => {
  it('should render ProductCard', () => {
    renderProductCard();

    const productCard = screen.getByTestId('product-card');

    expect(productCard).toBeInTheDocument();
  });

  it('should display proper content', () => {
    renderProductCard();

    const title = screen.getByText(new RegExp(product.title, 'i'));
    const price = screen.getByText(new RegExp(product.price, 'i'));
    const image = screen.getByTestId('image');

    expect(title).toBeInTheDocument();
    expect(price).toBeInTheDocument();
    expect(image).toHaveStyle({
      backgroundImage: product.image,
    });
  });

  it('should call props.addToCart() when button gets clicked', async () => {
    renderProductCard();

    const button = screen.getByRole('button');

    await fireEvent.click(button);

    expect(addToCart).toHaveBeenCalledTimes(1);
    expect(addToCart).toHaveBeenCalledWith(product);
  });
});
