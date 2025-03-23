import React, { useState, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

interface User {
  idUsers: number;
  Email: string;
  Tentaikhoan: string;
  Hoten: string;
  Avatar?: string;
}

interface Review {
  iddanhgia: number;
  idsanpham: number;
  idUsers: number;
  sao: number;
  noidung: string;
  ngaydanhgia: string;
  users: {
    Tentaikhoan: string;
    Hoten: string;
    Avatar?: string;
  };
}

interface ProductReviewsProps {
  productId: number;
}

const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [ratingDistribution, setRatingDistribution] = useState<{
    [key: number]: number;
  }>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });

  // Fetch session/user data
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        toast.error("Lỗi khi kiểm tra phiên đăng nhập");
      }
    };

    checkSession();
  }, []);

  // Fetch reviews for the product
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/evaluate?idsanpham=${productId}`);
      if (!response.ok) {
        throw new Error("Không thể tải đánh giá");
      }
      const data = await response.json();
      const reviewsData = data.data || [];
      setReviews(reviewsData);

      // Calculate rating distribution
      // When creating the distribution object
      const distribution: Record<number, number> = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      };

      // Or when updating it
      reviewsData.forEach((review: Review) => {
        if (review.sao >= 1 && review.sao <= 5) {
          distribution[review.sao] = (distribution[review.sao] || 0) + 1;
        }
      });
      setRatingDistribution(distribution);

      setError(null);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError("Không thể tải đánh giá");
      toast.error("Không thể tải đánh giá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  // Handle edit click
  const handleEditClick = (review: Review) => {
    setEditingReview(review);
    setRating(review.sao);
    setComment(review.noidung);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingReview(null);
    setRating(5);
    setComment("");
  };

  // Submit handler for both new reviews and updates
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Vui lòng đăng nhập để đánh giá");
      return;
    }

    if (comment.trim().length === 0) {
      toast.error("Vui lòng nhập nội dung đánh giá");
      return;
    }

    if (comment.trim().length > 256) {
      toast.error("Nội dung đánh giá không được vượt quá 45 ký tự");
      return;
    }

    setIsSubmitting(true);
    try {
      let url = "/api/evaluate";
      let method = "POST";

      if (editingReview) {
        url = `/api/evaluate/${editingReview.iddanhgia}`;
        method = "PUT";
      }

      const body = {
        idsanpham: productId,
        idUsers: user.idUsers,
        sao: rating,
        noidung: comment.trim(),
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Lỗi khi xử lý đánh giá");
      }

      toast.success(
        editingReview ? "Sửa đánh giá thành công!" : "Đánh giá thành công!"
      );
      setComment("");
      setRating(5);
      setEditingReview(null);
      fetchReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi xử lý đánh giá. Vui lòng thử lại!"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete review
  const handleDeleteReview = async (iddanhgia: number) => {
    // Create custom toast for delete confirmation
    toast(
      (t) => (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            Bạn có chắc chắn muốn xóa đánh giá này?
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                deleteReview(iddanhgia);
                toast.dismiss(t.id);
              }}
              className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
            >
              Xóa
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
            >
              Hủy
            </button>
          </div>
        </div>
      ),
      {
        duration: 5000, // Toast will stay for 5 seconds
        position: "top-center",
        style: {
          minWidth: "300px",
        },
      }
    );
  };

  // Add this new function to handle the actual deletion
  const deleteReview = async (iddanhgia: number) => {
    try {
      const response = await fetch(`/api/evaluate/${iddanhgia}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Không thể xóa đánh giá");
      }

      toast.success("Xóa đánh giá thành công!");
      fetchReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi xóa đánh giá. Vui lòng thử lại!"
      );
    }
  };

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, review) => acc + review.sao, 0) / reviews.length
        ).toFixed(1)
      : "0.0";

  // Get total number of reviews
  const totalReviews = reviews.length;

  // Calculate percentage for each star rating
  const getRatingPercentage = (starCount: number) => {
    if (totalReviews === 0) return 0;
    return (ratingDistribution[starCount] / totalReviews) * 100;
  };

  // Function to get animated width class based on rating count
  const getAnimatedWidthClass = (percent: number) => {
    // Using width classes based on percentage
    if (percent >= 95) return "w-full";
    if (percent >= 85) return "w-11/12";
    if (percent >= 75) return "w-10/12";
    if (percent >= 65) return "w-9/12";
    if (percent >= 55) return "w-8/12";
    if (percent >= 45) return "w-7/12";
    if (percent >= 35) return "w-6/12";
    if (percent >= 25) return "w-5/12";
    if (percent >= 15) return "w-4/12";
    if (percent >= 10) return "w-3/12";
    if (percent >= 5) return "w-2/12";
    if (percent > 0) return "w-1/12";
    return "w-0";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
        <div className="w-full md:w-2/3">
          <h2 className="text-2xl font-semibold mb-4">
            {editingReview ? "Chỉnh sửa đánh giá" : "Đánh giá sản phẩm"}
          </h2>

          {/* Rating Distribution */}
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex flex-col items-center justify-center">
                <div className="text-4xl font-bold text-yellow-400">
                  {averageRating}
                </div>
                <div className="flex text-yellow-400 text-sm">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={
                        i < Math.round(parseFloat(averageRating))
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {totalReviews} đánh giá
                </div>
              </div>

              <div className="flex-grow">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-2 mb-1">
                    <div className="text-sm text-gray-700 w-6">{star} sao</div>
                    <div className="flex-grow bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 bg-yellow-400 rounded-full transition-all duration-1000 ease-out ${getAnimatedWidthClass(
                          getRatingPercentage(star)
                        )}`}
                        style={{
                          width: `${getRatingPercentage(star)}%`,
                          transition: "width 1s ease-in-out",
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 w-8">
                      {ratingDistribution[star]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Review Form */}
          {user ? (
            <form
              onSubmit={handleSubmitReview}
              className="space-y-4 border-b pb-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đánh giá của bạn
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-2xl focus:outline-none transition-all duration-300 ${
                        star <= rating
                          ? "text-yellow-400 transform scale-110"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nhận xét
                </label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                  maxLength={256}
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm (tối đa 256 ký tự)"
                  required
                />
                <p className="mt-1 text-sm text-gray-500 text-right">
                  {comment.length}/256 ký tự
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting || comment.trim().length === 0}
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Đang xử lý...
                    </>
                  ) : editingReview ? (
                    "Cập nhật đánh giá"
                  ) : (
                    "Gửi đánh giá"
                  )}
                </button>
                {editingReview && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300"
                  >
                    Hủy chỉnh sửa
                  </button>
                )}
              </div>
            </form>
          ) : (
            <div className="text-center py-4 bg-gray-50 rounded-lg shadow-inner">
              <p className="text-gray-600">
                Vui lòng{" "}
                <a href="/login" className="text-blue-600 hover:underline">
                  đăng nhập
                </a>{" "}
                để đánh giá sản phẩm
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        <h3 className="text-xl font-medium border-b pb-2">
          Tất cả đánh giá ({reviews.length})
        </h3>
        {error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg">
            <div className="text-5xl mb-2">⭐</div>
            <p>Chưa có đánh giá nào cho sản phẩm này</p>
            <p className="text-sm text-gray-400 mt-1">
              Hãy là người đầu tiên đánh giá!
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.iddanhgia}
              className="border-b last:border-0 pb-4 hover:bg-gray-50 p-3 rounded-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                    {review.users?.Tentaikhoan?.charAt(0) || "U"}
                  </div>
                  <span className="font-medium">
                    {review.users?.Tentaikhoan || "Người dùng"}
                  </span>
                  <span className="text-yellow-400">
                    {"★".repeat(review.sao)}
                    <span className="text-gray-300">
                      {"★".repeat(5 - review.sao)}
                    </span>
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(review.ngaydanhgia).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                {user && user.idUsers === review.idUsers && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(review)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline transition-all duration-300"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review.iddanhgia)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium hover:underline transition-all duration-300"
                    >
                      Xóa
                    </button>
                  </div>
                )}
              </div>
              <p className="text-gray-700 ml-10">{review.noidung}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
