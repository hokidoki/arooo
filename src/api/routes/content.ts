import { client } from "@/api/base";
import { Content, Min_Content, R } from "@/types/type";

const BASE_PATH = "/contents/"
const GET_CONTENT = (id: string) => BASE_PATH + id;
const ADD_LIKE = (id: string) => GET_CONTENT(id) + "/like";
const routes = {
    BASE_PATH,
    GET_CONTENT,
    ADD_LIKE
}
function getContents(skip = 0, limit = 10): R<Min_Content[]> {
    const params = { skip, limit }
    return client.get(BASE_PATH, { params })
}

function getContent(id: string): R<Content> {
    return client.get(GET_CONTENT(id), {})
}

function addLike(id: string): R<{ likes: number }> {
    return client.post(ADD_LIKE(id))
}

function test(): R<{ message: string }> {
    return client.get("/test")
}

export {
    getContents,
    getContent,
    addLike,
    test,
    routes
}