# 상점 자산 업로드 안내

생성: `node scripts/steam-capture.js` → `python scripts/steam_compose.py`

아래 Steam 자산과 itch.io 대표 이미지를 같은 스크립트에서 뽑는다. 두 상점에 같은 게임이
서로 다른 얼굴로 올라가지 않게 하려는 것이다. itch 것만 다시 뽑으려면
`python scripts/steam_compose.py itch` (Steam 자산은 건드리지 않는다).

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

## itch.io

| 파일 | 크기 | 슬롯 |
|---|---|---|
| `itch_cover.png` | 630×500 | Edit game · Cover image |

브라우즈 목록에서 315×250까지 줄어 표시되므로 로고 외 문구는 넣지 않았다.
스크린샷은 위 `screenshot_*.png`(1920×1080)를 그대로 재사용한다.

### 스팀 링크 UTM 규칙

Steamworks 트래픽 리포트에서 유입을 갈라 보기 위한 것이다. 게임 안의 링크는
`game.js`의 `Game.steamStoreUrl()`이 자동으로 붙이고, **itch 페이지처럼 게임 밖에
손으로 쓰는 링크는 아래 표를 따라야** 리포트가 한 축으로 정리된다.

| 파라미터 | 의미 | 값 |
|---|---|---|
| `utm_source` | 트래픽이 실제로 온 곳 | `itch` (itch 페이지·itch 빌드) / `ingame` (스팀 데모·웹 테스트) |
| `utm_medium` | 링크가 놓인 자리 | `page` `devlog` (게임 밖, 손으로) / `wishlist` `copy_link` `twitter` `native` (게임 안, 자동) |
| `utm_campaign` | 맥락 | `demo_launch` (게임 밖) / `level_result` `rank_high_score` `ranker_badge` (게임 안, 자동) |

기준 URL: `https://store.steampowered.com/app/5015250/Hearts_Extreme`

itch 페이지 본문에 넣을 링크:

```
https://store.steampowered.com/app/5015250/Hearts_Extreme/?utm_source=itch&utm_medium=page&utm_campaign=demo_launch
```

`utm_source`를 나누는 이유: itch 빌드의 인게임 위시리스트 버튼도 예전에는 `ingame`으로
나가서, 스팀 데모에서 온 클릭과 한 덩어리로 잡혀 itch가 만든 위시리스트를 분리할 수
없었다. 지금은 `isItchBuild`를 보고 `itch`로 나간다.

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
