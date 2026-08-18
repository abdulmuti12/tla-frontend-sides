export type ImageProjectItem = {
  id: string;
  projectId: string;
  imageId: string;
  image: {
    name: string;
    cdnUrl: string;
    localUrl: string;
    filePath: string;
    fileType: string;
    createdAt: string;
    updatedAt: string;
    id: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type FetchImageProjectsApiResponse = {
  meta: {
    method: string;
    path: string;
  };
  success: boolean;
  statusCode: number;
  data: ImageProjectItem[];
};
