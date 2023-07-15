import {
  getTvaFee,
  getPriceWithTvaFee,
  formatPrice,
  formatPriceWithCurrency,
  stringToFloat,
} from './pricing-utils';

describe('Price with Tva Fee should calculate properly', () => {
  it('Should return tva fee', () => {
    const price = 100;
    const tvaFeePercentage = 0.2;
    const tvaFee = 20;
    expect(getTvaFee({ price, tvaFeePercentage: tvaFeePercentage })).toEqual(
      tvaFee,
    );
    expect(
      getTvaFee({ price, tvaFeePercentage: tvaFeePercentage }),
    ).toMatchInlineSnapshot(`20`);
  });
  it('Should return price including tva fee', () => {
    const price = 100;
    const tvaFeePercentage = 0.2;
    const priceWithTvaFee = 120;
    expect(getPriceWithTvaFee({ price, tvaFeePercentage })).toEqual(
      priceWithTvaFee,
    );
    expect(
      getPriceWithTvaFee({ price, tvaFeePercentage }),
    ).toMatchInlineSnapshot(`120`);
  });
});

describe('Price is formatted and value is returned in euros and cents', () => {
  it.each([
    {
      value: 1,
      expected: { euros: '1', cents: '00' },
    },
    { value: 1.0001, expected: { euros: '1', cents: '00' } },
    { value: 1.09, expected: { euros: '1', cents: '09' } },
    { value: 1.1, expected: { euros: '1', cents: '10' } },
    { value: 10_000, expected: { euros: '10 000', cents: '00' } },
    { value: 100_000_000, expected: { euros: '100 000 000', cents: '00' } },
    { value: 19.95, expected: { euros: '19', cents: '95' } },
  ])('Can return %o', ({ value, expected }) => {
    const result = formatPrice(value);
    expect(formatPrice(value)).toEqual(expected);
    expect(typeof result.euros).toBe('string');
    expect(typeof result.cents).toBe('string');
  });
});
it('Should display with currency', () => {
  expect(formatPriceWithCurrency({ price: 10 })).toBe('10,00 €');
});
it('Should display with TTC', () => {
  expect(formatPriceWithCurrency({ price: 10, TTC: true })).toBe('10,00 € TTC');
});
it('Should display with TTC', () => {
  expect(formatPriceWithCurrency({ price: 10, TTC: true, HT: true })).toBe(
    '10,00 € TTC',
  );
});
it('Should display with HT', () => {
  expect(formatPriceWithCurrency({ price: 10, HT: true })).toBe('10,00 € HT');
});
it('Should format price to two digits', () => {
  expect(stringToFloat('9.51')).toMatchInlineSnapshot(`9.51`);
});
