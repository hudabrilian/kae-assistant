import { KaeCommand } from '#lib/structures/commands/KaeCommand';
import { GuildMember } from 'discord.js';

export function formatText(
	text: string,
	interaction: KaeCommand.ChatInputCommandInteraction | KaeCommand.ContextMenuCommandInteraction | GuildMember
): string {
	return text
		.replace('{user}', `<@${interaction.user.id}>`)
		.replace('{user_id}', interaction.user.id)
		.replace('{user_tag}', interaction.user.tag)
		.replace('{user_discriminator}', interaction.user.discriminator)
		.replace('{user_displayname}', interaction.user.displayName)
		.replace('{username}', interaction.user.username)
		.replace('{server_name}', interaction.guild!.name)
		.replace('{member_count}', `${interaction.guild!.memberCount}`)
		.replace(/\\n/g, '\n');
}
