# 05_SOCIAL_MODULE_SPECS.md

## 1. Tổng quan
Module Mạng xã hội cho phép người chơi cầu lông giao lưu, chia sẻ khoảnh khắc, tìm đồng đội.
**Mô hình:** Tương tự Facebook (Newsfeed, Post, Comment, Like).

## 2. Các tính năng chính (Features)

### 2.1. Newsfeed (Trang tin)
- **Hiển thị:** Danh sách bài viết (Post) từ mới nhất đến cũ nhất.
- **Infinite Scroll:** Tự động tải thêm khi cuộn xuống (dùng `IntersectionObserver`).
- **Filter:** Xem tất cả / Chỉ xem bạn bè / Bài viết phổ biến.

### 2.2. Bài viết (Post)
- **Nội dung:** Text + Ảnh (Multiple images).
- **Tương tác:**
  - **Like/Unlike:** Optimistic Update (Cập nhật UI ngay lập tức trước khi gọi API).
  - **Comment:** Hiển thị comment, trả lời comment (Nested comments - Optional).
  - **Share:** Copy link bài viết.

### 2.3. User Profile (Hồ sơ người dùng)
- **Info:** Avatar, Tên, Bio, Cấp độ trình độ (Beginner/Intermediate/Pro).
- **History:** Các bài đã đăng.
- **Friend:** Kết bạn, Hủy kết bạn.

## 3. Data Structure (TypeScript Interfaces)

```typescript
// Post
interface Post {
  id: string;
  content: string;
  images: string[]; // URLs
  author: UserShortInfo;
  likes: number;
  comments: number;
  isLiked: boolean; // Trạng thái user hiện tại đã like chưa
  createdAt: string;
}

// Comment
interface Comment {
  id: string;
  postId: string;
  content: string;
  author: UserShortInfo;
  createdAt: string;
}
```

## 4. API Endpoints (Dự kiến)
- `GET /posts?page=1&limit=10`: Lấy Newsfeed.
- `POST /posts`: Tạo bài viết (Multipart/form-data cho ảnh).
- `POST /posts/{id}/like`: Thả tim.
- `POST /posts/{id}/comments`: Bình luận.
