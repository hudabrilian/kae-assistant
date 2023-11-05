import { KaeCommand } from '#structures/commands/KaeCommand';
import KaeEmbed from '#structures/embeds/KaeEmbed';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<KaeCommand.Options>({
	description: 'skip the current song'
})
export class SkipCommand extends KaeCommand {
	public override registerApplicationCommands(registry: KaeCommand.Registry): void {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description));
	}

	public override async chatInputRun(interaction: KaeCommand.ChatInputCommandInteraction): Promise<any> {
		await interaction.deferReply();

		const queue = this.container.player.nodes.get(interaction.guild!)!;

		queue.node.skip();

		return interaction.editReply({
			embeds: [new KaeEmbed().setTitle('Skipped').setDescription(`The current song has been skipped.`)]
		});
	}
}
