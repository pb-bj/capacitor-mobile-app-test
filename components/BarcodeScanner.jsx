'use client';

import { BarcodeFormat, BarcodeScanner as Scanner } from '@capacitor-mlkit/barcode-scanning';
import { useEffect, useState } from 'react';

export default function BarcodeScanner({ onClose, onResult }) {
	const [scanning, setScanning] = useState(false);
	const [result, setResult] = useState(null);
	const [supported, setSupported] = useState(true);

	useEffect(() => {
		// Check if barcode scanning is supported on this device
		const checkSupport = async () => {
			try {
				const { supported } = await Scanner.isSupported();
				setSupported(supported);

				if (supported) {
					// Install Google MLKit if not already installed
					await Scanner.installGoogleBarcodeScannerModule();
				}
			} catch (error) {
				console.error('Support check error:', error);
			}
		};

		checkSupport();
	}, []);

	const requestPermission = async () => {
		try {
			const { camera } = await Scanner.requestPermissions();
			return camera === 'granted' || camera === 'limited';
		} catch (error) {
			console.error('Permission error:', error);
			return false;
		}
	};

	const startScan = async () => {
		try {
			if (!supported) {
				alert('Barcode scanning is not supported on this device');
				return;
			}

			const granted = await requestPermission();
			if (!granted) {
				alert('Camera permission is required to scan QR codes');
				return;
			}

			setScanning(true);
			setResult(null);

			const { barcodes } = await Scanner.scan({
				formats: [BarcodeFormat.QrCode],
			});

			if (barcodes.length > 0) {
				setResult(barcodes[0].rawValue);
				onResult && onResult(barcodes[0].rawValue);
			}
		} catch (error) {
			console.error('Scan error:', error);
			alert('Scan failed: ' + error.message);
		} finally {
			setScanning(false);
		}
	};

	const reset = () => setResult(null);

	return (
		<div
			style={{
				position: 'fixed',
				inset: 0,
				backgroundColor: 'rgba(0,0,0,0.7)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				zIndex: 999,
				padding: '24px',
			}}
		>
			<div
				style={{
					backgroundColor: '#fff',
					borderRadius: '20px',
					padding: '32px 24px',
					width: '100%',
					maxWidth: '360px',
					textAlign: 'center',
					position: 'relative',
				}}
			>
				{/* Close Button */}
				<button
					onClick={onClose}
					style={{
						position: 'absolute',
						top: '16px',
						right: '16px',
						background: '#f0f0f0',
						border: 'none',
						borderRadius: '50%',
						width: '32px',
						height: '32px',
						cursor: 'pointer',
						fontSize: '16px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					✕
				</button>

				{!supported ? (
					<p style={{ color: 'red', fontSize: '14px' }}>Barcode scanning is not supported on this device.</p>
				) : !result ? (
					<>
						{/* QR Frame */}
						<div
							style={{
								width: '200px',
								height: '200px',
								border: `3px dashed ${scanning ? '#111' : '#ccc'}`,
								borderRadius: '16px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								margin: '0 auto 24px',
								backgroundColor: '#f9f9f9',
								transition: 'border-color 0.3s',
							}}
						>
							{scanning ? (
								<p style={{ color: '#111', fontSize: '14px', fontWeight: '600' }}>Opening Scanner...</p>
							) : (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="70"
									height="70"
									fill="none"
									viewBox="0 0 24 24"
									stroke="#ccc"
									strokeWidth={1.5}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5z"
									/>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"
									/>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.75h.75v.75h-.75v-.75zM16.75 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75H13.5V13.5zM13.5 18.75h.75v.75H13.5v-.75zM18.75 13.5h.75v.75h-.75V13.5zM18.75 18.75h.75v.75h-.75v-.75zM16.5 16.5h.75v.75H16.5V16.5z"
									/>
								</svg>
							)}
						</div>

						<p style={{ color: '#888', fontSize: '13px', marginBottom: '20px' }}>
							Point your camera at a QR code to scan it
						</p>

						<button
							onClick={startScan}
							disabled={scanning}
							style={{
								width: '100%',
								padding: '14px',
								backgroundColor: scanning ? '#888' : '#111',
								color: '#fff',
								border: 'none',
								borderRadius: '50px',
								fontSize: '15px',
								fontWeight: '600',
								cursor: scanning ? 'not-allowed' : 'pointer',
							}}
						>
							{scanning ? 'Opening Scanner...' : 'Start Scan'}
						</button>
					</>
				) : (
					<>
						{/* Success */}
						<div
							style={{
								width: '56px',
								height: '56px',
								backgroundColor: '#e6f4ea',
								borderRadius: '50%',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								margin: '0 auto 16px',
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="28"
								height="28"
								fill="none"
								viewBox="0 0 24 24"
								stroke="#2e7d32"
								strokeWidth={2}
							>
								<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
							</svg>
						</div>

						<h2 style={{ fontSize: '18px', fontWeight: '700', color: '#111', marginBottom: '8px' }}>Scanned!</h2>

						<div
							style={{
								backgroundColor: '#f5f5f5',
								borderRadius: '8px',
								padding: '12px',
								fontSize: '13px',
								color: '#333',
								wordBreak: 'break-all',
								marginBottom: '20px',
							}}
						>
							{result}
						</div>

						<div style={{ display: 'flex', gap: '10px' }}>
							<button
								onClick={reset}
								style={{
									flex: 1,
									padding: '12px',
									backgroundColor: '#fff',
									color: '#111',
									border: '2px solid #111',
									borderRadius: '50px',
									fontSize: '14px',
									fontWeight: '600',
									cursor: 'pointer',
								}}
							>
								Scan Again
							</button>
							<button
								onClick={() => navigator.clipboard.writeText(result)}
								style={{
									flex: 1,
									padding: '12px',
									backgroundColor: '#111',
									color: '#fff',
									border: 'none',
									borderRadius: '50px',
									fontSize: '14px',
									fontWeight: '600',
									cursor: 'pointer',
								}}
							>
								Copy
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
