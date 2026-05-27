export class JSONHelper {
    static camelCaseJson(obj: unknown) {
        if (Array.isArray(obj)) {
            return this.camelCaseArray(obj)
        } else if (obj && typeof obj === "object") {
            return this.camelCaseObject(obj)
        } else {
            return obj
        }
    }

    private static camelCaseObject(obj: object) {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [
                this.camelCaseString(key),
                this.camelCaseJson(value),
            ])
        )
    }

    private static camelCaseArray(obj: Array<unknown>) {
        return obj.map((value) => this.camelCaseJson(value))
    }

    private static camelCaseString(key: string): string {
        return key
            .toLowerCase()
            .replace(/([-_][a-z])/g, (group) =>
                group.toUpperCase().replace("-", "").replace("_", "")
            )
    }
}
