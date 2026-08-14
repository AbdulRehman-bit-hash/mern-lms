import Link from "next/link";
import Image from "next/image";
import { getDiscountPercent } from "@/lib/discount";

interface CourseCardProps {
  course: {
    _id: string;
    name: string;
    price: number;
    estimatedPrice?: number;
    level: string;
    ratings?: number;
    purchased?: number;
    thumbnail?: { url: string };
  };
}

export default function CourseCard({ course }: CourseCardProps) {
  const discount = getDiscountPercent(course.price, course.estimatedPrice);

  return (
    <Link
      href={`/course/${course._id}`}
      className="group relative flex bg-surface border border-ink/10 rounded-sm overflow-hidden transition-all duration-300 hover:border-ledger/50 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(201,162,39,0.15)]"
    >
      {/* Signature element: vertical level tab, like a ledger/book spine tag */}
      <div className="w-8 flex-shrink-0 bg-ledger text-paper flex items-center justify-center">
        <span className="spine-tab text-[11px] tracking-widest uppercase font-medium">
          {course.level || "General"}
        </span>
      </div>

      <div className="flex-1 p-4 flex flex-col gap-2">
        <div className="relative w-full aspect-video bg-parchment rounded-sm overflow-hidden mb-1">
          {course.thumbnail?.url && (
            <Image
              src={course.thumbnail.url}
              alt={course.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
          {discount > 0 && (
            <span className="absolute top-2 right-2 bg-oxblood text-paper text-[11px] font-bold px-2 py-1 rounded-sm">
              {discount}% OFF
            </span>
          )}
        </div>

        <h3 className="font-display text-lg leading-snug text-ink">
          {course.name}
        </h3>

        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-lg text-ledger">
              ${course.price}
            </span>
            {course.estimatedPrice && course.estimatedPrice > course.price && (
              <span className="font-mono text-sm text-ink/40 line-through">
                ${course.estimatedPrice}
              </span>
            )}
          </div>
          <span className="text-xs text-ink/50">
            {course.purchased || 0} enrolled
          </span>
        </div>
      </div>
    </Link>
  );
}
