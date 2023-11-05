import { getEmbedsByGuildId } from '#lib/utils/embed';
import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { AutocompleteInteraction, type ApplicationCommandOptionChoiceData } from 'discord.js';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Autocomplete
})
export class AutocompleteHandler extends InteractionHandler {
	public override async run(interaction: AutocompleteInteraction, result: ApplicationCommandOptionChoiceData[]) {
		return interaction.respond(result);
	}

	public override async parse(interaction: AutocompleteInteraction) {
		if (interaction.commandId !== '1169531597226246185') return this.none();
		const focusedOption = interaction.options.getFocused(true);
		switch (focusedOption.name) {
			case 'embed': {
				const searchResult = await getEmbedsByGuildId(interaction.guildId!);
				return this.some(searchResult.map((match) => ({ name: match.name, value: match.id })));
			}
			default:
				return this.none();
		}
	}
}
