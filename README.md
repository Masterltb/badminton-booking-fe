# Badminton Booking System (Frontend)

Dự án Frontend cho hệ thống đặt sân cầu lông, được xây dựng với React, TypeScript và Vite.

## 🚀 Tech Stack

Dự án sử dụng các công nghệ hiện đại để đảm bảo hiệu năng, tính dễ bảo trì và trải nghiệm người dùng tốt nhất.

### Core
- **React 19**: Thư viện UI hiện đại.
- **TypeScript**: Ngôn ngữ chính, đảm bảo tính chặt chẽ về dữ liệu (type-safety).
- **Vite**: Build tool thế hệ mới, tốc độ khởi động và HMR cực nhanh.
- **React Router v7**: Thư viện định tuyến mạnh mẽ cho React.

### State & Data Management
- **Zustand**: Quản lý global state (Auth, App state) - Giải pháp nhẹ, đơn giản và hiệu quả hơn Redux.
- **TanStack Query (React Query v5)**: Quản lý server state (API caching, loading, error, re-fetching).
- **Axios**: HTTP Client để giao tiếp với Backend, hỗ trợ interceptors.

### UI & Styling
- **Tailwind CSS v4**: Framework CSS utility-first, giúp xây dựng giao diện nhanh chóng.
- **Shadcn/UI**: Bộ component tái sử dụng chất lượng cao, dễ tùy biến (Button, Input, Card, ...).
- **Lucide React**: Bộ icon chuẩn SVG nhẹ và đẹp.
- **Framer Motion**: Thư viện xử lý animation mượt mà.
- **Sonner**: Hiển thị thông báo (Toast) đẹp mắt.

### Form & Validation
- **React Hook Form**: Quản lý trạng thái form hiệu năng cao, giảm thiểu re-render.
- **Zod**: Thư viện validate schema mạnh mẽ, tích hợp tốt với TypeScript.

## 🛠️ Cài đặt & Chạy dự án

### Yêu cầu
- **Node.js**: Phiên bản 18.x trở lên.
- **npm** (được cài sẵn cùng Node.js).

### Các thư viện cần cài đặt

Khi bạn chạy lệnh `npm install`, các thư viện sau sẽ được tự động tải về (đã được định nghĩa trong `package.json`):

**Dependencies (Chạy ứng dụng):**
- `@tanstack/react-query`
- `axios`
- `react`, `react-dom`
- `react-router-dom`
- `zustand`
- `react-hook-form`, `zod`, `@hookform/resolvers`
- `tailwindcss`, `clsx`, `tailwind-merge`, `class-variance-authority`
- `lucide-react`
- `sonner`
- `framer-motion`

**DevDependencies (Công cụ phát triển):**
- `vite`
- `typescript`
- `eslint`
- `@tailwindcss/vite`
- ...

### Hướng dẫn chi tiết

1. **Clone repository:**
   ```bash
   git clone <repository-url>
   cd badminton-booking-fe
   ```

2. **Cài đặt dependencies:**
   ```bash
   npm install
   ```
   *Bước này rất quan trọng để tải về tất cả các thư viện cần thiết liệt kê ở trên.*

3. **Cấu hình môi trường (Tùy chọn):**
   Tạo file `.env` tại thư mục gốc nếu cần cấu hình API URL riêng.
   ```env
   VITE_API_URL=http://localhost:8080/api
   ```

4. **Chạy server phát triển (Development):**
   ```bash
   npm run dev
   ```
   Sau khi chạy, truy cập trình duyệt tại địa chỉ: `http://localhost:5173`

## 📜 Scripts có sẵn

- **`npm run dev`**: Chạy ứng dụng ở chế độ development.
- **`npm run build`**: Build ứng dụng ra file tĩnh (production) vào thư mục `dist`.
- **`npm run lint`**: Kiểm tra lỗi cú pháp và quy chuẩn code (ESLint).
- **`npm run preview`**: Chạy thử bản build production trên máy local.

## 📂 Cấu trúc dự án

Dự án được tổ chức theo kiến trúc **Feature-based** (chia theo tính năng nghiệp vụ), giúp code dễ đọc và dễ mở rộng khi dự án lớn lên.

```
src/
├── assets/                 # Tài nguyên tĩnh (Logo, ảnh, fonts)
├── components/             # Components giao diện dùng chung
│   ├── ui/                 # Các base components (Button, Input, Card - từ Shadcn)
│   ├── common/             # Các component logic chung (ProtectedRoute, Loading)
│   └── layout/             # Các bộ khung trang (AuthLayout, MainLayout)
├── config/                 # Cấu hình hệ thống (API instance, Constants)
├── features/               # CÁC MODULE NGHIỆP VỤ (Core)
│   ├── auth/               # Module xác thực (Login, Register, Profile)
│   ├── booking/            # Module đặt sân (Tìm sân, Đặt lịch, Thanh toán)
│   ├── admin/              # Module quản trị viên
│   ├── partner/            # Module đối tác (Chủ sân)
│   ├── wallet/             # Module ví điện tử
│   ├── reviews/            # Module đánh giá
│   ├── shop/               # Module cửa hàng (nếu có)
│   └── social/             # Module mạng xã hội (nếu có)
├── hooks/                  # Custom React Hooks dùng chung (useDebounce, ...)
├── lib/                    # Các hàm tiện ích (Utils), xử lý ngày tháng, format tiền
├── pages/                  # Các trang cấp cao nhất (Home, Landing)
├── stores/                 # Quản lý Global State (Zustand Stores)
└── types/                  # Định nghĩa TypeScript Types dùng chung toàn dự án
```

## 🤝 Quy ước (Conventions)

- **Tên File Component**: PascalCase (VD: `BookingCard.tsx`)
- **Tên Hook**: camelCase, bắt đầu bằng use (VD: `useBooking.ts`)
- **Folder Feature**: Viết thường, gạch ngang (VD: `booking-history`)
- **Import**: Sử dụng Alias `@/` để import gọn gàng (VD: `import { Button } from "@/components/ui/button"`).