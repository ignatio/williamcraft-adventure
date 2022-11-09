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
            if (currentLevel < 4) {
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
        animation.runImageAnimation(
        zombieSprite,
        assets.animation`myAnim2`,
        500,
        true
        )
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
sprites.onOverlap(SpriteKind.Player, SpriteKind.heart, function (sprite, otherSprite) {
    music.baDing.play()
    otherSprite.destroy(effects.trail, 200)
    otherSprite.vy += -100
    info.changeLifeBy(1)
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (currentLevel == 0) {
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
sprites.onOverlap(SpriteKind.Player, SpriteKind.diamond, function (sprite, otherSprite) {
    music.baDing.play()
    otherSprite.destroy(effects.trail, 200)
    otherSprite.vy += -100
    info.changeScoreBy(1)
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    FacingRight = 0
    FacingLeft = 1
    animation.runImageAnimation(
    mySprite,
    assets.animation`myAnim0`,
    200,
    true
    )
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`myTile3`, function (sprite, location) {
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
controller.right.onEvent(ControllerButtonEvent.Released, function () {
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
})
controller.left.onEvent(ControllerButtonEvent.Released, function () {
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
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.lavablock, function (sprite, otherSprite) {
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
function moveZombie () {
    for (let numOfZombies of sprites.allOfKind(SpriteKind.Zombie)) {
        if (numOfZombies.isHittingTile(CollisionDirection.Left)) {
            numOfZombies.vx = randint(15, 40)
            animation.runImageAnimation(
            numOfZombies,
            assets.animation`myAnim2`,
            500,
            false
            )
            if (Math.percentChance(10)) {
                numOfZombies.sayText("blargh...", 2000, true)
            }
        } else if (numOfZombies.isHittingTile(CollisionDirection.Right)) {
            numOfZombies.vx = randint(-15, -40)
            animation.runImageAnimation(
            numOfZombies,
            assets.animation`myAnim3`,
            500,
            false
            )
            if (Math.percentChance(10)) {
                numOfZombies.sayText("brains...", 2000, true)
            }
        }
    }
}
function spawnDiamonds () {
    for (let value of tiles.getTilesByType(assets.tile`myTile23`)) {
        diamond = sprites.create(assets.image`myImage`, SpriteKind.diamond)
        tiles.placeOnTile(diamond, value)
        if (diamond.tileKindAt(TileDirection.Left, assets.tile`myTile27`)) {
            tiles.setTileAt(value, assets.tile`myTile27`)
        } else {
            tiles.setTileAt(value, assets.tile`transparency16`)
        }
    }
}
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    FacingRight = 1
    FacingLeft = 0
    animation.runImageAnimation(
    mySprite,
    assets.animation`myAnim1`,
    200,
    true
    )
})
function nextLevel () {
    if (currentLevel == 0) {
        titleScreen = sprites.create(assets.image`Title Screen`, SpriteKind.title)
        titleScreen.z = 10
        titleScreen.setVelocity(0, 20)
        scene.setBackgroundColor(6)
        tiles.setCurrentTilemap(tilemap`level8`)
        spawnDiamonds()
        spawnZombies()
    }
    if (currentLevel == 1) {
        scene.setBackgroundColor(6)
        tiles.setCurrentTilemap(tilemap`level5`)
        effects.clouds.startScreenEffect(10000)
        setupLevel()
        game.splash("Collect the diamonds!", "Reach the Flag!")
    } else if (currentLevel == 2) {
        effects.clouds.endScreenEffect()
        scene.setBackgroundColor(6)
        tiles.setCurrentTilemap(tilemap`level0`)
        setupLevel()
        game.splash("Explore the cave!", "The path can turn back!")
    } else if (currentLevel == 3) {
        scene.setBackgroundColor(15)
        tiles.setCurrentTilemap(tilemap`level2`)
        effects.starField.startScreenEffect(900000)
        setupLevel()
        game.splash("Jump!", "Lava Burns!")
    } else if (currentLevel == 4) {
        scene.setBackgroundColor(6)
        tiles.setCurrentTilemap(tilemap`level3`)
        setupLevel()
        game.splash("Climb on up!", "Find the Portal!")
        effects.blizzard.startScreenEffect(100000)
    } else if (currentLevel == 5) {
        scene.setBackgroundColor(6)
        tiles.setCurrentTilemap(tilemap`level6`)
        setupLevel()
        game.splash("Diamonds grow on trees!", "Climb the branches!")
    } else if (currentLevel == 6) {
        scene.setBackgroundColor(6)
        tiles.setCurrentTilemap(tilemap`level`)
        setupLevel()
        game.splash("A Desert Temple!", "Treasure lies beneath!")
    } else {
    	
    }
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`myTile2`, function (sprite, location) {
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
sprites.onOverlap(SpriteKind.Player, SpriteKind.Zombie, function (sprite, otherSprite) {
    if (invulnerable == 0) {
        if (isAttacking == 0) {
            sprite.vx += otherSprite.vx / 2
            music.knock.playUntilDone()
            info.changeLifeBy(-1)
            mySprite.sayText("oof.", invincibleTimer, true)
            pause(invincibleTimer * 2)
        } else {
            music.smallCrash.playUntilDone()
            otherSprite.vx = 0
            otherSprite.sayText("grr...")
            heart = sprites.create(assets.image`myImage1`, SpriteKind.heart)
            heart.setPosition(otherSprite.x, otherSprite.y)
            otherSprite.destroy(effects.spray, 500)
        }
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
    for (let value of tiles.getTilesByType(assets.tile`lavaTile`)) {
        lavablock = sprites.create(assets.image`myImage0`, SpriteKind.lavablock)
        tiles.placeOnTile(lavablock, value)
        tiles.setTileAt(value, assets.tile`transparency16`)
        animation.runImageAnimation(
        lavablock,
        assets.animation`myAnim`,
        1000,
        true
        )
        lavablock.z = 10
    }
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`myTile27`, function (sprite, location) {
    scene.setBackgroundColor(15)
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`myTile28`, function (sprite, location) {
    scene.setBackgroundColor(6)
})
function youWin () {
    game.splash("You're a Winner!")
    game.reset()
}
let lavablock: Sprite = null
let playerStart: tiles.Location = null
let heart: Sprite = null
let titleScreen: Sprite = null
let diamond: Sprite = null
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
