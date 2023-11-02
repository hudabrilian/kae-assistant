import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChannelType,
	MessageActionRowComponentBuilder,
	MessageCreateOptions,
	TextBasedChannel
} from 'discord.js';
import { KaeCommand } from '../../../lib/structures/commands/KaeCommand';
import { generateEmbed } from '../../../lib/utils/embed';
import { setVerify } from '../../../lib/utils/verify';
import { getGuild } from '../../../lib/utils/guild';

export class SetCommand extends KaeCommand {
	public constructor(context: KaeCommand.Context, options: KaeCommand.Options) {
		super(context, {
			...options,
			preconditions: [],
			registerSubCommand: {
				parentCommandName: 'verify',
				slashSubcommand: (builder) =>
					builder
						.setName('set')
						.setDescription('Setup verify system for guild')
						.addRoleOption((input) => input.setName('role').setDescription('Verified role').setRequired(true))
						.addChannelOption((input) =>
							input
								.setName('channel')
								.setDescription('Channel to send the verify message')
								.setRequired(true)
								.addChannelTypes(ChannelType.GuildText)
						)
						.addStringOption((input) => input.setName('content').setDescription('Message content for verify message'))
						.addStringOption((input) => input.setName('embed').setDescription('Embed for verify message').setAutocomplete(true))
			}
		});
	}

	public override async chatInputRun(interaction: KaeCommand.ChatInputCommandInteraction) {
		await interaction.deferReply();

		const role = interaction.options.getRole('role', true);
		const channel = interaction.options.getChannel('channel', true, [ChannelType.GuildText]);
		const content = interaction.options.getString('content');
		const embed = interaction.options.getString('embed');

		const guild = await getGuild(interaction.guildId!);

		if (!guild) return interaction.editReply('Guild not found');

		const guildVerify = await setVerify(guild.id, role.id);

		if (!guildVerify) return interaction.editReply('Something went wrong');

		const guildChannel = interaction.guild!.channels.cache.get(channel.id) as TextBasedChannel;

		let options: MessageCreateOptions = {};
		if (content) options.content = content;
		if (embed) {
			const generatedEmbed = await generateEmbed(embed, interaction);
			if (!generatedEmbed) return interaction.editReply('Failed to generate embed');
			options.embeds = [generatedEmbed];
		}

		if (!options.content && !options.embeds) return interaction.editReply('You must specify content or embed');

		const btn = new ButtonBuilder()
			.setLabel('Verify')
			.setEmoji('<a:whitecheckmark:979075764668481536>')
			.setStyle(ButtonStyle.Success)
			.setCustomId('btn-verify');

		const buttonRow = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(btn);

		await guildChannel.send({
			...options,
			components: [buttonRow]
		});

		return interaction.editReply('Verify message successfully sent');
	}
}
