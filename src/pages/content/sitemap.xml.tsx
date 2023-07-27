import { getServerSideSitemapLegacy } from 'next-sitemap';
import { GetServerSidePropsContext } from 'next';
import { server, serverMock } from '@/api/base';
import { getContentsMock } from '@/api/mocks/content';

const getContents = getContentsMock(server, serverMock);
export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const routes = (await getContents(0, Infinity)).data.result.map((v) => ({
    loc: process.env.DOMAIN || '' + '/content/' + v.id,
  }));

  const revalidate = 60 * 60;
  const sMaxage = 60 * 60;
  ctx.res.setHeader(
    'Cache-Control',
    `public, s-maxage=${sMaxage}, stale-while-revalidate=10${revalidate}`
  );
  const sitemap = getServerSideSitemapLegacy(ctx, routes);

  return {
    props: {
      ...sitemap,
    },
  };
}

export default () => null;
