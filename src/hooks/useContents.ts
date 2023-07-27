import { addLike, getContents } from "@/api/routes/content";
import { Min_Content } from "@/types/type";
import { GetNextPageParamFunction, InfiniteData, QueryFunctionContext, useMutation } from "@tanstack/react-query";
import { useInfinityscroll } from "./useInfinityscroll";
import { flat, isUndefined, pipe, toArray } from '@fxts/core';
import { errorLogger } from "@/api/utils/response";
import { queryClient } from "@/pages/_app";
import { useState } from "react";

export function useLike(init = 0) {
    const [likes, setLikes] = useState(init);
    const mutationFn = ({ id }: { id: string }) => addLike(id).then(v => Promise.resolve(v?.data.result) || Promise.reject("MUTATING_ERROR").catch(errorLogger)) as Promise<number>;
    const likeMutation = useMutation({
        mutationFn,
        onSuccess: (d, v) => {
            const updatedId = v.id, updatedLikes = d;
            const previouseData = queryClient.getQueryData<InfiniteData<Min_Content[]>>(["contents"], {
                exact: true,
            });
            setLikes(updatedLikes)
            if (!previouseData) return;

            const updatedData = {
                pageParams: previouseData.pageParams,
                pages: previouseData.pages.map((page) => page.map(v => v.id === updatedId ? { ...v, likes: updatedLikes } : v))
            }
            queryClient.setQueryData(["contents"], updatedData)
        }
    })
    return {
        likeMutation,
        likes
    }
}

export default function useContents() {
    const N = 10;
    const getNextPageParam: GetNextPageParamFunction<Min_Content[]> = (l, a) => l.length === N ? a.length * N : undefined;

    const { likeMutation } = useLike();
    const queryFn = async (context: QueryFunctionContext) => {
        const skip = context.pageParam;
        const d = (await getContents(skip, N)).data.result;
        return d;
    }

    const infiniteScroll = useInfinityscroll<
        Min_Content[]
    >({
        queryKey: ['contents'],
        queryFn,
        getNextPageParam,
        refetchInterval: false,
        cacheTime: 0,
        refetchOnReconnect: "always"
    });

    const flatdata = (d: typeof infiniteScroll.data) => (isUndefined(d) ? [] : pipe(d.pages, flat, toArray));

    return {
        ...infiniteScroll,
        flatdata,
        like: likeMutation
    }
}