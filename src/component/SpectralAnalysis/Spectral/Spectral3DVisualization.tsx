import { useMemo } from "react";
import Plot from "react-plotly.js";
import { Paper, Typography, Box } from "@mui/material";
import { SpectrumData } from "../../../types";

interface SpectralSurfaceProps {
	data: SpectrumData;
}

export const Enhanced3DVisualization = ({ data }: SpectralSurfaceProps) => {
	const maxValue = useMemo(
		() =>
			Math.max(
				...data.rowSpectrum.map((p) => p.value),
				...data.columnSpectrum.map((p) => p.value)
			),
		[data]
	);

	const generateData = useMemo(() => {
		const size = 101;
		const x: number[][] = Array(size)
			.fill(0)
			.map(() => Array(size).fill(0));
		const y: number[][] = Array(size)
			.fill(0)
			.map(() => Array(size).fill(0));
		const z: number[][] = Array(size)
			.fill(0)
			.map(() => Array(size).fill(0));

		const maxRadius = Math.max(
			2,
			Math.min(4, (data.rowSpectrum.length + data.columnSpectrum.length) / 100)
		);
		const length = maxRadius * 2;
		const angleY = (0 * Math.PI) / 180;
		const angleZ = (100 * Math.PI) / 180;

		const getHourglassRadius = (
			height: number,
			rowIndex: number,
			colIndex: number
		): number => {
			const h = height / (length / 2);
			const minRadius = 0.1;
			const baseRadius =
				maxRadius * (minRadius + (1 - minRadius) * Math.pow(Math.abs(h), 0.8));

			const rowValue = data.rowSpectrum[rowIndex]?.value || 0;
			const colValue = data.columnSpectrum[colIndex]?.value || 0;
			const avgValue = (rowValue + colValue) / 2;

			return baseRadius * (1 + avgValue / (maxValue * 2));
		};

		for (let i = 0; i < size; i++) {
			for (let j = 0; j < size; j++) {
				const rowIndex = Math.floor((i / size) * data.rowSpectrum.length);
				const colIndex = Math.floor((j / size) * data.columnSpectrum.length);

				const theta = (i / (size - 1)) * 2 * Math.PI;
				const l = (j / (size - 1)) * length - length / 2;

				const currentRadius = getHourglassRadius(l, rowIndex, colIndex);

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

		const range = [-length, length];
		return { x, y, z, range } as const;
	}, [data, maxValue]);

	const { x: surfaceX, y: surfaceY, z: surfaceZ, range } = generateData;

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
							showscale: true,
							connectgaps: true,
							hoverongaps: true,
						},
					]}
					layout={{
						autosize: true,
						width: 800,
						height: 600,
						scene: {
							camera: {
								eye: { x: 1.5, y: 1.5, z: 1 },
								up: { x: 0, y: 0, z: 1 },
								center: { x: 0, y: 0, z: 0 },
							},
							aspectratio: { x: 1, y: 1, z: 1 },
							xaxis: { range },
							yaxis: { range },
							zaxis: { range },
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
