# 04_UI_COMPONENT_SPECS.md

Quy định về UI/UX và các Component chính.

## 1. Design System (Shadcn/UI + Tailwind)
- **Primary Color:** Xanh dương đậm (Badminton Court Blue).
- **Secondary Color:** Cam (Action Button).
- **Font:** Inter hoặc Roboto.

## 2. Các màn hình chính (Screens)

### 2.1. Trang chủ (Home)
- **Header:** Logo, Search Bar (Location, Date), User Menu.
- **Hero Section:** Banner quảng cáo, CTA "Đặt sân ngay".
- **Venue List:** Grid các thẻ sân (Card).
  - Hiển thị: Ảnh thumbnail, Tên, Giá thấp nhất, Rating (Sao), Khoảng cách.

### 2.2. Chi tiết Sân (Venue Detail)
- **Gallery:** Slider ảnh sân.
- **Info:** Địa chỉ, Giờ mở cửa, Tiện ích (Wifi, Bãi xe).
- **Booking Widget (Quan trọng):**
  - Chọn ngày (Calendar).
  - Chọn sân con (Tabs: Sân 1, Sân 2).
  - **Time Slots Grid:**
    - Ô xanh: Trống (Click để chọn).
    - Ô xám: Đã đặt (Disable).
    - Ô vàng: Đang chọn.
  - Tổng tiền tạm tính.
  - Nút "Thanh toán".

### 2.3. Trang Thanh toán (Checkout)
- **Summary:** Thông tin đặt sân (Giờ, Sân, Giá).
- **Payment Method:** Radio button (VNPay, Ví nội bộ).
- **Button:** "Xác nhận thanh toán" -> Redirect sang VNPay.

### 2.4. Dashboard Chủ sân (Partner Portal)
- **Overview:** Biểu đồ doanh thu, Số booking hôm nay.
- **Calendar View:** Lịch trực quan (giống Google Calendar) để xem các slot đã đặt.
- **Venue Management:** Form tạo/sửa sân.

## 3. Xử lý lỗi (Error Handling UI)
- **Toast Notification:** Dùng `sonner` hoặc `react-hot-toast` để hiện thông báo góc màn hình (Success/Error).
- **Form Error:** Hiển thị dòng chữ đỏ ngay dưới input bị sai (Zod validation message).
