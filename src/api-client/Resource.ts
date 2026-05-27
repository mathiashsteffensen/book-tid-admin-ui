import { ApiClient, RequestConfig } from "src/api-client/ApiClient"
import { Model } from "src/types"

export type ResourceMethodConfig = Omit<RequestConfig, "method" | "url">

export class Resource<
    TSelect,
    TInsert = Partial<TSelect>,
    TCreateResponse = TSelect
> {
    constructor(protected apiClient: ApiClient, public name: string) {}

    protected cache = new Map<string, TSelect>()

    async list(config: ResourceMethodConfig = {}): Promise<Array<TSelect>> {
        const result = await this.request<Array<TSelect>>({
            method: "GET",
            ...config,
        })

        console.log(result)

        result.forEach((item) => {
            this.cache.set((item as Model).id as string, item)
        })

        return result
    }

    create(
        data: TInsert,
        config: Omit<ResourceMethodConfig, "data"> = {}
    ): Promise<TCreateResponse> {
        return this.request<TCreateResponse>({
            method: "POST",
            data,
            ...config,
        })
    }

    async request<T>(config: RequestConfig): Promise<T> {
        const url = [this.name, config.url].filter(Boolean).join("/")

        const resolvedConfig = {
            ...config,
            url: `/${url}`,
        }

        console.log("Sending API request:", resolvedConfig)

        return this.apiClient.request<T>(resolvedConfig)
    }
}
