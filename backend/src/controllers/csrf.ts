import { Request, Response } from 'express'
import { generateToken } from '../middlewares/csrf-handler'

export const getCsrfToken = async (req: Request, res: Response) => {
    const csrfToken = generateToken(req, res)
    res.send({
        csrfToken,
    })
}

export default {}
