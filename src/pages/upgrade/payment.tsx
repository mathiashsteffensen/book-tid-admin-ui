import { Divider, useTheme } from "@mui/material"
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { Elements } from "@stripe/react-stripe-js/"
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js"
import { useRouter } from "next/router"
import { FC, ReactNode, useEffect } from "react"

import { api } from "src/api-client"
import {
    Alert,
    Button,
    Paper,
    Spacer,
    Spinner,
    Stack,
    Text,
    TextProps,
} from "src/components/agnostic"
import { Layout } from "src/components/custom"
import { PathHelper } from "src/helpers"
import { useAsyncLazy, useQueryState } from "src/hooks"

const stripePublicKeyMissing = (): string => {
    throw new Error("Stripe public key is missing")
}
const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || stripePublicKeyMissing()
)

type InvoiceLineItemProps = {
    title: string
    price: number
    text?: Partial<TextProps>
}

const InvoiceLineItem: FC<InvoiceLineItemProps> = ({
    title,
    price,
    text = {},
}) => (
    <Spacer vertical={4}>
        <Stack direction="row" justifyContent="space-between">
            <Text {...text}>{title}</Text>

            <Text {...text}>
                {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "dkk",
                    minimumFractionDigits: 2,
                }).format(price / 100)}
            </Text>
        </Stack>
    </Spacer>
)

const Invoice: FC<{
    flatPrice: number
    totalUnitPrice: number
    total: number
    quantity: number
}> = ({ flatPrice, totalUnitPrice, total, quantity }) => {
    return (
        <Stack direction="column">
            <InvoiceLineItem title="Basis pris" price={flatPrice} />

            <Divider />

            <InvoiceLineItem
                title={`${quantity} x medarbejdere`}
                price={totalUnitPrice}
            />

            <Divider />

            <InvoiceLineItem
                title="Total"
                price={total}
                text={{ fontWeight: "600" }}
            />
        </Stack>
    )
}

const PaymentContext: FC<{ children: ReactNode; total: number }> = ({
    children,
    total,
}) => {
    const theme = useTheme()

    const stripeOptions: StripeElementsOptions = {
        mode: "subscription",
        paymentMethodCreation: "manual",
        amount: total,
        currency: "dkk",
        appearance: {
            labels: "floating",
            theme: "night",
            variables: {
                colorBackground: theme.palette.background.paper,
                colorText: theme.palette.common.white,
                colorPrimary: theme.palette.primary.main,
            },
        },
        paymentMethodTypes: ["card"],
    }

    return (
        <Elements stripe={stripePromise} options={stripeOptions}>
            {children}
        </Elements>
    )
}

const PaymentCollector: FC<{ priceId: string; quantity: number }> = ({
    priceId,
    quantity,
}) => {
    const stripe = useStripe()
    const elements = useElements()

    const router = useRouter()

    const { execute: handleSubmit, loading, error } = useAsyncLazy(async () => {
        if (!elements || loading) {
            return
        }

        await elements.submit()

        const { paymentMethod } =
            (await stripe?.createPaymentMethod({
                elements,
            })) || {}
        if (!paymentMethod) {
            return
        }

        await api().subscription.create({
            paymentMethodId: paymentMethod.id,
            priceId,
            quantity,
        })

        await router.push(PathHelper.calendarPath)
    })

    return (
        <>
            {error && <Alert color="error">{error}</Alert>}

            <PaymentElement />

            <Button
                onClick={handleSubmit}
                grow
                loading={loading}
                disabled={loading}
                variant="contained"
                color="primary"
            >
                Betal
            </Button>
        </>
    )
}

const PaymentPage = () => {
    const [quantity] = useQueryState("quantity", 1)
    const [productId] = useQueryState("productId")
    const { data: product, execute: fetchProduct } = useAsyncLazy(() =>
        api().products.get(productId)
    )
    useEffect(() => {
        fetchProduct()
    }, [fetchProduct, productId])

    const price = product?.prices[0]

    const flatPrice = price?.flatAmount || 0
    const totalUnitPrice = (price?.unitAmount || 0) * quantity
    const total = flatPrice + totalUnitPrice

    return (
        <PaymentContext total={total}>
            <Layout title="Betaling">
                <Paper>
                    <Text size={1}>BOOKTID.NET</Text>
                    <Text size={3}>{product?.name}</Text>

                    <Spacer vertical={5} />

                    <Paper variant="outlined">
                        {product && price ? (
                            <>
                                <Stack direction="column" spacing={4}>
                                    <Invoice
                                        flatPrice={flatPrice}
                                        totalUnitPrice={totalUnitPrice}
                                        total={total}
                                        quantity={quantity}
                                    />

                                    <PaymentCollector
                                        priceId={price.id}
                                        quantity={quantity}
                                    />
                                </Stack>
                            </>
                        ) : (
                            <Spinner />
                        )}
                    </Paper>
                </Paper>
            </Layout>
        </PaymentContext>
    )
}

export default PaymentPage

export const getServerSideProps = async ({ req }) => {
    const user = await api(req).user.get()

    if (!user) {
        return {
            redirect: {
                permanent: false,
                destination: "/login",
            },
        }
    }

    return {
        props: {
            user,
        },
    }
}
