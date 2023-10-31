import { FetchResultTypes, fetch } from '@sapphire/fetch';
import { otakuApiResult } from '../types';

export async function getImage(reaction: string): Promise<string> {
	const image = await fetch<otakuApiResult>('https://api.otakugifs.xyz/gif?reaction=' + reaction, FetchResultTypes.JSON);
	return image.url;
}
