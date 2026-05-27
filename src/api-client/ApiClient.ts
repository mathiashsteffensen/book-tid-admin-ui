import axios, { AxiosError, AxiosRequestConfig } from "axios"
import { NextRequest } from "next/server"

import { PaymentIntent } from "src/api-client/PaymentIntent"
import { __PROD__, isServer } from "src/constants"

import { Appointments } from "./Appointments"
import { AuthToken } from "./AuthToken"
import { Categories } from "./Categories"
import { Company } from "./Company"
import { Customers } from "./Customers"
import { Employees } from "./Employees"
import { Products } from "./Products"
import { Services } from "./Services"
import { Subscription } from "./Subscription"
import { User } from "./User"

export type RequestConfig = Omit<
    AxiosRequestConfig,
    "baseURL" | "withCredentials"
>

export class ApiClient {
    constructor(private baseUrl: string, private authenticationToken: string) {}

    async request<T>(config: RequestConfig): Promise<T> {
        try {
            const response = await axios.request({
                ...config,
                headers: {
                    ...config.headers,
                    ...AuthToken.header(this.authenticationToken),
                },
                baseURL: this.baseUrl,
                withCredentials: true,
            })

            return response.data
        } catch (error) {
            if (error instanceof AxiosError) {
                if (__PROD__) {
                    throw error.message
                }

                console.error("Error requesting", config.url)
                console.error(error)

                throw error.response?.data.error || error.message
            }

            throw error
        }
    }

    user = new User(this)
    company: Omit<Company, "create"> = new Company(this)
    subscription = new Subscription(this)
    services = new Services(this)
    categories = new Categories(this)
    products: Pick<Products, "get" | "list"> = new Products(this)
    employees = new Employees(this)
    customers = new Customers(this)
    appointments = new Appointments(this)
    paymentIntent: Pick<PaymentIntent, "get"> = new PaymentIntent(this)
}

const apiUrl =
    process.env.NODE_ENV === "production"
        ? "https://api.booktid.net/admin"
        : "http://localhost:3000/admin"

let _cachedApiClient: ApiClient
export const newApiClient = () => {
    if (!_cachedApiClient) {
        _cachedApiClient = new ApiClient(apiUrl, AuthToken.get() || "")
    }

    return _cachedApiClient
}

const apiClientMissingRequest = (): NextRequest => {
    throw Error("Missing request for initializing server API client")
}

export const api = (req?: NextRequest) =>
    isServer()
        ? newApiClientForServer(req || apiClientMissingRequest())
        : newApiClient()

export const newApiClientForServer = (req: NextRequest) =>
    new ApiClient(apiUrl, AuthToken.getFromRequest(req))
