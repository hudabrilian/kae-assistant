import { ColorResolvable } from 'discord.js';
import { KaeCommand } from '../../../lib/structures/commands/KaeCommand';
import { getEmbedByName, updateEmbed } from '../../../lib/utils/embed';
import { StatusCode } from '../../../lib/types/enum';

export class EditCommand extends KaeCommand {
	public constructor(context: KaeCommand.Context, options: KaeCommand.Options) {
		super(context, {
			...options,
			preconditions: [],
			registerSubCommand: {
				parentCommandName: 'embed',
				slashSubcommand: (builder) =>
					builder
						.setName('edit')
						.setDescription('Edit embed')
						.addStringOption((input) => input.setName('embed').setDescription('Embed name').setRequired(true).setAutocomplete(true))
						.addStringOption((input) =>
							input
								.setName('options')
								.setDescription('Embed options')
								.setRequired(true)
								.addChoices(
									{ name: 'Name', value: 'name' },
									{ name: 'Title', value: 'title' },
									{ name: 'URL', value: 'url' },
									{ name: 'Author', value: 'author' },
									{ name: 'Author Icon URL', value: 'authorIconURL' },
									{ name: 'Author URL', value: 'authorURL' },
									{ name: 'Description', value: 'description' },
									{ name: 'Color', value: 'color' },
									{ name: 'Image', value: 'image' },
									{ name: 'Footer', value: 'footer' },
									{ name: 'Footer Icon URL', value: 'footerIconURL' },
									{ name: 'Thumbnail', value: 'thumbnail' },
									{ name: 'Timestamp', value: 'timestamp' }
								)
						)
						.addStringOption((input) => input.setName('value').setDescription('Value').setRequired(true))
			}
		});
	}

	public override async chatInputRun(interaction: KaeCommand.ChatInputCommandInteraction) {
		await interaction.deferReply();

		const embedName = interaction.options.getString('embed', true);
		const options = interaction.options.getString('options', true);
		const value = interaction.options.getString('value', true);

		const embedData = await getEmbedByName(embedName, interaction.guildId!);

		if (embedData.status !== StatusCode.SUCCESS) return interaction.editReply(embedData.message);

		switch (options) {
			case 'name':
				embedData.data!.name = value === 'null' ? embedName : value;
				break;
			case 'title':
				embedData.data!.title = value === 'null' ? null : value;
				break;
			case 'url':
				embedData.data!.url = value === 'null' ? null : value;
				break;
			case 'author':
				embedData.data!.author = value === 'null' ? null : value;
				break;
			case 'authorIconURL':
				embedData.data!.authorIconURL = value === 'null' ? null : value;
				break;
			case 'authorURL':
				embedData.data!.authorURL = value === 'null' ? null : value;
				break;
			case 'description':
				embedData.data!.description = value === 'null' ? null : value;
				break;
			case 'color':
				embedData.data!.color = value === 'null' ? null : (value as ColorResolvable as string);
				break;
			case 'image':
				embedData.data!.image = value === 'null' ? null : value;
				break;
			case 'footer':
				embedData.data!.footer = value === 'null' ? null : value;
				break;
			case 'footerIconURL':
				embedData.data!.footerIconURL = value === 'null' ? null : value;
				break;
			case 'thumbnail':
				embedData.data!.thumbnail = value === 'null' ? null : value;
				break;
			case 'timestamp':
				embedData.data!.timestamp = value === 'null' ? null : value.toLowerCase() === 'true';
				break;
			default:
				await interaction.reply('Invalid option.');
				return;
		}

		const { id: idEmbed, guildId: guildIdEmbed, ...newEmbedData } = embedData.data!;

		const isSuccess = await updateEmbed(idEmbed, newEmbedData);

		if (isSuccess.status !== StatusCode.SUCCESS) return interaction.editReply(isSuccess.message);

		return interaction.editReply(`Embed property "${options}" updated to "${value}"`);
	}
}
