import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import type { UseInfiniteQueryOptions } from "@tanstack/react-query";
export function useIntersectionObserver(fetchFn: () => void, isLoading: boolean, available: boolean) {
    const [target, setTarget] = useState<HTMLElement | null>(null);


    const observer = useRef<IntersectionObserver>();

    useEffect(() => {
        if (!target) return;
        observer.current = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && available && !isLoading) fetchFn();
        });
        observer.current.observe(target);
    }, [target, fetchFn, available, isLoading])

    useEffect(() => () => observer.current?.disconnect(), [])

    return {
        target: setTarget,
    }
}

export function useInfinityscroll<T>(option: UseInfiniteQueryOptions<T>) {

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
    } = useInfiniteQuery(option)
    const { target } = useIntersectionObserver(fetchNextPage, isFetching, Boolean(hasNextPage));

    return {
        target,
        data,
        error,
        isFetching,
        isFetchingNextPage,
        hasNextPage,
    }
}