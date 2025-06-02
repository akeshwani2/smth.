declare module '@postlight/mercury-parser' {
  interface MercuryResponse {
    title: string;
    content: string;
    date_published: string;
    lead_image_url: string;
    dek: string;
    url: string;
    domain: string;
    excerpt: string;
    word_count: number;
    direction: string;
    total_pages: number;
    rendered_pages: number;
    next_page_url: string | null;
  }

  const mercuryParser: {
    parse: (url: string) => Promise<MercuryResponse>;
  };
  
  export default mercuryParser;
} 