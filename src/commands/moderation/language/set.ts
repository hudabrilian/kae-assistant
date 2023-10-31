import { KaeCommand } from '../../../lib/structures/commands/KaeCommand';
import KaeEmbed from '../../../lib/structures/embeds/KaeEmbed';
import { Language } from '../../../lib/types/enum';
import { mapEnumToChoices } from '../../../lib/utils';
import { editGuildLanguage, getGuild } from '../../../lib/utils/guild';

export class SetCommand extends KaeCommand {
	public constructor(context: KaeCommand.Context, options: KaeCommand.Options) {
		super(context, {
			...options,
			preconditions: [],
			registerSubCommand: {
				parentCommandName: 'language',
				slashSubcommand: (builder) =>
					builder
						.setName('set')
						.setDescription('Set bot language in current guild')
						.addStringOption((input) =>
							input
								.setName('language')
								.setDescription('Language')
								.setRequired(true)
								.addChoices(...Object.values(mapEnumToChoices(Language)))
						)
			}
		});
	}

	public override async chatInputRun(interaction: KaeCommand.ChatInputCommandInteraction) {
		await interaction.deferReply();

		const guild = await getGuild(interaction.guild!.id);

		if (!guild) {
			return interaction.editReply({
				embeds: [new KaeEmbed().setTitle('Something went wrong').setDescription('The guild was not found')]
			});
		}

		const language = interaction.options.getString('language', false) as Language;

		const isSuccess = await editGuildLanguage(interaction.guild!.id, language);

		if (!isSuccess) {
			return interaction.editReply({
				embeds: [new KaeEmbed().setTitle('Something went wrong').setDescription('The language was not changed')]
			});
		}

		return interaction.editReply({
			embeds: [new KaeEmbed().setTitle('Language changed').setDescription(`The language of the bot has been changed to ${language}`)]
		});
	}
}
