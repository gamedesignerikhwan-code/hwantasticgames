# Hwantastic Games — 브랜드 에셋

`preview.html`을 브라우저로 열면 전부 한눈에 볼 수 있다.

## 어떤 걸 쓰나

락업은 취향이 아니라 **자리의 크기**로 정해진다.

| 조건 | 쓰는 것 |
|---|---|
| 가로 120px 이상 + 세로 여유 | `logo-primary.svg` (Tier 1) |
| 가로로 길고 세로가 좁음 | `logo-horizontal.svg` (Tier 2) |
| 정사각 · 64px 이상 | `icon.svg` (Tier 3) |
| 정사각 · 32px 이하 | `icon-small.svg` / `favicon-*.png` |
| 1도 인쇄 · 자수 · 실크스크린 | `logo-mono.svg` |

표시 폭이 120px 미만이면 Tier 1은 쓰지 않는다. 글자가 뭉갠다.

## SVG — 원본

크기가 자유롭거나 코드에 넣을 때는 항상 이쪽을 쓴다.

```
logo-primary.svg            Tier 1 · 어두운 배경   274 x 222
logo-primary-light.svg      Tier 1 · 밝은 배경
logo-horizontal.svg         Tier 2 · 어두운 배경   288 x 54
logo-horizontal-light.svg   Tier 2 · 밝은 배경
logo-mono.svg               단색 (currentColor)
icon.svg                    Tier 3 · 판 포함       192 x 192
icon-bare.svg               Tier 3 · 판 없음 (임의 배경 위)
icon-small.svg              좁은 크롭 · 32px 이하 전용
```

`logo-mono.svg`는 `currentColor`를 쓴다. **인라인 SVG로 넣어야** CSS `color`가 상속된다.
`<img src>`로 불러오면 별도 문서로 격리돼 검정으로 렌더된다(= 인쇄 기본값).

## PNG — SVG를 못 받는 곳용

Steam, Discord, X, 프레스킷, 메일 서명, 슬라이드 등. **전부 배경 투명**이다
(og-image 제외).

```
logo-primary-600.png / -1200.png              Tier 1 · 흰 글자 (정사각형 600x600 / 1200x1200)
logo-primary-light-600.png / -1200.png        Tier 1 · 검은 글자 (정사각형 600x600 / 1200x1200)
logo-horizontal-600.png / -1200.png           Tier 2 · 흰 글자
logo-horizontal-light-600.png / -1200.png     Tier 2 · 검은 글자
icon-256.png / -512.png / -1024.png           Tier 3 · 판 포함
avatar-400.png / -1024.png                      Discord · Steam · X 프로필 (심볼, 불투명 다크 배경)
avatar-primary-400.png / -1024.png              Discord · Steam · X 프로필 (15글자 풀로고, 불투명 다크 배경)
og-image-1200x630.png                         소셜 공유 카드 (불투명)
favicon-{16,32,48,64,180,192,512}.png
favicon.ico                                   16/32/48/64 멀티 해상도
```

**밝은 배경에는 `-light`를 쓴다.** 기본 PNG는 흰 글자라 흰 바탕에서 사라진다.

**아바타는 `avatar-400.png`를 쓴다.** Discord·X는 아바타를 원형으로 자르는데,
파비콘용 좁은 크롭(`icon-small`)은 카드 모서리가 반경 225px에 있어 잘린다.
`avatar-400.png`는 표준 여백이라 모서리가 186.7px, 원형 크롭 한계(200px) 안에 있다.

## 규격

```
셀            50 x 70   (5:7, 카드 비율)
셀 간격        6         셀폭의 12%
모서리        4         셀폭의 8%
셀 획         1.5       셀폭의 3%
글자          Fira Code 700, 44px  (셀폭의 88%)
정렬          baseline = 셀중심 + (fontSize x 0.693) / 2
여백          사방으로 셀 1개 너비
```

글자는 **path로 아웃라인 처리**되어 있다. Fira Code가 없는 환경에서도 동일하게 렌더된다.

## 색

| | |
|---|---|
| 액센트 (H 칸) | `#ff2a75` — Hearts Extreme 테마 |
| 채운 칸 위 글자 | `#08090d` |
| 어두운 배경용 글자 | `#f8fafc` |
| 밝은 배경용 글자 | `#0f172a` |
| 아이콘 판 | `#0f1218` |

H 칸만 액센트다. 나머지 14칸은 절대 칠하지 않는다.

## 금지

그라디언트, 글로우, 외곽선 추가, 셀 비율 변형, 3행을 2행으로 재배치,
Outfit으로 조판(= 게임 타이틀 전용 폰트).

## 나중에

작품이 늘면 각 칸을 그 작품의 테마색으로 점등하는 시스템을 검토한다
(예: `M` = Minesweeper `#38bdf8`). 지금은 H 하나만 간다.
검토 자료는 `logo_concepts/accent_system.html`.

## 재생성

`logo_concepts/`의 스터디 파일들이 근거 자료다.
SVG는 Fira Code 가변폰트(OFL)를 wght=700으로 고정해 fontTools로 아웃라인한 것이다.
