import db from "@/db";
import MockAdapter from "axios-mock-adapter";
import { routes as content, getContent, getContents, routes } from "../routes/content";
import { AxiosInstance } from "axios";
import { isNull, isUndefined } from "@fxts/core";
import { badReuqest, ok } from "../utils/response";


const getContentsMock = (server: AxiosInstance, mockAdt: MockAdapter) => {
    mockAdt.onGet(content.BASE_PATH).reply(async (config) => {
        const { params } = config;

        const list = await db.getContents(params.skip, params.limit)
        return [200, ok(list)]
    })

    const api: typeof getContents = (skip, limit) => server.get(content.BASE_PATH, { params: { skip, limit } })

    return api
}

const GET_CONTENT_PATH = (id: string) => `/library/contents/${id}`
const getContentMock = (server: AxiosInstance, mockAdt: MockAdapter) => {
    const api: typeof getContent = (id) => {
        mockAdt.onGet(GET_CONTENT_PATH(id)).replyOnce(async () => {
            const find = await db.findContent(id)
            return [isUndefined(find) ? 400 : 200, isUndefined(find) ? badReuqest(find) : ok(find)]
        })

        return server.get(GET_CONTENT_PATH(id));
    }
    return api
}

const ADD_LIKE_PATH = (id: string) => `/library/contents/${id}/like`;
const addLikeMock = (server: AxiosInstance, mockAdt: MockAdapter) => {
    const api: typeof getContent = (id) => {
        mockAdt.onPost(ADD_LIKE_PATH(id)).replyOnce(async () => {
            const updatedLike = await db.updateContentLike(id, 1);
            return [isNull(updatedLike) ? 400 : 200, isNull(updatedLike) ? badReuqest() : ok(updatedLike)]
        })
        return server.post(ADD_LIKE_PATH(id));
    }
    return api
}


export {
    getContentsMock,
    getContentMock,
    addLikeMock
}