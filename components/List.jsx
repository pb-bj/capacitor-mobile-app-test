'use client';

import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import CameraScanner from './CameraScanner';

export default function List() {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [openCamera, setOpenCamera] = useState(false);

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
			`}</style>

			<h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '24px', color: '#111' }}>Products</h1>
			<button style={{}} onClick={() => setOpenCamera(true)}>
				Open Camera
			</button>
			{openCamera && <CameraScanner />}
			<div className="product-grid">
				{posts && posts.length > 0 ? (
					posts.map((post) => (
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
					<div style={{ color: '#888', fontSize: '16px' }}>No products yet</div>
				)}
			</div>
		</div>
	);
}
