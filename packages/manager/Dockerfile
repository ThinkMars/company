# 构建阶段
FROM node:22-alpine as builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY . .

# 构建项目
RUN npm run build

# 部署阶段
FROM nginx:latest

# 复制 nginx 配置文件，这里走脚本复制吧，这个Nginx配置文件是动态的
COPY ./nginx.conf /etc/nginx/nginx.conf

# 复制构建产物到 nginx 目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 5173

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"] 