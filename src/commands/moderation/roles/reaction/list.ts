import { KaeCommand } from '#structures/commands/KaeCommand';
import KaeEmbed from '#structures/embeds/KaeEmbed';
import { StatusCode } from '#types/enum';
import { getReactionRoles } from '#utils/role';
import { formatEmoji, roleMention } from 'discord.js';

export class ListReactionRoleCommand extends KaeCommand {
	public constructor(context: KaeCommand.Context, options: KaeCommand.Options) {
		super(context, {
			...options,
			name: 'list',
			description: 'List all reaction roles',
			preconditions: [],
			registerSubcommmandInGroup: {
				parentCommandName: 'role',
				groupName: 'reaction',
				slashSubcommand: (builder) => builder.setName('list').setDescription('List all reaction roles')
			}
		});
	}

	public override async chatInputRun(interaction: KaeCommand.ChatInputCommandInteraction) {
		await interaction.deferReply();

		const reactionRoles = await getReactionRoles(interaction.guildId!);

		if (reactionRoles.status !== StatusCode.SUCCESS)
			return interaction.editReply({
				content: reactionRoles.message
			});

		return interaction.editReply({
			embeds: [
				new KaeEmbed().setTitle(`${interaction.guild!.name} reaction roles`).setDescription(
					reactionRoles.data!.length > 0
						? reactionRoles
								.data!.map((role) => {
									const guildRole = interaction.guild!.roles.cache.find((r) => r.id === role.role);
									return `Role ${guildRole ? roleMention(guildRole.id) : 'Unknown'} : ${formatEmoji(role.emoji)}`;
								})
								.join('\n')
						: 'No reaction roles'
				)
			]
		});
	}
}
