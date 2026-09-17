import BookCoverImage from "@/components/BookCoverImage";
import BookSlide from "@/components/BookSlide";
import InfoButton from "@/components/InfoButton";
import ReviewButton from "@/components/ReviewButton";
import WishButton from "@/components/WishButton";
import { getBestSeller, getBookDetail } from "@/lib/api/aladin";
import he from "he";

export default async function BookDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await getBookDetail(id);
  const categoryBooks = await getBestSeller(1, book.categoryId);
  return (
    <section className="container-style p-4 sm:p-8">
      <div className="flex gap-4 sm:gap-10 sm:flex-row flex-col items-center sm:items-start">
        <div className="w-[250px] max-w-64 sm:w-[300px]">
          <BookCoverImage
            src={book.cover.replace("coversum", "cover500")}
            priority
          />
        </div>
        <div className="flex flex-col w-full sm:w-1/2 gap-2">
          <h3 className="text-xl">
            {he.decode(book.title)}{" "}
            <span className="text-sm ml-2">{book.author}</span>
          </h3>
          <p>{he.decode(book.description)}</p>
          <span>{book.subTitle}</span>

          <div className="flex gap-2">
            <WishButton book={book} />
            <ReviewButton book={{ ...book, id: book.itemId }} />
            <InfoButton link={book.link} />
          </div>
        </div>
      </div>
      <BookSlide
        books={categoryBooks}
        title={categoryBooks.searchCategoryName}
        type="bestSeller"
      />
    </section>
  );
}
