import { ApiClient } from "src/api-client/ApiClient"
import { MultipleResource } from "src/api-client/MultipleResource"
import { Employee, User as UserType } from "src/types"

export type EmployeesSelect = Employee & { user: UserType }
export type EmployeesInsert = Partial<Employee> & { user: Partial<UserType> }

export class Employees extends MultipleResource<
    EmployeesSelect,
    EmployeesInsert
> {
    constructor(apiClient: ApiClient) {
        super(apiClient, "employees")
    }
}
