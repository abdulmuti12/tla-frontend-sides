export interface ProjectApiResponse {
  meta: {
    method: string;
    path: string;
  };
  success: boolean;
  statusCode: number;
  data: Array<{
    category: string;
    name: string;
    isFeatured: boolean;
    priority: number;
    location: string;
    date: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    id: string;
    brand: {
      name: string;
      heroImageId: string;
      logoId: string;
      story: {
        title: string;
        description: string;
        imageIds: Array<string>;
        createdAt: string;
        updatedAt: string;
        id: string;
      };
      detail: {
        title: string;
        description: string;
        logoId: string;
        imageIds: Array<string>;
        createdAt: string;
        updatedAt: string;
        id: string;
      };
      backgroundColor: string;
      fontType: string;
      address: string;
      phone: string;
      contactImageId: string;
      createdAt: string;
      updatedAt: string;
      id: string;
    };
    images?: Array<{
      name: string;
      cdnUrl: string;
      localUrl: string;
      filePath: string;
      fileType: string;
      createdAt: string;
      updatedAt: string;
      id: string;
    }>;
  }>;
  pageMeta: {
    page: number;
    limit: number;
    pageCount: number;
    totalCount: number;
  };
}
