# 使用官方的Node.js Alpine基础镜像
FROM node:14-alpine

# 设置工作目录
WORKDIR /usr/src/app

# 复制package.json和package-lock.json到容器中
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制本地代码到容器中
COPY . .

# 指定容器运行时的端口号
EXPOSE 3000

# 定义容器启动时运行的命令
CMD [ "node", "main.js" ]
