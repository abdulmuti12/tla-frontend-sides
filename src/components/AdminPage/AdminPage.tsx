'use client';

import React, { useEffect, useMemo, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import JsonView from '@uiw/react-json-view';
import {
  Button,
  Collapse,
  ColorPicker,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Select,
  Switch,
  Table,
  Tabs,
  Upload,
} from 'antd';
import type { TableColumnProps, TabsProps, UploadProps } from 'antd';
import { AggregationColor } from 'antd/es/color-picker/color';
import dayjs, { Dayjs } from 'dayjs';
import _ from 'lodash';
import { twMerge } from 'tailwind-merge';
import {
  fetchAboutPageConfig,
  FetchAboutPageConfigApiResponse,
  updateAboutPageConfig,
} from '~/api_helpers/fetchAboutPageConfig';
import { fetchBrands } from '~/api_helpers/fetchBrands';
import { fetchCatalogue } from '~/api_helpers/FetchCatalogue';
import { fetchDesignerByBrandId } from '~/api_helpers/fetchDesignerByBrandId';
import { fetchFeaturedProjects } from '~/api_helpers/FetchFeaturedProjects';
import {
  fetchHomePageConfig,
  FetchHomePageConfigApiResponse,
  updateHomePageConfig,
} from '~/api_helpers/fetchHomePageConfig';
import { fetchPressReleases } from '~/api_helpers/fetchPressReleases';
import { fetchProjects } from '~/api_helpers/FetchProjects';
import { fetchPromotionsApi } from '~/api_helpers/fetchPromotionsApi';
import { getAPIKey } from '~/api_helpers/getAPiKey';

import TLALogoMini from '~/components/Icons/TLALogoMini';

import { FetchBrandsApiResponse } from '~/types/fetchBrandsApi';
import { FetchCatalogueResponse } from '~/types/FetchCatalogue';
import { FetchDesignerByBrandIdResponse } from '~/types/fetchDesignerByBrandId';
import { FetchPressReleasesResponse } from '~/types/fetchPressReleasesApi';
import { FetchPromotionsApiResponse } from '~/types/fetchPromotionsApi';
import { ProjectApiResponse } from '~/types/ProjectApi';

const normFile = (e: any) => {
  if (Array.isArray(e)) return e;
  return e?.fileList;
};

const defaultHtmlContent = `<h1>This is Heading 1</h1>
<h2>This is Heading 2</h2>
<h3>This is Heading 3</h3>

<p>This is a paragraph</p>
<p>This is a paragraph with <strong>bold</strong> text</p>
<p>This is a paragraph with <em>italic</em> text</p>
<p>This is a paragraph with <a href=https://www.google.com>link</a></p>
<p>This is a long paragraph. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Accusamus dolore fuga, quia, suscipit quaerat consequatur possimus, vitae assumenda aperiam sunt veritatis. Excepturi enim ipsa mollitia dolorum ea debitis ad quasi. Ducimus, perspiciatis autem. Odio, sint non maiores velit quia ullam asperiores laboriosam officia libero iusto accusantium ea unde eius odit.</p>

<br> use this to break line even inside a paragraph

<img src=https://via.placeholder.com/600x400 alt='description for image' />
`;

export function AdminPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');

  const [apiKey, setAPIKey] = useState('');
  const [isValidAPIKey, setIsValidAPIKey] = useState(false);
  const [settingModal, setSettingModal] = useState(false);
  const [healthCheckLoading, setHealthCheckLoading] = useState(false);
  const [healthCheckResult, setHealthCheckResult] = useState<{
    meta: {
      method: string;
      path: string;
    };
    success: boolean;
    statusCode: number;
    data: {
      message: string;
    };
  } | null>(null);

  const tabItems: TabsProps['items'] = [
    {
      key: 'page-config',
      label: 'Page Config',
      children: <PageConfigAdminPage />,
    },
    {
      key: 'catalogue',
      label: 'Catalogue',
      children: <CatalogueAdminPage />,
    },
    {
      key: 'brands',
      label: 'Brands',
      children: <BrandsAdminPage />,
    },
    {
      key: 'project',
      label: 'Project',
      children: <ProjectAdminPage />,
    },
    {
      key: 'promotion',
      label: 'Promotion',
      children: <PromotionAdminPage />,
    },
    {
      key: 'press-release',
      label: 'Press Release',
      children: <PressReleaseAdminPage />,
    },
  ];

  const validateAPIKey = _.debounce(async (api_key: string, showMessage: boolean = true) => {
    const response = await fetch(`${process.env.API_HOST}/auth`, {
      headers: { Authorization: api_key },
    }).then((res) => res.json());

    if (!response.success) {
      setIsValidAPIKey(false);
      if (showMessage) message.error('Invalid API Key!');
      return false;
    }

    if (showMessage) message.success('API Key validated!');
    localStorage.setItem('TLA_API_KEY', api_key);
    setIsValidAPIKey(true);
    setSettingModal(false);
    return true;
  }, 200);

  const onPerformHealthCheck = async () => {
    setHealthCheckLoading(true);
    const response = await fetch(`${process.env.API_HOST}/`, {
      headers: { Authorization: getAPIKey() },
    }).then((res) => res.json());
    setHealthCheckResult(response);
    setHealthCheckLoading(false);
  };

  const onSaveAPIKey = async () => {
    validateAPIKey(apiKey);
  };

  const onCloseModal = () => {
    if (!isValidAPIKey) return message.error('Please set API key first!');
    closeModal();
  };

  const closeModal = () => {
    setHealthCheckResult(null);
    setHealthCheckLoading(false);
    setSettingModal(false);
  };

  useEffect(() => {
    const api_key = getAPIKey();
    if (api_key) {
      setAPIKey(api_key);
      validateAPIKey(api_key, false);
    } else setSettingModal(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <div className="p-4">
        <div className="flex justify-between mb-8">
          <div className="flex items-center gap-2 text-2xl font-semibold font-sans">
            <TLALogoMini className="h-8 w-8" /> Admin
          </div>
          <div className="flex gap-2 items-center">
            <Button color="primary" onClick={() => setSettingModal(true)}>
              Setting
            </Button>
          </div>
        </div>

        {isValidAPIKey ? (
          <Tabs
            items={tabItems}
            type="card"
            activeKey={tab ?? 'page-config'}
            onChange={(key) => router.push(`?tab=${key}`)}
          />
        ) : (
          <div className="mt-20 text-center text-xs text-gray-400 min-h-[70vh] grid place-items-center">
            Please Provide Valid API Key to access this page!
          </div>
        )}
        <div className="mt-20 text-center text-xs text-gray-400">
          Copyright 2024 The Luxury Asia. All rights reserved.
        </div>
      </div>
      <Modal title="Setting" open={settingModal} footer={null} onCancel={onCloseModal}>
        <div className="flex flex-col gap-4">
          <div className="flex justify-center items-center gap-2 h-full">
            <span className="flex-shrink-0">API Key:</span>
            <Input.Password
              value={apiKey}
              placeholder="API Key"
              onChange={(e) => setAPIKey(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === 'Enter') onSaveAPIKey();
              }}
            />
            <Button type="primary" onClick={onSaveAPIKey}>
              Save
            </Button>
          </div>
          <Button loading={healthCheckLoading} className="w-full" type="dashed" onClick={onPerformHealthCheck}>
            <div className="bg-green-700 w-2 h-2 rounded-full">
              <div className="bg-green-700 animate-ping w-2 h-2 rounded-full mr-2"></div>
            </div>
            Perform Server Health Check
          </Button>

          {healthCheckResult && <JsonView value={healthCheckResult} />}
        </div>
      </Modal>
    </React.Suspense>
  );
}

const PageConfigAdminPage = () => {
  const [homePageConfigForm] = Form.useForm<{
    mainBannerTitle: string;
    mainBannerDescription: string;
    mainBannerImageId: string;
    mainBannerImage: UploadProps['fileList'];
    aboutUsTitle: string;
    aboutUsDescription: string;
    aboutUsBannerImageId: string;
    aboutUsBannerImage: UploadProps['fileList'];
    pressTitle: string;
    pressDescription: string;
    catalogueDescription: string;
    termsAndConditionsUrl: string;
    privacyPolicyUrl: string;
  }>();
  const [aboutPageConfigForm] = Form.useForm<{
    title: string;
    description: string;
    bannerId: string;
    banner: UploadProps['fileList'];
    whyUsTitle: string;
    whyUsDescription: string;
    whyUsBannerId: string;
    whyUsBanner: UploadProps['fileList'];
    whyUsImageId: string;
    whyUsImage: UploadProps['fileList'];
    vision: string;
    mission: string;
    ourServiceTitle: string;
    outServiceDescription: string;
    ourServiceImageIds: string[]; // max 10
    ourServiceImages: UploadProps['fileList'];
    whoWeAreTitle: string;
    whoWeAreDescription: string;
    whoWeAreImageIds: string[]; // max 6
    whoWeAreImages: UploadProps['fileList'];
  }>();
  
  const [homePageConfig, setHomePageConfig] = useState<FetchHomePageConfigApiResponse | null>(null);
  const [aboutPageConfig, setAboutPageConfig] = useState<FetchAboutPageConfigApiResponse | null>(null);
  const [editHomePageConfigModal, setEditHomePageConfigModal] = useState(false);
  const [editAboutPageConfigModal, setEditAboutPageConfigModal] = useState(false);

  const onEditHomePageConfig = () => {
    homePageConfigForm.setFieldsValue({
      mainBannerTitle: homePageConfig?.data.mainBannerTitle,
      mainBannerDescription: homePageConfig?.data.mainBannerDescription,
      mainBannerImageId: homePageConfig?.data.mainBannerImage.id,
      mainBannerImage: [
        { url: homePageConfig?.data.mainBannerImage.cdnUrl, uid: homePageConfig?.data.mainBannerImage.id },
      ],
      aboutUsTitle: homePageConfig?.data.aboutUsTitle,
      aboutUsDescription: homePageConfig?.data.aboutUsDescription,
      aboutUsBannerImageId: homePageConfig?.data.aboutUsBannerImage.id,
      aboutUsBannerImage: [
        { url: homePageConfig?.data.aboutUsBannerImage.cdnUrl, uid: homePageConfig?.data.aboutUsBannerImage.id },
      ],
      pressTitle: homePageConfig?.data.pressTitle,
      pressDescription: homePageConfig?.data.pressDescription,
      catalogueDescription: homePageConfig?.data.catalogueDescription,
      termsAndConditionsUrl: homePageConfig?.data?.termsAndConditionsUrl,
      privacyPolicyUrl: homePageConfig?.data?.privacyPolicyUrl,
    });
    setEditHomePageConfigModal(true);
  };

  const onEditAboutPageConfig = () => {
    aboutPageConfigForm.setFieldsValue({
      title: aboutPageConfig?.data.title,
      description: aboutPageConfig?.data.description,
      bannerId: aboutPageConfig?.data.banner.id,
      banner: [{ url: aboutPageConfig?.data.banner.cdnUrl, uid: aboutPageConfig?.data.banner.id }],
      whyUsTitle: aboutPageConfig?.data.whyUsTitle,
      whyUsDescription: aboutPageConfig?.data.whyUsDescription,
      whyUsBannerId: aboutPageConfig?.data.whyUsBanner.id,
      whyUsBanner: [{ url: aboutPageConfig?.data.whyUsBanner.cdnUrl, uid: aboutPageConfig?.data.whyUsBanner.id }],
      whyUsImageId: aboutPageConfig?.data.whyUsImage.id,
      whyUsImage: [{ url: aboutPageConfig?.data.whyUsImage.cdnUrl, uid: aboutPageConfig?.data.whyUsImage.id }],
      vision: aboutPageConfig?.data.vision,
      mission: aboutPageConfig?.data.mission,
      ourServiceTitle: aboutPageConfig?.data.ourServiceTitle,
      outServiceDescription: aboutPageConfig?.data.outServiceDescription,
      ourServiceImageIds: aboutPageConfig?.data.ourServiceImages.map((image) => image.id ?? '').filter(Boolean),
      ourServiceImages: aboutPageConfig?.data.ourServiceImages.map((image) => ({
        url: image.cdnUrl,
        uid: image.id,
      })),
      whoWeAreTitle: aboutPageConfig?.data.whoWeAreTitle,
      whoWeAreDescription: aboutPageConfig?.data.whoWeAreDescription,
      whoWeAreImageIds: aboutPageConfig?.data.whoWeAreImages.map((image) => image.id ?? '').filter(Boolean),
      whoWeAreImages: aboutPageConfig?.data.whoWeAreImages.map((image) => ({
        url: image.cdnUrl,
        uid: image.id,
      })),
    });

    setEditAboutPageConfigModal(true);
  };

  const onClickEdit = (index: number) => {
    switch (index) {
      case 0:
        onEditHomePageConfig();
        break;
      case 1:
        onEditAboutPageConfig();
        break;
      default:
        break;
    }
  };

  const onSubmitHomePageConfig = async () => {
    const formValues = await homePageConfigForm.validateFields();
    delete formValues.mainBannerImage;
    delete formValues.aboutUsBannerImage;

    const response = await updateHomePageConfig(formValues);
    if (response?.success) {
      message.success('Updated home page config success!');
      refetchHomePageConfig();
      setEditHomePageConfigModal(false);
    } else message.error('Update home page config failed!');
  };

  const onSubmitAboutPageConfig = async () => {
    const formValues = await aboutPageConfigForm.validateFields();
    delete formValues.banner;
    delete formValues.whyUsBanner;
    delete formValues.whyUsImage;
    delete formValues.ourServiceImages;
    delete formValues.whoWeAreImages;

    const response = await updateAboutPageConfig(formValues);
    if (response?.success) {
      message.success('Updated about page config success!');
      refetchAboutPageConfig();
      setEditAboutPageConfigModal(false);
    } else message.error('Update about page config failed!');
  };

  const tableData = useMemo(() => {
    return [
      {
        pageName: 'Home',
        updatedAt: homePageConfig?.data.updatedAt,
      },
      {
        pageName: 'About Us',
        updatedAt: aboutPageConfig?.data.updatedAt,
      },
    ];
  }, [homePageConfig, aboutPageConfig]);

  const columns: TableColumnProps[] = [
    {
      title: 'Page Name',
      dataIndex: 'pageName',
      key: 'pageName',
    },
    {
      title: 'Last Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (_, record) => new Date(record.updatedAt).toLocaleString(),
    },
    {
      key: 'actions',
      render: (_, record, index) => (
        <div className="flex gap-2 justify-end">
          <Button variant="filled" color="primary" onClick={() => onClickEdit(index)}>
            Edit
          </Button>
        </div>
      ),
    },
  ];

  const refetchHomePageConfig = () => {
    fetchHomePageConfig().then((data) => setHomePageConfig(data));
  };

  const refetchAboutPageConfig = () => {
    fetchAboutPageConfig().then((data) => setAboutPageConfig(data));
  };

  useEffect(() => {
    refetchHomePageConfig();
    refetchAboutPageConfig();
  }, []);

  return (
    <>
      <Table dataSource={tableData} columns={columns} pagination={false} />
      <Modal
        title="Edit Home Page Config"
        okText="Submit"
        open={editHomePageConfigModal}
        onOk={onSubmitHomePageConfig}
        onCancel={() => setEditHomePageConfigModal(false)}
      >
        <div className="w-full py-5">
          <Form form={homePageConfigForm} layout="vertical">
            <Form.Item name="mainBannerTitle" label="Main Banner Title" hidden>
              <Input />
            </Form.Item>
            <Form.Item name="mainBannerDescription" label="Main Banner Description" rules={[{ required: true }]}>
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item name="mainBannerImageId" hidden></Form.Item>
            <Form.Item
              name="mainBannerImage"
              valuePropName="fileList"
              label="Main Banner Image"
              getValueFromEvent={normFile}
              rules={[{ required: true }]}
            >
              <Upload
                name="file"
                maxCount={1}
                data={{ category: 'main_banner_image' }}
                headers={{ Authorization: getAPIKey() }}
                action={`${process.env.API_HOST}/files`}
                listType="picture-card"
                onChange={({ file }) => {
                  if (file.status === 'done') {
                    homePageConfigForm.setFieldValue('mainBannerImageId', file.response.data.id);
                  }
                  if (file.status === 'error') {
                    if (typeof file.response === 'string') {
                      message.error({ content: <div dangerouslySetInnerHTML={{ __html: file.response }} /> });
                    } else {
                      message.error(`Upload failed: ${file.response.message}`);
                    }
                  }
                }}
              >
                +
              </Upload>
            </Form.Item>
            <Form.Item name="aboutUsTitle" label="About Us Title" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="aboutUsDescription" label="About Us Description" rules={[{ required: true }]}>
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item name="aboutUsBannerImageId" hidden></Form.Item>
            <Form.Item
              name="aboutUsBannerImage"
              valuePropName="fileList"
              label="About Us Banner Image"
              getValueFromEvent={normFile}
              rules={[{ required: true }]}
            >
              <Upload
                name="file"
                maxCount={1}
                data={{ category: 'about_us_banner_image' }}
                headers={{ Authorization: getAPIKey() }}
                action={`${process.env.API_HOST}/files`}
                listType="picture-card"
                onChange={({ file }) => {
                  if (file.status === 'done') {
                    homePageConfigForm.setFieldValue('aboutUsBannerImageId', file.response.data.id);
                  }
                  if (file.status === 'error') {
                    if (typeof file.response === 'string') {
                      message.error({ content: <div dangerouslySetInnerHTML={{ __html: file.response }} /> });
                    } else {
                      message.error(`Upload failed: ${file.response.message}`);
                    }
                  }
                }}
              >
                +
              </Upload>
            </Form.Item>
            <Form.Item name="pressTitle" label="Press Title" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="pressDescription" label="Press Description" rules={[{ required: true }]}>
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item name="catalogueDescription" label="Catalogue Description" rules={[{ required: true }]}>
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="termsAndConditionsUrl"
              label="Terms and Conditions URL"
              rules={[{ required: true, type: 'url' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="privacyPolicyUrl" label="Privacy Policy URL" rules={[{ required: true, type: 'url' }]}>
              <Input />
            </Form.Item>
          </Form>
        </div>
      </Modal>
      <Modal
        title="Edit About Page Config"
        okText="Submit"
        open={editAboutPageConfigModal}
        onOk={onSubmitAboutPageConfig}
        onCancel={() => setEditAboutPageConfigModal(false)}
      >
        <div className="w-full py-5">
          <Form form={aboutPageConfigForm} layout="vertical">
            <Form.Item name="title" label="Title" hidden>
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Description" rules={[{ required: true }]}>
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item name="bannerId" hidden></Form.Item>
            <Form.Item
              name="banner"
              valuePropName="fileList"
              label="Banner Image"
              getValueFromEvent={normFile}
              rules={[{ required: true }]}
            >
              <Upload
                name="file"
                maxCount={1}
                data={{ category: 'about_us_banner_image' }}
                headers={{ Authorization: getAPIKey() }}
                action={`${process.env.API_HOST}/files`}
                listType="picture-card"
                onChange={({ file }) => {
                  if (file.status === 'done') {
                    aboutPageConfigForm.setFieldValue('bannerId', file.response.data.id);
                  }
                  if (file.status === 'error') {
                    if (typeof file.response === 'string') {
                      message.error({ content: <div dangerouslySetInnerHTML={{ __html: file.response }} /> });
                    } else {
                      message.error(`Upload failed: ${file.response.message}`);
                    }
                  }
                }}
              >
                +
              </Upload>
            </Form.Item>
            <Form.Item name="whyUsTitle" label="Why Us Title">
              <Input />
            </Form.Item>
            <Form.Item name="whyUsDescription" label="Why Us Description" rules={[{ required: true }]}>
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item name="whyUsBannerId" hidden></Form.Item>
            <Form.Item
              name="whyUsBanner"
              valuePropName="fileList"
              label="Why Us Banner Image"
              getValueFromEvent={normFile}
              rules={[{ required: true }]}
            >
              <Upload
                name="file"
                maxCount={1}
                data={{ category: 'about_us_why_us_banner_image' }}
                headers={{ Authorization: getAPIKey() }}
                action={`${process.env.API_HOST}/files`}
                listType="picture-card"
                onChange={({ file }) => {
                  if (file.status === 'done') {
                    aboutPageConfigForm.setFieldValue('whyUsBannerId', file.response.data.id);
                  }
                  if (file.status === 'error') {
                    if (typeof file.response === 'string') {
                      message.error({ content: <div dangerouslySetInnerHTML={{ __html: file.response }} /> });
                    } else {
                      message.error(`Upload failed: ${file.response.message}`);
                    }
                  }
                }}
              >
                +
              </Upload>
            </Form.Item>
            <Form.Item name="whyUsImageId" hidden></Form.Item>
            <Form.Item
              name="whyUsImage"
              valuePropName="fileList"
              label="Why Us Image"
              getValueFromEvent={normFile}
              rules={[{ required: true }]}
            >
              <Upload
                name="file"
                maxCount={1}
                data={{ category: 'about_us_why_us_image' }}
                headers={{ Authorization: getAPIKey() }}
                action={`${process.env.API_HOST}/files`}
                listType="picture-card"
              >
                +
              </Upload>
            </Form.Item>
            <Form.Item name="vision" label="Vision" rules={[{ required: true }]}>
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item name="mission" label="Mission" rules={[{ required: true }]}>
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item name="ourServiceTitle" label="Our Service Title">
              <Input />
            </Form.Item>
            <Form.Item name="outServiceDescription" label="Our Service Description" rules={[{ required: true }]}>
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item name="ourServiceImageIds" hidden></Form.Item>
            <Form.Item
              name="ourServiceImages"
              valuePropName="fileList"
              label="Our Service Images"
              getValueFromEvent={normFile}
              rules={[{ required: true }]}
            >
              <Upload
                name="file"
                maxCount={10}
                data={{ category: 'about_us_our_service_image' }}
                headers={{ Authorization: getAPIKey() }}
                action={`${process.env.API_HOST}/files`}
                listType="picture-card"
                onRemove={(file) => {
                  if (file?.error) return;
                  if (file?.response) {
                    aboutPageConfigForm.setFieldValue(
                      'ourServiceImageIds',
                      aboutPageConfigForm
                        .getFieldValue('ourServiceImageIds')
                        .filter((id: string) => id !== file.response.data.id),
                    );
                  } else {
                    aboutPageConfigForm.setFieldValue(
                      'ourServiceImageIds',
                      aboutPageConfigForm.getFieldValue('ourServiceImageIds').filter((id: string) => id !== file.uid),
                    );
                  }
                }}
                onChange={({ file, fileList }) => {
                  if (file.status === 'done') {
                    aboutPageConfigForm.setFieldValue(
                      'ourServiceImageIds',
                      fileList.map((file) => (file?.response ? file.response.data.id : file.uid)),
                    );
                  }
                  if (file.status === 'error') {
                    if (typeof file.response === 'string') {
                      message.error({ content: <div dangerouslySetInnerHTML={{ __html: file.response }} /> });
                    } else {
                      message.error(`Upload failed: ${file.response.message}`);
                    }
                  }
                }}
              >
                +
              </Upload>
            </Form.Item>
            <Form.Item name="whoWeAreTitle" label="Who We Are Title">
              <Input />
            </Form.Item>
            <Form.Item name="whoWeAreDescription" label="Who We Are Description" rules={[{ required: true }]}>
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item name="whoWeAreImageIds" hidden></Form.Item>
            <Form.Item
              name="whoWeAreImages"
              valuePropName="fileList"
              label="Who We Are Images"
              getValueFromEvent={normFile}
              rules={[{ required: true }]}
            >
              <Upload
                name="file"
                maxCount={6}
                data={{ category: 'about_us_who_we_are_image' }}
                headers={{ Authorization: getAPIKey() }}
                action={`${process.env.API_HOST}/files`}
                listType="picture-card"
                onRemove={(file) => {
                  if (file?.error) return;
                  if (file?.response) {
                    aboutPageConfigForm.setFieldValue(
                      'whoWeAreImageIds',
                      aboutPageConfigForm
                        .getFieldValue('whoWeAreImageIds')
                        .filter((id: string) => id !== file.response.data.id),
                    );
                  } else {
                    aboutPageConfigForm.setFieldValue(
                      'whoWeAreImageIds',
                      aboutPageConfigForm.getFieldValue('whoWeAreImageIds').filter((id: string) => id !== file.uid),
                    );
                  }
                }}
                onChange={({ file, fileList }) => {
                  if (file.status === 'done') {
                    aboutPageConfigForm.setFieldValue(
                      'whoWeAreImageIds',
                      fileList.map((file) => (file?.response ? file.response.data.id : file.uid)),
                    );
                  }
                  if (file.status === 'error') {
                    if (typeof file.response === 'string') {
                      message.error({ content: <div dangerouslySetInnerHTML={{ __html: file.response }} /> });
                    } else {
                      message.error(`Upload failed: ${file.response.message}`);
                    }
                  }
                }}
              >
                +
              </Upload>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

const CatalogueAdminPage = () => {
  const [form] = Form.useForm<{
    name: string;
    brandId: string;
    imageId: string;
    image: UploadProps['fileList'];
    contentId: string;
    content: UploadProps['fileList'];
  }>();
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCatalogue, setSelectedCatalogue] = useState<FetchCatalogueResponse['data'][number] | null>(null);
  const [catalogue, setCatalogue] = useState<FetchCatalogueResponse | null>(null);
  const [brands, setBrands] = useState<FetchBrandsApiResponse | null>(null);

  const onClickEdit = (catalogue: FetchCatalogueResponse['data'][number]) => {
    form.setFieldsValue({
      name: catalogue.name,
      brandId: catalogue.brand.id,
      imageId: catalogue.image.id,
      contentId: catalogue.content.id,
      image: [{ url: catalogue.image.cdnUrl, uid: catalogue.image.id }],
      content: [{ url: catalogue.content.cdnUrl, uid: catalogue.content.id, name: catalogue.content.name }],
    });

    setSelectedCatalogue(catalogue);
    setEditModalOpen(true);
  };

  const onSubmitEdit = async () => {
    setLoading(true);
    const formValues = await form.validateFields();
    delete formValues.content;
    delete formValues.image;

    let response;

    if (selectedCatalogue) {
      response = await fetch(`${process.env.API_HOST}/catalogues/${selectedCatalogue.id}`, {
        method: 'PUT',
        headers: { Authorization: getAPIKey(), 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues),
      }).then((res) => res.json());
    } else {
      response = await fetch(`${process.env.API_HOST}/catalogues`, {
        method: 'POST',
        headers: { Authorization: getAPIKey(), 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues),
      }).then((res) => res.json());
    }

    if (response.success) {
      message.success(`${selectedCatalogue ? 'Updated' : 'Created'} catalogue success!`);
      onCancelEdit();
      onLoadCatalogue();
    } else message.error(`${selectedCatalogue ? 'Update' : 'Create'} catalogue failed: ${response?.message}`);
    setLoading(false);
  };

  const onCancelEdit = () => {
    setSelectedCatalogue(null);
    setEditModalOpen(false);
    form.resetFields();
  };

  const onDeleteCatalogue = async (catalogue: FetchCatalogueResponse['data'][number]) => {
    const response = await fetch(`${process.env.API_HOST}/catalogues/${catalogue.id}`, {
      method: 'DELETE',
      headers: { Authorization: getAPIKey() },
    }).then((res) => res.json());

    if (response.success) {
      message.success('Deleted catalogue success!');
      onLoadCatalogue();
    } else message.error(`Delete catalogue failed: ${response?.message}`);
  };

  const onConfirmDelete = (catalogue: FetchCatalogueResponse['data'][number]) => {
    Modal.confirm({
      title: 'Delete Catalogue',
      content: `Are you sure you want to delete ${catalogue.name}? This action cannot be undone!`,
      onOk: () => onDeleteCatalogue(catalogue),
    });
  };

  const columns: TableColumnProps<FetchCatalogueResponse['data'][number]>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 120,
      fixed: 'left',
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      key: 'brand',
      width: 120,
      fixed: 'left',
      render: (_, record) => record.brand?.name ?? '-',
    },
    {
      title: 'Catalogue',
      dataIndex: 'catalogue',
      key: 'catalogue',
      width: 200,
      render: (_, record) =>
        record.content ? (
          <Button className="p-0" type="link" href={record.content.cdnUrl} target="_blank">
            {record.content.name}
          </Button>
        ) : (
          '-'
        ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (_, record) => new Date(record.createdAt).toLocaleString(),
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 120,
      render: (_, record) => new Date(record.updatedAt).toLocaleString(),
    },
    {
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <div className="flex gap-2 justify-end">
          <Button variant="filled" color="primary" onClick={() => onClickEdit(record)}>
            Edit
          </Button>
          <Button variant="filled" color="danger" onClick={() => onConfirmDelete(record)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const onLoadCatalogue = () => {
    fetchCatalogue({}).then((data) => setCatalogue(data));
    fetchBrands().then((data) => setBrands(data));
  };

  useEffect(() => {
    onLoadCatalogue();
  }, []);

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button type="primary" onClick={() => setEditModalOpen(true)}>
          + Add Catalogue
        </Button>
      </div>
      <Table
        rowKey="id"
        dataSource={catalogue?.data}
        columns={columns}
        pagination={false}
        scroll={{ x: 'max-content' }}
      />

      <Modal
        loading={loading}
        title={`${selectedCatalogue ? 'Edit' : 'Add'} Catalogue`}
        open={editModalOpen}
        onOk={onSubmitEdit}
        okText="Submit"
        onCancel={onCancelEdit}
        width={664}
      >
        <div className="w-full py-5">
          <Form layout="vertical" form={form}>
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="brandId" label="Brand" rules={[{ required: true }]}>
              <Select options={brands?.data.map((brand) => ({ label: brand.name, value: brand.id }))} />
            </Form.Item>
            <Form.Item name="contentId" hidden></Form.Item>
            <Form.Item name="imageId" hidden></Form.Item>
            <Form.Item
              name="image"
              label="Image"
              valuePropName="fileList"
              rules={[{ required: true }]}
              getValueFromEvent={normFile}
            >
              <Upload
                name="file"
                maxCount={1}
                data={{ category: 'catalogue_image' }}
                headers={{ Authorization: getAPIKey() }}
                action={`${process.env.API_HOST}/files`}
                listType="picture-card"
                onChange={({ file }) => {
                  if (file.status === 'done') {
                    form.setFieldValue('imageId', file.response.data.id);
                  }
                  if (file.status === 'error') {
                    if (typeof file.response === 'string') {
                      message.error({ content: <div dangerouslySetInnerHTML={{ __html: file.response }} /> });
                    } else {
                      message.error(`Upload failed: ${file.response.message}`);
                    }
                  }
                }}
              >
                +
              </Upload>
            </Form.Item>
            <Form.Item
              name="content"
              label="Content"
              valuePropName="fileList"
              rules={[{ required: true }]}
              getValueFromEvent={normFile}
            >
              <Upload
                name="file"
                maxCount={1}
                data={{ category: 'catalogue_content' }}
                headers={{ Authorization: getAPIKey() }}
                action={`${process.env.API_HOST}/files`}
                listType="text"
                onChange={({ file }) => {
                  if (file.status === 'done') {
                    form.setFieldValue('contentId', file.response.data.id);
                  }
                  if (file.status === 'error') {
                    if (typeof file.response === 'string') {
                      message.error({ content: <div dangerouslySetInnerHTML={{ __html: file.response }} /> });
                    } else {
                      message.error(`Upload failed: ${file.response.message}`);
                    }
                  }
                }}
              >
                <Button>Upload File</Button>
              </Upload>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

const BrandsAdminPage = () => {
  const [form] = Form.useForm<{
    name: string;
    jargon: string;
    semanticLabel: string;
    heroImage: UploadProps['fileList'];
    heroImageId: string;
    logoImage: UploadProps['fileList'];
    logoId: string;
    backgroundColor: string;
    fontType: string;
    primaryColor: string;
    secondaryColor: string;
    phone: string;
    address: string;
    websiteUrl: string;
    contactImageId: string;
    story: {
      title: string;
      description: string;
      images: UploadProps['fileList'];
      imageIds: string[];
    };
    detail: {
      title: string;
      description: string;
      images: UploadProps['fileList'];
      imageIds: string[];
    };
    subBrands: {
      websiteUrl: string;
      coverImageId: string;
      coverImage: UploadProps['fileList'];
      logo: UploadProps['fileList'];
      logoId: string;
      shortDescription: string;
    }[];
  }>();

  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [brands, setBrands] = useState<FetchBrandsApiResponse | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<FetchBrandsApiResponse['data'][number] | null>(null);

  const [formDesigner] = Form.useForm<{
    name: string;
    bio: string;
    shortBio: string;
    brandIds: string[];
    image: UploadProps['fileList'];
    imageId: string;
    projectImages: UploadProps['fileList'];
    projectImageIds: string[];
  }>();

  const [designers, setDesigners] = useState<FetchDesignerByBrandIdResponse | null>(null);
  const [designersModalOpen, setDesignersModalOpen] = useState(false);
  const [editDesignerModalOpen, setEditDesignerModalOpen] = useState(false);
  const [selectedDesigner, setSelectedDesigner] = useState<FetchDesignerByBrandIdResponse['data'][number] | null>(null);

  const onClickEdit = (brand: FetchBrandsApiResponse['data'][number]) => {
    form.setFieldsValue({
      name: brand.name,
      jargon: brand.jargon,
      semanticLabel: brand.semanticLabel,
      heroImage: brand?.heroImage ? [{ url: brand?.heroImage?.cdnUrl, uid: brand?.heroImage?.id }] : [],
      heroImageId: brand?.heroImage?.id,
      logoImage: brand?.logo ? [{ url: brand?.logo?.cdnUrl, uid: brand?.logo?.id }] : [],
      logoId: brand?.logo?.id,
      backgroundColor: brand.backgroundColor,
      fontType: brand.fontType,
      primaryColor: brand.primaryColor,
      secondaryColor: brand.secondaryColor,
      phone: brand.phone,
      address: brand.address,
      websiteUrl: brand?.websiteUrl || '',
      contactImageId: brand?.contactImage?.id,
      story: {
        title: brand.story.title,
        description: brand.story.description,
        images: brand.story.images.map((image) => ({ url: image.cdnUrl, uid: image.id })),
        imageIds: brand.story.images.map((image) => image.id),
      },
      detail: {
        title: brand?.detail?.title || '',
        description: brand?.detail?.description || '',
        images: brand?.detail?.images?.map((image) => ({ url: image.cdnUrl, uid: image.id })) || [],
        imageIds: brand?.detail?.images?.map((image) => image.id) || [],
      },
      subBrands: (typeof brand.subBrands === 'string' ? JSON.parse(brand.subBrands) : brand.subBrands).map((subBrand: any) => ({
        websiteUrl: subBrand.websiteUrl,
        coverImage: [{ url: subBrand.coverImage.cdnUrl, uid: subBrand.coverImage.id }],
        coverImageId: subBrand.coverImage.id,
        logo: [{ url: subBrand.logo.cdnUrl, uid: subBrand.logo.id }],
        logoId: subBrand.logo.id,
        shortDescription: subBrand.shortDescription,
      })),
    });
    setSelectedBrand(brand);
    setEditModalOpen(true);
  };

  const onCancelEdit = () => {
    setSelectedBrand(null);
    setEditModalOpen(false);
    form.resetFields();
  };

  const onSubmitEdit = async () => {
    setLoading(true);
    const formValues = await form.validateFields();
    delete formValues.logoImage;
    delete formValues.heroImage;
    delete formValues.story.images;
    delete formValues.detail.images;

    formValues.primaryColor = formValues?.primaryColor
      ? typeof formValues?.primaryColor === 'string'
        ? formValues?.primaryColor
        : (formValues?.primaryColor as unknown as AggregationColor).toHexString()
      : '';
    formValues.secondaryColor = formValues?.secondaryColor
      ? typeof formValues?.secondaryColor === 'string'
        ? formValues?.secondaryColor
        : (formValues?.secondaryColor as unknown as AggregationColor).toHexString()
      : '';
    formValues.backgroundColor = formValues?.backgroundColor
      ? typeof formValues?.backgroundColor === 'string'
        ? formValues?.backgroundColor
        : (formValues?.backgroundColor as unknown as AggregationColor).toHexString()
      : '';

    (formValues.subBrands || []).forEach((subBrand: any) => {
      delete subBrand.coverImage;
      delete subBrand.logo;
    });

    let response;
    if (selectedBrand) {
      response = await fetch(`${process.env.API_HOST}/brands/${selectedBrand.id}`, {
        method: 'PUT',
        headers: { Authorization: getAPIKey(), 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues),
      }).then((res) => res.json());
    } else {
      response = await fetch(`${process.env.API_HOST}/brands`, {
        method: 'POST',
        headers: { Authorization: getAPIKey(), 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues),
      }).then((res) => res.json());
    }

    if (response.success) {
      message.success(`${selectedBrand ? 'Updated' : 'Created'} brand success!`);
      onCancelEdit();
      onLoadBrands();
    } else message.error(`${selectedBrand ? 'Update' : 'Create'} brand failed: ${response?.message}`);
    setLoading(false);
  };

  const onDeleteBrand = async (brand: FetchBrandsApiResponse['data'][number]) => {
    const response = await fetch(`${process.env.API_HOST}/brands/${brand.id}`, {
      method: 'DELETE',
      headers: { Authorization: getAPIKey() },
    }).then((res) => res.json());
    if (response.success) {
      message.success('Deleted brand success!');
      onLoadBrands();
    } else message.error(`Delete brand failed: ${response?.message}`);
  };

  const onConfirmDelete = (brand: FetchBrandsApiResponse['data'][number]) => {
    Modal.confirm({
      title: 'Delete Brand',
      content: `Are you sure you want to delete ${brand.name}? This action cannot be undone!`,
      onOk: () => onDeleteBrand(brand),
    });
  };

  const onClickDesigners = (brand: FetchBrandsApiResponse['data'][number]) => {
    setSelectedBrand(brand);
    setDesignersModalOpen(true);
  };

  const onCloseDesignersModal = () => {
    setSelectedBrand(null);
    setDesignersModalOpen(false);
  };

  const onClickEditDesigner = (designer: FetchDesignerByBrandIdResponse['data'][number]) => {
    setSelectedDesigner(designer);
    setEditDesignerModalOpen(true);

    formDesigner.setFieldsValue({
      name: designer.name,
      bio: designer.bio,
      shortBio: designer.shortBio,
      brandIds: designer.brands.map((brand) => brand.id),
      image: designer.image ? [{ url: designer.image.cdnUrl, uid: designer.image.id }] : [],
      imageId: designer.image?.id,
      projectImages: designer.projectImages?.map((image) => ({ url: image.cdnUrl, uid: image.id })) || [],
      projectImageIds: designer.projectImages?.map((image) => image.id) || [],
    });
  };

  const onClickCreateDesigner = async () => {
    setEditDesignerModalOpen(true);
    formDesigner.setFieldValue('brandIds', [selectedBrand?.id]);
  };

  const onCancelEditDesigner = () => {
    setSelectedDesigner(null);
    setEditDesignerModalOpen(false);
    formDesigner.resetFields();
  };

  const onSubmitEditDesigner = async () => {
    setLoading(true);
    const formValues = await formDesigner.validateFields();
    delete formValues.image;
    delete formValues.projectImages;

    let response;

    if (selectedDesigner) {
      response = await fetch(`${process.env.API_HOST}/designers/${selectedDesigner.id}`, {
        method: 'PUT',
        headers: { Authorization: getAPIKey(), 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues),
      }).then((res) => res.json());
    } else {
      response = await fetch(`${process.env.API_HOST}/designers`, {
        method: 'POST',
        headers: { Authorization: getAPIKey(), 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues),
      }).then((res) => res.json());
    }

    if (response.success) {
      message.success(`${selectedDesigner ? 'Updated' : 'Created'} designer success!`);
      onCancelEditDesigner();
      onLoadDesigners();
    } else message.error(`${selectedDesigner ? 'Update' : 'Create'} designer failed: ${response?.message}`);
    setLoading(false);
  };

  const onRemoveDesignerFromBrand = async (designer: FetchDesignerByBrandIdResponse['data'][number]) => {
    const designerPayload = {
      name: designer.name,
      bio: designer.bio,
      shortBio: designer.shortBio,
      brandIds: designer.brands.map((brand) => brand.id).filter((id) => id !== selectedBrand?.id),
      imageId: designer.image?.id,
      projectImageIds: designer.projectImages?.map((image) => image.id) || [],
    };

    const response = await fetch(`${process.env.API_HOST}/designers/${designer.id}`, {
      method: 'PUT',
      headers: { Authorization: getAPIKey(), 'Content-Type': 'application/json' },
      body: JSON.stringify(designerPayload),
    }).then((res) => res.json());

    if (response.success) {
      message.success('Removed designer from brand success!');
      onLoadDesigners();
    } else message.error(`Remove designer from brand failed: ${response?.message}`);
  };

  const onDeleteDesigner = async (designer: FetchDesignerByBrandIdResponse['data'][number]) => {
    const response = await fetch(`${process.env.API_HOST}/designers/${designer.id}`, {
      method: 'DELETE',
      headers: { Authorization: getAPIKey() },
    }).then((res) => res.json());
    if (response.success) {
      message.success('Deleted designer success!');
      onLoadDesigners();
    } else message.error(`Delete designer failed: ${response?.message}`);
  };

  const onConfirmRemoveDesignerFromBrand = (designer: FetchDesignerByBrandIdResponse['data'][number]) => {
    Modal.confirm({
      title: 'Remove Designer From Brand',
      content: `Are you sure you want to remove ${designer.name} from ${selectedBrand?.name}? This action cannot be undone!`,
      onOk: () => onRemoveDesignerFromBrand(designer),
    });
  };

  const onConfirmDeleteDesigner = (designer: FetchDesignerByBrandIdResponse['data'][number]) => {
    Modal.confirm({
      title: 'Delete Designer',
      content: `Are you sure you want to delete ${designer.name}? This action cannot be undone!`,
      onOk: () => onDeleteDesigner(designer),
    });
  };

  const columns: TableColumnProps<FetchBrandsApiResponse['data'][number]>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 120,
      fixed: 'left',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (_, record) => new Date(record.createdAt).toLocaleString(),
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 120,
      render: (_, record) => new Date(record.updatedAt).toLocaleString(),
    },
    {
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <div className="flex gap-2 justify-end">
          <Button variant="solid" color="primary" onClick={() => onClickDesigners(record)}>
            Designers
          </Button>
          <Button variant="filled" color="primary" onClick={() => onClickEdit(record)}>
            Edit
          </Button>
          <Button variant="filled" color="danger" onClick={() => onConfirmDelete(record)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const designersColumns: TableColumnProps<FetchDesignerByBrandIdResponse['data'][number]>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex gap-2 justify-end">
          <Button variant="filled" color="primary" onClick={() => onClickEditDesigner(record)}>
            Edit
          </Button>
          <Button variant="dashed" color="danger" onClick={() => onConfirmRemoveDesignerFromBrand(record)}>
            Remove From Brand
          </Button>
          <Button variant="filled" color="danger" onClick={() => onConfirmDeleteDesigner(record)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const onLoadBrands = () => {
    fetchBrands().then((data) => setBrands(data));
  };

  const onLoadDesigners = () => {
    if (designersModalOpen && selectedBrand) {
      fetchDesignerByBrandId(selectedBrand?.id).then((data) => setDesigners(data));
    }
  };

  useEffect(() => {
    onLoadBrands();
  }, []);

  useEffect(() => {
    onLoadDesigners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [designersModalOpen, selectedBrand]);

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button type="primary" onClick={() => setEditModalOpen(true)}>
          + Add Brand
        </Button>
      </div>

      <Table rowKey="id" dataSource={brands?.data} columns={columns} pagination={false} scroll={{ x: 'max-content' }} />
      <Modal
        loading={loading}
        title={`${selectedBrand ? 'Edit' : 'Add'} Brand`}
        open={editModalOpen}
        onOk={onSubmitEdit}
        okText="Submit"
        onCancel={onCancelEdit}
        width={664}
      >
        <div className="w-full py-5">
          <Form layout="vertical" form={form}>
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="jargon" label="Jargon" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item
              name="semanticLabel"
              label="Semantic Label"
              extra="This will be used for brand url (i.e. /brand/<semantic-label>)."
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="websiteUrl"
              label="Website URL"
              rules={[{ type: 'url' }]}
              extra='leave blank to hide "Visit Website" button'
            >
              <Input />
            </Form.Item>
            <Form.Item name="heroImageId" hidden></Form.Item>
            <Form.Item name="logoId" hidden></Form.Item>
            <Form.Item
              name="heroImage"
              label="Hero Image"
              rules={[{ required: true }]}
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload
                name="file"
                maxCount={1}
                data={{ category: 'brand_hero_image' }}
                headers={{ Authorization: getAPIKey() }}
                action={`${process.env.API_HOST}/files`}
                listType="picture-card"
                onChange={({ file }) => {
                  if (file.status === 'done') {
                    form.setFieldValue('heroImageId', file.response.data.id);
                  }
                  if (file.status === 'error') {
                    if (typeof file.response === 'string') {
                      message.error({ content: <div dangerouslySetInnerHTML={{ __html: file.response }} /> });
                    } else {
                      message.error(`Upload failed: ${file.response.message}`);
                    }
                  }
                }}
              >
                +
              </Upload>
            </Form.Item>
            <Form.Item
              name="logoImage"
              label="Logo Image"
              rules={[{ required: true }]}
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload
                name="file"
                maxCount={1}
                data={{ category: 'brand_logo_image' }}
                headers={{ Authorization: getAPIKey() }}
                action={`${process.env.API_HOST}/files`}
                listType="picture-card"
                onChange={({ file }) => {
                  if (file.status === 'done') {
                    form.setFieldValue('logoId', file.response.data.id);
                  }
                  if (file.status === 'error') {
                    if (typeof file.response === 'string') {
                      message.error({ content: <div dangerouslySetInnerHTML={{ __html: file.response }} /> });
                    } else {
                      message.error(`Upload failed: ${file.response.message}`);
                    }
                  }
                }}
              >
                +
              </Upload>
            </Form.Item>
            <Form.Item name="backgroundColor" label="Background Color" rules={[{ required: true }]}>
              <ColorPicker showText size="middle" />
            </Form.Item>
            <Form.Item name="fontType" label="Font Type" hidden></Form.Item>
            <Form.Item name="primaryColor" label="Primary Color" rules={[{ required: true }]}>
              <ColorPicker
                showText
                size="middle"
                onChange={(color) => form.setFieldValue('fontType', color.toHexString())}
              />
            </Form.Item>
            <Form.Item name="secondaryColor" label="Secondary Color" rules={[{ required: true }]}>
              <ColorPicker showText size="middle" />
            </Form.Item>
            <Form.Item name="phone" label="Phone" hidden></Form.Item>
            <Form.Item name="address" label="Address" hidden></Form.Item>
            <Form.Item name="contactImageId" hidden></Form.Item>
            <Form.Item name={['story', 'title']} label="Story Title" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={['story', 'description']} label="Story Description" rules={[{ required: true }]}>
              <Input.TextArea rows={6} />
            </Form.Item>
            <Form.Item name={['story', 'imageIds']} hidden></Form.Item>
            <Form.Item
              name={['story', 'images']}
              valuePropName="fileList"
              label="Gallery & Story Images"
              rules={[{ required: true }]}
              getValueFromEvent={normFile}
              extra="First 6 images will be used as gallery images and the last 4 will be used as story images. Maximum 10 images."
            >
              <Upload
                action={`${process.env.API_HOST}/files`}
                name="file"
                maxCount={10}
                data={{ category: 'brand_story_image' }}
                headers={{ Authorization: getAPIKey() }}
                listType="picture-card"
                onRemove={(file) => {
                  if (file?.error) return;
                  if (file?.response) {
                    form.setFieldValue(
                      ['story', 'imageIds'],
                      form.getFieldValue(['story', 'imageIds']).filter((id: string) => id !== file.response.data.id),
                    );
                  } else {
                    form.setFieldValue(
                      ['story', 'imageIds'],
                      form.getFieldValue(['story', 'imageIds']).filter((id: string) => id !== file.uid),
                    );
                  }
                }}
                onChange={({ file, fileList }) => {
                  if (file.status === 'done') {
                    form.setFieldValue(
                      ['story', 'imageIds'],
                      fileList.map((file) => (file?.response ? file.response.data.id : file.uid)),
                    );
                  }
                  if (file.status === 'error') {
                    if (typeof file.response === 'string') {
                      message.error({ content: <div dangerouslySetInnerHTML={{ __html: file.response }} /> });
                    } else {
                      message.error(`Upload failed: ${file.response.message}`);
                    }
                  }
                }}
              >
                +
              </Upload>
            </Form.Item>
            <Form.Item name={['detail', 'title']} label="Detail Title">
              <Input />
            </Form.Item>
            <Form.Item name={['detail', 'description']} label="Detail Description">
              <Input.TextArea rows={6} />
            </Form.Item>
            <Form.Item name={['detail', 'images']} hidden></Form.Item>
            <Form.Item name={['detail', 'imageIds']} hidden></Form.Item>

            <h2 className="mb-2">Sub Brands</h2>
            <Form.List name={['subBrands']}>
              {(fields, { add, remove }) => (
                <div className="flex flex-col gap-2">
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key} className="grid grid-cols-2 gap-2 border rounded border-gray-200 p-2">
                      <Form.Item
                        {...restField}
                        name={[name, 'websiteUrl']}
                        label="Website URL"
                        className="col-span-2"
                        rules={[{ required: true }]}
                      >
                        <Input placeholder="Website URL" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'shortDescription']}
                        label="Short Description"
                        className="col-span-2"
                        rules={[{ required: true }]}
                      >
                        <Input.TextArea rows={2} />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'coverImageId']} hidden></Form.Item>
                      <Form.Item {...restField} name={[name, 'logoId']} hidden></Form.Item>
                      <Form.Item
                        {...restField}
                        label="Cover Image"
                        name={[name, 'coverImage']}
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        rules={[{ required: true }]}
                      >
                        <Upload
                          name="file"
                          maxCount={1}
                          data={{ category: 'brand_sub_brand_cover_image' }}
                          headers={{ Authorization: getAPIKey() }}
                          action={`${process.env.API_HOST}/files`}
                          listType="picture-card"
                          onChange={({ file }) => {
                            if (file.status === 'done') {
                              form.setFieldValue(['subBrands', key, 'coverImageId'], file.response.data.id);
                            }
                            if (file.status === 'error') {
                              if (typeof file.response === 'string') {
                                message.error({ content: <div dangerouslySetInnerHTML={{ __html: file.response }} /> });
                              } else {
                                message.error(`Upload failed: ${file.response.message}`);
                              }
                            }
                          }}
                        >
                          +
                        </Upload>
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        label="Logo"
                        name={[name, 'logo']}
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        rules={[{ required: true }]}
                      >
                        <Upload
                          name="file"
                          maxCount={1}
                          data={{ category: 'brand_sub_brand_logo_image' }}
                          headers={{ Authorization: getAPIKey() }}
                          action={`${process.env.API_HOST}/files`}
                          listType="picture-card"
                          onChange={({ file }) => {
                            if (file.status === 'done') {
                              form.setFieldValue(['subBrands', key, 'logoId'], file.response.data.id);
                            }
                            if (file.status === 'error') {
                              if (typeof file.response === 'string') {
                                message.error({ content: <div dangerouslySetInnerHTML={{ __html: file.response }} /> });
                              } else {
                                message.error(`Upload failed: ${file.response.message}`);
                              }
                            }
                          }}
                        >
                          +
                        </Upload>
                      </Form.Item>
                      <Button variant="filled" className="col-span-2" color="danger" onClick={() => remove(name)}>
                        Remove Sub brand
                      </Button>
                    </div>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block>
                      Add Subbrand
                    </Button>
                  </Form.Item>
                </div>
              )}
            </Form.List>
          </Form>
        </div>
      </Modal>

      <Modal
        loading={loading}
        title="Brand Designers"
        open={designersModalOpen}
        footer={null}
        onCancel={onCloseDesignersModal}
        width={664}
      >
        <div className="flex mb-4">
          <Button type="primary" onClick={onClickCreateDesigner}>
            {`+ Add Designer to ${selectedBrand?.name}`}
          </Button>
        </div>
        <Table
          rowKey="id"
          dataSource={designers?.data}
          columns={designersColumns}
          pagination={false}
          scroll={{ x: 'max-content' }}
        />
      </Modal>

      <Modal
        loading={loading}
        title={`${selectedDesigner ? 'Edit' : 'Add'} Designer`}
        open={editDesignerModalOpen}
        onCancel={onCancelEditDesigner}
        onOk={onSubmitEditDesigner}
        width={664}
      >
        <Form layout="vertical" form={formDesigner}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="shortBio" label="Short Bio" rules={[{ required: true }]}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="bio" label="Bio" rules={[{ required: true }]}>
            <Input.TextArea rows={6} />
          </Form.Item>
          <Form.Item name="brandIds" label="Brands" rules={[{ required: true }]}>
            <Select mode="multiple" options={brands?.data.map((brand) => ({ label: brand.name, value: brand.id }))} />
          </Form.Item>
          <Form.Item name="imageId" hidden></Form.Item>
          <Form.Item
            name="image"
            label="Image"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true }]}
          >
            <Upload
              name="file"
              maxCount={1}
              data={{ category: 'designer_image' }}
              headers={{ Authorization: getAPIKey() }}
              action={`${process.env.API_HOST}/files`}
              listType="picture-card"
              onChange={({ file }) => {
                if (file.status === 'done') {
                  formDesigner.setFieldValue('imageId', file.response.data.id);
                }
                if (file.status === 'error') {
                  if (typeof file.response === 'string') {
                    message.error({ content: <div dangerouslySetInnerHTML={{ __html: file.response }} /> });
                  } else {
                    message.error(`Upload failed: ${file.response.message}`);
                  }
                }
              }}
            >
              +
            </Upload>
          </Form.Item>
          <Form.Item name="projectImageIds" hidden></Form.Item>
          <Form.Item name="projectImages" label="Project Images" valuePropName="fileList" getValueFromEvent={normFile}>
            <Upload
              name="file"
              data={{ category: 'designer_project_image' }}
              headers={{ Authorization: getAPIKey() }}
              action={`${process.env.API_HOST}/files`}
              listType="picture-card"
              onRemove={(file) => {
                if (file?.error) return;
                if (file?.response) {
                  formDesigner.setFieldValue(
                    'projectImageIds',
                    formDesigner.getFieldValue('projectImageIds').filter((id: string) => id !== file.response.data.id),
                  );
                } else {
                  formDesigner.setFieldValue(
                    'projectImageIds',
                    formDesigner.getFieldValue('projectImageIds').filter((id: string) => id !== file.uid),
                  );
                }
              }}
              onChange={({ file, fileList }) => {
                if (file.status === 'done') {
                  formDesigner.setFieldValue(
                    'projectImageIds',
                    fileList.map((file) => (file?.response ? file.response.data.id : file.uid)),
                  );
                }
                if (file.status === 'error') {
                  if (typeof file.response === 'string') {
                    message.error({ content: <div dangerouslySetInnerHTML={{ __html: file.response }} /> });
                  } else {
                    message.error(`Upload failed: ${file.response.message}`);
                  }
                }
              }}
            >
              +
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

const PressReleaseAdminPage = () => {
  const [form] = Form.useForm<{
    brandId: string;
    title: string;
    media: string;
    content: string;
    imageId: string;
    image: UploadProps['fileList'];
    date: Dayjs;
  }>();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [pressReleases, setPressReleases] = useState<FetchPressReleasesResponse | null>(null);
  const [selectedPressRelease, setSelectedPressRelease] = useState<FetchPressReleasesResponse['data'][number] | null>(
    null,
  );
  const [brands, setBrands] = useState<FetchBrandsApiResponse | null>(null);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const onClickCreate = () => {
    setContent(defaultHtmlContent);
    form.setFieldsValue({
      content: defaultHtmlContent,
    });
    setEditModalOpen(true);
  };

  const onClickEdit = (pressRelease: FetchPressReleasesResponse['data'][number]) => {
    setSelectedPressRelease(pressRelease);
    setEditModalOpen(true);

    setContent(pressRelease.content);
    form.setFieldsValue({
      title: pressRelease.title,
      brandId: pressRelease.brand.id,
      media: pressRelease.media,
      imageId: pressRelease.image.id,
      image: pressRelease?.image
        ? [{ uid: pressRelease.image.id, name: pressRelease.image.name, url: resolveImageUrl(pressRelease.image.cdnUrl) }]
        : [],
      content: pressRelease.content,
      date: dayjs(pressRelease.date),
    });
  };

  const onCancelEdit = () => {
    setSelectedPressRelease(null);
    setEditModalOpen(false);
    form.resetFields();
  };

  const columns: TableColumnProps<FetchPressReleasesResponse['data'][number]>[] = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      fixed: 'left',
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      key: 'brand',
      width: 120,
      render: (_, record) => record.brand?.name ?? '-',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 100,
      render: (_, record) => new Date(record.date).toLocaleDateString(),
    },
    {
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <div className="flex gap-2 justify-end">
          <Button variant="filled" color="primary" onClick={() => onClickEdit(record)}>
            Edit
          </Button>
          <Button variant="filled" color="danger" onClick={() => onConfirmDelete(record)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const resetPagination = () => {
    setPagination({ page: 1, limit: 10 });
  };

  const onSubmitEdit = async () => {
    setLoading(true);
    const formValues = form.getFieldsValue();
    delete formValues.image;

    const payload = {
      ..._.omit(formValues, 'date'),
      date: formValues.date ? dayjs(formValues.date).format('YYYY-MM-DD') : null,
    };

    let response;

    if (selectedPressRelease) {
      response = await fetch(`${process.env.API_HOST}/press-releases/${selectedPressRelease.id}`, {
        method: 'PUT',
        headers: { Authorization: getAPIKey(), 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).then((res) => res.json());
    } else {
      response = await fetch(`${process.env.API_HOST}/press-releases`, {
        method: 'POST',
        headers: { Authorization: getAPIKey(), 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).then((res) => res.json());
    }

    if (response.success) {
      message.success(`${selectedPressRelease ? 'Update' : 'Create'} press release success!`);
      resetPagination();
      onCancelEdit();
    } else message.error(`${selectedPressRelease ? 'Update' : 'Create'} press release failed: ${response?.message}`);
    setLoading(false);
  };

  const onDeletePressRelease = async (pressRelease: FetchPressReleasesResponse['data'][number]) => {
    const response = await fetch(`${process.env.API_HOST}/press-releases/${pressRelease.id}`, {
      method: 'DELETE',
      headers: { Authorization: getAPIKey() },
    }).then((res) => res.json());

    if (response.success) {
      message.success('Press release deleted');
      resetPagination();
    } else message.error(`Delete press release failed: ${response?.message}`);
  };

  const onConfirmDelete = (pressRelease: FetchPressReleasesResponse['data'][number]) => {
    Modal.confirm({
      title: 'Delete Press Release',
      content: `Are you sure you want to delete press release "${pressRelease.title}"? This action cannot be undone!`,
      onOk: () => onDeletePressRelease(pressRelease),
    });
  };

  useEffect(() => {
    fetchPressReleases({
      limit: pagination.limit,
      page: pagination.page,
    }).then((data) => setPressReleases(data));
  }, [pagination]);

  useEffect(() => {
    fetchBrands().then((data) => setBrands(data));
  }, []);

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button type="primary" onClick={onClickCreate}>
          + Add Press Release
        </Button>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={pressReleases?.data}
        scroll={{ x: 'max-content' }}
        pagination={{
          position: ['bottomCenter'],
          showSizeChanger: true,
          current: pagination.page,
          pageSize: pagination.limit,
          total: pressReleases?.pageMeta.pageCount,
          onChange: (page, pageSize) => setPagination({ page, limit: pageSize }),
        }}
      />
      <Modal
        loading={loading}
        title="Edit Press Release"
        open={editModalOpen}
        onCancel={onCancelEdit}
        onOk={onSubmitEdit}
        width={664}
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="brandId" label="Brand" rules={[{ required: true }]}>
            <Select options={brands?.data.map((brand) => ({ label: brand.name, value: brand.id }))} />
          </Form.Item>
          <Form.Item name="media" label="Media" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true }]}
            extra="Supports HTML content. Preview below to see how it looks like"
          >
            <Input.TextArea rows={12} onChange={(e) => setContent(e.target.value)} />
          </Form.Item>
          <div className="rounded bg-BG/Cream mb-6">
            <Collapse
              ghost
              items={[
                {
                  label: 'Preview Content',
                  key: 'preview',
                  children: (
                    <div
                      className={twMerge(
                        'max-h-96 overflow-y-auto',
                        'prose w-full max-w-[624px]',
                        'prose-headings:font-serif prose-headings:font-normal prose-headings:italic ',
                        'prose-p:font-sans prose-p:font-normal prose-p:leading-[27.2px]',
                        'prose-img:w-full',
                      )}
                      dangerouslySetInnerHTML={{ __html: content }}
                    ></div>
                  ),
                },
              ]}
            />
          </div>
          <Form.Item name="imageId" hidden></Form.Item>
          <Form.Item
            name="image"
            label="Image"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true }]}
          >
            <Upload
              name="file"
              maxCount={1}
              data={{ category: 'press_release_image' }}
              headers={{ Authorization: getAPIKey() }}
              action={`${process.env.API_HOST}/files`}
              listType="picture-card"
              onChange={({ file }) => {
                if (file.status === 'done') {
                  form.setFieldValue('imageId', file.response.data.id);
                }
                if (file.status === 'error') {
                  if (typeof file.response === 'string') {
                    message.error({ content: <div dangerouslySetInnerHTML={{ __html: file.response }} /> });
                  } else {
                    message.error(`Upload failed: ${file.response.message}`);
                  }
                }
              }}
            >
              +
            </Upload>
          </Form.Item>
          <Form.Item name="date" label="Displayed Date" rules={[{ required: true }]}>
            <DatePicker />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

const resolveImageUrl = (cdnUrl?: string) => {
  if (!cdnUrl) return '';
  if (/^https?:\/\//i.test(cdnUrl)) return cdnUrl;
  const apiHost = process.env.API_HOST || '';
  return `${apiHost}${cdnUrl.startsWith('/') ? '' : '/'}${cdnUrl}`;
};

const PromotionAdminPage = () => {
  const [form] = Form.useForm<{
    title: string;
    brandId: string;
    image: UploadProps['fileList'];
    imageId: string;
    content: string;
    activeUntil: Dayjs;
    startDate: Dayjs;
    endDate: Dayjs;
  }>();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [promotions, setPromotions] = useState<FetchPromotionsApiResponse>();
  const [selectedPromotion, setSelectedPromotion] = useState<FetchPromotionsApiResponse['data'][number] | null>(null);
  const [brands, setBrands] = useState<FetchBrandsApiResponse | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const onClickCreate = () => {
    setContent(defaultHtmlContent);
    form.setFieldsValue({
      content: defaultHtmlContent,
    });
    setEditModalOpen(true);
  };

  const onClickEdit = (promotion: FetchPromotionsApiResponse['data'][number]) => {
    setSelectedPromotion(promotion);
    setEditModalOpen(true);

    setContent(promotion.content);
    form.setFieldsValue({
      title: promotion.title,
      brandId: promotion.brand.id,
      imageId: promotion.image.id,
      image: promotion?.image
        ? [{ uid: promotion.image.id, name: promotion.image.name, url: resolveImageUrl(promotion.image.cdnUrl) }]
        : [],
      content: promotion.content,
      activeUntil: dayjs(promotion.activeUntil),
      startDate: dayjs(promotion.startDate),
      endDate: dayjs(promotion.endDate),
    });
  };

  const onCancelEdit = () => {
    setSelectedPromotion(null);
    setEditModalOpen(false);
    form.resetFields();
  };

  const onSubmitEdit = async () => {
    setLoading(true);

    const formValues = form.getFieldsValue();
    delete formValues.image;

    const payload = {
      ...formValues,
      activeUntil: formValues.activeUntil.valueOf(),
      startDate: formValues.startDate.valueOf(),
      endDate: formValues.endDate.valueOf(),
    };

    let response;

    if (selectedPromotion) {
      response = await fetch(`${process.env.API_HOST}/promotions/${selectedPromotion.id}`, {
        method: 'PUT',
        headers: { Authorization: getAPIKey(), 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).then((res) => res.json());
    } else {
      response = await fetch(`${process.env.API_HOST}/promotions`, {
        method: 'POST',
        headers: { Authorization: getAPIKey(), 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).then((res) => res.json());
    }

    if (response.success) {
      message.success(`${selectedPromotion ? 'Update' : 'Create'} promotion success!`);
      resetPagination();
      onCancelEdit();
    } else message.error(`${selectedPromotion ? 'Update' : 'Create'} promotion failed: ${response?.message}`);

    setLoading(false);
  };

  const onDeletePromotion = async (promotion: FetchPromotionsApiResponse['data'][number]) => {
    const response = await fetch(`${process.env.API_HOST}/promotions/${promotion.id}`, {
      method: 'DELETE',
      headers: { Authorization: getAPIKey() },
    }).then((res) => res.json());

    if (response.success) {
      message.success('Promotion deleted');
      resetPagination();
    } else message.error(`Delete promotion failed: ${response?.message}`);
  };

  const onConfirmDelete = (promotion: FetchPromotionsApiResponse['data'][number]) => {
    Modal.confirm({
      title: 'Delete Promotion',
      content: `Are you sure you want to delete promotion "${promotion.title}"? This action cannot be undone!`,
      onOk: () => onDeletePromotion(promotion),
    });
  };

  const columns: TableColumnProps<FetchPromotionsApiResponse['data'][number]>[] = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      key: 'brand',
      render: (_, record) => record.brand?.name ?? '-',
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (_, record) => new Date(record.startDate).toLocaleDateString(),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (_, record) => new Date(record.endDate).toLocaleDateString(),
    },
    {
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <div className="flex gap-2 justify-end">
          <Button variant="filled" color="primary" onClick={() => onClickEdit(record)}>
            Edit
          </Button>
          <Button variant="filled" color="danger" onClick={() => onConfirmDelete(record)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const resetPagination = () => {
    setPagination({ page: 1, limit: 10 });
  };

  useEffect(() => {
    fetchPromotionsApi({
      limit: pagination.limit,
      page: pagination.page,
    }).then((data) => setPromotions(data ?? undefined));
  }, [pagination]);

  useEffect(() => {
    fetchBrands().then((data) => setBrands(data));
  }, []);

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button type="primary" onClick={onClickCreate}>
          + Add Promotion
        </Button>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={promotions?.data}
        scroll={{ x: 'max-content' }}
        pagination={{
          position: ['bottomCenter'],
          showSizeChanger: true,
          current: pagination.page,
          pageSize: pagination.limit,
          total: promotions?.pageMeta.pageCount,
          onChange: (page, pageSize) => setPagination({ page, limit: pageSize }),
        }}
      />

      <Modal
        loading={loading}
        title={`${selectedPromotion ? 'Edit' : 'Add'} Promotion`}
        open={editModalOpen}
        onCancel={onCancelEdit}
        onOk={onSubmitEdit}
        width={664}
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="brandId" label="Brand" rules={[{ required: true }]}>
            <Select options={brands?.data.map((brand) => ({ label: brand.name, value: brand.id }))} />
          </Form.Item>
          <Form.Item name="imageId" hidden></Form.Item>
          <Form.Item
            name="image"
            label="Image"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true }]}
          >
            <Upload
              name="file"
              maxCount={1}
              data={{ category: 'promotion_image' }}
              headers={{ Authorization: getAPIKey() }}
              action={`${process.env.API_HOST}/files`}
              listType="picture-card"
              onChange={({ file }) => {
                if (file.status === 'done') {
                  form.setFieldValue('imageId', file.response.data.id);
                }
                if (file.status === 'error') {
                  message.error(`Upload failed: ${file.response.message}`);
                }
              }}
            >
              +
            </Upload>
          </Form.Item>
          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true }]}
            extra="Supports HTML content. Preview below to see how it looks like"
          >
            <Input.TextArea rows={12} onChange={(e) => setContent(e.target.value)} />
          </Form.Item>
          <div className="rounded bg-BG/Cream mb-6">
            <Collapse
              ghost
              items={[
                {
                  label: 'Preview Content',
                  key: 'preview',
                  children: (
                    <div
                      className={twMerge(
                        'max-h-96 overflow-y-auto',
                        'prose w-full max-w-[624px]',
                        'prose-headings:font-serif prose-headings:font-normal prose-headings:italic ',
                        'prose-p:font-sans prose-p:font-normal prose-p:leading-[27.2px]',
                        'prose-img:w-full',
                      )}
                      dangerouslySetInnerHTML={{ __html: content }}
                    ></div>
                  ),
                },
              ]}
            />
          </div>
          <Form.Item name="activeUntil" label="Active Until" rules={[{ required: true }]}>
            <DatePicker />
          </Form.Item>
          <Form.Item name="startDate" label="Start Date" rules={[{ required: true }]}>
            <DatePicker />
          </Form.Item>
          <Form.Item name="endDate" label="End Date" rules={[{ required: true }]}>
            <DatePicker />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

const ProjectAdminPage = () => {
  const [content, setContent] = useState('');
  const [form] = Form.useForm<{
    name: string;
    category: string;
    brandId: string;
    isFeatured: boolean;
    priority: number;
    imageIds: string[];
    image: UploadProps['fileList'];
    location: string;
    date: Dayjs;
    content: string;
  }>();
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [projects, setProjects] = useState<ProjectApiResponse | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectApiResponse['data'][number] | null>(null);
  const [brands, setBrands] = useState<FetchBrandsApiResponse | null>(null);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const resetPagination = () => {
    setPagination({ page: 1, limit: 10 });
  };

  const onClickCreate = () => {
    setContent(defaultHtmlContent);
    form.setFieldsValue({
      content: defaultHtmlContent,
      imageIds: [],
    });
    setEditModalOpen(true);
  };

  const onClickEdit = (project: ProjectApiResponse['data'][number]) => {
    setSelectedProject(project);
    setEditModalOpen(true);

    setContent(project.content);

    form.setFieldsValue({
      name: project.name,
      category: project.category,
      brandId: project.brand.id,
      isFeatured: project.isFeatured,
      priority: project?.priority,
      imageIds: project.images?.map((image) => image.id),
      image: project?.images?.map((image) => ({ uid: image.id, name: image.name, url: resolveImageUrl(image.cdnUrl) })),
      location: project.location,
      date: dayjs(project.date),
      content: project.content,
    });
  };

  const onCancelEdit = () => {
    setSelectedProject(null);
    setEditModalOpen(false);
    form.resetFields();
  };

  const onSubmitEdit = async () => {
    setLoading(true);

    const formValues = form.getFieldsValue();
    delete formValues.image;
    const payload = {
      ..._.omit(formValues, 'date'),
      date: formValues.date ? dayjs(formValues.date).format('YYYY-MM-DD') : null,
      priority: `${formValues?.priority ?? 0}`,
      imageIds: formValues.imageIds ?? [],
    };

    let response;

    if (selectedProject) {
      response = await fetch(`${process.env.API_HOST}/projects/${selectedProject.id}`, {
        method: 'PUT',
        headers: { Authorization: getAPIKey(), 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).then((res) => res.json());
    } else {
      response = await fetch(`${process.env.API_HOST}/projects`, {
        method: 'POST',
        headers: { Authorization: getAPIKey(), 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).then((res) => res.json());
    }

    if (response.success) {
      message.success(`${selectedProject ? 'Update' : 'Create'} project success!`);
      resetPagination();
      onCancelEdit();
    } else message.error(`${selectedProject ? 'Update' : 'Create'} project failed: ${response?.message}`);

    setLoading(false);
  };

  const onDeleteProject = async (project: ProjectApiResponse['data'][number]) => {
    const response = await fetch(`${process.env.API_HOST}/projects/${project.id}`, {
      method: 'DELETE',
      headers: { Authorization: getAPIKey() },
    }).then((res) => res.json());

    if (response.success) {
      message.success('Project deleted');
      resetPagination();
    } else message.error(`Delete project failed: ${response?.message}`);
  };

  const onConfirmDelete = (project: ProjectApiResponse['data'][number]) => {
    Modal.confirm({
      title: 'Delete Project',
      content: `Are you sure you want to delete project "${project.name}"? This action cannot be undone!`,
      onOk: () => onDeleteProject(project),
    });
  };

  const columns: TableColumnProps<ProjectApiResponse['data'][number]>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      key: 'brand',
      width: 120,
      render: (_, record) => record.brand?.name ?? '-',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 120,
    },
    {
      title: 'Featured',
      dataIndex: 'isFeatured',
      key: 'isFeatured',
      width: 60,
      render: (_, record) => (record.isFeatured ? 'Yes' : 'No'),
    },
    {
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <div className="flex gap-2 justify-end">
          <Button variant="filled" color="primary" onClick={() => onClickEdit(record)}>
            Edit
          </Button>
          <Button variant="filled" color="danger" onClick={() => onConfirmDelete(record)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (featuredOnly) {
      fetchFeaturedProjects().then((data) => setProjects(data as ProjectApiResponse));
    } else {
      fetchProjects({
        limit: pagination.limit,
        page: pagination.page,
      }).then((data) => setProjects(data));
    }
  }, [pagination, featuredOnly]);

  useEffect(() => {
    fetchBrands().then((data) => setBrands(data));
  }, []);

  return (
    <>
      <div className="flex justify-end mb-4 gap-2 items-center">
        <Switch
          checked={featuredOnly}
          title="Featured Only"
          checkedChildren="Featured"
          unCheckedChildren="All"
          onChange={(checked) => setFeaturedOnly(checked)}
        />
        <Button type="primary" onClick={onClickCreate}>
          + Add Project
        </Button>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={projects?.data}
        scroll={{ x: 'max-content' }}
        pagination={
          featuredOnly
            ? false
            : {
                position: ['bottomCenter'],
                showSizeChanger: true,
                current: pagination?.page,
                pageSize: pagination?.limit,
                total: projects?.pageMeta?.pageCount,
                onChange: (page, pageSize) => setPagination({ page, limit: pageSize }),
              }
        }
      />
      <Modal
        loading={loading}
        title={`${selectedProject ? 'Edit' : 'Add'} Project`}
        open={editModalOpen}
        onCancel={onCancelEdit}
        onOk={onSubmitEdit}
        width={664}
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="brandId" label="Brand" rules={[{ required: true }]}>
            <Select options={brands?.data.map((brand) => ({ label: brand.name, value: brand.id }))} />
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="isFeatured" label="Featured" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="priority" hidden></Form.Item>
          <Form.Item name="imageIds" hidden></Form.Item>
          <Form.Item
            name="image"
            label="Image"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true }]}
          >
            <Upload
              name="file"
              maxCount={2}
              data={{ category: 'project_image' }}
              headers={{ Authorization: getAPIKey() }}
              action={`${process.env.API_HOST}/files`}
              listType="picture-card"
              onRemove={(file) => {
                if (file?.error) return;
                const current = form.getFieldValue('imageIds') ?? [];
                if (file?.response) {
                  form.setFieldValue('imageIds', current.filter((id: string) => id !== file.response.data.id));
                } else {
                  form.setFieldValue('imageIds', current.filter((id: string) => id !== file.uid));
                }
              }}
              onChange={({ file, fileList }) => {
                if (file.status === 'done') {
                  form.setFieldValue(
                    'imageIds',
                    fileList.map((file) => (file?.response ? file.response.data.id : file.uid)),
                  );
                }
                if (file.status === 'error') {
                  if (typeof file.response === 'string') {
                    message.error({ content: <div dangerouslySetInnerHTML={{ __html: file.response }} /> });
                  } else {
                    message.error(`Upload failed: ${file.response.message}`);
                  }
                }
              }}
            >
              +
            </Upload>
          </Form.Item>
          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true }]}
            extra="Supports HTML content, check preview to see how it looks like"
          >
            <Input.TextArea rows={12} onChange={(e) => setContent(e.target.value)} />
          </Form.Item>
          <div className="rounded bg-BG/Cream mb-6">
            <Collapse
              ghost
              items={[
                {
                  label: 'Preview Content',
                  key: 'preview',
                  children: (
                    <div
                      className={twMerge(
                        'max-h-96 overflow-y-auto',
                        'prose w-full max-w-[624px]',
                        'prose-headings:font-serif prose-headings:font-normal prose-headings:italic ',
                        'prose-p:font-sans prose-p:font-normal prose-p:leading-[27.2px]',
                        'prose-img:w-full',
                      )}
                      dangerouslySetInnerHTML={{ __html: content }}
                    ></div>
                  ),
                },
              ]}
            />
          </div>
          <Form.Item name="location" label="Location" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="date" label="Date" rules={[{ required: true }]}>
            <DatePicker />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
