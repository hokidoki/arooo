import { act, renderHook, waitFor } from '@testing-library/react'
import { useInfinityscroll } from './useInfinityscroll';
import { useInfiniteQuery } from '@tanstack/react-query';
import { delay } from '@fxts/core';

describe("useInfinityscroll Hook", () => {
    it("TEST FOR TEST", () => {
        expect("10").toBe("10")
    })

    it("taget이 IntersectionObserverMock에 의해 감지되었을 때, fetchNextpage가 호출된다.", async () => {
        const mockData = {
            data: {
                pages: [],
            },
            error: null,
            fetchNextPage: jest.fn(), //Test Target
            hasNextPage: true,
            isFetching: false,
            isFetchingNextPage: false,
        };
        (useInfiniteQuery as jest.Mock).mockReturnValue(mockData);
        const { result } = renderHook(() => useInfinityscroll({}));

        const { target } = result.current;
        const targetElement = document.createElement('div');
        act(() => target(targetElement))
        await waitFor(() => expect(mockData.fetchNextPage).toHaveBeenCalled());
    })

    it("isLoading이 true인 경우, fetchNextPage가 작동하지 않는다.", async () => {
        const mockData = {
            data: {
                pages: [],
            },
            error: null,
            fetchNextPage: jest.fn(), //Test Target
            hasNextPage: true,
            isFetching: true,
            isFetchingNextPage: false,
        };
        (useInfiniteQuery as jest.Mock).mockReturnValue(mockData);
        const { result } = renderHook(() => useInfinityscroll({}));
        const { target } = result.current;
        const targetElement = document.createElement('div');
        act(() => target(targetElement))
        await delay(1)
        await waitFor(() => expect(mockData.fetchNextPage).not.toHaveBeenCalled());
    })

    it("isAvailable이 false인 경우, fetchNextPage가 작동하지 않는다.", async () => {
        const mockData = {
            data: {
                pages: [],
            },
            error: null,
            fetchNextPage: jest.fn(), //Test Target
            hasNextPage: false,
            isFetching: false,
            isFetchingNextPage: false,
        };
        (useInfiniteQuery as jest.Mock).mockReturnValue(mockData);
        const { result } = renderHook(() => useInfinityscroll({}));
        const { target } = result.current;
        const targetElement = document.createElement('div');
        act(() => target(targetElement))
        await delay(1)
        await waitFor(() => expect(mockData.fetchNextPage).not.toHaveBeenCalled());
    })

})