define( [ "codemirror", "codemirror/addon/mode/simple" ], function( CodeMirror ) {

  CodeMirror.defineSimpleMode( "commander", {
    start: [
      // Escaped characters
      { regex: /`.?/, token: "hr" },

      // Commander specific
      { regex: /(?:chain|include)\b/, token: "header", sol: true },
      { regex: /(\s*)(default|def|invert|marker|var|void)\b/, token: [ "quote", "header" ], sol: true },
      { regex: /(\s+)([01irc\?!xo]+)(:)/, token: [ null, "quote", "operator" ], sol: true },

      // Commander specific
      { regex: /\$\w+/, token: "variable" },
      { regex: /\^\w+/, token: "variable-2" },
      { regex: /\/\/.*/, token: "comment" },

      // Minecraft Specific
      { regex: /@[aepr]\b/, token: "string" },
      { regex: /(?:item|xp_orb|area_effect_cloud|leash_knot|painting|item_frame|armor_stand|ender_crystal|egg|arrow|snowball|fireball|small_fireball|ender_pearl|eye_of_ender_signal|potion|xp_bottle|wither_skull|fireworks_rocket|spectral_arrow|shulker_bullet|dragon_fireball|llama_spit|tnt|falling_block|commandblock_minecart|boat|minecart|chest_minecart|furnace_minecart|tnt_minecart|hopper_minecart|spawner_minecart|elder_guardian|wither_skeleton|stray|husk|zombie_villager|evocation_illager|vex|vindication_illager|creeper|skeleton|spider|giant|zombie|slime|ghast|zombie_pigman|enderman|cave_spider|silverfish|blaze|magma_cube|ender_dragon|wither|witch|endermite|guardian|shulker|skeleton_horse|zombie_horse|donkey|mule|bat|pig|sheep|cow|chicken|squid|wolf|mooshroom|snowman|ocelot|villager_golem|horse|rabbit|polar_bear|llama|villager|lightning_bolt)\b/,
        token: "property" },
      { regex: /\/?(?:achievement|ban|ban-ip|banlist|blockdata|clear|clone|debug|defaultgamemode|deop|difficulty|effect|enchant|entitydata|execute|fill|gamemode|gamerule|give|help|kick|kill|list|locate|me|msg|op|pardon|pardon-ip|particle|playsound|publish|replaceitem|save-all|save-off|save-on|say|scoreboard|seed|setblock|setidletimeout|setworldspawn|spawnpoint|spreadplayers|stats|stop|stopsound|summon|teleport|tell|tellraw|testfor|testforblock|testforblocks|time|title|toggledownfall|tp|trigger|w|weather|whitelist|worldborder|xp)\b/i,
        token: "keyword" },

      // Numbers
      { regex: /(?:~?-?(?:\.\d+|\d+\.?\d*)[bfs]?|~)/, token: "number" },

      // Ponctuation
      { regex: /[\[\]{}\(\)]/, token: "bracket" },
      { regex: /[\+-/*=%;:]/, token: "operator" },
      // { regex: /:$/, token: "operator", indent: true },

      // Pass
      { regex: /(?:\w+)/ }
    ],
    meta: {
      dontIndentStates: [ "comment" ],
      lineComment: "//"
    }
  } );

} );