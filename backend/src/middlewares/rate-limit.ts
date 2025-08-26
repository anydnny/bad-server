import { rateLimit } from 'express-rate-limit'

export default rateLimit({
    windowMs: 60 * 1000,
    limit: 40,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests',
})
