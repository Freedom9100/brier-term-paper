import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

plt.rcParams["font.family"] = "DejaVu Sans"

x = [50, 60, 70, 80, 90]
y = [48, 54, 58, 61, 64]

fig, ax = plt.subplots(figsize=(7.2, 5.4), dpi=200)
ax.plot([40, 100], [40, 100], linestyle="--", color="#888888", linewidth=1.6,
        label="идеальная калибровка")
ax.plot(x, y, marker="o", color="#1f4e79", linewidth=2.2, markersize=7,
        label="прогнозы участника")

ax.annotate("заявлено 90% —\nсбылось 64%", xy=(90, 64), xytext=(70, 44),
            fontsize=11, color="#1f4e79",
            arrowprops=dict(arrowstyle="->", color="#1f4e79", linewidth=1.3))

ax.set_xlabel("Заявленная уверенность, %", fontsize=12)
ax.set_ylabel("Доля сбывшихся событий, %", fontsize=12)
ax.set_xlim(40, 100); ax.set_ylim(40, 100)
ax.set_xticks(range(40, 101, 10)); ax.set_yticks(range(40, 101, 10))
ax.grid(True, linestyle=":", color="#cccccc")
ax.legend(loc="upper left", fontsize=11, framealpha=1)
ax.set_facecolor("white")
for s in ax.spines.values():
    s.set_color("#555555")
fig.tight_layout()
fig.savefig("../images/1.1-калибровочная-кривая.png", facecolor="white")
print("saved")
