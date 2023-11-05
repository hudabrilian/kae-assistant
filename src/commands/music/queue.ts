import { KaeCommand } from '#structures/commands/KaeCommand';
import KaeEmbed from '#structures/embeds/KaeEmbed';
import { ApplyOptions } from '@sapphire/decorators';
import { useMainPlayer } from 'discord-player';

@ApplyOptions<KaeCommand.Options>({
	description: 'show the current queue',
	preconditions: ['GuildOnly', 'BotInVoice', 'InSameVoice']
})
export class QueueCommand extends KaeCommand {
	public override registerApplicationCommands(registry: KaeCommand.Registry): void {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description));
	}

	public override async chatInputRun(interaction: KaeCommand.ChatInputCommandInteraction): Promise<any> {
		await interaction.deferReply({ ephemeral: true });

		const player = useMainPlayer();
		const queue = player.nodes.get(interaction.guild!)!;
		const nowPlaying = queue.currentTrack;

		if (!queue.tracks.size && !nowPlaying) {
			return interaction.editReply({
				embeds: [new KaeEmbed().setTitle('Queue').setDescription('The queue is empty.')]
			});
		}

		return interaction.editReply({
			embeds: [
				new KaeEmbed().setTitle('Queue').setFields(
					[
						{
							name: `__Now Playing__`,
							value: `${nowPlaying?.author} | [${nowPlaying?.title}](${nowPlaying?.url}) | \`${nowPlaying?.duration}\``
						},
						{
							name: `__Next queue__`,
							value: queue.tracks
								.map((track, index) => `${index + 1}. ${track.author} | [${track.title}](${track.url}) | \`${track.duration}\``)
								.join('\n')
						}
					].filter((field) => field.value)
				)
			]
		});
	}
}
