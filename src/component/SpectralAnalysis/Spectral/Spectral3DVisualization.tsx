import { useState, useMemo, MouseEvent } from "react";

import {
	Paper,
	Typography,
	Box,
	ToggleButtonGroup,
	ToggleButton,
	Slider,
} from "@mui/material";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Text } from "@react-three/drei";
import * as THREE from "three";

import { SpectrumData } from "../../../types";

interface Enhanced3DVisualizationProps {
	data: SpectrumData;
}

interface SpectralSurfaceProps {
	data: SpectrumData;
	viewMode: string;
	heightScale?: number;
}

const ViewModes = {
	SURFACE: "surface",
	WIREFRAME: "wireframe",
	COMBINED: "combined",
} as const;

type ViewModeType = (typeof ViewModes)[keyof typeof ViewModes];

const SpectralSurface = ({
	data,
	viewMode,
	heightScale = 1,
}: SpectralSurfaceProps) => {
	const geometry = useMemo(() => {
		const rowCount = Math.ceil(Math.sqrt(data.rowSpectrum.length));
		const colCount = rowCount;

		const geometry = new THREE.PlaneGeometry(1, 1, rowCount * 2, colCount * 2);
		const positions = geometry.attributes.position.array as Float32Array;
		const colors = new Float32Array(positions.length);

		const maxValue = Math.max(
			...data.rowSpectrum.map((p) => p.value),
			...data.columnSpectrum.map((p) => p.value)
		);

		for (let i = 0; i < positions.length; i += 3) {
			const x = positions[i];
			const y = positions[i + 1];

			const rowIndex = Math.floor((x + 0.5) * (rowCount - 1));
			const colIndex = Math.floor((y + 0.5) * (colCount - 1));

			const rowValue = data.rowSpectrum[rowIndex]?.value || 0;
			const colValue = data.columnSpectrum[colIndex]?.value || 0;

			const z = ((rowValue + colValue) / maxValue) * heightScale;
			positions[i + 2] = z;

			const colorValue = z / heightScale;
			const color = new THREE.Color();
			color.setHSL(0.7 - colorValue * 0.7, 1, 0.5);

			colors[i] = color.r;
			colors[i + 1] = color.g;
			colors[i + 2] = color.b;
		}

		geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
		return geometry;
	}, [data, heightScale]);

	const gridVisible = useMemo(() => viewMode !== ViewModes.SURFACE, [viewMode]);

	return (
		<>
			<mesh rotation={[-Math.PI / 2, 0, 0]}>
				<primitive object={geometry} attach="geometry" />
				<meshPhongMaterial
					vertexColors
					side={THREE.DoubleSide}
					transparent
					opacity={viewMode === ViewModes.WIREFRAME ? 0 : 0.8}
					shininess={50}
				/>
			</mesh>

			{gridVisible && (
				<mesh rotation={[-Math.PI / 2, 0, 0]}>
					<primitive object={geometry} attach="geometry" />
					<meshBasicMaterial
						wireframe
						color="white"
						transparent
						opacity={0.3}
					/>
				</mesh>
			)}

			<gridHelper args={[2, 20, "grey", "grey"]} position={[0, -0.5, 0]} />

			{[
				"Строчный спектр",
				"Столбцовый спектр",
				"Информационная значимость",
			].map((label, index) => (
				<Text
					key={label}
					position={[
						index === 0 ? 1.2 : 0,
						index === 2 ? 0.7 : -0.5,
						index === 1 ? 1.2 : 0,
					]}
					color="black"
					fontSize={0.05}
					anchorX={index === 2 ? "center" : "left"}
					rotation={index === 1 ? [0, Math.PI / 2, 0] : undefined}
				>
					{label}
				</Text>
			))}
		</>
	);
};

export const Enhanced3DVisualization = ({
	data,
}: Enhanced3DVisualizationProps) => {
	const [viewMode, setViewMode] = useState<ViewModeType>(ViewModes.COMBINED);
	const [heightScale, setHeightScale] = useState(1);

	const handleViewModeChange = (
		_: MouseEvent<HTMLElement>,
		newMode: ViewModeType | null
	) => {
		if (newMode !== null) {
			setViewMode(newMode);
		}
	};

	return (
		<Paper sx={{ p: 2 }}>
			<Typography variant="h6" gutterBottom>
				3D визуализация спектров
			</Typography>

			<Box sx={{ mb: 2, display: "flex", gap: 2, alignItems: "center" }}>
				<ToggleButtonGroup
					value={viewMode}
					exclusive
					onChange={handleViewModeChange}
					size="small"
				>
					{Object.entries(ViewModes).map(([key, value]) => (
						<ToggleButton key={key} value={value}>
							{key === "SURFACE"
								? "Поверхность"
								: key === "WIREFRAME"
								? ""
								: "Комбинированный"}
						</ToggleButton>
					))}
				</ToggleButtonGroup>

				<Box sx={{ width: 150 }}>
					<Typography variant="caption">Масштаб высоты</Typography>
					<Slider
						value={heightScale}
						onChange={(_, value) => setHeightScale(value as number)}
						min={0.5}
						max={2}
						step={0.1}
					/>
				</Box>
			</Box>

			<Box
				sx={{
					width: "100%",
					height: 500,
					position: "relative",
					bgcolor: "#f5f5f5",
					borderRadius: 1,
					overflow: "hidden",
				}}
			>
				<Canvas>
					<PerspectiveCamera makeDefault position={[1.5, 1.5, 1.5]} fov={50} />
					<OrbitControls enableDamping dampingFactor={0.05} rotateSpeed={0.5} />

					<ambientLight intensity={0.5} />
					<pointLight position={[10, 10, 10]} intensity={1} />

					<SpectralSurface
						data={data}
						viewMode={viewMode}
						heightScale={heightScale}
					/>
				</Canvas>
			</Box>

			<Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 2 }}>
				<Typography variant="body2">Значение:</Typography>
				<Box
					sx={{
						width: 200,
						height: 20,
						background: "linear-gradient(to right, blue, cyan, yellow, red)",
					}}
				/>
				<Typography variant="body2" sx={{ ml: 1 }}>
					Низкое
				</Typography>
				<Typography variant="body2">Высокое</Typography>
			</Box>

			<Box sx={{ mt: 2, bgcolor: "grey.50", p: 2, borderRadius: 1 }}>
				<Typography variant="body2" color="text.secondary">
					Управление: используйте левую кнопку мыши для вращения, правую для
					перемещения, колесико для масштабирования. Высота и цвет точек
					показывают комбинированную информационную значимость в каждой позиции
					текста.
				</Typography>
			</Box>
		</Paper>
	);
};
