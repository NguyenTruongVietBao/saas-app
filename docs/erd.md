# Lean ERD Design — SaaS Platform (Multi-tenant with Multi-Org Support)

## 1. Kiến trúc lưu trữ (Multi-tenancy)
Hệ thống sử dụng mô hình **Separate Schema** trên PostgreSQL kết hợp với **Global User Registry**:

- **`public`**: Chứa dữ liệu hệ thống dùng chung (Organizations, Users, Roles, Global Audit).
- **`tenant_{id}`**: Chứa dữ liệu nghiệp vụ riêng của từng Organization (Projects, Departments, Tasks, Employees).

---

## 2. Public Schema (Shared Registry)

```mermaid
erDiagram
    organizations ||--o{ organization_members : "has"
    users ||--o{ organization_members : "belongs"
    users ||--o{ refresh_tokens : "has"
    organizations ||--o{ audit_logs_global : "has"

    organizations {
        uuid id PK
        string name
        string subdomain UK
        string schema_name UK
        string plan "free | pro"
        string status "active | suspended"
        timestamp created_at
    }

    users {
        uuid id PK
        string email UK
        string password_hash
        string full_name
        string status "active | inactive"
        timestamp created_at
    }

    organization_members {
        uuid id PK
        uuid organization_id FK
        uuid user_id FK
        string role "OWNER | ADMIN | MEMBER"
        timestamp joined_at
    }

    refresh_tokens {
        uuid id PK
        uuid user_id FK
        string token_hash
        string user_agent
        string ip_address
        uuid replaced_by FK "Self-reference for rotation"
        boolean is_revoked
        timestamp expires_at
        timestamp created_at
    }

    blog_posts {
        uuid id PK
        jsonb title_i18n
        jsonb content_i18n
        string status "draft | published"
        jsonb tags
        timestamp created_at
    }

    audit_logs_global {
        uuid id PK
        uuid organization_id FK
        string actor
        string action
        jsonb payload
        timestamp created_at
    }
```

---

## 3. Tenant Schema (Isolated Workspace)

```mermaid
erDiagram
    departments ||--o{ employees : "contains"
    departments ||--o{ projects : "owns"
    projects ||--o{ tasks : "contains"
    employees ||--o{ tasks : "assigned"
    employees ||--o{ project_members : "participates"
    projects ||--o{ project_members : "has"

    departments {
        uuid id PK
        string name
        string description
        timestamp created_at
    }

    employees {
        uuid id PK
        uuid user_id FK "Link to Public User"
        uuid department_id FK
        string employee_code UK
        string full_name
        string email
        string role "MANAGER | STAFF"
        string status "ACTIVE | ON_LEAVE | RESIGNED"
        date hire_date
    }

    projects {
        uuid id PK
        uuid department_id FK
        string name
        string description
        string status "active | archived"
        timestamp created_at
    }

    project_members {
        uuid id PK
        uuid project_id FK
        uuid employee_id FK
        string role "LEAD | MEMBER"
    }

    tasks {
        uuid id PK
        uuid project_id FK
        uuid assignee_id FK "Employee ID"
        string title
        string description
        string status "TODO | DONE"
        timestamp created_at
    }

    personal_todos {
        uuid id PK
        uuid employee_id FK "Tied to employee in this org"
        string title
        string status "TODO | DONE"
        timestamp created_at
    }

    audit_logs {
        uuid id PK
        uuid employee_id FK
        string action
        string resource
        jsonb before_state
        jsonb after_state
        timestamp created_at
    }
```

---

## 4. Key Changes for Multi-Org & Rotation
1.  **Global Users**: Bảng `users` được đưa ra `public` schema để một user có thể login một lần và chuyển đổi giữa các Organization mà họ tham gia.
2.  **Mapping Table**: `organization_members` quản lý quyền hạn của User trong từng Org (OWNER/ADMIN/MEMBER).
3.  **Department Layer**: Thêm bảng `departments` để phân cấp quản lý bên trong Organization.
4.  **Employee Context**: Dữ liệu nghiệp vụ (Projects, Tasks) giờ đây liên kết với `employees` thay vì trực tiếp với `users`, vì vai trò và vị trí của một người có thể khác nhau giữa các Org.
5.  **Token Rotation Ready**: Bảng `refresh_tokens` có trường `replaced_by` và `is_revoked` để hỗ trợ logic xoay vòng token an toàn.
