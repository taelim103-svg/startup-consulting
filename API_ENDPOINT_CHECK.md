# 🔍 실제 API 엔드포인트 확인 방법

## 현재 설정된 엔드포인트

사용자가 제공한 URL:
- `https://bigdata.sbiz.or.kr/#/openApi/storSttus?certKey=...`

현재 코드에서 사용하는 엔드포인트:
- `https://bigdata.sbiz.or.kr/openApi/storSttus?certKey=...` ✅

## 실제 API 엔드포인트 확인 방법

### 방법 1: 브라우저 개발자 도구 사용 (가장 정확!)

1. **브라우저에서 제공된 URL 접속**:
   ```
   https://bigdata.sbiz.or.kr/#/openApi/storSttus?certKey=b5064a94fed20aee6e432aaf30789d198575103a55567c18d9b75e96acb4c51f
   ```

2. **F12 키를 눌러 개발자 도구 열기**

3. **Network 탭 클릭**

4. **페이지에서 "조회" 또는 "분석" 버튼 클릭**

5. **Network 탭에서 실제 API 호출 확인**:
   - XHR 또는 Fetch 필터 선택
   - 실제 API 호출 URL 확인
   - 예: `https://bigdata.sbiz.or.kr/api/...` 또는 다른 경로

### 방법 2: 테스트 API 사용

브라우저에서:
```
http://localhost:3000/api/test-sbiz-direct?api=storSttus&key=b5064a94fed20aee6e432aaf30789d198575103a55567c18d9b75e96acb4c51f
```

이 테스트는 여러 가능한 엔드포인트 패턴을 시도합니다.

### 방법 3: API 문서 확인

소상공인 빅데이터 사이트에서:
- API 문서 섹션 확인
- 실제 REST API 엔드포인트 확인
- 요청/응답 예시 확인

## 가능한 엔드포인트 패턴

1. ✅ `https://bigdata.sbiz.or.kr/openApi/storSttus?certKey=...` (현재 시도 중)
2. `https://bigdata.sbiz.or.kr/api/openApi/storSttus?certKey=...`
3. `https://bigdata.sbiz.or.kr/api/storSttus?certKey=...`
4. `https://bigdata.sbiz.or.kr/api/v1/storSttus?certKey=...`

## 다음 단계

실제 API 엔드포인트를 확인한 후:
1. `app/api/sbiz/client.ts`의 `baseUrl` 수정
2. 테스트 API로 확인
3. 실제 analysis API에 적용

