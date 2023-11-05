import { Guild, LanguageTag } from '@prisma/client';
import { container } from '@sapphire/framework';
import { getEnumValueFromStringValue } from '../utils';
import { Status } from '#lib/types/types';
import { StatusCode, Language } from '#lib/types/enum';

export async function getGuild(guildId: string): Promise<Status<Guild | null>> {
	try {
		const guild = await container.prisma.guild.findUnique({
			where: {
				guildId
			}
		});

		if (!guild) return { status: StatusCode.NOT_FOUND, message: 'Guild not found' };

		return {
			status: StatusCode.SUCCESS,
			data: guild
		};
	} catch (error) {
		container.logger.error(error);
		return {
			status: StatusCode.ERROR,
			message: 'Something went wrong'
		};
	}
}

export async function editGuildLanguage(guildId: string, language: Language): Promise<Status> {
	try {
		await container.prisma.guild.update({
			where: {
				guildId
			},
			data: {
				language: getEnumValueFromStringValue(language, LanguageTag)
			}
		});

		return {
			status: StatusCode.SUCCESS
		};
	} catch (error) {
		container.logger.error(error);
		return {
			status: StatusCode.ERROR,
			message: 'Something went wrong'
		};
	}
}
