# 🚀 GitHub + Vercel 배포 가이드

## 📋 준비 완료 상태
✅ Git 초기화 완료
✅ 첫 커밋 완료
✅ 24개 파일 커밋됨

---

## 🔥 3분 안에 배포하기

### 1️⃣ GitHub 리포지토리 생성 (1분)

1. https://github.com 접속
2. 로그인 (없으면 회원가입 - 30초)
3. 우측 상단 `+` → `New repository`
4. 입력:
   - **Repository name**: `startup-consulting`
   - **Public** 선택
   - ❌ "Add README" 체크 해제
5. `Create repository` 클릭

---

### 2️⃣ 로컬 → GitHub 푸시 (1분)

터미널에서 실행 (YOUR_USERNAME을 본인 GitHub 아이디로 변경):

```bash
cd /Users/isc010250/Desktop/consulting

# GitHub 연결
git remote add origin https://github.com/YOUR_USERNAME/startup-consulting.git

# 푸시
git branch -M main
git push -u origin main
```

**실제 예시**:
```bash
# 예: GitHub 아이디가 "johndoe"인 경우
git remote add origin https://github.com/johndoe/startup-consulting.git
git push -u origin main
```

GitHub 비밀번호 입력 요청 시:
- **Username**: GitHub 아이디
- **Password**: Personal Access Token 사용
  (비밀번호 대신 토큰: Settings → Developer settings → Personal access tokens)

---

### 3️⃣ Vercel 배포 (1분)

1. https://vercel.com 접속
2. `Sign Up` → **GitHub 계정으로 가입** (가장 쉬움!)
3. `Add New...` → `Project`
4. GitHub 리포지토리 연결 허용
5. `startup-consulting` 리포지토리 선택
6. `Deploy` 클릭!

**설정 그대로 두면 됩니다:**
- Framework Preset: Next.js ✅ (자동 감지)
- Build Command: npm run build ✅
- Output Directory: .next ✅

---

## 🎉 배포 완료!

배포 시간: 약 1-2분
자동 생성된 URL: `https://startup-consulting-xxx.vercel.app`

---

## 🔑 환경 변수 설정 (선택사항)

AI 컨설팅을 실제로 사용하려면:

1. Vercel 대시보드에서 프로젝트 선택
2. `Settings` → `Environment Variables`
3. 추가:
   - `OPENAI_API_KEY`: OpenAI API 키
   - `SBIZ_API_KEY`: 소상공인 API 키
4. `Redeploy` (재배포)

**없어도 됩니다!** 데모 데이터로 작동합니다.

---

## 🔄 자동 배포

이제부터:
- `git push` 하면 → 자동으로 Vercel에 배포! 🚀
- 코드 수정 → 푸시 → 자동 반영

---

## 📱 공유하기

배포된 URL을 친구들에게 공유하세요!

예: `https://startup-consulting-abc123.vercel.app`

---

## 🐛 문제 해결

### GitHub 푸시 오류
```bash
# 리모트 확인
git remote -v

# 리모트 재설정
git remote set-url origin https://github.com/YOUR_USERNAME/startup-consulting.git
```

### Vercel 빌드 오류
```bash
# 로컬에서 테스트
npm run build

# 성공하면 다시 푸시
git add .
git commit -m "Fix build"
git push
```

---

## 💡 빠른 명령어 모음

```bash
# 1. GitHub 연결 (한 번만)
cd /Users/isc010250/Desktop/consulting
git remote add origin https://github.com/YOUR_USERNAME/startup-consulting.git
git push -u origin main

# 2. 코드 수정 후 배포
git add .
git commit -m "업데이트 내용"
git push

# 3. 변경사항 확인
git status
git log --oneline
```

---

## 🎯 체크리스트

- [ ] GitHub 리포지토리 생성
- [ ] 로컬 코드 푸시
- [ ] Vercel 계정 생성 (GitHub 연동)
- [ ] Vercel에서 프로젝트 Import
- [ ] 배포 완료
- [ ] URL 확인
- [ ] 모든 페이지 테스트
- [ ] URL 공유! 🎉

---

## 🚀 완료 후

**배포 URL**: `https://your-project.vercel.app`

축하합니다! 이제 전 세계 누구나 접속할 수 있습니다! 🌍

