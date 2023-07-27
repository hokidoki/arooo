import { act, renderHook, waitFor } from '@testing-library/react'
import { useInfinityscroll } from './useInfinityscroll';
import { QueryFunctionContext, UseMutationOptions, useMutation } from '@tanstack/react-query';
import { addLike, getContents } from '@/api/routes/content';
import useContents, { useLike } from './useContents';
import { isPromise } from 'util/types';
import { queryClient } from '@/pages/_app';
import { useState } from 'react';
import { Min_Content } from '@/types/type';
import { isUndefined } from '@fxts/core';



jest.mock("@/pages/_app", () => {
    return {
        queryClient: jest.fn().mockImplementation(() => ({
            getQueryData: jest.fn(),
            setQueryData: jest.fn()
        }))(),

    }
})

jest.mock("@/api/routes/content", () => {
    return {
        addLike: jest.fn(),
        getContents: jest.fn()
    }
})

jest.mock("./useInfinityscroll", () => {
    return {
        useInfinityscroll: jest.fn()
    }
})

describe("useLike Hook", () => {
    it("mutation의 mutate를 호출하면, addLike가 호출된다.", async () => {

        const mockData = {
            mutate: (addLike as jest.Mock).mockReturnValue(Promise.resolve({ data: { result: null } }))
        };
        (useMutation as jest.Mock).mockReturnValue(mockData);

        const { result } = renderHook(() => useLike(1));

        const { likeMutation } = result.current;
        likeMutation.mutate({ id: "" });
        await waitFor(() => expect(addLike).toHaveBeenCalled());
    })

    it("mutate가 성공 하였을 때, likes가 새로운 값으로 업데이트 된다.", async () => {
        const initialize = 0;
        const expectedResult = 2;

        (addLike as jest.Mock).mockReturnValue(Promise.resolve({ data: { result: expectedResult } }));
        (useMutation as jest.Mock).mockImplementation(({ mutationFn, onSuccess }: UseMutationOptions) => {
            const mutate = async (...args: any[]) => {
                const fn = mutationFn!(...args);
                const d = isPromise(fn) ? await fn : fn;
                onSuccess!(d, args[0], {});
            }
            return {
                mutate
            }
        });
        (queryClient.getQueryData as jest.Mock).mockReturnValue(undefined)

        const { result } = renderHook(() => useLike(initialize));
        const { likeMutation, likes } = result.current;

        expect(likes).toBe(initialize);
        await act(() => likeMutation.mutate({ id: "10" }));
        await waitFor(() => expect(result.current.likes).toBe(expectedResult))
    })
    it("이미 패칭된 데이터가 존재한다면, mutate된 객체의 id를 가진 데이터의 likes를 업데이트 한다.", async () => {
        const initialize = 0;
        const expectedResult = 2;

        (addLike as jest.Mock).mockReturnValue(Promise.resolve({ data: { result: expectedResult } }));
        (useMutation as jest.Mock).mockImplementation(({ mutationFn, onSuccess }: UseMutationOptions) => {
            const mutate = async (...args: any[]) => {
                const fn = mutationFn!(...args);
                const d = isPromise(fn) ? await fn : fn;
                onSuccess!(d, args[0], {});
            }
            return {
                mutate
            }
        });
        let pages: { id: string, likes: number }[][] = [[{ id: "test", likes: 0 }]];
        (queryClient.getQueryData as jest.Mock).mockReturnValue({ pageParams: [undefined], pages: pages });
        (queryClient.setQueryData as jest.Mock).mockImplementation((key, updater) => pages = updater.pages);
        const { result } = renderHook(() => useLike(initialize));
        const { likeMutation, likes } = result.current;

        expect(likes).toBe(initialize);
        await act(() => likeMutation.mutate(pages[0][0]));
        await waitFor(() => expect(pages[0][0].likes).toBe(expectedResult))
    })
})

describe("useContents", () => {
    it("인피니티 스크롤을 이용하여, 컨텐츠를 가져온다.", async () => {
        const dummyDatas = new Array(17).fill(null).map((_, i) => ({ id: Math.random().toString() }));

        (getContents as jest.Mock).mockImplementation((skip = 0, limit = 10) => Promise.resolve({ data: { result: dummyDatas.slice(skip, skip + limit) } }));
        (useInfinityscroll as jest.Mock).mockImplementation(({ queryFn, getNextPageParam }) => {
            const [data, setData] = useState<Min_Content[][] | undefined>(undefined);
            const [hasNextPage, setHasNextPage] = useState(true);
            const trigger = async () => {
                if (!hasNextPage) return;

                const nd = await queryFn({ queryKey: [''], meta: undefined, pageParam: getNextPageParam(data ? data[data.length - 1] : [], data), signal: undefined } as QueryFunctionContext);
                const ud = isUndefined(data) ? [nd] : [...data, nd]
                setData(ud);
                setHasNextPage(getNextPageParam(nd, ud) !== undefined)
            };

            return {
                data: {
                    pages: data
                },
                trigger
            };


        });
        const { result } = renderHook(() => useContents());
        const { flatdata } = result.current;
        let tryCount = Math.ceil(dummyDatas.length / 10);
        while (tryCount-- !== 0) {
            const { trigger } = result.current as typeof result.current & { trigger: () => Promise<never> }
            await act(() => trigger())
        }

        await waitFor(() => expect(flatdata(result.current.data)).toHaveLength(dummyDatas.length))
        for (const [key, d] of Object.entries(flatdata(result.current.data) as Min_Content[])) {
            expect(d.id).toBe(dummyDatas[~~key].id)
        }


    })
})