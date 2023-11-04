import { ApplyOptions } from '@sapphire/decorators';
import { KaeCommand } from '../../lib/structures/commands/KaeCommand';
import KaeEmbed from '../../lib/structures/embeds/KaeEmbed';

@ApplyOptions<KaeCommand.Options>({
	description: 'resume the current song',
	preconditions: ['GuildOnly', 'BotInVoice', 'InSameVoice']
})
export class ResumeCommand extends KaeCommand {
	public override registerApplicationCommands(registry: KaeCommand.Registry): void {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description));
	}

	public override async chatInputRun(interaction: KaeCommand.ChatInputCommandInteraction): Promise<any> {
		await interaction.deferReply({ ephemeral: true });

		const queue = this.container.player.nodes.get(interaction.guild!)!;

		queue.node.setPaused(false);

		return interaction.editReply({
			embeds: [new KaeEmbed().setTitle('Resumed').setDescription(`The current song has been resumed.`)]
		});
	}
}
