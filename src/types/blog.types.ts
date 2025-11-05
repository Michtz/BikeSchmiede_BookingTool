export interface IBlogPost {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  author_id: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  tags: string[];
  featured_image?: string;
  meta_title?: string;
  meta_description?: string;
  status: BlogPostStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type BlogPostStatus = 'draft' | 'published' | 'archived';

export interface BlogResponse {
  success: boolean;
  data?: IBlogPost[] | IBlogPost | null;
  error?: string;
}

export interface BlogListResponse {
  success: boolean;
  data?: {
    posts: IBlogPost[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalPosts: number;
      limit: number;
    };
  };
  error?: string;
}

export interface CreateBlogPostRequest {
  title: string;
  content: string;
  excerpt: string;
  slug?: string;
  tags: string[];
  meta_title?: string;
  meta_description?: string;
  status: BlogPostStatus;
}

export interface UpdateBlogPostRequest {
  title?: string;
  content?: string;
  excerpt?: string;
  slug?: string;
  tags?: string[];
  meta_title?: string;
  meta_description?: string;
  status?: BlogPostStatus;
}

export interface BlogFilters {
  status?: BlogPostStatus;
  tag?: string;
  author?: string;
  search?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
}

export interface BlogTagResponse {
  success: boolean;
  data?: string[];
  error?: string;
}