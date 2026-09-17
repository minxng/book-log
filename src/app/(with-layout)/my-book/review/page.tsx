"use client";

import BookCoverImage from "@/components/BookCoverImage";
import LoadingSpinner from "@/components/LoadingSpinner";
import Rating from "@/components/Rating";
import ReviewModal from "@/components/ReviewModal";
import { useAuth } from "@/hooks/useAuth";
import {
  deleteReview,
  deleteReviewBook,
  subscribeToReviewList,
  updateReview,
  writeReview,
} from "@/lib/api/firebase";
import { useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";

interface CommentType {
  createdAt: number;
  review: string;
}

interface ReviewItem {
  id: string;
  title: string;
  cover: string;
  review: string;
  rating: number;
  comments?: {
    [key: string]: CommentType;
  };
}

export default function ReviewList() {
  const user = useAuth();
  const [loading, setLoading] = useState(true);
  const [reviewList, setReviewList] = useState<ReviewItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<ReviewItem | null>(null);
  const [selectedReview, setSelectedReview] = useState({
    review: "",
    rating: 0,
  });
  const [commentId, setCommentId] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToReviewList((data) => {
      setReviewList(data);
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, [user]);
  const updateReviewItem = ({
    id,
    title,
    cover,
    review,
    rating,
  }: {
    id: string;
    title: string;
    cover: string;
    review: string;
    rating: number;
  }) => {
    if (isUpdate)
      return updateReview({ bookId: id, commentId, review, rating });
    writeReview({ id, title, cover, review, rating });
  };

  const openReviewModal = (
    book: ReviewItem,
    selectedReview?: { review: string; rating: number },
    commentId?: string,
  ) => {
    if (commentId && selectedReview) {
      setCommentId(commentId);
      setSelectedReview({
        review: selectedReview.review,
        rating: selectedReview.rating,
      });
      setIsUpdate(true);
    } else {
      setIsUpdate(false);
    }
    setSelectedBook(book);
    setIsOpen(true);
  };
  const deleteReviewItem = (bookId: string, commentId: string) => {
    if (!confirm("삭제하시겠습니까?")) return;
    deleteReview(bookId, commentId);
  };
  const deleteReviewBookItem = (bookId: string) => {
    if (!confirm("삭제하시겠습니까?")) return;
    deleteReviewBook(bookId);
  };
  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedBook(null);
    setSelectedReview({ review: "", rating: 0 });
    setCommentId("");
  };
  return (
    <>
      {selectedBook && (
        <ReviewModal
          isOpen={isOpen}
          onClose={handleCloseModal}
          onSubmit={updateReviewItem}
          book={selectedBook}
          existingReview={selectedReview}
        />
      )}
      {loading && <LoadingSpinner />}
      <ul className="mt-4 px-4">
        {!loading &&
          reviewList &&
          reviewList.map((book, idx) => (
            <li
              key={book.id}
              className="grid grid-cols-[max-content_1fr] gap-4 py-6 first:pt-0 border-b border-gray-200 justify-center"
            >
              <div className="sm:w-[200px] w-[120px] row-start-1 row-end-3 sm:row-end-4 col-start-1 col-end-2">
                <BookCoverImage src={book.cover} priority={idx < 4} />
              </div>
              <div className="flex flex-col sm:flex-row justify-between row-start-1 row-end-3 sm:row-end-2 col-start-2 col-end-3 items-start">
                <div>
                  <p className="text-base sm:text-xl mb-3">{book.title}</p>
                  <Rating value={book.rating} readonly />
                </div>
                <div>
                  <button
                    onClick={() => openReviewModal(book)}
                    className="p-3 h-13 rounded cursor-pointer bg-amber-100 hover:bg-amber-200"
                  >
                    리뷰 작성
                  </button>
                  <button
                    onClick={() => deleteReviewBookItem(book.id)}
                    className="p-3 rounded cursor-pointer"
                  >
                    <FaRegTrashAlt />
                  </button>
                </div>
              </div>
              <ul className="col-start-1 col-end-3 sm:col-start-2">
                {!book.comments && (
                  <li className="bg-primary-100 rounded-xl p-4 w-full my-3 flex justify-between">
                    <p>등록된 리뷰가 없습니다.</p>
                  </li>
                )}
                {book.comments &&
                  Object.entries(book.comments).map(([commentKey, comment]) => (
                    <li
                      className="bg-primary-200 rounded-xl p-4 w-full my-3 flex justify-between "
                      key={comment.createdAt}
                    >
                      <p
                        className="cursor-pointer"
                        onClick={() =>
                          openReviewModal(
                            book,
                            { review: comment.review, rating: book.rating },
                            commentKey,
                          )
                        }
                      >
                        {comment.review}
                      </p>
                      <button
                        onClick={() => deleteReviewItem(book.id, commentKey)}
                        className="p-3 rounded cursor-pointer"
                      >
                        <FaRegTrashAlt />
                      </button>
                    </li>
                  ))}
              </ul>
            </li>
          ))}
        {!loading && !reviewList.length && (
          <p className="bg-primary-100 rounded-xl p-4 w-full my-3 flex justify-between">
            등록된 리뷰가 없습니다.
          </p>
        )}
      </ul>
    </>
  );
}
