import axios, { AxiosError } from "axios"
import AxiosMockAdapter from "axios-mock-adapter";
import { errorLogger } from "./utils/response";

const canHandleStatus = {
    400: true,
    200: true,
}

const SERVER_BASEURL = "https://api.a.com/library";
const CLIENT_BASEURL = "/api";
const responseRejectHandler = (e: AxiosError) => {
    errorLogger(e)
    const canHandle = Object.hasOwn(canHandleStatus, e.response?.status || Infinity);
    return canHandle ? Promise.resolve(e.response) : Promise.reject(e)
}
const server = axios.create({
    baseURL: SERVER_BASEURL
})
const client = axios.create({
    baseURL: CLIENT_BASEURL
});
server.interceptors.response.use((r) => r, responseRejectHandler)
client.interceptors.response.use((r) => r, responseRejectHandler)


const serverMock = new AxiosMockAdapter(server);
export { client, server, serverMock }