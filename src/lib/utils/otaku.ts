import { FetchResultTypes, fetch } from '@sapphire/fetch';
import { otakuApiResult } from '../types';
import { container } from '@sapphire/framework';
import { StatusCode } from '../types/enum';
import { Status } from '../types/types';

export async function getImage(reaction: string): Promise<Status<{ url: string }>> {
	try {
		const image = await fetch<otakuApiResult>('https://api.otakugifs.xyz/gif?reaction=' + reaction, FetchResultTypes.JSON);

		return {
			status: StatusCode.SUCCESS,
			data: {
				url: image.url
			}
		};
	} catch (error) {
		container.logger.error(error);
		return {
			status: StatusCode.ERROR,
			message: 'Failed to get image'
		};
	}
}
