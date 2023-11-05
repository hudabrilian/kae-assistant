import { KaeCommand } from '#structures/commands/KaeCommand';
import { StatusCode } from '#types/enum';
import { generateEmbed } from '#utils/embed';
import { getGuild } from '#utils/guild';
import { setVerify } from '#utils/verify';
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChannelType,
	MessageActionRowComponentBuilder,
	MessageCreateOptions,
	TextBasedChannel
} from 'discord.js';

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

		if (guild.status !== StatusCode.SUCCESS) return interaction.editReply(guild.message);

		const guildVerify = await setVerify(guild.data!.id, role.id);

		if (guildVerify.status !== StatusCode.SUCCESS) return interaction.editReply(guildVerify.message);

		const guildChannel = interaction.guild!.channels.cache.get(channel.id) as TextBasedChannel;

		let options: MessageCreateOptions = {};
		if (content) options.content = content;
		if (embed) {
			const generatedEmbed = await generateEmbed(embed, interaction);
			if (generatedEmbed.status !== StatusCode.SUCCESS) return interaction.editReply(generatedEmbed.message);
			options.embeds = [generatedEmbed.data!];
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
