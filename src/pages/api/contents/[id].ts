import type { NextApiRequest, NextApiResponse } from 'next'
import { getContentMock } from '@/api/mocks/content'
import { server, serverMock } from '@/api/base'
import { handler, methodRouter, r_200, r_400, r_500 } from '@/api/utils/response'
import { Content } from '@/types/type';
import { isString, isUndefined } from '@fxts/core';

const getContent = getContentMock(server, serverMock);
const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { id } = req.query;
        let content: Content | undefined;
        if (!isString(id) || isUndefined((content = (await getContent(id)).data.result))) return r_400(res, null);

        return r_200(res, content);
    } catch (error) {
        return r_500(res, "")
    }
}

const router = methodRouter(GET)
export default handler(router)

