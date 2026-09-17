"use client";

import { IMG_URL } from "@/app/constant";
import Image from "next/image";
import Link from "next/link";
import SwiperCore from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function Banner() {
  SwiperCore.use([Navigation, Scrollbar, Autoplay]);
  const banner_image_items = [
    { img: `${IMG_URL}/banner_1_ent2gh.png`, link: "/book/9788932923031" },
    { img: `${IMG_URL}/banner_2_wmu2ay.png`, link: "/book/9788925588735" },
    { img: `${IMG_URL}/banner_3_tikrse.png`, link: "/book/9791170612476" },
  ];
  //
  return (
    <Swiper
      loop={true}
      autoplay={{
        delay: 3000,
      }}
    >
      {banner_image_items.map((item, i) => (
        <SwiperSlide key={i}>
          <Link href={item.link}>
            <Image
              src={item.img}
              alt="banner"
              width={1200}
              height={390}
              className="w-full h-auto"
              priority
            />
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
