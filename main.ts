namespace SpriteKind {
    export const diamond = SpriteKind.create()
    export const Zombie = SpriteKind.create()
    export const flag = SpriteKind.create()
    export const lavablock = SpriteKind.create()
    export const heart = SpriteKind.create()
    export const title = SpriteKind.create()
}
function setupLevel () {
    invulnerable = 0
    sprites.destroyAllSpritesOfKind(SpriteKind.lavablock)
    sprites.destroyAllSpritesOfKind(SpriteKind.Player)
    sprites.destroyAllSpritesOfKind(SpriteKind.title)
    createPlayer()
    spawnDiamonds()
    spawnZombies()
    spawnLava()
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`myTile28`, function (sprite10, location6) {
    scene.setBackgroundColor(6)
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`flagRed`, function (sprite, location) {
    if (info.score() < (currentLevel + 0) * 8) {
        mySprite.sayText("I need more diamonds...", 1000, false)
    } else {
        tiles.setTileAt(tiles.getTileLocation(location.column, location.row), assets.tile`flagGreen`)
        mySprite.sayText("I did it!", 3000, true)
        sprites.destroyAllSpritesOfKind(SpriteKind.Zombie, effects.spray, 500)
        invulnerable = 1
        music.powerUp.play()
        timer.after(5000, function () {
            if (currentLevel < 6) {
                currentLevel += 1
                nextLevel()
            } else {
                music.playMelody("C C - D A A G G ", 120)
                youWin()
            }
        })
    }
})
function spawnZombies () {
    for (let value of tiles.getTilesByType(assets.tile`myTile22`)) {
        zombieSprite = sprites.create(img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, SpriteKind.Zombie)
        if (currentLevel == 6) {
            animation.runImageAnimation(
            zombieSprite,
            assets.animation`myAnim8`,
            500,
            true
            )
        } else {
            animation.runImageAnimation(
            zombieSprite,
            assets.animation`myAnim2`,
            500,
            true
            )
        }
        tiles.placeOnTile(zombieSprite, value)
        if (zombieSprite.tileKindAt(TileDirection.Left, assets.tile`myTile27`)) {
            tiles.setTileAt(value, assets.tile`myTile27`)
        } else {
            tiles.setTileAt(value, assets.tile`transparency16`)
        }
        zombieSprite.ay = 400
        zombieSprite.vx = 25
    }
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (isAttacking == 0) {
        isAttacking = 1
        music.pewPew.play()
        if (FacingLeft) {
            animation.runImageAnimation(
            mySprite,
            assets.animation`myAnim7`,
            200,
            false
            )
            pause(500)
            isAttacking = 0
            animation.runImageAnimation(
            mySprite,
            assets.animation`myAnim5`,
            200,
            true
            )
        } else if (FacingRight) {
            animation.runImageAnimation(
            mySprite,
            assets.animation`myAnim6`,
            200,
            false
            )
            pause(500)
            isAttacking = 0
            animation.runImageAnimation(
            mySprite,
            assets.animation`myAnim4`,
            200,
            true
            )
        }
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.heart, function (sprite2, otherSprite) {
    music.baDing.play()
    otherSprite.destroy(effects.trail, 200)
    otherSprite.vy += -100
    info.changeLifeBy(1)
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`myTile2`, function (sprite7, location4) {
    if (justTeleported == 0) {
        timer.throttle("action", 2000, function () {
            music.magicWand.playUntilDone()
            justTeleported = 1
            scene.setBackgroundColor(15)
            tiles.placeOnTile(mySprite, tiles.getTilesByType(assets.tile`myTile3`)[0])
            mySprite.y += 2
        })
        justTeleported = 0
    }
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (currentLevel == 0) {
        story.cancelAllCutscenes()
        currentLevel = 1
        sprites.destroyAllSpritesOfKind(SpriteKind.Zombie)
        sprites.destroyAllSpritesOfKind(SpriteKind.diamond)
        nextLevel()
    }
    if (mySprite.isHittingTile(CollisionDirection.Bottom)) {
        music.footstep.play()
        mySprite.vy = -6 * 30
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.diamond, function (sprite4, otherSprite2) {
    music.baDing.play()
    otherSprite2.destroy(effects.trail, 200)
    otherSprite2.vy += -100
    info.changeScoreBy(1)
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (currentLevel > 0) {
        FacingRight = 0
        FacingLeft = 1
        animation.runImageAnimation(
        mySprite,
        assets.animation`myAnim0`,
        200,
        true
        )
    }
})
controller.right.onEvent(ControllerButtonEvent.Released, function () {
    if (currentLevel > 0) {
        FacingRight = 1
        FacingLeft = 0
        if (controller.left.isPressed()) {
            animation.runImageAnimation(
            mySprite,
            assets.animation`myAnim0`,
            200,
            true
            )
        } else if (isAttacking == 0) {
            animation.runImageAnimation(
            mySprite,
            assets.animation`myAnim4`,
            200,
            true
            )
        }
    }
})
controller.left.onEvent(ControllerButtonEvent.Released, function () {
    if (currentLevel > 0) {
        FacingRight = 0
        FacingLeft = 1
        if (controller.right.isPressed()) {
            animation.runImageAnimation(
            mySprite,
            assets.animation`myAnim1`,
            200,
            true
            )
        } else if (isAttacking == 0) {
            animation.runImageAnimation(
            mySprite,
            assets.animation`myAnim5`,
            200,
            true
            )
        }
    }
})
scene.onHitWall(SpriteKind.title, function (sprite3, location2) {
    titleScreen.setVelocity(0, 0)
    story.startCutscene(function () {
        story.setPagePauseLength(999999, 999999)
        story.printDialog("Press [A] to Start!", 100, 125, 50, 160, 1, 0, story.TextSpeed.VeryFast)
    })
})
function moveZombie () {
    for (let numOfZombies of sprites.allOfKind(SpriteKind.Zombie)) {
        if (numOfZombies.isHittingTile(CollisionDirection.Left)) {
            numOfZombies.vx = randint(15, 40)
            if (currentLevel == 6) {
                animation.runImageAnimation(
                numOfZombies,
                assets.animation`myAnim8`,
                500,
                true
                )
            } else {
                animation.runImageAnimation(
                numOfZombies,
                assets.animation`myAnim2`,
                500,
                true
                )
            }
            if (Math.percentChance(10)) {
                numOfZombies.sayText("blargh...", 2000, true)
            }
        } else if (numOfZombies.isHittingTile(CollisionDirection.Right)) {
            numOfZombies.vx = randint(-15, -40)
            if (currentLevel == 6) {
                animation.runImageAnimation(
                numOfZombies,
                assets.animation`myAnim9`,
                500,
                true
                )
            } else {
                animation.runImageAnimation(
                numOfZombies,
                assets.animation`myAnim3`,
                500,
                true
                )
            }
            if (Math.percentChance(10)) {
                numOfZombies.sayText("brains...", 2000, true)
            }
        }
    }
}
function spawnDiamonds () {
    for (let value2 of tiles.getTilesByType(assets.tile`myTile23`)) {
        diamond2 = sprites.create(assets.image`myImage`, SpriteKind.diamond)
        tiles.placeOnTile(diamond2, value2)
        if (diamond2.tileKindAt(TileDirection.Left, assets.tile`myTile27`)) {
            tiles.setTileAt(value2, assets.tile`myTile27`)
        } else {
            tiles.setTileAt(value2, assets.tile`transparency16`)
        }
    }
}
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (currentLevel > 0) {
        FacingRight = 1
        FacingLeft = 0
        animation.runImageAnimation(
        mySprite,
        assets.animation`myAnim1`,
        200,
        true
        )
    }
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`myTile3`, function (sprite5, location3) {
    if (justTeleported == 0) {
        timer.throttle("action", 2000, function () {
            music.magicWand.playUntilDone()
            justTeleported = 1
            scene.setBackgroundColor(6)
            tiles.placeOnTile(mySprite, tiles.getTilesByType(assets.tile`myTile2`)[0])
            mySprite.y += 2
            justTeleported = 0
        })
    }
})
function nextLevel () {
    if (currentLevel == 0) {
        showtitle = 0
        titleScreen = sprites.create(assets.image`Title Screen`, SpriteKind.title)
        titleScreen.z = 10
        titleScreen.setVelocity(0, 20)
        scene.setBackgroundColor(6)
        tiles.setCurrentTilemap(tilemap`level8`)
        music.setVolume(80)
        music.startSong(hex`003c000408020302001c00010a006400f401640000040000000000000000000000000005000000320000000800023a3608000c0001380c001400013314001e00013620002800023a3628002c0001382c003400013334003e00013106001c00010a006400f4016400000400000000000000000000000000000000000e000000200002121620004000020d1209012301026400000403780000040a00030100000064000101000004050100000014000401000004050100e001140005010004011400050100c80014000501000000c80004af00000401c80000040a00019600000414000501006400140005010000002c01026400000403780000040a00017800000064000101000004050100000014000401000004050100e001140005010004011400050100c80014000501000000c80004af00000401c80000040a00019600000414000501006400140005010000002c01026400000403780000040a00017800000064000101000004050100000014000401000004050100e001140005010004011400050100c80014000501000000c80004af00000401c80000040a00019600000414000501006400140005010000002c0167000000010001000400050001020800090001000c000d0001021000110001001400150001021800190001001c001d0001022000210001002200230001002400250001022800290001002c002d0001023000310001003400350001023800390001003c003d00020200`, true)
        spawnDiamonds()
        spawnZombies()
    }
    if (currentLevel == 1) {
        scene.setBackgroundColor(6)
        tiles.setCurrentTilemap(tilemap`level5`)
        effects.clouds.startScreenEffect(10000)
        setupLevel()
        music.stopAllSounds()
        game.splash("Collect the diamonds!", "Reach the Flag!")
        music.startSong(hex`003c000408020303001c0001dc00690000045e01000400000000000000000000056400010400002a0000000800012708001000012910001800012a18002000012e20002800012c28003000012a30003e00012c06001c00010a006400f401640000040000000000000000000000000000000000780000000200010f04000600010f08000a00010f0c000e00010f0e001000011410001200010f14001600010f18001a00010f1c001d00010f1d001e00010f1e001f00010f20002200011424002600011428002a0001142c002e00011430003200011434003600011438003a0001143a003c00010f3c003e00011409012301026400000403780000040a00030100000064000101000004050100000014000401000004050100e001140005010004011400050100c80014000501000000c80004af00000401c80000040a00019600000414000501006400140005010000002c01026400000403780000040a00017800000064000101000004050100000014000401000004050100e001140005010004011400050100c80014000501000000c80004af00000401c80000040a00019600000414000501006400140005010000002c01026400000403780000040a00017800000064000101000004050100000014000401000004050100e001140005010004011400050100c80014000501000000c80004af00000401c80000040a00019600000414000501006400140005010000002c0160000000010001000400050001020800090001000c000d0001021000110001001400150001021800190001001c001d0001022000210001002400250001022800290001002c002d0001023000310001003400350001023800390001003c003d000102`, true)
    } else if (currentLevel == 2) {
        effects.clouds.endScreenEffect()
        scene.setBackgroundColor(6)
        tiles.setCurrentTilemap(tilemap`level0`)
        setupLevel()
        music.stopAllSounds()
        game.splash("Explore the cave!", "The path can turn back!")
        music.startSong(hex`003c000408020302001c00010a006400f401640000040000000000000000000000000005000000320000000800023a3608000c0001380c001400013314001e00013620002800023a3628002c0001382c003400013334003e00013106001c00010a006400f4016400000400000000000000000000000000000000000e000000200002121620004000020d1209012301026400000403780000040a00030100000064000101000004050100000014000401000004050100e001140005010004011400050100c80014000501000000c80004af00000401c80000040a00019600000414000501006400140005010000002c01026400000403780000040a00017800000064000101000004050100000014000401000004050100e001140005010004011400050100c80014000501000000c80004af00000401c80000040a00019600000414000501006400140005010000002c01026400000403780000040a00017800000064000101000004050100000014000401000004050100e001140005010004011400050100c80014000501000000c80004af00000401c80000040a00019600000414000501006400140005010000002c0167000000010001000400050001020800090001000c000d0001021000110001001400150001021800190001001c001d0001022000210001002200230001002400250001022800290001002c002d0001023000310001003400350001023800390001003c003d00020200`, true)
    } else if (currentLevel == 3) {
        scene.setBackgroundColor(15)
        tiles.setCurrentTilemap(tilemap`level2`)
        effects.starField.startScreenEffect(900000)
        setupLevel()
        music.stopAllSounds()
        game.splash("Jump!", "Lava Burns!")
        music.startSong(hex`0028000408040303001c0001dc00690000045e01000400000000000000000000056400010400002c0000001c0003252c3020003c0002252940004c0003252c3050005c0002312a60006c0002352e70007c0002312506001c00010a006400f401640000040000000000000000000000000000000000240000002000010d20004000010d40005000010d50006000011260007000011670008000010d09012301026400000403780000040a00030100000064000101000004050100000014000401000004050100e001140005010004011400050100c80014000501000000c80004af00000401c80000040a00019600000414000501006400140005010000002c01026400000403780000040a00017800000064000101000004050100000014000401000004050100e001140005010004011400050100c80014000501000000c80004af00000401c80000040a00019600000414000501006400140005010000002c01026400000403780000040a00017800000064000101000004050100000014000401000004050100e001140005010004011400050100c80014000501000000c80004af00000401c80000040a00019600000414000501006400140005010000002c01c0000000010001020400050001010800090001010c000d0001011000110001011400150001011800190001011c001d0001012000210001022400250001012800290001012c002d0001013000310001013400350001013800390001013c003d0001014000410001024400450001014800490001014c004d0001015000510001025400550001015800590001015c005d0001016000610001026400650001016800690001016c006d0001017000710001027400750001017800790001017c007d000101`, true)
    } else if (currentLevel == 4) {
        scene.setBackgroundColor(6)
        tiles.setCurrentTilemap(tilemap`level3`)
        setupLevel()
        music.stopAllSounds()
        game.splash("Climb on up!", "Find the Portal!")
        effects.blizzard.startScreenEffect(100000)
        music.startSong(hex`003c000408020302001c00010a006400f401640000040000000000000000000000000005000000320000000800023a3608000c0001380c001400013314001e00013620002800023a3628002c0001382c003400013334003e00013106001c00010a006400f4016400000400000000000000000000000000000000000e000000200002121620004000020d1209012301026400000403780000040a00030100000064000101000004050100000014000401000004050100e001140005010004011400050100c80014000501000000c80004af00000401c80000040a00019600000414000501006400140005010000002c01026400000403780000040a00017800000064000101000004050100000014000401000004050100e001140005010004011400050100c80014000501000000c80004af00000401c80000040a00019600000414000501006400140005010000002c01026400000403780000040a00017800000064000101000004050100000014000401000004050100e001140005010004011400050100c80014000501000000c80004af00000401c80000040a00019600000414000501006400140005010000002c0167000000010001000400050001020800090001000c000d0001021000110001001400150001021800190001001c001d0001022000210001002200230001002400250001022800290001002c002d0001023000310001003400350001023800390001003c003d00020200`, true)
    } else if (currentLevel == 5) {
        scene.setBackgroundColor(6)
        tiles.setCurrentTilemap(tilemap`level6`)
        setupLevel()
        music.stopAllSounds()
        game.splash("Diamonds grow on trees!", "Climb the branches!")
        music.startSong(hex`003c000408020303001c0001dc00690000045e01000400000000000000000000056400010400002a0000000800012708001000012910001800012a18002000012e20002800012c28003000012a30003e00012c06001c00010a006400f401640000040000000000000000000000000000000000780000000200010f04000600010f08000a00010f0c000e00010f0e001000011410001200010f14001600010f18001a00010f1c001d00010f1d001e00010f1e001f00010f20002200011424002600011428002a0001142c002e00011430003200011434003600011438003a0001143a003c00010f3c003e00011409012301026400000403780000040a00030100000064000101000004050100000014000401000004050100e001140005010004011400050100c80014000501000000c80004af00000401c80000040a00019600000414000501006400140005010000002c01026400000403780000040a00017800000064000101000004050100000014000401000004050100e001140005010004011400050100c80014000501000000c80004af00000401c80000040a00019600000414000501006400140005010000002c01026400000403780000040a00017800000064000101000004050100000014000401000004050100e001140005010004011400050100c80014000501000000c80004af00000401c80000040a00019600000414000501006400140005010000002c0160000000010001000400050001020800090001000c000d0001021000110001001400150001021800190001001c001d0001022000210001002400250001022800290001002c002d0001023000310001003400350001023800390001003c003d000102`, true)
    } else if (currentLevel == 6) {
        scene.setBackgroundColor(6)
        tiles.setCurrentTilemap(tilemap`level`)
        setupLevel()
        music.stopAllSounds()
        game.splash("A Desert Temple!", "Treasure lies beneath!")
        music.startSong(hex`0028000408040303001c0001dc00690000045e01000400000000000000000000056400010400002c0000001c0003252c3020003c0002252940004c0003252c3050005c0002312a60006c0002352e70007c0002312506001c00010a006400f401640000040000000000000000000000000000000000240000002000010d20004000010d40005000010d50006000011260007000011670008000010d09012301026400000403780000040a00030100000064000101000004050100000014000401000004050100e001140005010004011400050100c80014000501000000c80004af00000401c80000040a00019600000414000501006400140005010000002c01026400000403780000040a00017800000064000101000004050100000014000401000004050100e001140005010004011400050100c80014000501000000c80004af00000401c80000040a00019600000414000501006400140005010000002c01026400000403780000040a00017800000064000101000004050100000014000401000004050100e001140005010004011400050100c80014000501000000c80004af00000401c80000040a00019600000414000501006400140005010000002c01c0000000010001020400050001010800090001010c000d0001011000110001011400150001011800190001011c001d0001012000210001022400250001012800290001012c002d0001013000310001013400350001013800390001013c003d0001014000410001024400450001014800490001014c004d0001015000510001025400550001015800590001015c005d0001016000610001026400650001016800690001016c006d0001017000710001027400750001017800790001017c007d000101`, true)
    } else {
    	
    }
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`myTile27`, function (sprite9, location5) {
    scene.setBackgroundColor(15)
})
controller.combos.attachCombo("DDUU+b", function () {
    currentLevel += -1
    info.setScore(currentLevel * 8 - 8)
    clearLevel()
    nextLevel()
})
controller.combos.attachCombo("DDUD+B", function () {
    currentLevel += 1
    info.setScore(currentLevel * 8 - 8)
    clearLevel()
    nextLevel()
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Zombie, function (sprite8, otherSprite4) {
    if (invulnerable == 0) {
        if (isAttacking == 0) {
            sprite8.vx += otherSprite4.vx / 2
            music.knock.playUntilDone()
            info.changeLifeBy(-1)
            mySprite.sayText("oof.", invincibleTimer, true)
            pause(invincibleTimer * 2)
        } else {
            music.smallCrash.playUntilDone()
            otherSprite4.vx = 0
            otherSprite4.sayText("grr...")
            heart2 = sprites.create(assets.image`myImage1`, SpriteKind.heart)
            heart2.setPosition(otherSprite4.x, otherSprite4.y)
            otherSprite4.destroy(effects.spray, 500)
        }
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.lavablock, function (sprite6, otherSprite3) {
    if (invulnerable == 0) {
        invulnerable = 1
        music.zapped.playUntilDone()
        mySprite.vy = 100
        mySprite.sayText("ARGH!!")
        timer.after(500, function () {
            info.changeLifeBy(-5)
            if (info.life() >= 1) {
                game.splash("You lost 5 hearts.", "Lava Burns.")
                info.setScore((currentLevel - 1) * 8)
                clearLevel()
                nextLevel()
            }
        })
    }
})
function clearLevel () {
    sprites.destroyAllSpritesOfKind(SpriteKind.Zombie)
    sprites.destroyAllSpritesOfKind(SpriteKind.diamond)
    sprites.destroyAllSpritesOfKind(SpriteKind.heart)
    sprites.destroyAllSpritesOfKind(SpriteKind.Player)
}
function createPlayer () {
    mySprite = sprites.create(assets.image`myImage2`, SpriteKind.Player)
    FacingRight = 1
    animation.runImageAnimation(
    mySprite,
    assets.animation`myAnim4`,
    200,
    true
    )
    mySprite.ay = 400
    controller.moveSprite(mySprite, 100, 0)
    playerStart = tiles.getTilesByType(assets.tile`myTile11`)[0]
    tiles.placeOnTile(mySprite, playerStart)
    tiles.setTileAt(playerStart, assets.tile`transparency16`)
    mySprite.setScale(1, ScaleAnchor.Middle)
    mySprite.fx = 20
    mySprite.z = 5
}
function spawnLava () {
    for (let value3 of tiles.getTilesByType(assets.tile`lavaTile`)) {
        lavablock2 = sprites.create(assets.image`myImage0`, SpriteKind.lavablock)
        tiles.placeOnTile(lavablock2, value3)
        tiles.setTileAt(value3, assets.tile`transparency16`)
        animation.runImageAnimation(
        lavablock2,
        assets.animation`myAnim`,
        1000,
        true
        )
        lavablock2.z = 10
    }
}
function youWin () {
    game.splash("You're a Winner!")
    game.reset()
}
let lavablock2: Sprite = null
let playerStart: tiles.Location = null
let heart2: Sprite = null
let showtitle = 0
let diamond2: Sprite = null
let titleScreen: Sprite = null
let justTeleported = 0
let FacingRight = 0
let FacingLeft = 0
let isAttacking = 0
let zombieSprite: Sprite = null
let mySprite: Sprite = null
let currentLevel = 0
let invincibleTimer = 0
let invulnerable = 0
info.setLife(10)
invulnerable = 0
invincibleTimer = 1000
currentLevel = 0
nextLevel()
game.onUpdate(function () {
    if (currentLevel == 0) {
        scene.cameraFollowSprite(titleScreen)
    } else {
        scene.cameraFollowSprite(mySprite)
    }
    moveZombie()
})
