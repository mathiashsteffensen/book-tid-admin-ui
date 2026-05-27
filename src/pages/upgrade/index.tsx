import { useMemo, useState } from "react"

import { api } from "src/api-client"
import {
    Button,
    NumberField,
    Paper,
    Stack,
    Text,
} from "src/components/agnostic"
import { Layout } from "src/components/custom"
import { PathHelper } from "src/helpers"
import { Price, Product } from "src/types"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const features = {
    premium: [
        {
            title: "Modtag nemt online bookinger",
        },
        {
            title: "Ubegrænsede bookinger",
        },
        {
            title: "Få en personlig bookingside",
            description: `Konverter visninger til salg.`,
        },
        {
            title:
                "Sæt begrænsninger for hvor kort tid før der kan bookes, så du altid er forberedt.",
        },
        {
            title: "Send e-mail bekræftelser til dine kunder automatisk",
            description:
                "Send bekræftelses e-mails, samt e-mails når tider ændres eller aflyses.",
        },
        {
            title: "Send SMS påmindelser automatisk",
            description:
                "Hver sikker på at dine kunder dukker op til deres aftaler, og undgå tabt omsætning.",
        },
    ],
}

type UpgradeProps = {
    products: Array<Product & { prices: Array<Price> }>
}

const Upgrade = ({ products }: UpgradeProps) => {
    const formatter = useMemo(
        () =>
            new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "dkk",
                minimumFractionDigits: 2,
            }),
        []
    )

    const [quantity, setQuantity] = useState(1)
    const totalAmount = useMemo(() => {
        const price = products[0].prices[0]

        return price.flatAmount + price.unitAmount * quantity
    }, [quantity, products])

    return (
        <Layout title="Opgrader">
            {products.map((product) => (
                <Paper key={product.id}>
                    <Stack direction="column" alignItems="center" spacing={3}>
                        <Stack direction="column" spacing={1}>
                            <Text size={1}>{product.name}</Text>

                            <Text size={4}>
                                {formatter.format(totalAmount / 100)}
                            </Text>
                        </Stack>

                        <NumberField
                            value={quantity}
                            onChange={(value) => value && setQuantity(value)}
                            label={`Antal ${product.stripeData.metadata.unit_name}`}
                            name="quantity"
                        />

                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            grow
                            href={PathHelper.upgradePaymentPath({
                                quantity: quantity.toString(),
                                productId: product.id,
                            })}
                        >
                            Gå til betaling
                        </Button>
                    </Stack>
                </Paper>
            ))}
        </Layout>
    )
}

export default Upgrade

export async function getServerSideProps({ req }) {
    const user = await api(req)
        .user.get()
        .catch(() => {})

    if (!user) {
        return {
            redirect: {
                permanent: false,
                destination: "/login",
            },
        }
    }
    const products = await api(req).products.list()
    const subscription = await api(req).subscription.get()

    if (subscription) {
        return {
            redirect: {
                permanent: false,
                destination: "/profil",
            },
        }
    }

    return {
        props: {
            user,
            products,
        },
    }
}
