export class StringHelper {
    static toHumanReadable(string: string): string {
        return string[0].toUpperCase() + string.slice(1)
    }
}
