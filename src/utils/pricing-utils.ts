export const getTvaFee = ({
  price,
  tvaFeePercentage,
}: {
  price: number;
  tvaFeePercentage: number;
}): number => {
  return price * tvaFeePercentage;
};

export const getPriceWithTvaFee = ({
  price,
  tvaFeePercentage,
}: {
  price: number;
  tvaFeePercentage: number;
}): number => {
  return price + getTvaFee({ price, tvaFeePercentage });
};

// * Nous souhaitons arrondir le prix à 2 décimales, même si le prix est un nombre entier
export const getRoundedPrice = (price: number) => {
  return Math.round(price * 100) / 100;
};

// Renvoie le prix et les centimes séparémmment
export const formatPrice = (
  price: number,
): {
  euros: string;
  cents: string;
} => {
  const euros = price
    .toString()
    .split('.')[0]
    // https://stackoverflow.com/a/16637170
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const cents = price.toFixed(2).toString().split('.')[1];
  return { euros, cents };
};

// Renvoie le prix avec la devise formatté : 12,20 €
export const formatPriceWithCurrency = ({
  price,
  TTC = false,
  HT = false,
}: {
  price: number;
  TTC?: boolean;
  HT?: boolean;
}): string => {
  const { euros, cents } = formatPrice(price);
  const formattedPriceWithCurrency = `${euros},${cents} €`;
  if (TTC) return `${formattedPriceWithCurrency} TTC`;
  if (HT) return `${formattedPriceWithCurrency} HT`;
  return formattedPriceWithCurrency;
};

//** Get price in euro value and convert it in cents */
export const getPriceInCents = ({ price }) => {
  const priceInCents = price * 100;
  return Math.trunc(priceInCents);
};

export const stringToFloat = (number: string): number => {
  return parseFloat(parseFloat(number).toFixed(2));
};

export const numberToFloat = (number: number): number => {
  return parseFloat(number.toFixed(2));
};
