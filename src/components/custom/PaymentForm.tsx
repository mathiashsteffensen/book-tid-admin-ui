import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"

import { api } from "src/api-client"
import { Form, Paper, Text } from "src/components/agnostic"
import { useAsyncLazy } from "src/hooks"
import { Price, Product } from "src/types"

export default function PaymentForm({
    price,
    quantity,
}: {
    product: Product
    price: Price
    quantity: number
}) {
    const stripe = useStripe()
    const elements = useElements()

    async function handlePaymentThatRequiresCustomerAction({
        subscription,
        invoice,
        paymentMethodId,
    }) {
        if (!stripe) {
            return
        }

        if (subscription && subscription.status === "active") {
            // Subscription is active, no customer actions required.
            return
        }

        // If it's a first payment attempt, the payment intent is on the subscription latest invoice.
        // If it's a retry, the payment intent will be on the invoice itself.
        const paymentIntent = invoice
            ? invoice.payment_intent
            : subscription.latest_invoice.payment_intent

        const requiresAction =
            paymentIntent.status === "requires_action" ||
            paymentIntent.status === "requires_payment_method"

        if (!requiresAction) {
            return
        }

        return await stripe
            .confirmCardPayment(paymentIntent.client_secret, {
                payment_method: paymentMethodId,
            })
            .then((result) => {
                if (result.error) {
                    // Start code flow to handle updating the payment details.
                    // Display error message in your UI.
                    // The card was declined (i.e. insufficient funds, card has expired, etc).
                    throw new Error(result.error.message)
                }
            })
    }

    const createSubscription = async () => {
        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Disabling form submission.
            return
        }
        const cardElement = elements.getElement(CardElement)

        if (!cardElement) {
            return
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: cardElement,
        })

        if (error || !paymentMethod) {
            throw error?.message || "missing payment method"
        } else {
            api()
                .subscription.create({
                    paymentMethodId: paymentMethod.id,
                    priceId: price.id,
                    quantity: quantity,
                })
                .then(handlePaymentThatRequiresCustomerAction)
        }
    }

    const { execute: handleSubmit } = useAsyncLazy(createSubscription)

    return (
        <Form onSubmit={handleSubmit}>
            <Paper>
                <Text>Betalingsoversigt</Text>
            </Paper>
        </Form>
    )
}
