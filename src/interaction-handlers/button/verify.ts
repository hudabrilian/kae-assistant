import { StatusCode } from '#lib/types/enum';
import { getVerifyByGuildId } from '#lib/utils/verify';
import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { ButtonInteraction, GuildMember } from 'discord.js';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Button,
	name: 'verifyButtonHandler'
})
export class ButtonHandler extends InteractionHandler {
	public override parse(interaction: ButtonInteraction) {
		if (interaction.customId !== 'btn-verify') return this.none();

		return this.some();
	}

	public async run(interaction: ButtonInteraction) {
		const member = interaction.member as GuildMember;
		const guildVerify = await getVerifyByGuildId(interaction.guildId!);

		if (guildVerify.status !== StatusCode.SUCCESS)
			return interaction.reply({
				content: `Error: ${guildVerify.message}`,
				ephemeral: true
			});

		const guildRole = interaction.guild!.roles.cache.find((role) => role.id === guildVerify.data!.role);

		if (!guildRole)
			return interaction.reply({
				content: 'Role is not registered',
				ephemeral: true
			});

		if (member.roles.cache.some((role) => role.id === guildVerify.data!.role))
			return interaction.reply({
				content: 'You already verified',
				ephemeral: true
			});

		await member.roles.add(guildRole);

		return interaction.reply({
			content: ':wave: You have been verified. Have fun! :wave:',
			ephemeral: true
		});
	}
}
