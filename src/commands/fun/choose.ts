import { ApplyOptions } from '@sapphire/decorators';
import { KaeCommand } from '../../lib/structures/commands/KaeCommand';
import KaeEmbed from '../../lib/structures/embeds/KaeEmbed';

@ApplyOptions<KaeCommand.Options>({
	description: 'Select randomly from the list'
})
export class ChooseCommand extends KaeCommand {
	public override registerApplicationCommands(registry: KaeCommand.Registry) {
		registry.registerChatInputCommand((builder) => {
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((input) =>
					input.setName('choices').setDescription("list of choice, split with '|'. (ex. option a|option b )").setRequired(true)
				);
		});
	}

	public override async chatInputRun(interaction: KaeCommand.ChatInputCommandInteraction) {
		await interaction.deferReply();

		const choices = interaction.options.getString('choices', true).split('|');
		const choice = choices[Math.floor(Math.random() * choices.length)];

		return interaction.editReply({
			embeds: [
				new KaeEmbed().setTitle(await this.resolveCommandKey(interaction, 'success.title')).setDescription(
					await this.resolveCommandKey(interaction, 'success.description', {
						replace: {
							choice: choice
						}
					})
				)
			]
		});
	}
}
