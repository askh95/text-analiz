// @ts-nocheck
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

	const colorscale = [
		[0, "rgb(0,0,139)"],
		[0.1, "rgb(0,0,255)"],
		[0.2, "rgb(30,144,255)"],
		[0.3, "rgb(0,255,255)"],
		[0.4, "rgb(0,255,128)"],
		[0.5, "rgb(0,255,0)"],
		[0.6, "rgb(128,255,0)"],
		[0.7, "rgb(255,255,0)"],
		[0.8, "rgb(255,128,0)"],
		[0.9, "rgb(255,0,0)"],
		[1.0, "rgb(139,0,0)"],
	];

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
		const colors: number[][] = Array(size)
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
		): { radius: number; intensity: number } => {
			const h = height / (length / 2);
			const minRadius = 0.1;
			const baseRadius =
				maxRadius * (minRadius + (1 - minRadius) * Math.pow(Math.abs(h), 0.8));

			const rowValue = data.rowSpectrum[rowIndex]?.value || 0;
			const colValue = data.columnSpectrum[colIndex]?.value || 0;
			const avgValue = (rowValue + colValue) / 2;

			const intensity = avgValue / maxValue;

			return {
				radius: baseRadius * (1 + avgValue / (maxValue * 2)),
				intensity: intensity,
			};
		};

		for (let i = 0; i < size; i++) {
			for (let j = 0; j < size; j++) {
				const rowIndex = Math.floor((i / size) * data.rowSpectrum.length);
				const colIndex = Math.floor((j / size) * data.columnSpectrum.length);

				const theta = (i / (size - 1)) * 2 * Math.PI;
				const l = (j / (size - 1)) * length - length / 2;

				const { radius: currentRadius, intensity } = getHourglassRadius(
					l,
					rowIndex,
					colIndex
				);
				colors[i][j] = intensity;

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
		return { x, y, z, colors, range } as const;
	}, [data, maxValue]);

	const { x: surfaceX, y: surfaceY, z: surfaceZ, colors, range } = generateData;

	return (
		<Paper
			sx={{
				p: 1,
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Typography variant="h6" gutterBottom>
				3D нейролингвистический информационный образ источника текстовой
				информации
			</Typography>

			<Plot
				data={[
					{
						type: "surface",
						x: surfaceX,
						y: surfaceY,
						z: surfaceZ,
						colorscale: colorscale,
						intensity: colors,
						showscale: false,
						connectgaps: true,
						hoverongaps: true,
						colorbar: {
							titlefont: { size: 14 },
							tickfont: { size: 12 },
							len: 0.75,
						},
						lighting: {
							ambient: 0.6,
							diffuse: 0.8,
							fresnel: 0.2,
							specular: 0.5,
							roughness: 0.5,
						},
						contours: {
							x: { show: false },
							y: { show: false },
							z: { show: true, usecolormap: true, project: { z: false } },
						},
					},
				]}
				layout={{
					autosize: true,
					width: "100%",
					height: 900,
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
			/>
		</Paper>
	);
};
