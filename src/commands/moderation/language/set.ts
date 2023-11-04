import { KaeCommand } from '../../../lib/structures/commands/KaeCommand';
import KaeEmbed from '../../../lib/structures/embeds/KaeEmbed';
import { Language, StatusCode } from '../../../lib/types/enum';
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

		if (guild.status !== StatusCode.SUCCESS) {
			return interaction.editReply({
				embeds: [new KaeEmbed().setTitle('Something went wrong').setDescription(guild.message)]
			});
		}

		const language = interaction.options.getString('language', false) as Language;

		const guildLanguage = await editGuildLanguage(interaction.guild!.id, language);

		if (guildLanguage.status !== StatusCode.SUCCESS) {
			return interaction.editReply({
				embeds: [new KaeEmbed().setTitle('Something went wrong').setDescription(guildLanguage.message)]
			});
		}

		return interaction.editReply({
			embeds: [new KaeEmbed().setTitle('Language changed').setDescription(`The language of the bot has been changed to ${language}`)]
		});
	}
}
