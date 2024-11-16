import { useState, useMemo, useCallback, useEffect } from "react";
import { Paper, Typography, Box, Slider, Button } from "@mui/material";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Text } from "@react-three/drei";
import * as THREE from "three";
import DownloadIcon from "@mui/icons-material/Download";
import { SpectrumData } from "../../../types";

interface Enhanced3DVisualizationProps {
	data: SpectrumData;
}

interface SpectralSurfaceProps {
	data: SpectrumData;
	heightScale?: number;
	compression?: number;
	falloff?: number;
}

const GridWithLabels = () => {
	return (
		<>
			<gridHelper
				args={[4, 20]}
				position={[0, -0.01, 0]}
				rotation={[0, 0, 0]}
			/>

			{Array.from({ length: 5 }).map((_, i) => (
				<group key={i}>
					<Text
						position={[i - 2, -0.2, -2]}
						rotation={[-Math.PI / 2, 0, 0]}
						fontSize={0.15}
						color="black"
					>
						{(i * 0.5).toFixed(1)}
					</Text>
					<Text
						position={[-2, -0.2, i - 2]}
						rotation={[-Math.PI / 2, 0, 0]}
						fontSize={0.15}
						color="black"
					>
						{(i * 0.5).toFixed(1)}
					</Text>
				</group>
			))}

			<Text
				position={[2.5, -0.2, -2]}
				rotation={[-Math.PI / 2, 0, 0]}
				fontSize={0.2}
				color="black"
			>
				X
			</Text>
			<Text
				position={[-2, -0.2, 2.5]}
				rotation={[-Math.PI / 2, 0, 0]}
				fontSize={0.2}
				color="black"
			>
				Z
			</Text>
		</>
	);
};

const getColorFromSpectrum = (value: number) => {
	const spectrum = [
		{ pos: 0.0, color: new THREE.Color(0x00ffff) }, // Голубой
		{ pos: 0.1, color: new THREE.Color(0x0080ff) }, // Светло-синий
		{ pos: 0.2, color: new THREE.Color(0x0040ff) }, // Синий
		{ pos: 0.3, color: new THREE.Color(0x8000ff) }, // Фиолетовый
		{ pos: 0.4, color: new THREE.Color(0xff00ff) }, // Пурпурный
		{ pos: 0.5, color: new THREE.Color(0xff0080) }, // Розовый
		{ pos: 0.6, color: new THREE.Color(0xff8000) }, // Оранжевый
		{ pos: 0.7, color: new THREE.Color(0xff4000) }, // Светло-красный
		{ pos: 0.8, color: new THREE.Color(0xff0000) }, // Красный
	];

	// Находим подходящий сегмент спектра
	for (let i = 0; i < spectrum.length - 1; i++) {
		if (value >= spectrum[i].pos && value <= spectrum[i + 1].pos) {
			const t =
				(value - spectrum[i].pos) / (spectrum[i + 1].pos - spectrum[i].pos);
			const color = new THREE.Color();
			color.r =
				spectrum[i].color.r +
				(spectrum[i + 1].color.r - spectrum[i].color.r) * t;
			color.g =
				spectrum[i].color.g +
				(spectrum[i + 1].color.g - spectrum[i].color.g) * t;
			color.b =
				spectrum[i].color.b +
				(spectrum[i + 1].color.b - spectrum[i].color.b) * t;
			return color;
		}
	}
	return spectrum[spectrum.length - 1].color;
};

const SpectralSurface = ({
	data,
	heightScale = 1.5,
	compression = 2.5,
	falloff = 1.5,
}: SpectralSurfaceProps) => {
	const geometry = useMemo(() => {
		const resolution = 150;
		const geometry = new THREE.PlaneGeometry(2, 2, resolution, resolution);
		const positions = geometry.attributes.position.array as Float32Array;
		const colors = new Float32Array(positions.length);

		const maxValue = Math.max(
			...data.rowSpectrum.map((p) => p.value),
			...data.columnSpectrum.map((p) => p.value)
		);

		const createHourglassShape = (x: number, y: number) => {
			const distance = Math.sqrt(x * x + y * y) * compression;
			const base = Math.abs(Math.sin(distance * Math.PI));
			return base * Math.exp(-distance * falloff);
		};

		const getSpectralValue = (x: number, y: number) => {
			const rowPos = (x + 1) * (data.rowSpectrum.length - 1) * 0.5;
			const colPos = (y + 1) * (data.columnSpectrum.length - 1) * 0.5;

			const rowIndex = Math.floor(rowPos);
			const colIndex = Math.floor(colPos);

			const rowFrac = rowPos - rowIndex;
			const colFrac = colPos - colIndex;

			const r1 = data.rowSpectrum[rowIndex]?.value || 0;
			const r2 =
				data.rowSpectrum[Math.min(rowIndex + 1, data.rowSpectrum.length - 1)]
					?.value || 0;
			const c1 = data.columnSpectrum[colIndex]?.value || 0;
			const c2 =
				data.columnSpectrum[
					Math.min(colIndex + 1, data.columnSpectrum.length - 1)
				]?.value || 0;

			const rowValue = r1 + (r2 - r1) * rowFrac;
			const colValue = c1 + (c2 - c1) * colFrac;

			return (rowValue + colValue) / (2 * maxValue);
		};

		for (let i = 0; i < positions.length; i += 3) {
			const x = positions[i];
			const y = positions[i + 1];

			const hourglassShape = createHourglassShape(x, y);
			const spectralValue = getSpectralValue(x, y);
			const combinedValue = spectralValue * hourglassShape;

			positions[i + 2] = Math.pow(combinedValue, 0.8) * heightScale;

			const color = getColorFromSpectrum(combinedValue);

			colors[i] = color.r;
			colors[i + 1] = color.g;
			colors[i + 2] = color.b;
		}

		geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
		geometry.computeVertexNormals();
		return geometry;
	}, [data, heightScale, compression, falloff]);

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

			<GridWithLabels />

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

const Capture = ({ onCapture }: { onCapture: (dataUrl: string) => void }) => {
	const { gl, scene, camera } = useThree();

	useEffect(() => {
		const capture = () => {
			gl.render(scene, camera);
			const dataUrl = gl.domElement.toDataURL("image/png");
			onCapture(dataUrl);
		};
		requestAnimationFrame(capture);
	}, [gl, scene, camera, onCapture]);

	return null;
};

export const Enhanced3DVisualization = ({
	data,
}: Enhanced3DVisualizationProps) => {
	const [heightScale, setHeightScale] = useState(1.5);
	const [compression, setCompression] = useState(2.5);
	const [falloff, setFalloff] = useState(1.5);
	const [isCapturing, setIsCapturing] = useState(false);

	const handleDownload = useCallback(() => {
		setIsCapturing(true);
	}, []);

	const handleCapture = useCallback((dataUrl: string) => {
		const link = document.createElement("a");
		link.href = dataUrl;
		link.download = "visualization.bmp";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		setIsCapturing(false);
	}, []);

	return (
		<Paper sx={{ p: 2 }}>
			<Typography variant="h6" gutterBottom>
				3D нейролингвистический информационный образ источника текстовой
				информации
			</Typography>

			<Box sx={{ display: "flex", gap: 4, mb: 2 }}>
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
				<Box sx={{ width: 200 }}>
					<Typography variant="caption">Сжатие</Typography>
					<Slider
						value={compression}
						onChange={(_, value) => setCompression(value as number)}
						min={1}
						max={4}
						step={0.1}
					/>
				</Box>
				<Box sx={{ width: 200 }}>
					<Typography variant="caption">Затухание</Typography>
					<Slider
						value={falloff}
						onChange={(_, value) => setFalloff(value as number)}
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
					<SpectralSurface
						data={data}
						heightScale={heightScale}
						compression={compression}
						falloff={falloff}
					/>
					{isCapturing && <Capture onCapture={handleCapture} />}
				</Canvas>
			</Box>

			<Box
				sx={{
					mt: 2,
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<Typography variant="body2" color="text.secondary">
					Управление: используйте левую кнопку мыши для вращения, правую для
					перемещения, колесико для масштабирования.
				</Typography>
				<Button
					variant="contained"
					startIcon={<DownloadIcon />}
					onClick={handleDownload}
					disabled={isCapturing}
				>
					{isCapturing ? "Скачивание..." : "Cкачать в формате BMP"}
				</Button>
			</Box>
		</Paper>
	);
};

export default Enhanced3DVisualization;
