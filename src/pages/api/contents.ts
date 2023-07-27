import type { NextApiRequest, NextApiResponse } from 'next'
import { getContentsMock } from '@/api/mocks/content'
import { server, serverMock } from '@/api/base'
import { handler, methodRouter, r_200, r_400, r_500 } from '@/api/utils/response'

const getContents = getContentsMock(server, serverMock);
const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    try {

        let { skip = 0, limit = 10 } = req.query
        skip = ~~Number(skip)
        limit = ~~Number(limit)

        if (isNaN(skip) || isNaN(skip)) return r_400(res, [])
        const a = (await getContents(skip, limit)).data.result;
        return r_200(res, a)
    } catch (error) {
        return r_500(res, null)
    }
}

const routes = methodRouter(GET);

export default handler(routes)


