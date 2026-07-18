'use client';

import React, { useState } from 'react';

import { ConfigProvider, Spin } from 'antd';
import { toast } from 'sonner';
import { postContactForm } from '~/api_helpers/postContactForm';

import ArrowRight from '~/components/Icons/ArrowRight';

import InputText from '../Input/InputText';
import InputTextArea from '../Input/InputTextArea';

const forms = [
  {
    type: 'text',
    name: 'fullName',
    label: 'Full Name',
    placeholder: 'Enter your full name',
    required: true,
  },
  {
    type: 'text',
    name: 'emailAddress',
    label: 'Email Address',
    placeholder: 'Enter your email address',
    required: true,
  },
  {
    type: 'text',
    name: 'phoneNumber',
    label: 'Phone Number',
    placeholder: 'Enter your phone number',
    required: true,
  },
  {
    type: 'text',
    name: 'companyName',
    label: 'Company Name',
    placeholder: 'Enter your company name',
    required: false,
  },
  {
    type: 'textarea',
    name: 'message',
    label: 'Message',
    placeholder: 'Enter message',
    required: false,
  },
];
const getMapsUrl = (address: string) => {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURI(address)}`;
};

const locations = [
  {
    name: 'Casa Italia',
    address: 'Jl. Kemang Raya No.80, RT.11/RW.022, Daerah Khusus Ibukota Jakarta 12730',
    phoneText: '+62 851-7418-9869',
    phoneLink: 'tel:+6285174189869',
    logo: '/assets/brand_logo/Casa_Italia.png',
    background: '/assets/locations/casa_italia.png',
  },
  {
    name: 'Polflex',
    address:
      'Jakarta Design Center 3rd Floor SR 09-10, RT.10/RW.6, Petamburan, Kecamatan Tanah Abang, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10260',
    phoneText: '+62 851-7418-9869',
    phoneLink: 'tel:+6285174189869',
    logo: '/assets/brand_logo/Polflex_Office.png',
    background: 'https://cdn.kmarshall.id/dev/c7d6c67c-9b78-4f06-835e-31f9737392ef.jpg',
  },
  {
    name: 'Masterpiece',
    address:
      'Jakarta Design Center 1st Floor SR 09-10, RT.10/RW.6, Petamburan, Kecamatan Tanah Abang, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10260',
    phoneText: '+62 851 7419 3943',
    phoneLink: 'tel:+6285174193943',
    logo: '/assets/brand_logo/Masterpiece.png',
    background: '/assets/locations/masterpiece.png',
  },
  {
    name: 'Homelogy',
    address:
      'Jakarta Design Center 3rd Floor SR 09-10, RT.10/RW.6, Petamburan, Kecamatan Tanah Abang, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10260',
    phoneText: '+62 851-7418-9869',
    phoneLink: 'tel:+6285174189869',
    logo: '/assets/brand_logo/Homelogy.png',
    background: '/assets/locations/homelogy.png',
  },
  {
    name: 'Melba',
    address:
      'Jakarta Design Center 3rd Floor SR 09-10, RT.10/RW.6, Petamburan, Kecamatan Tanah Abang, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10260',
    phoneText: '+62 851-7418-9869',
    phoneLink: 'tel:+6285174189869',
    logo: '/assets/brand_logo/Melba.png',
    background: '/assets/locations/melba.png',
  },
  {
    name: 'Jands',
    address:
      'Jakarta Design Center 2nd Floor, RT.10/RW.6, Petamburan, Kecamatan Tanah Abang, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10260',
    phoneText: '+62 851-7419-3943',
    phoneLink: 'tel:+6285174193943',
    logo: '/assets/brand_logo/Jands.png',
    background: '/assets/locations/jands.png',
  },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    emailAddress: '',
    phoneNumber: '',
    companyName: '',
    message: '',
  });
  const clearFormData = () => {
    setFormData({ fullName: '', emailAddress: '', phoneNumber: '', companyName: '', message: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;
    if (!formData.fullName || !formData.emailAddress || !formData.phoneNumber) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    const response = await postContactForm({
      name: formData.fullName,
      email: formData.emailAddress,
      phone: formData.phoneNumber,
      company: formData.companyName,
      message: formData.message,
    });

    if (response.ok) {
      toast.success('Thank you for contacting us! We will get back to you soon.');
      clearFormData();
    } else toast.error('Failed to submit form. Please try again.');
    setIsSubmitting(false);
  };

  const onClickGetDirection = () => {
    window.open(
      getMapsUrl(
        'Jakarta Design Center 1st Floor SR 09-10, RT.10/RW.6, Petamburan, Kecamatan Tanah Abang, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10260',
      ),
      '_blank',
    );
  };

  return (
    <>
      {/* Contact Hero */}
      <div className="bg-black/100 p-8 lg:p-20">
        <div className="mt-16 w-full"></div>
        <div className="mb-10 font-serif text-6xl uppercase text-white/100 lg:text-9xl">Contact Us</div>

        <div className="flex flex-wrap gap-y-9">
          <div className="basis-full lg:basis-3/5">
            <div className="mb-2.5 text-xs uppercase text-white/50">Location</div>
            <div className="mb-6 font-serif text-[32px] italic leading-none text-white/100">
              Jakarta Design Center 1st Floor SR 09-10, RT.10/RW.6, Petamburan, Kecamatan Tanah Abang, Kota Jakarta
              Pusat, Daerah Khusus Ibukota Jakarta 10260
            </div>
            <button
              onClick={onClickGetDirection}
              className="flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-xs uppercase text-white/100 transition-all duration-150 hover:border-BG/Cream hover:bg-BG/Cream hover:text-black/80"
            >
              <div>Get Direction</div>
              <ArrowRight />
            </button>
          </div>
          <div className="basis-full lg:basis-2/5 lg:pl-8">
            <div className="flex flex-wrap gap-x-8 gap-y-12">
              <div className="min-w-72">
                <div className="mb-2.5 text-xs uppercase text-white/50">Email Address</div>
                <a href="mailto:contact@theluxuryasia.com" className="text-white/100 hover:underline">
                  contact@theluxuryasia.com
                </a>
              </div>
              <div className="min-w-72">
                <div className="mb-2.5 text-xs uppercase text-white/50">Phone Number</div>
                <a href="tel:+6285174189869" className="text-white/100 hover:underline">
                  +62 851-7418-9869
                </a>
              </div>
              <div className="min-w-72">
                <div className="mb-2.5 text-xs uppercase text-white/50">Business Hours</div>
                <div className="text-white/100">10.00 - 19.00</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="flex flex-wrap gap-y-9">
        <div className="basis-full p-8 lg:basis-1/2 lg:p-14">
          <div className="mb-10 font-serif text-6xl italic leading-none lg:text-[64px]">Tell us what you need</div>

          <Spin spinning={isSubmitting} tip="Submitting..." style={{ backgroundColor: 'rgba(247, 246, 241, 0.05)' }}>
            <form onSubmit={handleSubmit}>
              {forms.map((form) => {
                if (form.type === 'text') {
                  return (
                    <InputText
                      {...form}
                      key={form.name}
                      value={formData[form.name as keyof typeof formData]}
                      onChange={handleInputChange}
                    />
                  );
                } else if (form.type === 'textarea') {
                  return (
                    <InputTextArea
                      {...form}
                      key={form.name}
                      value={formData[form.name as keyof typeof formData]}
                      onChange={handleInputChange}
                    />
                  );
                }
              })}
              <button
                type="submit"
                className="flex min-w-[296px] items-center gap-2 rounded-full border bg-black/100 px-6 py-3.5 uppercase text-white/100 transition-all duration-150 hover:border-black/80 hover:bg-BG/Cream hover:text-black/80"
              >
                <div className="flex-1 text-center text-base">Submit</div>
                <ArrowRight className="h-6 w-6" />
              </button>
            </form>
          </Spin>
        </div>
        <img
          className="h-full basis-full object-cover lg:basis-1/2"
          src="/assets/about_tla_building.png"
          alt="Contact Form"
        />
      </div>

      {/* Reach us at */}
      <div className="p-8 pb-16 font-serif text-[64px] italic leading-none text-black/100 lg:p-20">Reach us at</div>
      <div className="flex flex-wrap">
        {locations.map((location, index) => {
          return (
            <div
              key={index}
              style={{ backgroundImage: `url(${location.background})` }}
              className="relative flex aspect-[480/317] basis-full flex-col items-start justify-end gap-8 bg-cover bg-center p-8 md:basis-1/2 lg:basis-1/3"
            >
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#2f1f13] to-transparent"></div>
              <img src={location.logo} alt={location.name} className="relative z-10 max-h-12 max-w-40 invert" />
              <div className="relative z-10 flex gap-2">
                <div className="basis-3/5">
                  <div className="mb-1.5 text-[10px] uppercase text-white/50">Location</div>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={getMapsUrl(location.address)}
                    className="text-sm text-white/100 hover:underline"
                  >
                    {location.address}
                  </a>
                </div>
                <div className="basis-2/5">
                  <div className="mb-1.5 text-[10px] uppercase text-white/50">Phone Number</div>
                  <a href={location.phoneLink} className="text-sm text-white/100 hover:underline">
                    {location.phoneText}
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
