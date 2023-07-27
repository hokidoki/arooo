import type { NextApiRequest, NextApiResponse } from 'next'
import { addLikeMock } from '@/api/mocks/content'
import { server, serverMock } from '@/api/base'
import { handler, methodRouter, r_200, r_400, r_500 } from '@/api/utils/response'
import { Content } from '@/types/type';
import { isString, isUndefined } from '@fxts/core';


const addLike = addLikeMock(server, serverMock);
const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { id } = req.query;
        let content: Content | undefined;
        if (!isString(id) || isUndefined((content = (await addLike(id)).data.result))) return r_400(res, null);

        return r_200(res, content);
    } catch (error) {
        return r_500(res, "")
    }
}
const router = methodRouter(undefined, POST);
export default handler(router)

