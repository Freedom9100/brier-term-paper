import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle

plt.rcParams["font.family"] = "DejaVu Sans"

FS = 9.0
ROW = 0.17
W = 1.62
HEAD = "#dce6f1"

entities = {
 "USER": ["id (PK)", "username", "email", "password_hash", "is_staff", "date_joined"],
 "QUESTION": ["id (PK)", "author_id (FK)", "category_id (FK)", "title", "description",
              "status", "closes_at", "resolves_at", "outcome", "created_at"],
 "MODEL_PREDICTION": ["id (PK)", "question_id (FK)", "probability", "model_version", "created_at"],
 "FORECAST": ["id (PK)", "question_id (FK)", "user_id (FK)", "probability", "created_at", "updated_at"],
 "CATEGORY": ["id (PK)", "name", "slug"],
 "COMMENT": ["id (PK)", "question_id (FK)", "user_id (FK)", "body", "created_at"],
 "SCORE": ["id (PK)", "forecast_id (FK)", "brier_score", "points", "calculated_at"],
}
pos = {
 "USER":             (0.03, 5.00),
 "FORECAST":         (0.03, 3.26),
 "SCORE":            (0.03, 1.52),
 "QUESTION":         (2.33, 5.00),
 "CATEGORY":         (2.33, 2.58),
 "MODEL_PREDICTION": (4.63, 5.00),
 "COMMENT":          (4.63, 3.43),
}

fig = plt.figure(figsize=(6.5, 5.40), dpi=400)
ax = fig.add_axes([0, 0, 1, 1])
ax.set_xlim(0, 6.5); ax.set_ylim(0.30, 5.70)
ax.axis("off")
ax.add_patch(Rectangle((0, 0.30), 6.5, 5.40, facecolor="white", edgecolor="none"))

for name, fields in entities.items():
    x, ytop = pos[name]
    h = ROW * (len(fields) + 1)
    ax.add_patch(Rectangle((x, ytop - ROW), W, ROW, facecolor=HEAD,
                           edgecolor="#333333", linewidth=1.0))
    ax.text(x + W / 2, ytop - ROW / 2, name, ha="center", va="center",
            fontsize=FS - 0.5, fontweight="bold")
    for i, f in enumerate(fields):
        yy = ytop - ROW * (i + 2)
        ax.add_patch(Rectangle((x, yy), W, ROW, facecolor="white",
                               edgecolor="#999999", linewidth=0.6))
        ax.text(x + 0.07, yy + ROW / 2, f, ha="left", va="center", fontsize=FS - 1)
    ax.add_patch(Rectangle((x, ytop - h), W, h, facecolor="none",
                           edgecolor="#333333", linewidth=1.3))

def link(pts, label, lpos, cards):
    ax.plot([p[0] for p in pts], [p[1] for p in pts], color="#333333", linewidth=1.1)
    ax.text(lpos[0], lpos[1], label, ha="center", va="center", fontsize=FS - 2.2,
            color="#333333", bbox=dict(facecolor="white", edgecolor="none", pad=0.8))
    for cx, cy, t in cards:
        ax.text(cx, cy, t, ha="center", va="center", fontsize=FS - 2.0, color="#333333")

link([(1.65, 4.40), (2.33, 4.40)], "создаёт", (1.99, 4.52),
     [(1.73, 4.31, "1"), (2.25, 4.31, "∞")])
link([(0.85, 3.81), (0.85, 3.26)], "ставит", (0.85, 3.54),
     [(0.76, 3.74, "1"), (0.76, 3.33, "∞")])
link([(0.85, 2.07), (0.85, 1.52)], "даёт", (0.85, 1.80),
     [(0.76, 2.00, "1"), (0.76, 1.59, "1")])
link([(3.15, 2.58), (3.15, 3.13)], "содержит", (3.15, 2.86),
     [(3.06, 2.65, "1"), (3.06, 3.06, "∞")])
link([(3.95, 4.40), (4.63, 4.40)], "имеет", (4.29, 4.52),
     [(4.03, 4.31, "1"), (4.55, 4.31, "1")])
link([(2.33, 3.40), (1.65, 2.95)], "получает", (1.92, 3.34),
     [(2.28, 3.29, "1"), (1.70, 3.02, "∞")])
link([(3.95, 3.40), (4.63, 3.15)], "имеет", (4.29, 3.40),
     [(4.02, 3.47, "1"), (4.56, 3.07, "∞")])
link([(0.85, 5.00), (0.85, 5.45), (6.40, 5.45), (6.40, 3.00), (6.25, 3.00)],
     "пишет", (3.30, 5.57), [(0.94, 5.07, "1"), (6.31, 3.10, "∞")])

fig.savefig("../images/2.1-схема-бд.png", facecolor="white")
print("er ok")
