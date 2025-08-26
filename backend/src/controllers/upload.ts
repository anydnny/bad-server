import { NextFunction, Request, Response } from 'express'
import { loadEsm } from 'load-esm'
import { constants } from 'http2'
import BadRequestError from '../errors/bad-request-error'
import { allowedTypes } from '../middlewares/file'

export const uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.file) {
        return next(new BadRequestError('Файл не загружен'))
    }

    const { fileTypeFromFile } =
        await loadEsm<typeof import('file-type')>('file-type')

    const fileType = await fileTypeFromFile(req.file.path)

    if (!fileType || !fileType.mime || !allowedTypes.includes(fileType.mime)) {
        return next(new BadRequestError('Unexpected file type'))
    }

    try {
        const fileName = process.env.UPLOAD_PATH
            ? `/${process.env.UPLOAD_PATH}/${req.file.filename}`
            : `/${req.file?.filename}`
        return res.status(constants.HTTP_STATUS_CREATED).send({
            fileName,
            originalName: req.file?.originalname,
        })
    } catch (error) {
        return next(error)
    }
}

export default {}
