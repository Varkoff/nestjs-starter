import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
const environment = process.env.GOODCOLLECT_ENV;

@Injectable()
export class StripeService {
  getStripe() {
    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

    if (!STRIPE_SECRET_KEY) {
      throw new Error(`Stripe is missing required configuration.`);
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
    });

    return stripe;
  }
  getStripePublishable() {
    const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY;

    if (!STRIPE_PUBLISHABLE_KEY) {
      throw new Error(`Stripe publishable is missing required configuration.`);
    }

    const stripe = new Stripe(STRIPE_PUBLISHABLE_KEY, {
      apiVersion: '2022-11-15',
    });

    return stripe;
  }

  async getStripePaymentMethod({
    stripeCustomerId,
    stripePaymentMethodId,
  }: {
    stripeCustomerId: string;
    stripePaymentMethodId: string;
  }) {
    try {
      const stripePaymentMethod =
        await this.getStripe().customers.retrievePaymentMethod(
          stripeCustomerId,
          stripePaymentMethodId,
        );

      if (!stripePaymentMethod) {
        throw new Error(
          "Le moyen de paiement n'a pas été trouvé. Veuillez en ajouter un avant de continuer.",
        );
      }
      const isSepaDebit = stripePaymentMethod.type === 'sepa_debit';

      return { stripePaymentMethod, isSepaDebit };
    } catch (error) {
      const errorMessage = `${environment.toUpperCase()} - Une erreur est survenue lors de la récupération du moyen de paiement Stripe. \n
      Ref: ${stripePaymentMethodId} \n
      Customer ${stripeCustomerId} \n`;

      console.log({ errorMessage });

      throw error;
    }
  }
}
