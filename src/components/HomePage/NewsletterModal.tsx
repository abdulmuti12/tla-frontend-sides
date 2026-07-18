'use client';

import { useEffect, useState } from 'react';

import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { Spin } from 'antd';
import { toast } from 'sonner';
import { postSubscribeForm } from '~/api_helpers/postSubscribeForm';

import ArrowRight from '~/components/Icons/ArrowRight';
import Close from '~/components/Icons/Close';
import InputText from '~/components/Input/InputText';

export default function NewsletterModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const sessionClosed = sessionStorage.getItem('newsletterModalClosed');
    if (sessionClosed !== '1') {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, []);

  const closeModal = () => {
    setIsOpen(false);
    sessionStorage.setItem('newsletterModalClosed', '1');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (isSubmitting) return;
    if (!email) return;

    setIsSubmitting(true);
    const response = await postSubscribeForm({ email });

    if (response.ok) {
      toast.success('Thank you for subscribing!');
      closeModal();
      setEmail('');
    } else toast.error('Failed to subscribe. Please try again.');
    setIsSubmitting(false);
  };

  return (
    <Dialog as="div" open={isOpen} onClose={() => {}} className="absolute z-[102] focus:outline-none">
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center bg-black bg-opacity-60 p-2">
          <DialogPanel
            transition
            className="data-[closed]:transform-[scale(95%)] grid w-full max-w-[754px] overflow-hidden bg-BG/Cream duration-300 ease-out data-[closed]:opacity-0 md:grid-cols-2"
          >
            <img src="/assets/2701_Divano_Hero_Generale_1.png" className="h-full min-h-48 w-full object-cover" alt="" />
            <div className="pb-[60px] pl-10 pr-6 pt-6">
              <div className="flex justify-end">
                <Button onClick={closeModal} className="text-3xl font-thin opacity-20">
                  <Close className="h-7 w-7" />
                </Button>
              </div>
              <DialogTitle as="h3" className="mb-4 font-serif text-[40px] italic leading-none text-black/100">
                Subscribe to our Newsletter
              </DialogTitle>
              <p className="mb-7 text-sm leading-relaxed text-black/70">
                Join our mailing list to get the latest updates about new arrivals and special offers delivered directly
                to your inbox.
              </p>
              <Spin spinning={isSubmitting} style={{ backgroundColor: 'rgba(247, 246, 241, 0.05)' }}>
                <InputText
                  size="sm"
                  label="EMAIL ADDRESS"
                  name="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Spin>
              <Button
                type="submit"
                onClick={handleSubmit}
                className="flex w-full gap-2 rounded-full border bg-black/100 px-6 py-3 text-xs font-bold tracking-[1.08] text-BG/Cream transition-all duration-150 hover:border-black/100 hover:bg-BG/Cream hover:text-black/100"
              >
                <span className="flex-1">SUBSCRIBE</span>
                <ArrowRight />
              </Button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
