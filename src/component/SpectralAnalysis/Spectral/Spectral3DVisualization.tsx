import { useState, useMemo } from "react";
import { Paper, Typography, Box, Slider } from "@mui/material";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { SpectrumData } from "../../../types";

interface Enhanced3DVisualizationProps {
	data: SpectrumData;
}

interface SpectralSurfaceProps {
	data: SpectrumData;
	heightScale?: number;
}

const SpectralSurface = ({ data, heightScale = 1 }: SpectralSurfaceProps) => {
	const geometry = useMemo(() => {
		// Увеличиваем разрешение для более плавной поверхности
		const resolution = 150;
		const geometry = new THREE.PlaneGeometry(2, 2, resolution, resolution);
		const positions = geometry.attributes.position.array as Float32Array;
		const colors = new Float32Array(positions.length);

		const maxValue = Math.max(
			...data.rowSpectrum.map((p) => p.value),
			...data.columnSpectrum.map((p) => p.value)
		);

		// Функция для создания радиального градиента
		const createRadialValue = (x: number, y: number) => {
			const distance = Math.sqrt(x * x + y * y);
			return Math.max(0, 1 - distance * 1.2);
		};

		// Функция для интерполяции спектральных данных
		const getSpectralValue = (x: number, y: number) => {
			const rowPos = (x + 1) * (data.rowSpectrum.length - 1) * 0.5;
			const colPos = (y + 1) * (data.columnSpectrum.length - 1) * 0.5;

			const rowIndex = Math.floor(rowPos);
			const colIndex = Math.floor(colPos);

			const rowFrac = rowPos - rowIndex;
			const colFrac = colPos - colIndex;

			// Кубическая интерполяция для еще более плавного перехода
			const cubic = (t: number) => t * t * (3 - 2 * t);

			const r1 = data.rowSpectrum[rowIndex]?.value || 0;
			const r2 =
				data.rowSpectrum[Math.min(rowIndex + 1, data.rowSpectrum.length - 1)]
					?.value || 0;
			const c1 = data.columnSpectrum[colIndex]?.value || 0;
			const c2 =
				data.columnSpectrum[
					Math.min(colIndex + 1, data.columnSpectrum.length - 1)
				]?.value || 0;

			const rowValue = r1 + (r2 - r1) * cubic(rowFrac);
			const colValue = c1 + (c2 - c1) * cubic(colFrac);

			return (rowValue + colValue) / (2 * maxValue);
		};

		for (let i = 0; i < positions.length; i += 3) {
			const x = positions[i];
			const y = positions[i + 1];

			// Комбинируем радиальный градиент со спектральными данными
			const radialFactor = createRadialValue(x, y);
			const spectralValue = getSpectralValue(x, y);
			const combinedValue = spectralValue * radialFactor;

			// Применяем нелинейное преобразование для более выраженного эффекта
			const heightValue = Math.pow(combinedValue, 0.7) * heightScale;
			positions[i + 2] = heightValue;

			// Создаем градиент цветов как на изображении
			const color = new THREE.Color();
			const hue =
				combinedValue < 0.3
					? 0.6 - combinedValue * 0.5 // синий к голубому
					: combinedValue < 0.6
					? 0.35 - (combinedValue - 0.3) * 0.5 // голубой к желтому
					: 0.15 - (combinedValue - 0.6) * 0.15; // желтый к красному

			const saturation = 0.8 + combinedValue * 0.2;
			const lightness = 0.3 + combinedValue * 0.4;

			color.setHSL(hue, saturation, lightness);
			colors[i] = color.r;
			colors[i + 1] = color.g;
			colors[i + 2] = color.b;
		}

		geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
		geometry.computeVertexNormals();
		return geometry;
	}, [data, heightScale]);

	return (
		<>
			<mesh rotation={[-Math.PI / 2, 0, 0]}>
				<primitive object={geometry} attach="geometry" />
				<meshPhongMaterial
					vertexColors
					side={THREE.DoubleSide}
					transparent
					opacity={0.95}
					shininess={100}
					specular={new THREE.Color(0x666666)}
				/>
			</mesh>

			<ambientLight intensity={0.5} />
			<pointLight position={[5, 8, 5]} intensity={0.8} />
			<pointLight position={[-5, 3, -5]} intensity={0.6} />
			<hemisphereLight
				args={["#ffffff", "#bbbbff", 0.6]}
				position={[0, 1, 0]}
			/>
		</>
	);
};

export const Enhanced3DVisualization = ({
	data,
}: Enhanced3DVisualizationProps) => {
	const [heightScale, setHeightScale] = useState(1.5);

	return (
		<Paper sx={{ p: 2 }}>
			<Typography variant="h6" gutterBottom>
				3D визуализация спектров
			</Typography>

			<Box sx={{ mb: 2 }}>
				<Box sx={{ width: 200 }}>
					<Typography variant="caption">Масштаб высоты</Typography>
					<Slider
						value={heightScale}
						onChange={(_, value) => setHeightScale(value as number)}
						min={0.5}
						max={2.5}
						step={0.1}
					/>
				</Box>
			</Box>

			<Box
				sx={{
					width: "100%",
					height: 600,
					position: "relative",
					bgcolor: "#fafafa",
					borderRadius: 1,
					overflow: "hidden",
				}}
			>
				<Canvas>
					<PerspectiveCamera
						makeDefault
						position={[2, 2, 2]}
						fov={45}
						near={0.1}
						far={1000}
					/>
					<OrbitControls
						enableDamping
						dampingFactor={0.07}
						rotateSpeed={0.5}
						minDistance={1.5}
						maxDistance={5}
						maxPolarAngle={Math.PI / 2.1}
					/>

					<SpectralSurface data={data} heightScale={heightScale} />
				</Canvas>
			</Box>

			<Box sx={{ mt: 2, bgcolor: "grey.50", p: 2, borderRadius: 1 }}>
				<Typography variant="body2" color="text.secondary">
					Управление: используйте левую кнопку мыши для вращения, правую для
					перемещения, колесико для масштабирования.
				</Typography>
			</Box>
		</Paper>
	);
};
