import { ChannelType, TextBasedChannel, parseEmoji } from 'discord.js';
import { KaeCommand } from '../../../../lib/structures/commands/KaeCommand';
import { StatusCode } from '../../../../lib/types/enum';
import { generateEmbed } from '../../../../lib/utils/embed';
import { getGuild } from '../../../../lib/utils/guild';
import { addReactionRole, getReactionRole } from '../../../../lib/utils/role';

export class AddReactionRoleCommand extends KaeCommand {
	public constructor(context: KaeCommand.Context, options: KaeCommand.Options) {
		super(context, {
			...options,
			name: 'add',
			description: 'Add a reaction role',
			preconditions: [],
			registerSubcommmandInGroup: {
				parentCommandName: 'role',
				groupName: 'reaction',
				slashSubcommand: (builder) =>
					builder
						.setName('add')
						.setDescription('Add a reaction role')
						.addRoleOption((input) => input.setName('role').setDescription('Role').setRequired(true))
						.addStringOption((input) => input.setName('emoji').setDescription('Emoji').setRequired(true))
						.addStringOption((input) => input.setName('message').setDescription('Message'))
						.addStringOption((input) => input.setName('embed').setDescription('Embed').setAutocomplete(true))
						.addChannelOption((input) => input.setName('channel').setDescription('Channel').addChannelTypes(ChannelType.GuildText))
			}
		});
	}

	public override async chatInputRun(interaction: KaeCommand.ChatInputCommandInteraction) {
		await interaction.deferReply();

		const role = interaction.options.getRole('role', true);
		const emoji = interaction.options.getString('emoji', true);
		const message = interaction.options.getString('message', false);
		const embed = interaction.options.getString('embed', false);
		const channel = interaction.options.getChannel('channel', false, [ChannelType.GuildText]);

		const parsedEmoji = parseEmoji(emoji);

		if (!parsedEmoji || !parsedEmoji.id) return interaction.editReply('Invalid emoji');

		if (!message && !channel && !embed) return interaction.editReply('You must specify message id, channel, or embed');

		if (!message && !channel) return interaction.editReply('If you not specify message, you must specify channel where message will send');

		if (message && embed) return interaction.editReply("If you specify message, you don't have to specify embed");

		if (message && !channel) return interaction.editReply('If you specify message, you must specify channel where message is located');

		const guild = await getGuild(interaction.guildId!);

		if (guild.status !== StatusCode.SUCCESS) return interaction.editReply(guild.message);

		const isExist = await getReactionRole(role.id, parsedEmoji.id, guild.data!.id);

		if (isExist.status !== StatusCode.NOT_FOUND) return interaction.editReply('Reaction role already exists');

		let messageReaction: string = message as string;

		if (!message && channel) {
			const guildChannel = interaction.guild!.channels.cache.get(channel.id) as TextBasedChannel;

			if (embed) {
				const embedData = await generateEmbed(embed, interaction);

				if (embedData.status !== StatusCode.SUCCESS) return interaction.editReply(embedData.message);

				const sendMessage = await guildChannel.send({ embeds: [embedData.data!] });

				if (!sendMessage) return interaction.editReply('Unable to send message');

				await sendMessage.react(emoji);

				messageReaction = sendMessage.id;
			} else {
				const sendMessage = await guildChannel.send('Reaction roles');

				if (!sendMessage) return interaction.editReply('Unable to send message');

				await sendMessage.react(emoji);

				messageReaction = sendMessage.id;
			}
		} else {
			if (!channel || !message) return interaction.editReply('You must specify message and channel where message is located');

			const messageChannel = interaction.guild!.channels.cache.get(channel.id) as TextBasedChannel;

			if (!messageChannel) return interaction.editReply('Unable to find channel');

			const reactionMessage = await messageChannel.messages.fetch(message).catch(() => {
				return null;
			});

			if (!reactionMessage) return interaction.editReply('Unable to find message');

			await reactionMessage.react(emoji);
		}

		const reactionRole = await addReactionRole(role.id, parsedEmoji.id, guild.data!.id, messageReaction);

		if (reactionRole.status !== StatusCode.SUCCESS) return interaction.editReply(reactionRole.message);

		return interaction.editReply('Reaction role added');
	}
}
