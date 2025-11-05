import { axiosInstance } from '@/requests/base.request';
import { blogApiUrl } from '@/config/api.config';
import { Logger } from '@/utils/Logger.class';
import {
  BlogResponse,
  BlogListResponse,
  BlogTagResponse,
  CreateBlogPostRequest,
  UpdateBlogPostRequest,
  IBlogPost,
} from '@/types/blog.types';

// This will not get finished until the presentation

export const getPublishedPosts = async (
  page?: number,
  limit?: number,
  tag?: string,
  search?: string,
): Promise<BlogListResponse> => {
  try {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (tag) params.append('tag', tag);
    if (search) params.append('search', search);

    const response = await axiosInstance.get(`${blogApiUrl}?${params}`, {
      withCredentials: false,
    });

    if (
      response.data &&
      typeof response.data === 'object' &&
      'success' in response.data
    ) {
      return response.data as BlogListResponse;
    }

    if (Array.isArray(response.data)) {
      return {
        success: true,
        data: {
          posts: response.data as IBlogPost[],
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalPosts: response.data.length,
            limit: response.data.length,
          },
        },
      } as BlogListResponse;
    }

    return {
      success: false,
      error: 'Unexpected response structure',
    } as BlogListResponse;
  } catch (e) {
    Logger.error('Unable to get published posts');
    throw e;
  }
};

export const getPostBySlug = async (slug: string): Promise<BlogResponse> => {
  try {
    const response = await axiosInstance.get(`${blogApiUrl}/${slug}`, {
      withCredentials: false,
    });

    if (
      response.data &&
      typeof response.data === 'object' &&
      'success' in response.data
    ) {
      return response.data as BlogResponse;
    }

    if (
      response.data &&
      typeof response.data === 'object' &&
      '_id' in response.data
    ) {
      return {
        success: true,
        data: response.data as IBlogPost,
      } as BlogResponse;
    }

    return {
      success: false,
      error: 'Post not found',
    } as BlogResponse;
  } catch (e) {
    Logger.error('Unable to get post by slug');
    throw e;
  }
};

export const getPostsByTag = async (
  tag: string,
  page?: number,
  limit?: number,
): Promise<BlogListResponse> => {
  try {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());

    const response = await axiosInstance.get(
      `${blogApiUrl}/tag/${tag}?${params}`,
      {
        withCredentials: false,
      },
    );

    return response.data as BlogListResponse;
  } catch (e) {
    Logger.error('Unable to get posts by tag');
    throw e;
  }
};

export const getFeaturedPosts = async (
  limit?: number,
): Promise<BlogResponse> => {
  try {
    const params = new URLSearchParams();
    params.append('featured', 'true');
    if (limit) params.append('limit', limit.toString());

    const response = await axiosInstance.get(
      `${blogApiUrl}/featured?${params}`,
      {
        withCredentials: false,
      },
    );

    return response.data as BlogResponse;
  } catch (e) {
    Logger.error('Unable to get featured posts');
    throw e;
  }
};

export const getAllTags = async (): Promise<BlogTagResponse> => {
  try {
    const response = await axiosInstance.get(`${blogApiUrl}/tags`, {
      withCredentials: false,
    });

    return response.data as BlogTagResponse;
  } catch (e) {
    Logger.error('Unable to get blog tags');
    throw e;
  }
};

export const createPost = async (
  postData: CreateBlogPostRequest,
  imageFile?: File,
): Promise<BlogResponse> => {
  try {
    if (imageFile) {
      const formData = new FormData();
      formData.append('data', JSON.stringify(postData));
      formData.append('image', imageFile);

      const response = await axiosInstance.post(
        `${blogApiUrl}/admin`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: false,
        },
      );
      return response.data;
    } else {
      const response = await axiosInstance.post(
        `${blogApiUrl}/admin`,
        postData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: false,
        },
      );
      return response.data;
    }
  } catch (e) {
    Logger.error('Unable to create blog post');
    throw e;
  }
};

export const updatePost = async (
  id: string,
  updateData: UpdateBlogPostRequest,
  imageFile?: File,
): Promise<BlogResponse> => {
  try {
    if (imageFile) {
      const formData = new FormData();
      formData.append('data', JSON.stringify(updateData));
      formData.append('image', imageFile);

      const response = await axiosInstance.put(
        `${blogApiUrl}/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: false,
        },
      );
      return response.data;
    } else {
      const response = await axiosInstance.put(
        `${blogApiUrl}/${id}`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: false,
        },
      );
      return response.data;
    }
  } catch (e) {
    Logger.error('Unable to update blog post');
    throw e;
  }
};

export const deletePost = async (id: string): Promise<BlogResponse> => {
  try {
    const response = await axiosInstance.delete(`${blogApiUrl}/${id}`, {
      withCredentials: false,
    });
    return response.data;
  } catch (e) {
    Logger.error('Unable to delete blog post');
    throw e;
  }
};

export const getAllPosts = async (
  page?: number,
  limit?: number,
  status?: string,
  search?: string,
): Promise<BlogListResponse> => {
  try {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (status) params.append('status', status);
    if (search) params.append('search', search);

    const response = await axiosInstance.get(`${blogApiUrl}?${params}`, {
      withCredentials: false,
    });
    return response.data as BlogListResponse;
  } catch (e) {
    Logger.error('Unable to get all posts');
    throw e;
  }
};

export const getPostById = async (id: string): Promise<BlogResponse> => {
  try {
    const response = await axiosInstance.get(`${blogApiUrl}/${id}`, {
      withCredentials: false,
    });

    return response.data as BlogResponse;
  } catch (e) {
    Logger.error('Unable to get post by id');
    throw e;
  }
};

export const publishPost = async (id: string): Promise<BlogResponse> => {
  try {
    const response = await axiosInstance.patch(
      `${blogApiUrl}/${id}/publish`,
      {},
      {
        withCredentials: false,
      },
    );
    return response.data;
  } catch (e) {
    Logger.error('Unable to publish post');
    throw e;
  }
};

export const unpublishPost = async (id: string): Promise<BlogResponse> => {
  try {
    const response = await axiosInstance.patch(
      `${blogApiUrl}/${id}/unpublish`,
      {},
      {
        withCredentials: false,
      },
    );
    return response.data;
  } catch (e) {
    Logger.error('Unable to unpublish post');
    throw e;
  }
};

export const archivePost = async (id: string): Promise<BlogResponse> => {
  try {
    const response = await axiosInstance.patch(
      `${blogApiUrl}/${id}/archive`,
      {},
      {
        withCredentials: false,
      },
    );
    return response.data;
  } catch (e) {
    Logger.error('Unable to archive post');
    throw e;
  }
};
