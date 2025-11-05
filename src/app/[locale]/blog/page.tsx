'use client';

import React from 'react';
import BlogList from '@/components/section/blog/BlogList';
import { Container } from '@/components/system/Container';
import Head from 'next/head';

const BlogPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Blog - myShop</title>
        <meta
          name="description"
          content="Read our latest blog posts about coffee, equipment, and brewing tips."
        />
        <meta
          name="keywords"
          content="coffee blog, brewing tips, coffee equipment, myShop blog"
        />
        <meta property="og:title" content="Blog - myShop" />
        <meta
          property="og:description"
          content="Read our latest blog posts about coffee, equipment, and brewing tips."
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/blog" />
      </Head>

      <Container flow="column" alignItems="center">
        <BlogList />
      </Container>
    </>
  );
};

export default BlogPage;
