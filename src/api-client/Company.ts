import { Company as CompanyType } from "src/types"

import { ApiClient } from "./ApiClient"
import { SingularResource } from "./SingularResource"

export class Company extends SingularResource<CompanyType> {
    constructor(client: ApiClient) {
        super(client, "company")
    }
}
