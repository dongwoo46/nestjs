# 베이스 이미지 설정 (Node.js LTS 버전 사용)
FROM node:20

# 작업 디렉토리 생성
WORKDIR /app

# 패키지 파일 복사 및 설치
COPY package*.json ./
RUN npm install

# 소스 파일 복사
COPY . .

# NestJS 애플리케이션 빌드
RUN npm run build

# 앱 포트 설정
EXPOSE 3000

# 애플리케이션 실행 명령어
CMD ["npm", "run", "start:prod"]
