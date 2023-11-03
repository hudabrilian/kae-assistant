import { roleMention } from 'discord.js';
import { KaeCommand } from '../../../lib/structures/commands/KaeCommand';
import { getLevelRole, removeLevelRole } from '../../../lib/utils/levelRole';

export class RemoveRoleLevelCommand extends KaeCommand {
	public constructor(context: KaeCommand.Context, options: KaeCommand.Options) {
		super(context, {
			...options,
			name: 'remove',
			description: 'Remove a role level from guild settings',
			preconditions: [],
			registerSubcommmandInGroup: {
				parentCommandName: 'level',
				groupName: 'role',
				slashSubcommand: (builder) =>
					builder
						.setName('remove')
						.setDescription('Remove a role level from guild settings')
						.addRoleOption((input) => input.setName('role').setDescription('The role to add').setRequired(true))
						.addIntegerOption((input) => input.setName('level').setDescription('The level to add').setRequired(true).setMinValue(1))
			}
		});
	}

	public override async chatInputRun(interaction: KaeCommand.ChatInputCommandInteraction) {
		await interaction.deferReply();

		const role = interaction.options.getRole('role', true);
		const level = interaction.options.getInteger('level', true);

		const guildLevel = await this.container.level.getLevelGuildByGuildId(interaction.guildId!);

		if (!guildLevel) return interaction.editReply('Failed to remove role level. Level guild is not exist');

		const guildLevelRole = await getLevelRole(interaction.guildId!, role.id, level);

		if (!guildLevelRole) return interaction.editReply('Failed to remove role level. Role level is not exist');

		const isSuccess = await removeLevelRole(role.id, level, interaction.guildId!);

		if (!isSuccess) return interaction.editReply('Failed to remove role level');

		return interaction.editReply(`Removed ${roleMention(role.id)} role for level ${level}`);
	}
}
