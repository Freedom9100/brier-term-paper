import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle, Ellipse, Circle, Polygon

plt.rcParams["font.family"] = "DejaVu Sans"

FS = 9.0
fig = plt.figure(figsize=(6.5, 6.40), dpi=400)
ax = fig.add_axes([0, 0, 1, 1])
ax.set_xlim(0, 6.5); ax.set_ylim(0, 6.40)
ax.axis("off")
ax.add_patch(Rectangle((0, 0), 6.5, 6.40, facecolor="white", edgecolor="none"))

# граница системы
ax.add_patch(Rectangle((1.15, 0.15), 4.20, 6.00, facecolor="none",
                       edgecolor="#333333", linewidth=1.4))
ax.text(3.25, 5.95, "Брайер", ha="center", va="center", fontsize=FS + 1.5, fontweight="bold")

def actor(cx, cy, label):
    ax.add_patch(Circle((cx, cy + 0.15), 0.09, facecolor="white",
                        edgecolor="#111111", linewidth=1.3))
    ax.plot([cx, cx], [cy + 0.06, cy - 0.22], color="#111111", linewidth=1.3)
    ax.plot([cx - 0.15, cx + 0.15], [cy - 0.05, cy - 0.05], color="#111111", linewidth=1.3)
    ax.plot([cx, cx - 0.12], [cy - 0.22, cy - 0.48], color="#111111", linewidth=1.3)
    ax.plot([cx, cx + 0.12], [cy - 0.22, cy - 0.48], color="#111111", linewidth=1.3)
    ax.text(cx, cy - 0.63, label, ha="center", va="center",
            fontsize=FS + 0.5, fontweight="bold")

def usecase(cx, cy, rx, lines):
    ax.add_patch(Ellipse((cx, cy), 2 * rx, 0.50, facecolor="white",
                         edgecolor="#333333", linewidth=1.2))
    if len(lines) == 1:
        ax.text(cx, cy, lines[0], ha="center", va="center", fontsize=FS)
    else:
        ax.text(cx, cy + 0.085, lines[0], ha="center", va="center", fontsize=FS)
        ax.text(cx, cy - 0.085, lines[1], ha="center", va="center", fontsize=FS)

LCX, LRX = 2.28, 0.98
RCX, RRX = 4.38, 0.88

guest = [(5.55, ["Просмотр списка", "вопросов"]),
         (4.97, ["Просмотр страницы", "вопроса"]),
         (4.39, ["Просмотр рейтинга", "участников"]),
         (3.81, ["Регистрация и вход"])]
user = [(3.05, ["Создание вопроса"]),
        (2.47, ["Постановка и", "изменение прогноза"]),
        (1.89, ["Комментирование", "вопроса"]),
        (1.31, ["Просмотр своей", "калибровки"]),
        (0.73, ["Просмотр истории", "прогнозов"])]
admin = [(5.30, ["Модерация", "вопросов"]),
         (4.40, ["Разрешение", "события"]),
         (3.50, ["Пересчёт очков", "и рейтинга"]),
         (2.60, ["Управление", "пользователями"]),
         (1.70, ["Управление", "категориями"]),
         (0.80, ["Переобучение", "модели"])]

for y, t in guest + user: usecase(LCX, y, LRX, t)
for y, t in admin:        usecase(RCX, y, RRX, t)

actor(0.55, 4.90, "Гость")
actor(0.55, 1.90, "Пользователь")
actor(5.78, 3.05, "Администратор")

def link(x1, y1, x2, y2):
    ax.plot([x1, x2], [y1, y2], color="#333333", linewidth=0.9)

for y, _ in guest: link(0.73, 4.90, LCX - LRX, y)
for y, _ in user:  link(0.73, 1.90, LCX - LRX, y)
for y, _ in admin: link(5.60, 3.05, RCX + RRX, y)

# обобщение: пользователь обладает всеми возможностями гостя
ax.plot([0.55, 0.55], [2.14, 4.06], color="#333333", linewidth=1.0)
ax.add_patch(Polygon([[0.55, 4.16], [0.48, 3.98], [0.62, 3.98]],
                     closed=True, facecolor="white", edgecolor="#333333", linewidth=1.0))

fig.savefig("../images/2.2-варианты-использования.png", facecolor="white")
print("uc ok")
