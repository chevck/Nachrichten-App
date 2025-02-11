export interface NewsState {
  loading: boolean;
  selectedFilter: string;
  searchText: string;
  selectedCategory: string;
  selectedSource: string;
  newsSources: string[];
  newsPerSource: Partial<NewsData>;
  selectedLanguage: string;
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
