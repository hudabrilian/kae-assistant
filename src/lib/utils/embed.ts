import { Embed, Prisma } from '@prisma/client';
import { container } from '@sapphire/framework';
import { APIEmbed, ColorResolvable, EmbedField, GuildMember } from 'discord.js';
import { KaeCommand } from '../structures/commands/KaeCommand';
import KaeEmbed from '../structures/embeds/KaeEmbed';
import { formatText } from './function';

export async function getEmbedsByGuildId(guildId: string): Promise<{ id: string; name: string }[]> {
	try {
		const embeds = await container.prisma.embed.findMany({
			where: {
				guild: {
					guildId
				}
			},
			select: {
				id: true,
				name: true
			}
		});
		return embeds;
	} catch (error) {
		container.logger.error(error);
		return [];
	}
}

export async function getFieldsOnEmbedByName(embedName: string): Promise<{ name: string }[]> {
	try {
		const fields = await container.prisma.embed.findFirst({
			where: {
				name: embedName
			},
			select: {
				fields: {
					select: {
						nameField: true
					}
				}
			}
		});

		return fields!.fields.map((field) => ({
			name: field.nameField
		}));
	} catch (error) {
		container.logger.error(error);
		return [];
	}
}

export async function getEmbedById(embedId: string, guildId: string): Promise<Prisma.EmbedGetPayload<{ include: { fields: true } }> | null> {
	try {
		const embed = await container.prisma.embed.findUnique({
			where: {
				id: embedId,
				guild: {
					guildId
				}
			},
			include: {
				fields: true
			}
		});
		return embed;
	} catch (error) {
		container.logger.error(error);
		return null;
	}
}

export async function getEmbedByName(embedName: string, guildId: string): Promise<Embed | null> {
	try {
		const embed = await container.prisma.embed.findFirst({
			where: {
				name: embedName,
				guild: {
					guildId
				}
			}
		});
		return embed;
	} catch (error) {
		container.logger.error(error);
		return null;
	}
}

export async function createEmbed(embedName: string, guildId: string): Promise<Embed | null> {
	try {
		const embed = await container.prisma.embed.create({
			data: {
				name: embedName,
				guild: {
					connect: {
						guildId
					}
				}
			}
		});
		return embed;
	} catch (error) {
		container.logger.error(error);
		return null;
	}
}

export async function updateEmbed(embedId: string, data: Omit<Embed, 'id' | 'guildId'>): Promise<Embed | null> {
	try {
		const embed = await container.prisma.embed.update({
			where: {
				id: embedId
			},
			data
		});
		return embed;
	} catch (error) {
		container.logger.error(error);
		return null;
	}
}

export async function generateEmbed(embedId: string, interaction: KaeCommand.ChatInputCommandInteraction | GuildMember): Promise<APIEmbed | null> {
	const embedData = await getEmbedById(embedId, interaction.guild!.id!);

	if (!embedData) return null;

	const embed = new KaeEmbed();

	if (embedData.title) embed.setTitle(formatText(embedData.title, interaction));

	if (embedData.url) embed.setURL(embedData.url);

	if (embedData.author || embedData.authorIconURL || embedData.authorURL) {
		var authorIcon = embedData.authorIconURL as string;

		if (embedData.authorIconURL && embedData.authorIconURL === 'user_avatar') {
			authorIcon = interaction.user.displayAvatarURL();
		}

		if (embedData.author && embedData.authorIconURL && embedData.authorURL) {
			embed.setAuthor({
				name: formatText(embedData.author as string, interaction),
				iconURL: authorIcon,
				url: embedData.authorURL as string
			});
		}

		if (embedData.author && !embedData.authorIconURL && !embedData.authorURL) {
			embed.setAuthor({
				name: formatText(embedData.author as string, interaction)
			});
		}

		if (embedData.author && embedData.authorIconURL && !embedData.authorURL) {
			embed.setAuthor({
				name: formatText(embedData.author as string, interaction),
				iconURL: authorIcon
			});
		}

		if (embedData.author && !embedData.authorIconURL && embedData.authorURL) {
			embed.setAuthor({
				name: formatText(embedData.author as string, interaction),
				url: embedData.authorURL as string
			});
		}
	}

	embed.setDescription(embedData.description ? formatText(embedData.description, interaction) : 'Not setting up');

	if (embedData.color) embed.setColor(embedData.color as ColorResolvable);

	if (embedData.footer || embedData.footerIconURL) {
		if (embedData.footer && embedData.footerIconURL) {
			embed.setFooter({
				text: formatText(embedData.footer, interaction),
				iconURL: embedData.footerIconURL
			});
		}

		if (embedData.footer && !embedData.footerIconURL) {
			embed.setFooter({
				text: formatText(embedData.footer, interaction)
			});
		}
	}

	if (embedData.thumbnail) embed.setThumbnail(embedData.thumbnail);

	if (embedData.image) embed.setImage(embedData.image);

	if (embedData.timestamp) embed.setTimestamp(new Date());

	let fields: EmbedField[] = [];
	for (const field of embedData.fields) {
		fields.push({
			name: formatText(field.name as string, interaction),
			value: formatText(field.value as string, interaction),
			inline: field.inline as boolean
		});
	}

	if (fields.length > 0) embed.addFields(fields);

	return embed.toJSON();
}

export async function removeEmbed(embedId: string) {
	try {
		await container.prisma.embed.delete({
			where: {
				id: embedId
			}
		});
	} catch (error) {
		container.logger.error(error);
	}
}

export async function addField(embedId: string, fieldId: string) {
	try {
		await container.prisma.embed.update({
			where: {
				id: embedId
			},
			data: {
				fields: {
					connect: {
						id: fieldId
					}
				}
			}
		});
	} catch (error) {
		container.logger.error(error);
	}
}

export async function removeField(embedId: string, fieldId: string) {
	try {
		await container.prisma.embed.update({
			where: {
				id: embedId
			},
			data: {
				fields: {
					disconnect: {
						id: fieldId
					}
				}
			}
		});
	} catch (error) {
		container.logger.error(error);
	}
}
