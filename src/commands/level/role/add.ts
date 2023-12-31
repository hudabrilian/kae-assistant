import { KaeCommand } from '#lib/structures/commands/KaeCommand';
import { StatusCode } from '#lib/types/enum';
import { addLevelRole } from '#lib/utils/levelRole';
import { roleMention } from 'discord.js';

export class AddRoleLevelCommand extends KaeCommand {
	public constructor(context: KaeCommand.Context, options: KaeCommand.Options) {
		super(context, {
			...options,
			name: 'add',
			description: 'Add a role level for the guild.',
			preconditions: [],
			registerSubcommmandInGroup: {
				parentCommandName: 'level',
				groupName: 'role',
				slashSubcommand: (builder) =>
					builder
						.setName('add')
						.setDescription('Add a role level for the guild')
						.addRoleOption((input) => input.setName('role').setDescription('The role to add').setRequired(true))
						.addIntegerOption((input) => input.setName('level').setDescription('The level to add').setRequired(true).setMinValue(1))
			}
		});
	}

	public override async chatInputRun(interaction: KaeCommand.ChatInputCommandInteraction) {
		await interaction.deferReply();

		const role = interaction.options.getRole('role', true);
		const level = interaction.options.getInteger('level', true);

		const addRole = await addLevelRole(role.id, level, interaction.guildId!);

		if (addRole.status !== StatusCode.SUCCESS) return interaction.editReply(addRole.message);

		return interaction.editReply(`Added ${roleMention(role.id)} role for level ${level}`);
	}
}
