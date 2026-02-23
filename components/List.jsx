'use client';

import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import BarcodeScanner from './BarcodeScanner';

export default function List() {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [openCamera, setOpenCamera] = useState(false);
	const [search, setSearch] = useState('');

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const response = await axios.get(`https://fakestoreapi.com/products`);
				if (!response.data) throw new Error('Failed to get data');
				setPosts(response.data);
			} catch (error) {
				console.error('Failed to fetch post', error);
			} finally {
				setLoading(false);
			}
		};
		fetchPosts();
	}, []);

	const filteredPosts = posts.filter(
		(post) =>
			post.title.toLowerCase().includes(search.toLowerCase()) ||
			post.category.toLowerCase().includes(search.toLowerCase()),
	);

	if (loading) {
		return (
			<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
				<p style={{ fontSize: '18px', color: '#888' }}>Loading...</p>
			</div>
		);
	}

	return (
		<div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
			<style>{`
				.product-grid {
					display: grid;
					gap: 24px;
					grid-template-columns: repeat(1, 1fr);
				}
				@media (min-width: 480px) {
					.product-grid {
						grid-template-columns: repeat(2, 1fr);
					}
				}
				@media (min-width: 768px) {
					.product-grid {
						grid-template-columns: repeat(3, 1fr);
					}
				}
				@media (min-width: 1024px) {
					.product-grid {
						grid-template-columns: repeat(4, 1fr);
					}
				}
				.product-card {
					background: #fff;
					border-radius: 12px;
					box-shadow: 0 2px 8px rgba(0,0,0,0.08);
					padding: 16px;
					display: flex;
					flex-direction: column;
					align-items: center;
					gap: 12px;
					transition: transform 0.2s, box-shadow 0.2s;
					cursor: pointer;
				}
				.product-card:hover {
					transform: translateY(-4px);
					box-shadow: 0 8px 20px rgba(0,0,0,0.12);
				}
				.search-input {
					width: 100%;
					padding: 12px 16px 12px 44px;
					border: 2px solid #e0e0e0;
					border-radius: 50px;
					fontSize: 14px;
					outline: none;
					transition: border-color 0.2s;
					backgroundColor: #fff;
					boxSizing: border-box;
				}
				.search-input:focus {
					border-color: #111;
				}
			`}</style>

			<h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '24px', color: '#111' }}>Products</h1>

			<button
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: '8px',
					padding: '12px 20px',
					backgroundColor: '#111',
					color: '#fff',
					border: 'none',
					borderRadius: '50px',
					fontSize: '14px',
					fontWeight: '600',
					cursor: 'pointer',
					whiteSpace: 'nowrap',
					flexShrink: 0,
				}}
			>
				<Link href={'/location'}>map</Link>
			</button>
			{/* Top Bar — Search + Scan Button */}
			<div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '24px' }}>
				{/* Search Input */}
				<div style={{ position: 'relative', flex: 1 }}>
					{/* Search Icon */}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						fill="none"
						viewBox="0 0 24 24"
						stroke="#aaa"
						strokeWidth={2}
						style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
					>
						<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
					</svg>

					<input
						type="text"
						placeholder="Search products or categories..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="search-input"
						style={{
							width: '100%',
							padding: '12px 16px 12px 44px',
							border: '2px solid #e0e0e0',
							borderRadius: '50px',
							fontSize: '14px',
							outline: 'none',
							backgroundColor: '#fff',
							boxSizing: 'border-box',
						}}
					/>

					{/* Clear Button */}
					{search.length > 0 && (
						<button
							onClick={() => setSearch('')}
							style={{
								position: 'absolute',
								right: '14px',
								top: '50%',
								transform: 'translateY(-50%)',
								background: '#f0f0f0',
								border: 'none',
								borderRadius: '50%',
								width: '22px',
								height: '22px',
								cursor: 'pointer',
								fontSize: '12px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							✕
						</button>
					)}
				</div>

				{/* Scan Button */}
				<button
					onClick={() => setOpenCamera(true)}
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: '8px',
						padding: '12px 20px',
						backgroundColor: '#111',
						color: '#fff',
						border: 'none',
						borderRadius: '50px',
						fontSize: '14px',
						fontWeight: '600',
						cursor: 'pointer',
						whiteSpace: 'nowrap',
						flexShrink: 0,
					}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M3 9V6a3 3 0 013-3h3M15 3h3a3 3 0 013 3v3M3 15v3a3 3 0 003 3h3m6 0h3a3 3 0 003-3v-3"
						/>
					</svg>
					Scan
				</button>
			</div>

			{/* Result Count */}
			{search.length > 0 && (
				<p style={{ fontSize: '13px', color: '#888', marginBottom: '16px' }}>
					{filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''} for{' '}
					<strong style={{ color: '#111' }}>"{search}"</strong>
				</p>
			)}

			{openCamera && (
				<BarcodeScanner
					onClose={() => setOpenCamera(false)}
					onResult={(value) => {
						setSearch(value); // auto search with scanned value
						setOpenCamera(false);
					}}
				/>
			)}

			<div className="product-grid">
				{filteredPosts.length > 0 ? (
					filteredPosts.map((post) => (
						<div key={post.id} className="product-card">
							<div
								style={{
									backgroundColor: '#f9f9f9',
									borderRadius: '8px',
									padding: '12px',
									width: '100%',
									display: 'flex',
									justifyContent: 'center',
								}}
							>
								<Image src={post.image} alt={post.title} width={150} height={150} style={{ objectFit: 'contain' }} />
							</div>
							<div style={{ width: '100%' }}>
								<h2
									style={{
										fontSize: '14px',
										fontWeight: '600',
										color: '#222',
										marginBottom: '6px',
										display: '-webkit-box',
										WebkitLineClamp: 2,
										WebkitBoxOrient: 'vertical',
										overflow: 'hidden',
									}}
								>
									{post.title}
								</h2>
								<p style={{ fontSize: '16px', fontWeight: '700', color: '#e44d26' }}>${post.price}</p>
								<span
									style={{
										display: 'inline-block',
										marginTop: '6px',
										fontSize: '11px',
										backgroundColor: '#f0f0f0',
										color: '#555',
										padding: '2px 8px',
										borderRadius: '20px',
										textTransform: 'capitalize',
									}}
								>
									{post.category}
								</span>
							</div>
						</div>
					))
				) : (
					<div
						style={{
							gridColumn: '1 / -1',
							textAlign: 'center',
							padding: '48px 0',
							color: '#888',
						}}
					>
						<p style={{ fontSize: '16px', marginBottom: '8px' }}>No products found</p>
						<p style={{ fontSize: '13px' }}>Try a different search term</p>
					</div>
				)}
			</div>
		</div>
	);
}
