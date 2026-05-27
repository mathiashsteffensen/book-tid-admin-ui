import { Resource, ResourceMethodConfig } from "src/api-client/Resource"

export class SingularResource<
    TSelect,
    TInsert = Partial<TSelect>,
    TCreateResponse = TSelect
> extends Resource<TSelect, TInsert, TCreateResponse> {
    get(config: ResourceMethodConfig = {}): Promise<TSelect> {
        return this.request<TSelect>({
            method: "GET",
            ...config,
        })
    }

    update(
        data: TInsert,
        config: Omit<ResourceMethodConfig, "data"> = {}
    ): Promise<TSelect> {
        return this.request<TSelect>({
            method: "PUT",
            data,
            ...config,
        })
    }

    delete(config: ResourceMethodConfig = {}): Promise<TSelect> {
        return this.request<TSelect>({
            method: "DELETE",
            ...config,
        })
    }
}
