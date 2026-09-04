import os
import subprocess
import sys

# Paths
workspace_dir = r"c:\dev\hwantasticgames"
html_path = os.path.join(workspace_dir, "scratch", "action_plan.html")
pdf_path = os.path.join(workspace_dir, "Hearts_Extreme_Playtest_Action_Plan.pdf")

html_content = """<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>Hearts Extreme - 플레이테스트 & 위시리스트 전환 개선 액션 플랜</title>
<style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&family=Outfit:wght@600;700;800&display=swap');

    @page {
        size: A4;
        margin: 15mm 15mm 15mm 15mm;
    }

    * {
        box-sizing: border-box;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }

    body {
        font-family: 'Noto Sans KR', 'Segoe UI', sans-serif;
        color: #1e293b;
        background-color: #ffffff;
        margin: 0;
        padding: 0;
        font-size: 10.5pt;
        line-height: 1.6;
    }

    .header {
        background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
        color: #ffffff;
        padding: 24px 28px;
        border-radius: 12px;
        margin-bottom: 24px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .header-subtitle {
        font-family: 'Outfit', sans-serif;
        color: #818cf8;
        font-size: 11pt;
        font-weight: 700;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        margin-bottom: 4px;
    }

    .header-title {
        font-size: 18pt;
        font-weight: 900;
        margin: 0 0 8px 0;
        color: #ffffff;
    }

    .header-meta {
        font-size: 9pt;
        color: #94a3b8;
        display: flex;
        gap: 16px;
    }

    .section {
        margin-bottom: 22px;
        page-break-inside: avoid;
    }

    .section-title {
        font-size: 13pt;
        font-weight: 700;
        color: #0f172a;
        border-bottom: 2px solid #e2e8f0;
        padding-bottom: 6px;
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .section-title span.badge {
        background: #4f46e5;
        color: white;
        font-size: 9pt;
        padding: 2px 8px;
        border-radius: 12px;
        font-weight: 500;
    }

    .card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-left: 4px solid #4f46e5;
        border-radius: 8px;
        padding: 14px 16px;
        margin-bottom: 12px;
    }

    .card.alert {
        background: #fef2f2;
        border-color: #fca5a5;
        border-left-color: #ef4444;
    }

    .card-title {
        font-weight: 700;
        font-size: 11pt;
        color: #1e1b4b;
        margin-bottom: 6px;
    }

    .card.alert .card-title {
        color: #991b1b;
    }

    ul, ol {
        margin: 0;
        padding-left: 20px;
    }

    li {
        margin-bottom: 6px;
    }

    .grid-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 8px;
        font-size: 9.5pt;
    }

    th {
        background: #475569;
        color: #ffffff;
        text-align: left;
        padding: 8px 12px;
        font-weight: 600;
    }

    td {
        padding: 8px 12px;
        border-bottom: 1px solid #e2e8f0;
    }

    tr:nth-child(even) td {
        background-color: #f8fafc;
    }

    .tag {
        display: inline-block;
        font-size: 8pt;
        font-weight: 700;
        padding: 2px 6px;
        border-radius: 4px;
        background: #e2e8f0;
        color: #334155;
    }

    .tag.primary { background: #e0e7ff; color: #3730a3; }
    .tag.success { background: #dcfce7; color: #166534; }

    .action-steps {
        background: #f0fdf4;
        border: 1px solid #bbf7d0;
        border-radius: 8px;
        padding: 16px;
    }

    .action-steps ol {
        padding-left: 20px;
    }

    .action-steps li {
        font-weight: 600;
        color: #14532d;
        margin-bottom: 8px;
    }

    .action-steps li span {
        font-weight: 400;
        color: #166534;
        display: block;
        font-size: 9.5pt;
    }
</style>
</head>
<body>

<div class="header">
    <div class="header-subtitle">Hearts Extreme — Marketing & Playtest Strategy</div>
    <div class="header-title">플레이테스트 모집 & 위시리스트 전환 개선 액션 플랜</div>
    <div class="header-meta">
        <span>작성일: 2026-08-08</span>
        <span>프로젝트: Hearts Extreme</span>
        <span>목적: 모집 마찰 제거 및 글로벌 홍보 최적화</span>
    </div>
</div>

<div class="section">
    <div class="section-title"><span class="badge">진단</span> 1. 문제 원인 분석 (조회수 대비 위시리스트 0건)</div>
    <div class="card alert">
        <div class="card-title">🚨 주요 원인: 게임의 가치가 아닌 '신청 방식의 심리적 마찰(Friction)'</div>
        <div>조회수가 150회 이상 나왔음에도 위시리스트 전환이 없었던 것은 게임의 재미 부족이 아니라 <strong>신청 절차(디스코드 가입, 스팀키 수령, 피드백 제출 노동)의 높낮이</strong>와 <strong>텍스트 중심 포지셔닝</strong> 때문입니다.</div>
    </div>
</div>

<div class="section">
    <div class="section-title"><span class="badge">전략</span> 2. 모집 방식(Friction) 획기적 개편 전략</div>
    <div class="card">
        <div class="card-title">🎮 ① itch.io WebGL 브라우저 데모 (무설치 30초 플레이) <span class="tag primary">최우선 권장</span></div>
        <ul>
            <li>스팀 키 신청/승인 절차 없이, <strong>링크 클릭 1번에 브라우저에서 즉시 실행</strong> 가능한 구조 구축.</li>
            <li>데모 플레이 종료 직후 <em>"재밌으셨나요? 스팀 위시리스트 추가하기"</em> 링크/버튼 배치로 전환율 극대화.</li>
        </ul>
    </div>

    <div class="card">
        <div class="card-title">🔑 ② 스팀 플레이테스트(Steam Playtest) '즉시 승인' 활성화</div>
        <ul>
            <li>상점 페이지의 <strong>[참여 요청 (Request Access)]</strong> 버튼을 활성화.</li>
            <li><strong>Instant Access (즉시 승인)</strong>으로 설정해 클릭 즉시 유저 라이브러리에 설치 및 실행되도록 설정.</li>
        </ul>
    </div>

    <div class="card">
        <div class="card-title">💡 ③ 포지셔닝 & 홍보 문구 전환</div>
        <ul>
            <li><strong style="color: #c2410c;">❌ 기존 (부담감 ↑):</strong> "Hearts Extreme 테스터를 모집합니다. 피드백을 주세요."</li>
            <li><strong style="color: #15803d;">⭕ 개편 (도전의식 ↑):</strong> "운 요소 0%, 100% 정보 공개 트릭테이킹 퍼즐입니다. 이 3개 스테이지 깨보실 분? (무설치 브라우저 즉시 실행)"</li>
        </ul>
    </div>
</div>

<div class="section">
    <div class="section-title"><span class="badge">콘텐츠</span> 3. 홍보물 및 시각 자료 최적화</div>
    <div class="grid-2">
        <div class="card">
            <div class="card-title">🎬 5~10초 핵심 GIF / 숏폼</div>
            <div>텍스트 중심의 설명글 대신, 카드를 내고 규칙에 따라 명쾌하게 퍼즐을 해결하는 절정의 순간을 담은 짧은 GIF/영상 활용.</div>
        </div>
        <div class="card">
            <div class="card-title">📖 개발 스토리형 소통</div>
            <div>단순 홍보글이 아닌 "완벽한 정보 공개 트릭테이킹 퍼즐을 디자인하며 겪은 시행착오" 개발일지 형식으로 친근하게 접근.</div>
        </div>
    </div>
</div>

<div class="section">
    <div class="section-title"><span class="badge">타겟</span> 4. 레딧(Reddit) 진출 전 글로벌 소규모 커뮤니티</div>
    <table>
        <thead>
            <tr>
                <th>국가</th>
                <th>주요 타겟 커뮤니티</th>
                <th>특징 및 활용 방안</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>🇯🇵 일본</strong></td>
                <td>
                    • Bodoge-ma (ボドゲーマ)<br>
                    • Note.com / X (인디게임 태그)<br>
                    • asobu 디스코드
                </td>
                <td>트릭테이킹 및 인디 카드 게임 팬층 두터움. 무설치 웹 데모 링크와 함께 짤막한 소개글 공유.</td>
            </tr>
            <tr>
                <td><strong>🇩🇪 독일</strong></td>
                <td>
                    • unknowns.de (최대 포럼)<br>
                    • BrettspielWelt (BSW)<br>
                    • Oyle Community
                </td>
                <td>세계 최대 보드게임 시장. 게이머 포럼 내 인디 프로젝트/프로토타입 소개 코너 활용.</td>
            </tr>
            <tr>
                <td><strong>🇫🇷 프랑스</strong></td>
                <td>
                    • Cwowd (Protoland 게시판)<br>
                    • Dragons Nocturnes<br>
                    • Reddit r/jeudeplateau
                </td>
                <td>독창적인 인디 시스템 선호. 개발자 피드백 요청 게시판(Protoland)에 데모 등록.</td>
            </tr>
        </tbody>
    </table>
</div>

<div class="section" style="page-break-inside: avoid;">
    <div class="section-title"><span class="badge">실행</span> 5. 순차적 실행 단계 (Action Plan)</div>
    <div class="action-steps">
        <ol>
            <li>
                1단계: itch.io WebGL 웹 데모 구축
                <span>- 튜토리얼 1~2개 + 대표 퍼즐 3개를 담아 무설치 웹 플레이 가능하도록 업로드.</span>
            </li>
            <li>
                2단계: 5~10초 핵심 GIF & 타겟팅 문구 작성
                <span>- 플레이 순간의 쾌감을 전달하는 미디어 및 "무설치 퍼즐 도전" 문구 준비.</span>
            </li>
            <li>
                3단계: 타겟 커뮤니티 소규모 테스트 및 피드백 수집
                <span>- 일본, 독일, 프랑스 및 국내 커뮤니티에 순차 게시 후 반응 및 전환율 검증.</span>
            </li>
        </ol>
    </div>
</div>

</body>
</html>
"""

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"HTML generated at: {html_path}")

# Check Edge path
edge_paths = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
]

edge_exe = None
for p in edge_paths:
    if os.path.exists(p):
        edge_exe = p
        break

if not edge_exe:
    print("Error: Microsoft Edge executable not found.")
    sys.exit(1)

cmd = [
    edge_exe,
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={pdf_path}",
    f"file:///{html_path}"
]

print("Running command:", " ".join(cmd))
res = subprocess.run(cmd, capture_output=True, text=True)
print("Return code:", res.returncode)

if os.path.exists(pdf_path):
    print(f"PDF successfully created: {pdf_path} (Size: {os.path.getsize(pdf_path)} bytes)")
else:
    print("Failed to create PDF. Standard output / error:")
    print(res.stdout)
    print(res.stderr)
