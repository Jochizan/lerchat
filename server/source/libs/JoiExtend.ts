import { extend } from 'joi'
import JoiObjectIdExtension from 'object-id-joi-extension'

export const joiWithObjectId = extend(JoiObjectIdExtension)
