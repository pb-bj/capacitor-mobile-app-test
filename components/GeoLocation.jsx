'use client';

import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { useState } from 'react';

export default function GeoLocation() {
	const [location, setLocation] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const requestPermission = async () => {
		try {
			const permission = await Geolocation.requestPermissions();
			return permission.location === 'granted';
		} catch (error) {
			console.error('Permission error:', error);
			return false;
		}
	};

	const getLocation = async () => {
		try {
			setLoading(true);
			setError(null);

			// web fallback
			if (!Capacitor.isNativePlatform()) {
				navigator.geolocation.getCurrentPosition(
					(position) => {
						setLocation({
							lat: position.coords.latitude,
							lng: position.coords.longitude,
							accuracy: position.coords.accuracy,
						});
						setLoading(false);
					},
					(err) => {
						setError('Location access denied on web');
						setLoading(false);
					},
				);
				return;
			}

			// Native Android
			const granted = await requestPermission();
			if (!granted) {
				setError('Location permission denied');
				setLoading(false);
				return;
			}

			const position = await Geolocation.getCurrentPosition({
				enableHighAccuracy: true,
				timeout: 10000,
			});

			setLocation({
				lat: position.coords.latitude,
				lng: position.coords.longitude,
				accuracy: position.coords.accuracy,
			});
		} catch (error) {
			console.error('Location error:', error);
			setError('Failed to get location: ' + error.message);
		} finally {
			setLoading(false);
		}
	};

	const clearLocation = () => {
		setLocation(null);
		setError(null);
	};

	return (
		<div
			style={{
				backgroundColor: '#fff',
				borderRadius: '16px',
				padding: '24px',
				boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
				maxWidth: '400px',
				margin: '0 auto',
			}}
		>
			<h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111', marginBottom: '4px' }}>My Location</h2>
			<p style={{ fontSize: '13px', color: '#888', marginBottom: '24px' }}>
				{Capacitor.isNativePlatform() ? 'Using native GPS' : 'Using browser location'}
			</p>

			{/* Location Result */}
			{location && (
				<div
					style={{
						backgroundColor: '#f0f9ff',
						borderRadius: '12px',
						padding: '16px',
						marginBottom: '16px',
					}}
				>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
						{/* Lat */}
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<span style={{ fontSize: '13px', color: '#888' }}>Latitude</span>
							<span style={{ fontSize: '14px', fontWeight: '600', color: '#111' }}>{location.lat.toFixed(6)}</span>
						</div>

						{/* Lng */}
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<span style={{ fontSize: '13px', color: '#888' }}>Longitude</span>
							<span style={{ fontSize: '14px', fontWeight: '600', color: '#111' }}>{location.lng.toFixed(6)}</span>
						</div>

						{/* Accuracy */}
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<span style={{ fontSize: '13px', color: '#888' }}>Accuracy</span>
							<span style={{ fontSize: '14px', fontWeight: '600', color: '#111' }}>
								±{Math.round(location.accuracy)}m
							</span>
						</div>
					</div>

					{/* Open in Maps */}

					<a
						href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
						target="_blank"
						rel="noopener noreferrer"
						style={{
							display: 'block',
							marginTop: '16px',
							padding: '10px',
							backgroundColor: '#111',
							color: '#fff',
							borderRadius: '50px',
							fontSize: '13px',
							fontWeight: '600',
							textAlign: 'center',
							textDecoration: 'none',
						}}
					>
						Open in Google Maps
					</a>
				</div>
			)}

			{/* Error */}
			{error && (
				<div
					style={{
						backgroundColor: '#fff0f0',
						borderRadius: '12px',
						padding: '14px 16px',
						marginBottom: '16px',
						fontSize: '13px',
						color: '#c62828',
					}}
				>
					⚠️ {error}
				</div>
			)}

			{/* Buttons */}
			<div style={{ display: 'flex', gap: '10px' }}>
				<button
					onClick={getLocation}
					disabled={loading}
					style={{
						flex: 1,
						padding: '13px',
						backgroundColor: loading ? '#888' : '#111',
						color: '#fff',
						border: 'none',
						borderRadius: '50px',
						fontSize: '14px',
						fontWeight: '600',
						cursor: loading ? 'not-allowed' : 'pointer',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						gap: '8px',
					}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
						/>
						<circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth={2} />
					</svg>
					{loading ? 'Getting Location...' : 'Get My Location'}
				</button>

				{location && (
					<button
						onClick={clearLocation}
						style={{
							padding: '13px 20px',
							backgroundColor: '#fff',
							color: '#111',
							border: '2px solid #111',
							borderRadius: '50px',
							fontSize: '14px',
							fontWeight: '600',
							cursor: 'pointer',
						}}
					>
						Clear
					</button>
				)}
			</div>
		</div>
	);
}
