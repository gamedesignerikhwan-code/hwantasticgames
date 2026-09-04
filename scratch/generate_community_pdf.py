from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
import os

output_path = os.path.join(os.path.dirname(__file__), "playtest_community_guide.pdf")

doc = SimpleDocTemplate(
    output_path,
    pagesize=A4,
    rightMargin=25*mm, leftMargin=25*mm,
    topMargin=20*mm, bottomMargin=20*mm
)

styles = getSampleStyleSheet()

# Custom styles
title_style = ParagraphStyle(
    'CustomTitle', parent=styles['Title'],
    fontSize=20, spaceAfter=6, textColor=colors.HexColor('#1a1a2e'),
    fontName='Helvetica-Bold'
)
subtitle_style = ParagraphStyle(
    'Subtitle', parent=styles['Normal'],
    fontSize=10, spaceAfter=16, textColor=colors.HexColor('#666666'),
    alignment=TA_CENTER
)
section_style = ParagraphStyle(
    'Section', parent=styles['Heading2'],
    fontSize=14, spaceBefore=18, spaceAfter=8,
    textColor=colors.HexColor('#2d3436'),
    fontName='Helvetica-Bold'
)
subsection_style = ParagraphStyle(
    'Subsection', parent=styles['Heading3'],
    fontSize=11, spaceBefore=12, spaceAfter=6,
    textColor=colors.HexColor('#0984e3'),
    fontName='Helvetica-Bold'
)
body_style = ParagraphStyle(
    'Body', parent=styles['Normal'],
    fontSize=9, spaceAfter=6, leading=13,
    textColor=colors.HexColor('#2d3436')
)
note_style = ParagraphStyle(
    'Note', parent=styles['Normal'],
    fontSize=8.5, spaceAfter=8, leading=12,
    textColor=colors.HexColor('#e17055'),
    fontName='Helvetica-Oblique'
)
strategy_style = ParagraphStyle(
    'Strategy', parent=styles['Normal'],
    fontSize=9, spaceAfter=4, leading=13,
    textColor=colors.HexColor('#2d3436'),
    leftIndent=12
)

elements = []

# Title
elements.append(Paragraph("Hearts Extreme — Playtest Community Guide", title_style))
elements.append(Paragraph("Recommended platforms &amp; forums for playtester recruitment", subtitle_style))
elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#dfe6e9')))
elements.append(Spacer(1, 8))

# ── BGG Section ──
elements.append(Paragraph("1. BoardGameGeek (BGG)", section_style))
elements.append(Paragraph(
    "BGG is ideal for reaching board gamers who already understand trick-taking mechanics. "
    "Hearts Extreme's board game roots make this a natural fit.",
    body_style
))

bgg_data = [
    ["Forum", "Threads / Posts", "Purpose", "Priority"],
    ["Seeking Playtesters", "3.3K / 13K", "Tester recruitment post (Post 1)", "★★★ Top"],
    ["Works in Progress", "11K / 168K", "Dev diary / updates (Post 2)", "★★★ High"],
    ["Board Game Design", "24K / 313K", "Mechanic discussion (indirect)", "★★ Medium"],
]

bgg_table = Table(bgg_data, colWidths=[110, 80, 170, 70])
bgg_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2d3436')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
    ('FONTSIZE', (0, 0), (-1, -1), 8.5),
    ('ALIGN', (1, 0), (1, -1), 'CENTER'),
    ('ALIGN', (3, 0), (3, -1), 'CENTER'),
    ('BACKGROUND', (0, 1), (-1, 1), colors.HexColor('#dff9fb')),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#f5f6fa')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.HexColor('#f5f6fa')),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#b2bec3')),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
]))
elements.append(bgg_table)
elements.append(Spacer(1, 4))
elements.append(Paragraph(
    "⚠ Note: Seeking Playtesters is primarily for physical board game prototypes. "
    "Emphasize that this is a \"PC game by a board game designer, based on trick-taking\" to feel natural.",
    note_style
))

# ── Reddit Section ──
elements.append(Paragraph("2. Reddit", section_style))
elements.append(Paragraph(
    "Reddit offers the largest PC gaming audience. These subreddits are the most relevant for Hearts Extreme:",
    body_style
))

reddit_data = [
    ["Subreddit", "Subscribers", "Purpose", "Priority"],
    ["r/playmygame", "~70K", "Tester recruitment — most direct match", "★★★ Top"],
    ["r/indiegames", "~200K+", "Indie game showcase, promo allowed", "★★★ High"],
    ["r/IndieDev", "~100K+", "Dev diary sharing, community feedback", "★★ Medium"],
    ["r/cardgames", "~30K", "Card game enthusiast audience", "★★ Medium"],
    ["r/boardgames", "~4M", "Board gamer crossover audience", "★★ Medium"],
    ["r/SteamDeck", "Large", "Solo card puzzle = great Deck fit", "★ Optional"],
]

reddit_table = Table(reddit_data, colWidths=[95, 70, 195, 70])
reddit_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#e74c3c')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
    ('FONTSIZE', (0, 0), (-1, -1), 8.5),
    ('ALIGN', (1, 0), (1, -1), 'CENTER'),
    ('ALIGN', (3, 0), (3, -1), 'CENTER'),
    ('BACKGROUND', (0, 1), (-1, 1), colors.HexColor('#ffeaa7')),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#f5f6fa')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.HexColor('#f5f6fa')),
    ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#f5f6fa')),
    ('BACKGROUND', (0, 5), (-1, 5), colors.HexColor('#f5f6fa')),
    ('BACKGROUND', (0, 6), (-1, 6), colors.HexColor('#f5f6fa')),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#b2bec3')),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
]))
elements.append(reddit_table)
elements.append(Spacer(1, 4))
elements.append(Paragraph(
    "⚠ Note: r/boardgames has strict self-promotion rules. Check subreddit rules before posting.",
    note_style
))

# ── Discord Section ──
elements.append(Paragraph("3. Discord Servers", section_style))

discord_data = [
    ["Server / Type", "How to Find", "Purpose"],
    ["Indie Game Developers", "Search Discord server directories", "Large indie dev community, testing channels"],
    ["Playtesting servers", "Search \"playtest\" on Disboard.org", "Dedicated playtesting communities"],
    ["Card Game communities", "Search \"trick-taking\" or \"card game\"", "Niche card game enthusiast groups"],
]

discord_table = Table(discord_data, colWidths=[130, 155, 145])
discord_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#7289da')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
    ('FONTSIZE', (0, 0), (-1, -1), 8.5),
    ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f5f6fa')),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#b2bec3')),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
]))
elements.append(discord_table)

# ── Other Platforms Section ──
elements.append(Paragraph("4. Other Platforms", section_style))

other_data = [
    ["Platform", "URL", "Purpose"],
    ["Steam Community Hub", "store.steampowered.com", "Post dev updates on your own game's forum"],
    ["IndieDB", "indiedb.com", "Indie game database — dev diary + tester recruitment"],
    ["itch.io Community", "itch.io", "Indie game community, devlogs"],
    ["Twitter/X #IndieGameDev", "twitter.com", "Hashtag networking with indie devs & players"],
]

other_table = Table(other_data, colWidths=[120, 140, 170])
other_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#636e72')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
    ('FONTSIZE', (0, 0), (-1, -1), 8.5),
    ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f5f6fa')),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#b2bec3')),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
]))
elements.append(other_table)

# ── Strategy Section ──
elements.append(Spacer(1, 6))
elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#dfe6e9')))
elements.append(Paragraph("Recommended Posting Strategy", section_style))
elements.append(Paragraph(
    "Target both <b>board gamers</b> (who understand trick-taking) and <b>PC gamers</b> (who play indie games) simultaneously:",
    body_style
))
elements.append(Spacer(1, 4))

elements.append(Paragraph("① <b>BGG Seeking Playtesters</b> + <b>Works in Progress</b> → Board gamer audience", strategy_style))
elements.append(Paragraph("② <b>Reddit r/playmygame</b> → PC gamer tester recruitment (most effective for Steam games)", strategy_style))
elements.append(Paragraph("③ <b>Reddit r/cardgames</b> + <b>r/indiegames</b> → Card game & indie game enthusiasts", strategy_style))
elements.append(Paragraph("④ <b>Discord playtesting servers</b> → Active, engaged testers who give detailed feedback", strategy_style))
elements.append(Paragraph("⑤ <b>Twitter/X #IndieGameDev</b> → Ongoing visibility & community building", strategy_style))

elements.append(Spacer(1, 12))
elements.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#dfe6e9')))
elements.append(Spacer(1, 4))

footer_style = ParagraphStyle(
    'Footer', parent=styles['Normal'],
    fontSize=8, textColor=colors.HexColor('#b2bec3'),
    alignment=TA_CENTER
)
elements.append(Paragraph("Hearts Extreme — Hwantastic Games | August 2026", footer_style))

doc.build(elements)
print(f"PDF saved to: {output_path}")
