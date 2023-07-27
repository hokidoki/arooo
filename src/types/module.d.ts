declare module 'next-sitemap' {
    import { GetServerSidePropsContext } from 'next';

    // 다른 필요한 타입들도 추가할 수 있습니다.

    function getServerSideSitemapLegacy(
        ctx: GetServerSidePropsContext,
        routes: Array<{ [key in string]: string }>,
    ): { props: any };

    // 다른 함수들도 필요하다면 추가할 수 있습니다.

    export { getServerSideSitemapLegacy };
}