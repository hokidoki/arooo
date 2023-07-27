import DefaultHeader from '@/components/Common/DefaultHeader';
import DetailContent from '@/components/main/DetailContent';
import Layout from '@/components/main/Layout';
import { server, serverMock } from '@/api/base';
import { getContentMock } from '@/api/mocks/content';
import { useLike } from '@/hooks/useContents';
import { Content } from '@/types/type';
import { isString } from '@fxts/core';
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';

const getContent = getContentMock(server, serverMock);

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { id } = query;
  if (!isString(id)) return { notFound: true };

  const data = await getContent(id)
    .then((r) => (r.data.result ? r.data.result : Promise.reject('')))
    .catch(() => undefined);
  if (!data) return { notFound: true };

  return {
    props: data,
  };
};

interface Props extends Content {}

export default function Detail(props: Props) {
  const { likes, likeMutation } = useLike(props.likes);

  return (
    <>
      <NextSeo
        title={props.title}
        description={props.content}
        canonical={`${process.env.DOMAIN} + "/contents/${props.id}`}
      />
      <DefaultHeader />
      <Layout title={`Detail Of the ${props.title}`}>
        <DetailContent
          title={props.title}
          id={props.id}
          content={props.content}
          likes={likes}
          buttonOnClick={() => likeMutation.mutate(props)}
        />
      </Layout>
    </>
  );
}
