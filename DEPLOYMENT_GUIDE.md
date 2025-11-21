# 🚀 배포 가이드

## 🌐 Vercel로 배포하기 (추천)

### 준비 완료! ✅
- ✅ Git 초기화 완료
- ✅ 첫 커밋 완료 (24 파일)
- ✅ 프로젝트 빌드 테스트 완료

---

## 📋 배포 단계

### 1️⃣ GitHub 리포지토리 생성

1. 브라우저에서 [GitHub](https://github.com) 접속
2. 로그인 (없으면 회원가입)
3. 우측 상단 `+` 버튼 → `New repository` 클릭
4. 리포지토리 정보 입력:
   - **Repository name**: `startup-consulting` (또는 원하는 이름)
   - **Description**: 창업 컨설팅 플랫폼
   - **Public** 또는 **Private** 선택
   - **Initialize this repository** 체크 ❌ (이미 로컬에 있음)
5. `Create repository` 클릭

### 2️⃣ 로컬과 GitHub 연결

터미널에서 실행:

```bash
cd /Users/isc010250/Desktop/consulting

# GitHub 리포지토리 주소로 변경 (본인의 username과 repo-name 사용)
git remote add origin https://github.com/YOUR_USERNAME/startup-consulting.git

# 메인 브랜치로 푸시
git branch -M main
git push -u origin main
```

**예시**:
```bash
git remote add origin https://github.com/johndoe/startup-consulting.git
git push -u origin main
```

### 3️⃣ Vercel 배포

1. 브라우저에서 [Vercel](https://vercel.com) 접속
2. `Sign Up` (GitHub 계정으로 가입 추천)
3. `Add New...` → `Project` 클릭
4. `Import Git Repository` → GitHub 리포지토리 선택
5. 프로젝트 설정:
   - **Project Name**: startup-consulting (자동으로 채워짐)
   - **Framework Preset**: Next.js (자동 감지됨)
   - **Root Directory**: ./ (기본값)
   - **Build Command**: npm run build (기본값)
   - **Output Directory**: .next (기본값)
6. **Environment Variables** (중요! 🔑):
   - `OPENAI_API_KEY`: your_openai_api_key (선택사항)
   - `SBIZ_API_KEY`: your_sbiz_api_key (선택사항)
7. `Deploy` 버튼 클릭! 🚀

### 4️⃣ 배포 완료! 🎉

- 배포 시간: 약 1-2분
- 자동으로 HTTPS URL 생성됨
- 예: `https://startup-consulting-xxx.vercel.app`

---

## 🎯 빠른 배포 (Vercel CLI)

GitHub 없이 바로 배포하려면:

```bash
# Vercel 로그인
npx vercel login

# 배포
npx vercel

# 프로덕션 배포
npx vercel --prod
```

---

## 🔑 환경 변수 설정

Vercel 대시보드에서:
1. 프로젝트 선택
2. `Settings` → `Environment Variables`
3. 변수 추가:

| 변수명 | 설명 | 필수 |
|--------|------|------|
| `OPENAI_API_KEY` | AI 컨설팅용 | 선택 |
| `SBIZ_API_KEY` | 소상공인 API | 선택 |
| `NEXT_PUBLIC_API_URL` | API URL | 자동 |

---

## 📱 배포 후 확인사항

### ✅ 체크리스트
- [ ] 메인 페이지 정상 작동
- [ ] 창업 정보 페이지 확인
- [ ] 상권 분석 페이지 테스트
- [ ] AI 컨설팅 페이지 확인
- [ ] 모바일 반응형 확인

### 🐛 문제 해결

#### 빌드 에러
```bash
# 로컬에서 빌드 테스트
npm run build
```

#### 환경 변수 누락
- Vercel 대시보드에서 환경 변수 다시 확인
- 재배포: `Deployments` → `Redeploy`

#### 페이지 404
- `next.config.mjs` 확인
- 라우팅 구조 확인

---

## 🔄 자동 배포 설정

GitHub와 연동하면:
- ✅ `main` 브랜치에 푸시 → 자동 배포
- ✅ Pull Request 생성 → 미리보기 배포
- ✅ 롤백 가능

---

## 💡 추가 기능

### 커스텀 도메인 연결
1. Vercel 대시보드 → `Settings` → `Domains`
2. 도메인 입력 (예: startup.com)
3. DNS 설정 (안내에 따라)

### 성능 모니터링
- Vercel Analytics 활성화
- Real-time 성능 체크

---

## 📞 문제 발생 시

1. [Vercel 문서](https://vercel.com/docs)
2. [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
3. Vercel Discord 커뮤니티

---

## 🎉 축하합니다!

이제 전 세계 누구나 접속할 수 있는 창업 컨설팅 플랫폼이 완성되었습니다! 🚀

**배포 URL**: `https://your-project.vercel.app`

공유하고 피드백을 받아보세요! 💪

