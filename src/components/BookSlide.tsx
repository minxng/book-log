"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import SwiperCore from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import BookCoverImage from "./BookCoverImage";

interface BookItem {
  itemId: string;
  title: string;
  cover: string;
  isbn13: string;
  bestRank?: string;
}

interface Book {
  books: {
    item: BookItem[];
  };
  title: string;
  type: string;
}

export default function BookSlide({ books, title, type }: Book) {
  SwiperCore.use([Navigation, Scrollbar, Autoplay]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="py-2 sm:py-6 px-2 sm:px-8 xl:px-0">
      <Link href={`/list/${type}`}>
        <h2 className="text-lg sm:text-xl py-3 sm:py-4 flex items-center gap-2">
          {title}
          <IoIosArrowForward />
        </h2>
      </Link>
      {mounted ? (
        <Swiper
          loop={true}
          slidesPerView={2.8}
          spaceBetween={10}
          autoplay={{
            delay: 3000,
          }}
          breakpoints={{
            500: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 5,
            },
          }}
        >
          {books.item.map((book, idx) => (
            <SwiperSlide key={book.itemId}>
              <Link href={`/book/${book.isbn13}`}>
                <div className="relative w-full aspect-170/240">
                  <BookCoverImage
                    src={book.cover.replace("cover200", "cover500")}
                    priority={idx < 4}
                    imageClassName="hover:scale-[1.02] hover:shadow-lg transition-transform"
                  />
                </div>
                <div className="flex mt-2 sm:mt-4 gap-1">
                  {book.bestRank && (
                    <p className="w-6 h-6 bg-gray-100 text-primary font-bold text-center rounded flex items-center justify-center shrink-0">
                      {book.bestRank}
                    </p>
                  )}
                  <p className="text-ellipsis line-clamp-2 text-sm  sm:text-base">
                    {book.title}
                  </p>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="grid grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className=" aspect-170/240 bg-gray-200 animate-pulse rounded-lg"
            />
          ))}
        </div>
      )}
    </section>
  );
}
