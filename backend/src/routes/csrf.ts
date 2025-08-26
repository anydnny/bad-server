import { Router } from 'express'
import { getCsrfToken } from '../controllers/csrf'

const csrfRouter = Router()

csrfRouter.get('/', getCsrfToken)

export default csrfRouter
