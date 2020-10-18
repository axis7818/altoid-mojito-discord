const Discord = require('discord.js');
const Messages = require('../messages');
const Ror2Data = require('../services/ror2-data');

const dio = Ror2Data.items.find((i) => i.name === "Dio\'s Best Friend");

function ror2Survivor(msg) {
	const survivor = pickSurvivor(Ror2Data.survivors);
	const embed = makeSurvivorEmbed(survivor);
	msg.channel.send(embed);
}
ror2Survivor.command = 'ror2-survivor';
ror2Survivor.helpText = Messages.helpText.ror2Survivor;
ror2Survivor.hidden = false;

module.exports = ror2Survivor;

function pick(arr) {
	if (!Array.isArray(arr)) {
		return null;
	}
	const i = Math.floor(Math.random() * arr.length);
	return arr[i];
}

function pickSurvivor(survivors) {
	const survivor = pick(survivors);
	const color = pick(survivor.colors);
	const result = {
		data: JSON.parse(JSON.stringify(survivor)),
		skills: {},
		color,
	};
	for (const [skillType, skills] of Object.entries(survivor.skills)) {
		result.skills[skillType] = pick(skills);
	}
	return result;
}


function makeSurvivorEmbed(survivor) {
	const imageUrl = survivor.data.imageUrl || dio.imageUrl;
	const wikiUrl = survivor.data.wikiUrl || Ror2Data.wiki.survivorsUrl;
	const inline = true;
	const embed = new Discord.MessageEmbed()
		.setColor('#96b1ef')
		.setTitle(survivor.data.name)
		.setURL(wikiUrl)
		.setThumbnail(imageUrl)
	;
	for (const [skillType, skill] of Object.entries(survivor.skills)) {
		embed.addField(skillType, skill, inline);
	}
	embed.addField("color", survivor.color, inline);
	return embed;
}
