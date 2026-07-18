'use client';

import { useState } from 'react';

import { Dialog, DialogPanel } from '@headlessui/react';

export default function SectionGalery({ images }: { images: string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  return (
    <>
      <div className="mb-20 hidden overflow-hidden scroll-smooth pl-8 scrollbar-hide lg:block lg:pl-20">
        <div className="flex gap-10">
          <div className="flex w-fit flex-col items-end gap-10">
            <img
              className="max-w-[210px] aspect-[210/192] object-cover"
              src={images[0]}
              alt=""
              onClick={() => {
                setIsOpen(true);
                setCurrentImage(0);
              }}
            />
            <img
              className="max-w-[328px] aspect-[210/278] object-cover"
              src={images[1]}
              alt=""
              onClick={() => {
                setIsOpen(true);
                setCurrentImage(1);
              }}
            />
          </div>
          <img
            className="max-w-[332px] aspect-[332/653] object-cover"
            src={images[2]}
            alt=""
            onClick={() => {
              setIsOpen(true);
              setCurrentImage(2);
            }}
          />
          <div className="flex flex-col items-start gap-10">
            <img
              className="max-w-[324px] aspect-[324/392] object-cover"
              src={images[3]}
              alt=""
              onClick={() => {
                setIsOpen(true);
                setCurrentImage(3);
              }}
            />
            <img
              className="max-w-[208px] aspect-[208/186] object-cover"
              src={images[4]}
              alt=""
              onClick={() => {
                setIsOpen(true);
                setCurrentImage(4);
              }}
            />
          </div>
          <img
            className="max-w-[332px] aspect-[496/976] object-cover"
            src={images[5]}
            alt=""
            onClick={() => {
              setIsOpen(true);
              setCurrentImage(5);
            }}
          />
        </div>
      </div>

      <div className="mb-20 flex items-start justify-center gap-6 overflow-scroll px-8 lg:hidden lg:px-20">
        {images.map((image, index) => (
          <img
            className="w-full"
            key={index}
            src={image}
            alt=""
            onClick={() => {
              setIsOpen(true);
              setCurrentImage(index);
            }}
          />
        ))}
      </div>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-[102]">
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 flex w-screen items-center justify-center bg-black bg-opacity-60 p-4"
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute right-4 top-4 text-black/70 lg:right-10 lg:top-10"
          >
            <svg width="40" height="40" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.5 7.5L7.5 22.5" stroke="#231f20" strokeLinecap="square" stroke-linejoin="round" />
              <path d="M7.5 7.5L22.5 22.5" stroke="#231f20" strokeLinecap="square" stroke-linejoin="round" />
            </svg>
          </button>
          <DialogPanel className="max-w-5xl space-y-4">
            <img src={images[currentImage]} className="w-full min-w-60 lg:min-w-96" alt="" />
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
