import { CookieOptions } from 'express'
import ms from 'ms'
import { DoubleCsrfConfigOptions } from 'csrf-csrf'

export const { PORT = '3000' } = process.env
export const { DB_ADDRESS = 'mongodb://127.0.0.1:27017/weblarek' } = process.env
export const { JWT_SECRET = 'JWT_SECRET' } = process.env
export const { ORIGIN_ALLOW = 'http://localhost' } = process.env
export const ACCESS_TOKEN = {
    secret: process.env.AUTH_ACCESS_TOKEN_SECRET || 'secret-dev',
    expiry: process.env.AUTH_ACCESS_TOKEN_EXPIRY || '10m',
}
export const REFRESH_TOKEN = {
    secret: process.env.AUTH_REFRESH_TOKEN_SECRET || 'secret-dev',
    expiry: process.env.AUTH_REFRESH_TOKEN_EXPIRY || '7d',
    cookie: {
        name: 'refreshToken',
        options: {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            maxAge: ms(process.env.AUTH_REFRESH_TOKEN_EXPIRY || '7d'),
            path: '/',
        } as CookieOptions,
    },
}

export const csrfOptions: DoubleCsrfConfigOptions = {
    getSecret: () => 'SECRET',
    getSessionIdentifier: () => 'anonymous',
    getCsrfTokenFromRequest: (req) => {
        return req.headers['x-csrf-token']
    },
    cookieName: 'csrf-token',
    cookieOptions: {
        sameSite: 'strict',
        path: '/',
        secure: false,
    },
}
