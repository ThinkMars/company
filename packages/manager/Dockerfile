# 运行阶段
FROM nginx:alpine

# 复制构建产物
COPY dist /usr/share/nginx/html

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost/ || exit 1

# 暴露80端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]
