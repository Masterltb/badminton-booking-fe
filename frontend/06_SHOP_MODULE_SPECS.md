# 06_SHOP_MODULE_SPECS.md

## 1. Tổng quan
Module E-commerce cho phép các Shop thể thao bán vợt, giày, quần áo cầu lông.
**Mô hình:** Marketplace (Nhiều shop) hoặc Single Store (Hệ thống bán). Ở đây thiết kế theo hướng Marketplace (Shop kết nối người dùng).

## 2. Các tính năng chính (Features)

### 2.1. Product Listing (Danh sách sản phẩm)
- **Layout:** Grid (Lưới sản phẩm).
- **Filter:** 
  - Danh mục (Vợt, Giày, Phụ kiện).
  - Giá (Khoảng giá).
  - Thương hiệu (Yonex, Victor, Lining).
- **Sort:** Giá tăng/giảm, Mới nhất, Bán chạy.

### 2.2. Product Detail (Chi tiết sản phẩm)
- **Info:** Tên, Giá, Giá gốc (Gạch ngang), Mô tả chi tiết.
- **Variants:** Chọn Size (Giày/Quần áo), Màu sắc.
- **Shop Info:** Thông tin shop bán, Rating của Shop.
- **Reviews:** Đánh giá từ người mua (Sao + Comment).

### 2.3. Cart & Checkout (Giỏ hàng & Thanh toán)
- **Cart:** Lưu LocalStorage (Client state) hoặc Database (Server state). Khuyên dùng **Database** để đồng bộ đa thiết bị.
- **Checkout:** 
  - Xác nhận địa chỉ giao hàng.
  - Chọn phương thức vận chuyển.
  - Thanh toán (VNPay/COD).

## 3. Data Structure (TypeScript Interfaces)

```typescript
// Product
interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: Category;
  variants: Variant[]; // Size, Color
  shop: {
    id: string;
    name: string;
    avatar: string;
  };
}

// Cart Item
interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}
```

## 4. API Endpoints (Dự kiến)
- `GET /products`: Tìm kiếm sản phẩm.
- `GET /products/{id}`: Chi tiết sản phẩm.
- `POST /cart`: Thêm vào giỏ.
- `POST /orders`: Tạo đơn hàng.
