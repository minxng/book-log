"use client";
import BookCoverImage from "@/components/BookCoverImage";
import LoadingSpinner from "@/components/LoadingSpinner";
import ReviewButton from "@/components/ReviewButton";
import { useAuth } from "@/hooks/useAuth";
import { removeWishListItem, subscribeToWishList } from "@/lib/api/firebase";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";

type WishListItem = {
  id: string;
  title: string;
  cover: string;
  link: string;
  isbn13?: string;
};

export default function WishList() {
  const user = useAuth();
  const [loading, setLoading] = useState(true);
  const [wishList, setWishList] = useState<WishListItem[]>([]);
  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToWishList((data) => {
      setWishList(data);
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, [user]);
  const deleteItem = (id: string) => {
    removeWishListItem(id);
  };
  return (
    <>
      {loading && <LoadingSpinner />}
      <ul className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 px-4 gap-4 md:gap-8 mt-4 ">
        {!loading && !wishList.length && (
          <p className="bg-primary-100 rounded-xl p-4 w-full flex justify-between col-span-5">
            찜한 도서가 없습니다.
          </p>
        )}
        {wishList.map((book, idx) => (
          <li key={book.id} className="flex flex-col gap-2">
            <div className="relative w-full aspect-2/3">
              <Link href={`/book/${book.isbn13}`}>
                <BookCoverImage
                  src={book.cover}
                  priority={idx < 4}
                  imageClassName="hover:scale-[1.02] hover:shadow-lg transition-transform"
                />
              </Link>
            </div>
            <p className="overflow-ellipsis line-clamp-1">{book.title}</p>
            <p></p>
            <div className="flex gap-2">
              <ReviewButton book={book} />
              <button
                onClick={() => deleteItem(book.id)}
                className="border border-primary-200 p-3 rounded cursor-pointer"
              >
                <FaRegTrashAlt />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
