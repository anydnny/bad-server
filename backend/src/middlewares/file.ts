import { Request, Express } from 'express'
import multer, { FileFilterCallback } from 'multer'
import { join } from 'path'
import fs from 'fs'
import crypto from 'crypto'
import BadRequestError from '../errors/bad-request-error'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const storage = multer.diskStorage({
    destination: (
        _req: Request,
        _file: Express.Multer.File,
        cb: DestinationCallback
    ) => {
        const path = join(
            __dirname,
            process.env.UPLOAD_PATH_TEMP
                ? `../public/${process.env.UPLOAD_PATH_TEMP}`
                : '../public'
        )

        console.log('path:', path)

        if (!fs.existsSync(path)) {
            console.log(`Directory not found: ${path}`)
            try {
                fs.mkdirSync(path, { recursive: true })
                console.log(`Directory created: ${path}`)
            } catch (error) {
                console.log(`Failed to create directory : ${path}`)
            }
        }

        cb(null, path)
    },

    filename: (
        _req: Request,
        file: Express.Multer.File,
        cb: FileNameCallback
    ) => {
        const uniqueName = crypto.randomBytes(5).toString('hex')
        cb(null, `${uniqueName}${file.originalname}`)
    },
})

export const allowedTypes = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/svg+xml',
]

const fileSizeLimits = {
    minFileSize: 2 * 1024,
    maxFileSize: 10 * 1024 * 1024,
}

const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    const fileSize = Number(_req.headers['content-length'] as string)

    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new BadRequestError('Invalid type'))
    }
    if (fileSize < fileSizeLimits.minFileSize) {
        return cb(new BadRequestError('Too small'))
    }

    return cb(null, true)
}

export default multer({
    storage,
    fileFilter,
    limits: {
        fileSize: fileSizeLimits.maxFileSize,
    },
})
