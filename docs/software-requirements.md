# Software Requirements Specification (SRS)

## 1. Introduction

Tài liệu này xác định các yêu cầu chức năng và phi chức năng cho hệ thống SaaS chuyên về quản lý Project và HR, sử dụng mô hình Modular Monolith và cơ chế Multi-tenancy Separate Schema.

---

## 2. Actors (Tác nhân hệ thống)

- **System Admin (Super Admin):** Quản trị viên toàn hệ thống, quản lý các Tenant, cấu hình toàn cục.
- **Tenant Admin:** Quản trị viên của một công ty khách hàng, có quyền quản lý User, Settings và Data trong schema của mình.
- **Tenant User (Employee):** Người dùng cuối của một Tenant, tham gia vào các dự án và quy trình nhân sự.
- **Public User:** Khách truy cập ẩn danh (xem Blog, FAQ, Landing Page).

---

## 3. Functional Requirements (Yêu cầu chức năng)

### 3.1 Public Features (Non-tenant)

- **FR-1:** Xem Landing Page giới thiệu dịch vụ.
- **FR-2:** Xem và tìm kiếm bài viết Blog (SEO-friendly).
- **FR-3:** Xem trang FAQ và Contact.

### 3.2 Tenant & User Management

- **FR-5:** Tenant Registration & Provisioning (Tự động tạo Schema).
- **FR-6:** Đăng nhập (Auth) với cơ chế phân tách Tenant (Subdomain-based).
- **FR-7:** Quản lý Profile người dùng trong Tenant.
- **FR-8:** Mời người dùng mới vào Tenant thông qua Email.
- **FR-8.1:** Personal Todo List cho từng người dùng (độc lập với dự án).

### 3.3 Project Management

- **FR-9:** Tạo và quản lý dự án (Projects).
- **FR-10:** Quản lý danh sách tác vụ (Tasks) trong dự án.
- **FR-11:** Phân quyền người dùng tham gia vào từng dự án cụ thể.

### 3.4 HR Management

- **FR-12:** Quản lý danh sách nhân viên trong công ty.
- **FR-13:** Theo dõi trạng thái làm việc (Active, On-leave, Resigned).
- **FR-14:** Quản lý thông tin hợp đồng và hồ sơ nhân sự cơ bản.

### 3.5 System Services

- **FR-15:** Gửi Email thông báo (Invite, Reset Password, Task updates).
- **FR-16:** Hệ thống i18n đa ngôn ngữ cho UI và Data.

---

## 4. Non-Functional Requirements (Yêu cầu phi chức năng)

- **NFR-1 (Isolation):** Dữ liệu giữa các Tenant phải được cô lập hoàn toàn ở tầng Database (Separate Schema).
- **NFR-2 (Scalability):** Hệ thống có khả năng mở rộng số lượng Tenant mà không cần thay đổi kiến trúc cốt lõi.
- **NFR-3 (Performance):** Thời gian phản hồi API trung bình dưới 200ms. Sử dụng Redis cho Caching.
- **NFR-4 (Reliability):** Các tác vụ nặng (Email, Jobs) phải được xử lý bất đồng bộ qua RabbitMQ.
- **NFR-5 (SEO):** Các nội dung công cộng phải được tối ưu SEO (SSR/ISR).
- **NFR-6 (Audit):** Ghi lại nhật ký hoạt động (Audit Logs) cho các thao tác quan trọng trong Tenant.

---

## 5. Constraints (Ràng buộc)

- Phải sử dụng **search_path** của PostgreSQL để chuyển đổi schema động.
- Hệ thống phải triển khai theo mô hình **Modular Monolith** để giữ sự đơn giản nhưng sẵn sàng tách service trong tương lai.
