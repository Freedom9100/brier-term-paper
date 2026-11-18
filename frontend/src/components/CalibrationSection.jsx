import { SectionTitle } from './SectionTitle';
import { CalibrationChart } from './CalibrationChart';
import { CalibrationTable } from './CalibrationTable';

export function CalibrationSection({ data, count }) {
  return (
    <>
      <SectionTitle title="Калибровка" right={count > 0 ? (
        <span className="text-[13px] text-ink-2">Прогнозов: {count}</span>
      ) : null} />
      {data.length === 0 ? (
        <p className="mt-2 text-sm text-ink-2">Появится после первого разрешённого прогноза.</p>
      ) : (
        <div className="mt-3 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:gap-x-7 lg:items-start">
          <CalibrationChart data={data} width={358} height={300} labelAt={11} labelAbove />
          <div className="mt-3">
            <p className="mb-3 text-sm text-ink-2">Точка сравнивает среднюю вероятность с долей исходов «Да» в том же диапазоне. Размер точки зависит от числа прогнозов.</p>
            <CalibrationTable data={data} />
          </div>
        </div>
      )}
    </>
  );
}
