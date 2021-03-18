export const isServer = () => typeof window === "undefined"
export const isClient = () => typeof window !== "undefined"

export const __PROD__ = process.env.NODE_ENV === "production"
export const __DEV__ = process.env.NODE_ENV === "development"