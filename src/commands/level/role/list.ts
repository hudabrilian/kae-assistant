import { roleMention } from 'discord.js';
import { KaeCommand } from '../../../lib/structures/commands/KaeCommand';
import KaeEmbed from '../../../lib/structures/embeds/KaeEmbed';
import { getLevelRoles } from '../../../lib/utils/levelRole';
import { StatusCode } from '../../../lib/types/enum';

export class ListRoleLevelCommand extends KaeCommand {
	public constructor(context: KaeCommand.Context, options: KaeCommand.Options) {
		super(context, {
			...options,
			name: 'list',
			description: 'List all role levels',
			preconditions: [],
			registerSubcommmandInGroup: {
				parentCommandName: 'level',
				groupName: 'role',
				slashSubcommand: (builder) => builder.setName('list').setDescription('List all role levels')
			}
		});
	}

	public override async chatInputRun(interaction: KaeCommand.ChatInputCommandInteraction) {
		await interaction.deferReply();

		const roles = await getLevelRoles(interaction.guildId!);

		if (roles.status !== StatusCode.SUCCESS)
			return interaction.editReply({
				embeds: [new KaeEmbed().setTitle('Something went wrong').setDescription(roles.message)]
			});

		return interaction.editReply({
			embeds: [
				new KaeEmbed()
					.setTitle('Role levels')
					.setDescription(
						roles.data!.length > 0
							? roles.data!.map((role) => `Level ${role.level}: ${roleMention(role.role)}`).join('\n')
							: 'No role levels'
					)
			]
		});
	}
}
