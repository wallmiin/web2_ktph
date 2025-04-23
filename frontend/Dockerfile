# Sử dụng image Node.js làm base image
FROM node:18-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy file package.json và package-lock.json để cài đặt dependency
COPY package.json package-lock.json ./

# Cài đặt dependency
RUN npm install

# Copy toàn bộ mã nguồn
COPY . .

# Build ứng dụng React
RUN npm run build

# Cài đặt server nhẹ để phục vụ ứng dụng React (sử dụng serve)
RUN npm install -g serve

# Mở cổng 3000 (cổng mặc định của frontend)
EXPOSE 3000

# Lệnh để chạy ứng dụng
CMD ["serve", "-s", "build", "-l", "3000"]