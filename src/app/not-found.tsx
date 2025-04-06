"use client";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <div>

      <div className="text-center mt-20">
        <h1 className="text-3xl font-bold text-gray-600 mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-500 mb-6">
          Nội dung bạn tìm kiếm không có. Vui lòng quay lại!
        </p>
        <button
          className="bg-primary hover:bg-opacity-90 !text-white/80 px-6 py-2 rounded-lg"
          onClick={() => router.back}
        >
          Quay lại
        </button>
      </div>

    </div>
  );
}
