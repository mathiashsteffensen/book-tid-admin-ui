import { NextRequest } from "next/server"

const AUTH_TOKEN_KEY = "book-tid-authentication-token"
const AUTH_TOKEN_COOKIE_KEY = AUTH_TOKEN_KEY
const AUTH_TOKEN_LOCAL_STORAGE_KEY = AUTH_TOKEN_KEY
const AUTH_TOKEN_HEADER_KEY = AUTH_TOKEN_KEY

export class AuthToken {
    static clear() {
        localStorage.removeItem(AUTH_TOKEN_LOCAL_STORAGE_KEY)
        document.cookie = `${AUTH_TOKEN_COOKIE_KEY}=; expires=Fri, 01 Jan 1970 00:00:01 GMT`
    }

    static set(token: string) {
        localStorage.setItem(AUTH_TOKEN_LOCAL_STORAGE_KEY, token)
        document.cookie = `${AUTH_TOKEN_COOKIE_KEY}=${token}; expires=Fri, 31 Dec 9999 23:59:59 GMT`
    }

    static get() {
        return localStorage.getItem(AUTH_TOKEN_LOCAL_STORAGE_KEY)
    }

    static getFromRequest(req: NextRequest) {
        return req.cookies[AUTH_TOKEN_COOKIE_KEY]
    }

    static header(authenticationToken: string) {
        return {
            [AUTH_TOKEN_HEADER_KEY]: authenticationToken,
        }
    }
}
