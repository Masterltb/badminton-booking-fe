# 02_FOLDER_STRUCTURE.md

Cấu trúc thư mục theo hướng **Feature-based** (chia theo tính năng) thay vì chia theo loại file. Giúp dễ scale dự án lớn.

```
src/
├── assets/                 # Ảnh, fonts, global css
├── components/             # UI Components dùng chung (Button, Input, Modal)
│   ├── ui/                 # Shadcn components
│   └── layout/             # Header, Footer, Sidebar
│
├── config/                 # Cấu hình môi trường (env), axios instance
│   └── api.ts              # Axios interceptors setup
│
├── features/               # CÁC MODULE NGHIỆP VỤ (Quan trọng nhất)
│   ├── auth/               # Module Auth
│   │   ├── api/            # Gọi API (login, register)
│   │   ├── components/     # LoginForm, RegisterForm
│   │   ├── types/          # TypeScript Interfaces (User, AuthResponse)
│   │   └── routes/         # Route con của Auth
│   │
│   ├── booking/            # Module Booking
│   │   ├── api/            # getAvailability, createBooking
│   │   ├── components/     # TimeSlotPicker, BookingSummary
│   │   └── ...
│   │
│   └── venue/              # Module Venue
│
├── hooks/                  # Custom Hooks dùng chung (useDebounce, useClickOutside)
├── lib/                    # Utility functions (formatDate, formatCurrency)
├── stores/                 # Global State (Zustand) - useAuthStore.ts
├── routes/                 # App Routing configuration
└── App.tsx
```

## Quy tắc đặt tên
- **Component:** PascalCase (`BookingCard.tsx`)
- **Hook:** camelCase (`useBooking.ts`)
- **Interface/Type:** PascalCase (`BookingResponse.ts`)
- **Folder:** kebab-case (`booking-history`)
