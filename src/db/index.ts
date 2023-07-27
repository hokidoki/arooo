import { Content } from "@/types/type";
import { findIndex, map, pipe, range, slice, take, toArray } from "@fxts/core"
import { randomUUID } from "crypto";

const genDummyContent = (id: number): Content => {
    return {
        id: randomUUID(),
        title: `컨텐츠 타이틀 - ${id}`,
        content: `ID ${id}컨텐츠 내용입니다.`,
        likes: ~~(Math.random() * 10)
    }
}

const delay = <T>(v: T, t = 500) => {
    return new Promise<T>((res) => {
        setTimeout(() => res(v), t)
    })
}

export default (function db(len: number) {

    const connect: (db?: string) => Content[] = (DB?: string) => DB ? JSON.parse(DB) : connect(process.env.DB = JSON.stringify(pipe(
        range(len),
        map(genDummyContent),
        toArray)))

    const update = (json: string) => process.env.DB = json;

    const findContent = async (id: string) => {
        const a = await delay<Content | undefined>(connect(process.env.DB).find(v => v.id === id));
        return a
    }

    const updateContentLike = async (id: string, n: number) => {
        let content;
        if (!(content = await findContent(id))) return null
        else {
            // JUST USE Proxy !!!
            const con = connect(process.env.DB)
            const i = findIndex((v) => v.id === id, con);
            con[i] = { ...content, likes: content.likes + 1 };
            update(JSON.stringify(con));
            return con[i].likes
        }
    }
    const getContents = async (skip = 0, limit = 10) => {
        return await delay(pipe(connect(process.env.DB), slice(skip), take(limit), toArray))
    }

    return {
        getContents,
        updateContentLike,
        findContent
    }
})(99)

