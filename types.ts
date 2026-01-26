export enum ContentType {
  BLOG_POST = 'blog_post',
  FACEBOOK_AD = 'facebook_ad',
  INSTAGRAM_CAPTION = 'instagram_caption',
  PRODUCT_DESCRIPTION = 'product_description',
  EMAIL_SUBJECT = 'email_subject',
  YOUTUBE_TITLE = 'youtube_title',
  TWITTER_THREAD = 'twitter_thread',
  LANDING_PAGE = 'landing_page',
  SLOGAN = 'slogan',
  SEO_META = 'seo_meta',
}

export interface ContentTemplate {
  id: ContentType;
  name: string;
  nameKo: string;
  icon: string;
  description: string;
  placeholder: string;
  isPro: boolean;
}

export interface GeneratedContent {
  id: string;
  type: ContentType;
  input: string;
  output: string;
  createdAt: Date;
}

export interface UserUsage {
  dailyCount: number;
  lastResetDate: string;
  isPro: boolean;
  totalGenerated: number;
}

export const FREE_DAILY_LIMIT = 5;
export const PRO_PRICE = 9.99;
