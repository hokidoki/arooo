import { curry, isUndefined, pipe } from "@fxts/core";
import { NextApiRequest, NextApiResponse } from "next";

export interface Response<T> {
    result: T,
    message: string
}

const serverResponse = <T>(message: string, result: T): Response<T> => ({ message, result });
const p = curry((status: number, res: NextApiResponse) => res.status(status))
const send = curry(<T>(data: T, res: NextApiResponse,) => (res.json(data)));

const successStatus = p(200);
const badStatus = p(400);
const internalStatus = p(500);
const notFoundStatus = p(404);
// 
const ok = curry(serverResponse)("OK");
const badReuqest = curry(serverResponse)("BAD_REQUEST");
const internalError = curry(serverResponse)("INTERNAL_ERRROR");
const notFount = curry(serverResponse)("NOT_FOUND");
// 
type R = <T = any>(nRes: NextApiResponse, d: T) => void;
const r_200: R = <T = any>(nRes: NextApiResponse, d: T) => pipe(
    successStatus(nRes),
    send(ok(d as any))
)

const r_400: R = <T = any>(nRes: NextApiResponse, d: T) => pipe(
    badStatus(nRes),
    send(badReuqest(d as any))
)
const r_404: R = <T = any>(nRes: NextApiResponse, d: T) => pipe(
    notFoundStatus(nRes),
    send(notFount(d as any))
)

const r_500: R = <T = any>(nRes: NextApiResponse, d: T) => pipe(
    internalStatus(nRes),
    send(internalError(d as any))
)

type APIHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<ReturnType<R>> | ReturnType<R>
const methodRouter: (...args: (APIHandler | undefined)[]) => { [key in string]: APIHandler | undefined } = (GET, POST, PUT, DELETE) => ({
    GET,
    POST,
    PUT,
    DELETE
})

const handler_1 = (router: ReturnType<typeof methodRouter>, req: NextApiRequest, res: NextApiResponse) => {
    let method: string | undefined;
    let handle: APIHandler | undefined
    if (isUndefined((method = req.method)) || isUndefined(handle = router[method])) return r_404(res, null)
    return handle(req, res);
}


const handler = (router: ReturnType<typeof methodRouter>) => curry(handler_1)(router)
const errorLogger = (e: Error) => (console.log("ERROR_LOGGER !!!", e.message));

export {
    methodRouter,
    r_200,
    r_400,
    r_404,
    r_500,
    ok,
    badReuqest,
    internalError,
    handler,
    errorLogger
}

