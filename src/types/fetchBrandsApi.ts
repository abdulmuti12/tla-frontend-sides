export type FetchBrandsApiResponse = {
  meta: {
    method: string;
    path: string;
  };
  success: boolean;
  statusCode: number;
  data: Array<{
    id: string;
    name: string;
    jargon: string;
    semanticLabel: string;
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    fontType: string;
    address: string;
    phone: string;
    websiteUrl?: string;
    createdAt: string;
    updatedAt: string;
    story: {
      title: string;
      description: string;
      id: string;
      images: Array<{
        name: string;
        cdnUrl: string;
        localUrl: string;
        filePath: string;
        fileType: string;
        createdAt: string;
        updatedAt: string;
        id: string;
      }>;
      createdAt?: string;
      updatedAt?: string;
    };
    detail: {
      title: string;
      description: string;
      logoId: any;
      images: Array<{
        name: string;
        cdnUrl: string;
        localUrl: string;
        filePath: string;
        fileType: string;
        createdAt: string;
        updatedAt: string;
        id: string;
      }>;
      imageIds: Array<any>;
      id: string;
      createdAt?: string;
      updatedAt?: string;
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
    subBrands: Array<{
      websiteUrl: string;
      coverImageId: string;
      coverImage: {
        name: string;
        cdnUrl: string;
        localUrl: string;
        filePath: string;
        fileType: string;
        createdAt: string;
        updatedAt: string;
        id: string;
      };
      logoId: string;
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
      shortDescription?: string;
    }>;
  }>;
};
