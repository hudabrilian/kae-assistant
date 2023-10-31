import { Colors, EmbedBuilder, EmbedData } from 'discord.js';

export default class KaeEmbed extends EmbedBuilder {
	public constructor(data?: EmbedData) {
		super(data);
		this.setColor(Colors.Aqua);
	}
}
