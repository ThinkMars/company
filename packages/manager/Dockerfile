# 运行阶段
FROM nginx:alpine

# 设置工作目录
# WORKDIR /app

# 复制构建产物
COPY ./dist /usr/share/nginx/html

# 暴露80端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]