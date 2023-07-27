import { AxiosResponse } from "axios";
import type { Response } from "@/api/utils/response";

export type R<T = any, D = any> = Promise<AxiosResponse<Response<T>, D>>
// 
export interface Content {
    id: string,
    title: string,
    likes: number,
    content: string,
}

export interface Min_Content extends Omit<Content, "content"> { }

