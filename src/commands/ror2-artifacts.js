const Discord = require('discord.js');
const Messages = require('../messages');
const Ror2Data = require('../services/ror2-data');
const Canvas = require('canvas');

async function ror2Artifacts(msg) {
	const pickedArtifacts = selectArtifacts(Ror2Data.artifacts);

	if (pickedArtifacts.length <= 0) {
		msg.channel.send("No Artifacts");
		return;
	}

	const attachment = await buildArtifactImage(pickedArtifacts);
	msg.channel.send(attachment);
}
ror2Artifacts.command = 'ror2-artifacts';
ror2Artifacts.helpText = Messages.helpText.ror2Artifacts;
ror2Artifacts.hidden = false;

module.exports = ror2Artifacts;

const artifactCache = {};

function selectArtifacts(artifacts) {
	artifacts = artifacts.map(a => a);
	let amount = Math.floor(Math.random() * (artifacts.length + 1));
	const result = [];
	while (amount > 0) {
		amount -= 1;
		const index = Math.floor(Math.random() * artifacts.length);
		result.push(artifacts[index]);
		artifacts.splice(index, 1);
	}
	return result;
}

async function buildArtifactImage(artifacts) {
	const width = 64 * artifacts.length;
	const canvas = Canvas.createCanvas(width, 64);
	const ctx = canvas.getContext('2d');
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, width, 64);

	for (let i = 0; i < artifacts.length; i += 1) {
		const artifact = artifacts[i];
		let img = artifactCache[artifact.imageUrl];
		if (!img) {
			img = await Canvas.loadImage(artifact.imageUrl);
			artifactCache[artifact.imageUrl] = img;
		}
		ctx.drawImage(img, 64 * i, 0, 64, 64);
	}

	const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'artifacts.png');
	return attachment;
}
