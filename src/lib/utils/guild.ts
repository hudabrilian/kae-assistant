import { Guild, LanguageTag } from '@prisma/client';
import { container } from '@sapphire/framework';
import { getEnumValueFromStringValue } from '../utils';
import { Language } from '../types/enum';

export async function getGuild(guildId: string): Promise<Guild | null> {
	try {
		const guild = await container.prisma.guild.findUnique({
			where: {
				guildId
			}
		});
		return guild;
	} catch (error) {
		container.logger.error(error);
		return null;
	}
}

export async function editGuildLanguage(guildId: string, language: Language): Promise<boolean> {
	try {
		const guild = await container.prisma.guild.update({
			where: {
				guildId
			},
			data: {
				language: getEnumValueFromStringValue(language, LanguageTag)
			}
		});

		return !!guild;
	} catch (error) {
		container.logger.error(error);
		return false;
	}
}
