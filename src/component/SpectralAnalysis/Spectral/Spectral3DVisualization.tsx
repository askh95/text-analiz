// @ts-nocheck
import { FC, useMemo } from "react";
import Plot from "react-plotly.js";
import { Paper, Typography, Box } from "@mui/material";
import { SpectrumData } from "../../../types";

interface SpectralSurfaceProps {
	data: SpectrumData;
}

export const Enhanced3DVisualization: FC<SpectralSurfaceProps> = ({ data }) => {
	const maxValue = useMemo(
		() =>
			Math.max(
				...data.rowSpectrum.map((p) => p.value),
				...data.columnSpectrum.map((p) => p.value)
			),
		[data]
	);

	const generateData = useMemo(() => {
		const size = 100;
		const x = Array(size)
			.fill(0)
			.map(() => Array(size).fill(0));
		const y = Array(size)
			.fill(0)
			.map(() => Array(size).fill(0));
		const z = Array(size)
			.fill(0)
			.map(() => Array(size).fill(0));

		const maxRadius = 4;
		const length = 10;
		const angleY = (0 * Math.PI) / 180;
		const angleZ = (100 * Math.PI) / 180;

		const getSpectralValue = (theta: number, l: number) => {
			const rowPos =
				(Math.cos(theta) + 1) * (data.rowSpectrum.length - 1) * 0.5;
			const colPos = (l / 5 + 1) * (data.columnSpectrum.length - 1) * 0.5;

			const rowIndex = Math.floor(rowPos);
			const colIndex = Math.floor(colPos);

			const r1 = data.rowSpectrum[rowIndex]?.value || 0;
			const r2 =
				data.rowSpectrum[Math.min(rowIndex + 1, data.rowSpectrum.length - 1)]
					?.value || 0;
			const c1 = data.columnSpectrum[colIndex]?.value || 0;
			const c2 =
				data.columnSpectrum[
					Math.min(colIndex + 1, data.columnSpectrum.length - 1)
				]?.value || 0;

			const rowValue = r1 + (r2 - r1) * (rowPos - rowIndex);
			const colValue = c1 + (c2 - c1) * (colPos - colIndex);

			return (rowValue + colValue) / (2 * maxValue);
		};

		const getHourglassRadius = (height: number) => {
			const h = height / (length / 2);
			return maxRadius * (0.3 + Math.abs(h));
		};

		for (let i = 0; i < size; i++) {
			for (let j = 0; j < size; j++) {
				const theta = (i / size) * 2 * Math.PI;
				const l = (j / size) * length - length / 2;

				const spectralValue = getSpectralValue(theta, l);
				const currentRadius = getHourglassRadius(l) * spectralValue;

				const baseX = l;
				const baseY = currentRadius * Math.cos(theta);
				const baseZ = currentRadius * Math.sin(theta);

				const tempX = baseX * Math.cos(angleY) + baseZ * Math.sin(angleY);
				const tempY = baseY;
				const tempZ = -baseX * Math.sin(angleY) + baseZ * Math.cos(angleY);

				x[i][j] = tempX * Math.cos(angleZ) - tempY * Math.sin(angleZ);
				y[i][j] = tempX * Math.sin(angleZ) + tempY * Math.cos(angleZ);
				z[i][j] = tempZ;
			}
		}

		return [x, y, z];
	}, [data, maxValue]);

	const [surfaceX, surfaceY, surfaceZ] = generateData;

	return (
		<Paper sx={{ p: 2 }}>
			<Typography variant="h6" gutterBottom>
				3D нейролингвистический информационный образ источника текстовой
				информации
			</Typography>

			<Box
				sx={{
					width: "100%",
					height: 600,
					bgcolor: "#fafafa",
					borderRadius: 1,
					overflow: "hidden",
				}}
			>
				<Plot
					data={[
						{
							type: "surface",
							x: surfaceX,
							y: surfaceY,
							z: surfaceZ,
							colorscale: "Jet",
							contours: {
								z: {
									show: true,
									usecolormap: true,
									highlightcolor: "#42f462",
								},
							},
						},
					]}
					layout={{
						title: "Hourglass Surface",
						autosize: true,
						width: 800,
						height: 600,
						scene: {
							camera: {
								eye: { x: 1.5, y: 1.5, z: 1 },
								up: { x: 0, y: 0, z: 1 },
							},
							aspectratio: { x: 1, y: 1, z: 1 },
							xaxis: { range: [-8, 8] },
							yaxis: { range: [-8, 8] },
							zaxis: { range: [-8, 8] },
						},
					}}
					useResizeHandler={true}
					style={{ width: "100%", height: "100%" }}
				/>
			</Box>

			<Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
				Управление: используйте левую кнопку мыши для вращения, правую для
				перемещения, колесико для масштабирования.
			</Typography>
		</Paper>
	);
};
