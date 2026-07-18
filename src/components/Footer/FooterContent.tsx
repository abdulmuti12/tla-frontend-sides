'use client';

import { useState } from 'react';

import { Spin } from 'antd';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import { postSubscribeForm } from '~/api_helpers/postSubscribeForm';
import { useColorConfigStore } from '~/store/color-config-store';

import TLALogoMini from '~/components/Icons/TLALogoMini';

import ArrowRight from '../Icons/ArrowRight';
import InputText from '../Input/InputText';

export default function FooterContent({ className }: { className?: string }) {
  const { config } = useColorConfigStore();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (isSubmitting) return;
    if (!email) return;

    setIsSubmitting(true);
    const response = await postSubscribeForm({ email });

    if (response.ok) {
      toast.success('Thank you for subscribing!');
      setEmail('');
    } else toast.error('Failed to subscribe. Please try again.');

    setIsSubmitting(false);
  };

  return (
    <div
      style={{
        backgroundColor: config.rawColor.bg,
        borderColor: config.rawColor.border,
        color: config.rawColor.secondaryText,
      }}
      className={twMerge(
        config.bg,
        config.border,
        config.text,
        'w-full py-6 pl-6 pr-6 md:py-10 md:pl-20 md:pr-10',
        className,
      )}
    >
      <div className="mb-8">
        <TLALogoMini className="w-[68px]" />
      </div>

      <p
        style={{ color: config.rawColor.accent_text }}
        className={twMerge(config.accent_text, 'mb-20 text-sm leading-6')}
      >
        Curates the world&apos;s finest furniture brands and design excellence, blending timeless elegance, masterful
        craftsmanship, and personalized services to elevate every space into a masterpiece of sophisticated luxury.
      </p>

      <div className="relative">
        <Spin spinning={isSubmitting} style={{ backgroundColor: 'rgba(247, 246, 241, 0.05)' }}>
          <InputText
            size="sm"
            label="NEWSLETTER"
            name="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            button={
              <button
                onClick={handleSubmit}
                className="absolute right-0 top-0 mt-4 flex items-center gap-2 pt-0.5 text-sm font-medium uppercase transition-all duration-100 hover:border-b hover:border-current"
              >
                Subscribe
                <ArrowRight />
              </button>
            }
          />
        </Spin>
      </div>
    </div>
  );
}
