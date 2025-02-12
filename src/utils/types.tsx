export interface NewsState {
  loading: boolean;
  selectedFilter: string;
  searchText: string;
  selectedCategory: string;
  selectedSource: string;
  newsSources: string[];
  newsPerSource: Partial<NewsData>;
  selectedLanguage: string;
  pagination: { page: number; perPage: number };
}

export interface NewsData {
  title: string;
  author?: string;
  image: string;
  summary: string;
  url: string;
  category?: string;
  source: string;
  publishedAt: string;
}

export interface NewsQueryParams {
  apiKey: string;
  category?: string;
  q?: string;
  page?: number;
  pageSize?: number;
  number?: number;
}

export interface NewsOrgParams {
  apiKey: string;
  category: string;
  q: string;
  pageSize: string;
  page: string;
}
