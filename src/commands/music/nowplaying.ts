import { KaeCommand } from '#structures/commands/KaeCommand';
import KaeEmbed from '#structures/embeds/KaeEmbed';
import { ApplyOptions } from '@sapphire/decorators';
import { stripIndents } from 'common-tags';

@ApplyOptions<KaeCommand.Options>({
	description: 'show the current playing song',
	preconditions: ['GuildOnly', 'BotInVoice', 'InSameVoice']
})
export class NowPlayingCommand extends KaeCommand {
	public override registerApplicationCommands(registry: KaeCommand.Registry): void {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description));
	}

	public override async chatInputRun(interaction: KaeCommand.ChatInputCommandInteraction): Promise<any> {
		await interaction.deferReply({ ephemeral: true });

		const queue = this.container.player.queues.get(interaction.guild!);
		const nowPlaying = queue?.currentTrack;

		if (!nowPlaying)
			return interaction.editReply({
				embeds: [new KaeEmbed().setTitle('Now playing').setDescription('Nothing is currently playing')]
			});

		return interaction.editReply({
			embeds: [
				new KaeEmbed().setTitle('Now playing').setDescription(
					stripIndents`
							[${nowPlaying.title}](${nowPlaying.url})
							${queue!.node.createProgressBar()}

							${nowPlaying.requestedBy?.toString()}
						`
				)
			]
		});
	}
}
