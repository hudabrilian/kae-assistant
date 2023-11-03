import { FetchResultTypes, fetch } from '@sapphire/fetch';
import { Status, otakuApiResult } from '../types';
import { container } from '@sapphire/framework';

export async function getImage(reaction: string): Promise<Status<{ url: string }>> {
	try {
		const image = await fetch<otakuApiResult>('https://api.otakugifs.xyz/gif?reaction=' + reaction, FetchResultTypes.JSON);

		return {
			status: 'success',
			data: {
				url: image.url
			}
		};
	} catch (error) {
		container.logger.error(error);
		return {
			status: 'error',
			message: 'Failed to get image'
		};
	}
}
