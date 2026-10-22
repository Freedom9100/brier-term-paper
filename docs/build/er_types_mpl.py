import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle

# Схема БД для раздела «Данные» технического задания.
# Отличие от er_mpl.py (рисунок 2.1 записки): у каждого поля указан тип
# PostgreSQL, добавлены поля rejection_reason и is_active.
# Типы — те, что создаст Django: id встроенной модели пользователя — integer,
# у остальных таблиц — bigint; timestamptz — дата и время с часовым поясом.

plt.rcParams["font.family"] = "DejaVu Sans"

FS = 9.0
ROW = 0.17
W = 1.95
HEAD = "#dce6f1"

entities = {
 "USER": [("id (PK)", "integer"), ("username", "varchar(150)"), ("email", "varchar(254)"),
          ("password", "varchar(128)"), ("is_staff", "boolean"), ("is_active", "boolean"),
          ("date_joined", "timestamptz")],
 "QUESTION": [("id (PK)", "bigint"), ("author_id (FK)", "integer"),
              ("category_id (FK)", "bigint"), ("title", "varchar(200)"),
              ("description", "text"), ("status", "varchar(20)"),
              ("rejection_reason", "text"), ("closes_at", "timestamptz"),
              ("resolves_at", "timestamptz"), ("outcome", "boolean"),
              ("created_at", "timestamptz")],
 "MODEL_PREDICTION": [("id (PK)", "bigint"), ("question_id (FK)", "bigint"),
                      ("probability", "double precision"), ("model_version", "varchar(50)"),
                      ("created_at", "timestamptz")],
 "FORECAST": [("id (PK)", "bigint"), ("question_id (FK)", "bigint"),
              ("user_id (FK)", "integer"), ("probability", "smallint"),
              ("created_at", "timestamptz"), ("updated_at", "timestamptz")],
 "CATEGORY": [("id (PK)", "bigint"), ("name", "varchar(100)"), ("slug", "varchar(50)")],
 "COMMENT": [("id (PK)", "bigint"), ("question_id (FK)", "bigint"),
             ("user_id (FK)", "integer"), ("body", "text"), ("created_at", "timestamptz")],
 "SCORE": [("id (PK)", "bigint"), ("forecast_id (FK)", "bigint"),
           ("brier_score", "double precision"), ("points", "double precision"),
           ("calculated_at", "timestamptz")],
}
pos = {
 "USER":             (0.03, 5.00),
 "FORECAST":         (0.03, 3.30),
 "SCORE":            (0.03, 1.75),
 "QUESTION":         (2.53, 5.00),
 "CATEGORY":         (2.53, 2.45),
 "MODEL_PREDICTION": (5.03, 5.00),
 "COMMENT":          (5.03, 3.55),
}

fig = plt.figure(figsize=(7.2, 5.15), dpi=400)
ax = fig.add_axes([0, 0, 1, 1])
ax.set_xlim(0, 7.2); ax.set_ylim(0.55, 5.70)
ax.axis("off")
ax.add_patch(Rectangle((0, 0.55), 7.2, 5.15, facecolor="white", edgecolor="none"))

for name, fields in entities.items():
    x, ytop = pos[name]
    h = ROW * (len(fields) + 1)
    ax.add_patch(Rectangle((x, ytop - ROW), W, ROW, facecolor=HEAD,
                           edgecolor="#333333", linewidth=1.0))
    ax.text(x + W / 2, ytop - ROW / 2, name, ha="center", va="center",
            fontsize=FS - 0.5, fontweight="bold")
    for i, (field, field_type) in enumerate(fields):
        yy = ytop - ROW * (i + 2)
        ax.add_patch(Rectangle((x, yy), W, ROW, facecolor="white",
                               edgecolor="#999999", linewidth=0.6))
        ax.text(x + 0.07, yy + ROW / 2, field, ha="left", va="center", fontsize=FS - 1)
        # тип поля — серым справа, как на схеме в образце ТЗ
        ax.text(x + W - 0.07, yy + ROW / 2, field_type, ha="right", va="center",
                fontsize=FS - 1.8, color="#777777")
    ax.add_patch(Rectangle((x, ytop - h), W, h, facecolor="none",
                           edgecolor="#333333", linewidth=1.3))

def link(pts, label, lpos, cards):
    ax.plot([p[0] for p in pts], [p[1] for p in pts], color="#333333", linewidth=1.1)
    ax.text(lpos[0], lpos[1], label, ha="center", va="center", fontsize=FS - 2.2,
            color="#333333", bbox=dict(facecolor="white", edgecolor="none", pad=0.8))
    for cx, cy, t in cards:
        ax.text(cx, cy, t, ha="center", va="center", fontsize=FS - 2.0, color="#333333")

link([(1.98, 4.575), (2.53, 4.575)], "создаёт", (2.255, 4.68),
     [(2.05, 4.50, "1"), (2.46, 4.50, "∞")])
link([(1.00, 3.64), (1.00, 3.30)], "ставит", (1.00, 3.47),
     [(0.91, 3.58, "1"), (0.91, 3.36, "∞")])
link([(1.00, 2.11), (1.00, 1.75)], "даёт", (1.00, 1.93),
     [(0.91, 2.05, "1"), (0.91, 1.81, "1")])
link([(3.505, 2.96), (3.505, 2.45)], "содержит", (3.505, 2.705),
     [(3.415, 2.90, "∞"), (3.415, 2.51, "1")])
link([(4.48, 4.575), (5.03, 4.575)], "имеет", (4.755, 4.68),
     [(4.55, 4.50, "1"), (4.96, 4.50, "1")])
link([(2.53, 3.20), (1.98, 2.875)], "получает", (2.255, 3.04),
     [(2.47, 3.28, "1"), (2.04, 2.80, "∞")])
link([(4.48, 3.20), (5.03, 3.125)], "имеет", (4.755, 3.31),
     [(4.54, 3.10, "1"), (4.96, 3.05, "∞")])
link([(1.00, 5.00), (1.00, 5.45), (7.13, 5.45), (7.13, 2.955), (6.98, 2.955)],
     "пишет", (4.00, 5.57), [(1.09, 5.07, "1"), (7.055, 3.03, "∞")])

fig.savefig("../images/тз-схема-бд.png", facecolor="white")
print("er types ok")
