# Software Design Document

## 1. System Overview
Hệ thống được thiết kế theo mô hình **Modular Monolith** nhằm tối ưu hóa việc phát triển và bảo trì trong ngắn hạn, đồng thời sẵn sàng khả năng tách service trong tương lai. Cơ chế Multi-tenancy dựa trên **Separate Schema (PostgreSQL)** để đảm bảo cô lập dữ liệu tối đa.

---

## 2. Database Design

### 2.1 Multi-Schema Strategy
- **Public Schema (`public`):** 
    - Chứa bảng `tenants`: Lưu thông tin định danh, tên miền (`subdomain`), và trạng thái của mỗi khách hàng.
    - Dữ liệu dùng chung: `blog_posts`, `faqs`, `global_settings`.
- **Tenant Schema (`tenant_<id>`):** 
    - Mỗi khi một Tenant mới được tạo, hệ thống sẽ chạy script DDL để tạo một schema mới.
    - Các bảng trong schema này: `users`, `projects`, `tasks`, `personal_todos`, `employees`, `hr_records`, `tenant_settings`.

### 2.2 Schema Switching Mechanism
Sử dụng middleware trong NestJS để bắt `x-tenant-id` header hoặc phân tích subdomain:
```sql
-- Khi xử lý request cho Tenant A
SET search_path TO tenant_a, public;
```

---

## 3. Backend Design (Modular Monolith)

### 3.1 Module Structure
Mỗi module chịu trách nhiệm cho một Bounded Context:
- `TenantModule`: Quản lý việc tạo mới tenant, tạo schema và migrations.
- `AuthModule`: Xử lý đăng ký, đăng nhập và phân quyền.
- `ProjectModule`: Logic quản lý dự án và tác vụ (trong tenant schema).
- `TodoModule`: Quản lý danh sách công việc cá nhân (trong tenant schema).
- `HRModule`: Logic quản lý hồ sơ nhân viên và hợp đồng (trong tenant schema).

### 3.2 Communication Patterns
- **Internal:** Giao tiếp giữa các module thông qua Service interfaces để giữ sự lỏng lẻo (loose coupling).
- **External:** Giao tiếp với Worker/Service khác thông qua RabbitMQ.

---

## 4. Async & Event-Driven Design (RabbitMQ)

Sử dụng RabbitMQ để xử lý các tác vụ tốn thời gian hoặc cần tính tin cậy cao:
1. **Producer:** NestJS gửi message kèm `tenantId`.
2. **Exchange:** `saas_events_exchange`.
3. **Queues:**
    - `email_queue`: Gửi mail mời, mail thông báo.
    - `audit_log_queue`: Lưu lại vết hoạt động của người dùng.
    - `provisioning_queue`: Xử lý tạo schema và seed dữ liệu cho tenant mới.

---

## 5. Security Design

### 5.1 Authentication (JWT)
- **Cấu trúc JWT Token:**
    ```json
    {
      "sub": "user_id",
      "tenantId": "tenant_uuid",
      "role": "ADMIN",
      "iat": 123456789
    }
    ```
- **Validation:** Mỗi request vào Tenant-specific API phải được check xem `tenantId` trong token có khớp với `subdomain` hiện tại không.

### 5.2 RBAC (Role-Based Access Control)
Phân quyền dựa trên vai trò trong từng Tenant:
- `OWNER`: Toàn quyền trên Tenant.
- `ADMIN`: Quản lý dữ liệu nhưng không thể xóa Tenant.
- `USER`: Chỉ có quyền thao tác trên các bản ghi được phân công.

---

## 6. Frontend Design (Next.js)

### 6.1 Routing Strategy
Sử dụng Next.js middleware để xử lý mapping domain:
- `(public)/*`: Map tới domain chính (nguyen-saas.com).
- `(tenant)/*`: Map tới subdomain (client-a.nguyen-saas.com).

### 6.2 Rendering
- **Blog & FAQ:** Sử dụng ISR (Incremental Static Regeneration) để đảm bảo SEO và tốc độ tải trang cực nhanh.
- **Dashboard:** CSR kết hợp với SSR để lấy dữ liệu tenant context ban đầu.

---

## 7. Caching Strategy (Redis)

- **Tenant Metadata:** Lưu trữ ánh xạ `domain -> tenant_id` trong Redis để middleware không cần query Database liên tục.
- **Session & Rate Limiting:** Bảo vệ API khỏi các cuộc tấn công Brute-force hoặc lạm dụng tài nguyên.
