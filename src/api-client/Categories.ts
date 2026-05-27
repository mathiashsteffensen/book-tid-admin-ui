import { ApiClient } from "src/api-client/ApiClient"
import { MultipleResource } from "src/api-client/MultipleResource"
import { DateHelper } from "src/helpers"
import { Category, Service } from "src/types"

export class Categories extends MultipleResource<Category> {
    constructor(apiClient: ApiClient) {
        super(apiClient, "categories")
    }

    async listWithServices(): Promise<
        Array<Category & { services: Array<Service> }>
    > {
        const categories = await this.list()

        const services = await this.apiClient.services.list()

        const categoriesWithServices = categories.map((category) => {
            return {
                ...category,
                services: services.filter(
                    (service) => service.categoryId === category.id
                ),
            }
        })

        const usedServiceIDs = categoriesWithServices
            .map((catAndServices) =>
                catAndServices.services.map((service) => service.id)
            )
            .flat()

        categoriesWithServices.push({
            id: "",
            name: "Uden Kategori",
            createdAt: DateHelper.now().toJSON(),
            updatedAt: DateHelper.now().toJSON(),
            services: services.filter((service) => {
                return !usedServiceIDs.includes(service.id)
            }),
        })

        return categoriesWithServices
    }
}
