# BÁO CÁO ĐỒ ÁN

## Ứng dụng khảo sát cơ sở vật chất VKU

**Tên project:** VKU Field Survey  
**Nền tảng:** Web PWA và Android  
**Application ID:** `vn.edu.vku.fieldsurvey`  
**Thời điểm lập báo cáo:** 10/09/2026

## 1. Tổng quan

VKU Field Survey là ứng dụng hỗ trợ cán bộ hoặc sinh viên ghi nhận tình trạng cơ sở vật chất trong khuôn viên trường. Người dùng có thể nhập thông tin tòa nhà, phòng, hạng mục, mức độ tình trạng, mô tả và ảnh hiện trường. Dữ liệu được lưu cục bộ để có thể tiếp tục thao tác khi kết nối mạng không ổn định.

Ứng dụng được xây dựng bằng Vue 3 và TypeScript, đóng gói thành PWA và Android bằng Capacitor. Project cũng có một API Express mẫu để tiếp nhận dữ liệu khảo sát.

## 2. Mục tiêu

- Số hóa quy trình ghi nhận hiện trạng cơ sở vật chất.
- Cho phép nhập liệu nhanh tại hiện trường trên điện thoại.
- Hỗ trợ chụp ảnh làm bằng chứng cho mỗi khảo sát.
- Lưu dữ liệu offline bằng IndexedDB.
- Chuẩn bị khả năng đồng bộ dữ liệu lên máy chủ khi có mạng.
- Đóng gói ứng dụng thành APK để chạy trên Android Studio hoặc thiết bị Android.

## 3. Chức năng chính

### 3.1. Tạo phiếu khảo sát

Form khảo sát gồm các trường:

- Tòa nhà.
- Phòng.
- Hạng mục.
- Tình trạng: Tốt, Cảnh báo hoặc Hư hỏng.
- Mô tả chi tiết.
- Danh sách ảnh hiện trường.

Khi gửi form, ứng dụng tạo mã định danh UUID, ghi nhận thời gian tạo/cập nhật và lưu phiếu vào cơ sở dữ liệu cục bộ.

### 3.2. Chụp ảnh

Ứng dụng sử dụng Capacitor Camera để mở camera trên Android. Ảnh chụp được hiển thị lại trong form để người dùng kiểm tra trước khi lưu.

### 3.3. Lưu offline

IndexedDB được mở với tên `vku-field-survey`. Hai object store được sử dụng:

- `surveys`: lưu các phiếu khảo sát.
- `syncQueue`: lưu các bản ghi chờ đồng bộ.

Nhờ cơ chế này, người dùng vẫn có thể nhập và lưu dữ liệu khi mất mạng.

### 3.4. Định vị và kiểm tra mạng

Project có service sử dụng Capacitor Geolocation để lấy vĩ độ, kinh độ và service sử dụng Capacitor Network để đọc trạng thái kết nối. Đây là nền tảng cho việc gắn vị trí khảo sát và tự động đồng bộ sau này.

### 3.5. API máy chủ

Server Express mẫu cung cấp endpoint `POST /api/surveys`. Endpoint nhận JSON khảo sát và trả về trạng thái thành công cùng mã phiếu.

## 4. Kiến trúc hệ thống

Ứng dụng được chia thành các lớp chính:

| Lớp | Thành phần | Vai trò |
|---|---|---|
| Giao diện | `src/App.vue`, `src/components/SurveyForm.vue` | Hiển thị màn hình và tiếp nhận dữ liệu |
| Kiểu dữ liệu | `src/types/survey.ts` | Định nghĩa cấu trúc Survey |
| Dữ liệu cục bộ | `src/db/` | Truy cập IndexedDB và hàng đợi đồng bộ |
| Dịch vụ thiết bị | `src/services/cameraService.ts`, `locationService.ts`, `networkService.ts` | Camera, GPS và mạng |
| Dịch vụ API | `src/services/api.ts`, `syncService.ts` | Gửi dữ liệu và xử lý đồng bộ |
| Máy chủ | `server/src/server.ts` | API Express mẫu |
| Android | `android/` | Dự án Android do Capacitor quản lý |

## 5. Mô hình dữ liệu

Một đối tượng `Survey` có các thuộc tính chính:

- `id`: mã UUID của phiếu.
- `building`, `room`, `category`: thông tin vị trí và hạng mục.
- `condition`: `good`, `warning` hoặc `bad`.
- `description`: mô tả hiện trạng.
- `latitude`, `longitude`: vị trí tùy chọn.
- `photos`: danh sách đường dẫn ảnh.
- `createdAt`, `updatedAt`: thời gian tạo và cập nhật.
- `synced`: trạng thái đã đồng bộ hay chưa.

## 6. Luồng xử lý

### 6.1. Lưu khảo sát

1. Người dùng nhập thông tin trên `SurveyForm`.
2. Người dùng có thể chụp một hoặc nhiều ảnh.
3. Ứng dụng tạo UUID và bổ sung thời gian.
4. `saveSurvey()` ghi dữ liệu vào store `surveys`.
5. Form được làm sạch để sẵn sàng cho phiếu tiếp theo.

### 6.2. Đồng bộ dữ liệu

`syncService` đọc các phần tử trong `syncQueue`, gọi API upload từng phần tử và xóa phần tử khỏi hàng đợi khi thành công. Nếu upload lỗi, quá trình dừng để bảo toàn dữ liệu chờ xử lý.

Trong phiên bản hiện tại, cơ chế hàng đợi và trigger đồng bộ đã được chuẩn bị ở tầng service nhưng chưa tự động nối hoàn toàn vào thao tác lưu form. Đây là hạng mục nên hoàn thiện trong phiên bản tiếp theo.

## 7. Công nghệ sử dụng

- Vue 3 với Composition API.
- TypeScript.
- Vite.
- IndexedDB thông qua thư viện `idb`.
- Vite PWA và Workbox service worker.
- Capacitor 8.
- Capacitor Camera, Geolocation và Network.
- Express và CORS cho API mẫu.
- Android Gradle Plugin và Gradle Wrapper.

## 8. Đóng gói Android

Project Android nằm trong thư mục `android/` và có thể mở trực tiếp bằng Android Studio. Cấu hình ứng dụng:

- Package/Application ID: `vn.edu.vku.fieldsurvey`.
- Tên hiển thị: VKU Field Survey.
- Web assets được lấy từ thư mục `dist`.
- Activity chính kế thừa `BridgeActivity` của Capacitor.
- APK debug đã được tạo với tên `VKU-Field-Survey-debug.apk`.

Các lệnh thường dùng:

```text
npm run build
npm run cap:sync
npm run cap:open
npm run android:build
```

## 9. Kiểm thử và kết quả

- Kiểm tra TypeScript và build frontend: đạt.
- Đồng bộ web assets vào Android bằng Capacitor: đạt.
- Build Android debug bằng Gradle với JDK 21 của Android Studio: đạt.
- APK debug được tạo thành công và có thể cài trên thiết bị Android.

## 10. Hạn chế hiện tại

- Header trạng thái mạng hiện đang hiển thị cố định, chưa phản ánh realtime.
- GPS đã có service nhưng chưa được gọi trực tiếp từ form khảo sát.
- Hàng đợi đồng bộ chưa tự động nhận phiếu mới sau thao tác lưu.
- API đang dùng `localhost`, phù hợp cho môi trường thử nghiệm nhưng cần đổi sang địa chỉ máy chủ thật khi triển khai.
- APK hiện là bản debug, chưa ký release để phát hành chính thức.

## 11. Hướng phát triển

1. Tự động thêm khảo sát vào `syncQueue` khi offline.
2. Tự động đồng bộ khi Network chuyển sang trạng thái online.
3. Tích hợp GPS vào mỗi phiếu khảo sát.
4. Bổ sung màn hình danh sách, tìm kiếm, sửa và xóa phiếu.
5. Xây dựng API và cơ sở dữ liệu production có xác thực người dùng.
6. Tạo bản release APK/AAB có ký số.
7. Bổ sung kiểm thử đơn vị và kiểm thử giao diện trên nhiều thiết bị Android.

## 12. Kết luận

VKU Field Survey đã hình thành một nền tảng thực tế cho việc khảo sát cơ sở vật chất trên web và Android. Các chức năng nhập liệu, chụp ảnh, lưu offline, service thiết bị và cấu hình đóng gói Android đã được triển khai. Kiến trúc module rõ ràng giúp project có thể tiếp tục mở rộng sang đồng bộ tự động, quản lý danh sách khảo sát và triển khai máy chủ chính thức.
