# 01_TECH_STACK_SETUP.md

## 1. Tổng quan
Tài liệu này quy định Tech Stack và môi trường phát triển cho đội Frontend. Mục tiêu là hiệu năng cao, Type-safe và dễ bảo trì.

## 2. Core Stack
| Công nghệ | Phiên bản | Mục đích | Lý do chọn |
| :--- | :--- | :--- | :--- |
| **React** | 18.x / 19.x | UI Library | Chuẩn công nghiệp. |
| **TypeScript** | 5.x | Language | Bắt buộc để đồng bộ Type với Backend DTO. Tránh lỗi runtime. |
| **Vite** | 5.x | Build Tool | Nhanh hơn Webpack/CRA gấp 10-20 lần. |
| **React Router** | 6.20+ | Routing | Sử dụng Data API (Loaders/Actions) để quản lý luồng dữ liệu tốt hơn. |

## 3. Data & State Management
| Công nghệ | Mục đích | Lý do chọn |
| :--- | :--- | :--- |
| **TanStack Query (v5)** | Server State | Quản lý API Caching, Auto Refetch, Loading/Error state. Thay thế Redux cho việc gọi API. |
| **Zustand** | Client State | Quản lý Auth State (User info, Token), Cart. Nhẹ hơn Redux Toolkit rất nhiều. |
| **Axios** | HTTP Client | Hỗ trợ Interceptors mạnh mẽ để xử lý Refresh Token tự động. |

## 4. UI & Styling
| Công nghệ | Mục đích | Lý do chọn |
| :--- | :--- | :--- |
| **Tailwind CSS** | Styling | Utility-first, code nhanh, không cần file CSS riêng. |
| **Shadcn/UI** | Components | Bộ component copy-paste, tùy biến cao, base trên Radix UI (Accessible). |
| **Lucide React** | Icons | Bộ icon nhẹ, đẹp, chuẩn SVG. |

## 5. Form & Validation
| Công nghệ | Mục đích | Lý do chọn |
| :--- | :--- | :--- |
| **React Hook Form** | Form Logic | Performance cao (không re-render cả form khi gõ phím). |
| **Zod** | Schema Validation | Validation mạnh mẽ, tích hợp tốt với TypeScript. Logic validate giống Backend (Email, Min, Max). |

## 6. Setup Command
```bash
# Khởi tạo dự án
npm create vite@latest badminton-booking-fe -- --template react-ts

# Cài đặt các thư viện cốt lõi
npm install axios @tanstack/react-query zustand react-router-dom
npm install -D tailwindcss postcss autoprefixer
npm install react-hook-form @hookform/resolvers zod
```
