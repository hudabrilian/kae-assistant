import { ColorResolvable } from 'discord.js';
import { KaeCommand } from '../../../lib/structures/commands/KaeCommand';
import { getEmbedByName, updateEmbed } from '../../../lib/utils/embed';

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

		if (!embedData) return interaction.editReply('Embed not found');

		switch (options) {
			case 'name':
				embedData.name = value === 'null' ? embedName : value;
				break;
			case 'title':
				embedData.title = value === 'null' ? null : value;
				break;
			case 'url':
				embedData.url = value === 'null' ? null : value;
				break;
			case 'author':
				embedData.author = value === 'null' ? null : value;
				break;
			case 'authorIconURL':
				embedData.authorIconURL = value === 'null' ? null : value;
				break;
			case 'authorURL':
				embedData.authorURL = value === 'null' ? null : value;
				break;
			case 'description':
				embedData.description = value === 'null' ? null : value;
				break;
			case 'color':
				embedData.color = value === 'null' ? null : (value as ColorResolvable as string);
				break;
			case 'image':
				embedData.image = value === 'null' ? null : value;
				break;
			case 'footer':
				embedData.footer = value === 'null' ? null : value;
				break;
			case 'footerIconURL':
				embedData.footerIconURL = value === 'null' ? null : value;
				break;
			case 'thumbnail':
				embedData.thumbnail = value === 'null' ? null : value;
				break;
			case 'timestamp':
				embedData.timestamp = value === 'null' ? null : value.toLowerCase() === 'true';
				break;
			default:
				await interaction.reply('Invalid option.');
				return;
		}

		const { id: idEmbed, guildId: guildIdEmbed, ...newEmbedData } = embedData;

		await updateEmbed(idEmbed, newEmbedData);

		return interaction.editReply(`Embed property "${options}" updated to "${value}"`);
	}
}
