'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import BlogList from '@/components/section/blog/BlogList';
import { Container } from '@/components/system/Container';
import Head from 'next/head';

const BlogTagPage: React.FC = () => {
  const params = useParams();
  const tag = decodeURIComponent(params.tag as string);

  return (
    <>
      <Head>
        <title>{`Posts tagged "${tag}" - myShop Blog`}</title>
        <meta
          name="description"
          content={`Browse all blog posts tagged with "${tag}" on myShop blog.`}
        />
        <meta name="keywords" content={`${tag}, coffee blog, myShop blog`} />
        <meta
          property="og:title"
          content={`Posts tagged "${tag}" - myShop Blog`}
        />
        <meta
          property="og:description"
          content={`Browse all blog posts tagged with "${tag}" on myShop blog.`}
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`/blog/tag/${encodeURIComponent(tag)}`} />
      </Head>

      <Container flow="column" alignItems="center">
        <BlogList selectedTag={tag} />
      </Container>
    </>
  );
};

export default BlogTagPage;
