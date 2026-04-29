# [PLAN] Personal Todo Feature Implementation

Dự án sẽ triển khai tính năng **Personal Todo** giúp người dùng quản lý các tác vụ cá nhân trong hệ thống SaaS đa người dùng (Multi-tenant).

## User Review Required

> [!IMPORTANT]
> **Chiến lược Auth:** Hiện tại hệ thống chưa có Module Auth hoàn chỉnh. Tôi sẽ tạm thời triển khai một cơ chế định danh người dùng qua Header `x-user-id` hoặc sử dụng một User mặc định trong Database để đảm bảo tính năng "Cá nhân" hoạt động đúng logic trước khi tích hợp hệ thống Identity đầy đủ.

> [!WARNING]
> **Giao diện:** Tôi sẽ sử dụng **Tailwind CSS v4** với các tính năng mới nhất để tạo giao diện Premium. Hãy đảm bảo bạn đã cài đặt các dependencies cần thiết (đã có trong `package.json`).

## Proposed Changes

### 1. Backend (PostgreSQL & NestJS API)

Hệ thống database đã có bảng `personal_todos`. Tôi sẽ tập trung hoàn thiện logic xử lý tại API.

#### [MODIFY] [todo.service.ts](file:///e:/Code/MyProject/saas-app_nextjs-nextjs/apps/api/src/todo/todo.service.ts)

- Hoàn thiện logic CRUD, thêm validation và xử lý lỗi chuyên sâu.
- Đảm bảo dữ liệu luôn được lọc theo `userId` từ context.

#### [MODIFY] [todo.controller.ts](file:///e:/Code/MyProject/saas-app_nextjs-nextjs/apps/api/src/todo/todo.controller.ts)

- Thay thế `mockUserId` bằng dữ liệu thực tế từ Header hoặc Auth Context.
- Thêm Swagger/OpenAPI documentation (nếu cần).

---

### 2. Frontend (Next.js 16 Web App)

Xây dựng giao diện người dùng hiện đại, tốc độ cao.

#### [NEW] `apps/web/app/todos/page.tsx`

- Trang chính liệt kê danh sách Todo.
- Tích hợp Server Components để tối ưu SEO và tốc độ tải trang ban đầu.

#### [NEW] `apps/web/components/todo/todo-list.tsx`

- Component hiển thị danh sách với hiệu ứng animation mượt mà.
- Hỗ trợ chế độ xem theo danh sách (List view).

#### [NEW] `apps/web/components/todo/todo-form.tsx`

- Form thêm mới và chỉnh sửa Todo sử dụng React Server Actions hoặc API routes.
- Validation dữ liệu ngay tại client.

#### [NEW] `apps/web/components/todo/todo-item.tsx`

- Từng item Todo với các nút chức năng: Hoàn thành, Xóa, Chỉnh sửa.
- Thiết kế theo phong cách Glassmorphism.

---

### 3. Shared Library

#### [MODIFY] [tenant.ts](file:///e:/Code/MyProject/saas-app_nextjs-nextjs/packages/database/src/schema/tenant.ts)

- Kiểm tra và tối ưu hóa các index cho bảng `personal_todos` để đảm bảo truy vấn nhanh theo `userId`.

## Open Questions

> [!CAUTION]
> **Người dùng mẫu (Demo User):** Bạn có muốn tôi tạo sẵn một script seed dữ liệu để bạn có thể thấy ngay kết quả sau khi tôi implement không?

## Verification Plan

### Automated Tests

- Chạy `nest test` cho các API endpoints mới.
- Chạy `python .agent/scripts/checklist.py .` để kiểm tra bảo mật và chất lượng code.

### Manual Verification

1. Truy cập `/todos` trên trình duyệt.
2. Thực hiện thêm 5 tác vụ mới.
3. Đánh dấu hoàn thành 2 tác vụ và kiểm tra trạng thái cập nhật trong DB.
4. Xóa 1 tác vụ.
5. Kiểm tra tính biệt lập: Đảm bảo Todo của User A không xuất hiện ở User B.
