@namespace
class SpriteKind:
    diamond = SpriteKind.create()
    Zombie = SpriteKind.create()
    flag = SpriteKind.create()
    lavablock = SpriteKind.create()
    heart = SpriteKind.create()
    title = SpriteKind.create()
def setupLevel():
    global invulnerable
    invulnerable = 0
    sprites.destroy_all_sprites_of_kind(SpriteKind.lavablock)
    sprites.destroy_all_sprites_of_kind(SpriteKind.player)
    sprites.destroy_all_sprites_of_kind(SpriteKind.title)
    createPlayer()
    spawnDiamonds()
    spawnZombies()
    spawnLava()

def on_overlap_tile(sprite, location):
    global invulnerable
    if info.score() < (currentLevel + 0) * 8:
        mySprite.say_text("I need more diamonds...", 1000, False)
    else:
        tiles.set_tile_at(tiles.get_tile_location(location.column, location.row),
            assets.tile("""
                flagGreen
            """))
        mySprite.say_text("I did it!", 3000, True)
        sprites.destroy_all_sprites_of_kind(SpriteKind.Zombie, effects.spray, 500)
        invulnerable = 1
        music.power_up.play()
        
        def on_after():
            global currentLevel
            if currentLevel < 6:
                currentLevel += 1
                nextLevel()
            else:
                music.play_melody("C C - D A A G G ", 120)
                youWin()
        timer.after(5000, on_after)
        
scene.on_overlap_tile(SpriteKind.player,
    assets.tile("""
        flagRed
    """),
    on_overlap_tile)

def spawnZombies():
    global zombieSprite
    for value in tiles.get_tiles_by_type(assets.tile("""
        myTile22
    """)):
        zombieSprite = sprites.create(img("""
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
            """),
            SpriteKind.Zombie)
        if currentLevel == 6:
            animation.run_image_animation(zombieSprite,
                assets.animation("""
                    myAnim8
                """),
                500,
                True)
        else:
            animation.run_image_animation(zombieSprite,
                assets.animation("""
                    myAnim2
                """),
                500,
                True)
        tiles.place_on_tile(zombieSprite, value)
        if zombieSprite.tile_kind_at(TileDirection.LEFT, assets.tile("""
            myTile27
        """)):
            tiles.set_tile_at(value, assets.tile("""
                myTile27
            """))
        else:
            tiles.set_tile_at(value, assets.tile("""
                transparency16
            """))
        zombieSprite.ay = 400
        zombieSprite.vx = 25

def on_b_pressed():
    global isAttacking
    if isAttacking == 0:
        isAttacking = 1
        music.pew_pew.play()
        if FacingLeft:
            animation.run_image_animation(mySprite, assets.animation("""
                myAnim7
            """), 200, False)
            pause(500)
            isAttacking = 0
            animation.run_image_animation(mySprite, assets.animation("""
                myAnim5
            """), 200, True)
        elif FacingRight:
            animation.run_image_animation(mySprite, assets.animation("""
                myAnim6
            """), 200, False)
            pause(500)
            isAttacking = 0
            animation.run_image_animation(mySprite, assets.animation("""
                myAnim4
            """), 200, True)
controller.B.on_event(ControllerButtonEvent.PRESSED, on_b_pressed)

def on_on_overlap(sprite2, otherSprite):
    music.ba_ding.play()
    otherSprite.destroy(effects.trail, 200)
    otherSprite.vy += -100
    info.change_life_by(1)
sprites.on_overlap(SpriteKind.player, SpriteKind.heart, on_on_overlap)

def on_hit_wall(sprite3, location2):
    titleScreen.set_velocity(0, 0)
    
    def on_start_cutscene():
        story.set_page_pause_length(999999, 999999)
        story.print_dialog("Press [A] to Start!",
            100,
            125,
            50,
            160,
            1,
            0,
            story.TextSpeed.VERY_FAST)
    story.start_cutscene(on_start_cutscene)
    
scene.on_hit_wall(SpriteKind.title, on_hit_wall)

def on_a_pressed():
    global currentLevel
    if currentLevel == 0:
        story.cancel_all_cutscenes()
        currentLevel = 1
        sprites.destroy_all_sprites_of_kind(SpriteKind.Zombie)
        sprites.destroy_all_sprites_of_kind(SpriteKind.diamond)
        nextLevel()
    if mySprite.is_hitting_tile(CollisionDirection.BOTTOM):
        music.footstep.play()
        mySprite.vy = -6 * 30
controller.A.on_event(ControllerButtonEvent.PRESSED, on_a_pressed)

def on_on_overlap2(sprite4, otherSprite2):
    music.ba_ding.play()
    otherSprite2.destroy(effects.trail, 200)
    otherSprite2.vy += -100
    info.change_score_by(1)
sprites.on_overlap(SpriteKind.player, SpriteKind.diamond, on_on_overlap2)

def on_left_pressed():
    global FacingRight, FacingLeft
    if currentLevel > 0:
        FacingRight = 0
        FacingLeft = 1
        animation.run_image_animation(mySprite, assets.animation("""
            myAnim0
        """), 200, True)
controller.left.on_event(ControllerButtonEvent.PRESSED, on_left_pressed)

def on_overlap_tile2(sprite5, location3):
    if justTeleported == 0:
        
        def on_throttle():
            global justTeleported
            music.magic_wand.play_until_done()
            justTeleported = 1
            scene.set_background_color(6)
            tiles.place_on_tile(mySprite,
                tiles.get_tiles_by_type(assets.tile("""
                    myTile2
                """))[0])
            mySprite.y += 2
            justTeleported = 0
        timer.throttle("action", 2000, on_throttle)
        
scene.on_overlap_tile(SpriteKind.player,
    assets.tile("""
        myTile3
    """),
    on_overlap_tile2)

def on_right_released():
    global FacingRight, FacingLeft
    if currentLevel > 0:
        FacingRight = 1
        FacingLeft = 0
        if controller.left.is_pressed():
            animation.run_image_animation(mySprite, assets.animation("""
                myAnim0
            """), 200, True)
        elif isAttacking == 0:
            animation.run_image_animation(mySprite, assets.animation("""
                myAnim4
            """), 200, True)
controller.right.on_event(ControllerButtonEvent.RELEASED, on_right_released)

def on_left_released():
    global FacingRight, FacingLeft
    if currentLevel > 0:
        FacingRight = 0
        FacingLeft = 1
        if controller.right.is_pressed():
            animation.run_image_animation(mySprite, assets.animation("""
                myAnim1
            """), 200, True)
        elif isAttacking == 0:
            animation.run_image_animation(mySprite, assets.animation("""
                myAnim5
            """), 200, True)
controller.left.on_event(ControllerButtonEvent.RELEASED, on_left_released)

def on_on_overlap3(sprite6, otherSprite3):
    global invulnerable
    if invulnerable == 0:
        invulnerable = 1
        music.zapped.play_until_done()
        mySprite.vy = 100
        mySprite.say_text("ARGH!!")
        
        def on_after2():
            info.change_life_by(-5)
            if info.life() >= 1:
                game.splash("You lost 5 hearts.", "Lava Burns.")
                info.set_score((currentLevel - 1) * 8)
                clearLevel()
                nextLevel()
        timer.after(500, on_after2)
        
sprites.on_overlap(SpriteKind.player, SpriteKind.lavablock, on_on_overlap3)

def moveZombie():
    for numOfZombies in sprites.all_of_kind(SpriteKind.Zombie):
        if numOfZombies.is_hitting_tile(CollisionDirection.LEFT):
            numOfZombies.vx = randint(15, 40)
            if currentLevel == 6:
                animation.run_image_animation(numOfZombies,
                    assets.animation("""
                        myAnim8
                    """),
                    500,
                    True)
            else:
                animation.run_image_animation(numOfZombies,
                    assets.animation("""
                        myAnim2
                    """),
                    500,
                    True)
            if Math.percent_chance(10):
                numOfZombies.say_text("blargh...", 2000, True)
        elif numOfZombies.is_hitting_tile(CollisionDirection.RIGHT):
            numOfZombies.vx = randint(-15, -40)
            if currentLevel == 6:
                animation.run_image_animation(numOfZombies,
                    assets.animation("""
                        myAnim9
                    """),
                    500,
                    True)
            else:
                animation.run_image_animation(numOfZombies,
                    assets.animation("""
                        myAnim3
                    """),
                    500,
                    True)
            if Math.percent_chance(10):
                numOfZombies.say_text("brains...", 2000, True)
def spawnDiamonds():
    global diamond2
    for value2 in tiles.get_tiles_by_type(assets.tile("""
        myTile23
    """)):
        diamond2 = sprites.create(assets.image("""
            myImage
        """), SpriteKind.diamond)
        tiles.place_on_tile(diamond2, value2)
        if diamond2.tile_kind_at(TileDirection.LEFT, assets.tile("""
            myTile27
        """)):
            tiles.set_tile_at(value2, assets.tile("""
                myTile27
            """))
        else:
            tiles.set_tile_at(value2, assets.tile("""
                transparency16
            """))

def on_right_pressed():
    global FacingRight, FacingLeft
    if currentLevel > 0:
        FacingRight = 1
        FacingLeft = 0
        animation.run_image_animation(mySprite, assets.animation("""
            myAnim1
        """), 200, True)
controller.right.on_event(ControllerButtonEvent.PRESSED, on_right_pressed)

def nextLevel():
    global showtitle, titleScreen
    if currentLevel == 0:
        showtitle = 0
        titleScreen = sprites.create(assets.image("""
            Title Screen
        """), SpriteKind.title)
        titleScreen.z = 10
        titleScreen.set_velocity(0, 20)
        scene.set_background_color(6)
        tiles.set_current_tilemap(tilemap("""
            level8
        """))
        spawnDiamonds()
        spawnZombies()
    if currentLevel == 1:
        scene.set_background_color(6)
        tiles.set_current_tilemap(tilemap("""
            level5
        """))
        effects.clouds.start_screen_effect(10000)
        setupLevel()
        game.splash("Collect the diamonds!", "Reach the Flag!")
    elif currentLevel == 2:
        effects.clouds.end_screen_effect()
        scene.set_background_color(6)
        tiles.set_current_tilemap(tilemap("""
            level0
        """))
        setupLevel()
        game.splash("Explore the cave!", "The path can turn back!")
    elif currentLevel == 3:
        scene.set_background_color(15)
        tiles.set_current_tilemap(tilemap("""
            level2
        """))
        effects.star_field.start_screen_effect(900000)
        setupLevel()
        game.splash("Jump!", "Lava Burns!")
    elif currentLevel == 4:
        scene.set_background_color(6)
        tiles.set_current_tilemap(tilemap("""
            level3
        """))
        setupLevel()
        game.splash("Climb on up!", "Find the Portal!")
        effects.blizzard.start_screen_effect(100000)
    elif currentLevel == 5:
        scene.set_background_color(6)
        tiles.set_current_tilemap(tilemap("""
            level6
        """))
        setupLevel()
        game.splash("Diamonds grow on trees!", "Climb the branches!")
    elif currentLevel == 6:
        scene.set_background_color(6)
        tiles.set_current_tilemap(tilemap("""
            level
        """))
        setupLevel()
        game.splash("A Desert Temple!", "Treasure lies beneath!")
    else:
        pass

def on_overlap_tile3(sprite7, location4):
    global justTeleported
    if justTeleported == 0:
        
        def on_throttle2():
            global justTeleported
            music.magic_wand.play_until_done()
            justTeleported = 1
            scene.set_background_color(15)
            tiles.place_on_tile(mySprite,
                tiles.get_tiles_by_type(assets.tile("""
                    myTile3
                """))[0])
            mySprite.y += 2
        timer.throttle("action", 2000, on_throttle2)
        
        justTeleported = 0
scene.on_overlap_tile(SpriteKind.player,
    assets.tile("""
        myTile2
    """),
    on_overlap_tile3)

def on_combos_attach_combo():
    global currentLevel
    currentLevel += -1
    info.set_score(currentLevel * 8 - 8)
    clearLevel()
    nextLevel()
controller.combos.attach_combo("DDUU+b", on_combos_attach_combo)

def on_on_overlap4(sprite8, otherSprite4):
    global heart2
    if invulnerable == 0:
        if isAttacking == 0:
            sprite8.vx += otherSprite4.vx / 2
            music.knock.play_until_done()
            info.change_life_by(-1)
            mySprite.say_text("oof.", invincibleTimer, True)
            pause(invincibleTimer * 2)
        else:
            music.small_crash.play_until_done()
            otherSprite4.vx = 0
            otherSprite4.say_text("grr...")
            heart2 = sprites.create(assets.image("""
                myImage1
            """), SpriteKind.heart)
            heart2.set_position(otherSprite4.x, otherSprite4.y)
            otherSprite4.destroy(effects.spray, 500)
sprites.on_overlap(SpriteKind.player, SpriteKind.Zombie, on_on_overlap4)

def on_combos_attach_combo2():
    global currentLevel
    currentLevel += 1
    info.set_score(currentLevel * 8 - 8)
    clearLevel()
    nextLevel()
controller.combos.attach_combo("DDUD+B", on_combos_attach_combo2)

def clearLevel():
    sprites.destroy_all_sprites_of_kind(SpriteKind.Zombie)
    sprites.destroy_all_sprites_of_kind(SpriteKind.diamond)
    sprites.destroy_all_sprites_of_kind(SpriteKind.heart)
    sprites.destroy_all_sprites_of_kind(SpriteKind.player)
def createPlayer():
    global mySprite, FacingRight, playerStart
    mySprite = sprites.create(assets.image("""
        myImage2
    """), SpriteKind.player)
    FacingRight = 1
    animation.run_image_animation(mySprite, assets.animation("""
        myAnim4
    """), 200, True)
    mySprite.ay = 400
    controller.move_sprite(mySprite, 100, 0)
    playerStart = tiles.get_tiles_by_type(assets.tile("""
        myTile11
    """))[0]
    tiles.place_on_tile(mySprite, playerStart)
    tiles.set_tile_at(playerStart, assets.tile("""
        transparency16
    """))
    mySprite.set_scale(1, ScaleAnchor.MIDDLE)
    mySprite.fx = 20
    mySprite.z = 5
def spawnLava():
    global lavablock2
    for value3 in tiles.get_tiles_by_type(assets.tile("""
        lavaTile
    """)):
        lavablock2 = sprites.create(assets.image("""
            myImage0
        """), SpriteKind.lavablock)
        tiles.place_on_tile(lavablock2, value3)
        tiles.set_tile_at(value3, assets.tile("""
            transparency16
        """))
        animation.run_image_animation(lavablock2, assets.animation("""
            myAnim
        """), 1000, True)
        lavablock2.z = 10

def on_overlap_tile4(sprite9, location5):
    scene.set_background_color(15)
scene.on_overlap_tile(SpriteKind.player,
    assets.tile("""
        myTile27
    """),
    on_overlap_tile4)

def on_overlap_tile5(sprite10, location6):
    scene.set_background_color(6)
scene.on_overlap_tile(SpriteKind.player,
    assets.tile("""
        myTile28
    """),
    on_overlap_tile5)

def youWin():
    game.splash("You're a Winner!")
    game.reset()
lavablock2: Sprite = None
playerStart: tiles.Location = None
heart2: Sprite = None
showtitle = 0
diamond2: Sprite = None
justTeleported = 0
titleScreen: Sprite = None
FacingRight = 0
FacingLeft = 0
isAttacking = 0
zombieSprite: Sprite = None
mySprite: Sprite = None
currentLevel = 0
invincibleTimer = 0
invulnerable = 0
info.set_life(10)
invulnerable = 0
invincibleTimer = 1000
currentLevel = 0
nextLevel()

def on_on_update():
    if currentLevel == 0:
        scene.camera_follow_sprite(titleScreen)
    else:
        scene.camera_follow_sprite(mySprite)
    moveZombie()
game.on_update(on_on_update)
