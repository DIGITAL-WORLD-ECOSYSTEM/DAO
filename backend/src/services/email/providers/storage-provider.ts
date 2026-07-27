import { StorageProvider } from './provider';
import { R2Bucket } from '@cloudflare/workers-types';

export class R2StorageProvider implements StorageProvider {
	private bucket: R2Bucket;
	private publicUrlBase: string;

	constructor(bucket: R2Bucket, publicUrlBase: string) {
		this.bucket = bucket;
		this.publicUrlBase = publicUrlBase;
	}

	async upload(filename: string, content: Buffer | Uint8Array, mimeType: string): Promise<{ key: string; publicUrl?: string }> {
		const key = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
		
		await this.bucket.put(key, content, {
			httpMetadata: { contentType: mimeType }
		});

		const publicUrl = this.publicUrlBase ? `${this.publicUrlBase}/${key}` : undefined;

		return { key, publicUrl };
	}

	async delete(key: string): Promise<boolean> {
		try {
			await this.bucket.delete(key);
			return true;
		} catch (e) {
			return false;
		}
	}
}
