import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener } from '@sapphire/framework';
import { MessageReaction, User, userMention } from 'discord.js';
import { StatusCode } from '../../lib/types/enum';
import { getReactionRoleByEmojiId } from '../../lib/utils/role';
import KaeEmbed from '../../lib/structures/embeds/KaeEmbed';

@ApplyOptions<Listener.Options>({
	event: Events.MessageReactionAdd
})
export class RoleReactionListener extends Listener<typeof Events.MessageReactionAdd> {
	public override async run(message: MessageReaction, user: User) {
		if (user.bot) return;

		const emoji = message.emoji.id;

		if (!emoji) return console.log('No emoji');

		const reactionRole = await getReactionRoleByEmojiId(emoji, message.message.guildId!);

		if (reactionRole.status !== StatusCode.SUCCESS) return console.log(emoji, reactionRole.message);

		if (message.message.id !== reactionRole.data!.message) return;

		const guildRole = message.message.guild!.roles.cache.find((role) => role.id === reactionRole.data!.role);

		if (!guildRole)
			return message.message.channel.send({
				content: 'Role is not registered'
			});

		const userGuild = await message.message.guild!.members.fetch({ user });

		if (userGuild.roles.cache.some((role) => role.id === reactionRole.data!.role)) {
			await userGuild.roles.remove(guildRole);

			return user.send({
				embeds: [
					new KaeEmbed()
						.setTitle(`${message.message.guild!.name} reaction role`)
						.setDescription(`${userMention(user.id)} have been removed the role ${guildRole.name}`)
				]
			});
		} else {
			await userGuild.roles.add(guildRole);

			return user.send({
				embeds: [
					new KaeEmbed()
						.setTitle(`${message.message.guild!.name} reaction role`)
						.setDescription(`${userMention(user.id)} have been given the role ${guildRole.name}`)
				]
			});
		}
	}
}
