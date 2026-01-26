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
  proStartDate?: string;
  stripeCustomerId?: string;
}

export const FREE_DAILY_LIMIT = 5;
export const PRO_PRICE = 9.99;

// Stripe Configuration
// 1. Stripe Dashboard에서 Payment Link 생성
// 2. 아래 URL을 실제 Payment Link로 교체
// 3. success_url에 ?payment=success 파라미터 추가
export const STRIPE_CONFIG = {
  // Stripe Payment Link URL (Dashboard에서 생성)
  // 예: https://buy.stripe.com/xxxxx
  paymentLink: 'YOUR_STRIPE_PAYMENT_LINK_HERE',

  // Customer Portal URL (구독 관리용)
  // Stripe Dashboard > Settings > Customer Portal에서 설정
  customerPortal: 'YOUR_STRIPE_CUSTOMER_PORTAL_HERE',

  // 결제 성공 시 리다이렉트될 URL 파라미터
  successParam: 'payment=success',
};
