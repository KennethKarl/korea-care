# 세이프닥 글로벌 서비스

[English](./README.md) · **한국어**

세이프닥 글로벌 서비스 팀 워크스페이스입니다. 이 저장소는 공용 Claude Code 설정을 함께 배포해, 팀원 모두가 동일한 환경에서 작업하도록 합니다. 프로젝트 소스 코드는 `.claude/` 와 같은 위치에 둡니다.

## 설치

머신마다 아래 세 단계를 한 번씩 실행하세요.

### 1. 저장소 클론

```bash
git clone https://github.com/williamlee-rgb/global-service.git
cd global-service
```

### 2. ECC 플러그인 마켓플레이스 추가

Claude Code 안에서 실행:

```
/plugin marketplace add https://github.com/affaan-m/everything-claude-code
```

### 3. ECC 플러그인 설치

```
/plugin install everything-claude-code@everything-claude-code
```

여기까지면 됩니다. 이 저장소의 `.claude/settings.json` 이 Claude Code 세션에 필요한 공용 권한을 부여하며, 개인 설정 오버라이드는 `.claude/settings.local.json` (gitignore 대상)에 두면 됩니다.

## 저장소 구성

- `.claude/settings.json` — 팀 공용 Claude Code 권한
- `.gitignore` — ECC 플러그인 클론, env 파일, 빌드 산출물, OS 캐시 제외

그 외 모든 것(애플리케이션 코드, 문서, 인프라)은 프로젝트가 자라남에 따라 이곳에 추가됩니다.
