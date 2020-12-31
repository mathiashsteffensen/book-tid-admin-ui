const Stripe = require('stripe')
let key = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
const stripe = Stripe(key)

async function handlePaymentThatRequiresCustomerAction({
    subscription,
    invoice,
    priceId,
    paymentMethodId,
    isRetry,
  }) {
    if (subscription && subscription.status === 'active') {
      // Subscription is active, no customer actions required.
      return { subscription, priceId, paymentMethodId };
    }
  
    // If it's a first payment attempt, the payment intent is on the subscription latest invoice.
    // If it's a retry, the payment intent will be on the invoice itself.
    let paymentIntent = invoice ? invoice.payment_intent : subscription.latest_invoice.payment_intent;
  
    if (
      paymentIntent.status === 'requires_action' ||
      (isRetry === true && paymentIntent.status === 'requires_payment_method')
    ) {
      return await stripe
        .confirmCardPayment(paymentIntent.client_secret, {
          payment_method: paymentMethodId,
        })
        .then((result) => {
          if (result.error) {
            // Start code flow to handle updating the payment details.
            // Display error message in your UI.
            // The card was declined (i.e. insufficient funds, card has expired, etc).
            throw new Error(result.error.message);
          } else {
            if (result.paymentIntent.status === 'succeeded') {
              // Show a success message to your customer.
              return {
                priceId: priceId,
                subscription: subscription,
                invoice: invoice,
                paymentMethodId: paymentMethodId,
              };
            }
          }
        })
    } else {
      // No customer action needed.
      return { subscription, priceId, paymentMethodId };
    }
}

function handleRequiresPaymentMethod({
  subscription,
  paymentMethodId,
  priceId,
}) {
  if (subscription.status === 'active') {
    // subscription is active, no customer actions required.
    return { subscription, priceId, paymentMethodId };
  } else if (
    subscription.latest_invoice.payment_intent.status ===
    'requires_payment_method'
  ) {
    // Using localStorage to manage the state of the retry here,
    // feel free to replace with what you prefer.
    // Store the latest invoice ID and status.
    localStorage.setItem('latestInvoiceId', subscription.latest_invoice.id);
    localStorage.setItem(
      'latestInvoicePaymentIntentStatus',
      subscription.latest_invoice.payment_intent.status
    );
    throw new Error('Your card was declined.')
  } else {
    return { subscription, priceId, paymentMethodId };
  }
}

export default stripe

export {
    handlePaymentThatRequiresCustomerAction,
    handleRequiresPaymentMethod
}