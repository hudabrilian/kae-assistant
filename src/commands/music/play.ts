import { ApplyOptions } from '@sapphire/decorators';
import { PermissionFlagsBits } from 'discord.js';
import { JoinCommand } from './join';
import { KaeCommand } from '#structures/commands/KaeCommand';
import KaeEmbed from '#structures/embeds/KaeEmbed';

@ApplyOptions<KaeCommand.Options>({
	description: 'Play a song',
	preconditions: ['GuildOnly', 'UserInVoice'],
	requiredClientPermissions: [PermissionFlagsBits.Connect, PermissionFlagsBits.Speak]
})
export class PlayCommand extends KaeCommand {
	public override registerApplicationCommands(registry: KaeCommand.Registry) {
		registry.registerChatInputCommand((builder) => {
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) => option.setName('query').setDescription('song to play').setRequired(true));
		});
	}

	public override async chatInputRun(interaction: KaeCommand.ChatInputCommandInteraction) {
		await interaction.deferReply();

		const { client, player } = this.container;

		const query = interaction.options.getString('query', true);
		const result = await player.search(query, {
			requestedBy: interaction.user,
			searchEngine: 'auto'
		});

		if (!result || !result.tracks.length)
			return interaction.editReply({
				embeds: [new KaeEmbed().setTitle('No results found').setDescription(`No results found for \`${query}`)]
			});

		const queue = await (client.stores.get('commands').get('join') as JoinCommand).joinChannel(interaction);
		if (!queue) return;

		const entry = queue.tasksQueue.acquire();
		await entry.getTask();

		const type = result.playlist ? 'playlist' : 'song';

		await interaction.editReply({
			embeds: [new KaeEmbed().setTitle('Added to queue').setDescription(`Added **${result.tracks.length} ${type}** to the queue.`)]
		});

		result.playlist ? queue.addTrack(result.tracks) : queue.addTrack(result.tracks[0]);

		try {
			if (!queue.isPlaying()) await queue.node.play();
		} finally {
			queue.tasksQueue.release();
		}

		return;
	}
}
