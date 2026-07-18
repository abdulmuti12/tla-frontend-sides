export type FetchBrandByIdApiResponse = {
  meta: {
    method: string;
    path: string;
  };
  success: boolean;
  statusCode: number;
  data: {
    id: string;
    name: string;
    jargon: string;
    semanticLabel: string;
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor: string;
    fontType: string;
    address: string;
    phone: string;
    websiteUrl?: string;
    createdAt: string;
    updatedAt: string;
    subBrands: Array<{
      id: string;
      websiteUrl: string;
      logo: {
        cdnUrl: string;
        localUrl: string;
        createdAt: string;
        filePath: string;
        fileType: string;
        id: string;
        name: string;
        updatedAt: string;
      };
      coverImage: {
        cdnUrl: string;
        localUrl: string;
        createdAt: string;
        filePath: string;
        fileType: string;
        id: string;
        name: string;
        updatedAt: string;
      };
      shortDescription?: string;
    }>;
    story: {
      title: string;
      description: string;
      createdAt: string;
      updatedAt: string;
      id: string;
      images: Array<{
        name: string;
        cdnUrl: string;
        localUrl: string;
        filePath: string;
        fileType: string;
        createdAt: string;
        updatedAt: string;
      }>;
    };
    detail: {
      title: string;
      description: string;
      createdAt: string;
      updatedAt: string;
      id: string;
      logo: {
        name: string;
        cdnUrl: string;
        localUrl: string;
        filePath: string;
        fileType: string;
        createdAt: string;
        updatedAt: string;
        id: string;
      };
      images: Array<{
        name: string;
        cdnUrl: string;
        localUrl: string;
        filePath: string;
        fileType: string;
        createdAt: string;
        updatedAt: string;
      }>;
    };
    heroImage: {
      name: string;
      cdnUrl: string;
      localUrl: string;
      filePath: string;
      fileType: string;
      createdAt: string;
      updatedAt: string;
      id: string;
    };
    logo: {
      name: string;
      cdnUrl: string;
      localUrl: string;
      filePath: string;
      fileType: string;
      createdAt: string;
      updatedAt: string;
      id: string;
    };
    contactImage: {
      name: string;
      cdnUrl: string;
      localUrl: string;
      filePath: string;
      fileType: string;
      createdAt: string;
      updatedAt: string;
      id: string;
    };
  };
};
