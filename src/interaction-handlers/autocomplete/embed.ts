import { getEmbedsByGuildId, getFieldsOnEmbedByName } from '#lib/utils/embed';
import { getFieldByGuildId } from '#lib/utils/field';
import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes, container } from '@sapphire/framework';
import { AutocompleteInteraction, type ApplicationCommandOptionChoiceData } from 'discord.js';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Autocomplete
})
export class AutocompleteHandler extends InteractionHandler {
	public override async run(interaction: AutocompleteInteraction, result: ApplicationCommandOptionChoiceData[]) {
		return interaction.respond(result);
	}

	public override async parse(interaction: AutocompleteInteraction) {
		const appCommandRegistry = container.applicationCommandRegistries.acquire(interaction.commandName);
		if (interaction.commandId !== appCommandRegistry.globalCommandId) return this.none();
		const focusedOption = interaction.options.getFocused(true);
		switch (focusedOption.name) {
			case 'embed': {
				const searchResult = await getEmbedsByGuildId(interaction.guildId!);
				return this.some(searchResult.map((match) => ({ name: match.name, value: match.name })));
			}
			case 'field': {
				const searchResult = await getFieldByGuildId(interaction.guildId!);
				return this.some(searchResult.map((match) => ({ name: match.name, value: match.name })));
			}
			case 'fieldname': {
				const embedName = interaction.options.getString('embed', true);
				const searchResult = await getFieldsOnEmbedByName(embedName);
				return this.some(searchResult.map((match) => ({ name: match.name, value: match.name })));
			}
			default:
				return this.none();
		}
	}
}
