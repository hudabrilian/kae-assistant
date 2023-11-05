import { otakuApiResult } from '#lib/types';
import { StatusCode } from '#lib/types/enum';
import { Status } from '#lib/types/types';
import { FetchResultTypes, fetch } from '@sapphire/fetch';
import { container } from '@sapphire/framework';

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
