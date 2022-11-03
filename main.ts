namespace SpriteKind {
    export const diamond = SpriteKind.create()
    export const Zombie = SpriteKind.create()
    export const flag = SpriteKind.create()
    export const lavablock = SpriteKind.create()
    export const sprite = SpriteKind.create()
    export const heart = SpriteKind.create()
}

function setupLevel() {
    
    invulnerable = 0
    sprites.destroyAllSpritesOfKind(SpriteKind.lavablock)
    sprites.destroyAllSpritesOfKind(SpriteKind.Player)
    createPlayer()
    spawnDiamonds()
    spawnZombies()
    spawnLava()
}

//  Touch the flag  h
scene.onOverlapTile(SpriteKind.Player, assets.tile`
        flagRed
    `, function on_overlap_tile(sprite2: Sprite, location: tiles.Location) {
    
    if (info.score() < (currentLevel + 1) * 8) {
        mySprite.sayText("I need more diamonds...", 1000, false)
    } else {
        tiles.setTileAt(tiles.getTileLocation(location.column, location.row), assets.tile`
                flagGreen
            `)
        mySprite.sayText("I did it!", 3000, true)
        sprites.destroyAllSpritesOfKind(SpriteKind.Zombie, effects.spray, 500)
        invulnerable = 1
        music.powerUp.play()
        timer.after(5000, function on_after() {
            
            if (currentLevel < totalLevels) {
                currentLevel += 1
                nextLevel()
            } else {
                music.playMelody("C C - D A A G G ", 120)
                youWin()
            }
            
        })
    }
    
})
function spawnZombies() {
    
    for (let value of tiles.getTilesByType(assets.tile`
        myTile22
    `)) {
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
        animation.runImageAnimation(zombieSprite, assets.animation`
                myAnim2
            `, 500, true)
        tiles.placeOnTile(zombieSprite, value)
        tiles.setTileAt(value, assets.tile`
            transparency16
        `)
        zombieSprite.ay = 400
        zombieSprite.vx = 25
    }
}

controller.B.onEvent(ControllerButtonEvent.Pressed, function on_b_pressed() {
    
    if (isAttacking == 0) {
        isAttacking = 1
        music.pewPew.play()
        if (FacingLeft) {
            animation.runImageAnimation(mySprite, assets.animation`
                myAnim7
            `, 200, false)
            pause(500)
            isAttacking = 0
            animation.runImageAnimation(mySprite, assets.animation`
                myAnim5
            `, 200, true)
        } else if (FacingRight) {
            animation.runImageAnimation(mySprite, assets.animation`
                myAnim6
            `, 200, false)
            pause(500)
            isAttacking = 0
            animation.runImageAnimation(mySprite, assets.animation`
                myAnim4
            `, 200, true)
        }
        
    }
    
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.heart, function on_on_overlap(sprite3: Sprite, otherSprite: Sprite) {
    music.baDing.play()
    otherSprite.destroy(effects.trail, 200)
    otherSprite.vy += -100
    info.changeLifeBy(1)
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function on_a_pressed() {
    if (mySprite.isHittingTile(CollisionDirection.Bottom)) {
        music.footstep.play()
        mySprite.vy = -6 * 30
    }
    
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.diamond, function on_on_overlap2(sprite4: Sprite, otherSprite2: Sprite) {
    music.baDing.play()
    otherSprite2.destroy(effects.trail, 200)
    otherSprite2.vy += -100
    info.changeScoreBy(1)
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function on_left_pressed() {
    
    FacingRight = 0
    FacingLeft = 1
    animation.runImageAnimation(mySprite, assets.animation`
        myAnim0
    `, 200, true)
})
//  Teleportation Portals
scene.onOverlapTile(SpriteKind.Player, assets.tile`
        myTile3
    `, function on_overlap_tile2(sprite5: Sprite, location2: tiles.Location) {
    if (justTeleported == 0) {
        timer.throttle("action", 2000, function on_throttle() {
            
            music.magicWand.playUntilDone()
            justTeleported = 1
            scene.setBackgroundColor(6)
            tiles.placeOnTile(mySprite, tiles.getTilesByType(assets.tile`
                    myTile2
                `)[0])
            mySprite.y += 2
            justTeleported = 0
        })
    }
    
})
controller.right.onEvent(ControllerButtonEvent.Released, function on_right_released() {
    
    FacingRight = 1
    FacingLeft = 0
    if (controller.left.isPressed()) {
        animation.runImageAnimation(mySprite, assets.animation`
            myAnim0
        `, 200, true)
    } else if (isAttacking == 0) {
        animation.runImageAnimation(mySprite, assets.animation`
            myAnim4
        `, 200, true)
    }
    
})
controller.left.onEvent(ControllerButtonEvent.Released, function on_left_released() {
    
    FacingRight = 0
    FacingLeft = 1
    if (controller.right.isPressed()) {
        animation.runImageAnimation(mySprite, assets.animation`
            myAnim1
        `, 200, true)
    } else if (isAttacking == 0) {
        animation.runImageAnimation(mySprite, assets.animation`
            myAnim5
        `, 200, true)
    }
    
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.lavablock, function on_on_overlap3(sprite6: Sprite, otherSprite3: Sprite) {
    
    if (invulnerable == 0) {
        invulnerable = 1
        music.zapped.playUntilDone()
        mySprite.vy = 100
        mySprite.sayText("ARGH!!")
        timer.after(500, function on_after2() {
            info.changeLifeBy(-5)
            if (info.life() <= 0) {
                game.over(false)
            } else {
                game.splash("You Lost 5 hearts!", "Lava Burns.")
                sprites.destroyAllSpritesOfKind(SpriteKind.Zombie, effects.spray, 500)
                nextLevel()
            }
            
        })
    }
    
})
function moveZombie() {
    for (let numOfZombies of sprites.allOfKind(SpriteKind.Zombie)) {
        if (numOfZombies.isHittingTile(CollisionDirection.Left)) {
            numOfZombies.vx = randint(15, 40)
            animation.runImageAnimation(numOfZombies, assets.animation`
                    myAnim2
                `, 500, false)
            if (Math.percentChance(10)) {
                numOfZombies.sayText("blargh...", 2000, true)
            }
            
        } else if (numOfZombies.isHittingTile(CollisionDirection.Right)) {
            numOfZombies.vx = randint(-15, -40)
            animation.runImageAnimation(numOfZombies, assets.animation`
                    myAnim3
                `, 500, false)
            if (Math.percentChance(10)) {
                numOfZombies.sayText("brains...", 2000, true)
            }
            
        }
        
    }
}

function spawnDiamonds() {
    
    for (let value2 of tiles.getTilesByType(assets.tile`
        myTile23
    `)) {
        diamond2 = sprites.create(assets.image`
            myImage
        `, SpriteKind.diamond)
        tiles.placeOnTile(diamond2, value2)
        tiles.setTileAt(value2, assets.tile`
            transparency16
        `)
    }
}

controller.right.onEvent(ControllerButtonEvent.Pressed, function on_right_pressed() {
    
    FacingRight = 1
    FacingLeft = 0
    animation.runImageAnimation(mySprite, assets.animation`
        myAnim1
    `, 200, true)
})
function nextLevel() {
    if (currentLevel == 0) {
        scene.setBackgroundColor(6)
        scene.setBackgroundImage(assets.image`
            myImage1
        `)
        tiles.setCurrentTilemap(tilemap`
            level5
        `)
        effects.clouds.startScreenEffect(10000)
        setupLevel()
        game.splash("Collect the diamonds!", "Reach the Flag!")
        music.startSong(assets.song`
            mySong0
        `, true)
    } else if (currentLevel == 1) {
        effects.clouds.endScreenEffect()
        scene.setBackgroundColor(15)
        tiles.setCurrentTilemap(tilemap`
            level0
        `)
        setupLevel()
        game.splash("Explore the cave!", "The path can turn back!")
    } else if (currentLevel == 2) {
        scene.setBackgroundColor(15)
        tiles.setCurrentTilemap(tilemap`
            level2
        `)
        effects.starField.startScreenEffect(900000)
        setupLevel()
        game.splash("Jump!", "Lava Burns!")
    } else if (currentLevel == 3) {
        scene.setBackgroundColor(6)
        tiles.setCurrentTilemap(tilemap`
            level3
        `)
        setupLevel()
        game.splash("Climb on up!", "Find the Portal!")
        effects.blizzard.startScreenEffect(100000)
    } else if (currentLevel == 4) {
        scene.setBackgroundColor(6)
        tiles.setCurrentTilemap(tilemap`
            level6
        `)
        setupLevel()
        game.splash("Diamonds grow on trees!", "Climb the branches!")
    } else {
        
    }
    
}

scene.onOverlapTile(SpriteKind.Player, assets.tile`
        myTile2
    `, function on_overlap_tile3(sprite7: Sprite, location3: tiles.Location) {
    
    if (justTeleported == 0) {
        timer.throttle("action", 2000, function on_throttle2() {
            
            music.magicWand.playUntilDone()
            justTeleported = 1
            scene.setBackgroundColor(15)
            tiles.placeOnTile(mySprite, tiles.getTilesByType(assets.tile`
                    myTile3
                `)[0])
            mySprite.y += 2
        })
        justTeleported = 0
    }
    
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Zombie, function on_on_overlap4(sprite8: Sprite, otherSprite4: Sprite) {
    
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
            heart2 = sprites.create(assets.image`
                heart
            `, SpriteKind.heart)
            heart2.setPosition(otherSprite4.x, otherSprite4.y)
            otherSprite4.destroy(effects.spray, 500)
        }
        
    }
    
})
function createPlayer() {
    
    mySprite = sprites.create(img`
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
        `, SpriteKind.Player)
    FacingRight = 1
    animation.runImageAnimation(mySprite, assets.animation`
        myAnim4
    `, 200, true)
    mySprite.ay = 400
    controller.moveSprite(mySprite, 100, 0)
    playerStart = tiles.getTilesByType(assets.tile`
        myTile11
    `)[0]
    tiles.placeOnTile(mySprite, playerStart)
    tiles.setTileAt(playerStart, assets.tile`
        transparency16
    `)
    mySprite.setScale(1, ScaleAnchor.Middle)
    mySprite.fx = 20
    mySprite.z = 5
}

function spawnLava() {
    
    for (let value3 of tiles.getTilesByType(assets.tile`
        lavaTile
    `)) {
        lavablock2 = sprites.create(assets.image`
            myImage0
        `, SpriteKind.lavablock)
        tiles.placeOnTile(lavablock2, value3)
        tiles.setTileAt(value3, assets.tile`
            transparency16
        `)
        animation.runImageAnimation(lavablock2, assets.animation`
            myAnim
        `, 1000, true)
        lavablock2.z = 10
    }
}

function youWin() {
    game.splash("You're a Winner!")
    game.reset()
}

let lavablock2 : Sprite = null
let playerStart : tiles.Location = null
let heart2 : Sprite = null
let diamond2 : Sprite = null
let justTeleported = 0
let FacingRight = 0
let FacingLeft = 0
let isAttacking = 0
let zombieSprite : Sprite = null
let mySprite : Sprite = null
let totalLevels = 0
let currentLevel = 0
let invincibleTimer = 0
let invulnerable = 0
info.setLife(10)
invulnerable = 0
invincibleTimer = 1000
currentLevel = 0
totalLevels = 4
nextLevel()
game.onUpdate(function on_on_update() {
    scene.cameraFollowSprite(mySprite)
    moveZombie()
    scroller.scrollBackgroundWithCamera(scroller.CameraScrollMode.OnlyHorizontal)
})
