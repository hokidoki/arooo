import React from 'react';
import Contents from '@/components/main/Contents';
import Layout from '@/components/main/Layout';
import useContents from '@/hooks/useContents';
import { NextSeo } from 'next-seo';

export default function Index() {
  const { data, target, hasNextPage, isFetching, flatdata, like } =
    useContents();

  return (
    <>
      <NextSeo
        title="Contents List"
        description="컨텐츠 리스트 입니다."
        canonical={process.env.DOMAIN}
      />
      <Layout title="Content List">
        <Contents>
          {flatdata(data).map((v) => (
            <Contents.Content
              buttonOnClick={() => like.mutate(v)}
              {...v}
              key={v.id}
            />
          ))}
          {!isFetching && hasNextPage && (
            <div
              style={{
                width: '100%',
                height: '100px',
              }}
              ref={target}
            />
          )}
        </Contents>
      </Layout>
    </>
  );
}
