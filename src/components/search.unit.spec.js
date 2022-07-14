import Search from './search';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const doSearch = jest.fn();

const renderSearch = () => {
  render(<Search doSearch={doSearch} />);
}

describe('Search', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a form', () => {
    renderSearch();

    const form = screen.getByRole('form');

    expect(form).toBeInTheDocument();
  })

  it('should render a input type equals search', () => {
    renderSearch();

    const input = screen.getByRole('searchbox');

    expect(input).toHaveProperty('type', 'search');
  });

  it('should call props.doSearch() when form is submitted', async () => {
    renderSearch();

    const form = screen.getByRole('form');

    await fireEvent.submit(form);

    expect(doSearch).toHaveBeenCalledTimes(1);
  })

  it('should call props.doSearch() with the user input', async () => {
    renderSearch();

    const inputText = 'some text here';
    const form = screen.getByRole('form');
    const input = screen.getByRole('searchbox');

    await userEvent.type(input, inputText);
    await fireEvent.submit(form);

    expect(doSearch).toHaveBeenCalledWith(inputText);
  });

  it('should call doSearch() when search input is cleared', async () => {
    renderSearch();

    const inputText = 'some text here';
    const input = screen.getByRole('searchbox');

    await userEvent.type(input, inputText);
    await userEvent.clear(input);

    expect(doSearch).toHaveBeenCalledTimes(1);
    expect(doSearch).toHaveBeenCalledWith('');
  });
});
