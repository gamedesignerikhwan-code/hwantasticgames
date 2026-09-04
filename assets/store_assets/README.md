# Steam 상점 자산 업로드 안내

생성: `node scripts/steam-capture.js` → `python scripts/steam_compose.py`

Graphical Assets 탭의 드롭존은 **이미지 크기로 슬롯을 자동 판별**한다.
목록에 없는 크기를 넣으면 `Dimensions provided do not match any known assets` 로 거부된다.

---

## Graphical Assets 탭 — 드롭존에 올려도 되는 것

| 파일 | 크기 | 슬롯 |
|---|---|---|
| `small_capsule.png` | 462×174 | Store · Small Capsule |
| `main_capsule.png` | 1232×706 | Store · Main Capsule |
| `vertical_capsule.png` | 748×896 | Store · Vertical Capsule |
| `page_background.png` | 1438×810 | Store · Page Background |
| `library_capsule.png` | 600×900 | Library · Library Capsule |
| `library_hero.png` | 3840×1240 | Library · Library Hero |
| `library_logo.png` | 1280×442 | Library · Library Logo (투명 PNG) |
| `screenshot_*.png` | 1920×1080 | Screenshot assets (6장) |

## 반드시 개별 슬롯 버튼으로 올릴 것

`header_capsule.png` 와 `library_header.png` 는 **둘 다 920×430** 이라
드롭존이 어느 슬롯인지 구분하지 못한다. 각 슬롯의 업로드 버튼을 직접 사용할 것.

| 파일 | 크기 | 슬롯 |
|---|---|---|
| `header_capsule.png` | 920×430 | Store · Header Capsule |
| `library_header.png` | 920×430 | Library · Library Header |

## Graphical Assets 탭이 아닌 곳

아이콘은 이 탭의 드롭존이 받지 않는다. 전용 아이콘 필드에 올린다.

| 파일 | 크기 | 용도 |
|---|---|---|
| `community_icon.jpg` | 184×184 | App Icon (문서상 JPG 명시) |
| `community_icon.png` | 184×184 | 위 PNG 판본 (JPG가 거부될 때) |
| `client_icon_256.png` | 256×256 | Shortcut Icon |
| `client_icon_512.png` | 512×512 | Shortcut Icon (256 대안, 둘 중 하나만) |
| `client_icon.ico` | 16~256 멀티 | Shortcut Icon (ICO 요구 시) |
| `client_icon_32.png` | 32×32 | 소형 아이콘 필요 시 |

---

## 규칙 메모

- 캡슐에는 **게임명·부제·아트워크만** 넣을 수 있다. 홍보 문구·기능 설명·인용·평점은 금지
  (Graphical Asset Rules). 그래서 태그라인과 "4 / 5 / 6 PLAYERS" 를 뺐다.
- `library_hero.png` 는 **텍스트를 넣을 수 없다.** 배경 아트만 있고 로고는 없다.
  Steam 이 그 위에 `library_logo.png` 를 따로 얹는다.
- `library_logo.png` 는 **투명 PNG**, 로고타입만. 규격이 "1280 wide *and/or* 720 tall" 이므로
  1280×720 캔버스에 여백을 채우지 않고 로고 비율 그대로 1280×442 로 만든다.
- `_src/` 는 합성용 원본(로고·하트 심볼)이다. 업로드 대상이 아니다.
