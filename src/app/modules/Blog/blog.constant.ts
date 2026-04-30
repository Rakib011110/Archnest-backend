export const BLOG_STATUS = { DRAFT: 'DRAFT', PUBLISHED: 'PUBLISHED', ARCHIVED: 'ARCHIVED' } as const;
export type TBlogStatus = keyof typeof BLOG_STATUS;
export const BLOG_SEARCHABLE_FIELDS = ['title', 'excerpt', 'category'];
