export class PathHelper {
    private static join(...paths: string[]): string {
        return paths.join("/")
    }

    static create(base: string, queryParams: Record<string, string>): string {
        const queryEntries = Object.entries(queryParams)

        if (queryEntries.length === 0) {
            return base
        }

        const queryString = queryEntries
            .map(([key, value]) => `${key}=${value}`)
            .join("&")

        return `${base}?${queryString}`
    }

    static get calendarPath() {
        return "/kalender"
    }

    static get employeesPath() {
        return "/employees"
    }

    static get customersPath() {
        return "/kunder"
    }

    static get signinPath() {
        return "/login"
    }

    static get signupPath() {
        return "/opret-bruger"
    }

    static get servicesPath() {
        return "/services"
    }

    static get upgradePath() {
        return "/upgrade"
    }

    static upgradePaymentPath(queryParams: {
        quantity: string
        productId: string
    }) {
        return this.create(this.join(this.upgradePath, "payment"), queryParams)
    }
}
