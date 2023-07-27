import '@testing-library/jest-dom/extend-expect';

jest.mock('@tanstack/react-query', () => ({
    useInfiniteQuery: jest.fn(),
    useMutation : jest.fn()
}));



class IntersectionObserverMock {
    callback
    constructor(callback) {
        this.callback = callback
    }

    observe(target) {
        if (target) this.callback([{ isIntersecting: true }])
    }
    disconnect() { }
}

Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: IntersectionObserverMock,
});