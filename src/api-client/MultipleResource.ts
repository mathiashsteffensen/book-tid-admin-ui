import { Resource, ResourceMethodConfig } from "src/api-client/Resource"

export class MultipleResource<
    TSelect,
    TInsert = Partial<TSelect>
> extends Resource<TSelect, TInsert> {
    async get(id: string, config: ResourceMethodConfig = {}): Promise<TSelect> {
        if (this.cache.has(id)) {
            return this.cache.get(id) as TSelect
        }

        const result = await this.request<TSelect>({
            method: "GET",
            url: id,
            ...config,
        })

        this.cache.set(id, result)

        return result
    }

    update(
        id: string,
        data: TInsert,
        config: Omit<ResourceMethodConfig, "data"> = {}
    ): Promise<TSelect> {
        return this.request<TSelect>({
            method: "PUT",
            url: id,
            data,
            ...config,
        })
    }

    delete(id: string, config: ResourceMethodConfig = {}): Promise<TSelect> {
        return this.request<TSelect>({
            method: "DELETE",
            url: id,
            ...config,
        })
    }
}
