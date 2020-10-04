function risk(msg) {
    const character = pickCharacter(characters)
    const message = characterMessage(character)
    msg.reply(message)
}
risk.command = 'risk'
risk.hidden = false

module.exports = risk

const characters = [
    {
        name: "Commando",
        skills: {
            'primary': [ "Double Tap" ],
            'secondary': [ "Phase Round", "Phase Blast" ],
            'utility': [ "Tactical Dive", "Tactical Slide" ],
            'special': [ "Suppressive Fire", "Frag Grenade" ],
        },
        colors: [ "Default", "Hornet" ],
    },

    {
        name: "Huntress",
        skills: {
            'primary': [ "Strafe", "Flurry" ],
            'secondary': [ "Laser Glaive" ],
            'utility': [ "Blink", "Phase Blink" ],
            'special': [ "Arrow Rain", "Ballista" ],
        },
        colors: [ "Default", "Arctic" ],
    },

    {
        name: "MUL-T",
        skills: {
            'passive': [ "Multifunctional" ],
            'primary-1': [ "Auto-Nailgun", "Rebar Puncher", "Scrap Launcher", "Power-Saw" ],
            'primary-2': [ "Auto-Nailgun", "Rebar Puncher", "Scrap Launcher", "Power-Saw" ],
            'secondary': [ "Blast Canister" ],
            'utility': [ "Transport Mode" ],
            'special': [ "Retool" ],
        },
        colors: [ "Default", "Janitor" ],
    },

    {
        name: "Engineer",
        skills: {
            'primary': [ "Bounching Grenades" ],
            'secondary': [ "Pressure Mines", "Spider Mines" ],
            'utilty': [ "Bubble Shideld", "Thermal Harpoons" ],
            'special': [ "TR12 Gauss Auto-Turret", "TR58 Carbonizer Turret" ],
        },
        colors: [ "Default", "EOD Tech" ],
    },

    {
        name: "Mercenary",
        skills: {
            'passive': [ "Cybernetic Enhancements" ],
            'primary': [ "Laser Sword" ],
            'secondary': [ "Whirlwind", "Rising Thunder" ],
            'utility': [ "Blinding Assault" ],
            'special': [ "Eviscerate", "Slicing Winds" ],
        },
        colors: [ "Default", "Oni" ],
    },

    {
        name: "Artificer",
        skills: {
            'passive': [ "ENV Suit" ],
            'primary': [ "Flame Bolt", "Plasma Bolt" ],
            'secondary': [ "Charged Nano-Bomb", "Cast Nano-Spear" ],
            'utilty': [ "Snapfreeze" ],
            'special': [ "Flamethrower", "Ion Surge" ],
        },
        colors: [ "Default", "Chrome" ],
    },

    {
        name: "Rex",
        skills: {
            'passive': [ "Natural Toxins" ],
            'primary': [ "DIRECTIVE: Inject" ],
            'secondary': [ "Seed Barrage", "DIRECTIVE: Drill" ],
            'utilty': [ "DIRECTIVE: Disperse", "Bramble Volley" ],
            'special': [ "Tangling Growth" ],
        },
        colors: [ "Default", "Smoothie" ],
    },

    {
        name: "Loader",
        skills: {
            'passive': [ "Scrap Barrier" ],
            'primary': [ "Kuckleboom" ],
            'secondary': [ "Grapple Fist", "Spiked Fist" ],
            'utility': [ "Charged Gauntlet", "Thunder Gauntlet" ],
            'special': [ "M551 Pylon" ],
        },
        colors: [ "Default", "Classic" ],
    },

    {
        name: "Acrid",
        skills: {
            'misc': [ "Poison", "Blight" ],
            'primary': [ "Vicious Wounds" ],
            'secondary': [ "Neurotoxin", "Ravenous Bite" ],
            'utility': [ "Caustic Leap", "Frenzied Leap" ],
            'special': [ "Epidemic" ],
        },
        colors: [ "Default", "Albino" ],
    },

    {
        name: "Captain",
        skills: {
            'passive': [ "Defensive Microbots" ],
            'primary': [ "Vulcan Shotgun" ],
            'secondary': [ "Power Tazer" ],
            'utility': [ "Orbital Probe" ],
            'special-1': [ "Beacon: Healing", "Beacon: Shocking", "Beacon: Resupply", "Beacon: Hacking" ],
            'special-2': [ "Beacon: Healing", "Beacon: Shocking", "Beacon: Resupply", "Beacon: Hacking" ],
        },
        colors: [ "Default", "Admiral" ],
    },
]

function pick(arr) {
    if (!Array.isArray(arr)) {
        return null
    }
    const i = Math.floor(Math.random() * arr.length)
    return arr[i]
}

function pickCharacter(characters) {
    const character = pick(characters)
    const color = pick(character.colors)
    const result = { name: character.name, skills: {}, color }
    for (const skillType in character.skills) {
        result.skills[skillType] = pick(character.skills[skillType])
    }
    return result
}

function characterMessage(character) {
    let message = `${character.name}`
    for (const skillType in character.skills) {
        const skill = character.skills[skillType];
        message += `\n  ${skillType}: ${skill}`
    }
    message += `\n  color: ${character.color}`
    return message
}
