import { ResourceMethodConfig } from "src/api-client/Resource"
import { SingularResource } from "src/api-client/SingularResource"
import { Company, User as UserType } from "src/types"

import { ApiClient } from "./ApiClient"

export class User extends SingularResource<
    UserType,
    { user: Partial<UserType>; company: Partial<Company> }
> {
    constructor(client: ApiClient) {
        super(client, "user")
    }

    private userCache: UserType | null = null

    async get(config: ResourceMethodConfig = {}): Promise<UserType> {
        if (!this.userCache) {
            this.userCache = await super.get(config)
        }

        return this.userCache
    }

    authenticate(data: { email: string; password: string }): Promise<UserType> {
        return this.request({
            url: "authenticate",
            method: "PUT",
            data,
        })
    }
}
